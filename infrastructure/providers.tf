terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    region         = "us-east-1"
    encrypt        = true
    # Bucket name and key will be configured via backend config
  }
}

provider "aws" {
  region = "us-east-1"

  default_tags {
    tags = {
      Environment = var.environment
      Project     = local.project_name
      Domain      = var.domain_name
      ManagedBy   = "terraform"
    }
  }
} 