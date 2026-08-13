"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBook } from "@/lib/api";
import { Book } from "@/types/books";

export default function BookPage() {
  const params = useParams();
  const router = useRouter();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBook() {
      try {
        const data = await getBook(Number(params.id));
        setBook(data);
      } catch (error) {
        console.error("Failed to load book:", error);
      } finally {
        setLoading(false);
      }
    }

    loadBook();
  }, [params.id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-muted-foreground">Loading book...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="font-serif text-3xl">Book not found</h1>
        <button
          onClick={() => router.back()}
          className="mt-4 rounded-lg border px-4 py-2 text-sm hover:bg-muted"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">

      <button
        onClick={() => router.back()}
        className="mb-8 text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to Books
      </button>

      <div className="grid gap-10 md:grid-cols-[250px_1fr]">

        {/* Cover */}
        <div>
          {book.cover_image ? (
            <img
              src={book.cover_image}
              alt={`Cover of ${book.title}`}
              className="w-full rounded-lg border shadow-sm"
            />
          ) : (
            <div className="flex aspect-[2/3] items-center justify-center rounded-lg border bg-muted text-sm text-muted-foreground">
              No Cover
            </div>
          )}
        </div>

        {/* Book Information */}
        <div>
          <h1 className="font-serif text-4xl font-semibold">
            {book.title}
          </h1>

          <p className="mt-2 text-lg text-muted-foreground">
            by {book.author}
          </p>

          <div className="mt-6">
            <span
              className={
                book.available
                  ? "rounded-full bg-accent px-3 py-1 text-sm font-medium"
                  : "rounded-full bg-secondary px-3 py-1 text-sm font-medium"
              }
            >
              {book.available ? "Available" : "Checked Out"}
            </span>
          </div>

          <div className="mt-8 space-y-4">

            {book.genre && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Genre
                </p>
                <p>{book.genre}</p>
              </div>
            )}

            {book.isbn && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  ISBN
                </p>
                <p>{book.isbn}</p>
              </div>
            )}

            {book.publication_year && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Publication Year
                </p>
                <p>{book.publication_year}</p>
              </div>
            )}

            {book.shelf_location && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Shelf Location
                </p>
                <p>{book.shelf_location}</p>
              </div>
            )}

            {book.date_added && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Date Added
                </p>
                <p>{book.date_added}</p>
              </div>
            )}

          </div>

          {book.description && (
            <div className="mt-8 border-t pt-8">
              <h2 className="font-serif text-2xl font-semibold">
                Description
              </h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                {book.description}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}