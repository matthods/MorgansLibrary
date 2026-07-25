"use client"

import { useState, useEffect } from "react"
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ArrowLeftRight,
  PlusCircle,
  Settings,
  Search,
} from "lucide-react"
import { cn } from "@/src/lib/utils"

const nav = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "books", label: "Books", icon: BookOpen },
  { id: "borrowers", label: "Borrowers", icon: Users },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { id: "add", label: "Add Book", icon: PlusCircle },
  { id: "settings", label: "Settings", icon: Settings },
] as const

type View = (typeof nav)[number]["id"]

import { getBooks } from "@/src/lib/api";
import { Book } from "@/src/types/books";

    const [books, setBooks] = useState<Book[]>([]);


    useEffect(() => {

        async function loadBooks() {
            const data = await getBooks();
            setBooks(data);
        }

        loadBooks();

    }, []);


  /*  return (
        <div>
            <h1>Books</h1>

            {books.map((book) => (
                <div key={book.id}>
                    <h2>{book.title}</h2>
                    <p>{book.author}</p>

                    <p>
                        {book.available 
                        ? "Available" 
                        : "Checked Out"}
                    </p>

                </div>
            ))}

        </div>
    );*/

const borrowers = [
  { name: "Eleanor Whitfield", email: "eleanor.w@example.com", loans: 3 },
  { name: "Marcus Chen", email: "marcus.chen@example.com", loans: 1 },
  { name: "Priya Anand", email: "priya.anand@example.com", loans: 2 },
  { name: "Sofia Ramírez", email: "sofia.ramirez@example.com", loans: 4 },
]

const transactions = [
  { book: "Atomic Habits", borrower: "Eleanor Whitfield", due: "Aug 1, 2026", status: "On time" },
  { book: "Crawdads Sing", borrower: "Marcus Chen", due: "Jul 12, 2026", status: "Overdue" },
  { book: "Sapiens", borrower: "Priya Anand", due: "Jul 19, 2026", status: "Returned" },
  { book: "Dune", borrower: "Sofia Ramírez", due: "Aug 5, 2026", status: "On time" },
]

export default function Page() {
  const [view, setView] = useState<View>("dashboard")
  const [query, setQuery] = useState("")

  const active = nav.find((n) => n.id === view)!

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-sidebar p-4 md:flex">
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="font-serif text-xl">Athenaeum</span>
        </div>
        <nav className="flex flex-col gap-1">
          {nav.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                view === item.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-secondary",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-background/80 px-4 py-3 backdrop-blur md:px-6">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, author, or genre"
              className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <h1 className="mb-6 font-serif text-2xl">{active.label}</h1>

          {view === "dashboard" && <Dashboard />}
          {view === "books" && <Books query={query} />}
          {view === "borrowers" && <Borrowers />}
          {view === "transactions" && <Transactions />}
          {view === "add" && <AddBook />}
          {view === "settings" && <SettingsView />}
        </main>
      </div>
    </div>
  )
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5 shadow-sm", className)}>
      {children}
    </div>
  )
}

function Dashboard() {
  const stats = [
    { label: "Total Books", value: books.reduce((s, b) => s + 1,0)},//b.copies, 0) },
    { label: "Titles", value: books.length },
    { label: "Members", value: borrowers.length },
    { label: "Active Loans", value: borrowers.reduce((s, b) => s + b.loans, 0) },
  ]
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-3xl font-semibold">{s.value}</p>
          </Card>
        ))}
      </div>
      <Card>
        <h2 className="mb-4 font-medium">Recent Transactions</h2>
        <ul className="flex flex-col divide-y divide-border">
          {transactions.map((t) => (
            <li key={t.book} className="flex items-center justify-between py-3 text-sm">
              <span>
                <span className="font-medium">{t.borrower}</span>
                <span className="text-muted-foreground"> · {t.book}</span>
              </span>
              <StatusPill status={t.status} />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function Books({ query }: { query: string }) {
  const q = query.trim().toLowerCase()
  const filtered = books.filter(
    (b) =>
      !q ||
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.genre.toLowerCase().includes(q),
  )
  return (
    <Card className="p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Author</th>
              <th className="px-5 py-3 font-medium">Genre</th>
              <th className="px-5 py-3 font-medium">Available</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.title} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium">{b.title}</td>
                <td className="px-5 py-3 text-muted-foreground">{b.author}</td>
                <td className="px-5 py-3 text-muted-foreground">{b.genre}</td>
                <td className="px-5 py-3">
                  {b.available}/{1}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">
                  No books match &ldquo;{query}&rdquo;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function Borrowers() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {borrowers.map((b) => (
        <Card key={b.email}>
          <p className="font-medium">{b.name}</p>
          <p className="text-sm text-muted-foreground">{b.email}</p>
          <p className="mt-3 text-sm">
            <span className="font-medium">{b.loans}</span> active loans
          </p>
        </Card>
      ))}
    </div>
  )
}

function Transactions() {
  return (
    <Card className="p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-5 py-3 font-medium">Book</th>
              <th className="px-5 py-3 font-medium">Borrower</th>
              <th className="px-5 py-3 font-medium">Due</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.book} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium">{t.book}</td>
                <td className="px-5 py-3 text-muted-foreground">{t.borrower}</td>
                <td className="px-5 py-3 text-muted-foreground">{t.due}</td>
                <td className="px-5 py-3">
                  <StatusPill status={t.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function AddBook() {
  const [saved, setSaved] = useState(false)
  const fields = ["Title", "Author", "Genre", "ISBN", "Year", "Copies"]
  return (
    <Card className="max-w-2xl">
      {saved && (
        <p className="mb-4 rounded-lg bg-accent px-3 py-2 text-sm text-accent-foreground">
          Book added to the catalog.
        </p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setSaved(true)
        }}
        className="grid gap-4 sm:grid-cols-2"
      >
        {fields.map((f) => (
          <label key={f} className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">{f}</span>
            <input
              required
              className="h-10 rounded-lg border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        ))}
        <button
          type="submit"
          className="col-span-full mt-2 h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Add Book
        </button>
      </form>
    </Card>
  )
}

function SettingsView() {
  return (
    <Card className="max-w-2xl">
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Library Name</span>
          <input
            defaultValue="Athenaeum Public Library"
            className="h-10 rounded-lg border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Loan Period (days)</span>
          <input
            defaultValue="14"
            className="h-10 rounded-lg border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <button className="mt-2 h-10 w-fit rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
          Save Changes
        </button>
      </div>
    </Card>
  )
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "On time": "bg-accent text-accent-foreground",
    Overdue: "bg-destructive/10 text-destructive",
    Returned: "bg-secondary text-secondary-foreground",
  }
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", styles[status])}>
      {status}
    </span>
  )
}
