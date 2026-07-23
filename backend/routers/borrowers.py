from fastapi import APIRouter, HTTPException

from backend.schemas import BorrowerCreate, BorrowerResponse
from backend.services.borrowers import (
    get_borrowers,
    get_borrower,
    add_borrower,
    delete_borrower
)

router = APIRouter(
    prefix="/borrowers",
    tags=["Borrowers"]
)

@router.get("/", response_model=list[BorrowerResponse])
def read_borrowers():
    return get_borrowers()


@router.get("/{borrower_id}", response_model=list[BorrowerResponse])
def read_borrower():
    return get_borrower()


@router.post("/add", response_model=list[BorrowerResponse])
def create():
    return add_borrower()

@router.delete("/delete", response_model=list[BorrowerResponse])
def delete(borrower_id:int):
    return delete_borrower(borrower_id)

