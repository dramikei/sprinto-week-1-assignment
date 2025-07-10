import { TooltipButton } from "@/components/ui/TooltipButton";

export default function WelcomeSection({ books, authors }) {
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
          <TooltipButton variant="secondary" href="/authors/new">
            Add New Author
          </TooltipButton>
        )}
      </div>
    </div>
  );
} 