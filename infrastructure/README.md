# Infrastructure Setup Guide

This guide explains how to set up and deploy the infrastructure for both development and production environments.

## Prerequisites

1. AWS Account with a domain registered in Route53
2. GitHub repository for your project
3. AWS CLI installed locally
4. Terraform installed locally

## Initial Setup Steps

### 1. Create AWS IAM Role for GitHub Actions

1. Go to AWS IAM Console
2. Create a new IAM Role with the following trust relationship:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "Federated": "arn:aws:iam::<YOUR_AWS_ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
         },
         "Action": "sts:AssumeRoleWithWebIdentity",
         "Condition": {
           "StringLike": {
             "token.actions.githubusercontent.com:sub": "repo:<YOUR_GITHUB_ORG>/<YOUR_REPO>:*"
           }
         }
       }
     ]
   }
   ```
3. Attach these AWS managed policies to the role:
   - `AmazonS3FullAccess`
   - `CloudFrontFullAccess`
   - `AWSLambda_FullAccess`
   - `AmazonAPIGatewayAdministrator`
   - `AmazonRoute53FullAccess`
   - `AWSCertificateManagerFullAccess`

### 2. Bootstrap Terraform State

The bootstrap process creates an S3 bucket and DynamoDB table for Terraform state management:

```bash
# Navigate to bootstrap directory
cd infrastructure/bootstrap

# Initialize Terraform
terraform init

# Apply bootstrap configuration (replace with your domain)
terraform apply -var="domain_name=yourdomain.com"

# Note the outputs for:
# - state_bucket_name
# - dynamodb_table_name
```

### 3. Update Provider Configurations

Update the backend configuration in both environments:

1. In `infrastructure/dev/providers.tf`:
   ```hcl
   backend "s3" {
     bucket         = "<BOOTSTRAP_BUCKET_NAME>"  # From bootstrap output
     key            = "dev/terraform.tfstate"
     region         = "us-east-1"
     encrypt        = true
     dynamodb_table = "<BOOTSTRAP_TABLE_NAME>"   # From bootstrap output
   }
   ```

2. In `infrastructure/prod/providers.tf`:
   ```hcl
   backend "s3" {
     bucket         = "<BOOTSTRAP_BUCKET_NAME>"  # From bootstrap output
     key            = "prod/terraform.tfstate"
     region         = "us-east-1"
     encrypt        = true
     dynamodb_table = "<BOOTSTRAP_TABLE_NAME>"   # From bootstrap output
   }
   ```

### 4. GitHub Repository Setup

1. Go to your GitHub repository settings
2. Navigate to Secrets and Variables → Actions
3. Add these repository secrets:
   - `AWS_ROLE_ARN`: The ARN of the IAM role created in step 1

### 5. Update GitHub Workflows

1. In `.github/workflows/deploy-dev.yml`:
   ```yaml
   env:
     DOMAIN_NAME: "yourdomain.com"  # Replace with your domain
   ```

2. In `.github/workflows/deploy-prod.yml`:
   ```yaml
   env:
     DOMAIN_NAME: "yourdomain.com"  # Replace with your domain
   ```

## Deployment

### Development Environment

1. Push to the `dev` branch:
   ```bash
   git checkout -b dev
   git push origin dev
   ```

This will:
- Create infrastructure in AWS
- Deploy the backend to Lambda
- Deploy the frontend to S3/CloudFront
- Set up DNS records for `dev.yourdomain.com`

### Production Environment

1. Push to the `main` branch:
   ```bash
   git checkout main
   git push origin main
   ```

This will:
- Create infrastructure in AWS
- Deploy the backend to Lambda
- Deploy the frontend to S3/CloudFront
- Set up DNS records for `yourdomain.com`

## Infrastructure Organization

```
infrastructure/
├── bootstrap/          # One-time setup for Terraform state
├── dev/               # Development environment
│   ├── providers.tf   # AWS provider and backend configuration
│   ├── variables.tf   # Input variables and locals
│   ├── outputs.tf     # Output values
│   ├── s3.tf         # S3 bucket resources
│   ├── cloudfront.tf # CloudFront distribution
│   ├── lambda.tf     # Lambda function and IAM roles
│   ├── apigateway.tf # API Gateway resources
│   ├── route53.tf    # DNS records
│   └── acm.tf        # SSL certificate
└── prod/             # Production environment (same structure as dev)
```

## Adding New Resources

To add new resources that only exist in the dev environment:

1. Create a new `.tf` file in the `dev` directory
2. Define your resources
3. Use the same naming convention: `${local.project_name}-${local.environment}-resource-name`

Example for a dev-only DynamoDB table:
```hcl
# dev/dynamodb.tf
resource "aws_dynamodb_table" "example" {
  name = "${local.project_name}-${local.environment}-example"
  # ... other configuration
}
``` 