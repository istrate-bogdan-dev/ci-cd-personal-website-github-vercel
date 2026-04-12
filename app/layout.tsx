import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bogdanistrate.vercel.app"),
  title: "Bogdan Istrate | Cloud Engineer & DevOps",
  description:
    "Cloud Engineer with 12+ years in IT infrastructure. AWS Solutions Architect. Specializing in infrastructure automation, Kubernetes, Terraform, CI/CD, FinOps, and DevSecOps.",
  openGraph: {
    title: "Bogdan Istrate | Cloud Engineer & DevOps",
    description:
      "Infrastructure that scales. Security by design. 12+ years in cloud & IT infrastructure.",
    url: "https://bogdanistrate.vercel.app",
    siteName: "Bogdan Istrate — Portfolio",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bogdan Istrate | Cloud Engineer & DevOps",
    description: "Cloud Engineer · AWS · Terraform · Kubernetes",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="font-mono antialiased" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
