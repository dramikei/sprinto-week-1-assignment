"use client";

import { useState, useEffect } from "react";
import AuthorCards from "./components/AuthorCards";
import { GET_AUTHORS } from "@/lib/queries";
import client from "@/lib/apollo";
import PaginationButton from "../ui/PaginationButton";
import { useDebounce } from "@/utils/utils";

export default function AuthorsSearchAndList({
  initialAuthors,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [authors, setAuthors] = useState(initialAuthors);
  const [totalCount, setTotalCount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  
  const [pageInfo, setPageInfo] = useState({
    nextCursor: null,
    previousCursor: null,
    hasNextPage: false,
    hasPreviousPage: false
  });

  // Debounce search values
  const debouncedSearchTerm = useDebounce(searchTerm, 350);
  const debouncedBirthYear = useDebounce(birthYear, 350);

  useEffect(() => {
    setAuthors(initialAuthors);
  }, [initialAuthors]);

  const updateSearch = async (nextCursor = null, previousCursor = null) => {
    setIsLoading(true);

    try {
      const { data: authorsData } = await client.query({
        query: GET_AUTHORS,
        variables: {
          first: 10,
          after: nextCursor,
          before: previousCursor,
          filter: {
            name: debouncedSearchTerm,
            birth_year: debouncedBirthYear ? +debouncedBirthYear : null,
          },
        },
      });

      console.log(JSON.stringify(authorsData?.authors?.pageInfo, null, 2));
      setPageInfo({
        nextCursor: authorsData?.authors?.pageInfo?.nextCursor,
        previousCursor: authorsData?.authors?.pageInfo?.previousCursor,
        hasNextPage: authorsData?.authors?.pageInfo?.hasNextPage,
        hasPreviousPage: authorsData?.authors?.pageInfo?.hasPreviousPage
      });
      setAuthors(authorsData?.authors?.edges ?? []);
      setTotalCount(authorsData?.authors?.totalCount ?? 0);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPage = async () => {
    updateSearch(pageInfo.nextCursor, null);
  }

  const handlePreviousPage = async () => {
    updateSearch(null, pageInfo.previousCursor);
  }

  useEffect(() => {
    updateSearch();
  }, [debouncedSearchTerm, debouncedBirthYear]);

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Authors Header with Count */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-slate-700 mb-4">
          Authors ({totalCount})
        </h2>

        {/* Search Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex-1 sm:max-w-xs">
            <input
              type="text"
              placeholder="Birth year..."
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Authors Grid */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            <span className="ml-2 text-gray-600">Searching...</span>
          </div>
        ) : authors.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No authors found
            </h3>
            <p className="text-gray-500">
              {searchTerm || birthYear
                ? "Try adjusting your search criteria."
                : "No authors have been added yet."}
            </p>
          </div>
        ) : (
          <AuthorCards
            authors={authors}
            showBirthDate={true}
          />
        )}
      </div>

      {/* Pagination could go here */}
      {authors.length > 0 && (
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-center gap-2">
            <PaginationButton onClick={() => {
              handlePreviousPage();
            }} disabled={!pageInfo.hasPreviousPage}>
              Previous
            </PaginationButton>
            <PaginationButton onClick={() => {
              handleNextPage();
            }} disabled={!pageInfo.hasNextPage}>
              Next
            </PaginationButton>
          </div>
        </div>
      )}
    </div>
  );
}
