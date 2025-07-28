"use client";
import { useQuery } from "@apollo/client";
import { GET_BOOKS, GET_AUTHORS } from "../lib/queries";
import WelcomeSection from "@/components/layouts/WelcomeSection";
import RecentBooksSection from "@/components/layouts/RecentBooksSection";
import RecentAuthorsSection from "@/components/layouts/RecentAuthorsSection";

export default function HomePage() {
  const { 
    data: booksData, 
    loading: booksLoading, 
    error: booksError 
  } = useQuery(GET_BOOKS);

  const { 
    data: authorsData, 
    loading: authorsLoading, 
    error: authorsError 
  } = useQuery(GET_AUTHORS);

  const books = booksData?.books?.edges || [];
  const authors = authorsData?.authors?.edges || [];
  const isLoading = booksLoading || authorsLoading;
  const hasError = booksError || authorsError;

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading data:</p>
          {booksError && <p className="text-sm text-red-500 mb-2">Books: {booksError.message}</p>}
          {authorsError && <p className="text-sm text-red-500">Authors: {authorsError.message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <WelcomeSection books={books} authors={authors} />
        {/* Recent Books Section */}
        <RecentBooksSection books={books} authors={authors} />

        {/* Recent Authors Section */}
        <RecentAuthorsSection authors={authors} />
      </main>
    </div>
  );
}
