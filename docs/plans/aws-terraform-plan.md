# AWS Terraform Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crea infrastructura AWS completă (VPC, EC2, CloudFront, ACM, Route53, IAM) prin Terraform cu module locale, pentru a hoста n8n self-hosted accesibil la `https://n8n.bogdanistrate.ro`.

**Architecture:** EC2 t2.micro în public subnet eu-central-1a cu Security Group care permite inbound doar de la CloudFront prefix list. CloudFront cu VPC Origin termină SSL folosind un certificat ACM wildcard `*.bogdanistrate.ro` emis în us-east-1. Acces la instanță exclusiv prin SSM Session Manager (fără SSH).

**Tech Stack:** Terraform ~> 1.7, AWS Provider ~> 5.0, Ubuntu 24.04 LTS, Docker, n8n, Nginx

---

## Structura fișierelor

```
AWS_Terraform/
├── main.tf
├── variables.tf
├── terraform.tfvars          # gitignored
├── terraform.tfvars.example
├── outputs.tf
└── modules/
    ├── vpc/
    │   ├── main.tf
    │   ├── variables.tf
    │   └── outputs.tf
    ├── ec2/
    │   ├── main.tf
    │   ├── variables.tf
    │   ├── outputs.tf
    │   └── user_data.sh
    ├── cloudfront/
    │   ├── main.tf
    │   ├── variables.tf
    │   └── outputs.tf
    ├── acm/
    │   ├── main.tf
    │   ├── variables.tf
    │   └── outputs.tf
    ├── route53/
    │   ├── main.tf
    │   ├── variables.tf
    │   └── outputs.tf
    └── iam/
        ├── main.tf
        ├── variables.tf
        └── outputs.tf
```

---

## Task 1: Scaffold root + .gitignore

**Files:**
- Create: `AWS_Terraform/.gitignore`
- Create: `AWS_Terraform/variables.tf`
- Create: `AWS_Terraform/terraform.tfvars.example`

- [ ] **Step 1: Creează folderul și .gitignore**

```bash
mkdir -p AWS_Terraform/modules/{vpc,ec2,cloudfront,acm,route53,iam}
```

Creează `AWS_Terraform/.gitignore`:
```
terraform.tfvars
.terraform/
.terraform.lock.hcl
*.tfstate
*.tfstate.backup
crash.log
```

- [ ] **Step 2: Creează `AWS_Terraform/variables.tf`**

```hcl
variable "aws_region" {
  description = "AWS region for all resources except ACM"
  type        = string
  default     = "eu-central-1"
}

variable "ami_id" {
  description = "Ubuntu 24.04 LTS AMI ID for eu-central-1"
  type        = string
  default     = "ami-05852c5f195d545ea"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_a_cidr" {
  description = "CIDR for public subnet in eu-central-1a"
  type        = string
  default     = "10.0.1.0/24"
}

variable "public_subnet_b_cidr" {
  description = "CIDR for public subnet in eu-central-1b"
  type        = string
  default     = "10.0.2.0/24"
}

variable "n8n_domain" {
  description = "Full domain for n8n (e.g. n8n.bogdanistrate.ro)"
  type        = string
  default     = "n8n.bogdanistrate.ro"
}

variable "root_domain" {
  description = "Root domain managed in Route53 (e.g. bogdanistrate.ro)"
  type        = string
  default     = "bogdanistrate.ro"
}

variable "n8n_encryption_key" {
  description = "Encryption key for n8n credentials (generate with: openssl rand -hex 32)"
  type        = string
  sensitive   = true
}

variable "project_name" {
  description = "Project name used for resource naming and tagging"
  type        = string
  default     = "portfolio-n8n"
}

variable "environment" {
  description = "Environment name for tagging"
  type        = string
  default     = "prod"
}
```

- [ ] **Step 3: Creează `AWS_Terraform/terraform.tfvars.example`**

