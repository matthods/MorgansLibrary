from pydantic import BaseModel, Field
from typing import Optional


class BookCreate(BaseModel):
    title: str = Field(min_length=1,max_length=200)
    author: str = Field(min_length=1,max_length=200)
    genre: str = Field(min_length=1,max_length=200)
    isbn: Optional[str] = ""
    publication_year: Optional[int] = None
    shelf_location: Optional[str] = ""
    description: Optional[str] = ""

class BookResponse(BookCreate):
    id: int
    available: bool

    class Config:
        from_attributes = True

class BorrowerCreate(BaseModel):

    first_name: str = Field(min_length=1,max_length=200)

    last_name: str = Field(min_length=1,max_length=200)

    phone: str = ""

    email: str = ""

class BorrowerResponse(BorrowerCreate):

    id: int

    class Config:
        from_attributes = True

class CheckoutRequest(BaseModel):
    book_id: int
    borrower_id: int

class ReturnRequest(BaseModel):
    book_id: int