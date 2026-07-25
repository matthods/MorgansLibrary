from fastapi import FastAPI

from backend.routers.books import router as books_router
from backend.routers.borrowers import router as borrowers_router
from backend.routers.transactions import router as transactions_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Morgan's Library API")

app.include_router(books_router)
app.include_router(borrowers_router)
app.include_router(transactions_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Morgan's Library API Running"}