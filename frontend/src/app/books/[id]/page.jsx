"use client";
import Link from 'next/link';
import ReviewForm from '@/components/forms/ReviewForm';
import EditButton from '@/components/ui/EditButton';
import DeleteButton from '@/components/ui/DeleteButton';
import client from '@/lib/apollo';
import { GET_BOOK, CREATE_REVIEW, DELETE_BOOK } from '@/lib/queries';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function BookDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [book, setBook] = useState({});
  const [reviews, setReviews] = useState([]);

  async function getBook(id) {
    const { data: bookData } = await client.query({
      query: GET_BOOK,
      variables: {
        id: id
      }
    });
    return bookData.book;
  }
  
  async function submitReview({ comment, rating}) {
    const { data } = await client.mutate({
      mutation: CREATE_REVIEW,
      variables: {
        book_id: book.id,
        comment: comment ?? "",
        rating: +rating // TODO: - Do better validation using zod
      }
    });
    setReviews([...reviews, data.createReview]);
  }

  const deleteBook = async () => {
    try {
      await client.mutate({
        mutation: DELETE_BOOK,
        variables: {
          id: id
        }
      });
      router.push("/books");
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete book. Please try again.");
    }
  }

  useEffect(() => {
    const fetchBook = async () => {
    try {
      const book = await getBook(id);
    setBook(book);
    setReviews(book.reviews ?? []);
  } catch(error) {
      console.log(error);
      alert("Error fetching book");
      setBook(null);
      setReviews([]);
    }
  }
  fetchBook();
  }, []);


  return (
    <div className="min-h-screen bg-gray-100">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Book Header */}
          <div className="flex flex-col md:flex-row gap-8 mb-8 items-center">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              <div className="w-64 h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                {book?.cover_url ? (
                  <img src={book?.cover_url} alt={book.title} />
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
                  <span className="text-gray-800 text-xl mt-0.5">{book?.average_rating + " 🌟"}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <EditButton title="Edit Book" onClick={() => {
                  router.push(`/books/${id}/edit`);
                }} />
                <DeleteButton title="Delete Book" onClick={() => {
                  if(confirm("Are you sure you want to delete this book?")) {
                    deleteBook();
                  }
                }} /> 
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
              <ReviewForm bookId={book?.id} onSubmit={submitReview} onComplete={() => {

              }} />
            </div>

            {/* Existing Reviews */}
            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No reviews yet</p>
                <p className="text-gray-400">Be the first to review this book!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review?.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{review?.author}</span>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review?.rating ? 'text-yellow-400' : 'text-gray-300'}>
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
    </div>
  );
}