```hcl
# Copy this file to terraform.tfvars and fill in the values
aws_region           = "eu-central-1"
ami_id               = "ami-05852c5f195d545ea"
instance_type        = "t2.micro"
vpc_cidr             = "10.0.0.0/16"
public_subnet_a_cidr = "10.0.1.0/24"
public_subnet_b_cidr = "10.0.2.0/24"
n8n_domain           = "n8n.bogdanistrate.ro"
root_domain          = "bogdanistrate.ro"
n8n_encryption_key   = "generate-with-openssl-rand-hex-32"
project_name         = "portfolio-n8n"
environment          = "prod"
```

- [ ] **Step 4: Adaugă `AWS_Terraform` în `.gitignore` root-ul proiectului**

Deschide `.gitignore` din rădăcina repo-ului Next.js și adaugă:
```
# Terraform infrastructure (local state)
AWS_Terraform/
```

- [ ] **Step 5: Commit**

```bash
git add .gitignore AWS_Terraform/
git commit -m "chore: scaffold AWS_Terraform folder structure"
```

---

## Task 2: Modulul `vpc`

**Files:**
- Create: `AWS_Terraform/modules/vpc/main.tf`
- Create: `AWS_Terraform/modules/vpc/variables.tf`
- Create: `AWS_Terraform/modules/vpc/outputs.tf`

- [ ] **Step 1: Creează `modules/vpc/variables.tf`**

```hcl
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
}

variable "public_subnet_a_cidr" {
  description = "CIDR for public subnet in AZ a"
  type        = string
}

variable "public_subnet_b_cidr" {
  description = "CIDR for public subnet in AZ b"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "project_name" {
  description = "Project name for tagging"
  type        = string
}

variable "environment" {
  description = "Environment for tagging"
  type        = string
}
```

- [ ] **Step 2: Creează `modules/vpc/main.tf`**

```hcl
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name        = "${var.project_name}-vpc"
    Environment = var.environment
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${var.project_name}-igw"
    Environment = var.environment
  }
}

resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_a_cidr
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = false

  tags = {
    Name        = "${var.project_name}-public-a"
    Environment = var.environment
  }
}

resource "aws_subnet" "public_b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_b_cidr
  availability_zone       = "${var.aws_region}b"
  map_public_ip_on_launch = false

  tags = {
    Name        = "${var.project_name}-public-b"
    Environment = var.environment
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name        = "${var.project_name}-public-rt"
    Environment = var.environment
  }
}

resource "aws_route_table_association" "public_a" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_b" {
  subnet_id      = aws_subnet.public_b.id
  route_table_id = aws_route_table.public.id
}
```

- [ ] **Step 3: Creează `modules/vpc/outputs.tf`**

```hcl
output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_a_id" {
  description = "ID of public subnet in AZ a"
  value       = aws_subnet.public_a.id
}

output "public_subnet_b_id" {
  description = "ID of public subnet in AZ b"
  value       = aws_subnet.public_b.id
}
```

- [ ] **Step 4: Commit**

```bash
git add AWS_Terraform/modules/vpc/
git commit -m "feat(terraform): add vpc module"
```

---

## Task 3: Modulul `acm`

**Files:**
- Create: `AWS_Terraform/modules/acm/main.tf`
- Create: `AWS_Terraform/modules/acm/variables.tf`
- Create: `AWS_Terraform/modules/acm/outputs.tf`

> ACM pentru CloudFront TREBUIE să fie în `us-east-1`. Modulul folosește un provider alias.

- [ ] **Step 1: Creează `modules/acm/variables.tf`**

```hcl
variable "root_domain" {
  description = "Root domain (e.g. bogdanistrate.ro)"
  type        = string
}

variable "project_name" {
  description = "Project name for tagging"
  type        = string
}

variable "environment" {
  description = "Environment for tagging"
  type        = string
}
```

- [ ] **Step 2: Creează `modules/acm/main.tf`**

