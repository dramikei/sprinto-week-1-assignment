import Link from "next/link";
import client from "../lib/apollo";
import { GET_BOOKS, GET_AUTHORS } from "../lib/queries";
import { TooltipButton } from "@/components/ui/TooltipButton";

async function recentBookSection(books) {
  // Empty state
  if (books.length === 0) {
    return (
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-slate-700 mb-6">Recent Books</h3>
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 mb-4 bg-gray-200 rounded-full flex items-center justify-center">
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
          </div>
          <h4 className="text-xl font-semibold text-gray-700 mb-2">
            No books yet
          </h4>
          <p className="text-gray-500 mb-6">
            Get started by adding your first book to the collection
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium">
            Add Your First Book
          </button>
        </div>
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

async function recentAuthorsSection(authors) {
  // Empty state
  if (authors.length === 0) {
    return (
      <div>
        <h3 className="text-2xl font-bold text-slate-700 mb-6">
          Recent Authors
        </h3>

        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 mb-4 bg-gray-200 rounded-full flex items-center justify-center">
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h4 className="text-xl font-semibold text-gray-700 mb-2">
            No authors yet
          </h4>
          <p className="text-gray-500 mb-6">
            Add authors to start building your literary network
          </p>
          <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium">
            Add Your First Author
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-slate-700 mb-6">Recent Authors</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {authors.map(({ node: author }) => (
          <Link href={`/authors/${author.id}`} key={author.id}>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center mb-4">
                {author.image_url ? (
                  <img src={author.image_url} alt={author.name} />
                ) : (
                  <div className="text-4xl">👤</div>
                )}
              </div>
              <h4 className="font-semibold text-lg text-slate-700 text-center">
                {author.name}
              </h4>
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

async function welcomeSection(books, authors) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-slate-700 mb-4">
        Welcome to Book Management
      </h2>
      <p className="text-gray-600 mb-8">
        Manage your collection of books and authors
      </p>
      <div className="flex justify-center space-x-4">
        {books?.length > 0 && (
          <TooltipButton
            disabled={!authors?.length}
            tooltipText="Add an author first!"
            href="/books/new"
          >
            Add New Book
          </TooltipButton>
        )}
        {authors?.length > 0 && (
          <TooltipButton variant="secondary" href="/books/new">
            Add New Author
          </TooltipButton>
        )}
      </div>
    </div>
  );
}
// TODO: - design the home page
export default async function HomePage() {
  const { data: booksData } = await client.query({
    query: GET_BOOKS,
    variables: { first: 6 },
  });

  const { data: authorsData } = await client.query({
    query: GET_AUTHORS,
    variables: { first: 6 },
  });

  const recentBooks = booksData?.books?.edges || [];
  const recentAuthors = authorsData?.authors?.edges || [];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        {welcomeSection(recentBooks, recentAuthors)}
        {/* Recent Books Section */}
        {recentBookSection(recentBooks)}

        {/* Recent Authors Section */}
        {recentAuthorsSection(recentAuthors)}
      </main>
    </div>
  );
}
