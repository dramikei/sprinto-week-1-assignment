"use client";
import BooksSearchAndList from '@/components/layouts/BooksSearchAndListSection';
import { useQuery } from '@apollo/client';
import { GET_BOOKS } from '@/lib/queries';


export default function BooksPage() {
  const { data, loading, error } = useQuery(GET_BOOKS, {
    variables: {
      first: 10
    }
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error loading books</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Books Search and List Component */}
        <BooksSearchAndList 
          initialBooks={data?.books?.edges || []}
          initialLoading={loading}
        />
      </main>
    </div>
  );
}