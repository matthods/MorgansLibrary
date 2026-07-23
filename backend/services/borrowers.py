from backend.database import SessionLocal
from backend.models import Borrower
from fastapi import HTTPException


def get_borrowers():
    db = SessionLocal()
    borrowers = db.query(Borrower).all()
    db.close()
    return borrowers

def get_borrower(borrower_id):
    db = SessionLocal()
    borrower = db.query(Borrower).filter(Borrower.id == borrower_id).first()
    db.close()
    return borrower

def add_borrower(first_name, last_name, phone="", email=""):
    db = SessionLocal()

    borrower = Borrower(
        first_name=first_name,
        last_name=last_name,
        phone=phone,
        email=email
    )

    db.add(borrower)
    db.commit()

    db.close()

def delete_borrower(borrower_id):
    db = SessionLocal()

    borrower = db.query(Borrower).filter(Borrower.id == borrower_id).first()

    if borrower:
        db.delete(borrower)
        db.commit()

    db.close()

    if not borrower:
        raise HTTPException(
            status_code=404,
            detail="Borrower not found"
        )

    return borrower