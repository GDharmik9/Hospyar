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

    # Mount Static Files & SPA Fallback for Single-Container & Snowflake SPCS Hosting
    import os
    from fastapi.staticfiles import StaticFiles
    from fastapi.responses import FileResponse

    static_dir = os.getenv("STATIC_DIR", "/app/static")
    if not os.path.exists(static_dir):
        # Monorepo fallback: check if apps/web/dist exists
        candidate_dist = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "../../../web/dist")
        )
        if os.path.exists(candidate_dist):
            static_dir = candidate_dist

    if os.path.exists(static_dir) and os.path.isfile(os.path.join(static_dir, "index.html")):
        assets_dir = os.path.join(static_dir, "assets")
        if os.path.exists(assets_dir):
            application.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

        images_dir = os.path.join(static_dir, "images")
        if os.path.exists(images_dir):
            application.mount("/images", StaticFiles(directory=images_dir), name="images")

        @application.get("/{full_path:path}", include_in_schema=False)
        async def serve_spa(full_path: str):
            # Check for direct file match in static root (favicon, icons, etc.)
            direct_file = os.path.join(static_dir, full_path)
            if full_path and os.path.isfile(direct_file):
                return FileResponse(direct_file)
            return FileResponse(os.path.join(static_dir, "index.html"))
    else:
        @application.get("/", include_in_schema=False)
        async def root_index():
            return {
                "system": settings.APP_NAME,
                "version": settings.VERSION,
                "sovereign_region": settings.SOVEREIGN_REGION,
                "docs": "/docs",
                "health": "/health",
                "status": "OPERATIONAL"
            }

    return application

app = create_application()

