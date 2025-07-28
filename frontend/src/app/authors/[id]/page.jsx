"use client";
import Link from 'next/link';
import Image from 'next/image';
import { use, useEffect, useState } from 'react';
import client from '@/lib/apollo';
import { DELETE_AUTHOR, GET_AUTHOR } from '@/lib/queries';
import DeleteButton from '@/components/ui/DeleteButton';
import EditButton from '@/components/ui/EditButton';
import { useRouter } from 'next/navigation';
import AuthorForm from '@/components/forms/AuthorForm';
import Modal from '@/components/modal/Model';

// This would typically come from your database/API
async function getAuthor(id) {
  // Mock data - replace with actual API call
  const { data: authorData } = await client.query({
    query: GET_AUTHOR,
    variables: {
      id: id
    }
  });
  return authorData.author;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

export default function AuthorDetailPage({ params }) {
  const router = useRouter();
  const authorId = use(params).id;
  const [author, setAuthor] = useState(null);
  const [isEditAuthorModalOpen, setIsEditAuthorModalOpen] = useState(false);

  useEffect(() => {
    const fetchAuthor = async () => { 
      try {
        const author = await getAuthor(authorId);
        setAuthor(author);
      } catch (error) {
        console.error("Error fetching author:", error);
      }
    }
    fetchAuthor();
  }, [authorId]);

  const deleteAuthor = async () => {
    try {
      await client.mutate({
        mutation: DELETE_AUTHOR,
        variables: {
          id: authorId
        }
      });
      router.push("/authors");
    } catch (error) {
      console.error("Error deleting author:", error);
      alert("Failed to delete author. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Author Header */}
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Author Photo */}
              <div className="flex-shrink-0">
                <div className="w-48 h-48 bg-gray-200 rounded-lg overflow-hidden">
                  {author?.photo_url ? (
                    <Image
                      src={author?.photo_url}
                      alt={author?.name}
                      width={192}
                      height={192}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      👤
                    </div>
                  )}
                </div>
              </div>

              {/* Author Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-slate-700 mb-4">
                  {author?.name}
                </h1>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-gray-600">
                      Born: {formatDate(author?.born_date)} (Age{" "}
                      {calculateAge(author?.born_date)})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <span className="text-gray-600">
                      {author?.totalBooks}{" "}
                      {author?.totalBooks === 1 ? "Book" : "Books"} Published
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <EditButton
                    id={author?.id}
                    title="Edit Author"
                    onClick={() => {
                      setIsEditAuthorModalOpen(true);
                    }}
                  />
                  <DeleteButton
                    id={author?.id}
                    title="Delete Author"
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this author?")
                      ) {
                        deleteAuthor();
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Biography Section */}
          <div className="border-t border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-slate-700 mb-4 border-b-2 border-blue-500 pb-2">
              Biography
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {author?.biography}
            </p>
          </div>

          {/* Books Section */}
          <div className="border-t border-gray-200 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-700 border-b-2 border-blue-500 pb-2">
                Books by {author?.name}
              </h2>
              {author?.totalBooks > 3 && (
                <Link
                  href={`/books`}
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  View All ({author?.totalBooks})
                </Link>
              )}
            </div>

            {author?.books.length === 0 ? (
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
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No books published yet
                </h3>
                <p className="text-gray-500">
                  This author hasn't published any books in our system.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {author?.books.slice(0, 3).map((book) => (
                  <Link
                    key={book.id}
                    href={`/books/${book.id}`}
                    className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex flex-col h-full">
                      {/* Book Cover */}
                      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gray-300 transition-colors">
                        {book.coverImage ? (
                          <Image
                            src={book.coverImage}
                            alt={book.title}
                            width={192}
                            height={192}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-gray-500">No Cover</span>
                        )}
                      </div>

                      {/* Book Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-slate-700 mb-2 group-hover:text-blue-600 transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          Published: {formatDate(book.publishedDate)}
                        </p>
                        {book.description && (
                          <p className="text-gray-600 text-sm line-clamp-3">
                            {book.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {isEditAuthorModalOpen && (
        <Modal
          isOpen={isEditAuthorModalOpen}
          handleClose={() => setIsEditAuthorModalOpen(false)}
        >
          <AuthorForm
            author={author}
            isOpen={isEditAuthorModalOpen}
            handleClose={() => setIsEditAuthorModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}