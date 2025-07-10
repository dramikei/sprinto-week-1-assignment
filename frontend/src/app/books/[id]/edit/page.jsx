"use client";
import BookForm from '@/components/forms/BookForm';
import { GET_AUTHOR_NAME_ID, GET_BOOK } from '@/lib/queries';
import { use, useEffect, useState } from 'react';
import client from '@/lib/apollo';

export default function EditBookPage({ params }) {
  const bookId = use(params).id;
  const [book, setBook] = useState(null);
  const [authors, setAuthors] = useState([]);

  async function getAuthors() {
    const { data: authorsData } = await client.query({
      query: GET_AUTHOR_NAME_ID,
    });
    return authorsData.authorNameId;
  }

  async function getBook(id) {
    try {
      const { data: bookData } = await client.query({
        query: GET_BOOK,
        variables: { id },
      });
      return bookData.book;
    } catch (error) {
      console.error("Error fetching book:", error);
    }
  }

  useEffect(() => {
    const fetchBook = async () => { 
      try {
        Promise.all([getBook(bookId), getAuthors()]).then(([book, authors]) => {
          setBook(book);
          setAuthors(authors);
        });
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    }
    fetchBook();
  }, [bookId]);
  return (  
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="flex justify-center items-start min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-4xl">
          <BookForm book={book} authors={authors} />
        </div>
      </main>
    </div>
  );
}