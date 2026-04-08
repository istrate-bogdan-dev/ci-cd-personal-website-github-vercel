# Design Document: AWS Terraform Infrastructure pentru n8n CV Bot

> Data: 2026-04-08
> Status: Aprobat

---

## Scopul

Infrastructură AWS creată 100% prin Terraform (module locale) pentru a hoста n8n self-hosted pe EC2, expus public via CloudFront cu SSL wildcard, acces la instanță exclusiv prin SSM Session Manager.

---

## Decizii de arhitectură

| Decizie | Alegere | Motivație |
|---|---|---|
| Terraform state | Local | Proiect personal, nu necesită colaborare |
| Structură Terraform | Module locale | Control complet, cod explicit |
| Subnet EC2 | Public + SG strict | Evită costul NAT Gateway (~$32/lună) |
| SSL termination | CloudFront + ACM (us-east-1) | Certificat wildcard existent reutilizat |
| CloudFront → EC2 | VPC Origin (HTTP intern) | Fără IP public expus direct |
| Acces la instanță | SSM Session Manager | Fără SSH, fără bastion host |
| Bază de date n8n | SQLite local pe EBS | MVP, conversații nu se persistă după refresh |
| OS | Ubuntu 24.04 LTS | `ami-05852c5f195d545ea` (eu-central-1, x86_64) |

---

## Arhitectura

```
Internet
  └── CloudFront (global edge)
        ├── Certificate ACM *.bogdanistrate.ro (us-east-1)
        ├── Alternate domain: n8n.bogdanistrate.ro
        └── VPC Origin → EC2 Elastic IP (port 80, HTTP intern)
                          └── EC2 t2.micro (eu-central-1a)
                                ├── Docker: n8n (port 5678)
                                ├── Docker: Nginx (port 80 → proxy n8n)
                                ├── SSM Agent (acces fără SSH)
                                └── IAM Role: AmazonSSMManagedInstanceCore

Route53
  └── n8n.bogdanistrate.ro → CNAME → CloudFront domain

IAM User (pentru Vercel)
  └── portfolio-vercel-ssm-reader
        └── ssm:GetParameter pe /portfolio/n8n/internal-key
```

---

## Structura fișierelor Terraform

```
AWS_Terraform/
├── main.tf                   # root module — chiamă toate modulele
├── variables.tf              # toate variabilele cu descrieri și defaults
├── terraform.tfvars          # valorile concrete (gitignored)
├── terraform.tfvars.example  # template fără secrete (în git)
├── outputs.tf                # CloudFront URL, IAM access key, Elastic IP
│
└── modules/
    ├── vpc/
    │   ├── main.tf           # VPC, subnets, IGW, route tables
    │   ├── variables.tf
    │   └── outputs.tf
    ├── ec2/
    │   ├── main.tf           # instanță, EIP, SG, IAM role, user data
    │   ├── variables.tf
    │   ├── outputs.tf
    │   └── user_data.sh      # script boot: Docker + n8n + Nginx
    ├── cloudfront/
    │   ├── main.tf           # distribuție, VPC Origin, cache behaviors
    │   ├── variables.tf
    │   └── outputs.tf
    ├── acm/
    │   ├── main.tf           # cert *.bogdanistrate.ro în us-east-1 + validare R53
    │   ├── variables.tf
    │   └── outputs.tf
    ├── route53/
    │   ├── main.tf           # CNAME n8n.bogdanistrate.ro → CloudFront
    │   ├── variables.tf
    │   └── outputs.tf
    └── iam/
        ├── main.tf           # IAM user Vercel + inline policy SSM
        ├── variables.tf
        └── outputs.tf
```

---

## Rețea — modulul `vpc`

```
VPC CIDR:       10.0.0.0/16
Region:         eu-central-1

Public Subnet A: 10.0.1.0/24 (eu-central-1a) ← EC2 aici
Public Subnet B: 10.0.2.0/24 (eu-central-1b) ← rezervat viitor

Internet Gateway → atașat VPC
Route Table public: 0.0.0.0/0 → IGW
```

---

## EC2 — modulul `ec2`

**Instanța:**
- Tip: `t2.micro`
- AMI: `ami-05852c5f195d545ea` (Ubuntu 24.04 LTS, eu-central-1, x86_64)
- Subnet: public subnet eu-central-1a
- Elastic IP: da (IP fix pentru CloudFront VPC Origin)
- Key pair: none (acces prin SSM)

**Security Group — inbound:**
| Port | Sursă | Scop |
|---|---|---|
| 80 | CloudFront managed prefix list (`com.amazonaws.global.cloudfront.origin-facing`) | HTTP de la CloudFront |
| 443 | CloudFront managed prefix list | HTTPS fallback |

**Security Group — outbound:**
| Port | Destinație | Scop |
|---|---|---|
| All | 0.0.0.0/0 | Docker pull, OpenAI API, updates |

