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
    bucket         = "BOOTSTRAP_BUCKET_NAME"  # Will be set during bootstrap
    key            = "dev/terraform.tfstate"
    dynamodb_table = "BOOTSTRAP_TABLE_NAME"   # Will be set during bootstrap
  }
}

provider "aws" {
  region = "us-east-1"

  default_tags {
    tags = {
      Environment = local.environment
      Project     = local.project_name
      Domain      = var.domain_name
      ManagedBy   = "terraform"
    }
  }
} 