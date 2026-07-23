from fastapi import APIRouter, HTTPException

from backend.schemas import BookCreate, BookResponse
from backend.services.books import (
    add_book,
    delete_book,
    get_books,
    get_book,
    search_books,
    available_books,
    checked_out_books,
)

router = APIRouter(
    prefix="/books",
    tags=["Books"]
)


@router.get("/", response_model=list[BookResponse])
def read_books():
    return get_books()


@router.get("/{book_id}", response_model=BookResponse)
def read_book(book_id: int):

    return get_book(book_id)

@router.delete("/{book_id}", response_model=BookResponse)
def delete(book_id: int):

    return delete_book(book_id)

@router.post("/", response_model=BookResponse)
def create_book(book: BookCreate):

    return add_book(
        title=book.title,
        author=book.author,
        genre=book.genre,
        isbn=book.isbn,
        publication_year=book.publication_year,
        shelf_location=book.shelf_location,
        description=book.description,
    )


@router.get("/search/", response_model=list[BookResponse])
def search(
    title: str | None = None,
    author: str | None = None,
    genre: str | None = None,
):

    return search_books(title, author, genre)


@router.get("/available/", response_model=list[BookResponse])
def available():

    return available_books()


@router.get("/checked-out/", response_model=list[BookResponse])
def checked_out():

    return checked_out_books()