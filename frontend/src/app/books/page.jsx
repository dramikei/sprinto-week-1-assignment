"use client";
import BooksSearchAndList from '@/components/layouts/BooksSearchAndListSection';
import client from '@/lib/apollo';
import { GET_BOOKS } from '@/lib/queries';
import { useEffect, useState } from 'react';


export default function BooksPage() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data: booksData } = await client.query({
        query: GET_BOOKS,
        variables: { first: 6 },
      });
      setBooks(booksData?.books?.edges || []);
    };
    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Books Search and List Component */}
        <BooksSearchAndList 
          initialBooks={books}
        />
      </main>
    </div>
  );
}