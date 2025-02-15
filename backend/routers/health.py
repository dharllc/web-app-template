from fastapi import APIRouter, status

router = APIRouter(
    prefix="/health",
    tags=["Health"]
)

@router.get(
    "",
    status_code=status.HTTP_200_OK,
    description="Health check endpoint"
)
async def health_check():
    return {"status": "healthy"} 