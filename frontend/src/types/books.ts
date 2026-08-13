export interface Book {
    id: number;
    title: string;
    author: string;
    genre: string;
    isbn?: string;
    publication_year?: number;
    shelf_location?: string;
    description?: string;
    cover_image?: string;
    available: boolean;
    date_added: string;
}