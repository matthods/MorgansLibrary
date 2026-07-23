from backend.database import SessionLocal
from backend.models import Transaction, Book, Borrower
from datetime import date
from fastapi import HTTPException


def checkout_book(book_id, borrower_id):
    db = SessionLocal()

    book = db.query(Book).filter(Book.id == book_id).first()
    borrower = db.query(Borrower).filter(Borrower.id == borrower_id).first()

    if not book:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="Book not found"
        )
    if not book.available:
        db.close()
        raise HTTPException(
            status_code=40,
            detail="Book not available"
        )

    if not borrower:
        raise HTTPException(
            status_code=404,
            detail="Borrower not found"
        )
    
    transaction = Transaction(
        book_id=book_id,
        borrower_id=borrower_id,
        checkout_date=date.today(),
        return_date=None
    )

    book.available = False
    
    db.add(transaction)

    db.commit()
    
    db.close()
    
    return True

def return_book(book_id):
    db = SessionLocal()

    transaction = db.query(Transaction).filter(
        Transaction.book_id == book_id,
        Transaction.return_date == None
    ).first()

    if not transaction:
        db.close()
        raise HTTPException(
            status_code=400,
            detail="Book is not currently checked out"
        )
    
    transaction.return_date = date.today()

    book = db.query(Book).filter(Book.id == book_id).first()
    book.available = True

    db.commit()
    db.close()

    return True

def current_borrower(book_id):
    db = SessionLocal()

    transaction = db.query(Transaction).filter(
        Transaction.book_id == book_id,
        Transaction.return_date == None
    ).first()

    if not transaction:
        raise HTTPException(
            status_code=400,
            detail="Book is not currently checked out"
        )
    
    return transaction.borrower

def get_history():
    db = SessionLocal()

    transactions = db.query(Transaction).all()

    db.close()

    return transactions