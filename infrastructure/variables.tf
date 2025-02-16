variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (e.g., dev, prod)"
  type        = string
}

variable "domain_name" {
  description = "Root domain name (e.g., example.com)"
  type        = string
}

variable "route53_zone_id" {
  description = "Route53 hosted zone ID for the domain"
  type        = string
}

locals {
  project_name = replace(var.domain_name, ".", "-")
  full_domain  = var.environment == "prod" ? var.domain_name : "${var.environment}.${var.domain_name}"
} 