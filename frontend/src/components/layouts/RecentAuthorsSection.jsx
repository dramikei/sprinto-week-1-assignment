import Link from "next/link";
import EmptyState from "../ui/EmptyState";
import { TooltipButton } from "../ui/TooltipButton";
import AuthorCards from "./components/AuthorCards";
import { useState } from "react";
import Modal from "../modal/Model";
import AuthorForm from "../forms/AuthorForm";

function EmptyAuthorState() {
  const [isAddAuthorModalOpen, setIsAddAuthorModalOpen] = useState(false);

  return (
    <div>
        <h3 className="text-2xl font-bold text-slate-700 mb-6">
          Recent Authors
        </h3>
          <EmptyState
            title="No authors yet"
            description="Add authors to start building your literary network"
            buttonText="Add Your First Author"
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            }
          >
            <TooltipButton variant="secondary" onClick={() => setIsAddAuthorModalOpen(true)}>
              Add Your First Author
            </TooltipButton>
          </EmptyState>

          {isAddAuthorModalOpen && (
            <Modal isOpen={isAddAuthorModalOpen} handleClose={() => setIsAddAuthorModalOpen(false)}>
              <AuthorForm isOpen={isAddAuthorModalOpen} handleClose={() => setIsAddAuthorModalOpen(false)} />
            </Modal>
          )}
      </div>
  )
}

function RecentAuthors({ authors }) {
  return (
    <div>
      <h3 className="text-2xl font-bold text-slate-700 mb-6">Recent Authors</h3>
      <AuthorCards authors={authors} />
      <div className="mt-6">
        <Link
          href="/authors"
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          View All Authors →
        </Link>
      </div>
    </div>
  )
}

export default function RecentAuthorsSection({ authors }) {
  return (
    <>
      {authors.length === 0 ? <EmptyAuthorState /> : <RecentAuthors authors={authors} />}
    </>
  );
}
