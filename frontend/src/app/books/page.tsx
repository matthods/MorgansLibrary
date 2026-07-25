"use client";

import { useEffect, useState } from "react";
import { getBooks } from "@/src/lib/api";
import { Book } from "@/src/types/books";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

console.log("API URL:", API_URL);

export default function BooksPage() {

    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        async function loadBooks() {
            const data = await getBooks();
            setBooks(data);
        }

        loadBooks();
    }, []);


    return (
        <div>
            <h1 className="text-3xl font-bold">
                Books
            </h1>

            {books.map((book) => (
                <div key={book.id}>
                    {book.title}
                </div>
            ))}
        </div>
    );
}