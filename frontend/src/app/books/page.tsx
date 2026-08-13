"use client";

import { useEffect, useState } from "react";
import { getBooks } from "@/lib/api";
import { Book } from "@/types/books";

import Link from "next/link"

import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

console.log("API URL:", API_URL);


export default function BooksPage() {
  const [query, setQuery] = useState("")
  const q = query.trim().toLowerCase().replace(/[\s.,'-]+/g, '')

  const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        async function loadBooks() {
            const data = await getBooks();
            setBooks(data);
        }

        loadBooks();
    }, []);

    const filteredBooks = books.filter((b) =>
        b.title.toLowerCase().replace(/[\s.,'-]+/g, '').includes(q) ||
        b.author.toLowerCase().replace(/[\s.,'-]+/g, '').includes(q) ||
        b.genre.toLowerCase().replace(/[\s.,'-]+/g, '').includes(q)
    );

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-6">
        <h1 className="font-serif text-3xl">Books</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search the catalog by title, author, or genre.
        </p>
      </header>

      <div className="relative mb-6 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author, or genre"
          aria-label="Search books"
          className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Author</th>
              <th className="px-5 py-3 font-medium">Genre</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((b) => (
              <tr key={b.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium"><Link href={`/books/${b.id}`}
        className="hover:underline">
        {b.title}
      </Link></td>
                <td className="px-5 py-3 text-muted-foreground">{b.author}</td>
                <td className="px-5 py-3 text-muted-foreground">{b.genre}</td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-medium",
                      b.available
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary text-secondary-foreground",
                    )}
                  >
                    {b.available ? "Available" : "Checked Out"}
                  </span>
                </td>
              </tr>
            ))}
            {filteredBooks.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">
                  No books match &ldquo;{query}&rdquo;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