```hcl
terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      version               = "~> 5.0"
      configuration_aliases = [aws.us_east_1]
    }
  }
}

# Hosted zone există deja în Route53 — nu o creăm, o referențiem
data "aws_route53_zone" "main" {
  name         = var.root_domain
  private_zone = false
}

resource "aws_acm_certificate" "wildcard" {
  provider          = aws.us_east_1
  domain_name       = "*.${var.root_domain}"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name        = "${var.project_name}-wildcard-cert"
    Environment = var.environment
  }
}

resource "aws_route53_record" "acm_validation" {
  for_each = {
    for dvo in aws_acm_certificate.wildcard.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.main.zone_id
}

resource "aws_acm_certificate_validation" "wildcard" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.wildcard.arn
  validation_record_fqdns = [for record in aws_route53_record.acm_validation : record.fqdn]
}
```

- [ ] **Step 3: Creează `modules/acm/outputs.tf`**

```hcl
output "certificate_arn" {
  description = "ARN of the validated ACM certificate (us-east-1)"
  value       = aws_acm_certificate_validation.wildcard.certificate_arn
}
```

- [ ] **Step 4: Commit**

```bash
git add AWS_Terraform/modules/acm/
git commit -m "feat(terraform): add acm module with us-east-1 provider alias"
```

---

## Task 4: Modulul `ec2`

**Files:**
- Create: `AWS_Terraform/modules/ec2/main.tf`
- Create: `AWS_Terraform/modules/ec2/variables.tf`
- Create: `AWS_Terraform/modules/ec2/outputs.tf`
- Create: `AWS_Terraform/modules/ec2/user_data.sh`

- [ ] **Step 1: Creează `modules/ec2/variables.tf`**

```hcl
variable "ami_id" {
  description = "Ubuntu 24.04 LTS AMI ID"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
}

variable "subnet_id" {
  description = "Subnet ID where EC2 will be launched"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID for security group"
  type        = string
}

variable "n8n_domain" {
  description = "Full domain for n8n"
  type        = string
}

variable "n8n_encryption_key" {
  description = "Encryption key for n8n"
  type        = string
  sensitive   = true
}

variable "project_name" {
  description = "Project name for tagging"
  type        = string
}

variable "environment" {
  description = "Environment for tagging"
  type        = string
}
```

- [ ] **Step 2: Creează `modules/ec2/user_data.sh`**

```bash
#!/bin/bash
set -e

# Variables injected by Terraform templatefile()
N8N_DOMAIN="${n8n_domain}"
N8N_ENCRYPTION_KEY="${n8n_encryption_key}"

# Update system
apt-get update -y
apt-get upgrade -y

# Install Docker
apt-get install -y ca-certificates curl gnupg
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Enable and start Docker
systemctl enable docker
systemctl start docker

# Create n8n directory
mkdir -p /opt/n8n

# Create Nginx config
cat > /opt/n8n/nginx.conf <<'NGINX'
events {
  worker_connections 1024;
}

http {
  server {
    listen 80;
    server_name _;

    location / {
      proxy_pass         http://n8n:5678;
      proxy_http_version 1.1;
      proxy_set_header   Upgrade $http_upgrade;
      proxy_set_header   Connection "upgrade";
      proxy_set_header   Host $host;
      proxy_set_header   X-Real-IP $remote_addr;
      proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header   X-Forwarded-Proto https;
      proxy_read_timeout 300s;
    }
  }
}
NGINX

# Create docker-compose.yml
cat > /opt/n8n/docker-compose.yml <<COMPOSE
services:
  n8n:
    image: n8nio/n8n:latest
    restart: always
    environment:
      - N8N_HOST=$N8N_DOMAIN
      - N8N_PROTOCOL=https
      - N8N_ENCRYPTION_KEY=$N8N_ENCRYPTION_KEY
      - WEBHOOK_URL=https://$N8N_DOMAIN
      - N8N_RUNNERS_ENABLED=true
    volumes:
      - n8n_data:/home/node/.n8n

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
    volumes:
      - /opt/n8n/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - n8n

volumes:
  n8n_data:
COMPOSE

# Start services
cd /opt/n8n
docker compose up -d
```

