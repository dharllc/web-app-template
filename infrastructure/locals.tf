locals {
  project_name = replace(var.domain_name, ".", "-")
  full_domain  = var.environment == "prod" ? var.domain_name : "${var.environment}.${var.domain_name}"
  s3_origin_id = "${local.project_name}-${var.environment}-frontend-origin"
} 