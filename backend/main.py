from fastapi import FastAPI

from backend.routers.books import router as books_router
from backend.routers.borrowers import router as borrowers_router
from backend.routers.transactions import router as transactions_router

app = FastAPI(title="Personal Library API")

app.include_router(books_router)
app.include_router(borrowers_router)
app.include_router(transactions_router)

@app.get("/")
def root():
    return {"message": "Personal Library API Running"}