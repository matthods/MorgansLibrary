from fastapi import APIRouter, HTTPException

from backend.schemas import CheckoutRequest, ReturnRequest
from backend.services.transactions import (
    checkout_book,
    return_book,
    current_borrower,
    get_history
)

router = APIRouter(
    prefix="/transaction",
    tags=["Transaction"]
)

@router.post("/checkout")
def checkout(data: CheckoutRequest):
    return checkout_book(data.book_id, data.borrower_id)

@router.post("/return")
def checkout(data: ReturnRequest):
    return return_book(data.book_id)

@router.get("/book")
def checkout(data: ReturnRequest):
    return current_borrower(data.book_id)


@router.get("/history")
def history():
    return get_history()