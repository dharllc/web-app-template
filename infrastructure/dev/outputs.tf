output "api_url" {
  value = aws_apigatewayv2_api.backend.api_endpoint
  description = "The API Gateway URL for the backend"
}

output "website_url" {
  value = "https://${local.full_domain}"
  description = "The CloudFront website URL"
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.frontend.id
  description = "The CloudFront distribution ID"
}

# Output these values to be used in the frontend build
output "frontend_env_vars" {
  value = {
    NEXT_PUBLIC_API_URL = aws_apigatewayv2_api.backend.api_endpoint
    NEXT_PUBLIC_ENV     = local.environment
  }
  description = "Environment variables for the frontend build"
} 