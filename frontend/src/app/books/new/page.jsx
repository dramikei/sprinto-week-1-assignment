"use client";
import BookForm from '@/components/forms/BookForm';
import { GET_AUTHOR_NAME_ID } from '@/lib/queries';
import client from '@/lib/apollo';
import { useEffect, useState } from 'react';

export default function CreateBookPage() {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      const { data: authorsData } = await client.query({
      query: GET_AUTHOR_NAME_ID,
    });
    setAuthors(authorsData.authorNameId);
  };
  fetchAuthors();
}, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="flex justify-center items-start min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-4xl">
          <BookForm authors={authors} />
        </div>
      </main>
    </div>
  );
}