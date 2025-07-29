"use client";
import Link from 'next/link';
import ReviewForm from '@/components/forms/ReviewForm';
import EditButton from '@/components/ui/EditButton';
import DeleteButton from '@/components/ui/DeleteButton';
import { useQuery, useMutation } from '@apollo/client';
import { GET_BOOK, CREATE_REVIEW, DELETE_BOOK } from '@/lib/queries';
import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import BookForm from '@/components/forms/BookForm';
import Modal from '@/components/modal/Model';
import Image from 'next/image';

export default function BookDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [isEditBookModalOpen, setIsEditBookModalOpen] = useState(false);

  // Apollo query to fetch book data
  const { data, loading, error, refetch } = useQuery(GET_BOOK, {
    variables: { id }
  });

  const book = data?.book;
  const reviews = book?.reviews || [];

  // Apollo mutation for creating review
  const [createReviewMutation, { loading: reviewLoading }] = useMutation(CREATE_REVIEW, {
    onCompleted: () => {
      // Refetch the book data to get updated reviews
      refetch();
    },
    onError: (error) => {
      console.error("Error creating review:", error);
      alert("Failed to create review. Please try again.");
    }
  });

  // Apollo mutation for deleting book
  const [deleteBookMutation, { loading: deleteLoading }] = useMutation(DELETE_BOOK, {
    variables: { id },
    onCompleted: () => {
      router.push("/books");
    },
    onError: (error) => {
      console.error("Error deleting book:", error);
      alert("Failed to delete book. Please try again.");
    },
    update: (cache) => {
      // Remove the author from all cached GET_AUTHORS queries
      cache.evict({ id: `Book:${id}` });
      cache.gc();
    },
    refetchQueries: ["GetBooks"] // Refetch books list after deletion
  });

  const submitReview = async ({ comment, rating }) => {
    await createReviewMutation({
      variables: {
        book_id: book.id,
        comment: comment ?? "",
        rating: +rating
      }
    });
  };

  const handleDeleteBook = () => {
    if (confirm("Are you sure you want to delete this book?")) {
      deleteBookMutation();
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading book:</p>
          <p className="text-sm text-red-500">{error.message}</p>
        </div>
      </div>
    );
  }

  // Show not found if no book
  if (!book) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Book not found</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Book Header */}
          <div className="flex flex-col md:flex-row gap-8 mb-8 items-center">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              <div className="w-48 h-64 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                {book?.cover_url ? (
                  <Image
                    src={book?.cover_url}
                    alt={book.title}
                    width={192}
                    height={256}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 text-lg">No Cover</span>
                )}
              </div>
            </div>

            {/* Book Info */}
            <div className="flex-1">
              {/* Title */}
              <h1 className="text-3xl font-bold text-slate-700 mb-4">
                {book?.title}
              </h1>

              {/* Author */}
              <div className="mb-4">
                <span className="text-gray-600">by </span>
                <Link
                  href={`/authors/${book?.author?.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {book?.author?.name}
                </Link>
              </div>

              {/* Publish Date */}
              <div className="mb-3">
                <span className="text-gray-600">Published: </span>
                <span className="text-gray-800">{book?.publishDate}</span>
              </div>

              {/* Average Rating */}
              {book?.average_rating && (
                <div className="mb-6 flex items-center gap-2">
                  <span className="text-gray-600">Average Rating: </span>
                  <span className="text-gray-800 text-xl mt-0.5">
                    {book?.average_rating + " 🌟"}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <EditButton
                  title="Edit Book"
                  onClick={() => {
                    setIsEditBookModalOpen(true);
                  }}
                />
                <DeleteButton
                  title="Delete Book"
                  onClick={handleDeleteBook}
                  disabled={deleteLoading}
                />
              </div>
            </div>
          </div>

          {/* Description Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-700 mb-4 border-b-2 border-blue-500 pb-2">
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {book?.description ?? "No description available"}
            </p>
          </section>

          {/* Reviews Section */}
          <section>
            <h2 className="text-2xl font-bold text-slate-700 mb-6 border-b-2 border-blue-500 pb-2">
              Reviews
            </h2>

            {/* Write a Review */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-slate-700 mb-4">
                Write a Review
              </h3>
              <ReviewForm
                bookId={book?.id}
                onSubmit={submitReview}
                onComplete={() => {}}
                disabled={reviewLoading}
              />
            </div>

            {/* Existing Reviews */}
            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No reviews yet</p>
                <p className="text-gray-400">
                  Be the first to review this book!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review?.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{review?.author}</span>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < review?.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review?.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {isEditBookModalOpen && (
        <Modal
          isOpen={isEditBookModalOpen}
          handleClose={() => setIsEditBookModalOpen(false)}
        >
          <BookForm
            isOpen={isEditBookModalOpen}
            handleClose={() => setIsEditBookModalOpen(false)}
            book={book}
          />
        </Modal>
      )}
    </div>
  );
}