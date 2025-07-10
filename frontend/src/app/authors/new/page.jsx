import AuthorForm from '@/components/forms/AuthorForm';

export default function CreateAuthorPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="flex justify-center items-start min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-4xl">
          <AuthorForm />
        </div>
      </main>
    </div>
  );
}