"use client";
import client from "../lib/apollo";
import { GET_BOOKS, GET_AUTHORS } from "../lib/queries";
import WelcomeSection from "@/components/layouts/WelcomeSection";
import RecentBooksSection from "@/components/layouts/RecentBooksSection";
import RecentAuthorsSection from "@/components/layouts/RecentAuthorsSection";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data: booksData } = await client.query({
        query: GET_BOOKS,
        variables: { first: 6 },
      });
      setBooks(booksData?.books?.edges || []);
    };

    const fetchAuthors = async () => {
      const { data: authorsData } = await client.query({
        query: GET_AUTHORS,
        variables: { first: 6 },
      });
      setAuthors(authorsData?.authors?.edges || []);
    };

    fetchBooks();
    fetchAuthors();
  }, []);

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
