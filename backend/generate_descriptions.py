import time

from ollama import chat
from sqlalchemy.orm import Session

from backend.database import SessionLocal
from backend.models import Book


MODEL = "llama3.2"


def generate_description(book):
    """
    Generate a back-cover-style description for a book.
    """

    prompt = f"""
Write a compelling back-cover-style description for this book for someone who has never heard of it.

Book information:
Title: {book.title}
Author: {book.author}
Genre: {book.genre}

Requirements:
- Write approximately 80-150 words.
- Summarize the book's premise and setup.
- Make the reader interested in reading the book.
- Introduce important characters when appropriate.
- Describe the setting when it helps the reader understand the story.
- Explain the central conflict or situation.
- Do NOT reveal the ending.
- Do NOT reveal major plot twists.
- Do NOT include major events that occur late in the story.
- Do NOT include spoilers.
- Do NOT mention the ISBN.
- Do NOT mention publication dates, editions, printing information, or publishers.
- Do NOT include reviews or awards.
- Do NOT say "this book".
- Do NOT say "the reader".
- Do NOT make up characters, events, settings, or other information.
- Use polished prose similar to a professional book-jacket description.
- Return ONLY the description.
"""

    response = chat(
        model=MODEL,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    description = response.message.content.strip()

    return description


def generate_all_descriptions():
    db: Session = SessionLocal()

    try:
        books = (
            db.query(Book)
            .filter(
                (Book.description == None) |
                (Book.description == "")
            )
            .all()
        )

        print(f"Found {len(books)} books without descriptions.\n")

        successful = 0
        failed = 0

        for index, book in enumerate(books, start=1):

            print("=" * 70)
            print(f"[{index}/{len(books)}]")
            print(f"Title: {book.title}")
            print(f"Author: {book.author}")
            print(f"Genre: {book.genre}")
            print(f"ISBN: {book.isbn}")
            print()

            try:
                description = generate_description(book)

                print("Generated description:")
                print(description)
                print()

                # Save description to database
                book.description = description

                db.commit()

                print("✓ Saved to Neon.")
                successful += 1

            except Exception as e:
                db.rollback()

                print(f"✗ Failed: {e}")
                failed += 1

            # Small pause between books
            time.sleep(0.2)

        print()
        print("=" * 70)
        print("DONE")
        print("=" * 70)
        print(f"Successfully generated: {successful}")
        print(f"Failed: {failed}")

    finally:
        db.close()


if __name__ == "__main__":
    generate_all_descriptions()
