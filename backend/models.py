from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship

from backend.database import Base

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True)

    title = Column(String, nullable=False)

    author = Column(String, nullable=False)

    genre = Column(String)

    isbn = Column(String)

    publication_year = Column(Integer)

    shelf_location = Column(String)

    description = Column(String)

    cover_image = Column(String)

    available = Column(Boolean, default=True)

    date_added = Column(Date)

    transactions = relationship("Transaction", back_populates="book")

    def __repr__(self):
        return f"{self.title} by {self.author}"


class Borrower(Base):
    __tablename__ = "borrowers"

    id = Column(Integer, primary_key=True)

    first_name = Column(String, nullable=False)

    last_name = Column(String, nullable=False)

    phone = Column(String)

    email = Column(String)

    transactions = relationship("Transaction", back_populates="borrower")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True)

    book_id = Column(Integer, ForeignKey("books.id"))

    borrower_id = Column(Integer, ForeignKey("borrowers.id"))

    checkout_date = Column(Date)

    due_date = Column(Date)

    return_date = Column(Date)

    book = relationship("Book", back_populates="transactions")

    borrower = relationship("Borrower", back_populates="transactions")