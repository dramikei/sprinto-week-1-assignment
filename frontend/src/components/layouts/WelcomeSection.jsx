import { TooltipButton } from "@/components/ui/TooltipButton";
import { useState } from "react";
import Modal from "../modal/Model";
import BookForm from "../forms/BookForm";
import AuthorForm from "../forms/AuthorForm";

export default function WelcomeSection({ books, authors }) {
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isAddAuthorModalOpen, setIsAddAuthorModalOpen] = useState(false);

  return (
    <>
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
              onClick={() => setIsAddBookModalOpen(true)}
            >
              Add New Book
            </TooltipButton>
          )}
          {authors?.length > 0 && (
            <TooltipButton
              variant="secondary"
              onClick={() => setIsAddAuthorModalOpen(true)}
            >
              Add New Author
            </TooltipButton>
          )}
        </div>
      </div>

      {isAddBookModalOpen && (
        <Modal
          isOpen={isAddBookModalOpen}
          handleClose={() => setIsAddBookModalOpen(false)}
        >
          <BookForm
            isOpen={isAddBookModalOpen}
            handleClose={() => setIsAddBookModalOpen(false)}
          />
        </Modal>
      )}

      {isAddAuthorModalOpen && (
        <Modal
          isOpen={isAddAuthorModalOpen}
          handleClose={() => setIsAddAuthorModalOpen(false)}
        >
          <AuthorForm
            isOpen={isAddAuthorModalOpen}
            handleClose={() => setIsAddAuthorModalOpen(false)}
          />
        </Modal>
      )}
    </>
  );
} 