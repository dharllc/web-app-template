# Web Application Template

A modern, production-ready web application template featuring a Next.js frontend, Python FastAPI backend, and complete AWS infrastructure using Terraform.

## Features

- **Frontend**: Next.js application with:
  - Modern React patterns
  - TypeScript support
  - Environment-based configuration
  - Responsive design

- **Backend**: Python FastAPI service with:
  - AWS Lambda deployment
  - API Gateway integration
  - Environment-based configuration
  - Health check endpoints

- **Infrastructure**: Complete AWS setup using Terraform:
  - S3 + CloudFront for frontend hosting
  - Lambda + API Gateway for backend
  - Automatic SSL certificate provisioning
  - Route53 DNS management
  - Separate dev/prod environments

## Prerequisites

1. AWS Account with a registered domain in Route53
2. Node.js 18+ installed
3. Python 3.11+ installed
4. AWS CLI configured
5. Terraform 1.5+ installed
6. GitHub account

## Project Structure

```
.
├── frontend/                # Next.js frontend application
│   ├── src/                # Source code
│   ├── public/            # Static files
│   └── package.json       # Dependencies and scripts
├── backend/               # Python FastAPI backend
│   ├── routers/          # API route handlers
│   ├── main.py           # Application entry point
│   └── requirements.txt   # Python dependencies
└── infrastructure/        # Terraform infrastructure code
    ├── bootstrap/        # One-time Terraform state setup
    ├── dev/             # Development environment
    └── prod/            # Production environment
```

## Local Development

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create local environment file
cp .env.example .env

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn main:app --reload
```

The backend will be available at `http://localhost:8000`

## Infrastructure Setup

### Initial Setup

1. **Bootstrap Terraform State**
   ```bash
   cd infrastructure/bootstrap
   terraform init
   terraform apply -var="domain_name=yourdomain.com"
   ```
   Note the outputs for:
   - `state_bucket_name`
   - `dynamodb_table_name`

2. **Update Provider Configurations**
   
   Update the backend configuration in both `infrastructure/dev/providers.tf` and `infrastructure/prod/providers.tf` with the bootstrap outputs.

3. **GitHub Repository Setup**

   a. Create AWS IAM Role:
   - Go to AWS IAM Console
   - Create new role with OIDC provider for GitHub Actions
   - Attach necessary AWS managed policies (see infrastructure README)

   b. Add GitHub Secrets:
   - Go to repository Settings → Secrets and Variables → Actions
   - Add `AWS_ROLE_ARN` with the IAM role ARN

4. **Update Domain Configuration**
   
   In both `.github/workflows/deploy-dev.yml` and `deploy-prod.yml`:
   ```yaml
   env:
     DOMAIN_NAME: "yourdomain.com"  # Your actual domain
   ```

For detailed infrastructure setup instructions, see [infrastructure/README.md](infrastructure/README.md)

## Deployment

### Development Environment

1. Create and push to dev branch:
   ```bash
   git checkout -b dev
   git push origin dev
   ```

This will:
- Deploy infrastructure to AWS
- Build and deploy frontend to S3/CloudFront
- Deploy backend to Lambda
- Set up `dev.yourdomain.com`

### Production Environment

1. Push to main branch:
   ```bash
   git checkout main
   git push origin main
   ```

This will:
- Deploy infrastructure to AWS
- Build and deploy frontend to S3/CloudFront
- Deploy backend to Lambda
- Set up `yourdomain.com`

## Adding New Features

### Frontend

1. Add new components in `frontend/src/components/`
2. Add new pages in `frontend/src/app/`
3. Update environment variables in `.env` files if needed

### Backend

1. Add new route handlers in `backend/routers/`
2. Update `main.py` to include new routers
3. Add new dependencies to `requirements.txt`

### Infrastructure

1. For dev-only resources:
   - Add new `.tf` files in `infrastructure/dev/`
   - Use consistent naming: `${local.project_name}-${local.environment}-resource-name`

2. For shared resources:
   - Add files in both `dev/` and `prod/` directories
   - Maintain environment-specific configurations

## Environment Variables

### Frontend (.env)

- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_ENV`: Environment name (dev/prod)

### Backend

- `ENVIRONMENT`: Runtime environment
- Additional variables can be added through Lambda environment configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details
