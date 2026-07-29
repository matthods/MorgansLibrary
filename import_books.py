import csv
from datetime import date

from backend.database import SessionLocal
from backend.models import Book

db = SessionLocal()

with open("books.csv", newline="", encoding="utf-8") as file:
    reader = csv.DictReader(file)

    for row in reader:
        if not row["title"]:
            continue

        book = Book(
            title=row["title"],
            author=row["author"],
            genre=row.get("genre"),
            isbn=row.get("isbn"),
            publication_year=int(row["publication_year"]) 
                if row.get("publication_year") else None,
            shelf_location=row.get("shelf_location"),
            description=row.get("description"),
            cover_image=row.get("cover_image"),
            available=row.get("available").strip().upper() == "TRUE",
            date_added=date.today()
        )

        db.add(book)

    db.commit()

db.close()

print("Books imported successfully!")