"use client";
import AuthorsSearchAndList from '@/components/layouts/AuthorsSearchAndListSection';
import client from '@/lib/apollo';
import { GET_AUTHORS } from '@/lib/queries';
import { useEffect, useState } from 'react';


export default function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  
  useEffect(() => {
    const fetchAuthors = async () => {
      const { data: authorsData } = await client.query({
        query: GET_AUTHORS,
        variables: { first: 6 },
      });
      setAuthors(authorsData?.authors?.edges ?? []);
    };
    fetchAuthors();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Authors Search and List Component */}
        <AuthorsSearchAndList 
          initialAuthors={authors}
        />
      </main>
    </div>
  );
}