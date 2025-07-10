import AuthorsSearchAndList from '@/components/layouts/AuthorsSearchAndListSection';
import client from '@/lib/apollo';
import { GET_AUTHORS } from '@/lib/queries';

const getInitialAuthors = async () => {
  const { data: authorsData } = await client.query({
    query: GET_AUTHORS,
    variables: { first: 6 },
  });
  return authorsData?.authors?.edges ?? [];
};

export default async function AuthorsPage({ searchParams }) {
  const authors = await getInitialAuthors(searchParams);

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