- [ ] **Step 3: Creează `modules/ec2/main.tf`**

```hcl
# CloudFront managed prefix list pentru eu-central-1
data "aws_ec2_managed_prefix_list" "cloudfront" {
  name = "com.amazonaws.global.cloudfront.origin-facing"
}

resource "aws_security_group" "n8n" {
  name        = "${var.project_name}-sg"
  description = "Allow inbound only from CloudFront, all outbound"
  vpc_id      = var.vpc_id

  ingress {
    description     = "HTTP from CloudFront"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    prefix_list_ids = [data.aws_ec2_managed_prefix_list.cloudfront.id]
  }

  egress {
    description = "All outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project_name}-sg"
    Environment = var.environment
  }
}

# IAM Role pentru SSM Session Manager
resource "aws_iam_role" "ec2_ssm" {
  name = "${var.project_name}-ec2-ssm-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })

  tags = {
    Name        = "${var.project_name}-ec2-ssm-role"
    Environment = var.environment
  }
}

resource "aws_iam_role_policy_attachment" "ssm_core" {
  role       = aws_iam_role.ec2_ssm.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ec2_ssm" {
  name = "${var.project_name}-ec2-ssm-profile"
  role = aws_iam_role.ec2_ssm.name
}

resource "aws_instance" "n8n" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = var.subnet_id
  vpc_security_group_ids = [aws_security_group.n8n.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2_ssm.name

  user_data = templatefile("${path.module}/user_data.sh", {
    n8n_domain          = var.n8n_domain
    n8n_encryption_key  = var.n8n_encryption_key
  })

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
    encrypted   = true
  }

  tags = {
    Name        = "${var.project_name}-ec2"
    Environment = var.environment
  }
}

resource "aws_eip" "n8n" {
  instance = aws_instance.n8n.id
  domain   = "vpc"

  tags = {
    Name        = "${var.project_name}-eip"
    Environment = var.environment
  }
}
```

- [ ] **Step 4: Creează `modules/ec2/outputs.tf`**

```hcl
output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.n8n.id
}

output "elastic_ip" {
  description = "Elastic IP address of the EC2 instance"
  value       = aws_eip.n8n.public_ip
}

output "security_group_id" {
  description = "ID of the EC2 security group"
  value       = aws_security_group.n8n.id
}
```

- [ ] **Step 5: Commit**

```bash
git add AWS_Terraform/modules/ec2/
git commit -m "feat(terraform): add ec2 module with SSM role and CloudFront SG"
```

---

## Task 5: Modulul `cloudfront`

**Files:**
- Create: `AWS_Terraform/modules/cloudfront/main.tf`
- Create: `AWS_Terraform/modules/cloudfront/variables.tf`
- Create: `AWS_Terraform/modules/cloudfront/outputs.tf`

- [ ] **Step 1: Creează `modules/cloudfront/variables.tf`**

```hcl
variable "n8n_domain" {
  description = "Alternate domain name for CloudFront distribution"
  type        = string
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN (must be in us-east-1)"
  type        = string
}

variable "ec2_elastic_ip" {
  description = "Elastic IP of the EC2 instance (CloudFront origin)"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID for VPC Origin"
  type        = string
}

variable "project_name" {
  description = "Project name for tagging"
  type        = string
}

variable "environment" {
  description = "Environment for tagging"
  type        = string
}
```

- [ ] **Step 2: Creează `modules/cloudfront/main.tf`**

