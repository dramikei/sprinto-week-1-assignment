import Link from "next/link";
import EmptyState from "../ui/EmptyState";
import { TooltipButton } from "../ui/TooltipButton";

export default function RecentBooksSection({ books, authors }) {
  // Empty state
  if (books.length === 0) {
    return (
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-slate-700 mb-6">Recent Books</h3>
        <EmptyState
          title="No books yet"
          description="Get started by adding your first book to the collection"
          buttonText="Add Your First Book"
          icon={
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          }
        >
          <TooltipButton 
            variant="primary" 
            disabled={!authors?.length}
            tooltipText="Add an author first!"
            href="/books/new"
          >
            Add Your First Book
          </TooltipButton>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h3 className="text-2xl font-bold text-slate-700 mb-6">Recent Books</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {books.map(({ node: book }) => (
          <Link href={`/books/${book.id}`} key={book.id}>
            <div key={book.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center mb-4">
                {book.cover_url ? (
                  <img src={book.cover_url} alt={book.title} />
                ) : (
                  <span className="text-gray-500">No Cover</span>
                )}
              </div>
              <h4 className="font-semibold text-lg text-slate-700 mb-1">
                {book.title}
              </h4>
              <p className="text-gray-600 text-sm">by {book.author.name}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <Link
          href="/books"
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          View All Books →
        </Link>
      </div>
    </div>
  );
} 