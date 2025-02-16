# Output the API Gateway URL
output "api_url" {
  value = aws_apigatewayv2_api.backend.api_endpoint
}

output "website_url" {
  value = "https://${local.full_domain}"
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.frontend.id
} 