```hcl
resource "aws_cloudfront_vpc_origin" "n8n" {
  vpc_origin_endpoint_config {
    name                   = "${var.project_name}-vpc-origin"
    arn                    = "arn:aws:ec2:eu-central-1:${data.aws_caller_identity.current.account_id}:elastic-ip/${var.ec2_elastic_ip}"
    http_port              = 80
    https_port             = 443
    origin_protocol_policy = "http-only"

    origin_ssl_protocols {
      items    = ["TLSv1.2"]
      quantity = 1
    }
  }
}

data "aws_caller_identity" "current" {}

resource "aws_cloudfront_distribution" "n8n" {
  enabled             = true
  aliases             = [var.n8n_domain]
  price_class         = "PriceClass_100"
  http_version        = "http2and3"
  is_ipv6_enabled     = true
  comment             = "${var.project_name} n8n distribution"

  origin {
    domain_name = var.ec2_elastic_ip
    origin_id   = "n8n-ec2-origin"

    vpc_origin_config {
      vpc_origin_id            = aws_cloudfront_vpc_origin.n8n.id
      origin_keepalive_timeout = 5
      origin_read_timeout      = 30
    }
  }

  # Webhook behavior — no cache, forward all headers
  ordered_cache_behavior {
    path_pattern           = "/webhook/*"
    target_origin_id       = "n8n-ec2-origin"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    compress               = false

    forwarded_values {
      query_string = true
      headers      = ["*"]
      cookies {
        forward = "all"
      }
    }

    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }

  # Default behavior — no cache (n8n is fully dynamic)
  default_cache_behavior {
    target_origin_id       = "n8n-ec2-origin"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    forwarded_values {
      query_string = true
      headers      = ["*"]
      cookies {
        forward = "all"
      }
    }

    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }

  viewer_certificate {
    acm_certificate_arn      = var.acm_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Name        = "${var.project_name}-cf"
    Environment = var.environment
  }
}
```

- [ ] **Step 3: Creează `modules/cloudfront/outputs.tf`**

```hcl
output "distribution_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.n8n.domain_name
}

output "distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.n8n.id
}
```

- [ ] **Step 4: Commit**

```bash
git add AWS_Terraform/modules/cloudfront/
git commit -m "feat(terraform): add cloudfront module with VPC Origin"
```

---

## Task 6: Modulul `route53`

**Files:**
- Create: `AWS_Terraform/modules/route53/main.tf`
- Create: `AWS_Terraform/modules/route53/variables.tf`
- Create: `AWS_Terraform/modules/route53/outputs.tf`

- [ ] **Step 1: Creează `modules/route53/variables.tf`**

```hcl
variable "root_domain" {
  description = "Root domain managed in Route53"
  type        = string
}

variable "n8n_domain" {
  description = "Full subdomain for n8n"
  type        = string
}

variable "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  type        = string
}

variable "project_name" {
  description = "Project name for tagging"
  type        = string
}
```

- [ ] **Step 2: Creează `modules/route53/main.tf`**

```hcl
data "aws_route53_zone" "main" {
  name         = var.root_domain
  private_zone = false
}

resource "aws_route53_record" "n8n" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = var.n8n_domain
  type    = "CNAME"
  ttl     = 300
  records = [var.cloudfront_domain_name]
}
```

- [ ] **Step 3: Creează `modules/route53/outputs.tf`**

```hcl
output "n8n_fqdn" {
  description = "FQDN of the n8n DNS record"
  value       = aws_route53_record.n8n.fqdn
}
```

- [ ] **Step 4: Commit**

```bash
git add AWS_Terraform/modules/route53/
git commit -m "feat(terraform): add route53 module"
```

---

## Task 7: Modulul `iam`

**Files:**
- Create: `AWS_Terraform/modules/iam/main.tf`
- Create: `AWS_Terraform/modules/iam/variables.tf`
- Create: `AWS_Terraform/modules/iam/outputs.tf`

- [ ] **Step 1: Creează `modules/iam/variables.tf`**

```hcl
variable "aws_region" {
  description = "AWS region for SSM parameter ARN"
  type        = string
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
}

variable "environment" {
  description = "Environment for tagging"
  type        = string
}
```

- [ ] **Step 2: Creează `modules/iam/main.tf`**

