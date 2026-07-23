from backend.database import SessionLocal
from backend.models import Book
from fastapi import HTTPException

def add_book(title,author,genre="",isbn="",publication_year=None,shelf_location="",description=""):
    db = SessionLocal()
    
    book = Book(
        title=title,
        author=author,
        genre=genre,
        isbn=isbn,
        publication_year=publication_year,
        shelf_location=shelf_location,
        description=description,
        available=True
    )

    db.add(book)

    db.commit()

    db.refresh(book)

    db.close()

    return book

def delete_book(book_id):
    db = SessionLocal()

    book = db.query(Book).filter(Book.id == book_id).first()

    if book:
        db.delete(book)
        db.commit()

    db.close()

    if not book:
        raise HTTPException(
            status_code=404,
            detail="Book not found"
        )
    
    if not book.available:
        raise HTTPException(
            status = 400,
            detail="Cannot delete a checked out book"
        )

    return book

def get_book(book_id):
    db = SessionLocal()

    book = db.query(Book).filter(Book.id == book_id).first()

    db.close()

    if not book:
        raise HTTPException(
            status_code=404,
            detail="Book not found"
        )

    return book

def get_books():
    db = SessionLocal()

    books = db.query(Book).all()

    db.close()

    return books

def search_books(title=None, author=None, genre=None):
    db = SessionLocal()

    query = db.query(Book)

    if title:
        query = query.filter(Book.title.icontains(title))
    if author:
        query = query.filter(Book.author.icontains(author))
    if genre:
        query = query.filter(Book.genre.icontains(genre))

    books = query.all()

    db.close()

    return books

def available_books():
    db = SessionLocal()

    books = db.query(Book).filter(Book.available == True).all()

    db.close()

    return books

def checked_out_books():
    db = SessionLocal()

    books = db.query(Book).filter(Book.available == False).all()

    db.close()

    return books