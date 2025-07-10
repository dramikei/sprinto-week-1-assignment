import client from "../lib/apollo";
import { GET_BOOKS, GET_AUTHORS } from "../lib/queries";
import WelcomeSection from "@/components/layouts/WelcomeSection";
import RecentBooksSection from "@/components/layouts/RecentBooksSection";
import RecentAuthorsSection from "@/components/layouts/RecentAuthorsSection";
// TODO: - design the home page
export default async function HomePage() {
  const { data: booksData } = await client.query({
    query: GET_BOOKS,
    variables: { first: 6 },
  });

  const { data: authorsData } = await client.query({
    query: GET_AUTHORS,
    variables: { first: 6 },
  });

  const recentBooks = booksData?.books?.edges || [];
  const recentAuthors = authorsData?.authors?.edges || [];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <WelcomeSection books={recentBooks} authors={recentAuthors} />
        {/* Recent Books Section */}
        <RecentBooksSection books={recentBooks} authors={recentAuthors} />

        {/* Recent Authors Section */}
        <RecentAuthorsSection authors={recentAuthors} />
      </main>
    </div>
  );
}
