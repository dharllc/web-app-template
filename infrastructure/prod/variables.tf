variable "domain_name" {
  description = "Root domain name (e.g., example.com)"
  type        = string
}

locals {
  environment  = "prod"
  project_name = replace(var.domain_name, ".", "-")
  full_domain  = var.domain_name
  s3_origin_id = "${local.project_name}-${local.environment}-frontend-origin"
} 