```hcl
data "aws_caller_identity" "current" {}

resource "aws_iam_user" "vercel_ssm_reader" {
  name = "portfolio-vercel-ssm-reader"

  tags = {
    Name        = "portfolio-vercel-ssm-reader"
    Environment = var.environment
    Purpose     = "Allows Vercel to read n8n webhook secret from SSM"
  }
}

resource "aws_iam_user_policy" "vercel_ssm_reader" {
  name = "ssm-read-n8n-internal-key"
  user = aws_iam_user.vercel_ssm_reader.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["ssm:GetParameter"]
      Resource = "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/portfolio/n8n/internal-key"
    }]
  })
}

resource "aws_iam_access_key" "vercel_ssm_reader" {
  user = aws_iam_user.vercel_ssm_reader.name
}
```

- [ ] **Step 3: Creează `modules/iam/outputs.tf`**

```hcl
output "access_key_id" {
  description = "AWS Access Key ID for Vercel"
  value       = aws_iam_access_key.vercel_ssm_reader.id
}

output "secret_access_key" {
  description = "AWS Secret Access Key for Vercel (sensitive)"
  value       = aws_iam_access_key.vercel_ssm_reader.secret
  sensitive   = true
}
```

- [ ] **Step 4: Commit**

```bash
git add AWS_Terraform/modules/iam/
git commit -m "feat(terraform): add iam module for vercel ssm reader"
```

---

## Task 8: Root module — `main.tf` + `outputs.tf`

**Files:**
- Create: `AWS_Terraform/main.tf`
- Create: `AWS_Terraform/outputs.tf`

- [ ] **Step 1: Creează `AWS_Terraform/main.tf`**

```hcl
terraform {
  required_version = ">= 1.7"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# Provider alias pentru ACM (CloudFront necesită us-east-1)
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

module "vpc" {
  source = "./modules/vpc"

  vpc_cidr             = var.vpc_cidr
  public_subnet_a_cidr = var.public_subnet_a_cidr
  public_subnet_b_cidr = var.public_subnet_b_cidr
  aws_region           = var.aws_region
  project_name         = var.project_name
  environment          = var.environment
}

module "acm" {
  source = "./modules/acm"

  providers = {
    aws.us_east_1 = aws.us_east_1
  }

  root_domain  = var.root_domain
  project_name = var.project_name
  environment  = var.environment
}

module "ec2" {
  source = "./modules/ec2"

  ami_id             = var.ami_id
  instance_type      = var.instance_type
  subnet_id          = module.vpc.public_subnet_a_id
  vpc_id             = module.vpc.vpc_id
  n8n_domain         = var.n8n_domain
  n8n_encryption_key = var.n8n_encryption_key
  project_name       = var.project_name
  environment        = var.environment
}

module "cloudfront" {
  source = "./modules/cloudfront"

  n8n_domain          = var.n8n_domain
  acm_certificate_arn = module.acm.certificate_arn
  ec2_elastic_ip      = module.ec2.elastic_ip
  vpc_id              = module.vpc.vpc_id
  project_name        = var.project_name
  environment         = var.environment
}

module "route53" {
  source = "./modules/route53"

  root_domain            = var.root_domain
  n8n_domain             = var.n8n_domain
  cloudfront_domain_name = module.cloudfront.distribution_domain_name
  project_name           = var.project_name
}

module "iam" {
  source = "./modules/iam"

  aws_region   = var.aws_region
  project_name = var.project_name
  environment  = var.environment
}
```

- [ ] **Step 2: Creează `AWS_Terraform/outputs.tf`**

```hcl
output "n8n_url" {
  description = "Public URL for n8n"
  value       = "https://${var.n8n_domain}"
}

output "cloudfront_domain" {
  description = "CloudFront distribution domain (for debug)"
  value       = module.cloudfront.distribution_domain_name
}

output "ec2_elastic_ip" {
  description = "Elastic IP of EC2 instance"
  value       = module.ec2.elastic_ip
}

output "vercel_aws_access_key_id" {
  description = "AWS Access Key ID for Vercel environment variables"
  value       = module.iam.access_key_id
}

output "vercel_aws_secret_access_key" {
  description = "AWS Secret Access Key for Vercel (copy to Vercel env vars)"
  value       = module.iam.secret_access_key
  sensitive   = true
}
```

