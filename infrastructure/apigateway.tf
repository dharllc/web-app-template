# API Gateway
resource "aws_apigatewayv2_api" "backend" {
  name          = "${local.project_name}-${var.environment}-backend"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "backend" {
  api_id      = aws_apigatewayv2_api.backend.id
  name        = var.environment
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "backend" {
  api_id           = aws_apigatewayv2_api.backend.id
  integration_type = "AWS_PROXY"

  integration_uri    = aws_lambda_function.backend.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "backend" {
  api_id    = aws_apigatewayv2_api.backend.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.backend.id}"
} 