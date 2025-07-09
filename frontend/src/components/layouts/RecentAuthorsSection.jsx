import Link from "next/link";
import EmptyState from "../ui/EmptyState";
import { TooltipButton } from "../ui/TooltipButton";

export default function RecentAuthorsSection({ authors }) {
  // Empty state
  if (authors.length === 0) {
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
            <TooltipButton href="/authors/new" variant="secondary">
              Add Your First Author
            </TooltipButton>
          </EmptyState>
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
              <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center mb-4 overflow-clip">
                {author.photo_url ? (
                  <img src={author.photo_url} alt={author.name} />
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
          href="/authors"
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          View All Authors →
        </Link>
      </div>
    </div>
  );
}
