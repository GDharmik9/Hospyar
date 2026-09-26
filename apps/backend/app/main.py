from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .core.exceptions import HospyarBaseException
from .delivery.routes.patient360_router import router as patient360_router
from .delivery.routes.copilot_router import router as copilot_router
from .delivery.routes.claims_router import router as claims_router
from .delivery.routes.timeline_router import router as timeline_router
from .delivery.routes.hie_router import router as hie_router

def create_application() -> FastAPI:
    application = FastAPI(
        title=settings.APP_NAME,
        version=settings.VERSION,
        description="Hospyar Sovereign Multi-Modal AI Copilot & Patient 360 Platform",
        docs_url="/docs",
        redoc_url="/redoc"
    )

    # Enable CORS for Turborepo Frontend apps
    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Custom Exception Handlers
    @application.exception_handler(HospyarBaseException)
    async def hospyar_exception_handler(request: Request, exc: HospyarBaseException):
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error_code": exc.code, "message": exc.message}
        )

    # Health check
    @application.get("/health", tags=["System"])
    async def health_check():
        return {
            "status": "UP",
            "system": settings.APP_NAME,
            "version": settings.VERSION,
            "sovereign_region": settings.SOVEREIGN_REGION,
            "regime": settings.REGULATORY_REGIME
        }

    # Mount Delivery Routers
    application.include_router(patient360_router)
    application.include_router(copilot_router)
    application.include_router(claims_router)
    application.include_router(timeline_router)
    application.include_router(hie_router)

    return application

app = create_application()