- [ ] **Step 3: Commit**

```bash
git add AWS_Terraform/main.tf AWS_Terraform/outputs.tf
git commit -m "feat(terraform): add root module wiring all submodules"
```

---

## Task 9: Inițializare și deploy

- [ ] **Step 1: Creează `terraform.tfvars` din example**

```bash
cd AWS_Terraform
cp terraform.tfvars.example terraform.tfvars
```

Editează `terraform.tfvars` și completează:
```hcl
n8n_encryption_key = "$(openssl rand -hex 32)"
```
Înlocuiește cu valoarea reală generată de `openssl rand -hex 32`.

- [ ] **Step 2: Inițializează Terraform**

```bash
cd AWS_Terraform
terraform init
```

Output așteptat:
```
Terraform has been successfully initialized!
```

- [ ] **Step 3: Validează configurația**

```bash
terraform validate
```

Output așteptat:
```
Success! The configuration is valid.
```

- [ ] **Step 4: Plan — verifică ce va fi creat**

```bash
terraform plan
```

Verifică că planul include: 1 VPC, 2 subnets, 1 IGW, 1 EC2, 1 EIP, 1 SG, 1 ACM cert, 1 CloudFront distribution, 1 VPC Origin, DNS records, 1 IAM user + policy + access key.

- [ ] **Step 5: Apply**

```bash
terraform apply
```

Scrie `yes` când cere confirmare.

> ⚠ ACM certificate validation poate dura 5-10 minute.
> ⚠ CloudFront distribution poate dura 5-10 minute să se propage.

- [ ] **Step 6: Verifică outputurile**

```bash
terraform output
terraform output -raw vercel_aws_secret_access_key
```

Salvează `vercel_aws_access_key_id` și `vercel_aws_secret_access_key` — necesare în pasul următor.

---

## Task 10: Pași manuali post-deploy

- [ ] **Step 1: Creează SSM Parameter Store**

În AWS Console → Systems Manager → Parameter Store → Create parameter:
```
Name:  /portfolio/n8n/internal-key
Type:  SecureString
Value: <generează o valoare random: openssl rand -hex 32>
```

- [ ] **Step 2: Adaugă variabile în Vercel**

În Vercel Dashboard → Project → Settings → Environment Variables:
```
AWS_ACCESS_KEY_ID     = <vercel_aws_access_key_id din terraform output>
AWS_SECRET_ACCESS_KEY = <vercel_aws_secret_access_key din terraform output>
AWS_REGION            = eu-central-1
```

- [ ] **Step 3: Verifică că EC2 e accesibil prin SSM**

În AWS Console → Systems Manager → Fleet Manager → verifică că instanța apare ca "Online".

Sau din terminal (necesită AWS CLI configurat):
```bash
aws ssm start-session --target <instance-id> --region eu-central-1
```

- [ ] **Step 4: Verifică că n8n rulează pe instanță**

Prin SSM Session:
```bash
cd /opt/n8n
docker compose ps
```

Output așteptat: ambele servicii (`n8n` și `nginx`) în starea `running`.

- [ ] **Step 5: Testează URL-ul final**

Deschide `https://n8n.bogdanistrate.ro` în browser.
Așteptat: pagina de setup/login n8n.

---

## Referință rapidă — comenzi utile

```bash
# Acces SSH-like la instanță
aws ssm start-session --target <instance-id> --region eu-central-1

# Verifică loguri n8n
docker compose -f /opt/n8n/docker-compose.yml logs -f n8n

# Restart servicii
docker compose -f /opt/n8n/docker-compose.yml restart

# Destroy infrastructură (atenție!)
terraform destroy
```
