"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import { fetchPresignedURL } from "@/lib/repository";
import { CREATE_BOOK, GET_AUTHOR_NAME_ID, UPDATE_BOOK } from "@/lib/queries";
import FormTextArea from "./components/FormTextArea";
import FormLabel from "./components/FormLabel";
import FormInput from "./components/FormInput";
import FormSelect from "./components/FormSelect";

export default function BookForm({ book, handleClose }) {
  const router = useRouter();
  const fileInputRef = useRef(null);

  // Single book state object instead of multiple states
  const [bookData, setBookData] = useState({
    title: book?.title || "",
    description: book?.description || "",
    published_date: book?.published_date || "",
    cover_url: book?.cover_url || "",
    author_id: book?.author?.id || "",
  });
  
  // Keep track of original cover URL to detect changes
  const [originalCoverUrl] = useState(book?.cover_url || "");
  const [coverFile, setCoverFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const isEditing = book?.id != null;
  const isFormValid = bookData.title?.trim()?.length > 0 && bookData.author_id !== "" && bookData.published_date !== "";

  // Apollo query to fetch authors
  const { data: authorsData, loading: authorsLoading } = useQuery(GET_AUTHOR_NAME_ID);
  const authors = authorsData?.authorNameId || [];

  // Apollo mutations with built-in loading and error handling
  const [createBook, { loading: createLoading }] = useMutation(CREATE_BOOK, {
    onCompleted: (data) => {
      alert("Book created successfully!");
      handleClose();
      router.push(`/books/${data.createBook.id}`);
    },
    refetchQueries: ["GetBooks"], // Use the GraphQL operation name, not the variable name
    onError: (error) => {
      console.error("Error creating book:", error);
      alert("Failed to create book. Please try again.");
    },
  });

  const [updateBook, { loading: updateLoading }] = useMutation(UPDATE_BOOK, {
    onCompleted: (data) => {
      alert("Book updated successfully!");
      handleClose();
      router.push(`/books/${data.updateBook.id}`);
    },
    refetchQueries: ["GetBooks"], // Use the GraphQL operation name, not the variable name
    onError: (error) => {
      console.error("Error updating book:", error);
      alert("Failed to update book. Please try again.");
    }
  });

  // Simple effect to update form when book prop changes
  useEffect(() => {
    setBookData({
      title: book?.title || "",
      description: book?.description || "",
      published_date: book?.published_date || "",
      cover_url: book?.cover_url || "",
      author_id: book?.author?.id || "",
    });
  }, [book]);

  // Check if cover URL has changed from original
  const hasCoverChanged = bookData.cover_url !== originalCoverUrl && bookData.cover_url !== "";

  const isLoading = createLoading || updateLoading;
  const isSubmitDisabled = !isFormValid || isUploading || isLoading || authorsLoading;

  const getPresignedUrl = async (fileName) => {
    if (fileName) {
      try {
        const { uploadUrl, fileUrl } = await fetchPresignedURL(
          fileName,
          "cover"
        );
        return { uploadUrl, fileUrl };
      } catch (error) {
        console.error("Error fetching presigned URL:", error);
        throw new Error("Failed to fetch presigned URL. Please try again.");
      }
    }
    throw new Error("File name is required");
  };

  const uploadToS3 = async (presignedUrl, file) => {
    try {
      const response = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
      });
      if (!response.ok) {
        throw new Error(
          "Failed to upload image. Please try again.",
          response.body
        );
      }
      return response;
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw new Error("Failed to upload image. Please try again.");
    }
  };

  const resetFileInput = () => {
    // Clear the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Reset the state
    setCoverFile(null);
    setBookData(prev => ({ ...prev, cover_url: originalCoverUrl }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCoverFile(file);
    setIsUploading(true);

    try {
      // Step 1: Get presigned URL
      const { uploadUrl, fileUrl } = await getPresignedUrl(file.name);

      // Step 2: Upload file to S3
      await uploadToS3(uploadUrl, file);

      // Step 3: Save the file URL
      setBookData(prev => ({ ...prev, cover_url: fileUrl }));

      console.log("Upload successful!", fileUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      resetFileInput();
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bookData.title.trim()) {
      alert("Title is required");
      return;
    }

    if (!bookData.author_id) {
      alert("Author is required");
      return;
    }

    if (!bookData.published_date) {
      alert("Published date is required");
      return;
    }

    const variables = {
      input: {
        title: bookData.title,
        description: bookData.description,
        published_date: bookData.published_date,
        cover_url: bookData.cover_url,
        author_id: bookData.author_id,
      },
    };

    try {
      if (isEditing) {
        await updateBook({
          variables: {
            id: book.id,
            ...variables,
          },
        });
      } else {
        await createBook({ variables });
      }
    } catch (error) {
      // Error handling is done in the mutation's onError callback
      console.error("Error submitting form:", error);
    }
  };

  const handleCancel = () => {
    handleClose();
    // router.back();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h1 className="text-2xl font-bold text-slate-700 mb-8">
        {isEditing ? "Edit Book" : "Create New Book"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <FormLabel label="Title" name="title" required={true} />
          <FormInput
            type="text"
            id="title"
            name="title"
            value={bookData.title}
            onChange={(e) => setBookData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter book's title"
            required={true}
          />
        </div>

        {/* Author dropdown Field */}
        <div>
          <FormLabel label="Author" name="author" required={true} />

          <FormSelect
            id="author"
            name="author"
            required={true}
            value={bookData.author_id}
            onChange={(e) => setBookData(prev => ({ ...prev, author_id: e.target.value }))}
            disabled={authorsLoading}
          >
            <option value="">
              {authorsLoading ? "Loading authors..." : "Select an author"}
            </option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </FormSelect>
        </div>

        {/* Description Field */}
        <div>
          <FormLabel label="Description" name="description" />
          <FormTextArea
            id="description"
            name="description"
            value={bookData.description}
            onChange={(e) => setBookData(prev => ({ ...prev, description: e.target.value }))}
            rows={6}
            placeholder="Enter book's description..."
          />
        </div>

        {/* Published Date Field */}
        <div>
          <FormLabel label="Published Date" name="publishedDate" required={true} />
          <FormInput
            type="date"
            id="publishedDate"
            name="publishedDate"
            value={bookData.published_date}
            onChange={(e) => setBookData(prev => ({ ...prev, published_date: e.target.value }))}
            placeholder="dd/mm/yyyy"
          />
        </div>

        {/* Cover Field */}
        <div>
          <FormLabel label="Cover" name="cover" />
          <div className="space-y-3">
            <FormInput
              ref={fileInputRef}
              type="file"
              id="cover"
              name="cover"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />

            {/* Upload Status */}
            {isUploading && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-sm">Uploading image...</span>
              </div>
            )}

            {hasCoverChanged && !isUploading && (
              <div className="flex items-center gap-2 text-green-600">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm">Image uploaded successfully!</span>
              </div>
            )}

            {coverFile && !isUploading && (
              <>
                <div className="text-sm text-gray-600">
                  Selected: {coverFile.name} (
                  {(coverFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
                <button
                  type="button"
                  onClick={resetFileInput}
                  className="text-sm text-red-600 hover:text-red-800 underline"
                >
                  Remove selected file
                </button>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              isSubmitDisabled
                ? "bg-blue-300 text-blue-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                {isEditing ? "Updating Book..." : "Creating Book..."}
              </div>
            ) : (
              isEditing ? "Update Book" : "Create Book"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
