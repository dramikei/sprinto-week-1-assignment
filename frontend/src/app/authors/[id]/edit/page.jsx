"use client";
import AuthorForm from '@/components/forms/AuthorForm';
import { GET_AUTHOR } from '@/lib/queries';
import { use, useEffect, useState } from 'react';
import client from '@/lib/apollo';

export default function EditAuthorPage({ params }) {
  const authorId = use(params).id;
  const [author, setAuthor] = useState(null);

  async function getAuthor(id) {
    try {
      const { data: authorData } = await client.query({
        query: GET_AUTHOR,
        variables: { id },
      });
      return authorData.author;
    } catch (error) {
      console.error("Error fetching author:", error);
    }
  }

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
  return (  
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="flex justify-center items-start min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-4xl">
          <AuthorForm author={author} />
        </div>
      </main>
    </div>
  );
}