import BooksSearchAndList from '@/components/layouts/BooksSearchAndListSection';
import client from '@/lib/apollo';
import { GET_BOOKS } from '@/lib/queries';

const getInitialBooks = async () => {
  const { data: booksData } = await client.query({
    query: GET_BOOKS,
    variables: { first: 6 },
  });
  return booksData?.books?.edges ?? [];
};

export default async function BooksPage({ searchParams }) {
  const books = await getInitialBooks(searchParams);

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