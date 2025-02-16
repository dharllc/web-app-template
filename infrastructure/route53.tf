# Get the Route53 zone
data "aws_route53_zone" "domain" {
  name = var.domain_name
  private_zone = false
}

# Route53 records
resource "aws_route53_record" "frontend" {
  zone_id = data.aws_route53_zone.domain.zone_id
  name    = local.full_domain
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.frontend.domain_name
    zone_id                = aws_cloudfront_distribution.frontend.hosted_zone_id
    evaluate_target_health = false
  }
} 