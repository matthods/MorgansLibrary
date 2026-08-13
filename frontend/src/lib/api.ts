const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getBooks() {
    console.log("getBooks function loaded");

    const response = await fetch(`${API_URL}/books`);

    if (!response.ok) {
        throw new Error("Failed to fetch books");
    }

    return response.json();
}

export async function getBook(id: number) {
  const response = await fetch(`${API_URL}/books/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch book");
  }

  return response.json();
}