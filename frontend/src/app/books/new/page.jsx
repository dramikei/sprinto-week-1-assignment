import BookForm from '@/components/forms/BookForm';
import { GET_AUTHOR_NAME_ID, GET_AUTHORS } from '@/lib/queries';
import client from '@/lib/apollo';

async function getAuthors() {
  const { data: authorsData } = await client.query({
    query: GET_AUTHOR_NAME_ID,
  });
  return authorsData.authorNameId;
}

export default async function CreateBookPage() {
  const authors = await getAuthors();

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