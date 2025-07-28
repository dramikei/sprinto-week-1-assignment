import Link from "next/link";
import EmptyState from "../ui/EmptyState";
import { TooltipButton } from "../ui/TooltipButton";
import BookCards from "./components/BookCards";
import { useState } from "react";
import Modal from "../modal/Model";
import BookForm from "../forms/BookForm";

function EmptyBooksState({ authors }) {
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);

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
          onClick={() => setIsAddBookModalOpen(true)}
        >
          Add Your First Book
        </TooltipButton>
      </EmptyState>

      {isAddBookModalOpen && (
        <Modal isOpen={isAddBookModalOpen} handleClose={() => setIsAddBookModalOpen(false)}>
          <BookForm isOpen={isAddBookModalOpen} handleClose={() => setIsAddBookModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}

function RecentBooks({ books }) {
  return (
    <div className="mb-12">
      <h3 className="text-2xl font-bold text-slate-700 mb-6">Recent Books</h3>
      <BookCards books={books} />
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

export default function RecentBooksSection({ books, authors }) {
  return (
    <>
      {books.length === 0 ? <EmptyBooksState authors={authors} /> : <RecentBooks books={books} />}
    </>
  );
} 