**IAM Role:**
- Policy: `AmazonSSMManagedInstanceCore` (managed)
- Permite SSM Session Manager fără SSH

**User Data (`user_data.sh`):**
```bash
1. apt-get update && apt-get upgrade -y
2. Instalare Docker CE + Docker Compose plugin
3. Activare Docker service
4. Creare /opt/n8n/ cu docker-compose.yml
5. Nginx config: proxy_pass http://n8n:5678
6. docker compose up -d
7. Activare restart: always pe containere
```

**Docker Compose:**
```yaml
services:
  n8n:
    image: n8nio/n8n:latest
    environment:
      - N8N_HOST=${n8n_domain}
      - N8N_PROTOCOL=https
      - N8N_ENCRYPTION_KEY=${n8n_encryption_key}
      - WEBHOOK_URL=https://${n8n_domain}
    volumes:
      - n8n_data:/home/node/.n8n

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - n8n
```

---

## CloudFront — modulul `cloudfront`

- Alternate domain name: `n8n.bogdanistrate.ro`
- ACM Certificate: ARN din modulul `acm` (us-east-1)
- Origin: VPC Origin → EC2 Elastic IP, port 80, HTTP
- Default cache behavior: no cache (aplicație dinamică)
- `/webhook/*` behavior: forward ALL headers, no cache, TTL 0

---

## ACM — modulul `acm`

- Provider alias: `us-east-1` (CloudFront necesită cert în us-east-1)
- Domain: `*.bogdanistrate.ro`
- Validare: DNS via Route53 (CNAME record creat automat)

> Certificatul existent (`eu-central-1`) nu poate fi folosit cu CloudFront.
> Terraform creează unul nou în `us-east-1`.

---

## Route53 — modulul `route53`

- Hosted zone: `bogdanistrate.ro` (existentă, referențiată prin `data source`)
- Record: `n8n.bogdanistrate.ro` → CNAME → CloudFront domain name

---

## IAM — modulul `iam`

**IAM User `portfolio-vercel-ssm-reader`:**
```json
{
  "Effect": "Allow",
  "Action": ["ssm:GetParameter"],
  "Resource": "arn:aws:ssm:eu-central-1:*:parameter/portfolio/n8n/internal-key"
}
```
- Access Key generat și exportat ca output Terraform (o singură dată)
- Folosit de Vercel pentru a citi secretul la runtime

---

## Variabile principale (`variables.tf`)

| Variabilă | Tip | Descriere |
|---|---|---|
| `aws_region` | string | `eu-central-1` |
| `ami_id` | string | `ami-05852c5f195d545ea` |
| `instance_type` | string | `t2.micro` |
| `vpc_cidr` | string | `10.0.0.0/16` |
| `public_subnet_a_cidr` | string | `10.0.1.0/24` |
| `public_subnet_b_cidr` | string | `10.0.2.0/24` |
| `n8n_domain` | string | `n8n.bogdanistrate.ro` |
| `root_domain` | string | `bogdanistrate.ro` |
| `n8n_encryption_key` | string (sensitive) | Cheie random pentru n8n |
| `project_name` | string | `portfolio-n8n` |
| `environment` | string | `prod` |

---

## Outputuri (`outputs.tf`)

| Output | Descriere |
|---|---|
| `cloudfront_domain` | Domain-ul CloudFront (pentru debug) |
| `ec2_elastic_ip` | IP-ul fix al instanței |
| `iam_access_key_id` | Access Key pentru Vercel |
| `iam_secret_access_key` | Secret Key pentru Vercel (sensitive) |
| `n8n_url` | `https://n8n.bogdanistrate.ro` |

---

## Ce NU face Terraform (manual după deploy)

1. **SSM Parameter Store** — `/portfolio/n8n/internal-key` creat manual cu valoarea secretă
2. **n8n Workflow** — configurat manual în UI n8n (webhook + AI Agent + system prompt)
3. **Vercel Environment Variables** — `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` adăugate manual din outputurile Terraform

---

## Ordine de deployment

```
1. terraform apply module.acm      → certificat + validare DNS (poate dura 5-10 min)
2. terraform apply module.vpc      → rețea
3. terraform apply module.ec2      → instanță + user data (~3 min boot)
4. terraform apply module.cloudfront → distribuție (~5-10 min propagare)
5. terraform apply module.route53  → DNS record
6. terraform apply module.iam      → user Vercel + access key
```

Sau simplu: `terraform apply` — Terraform rezolvă ordinea singur prin dependențe.

---

## Cost estimat lunar

| Resursă | Cost |
|---|---|
| EC2 t2.micro (free tier 12 luni) | $0 / ~$8.50 după |
| Elastic IP (atașat la instanță) | $0 |
| CloudFront (free tier: 1TB/lună) | ~$0 |
| ACM Certificate | $0 |
| Route53 hosted zone | $0.50 |
| SSM Session Manager | $0 |
| **Total** | **~$0.50/lună** (în free tier) |
