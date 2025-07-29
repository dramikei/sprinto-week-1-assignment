"use client";
import AuthorsSearchAndList from '@/components/layouts/AuthorsSearchAndListSection';
import { useQuery } from '@apollo/client';
import { GET_AUTHORS } from '@/lib/queries';


export default function AuthorsPage() {
  const { data, loading, error } = useQuery(GET_AUTHORS, {
    variables: {
      first: 10
    }
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error loading authors</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Authors Search and List Component */}
        <AuthorsSearchAndList 
          initialAuthors={data?.authors?.edges ?? []}
          initialLoading={loading}
        />
      </main>
    </div>
  );
}