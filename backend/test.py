from backend.services.books import *

add_book(
    "Harry Potter",
    "J.K. Rowling",
    "Fantasy"
)

books = get_books()

for b in books:
    print(b.title, b.author)

books = search_books(title="Harry")

print("Search: ", books)