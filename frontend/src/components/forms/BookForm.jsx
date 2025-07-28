"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchPresignedURL } from "@/lib/repository";
import client from "@/lib/apollo";
import { CREATE_BOOK, GET_AUTHOR_NAME_ID, UPDATE_BOOK } from "@/lib/queries";
import FormTextArea from "./components/FormTextArea";
import FormLabel from "./components/FormLabel";
import FormInput from "./components/FormInput";
import FormSelect from "./components/FormSelect";

export default function BookForm({ book, handleClose }) {
  const router = useRouter();
  const fileInputRef = useRef(null); // Add this ref

  const [authors, setAuthors] = useState([]);

  const [bookTitle, setBookTitle] = useState(book?.title || null);
  const [bookDescription, setBookDescription] = useState(book?.description || null);
  const [bookPublishedDate, setBookPublishedDate] = useState(book?.published_date || null);

  const [coverFile, setCoverFile] = useState(null);
  const [coverUrl, setCoverUrl] = useState(book?.cover_url || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookChanged, setIsBookChanged] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [bookAuthorId, setBookAuthorId] = useState(book?.author?.id || "");

  const isFormValid = bookTitle?.trim()?.length > 0 && bookAuthorId != "" && bookPublishedDate != null;
  const isEditing = book?.id != null;

  useEffect(() => {
    const fetchAuthors = async () => {
      const { data: authorsData } = await client.query({
      query: GET_AUTHOR_NAME_ID,
    });
    setAuthors(authorsData.authorNameId);
  };
  fetchAuthors();
}, []);

  useEffect(() => {
    setBookTitle(book?.title || null);
    setBookDescription(book?.description || null);
    setBookPublishedDate(book?.published_date || null);
    setCoverUrl(book?.cover_url || null);
    setBookAuthorId(book?.author?.id || "");
  }, [book]);

  useEffect(() => {
    if (isEditing) {
      setIsBookChanged(
        bookTitle !== book?.title ||
        bookDescription !== book?.description ||
        bookPublishedDate !== book?.published_date ||
        coverUrl !== book?.cover_url ||
        bookAuthorId !== book?.author?.id
      );
    }
  }, [bookTitle, bookDescription, bookPublishedDate, coverUrl, bookAuthorId]);

  useEffect(() => {
    setCanSubmit(() => {
      if(isEditing && !isBookChanged) {
        return false;
      }
      return isFormValid && !isUploading && !isSubmitting ;
    });
  }, [isBookChanged, isFormValid, isUploading, isSubmitting, bookAuthorId]);

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
    setCoverUrl(null);
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
      setCoverUrl(fileUrl);

      console.log("Upload successful!", fileUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      resetFileInput();
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const createBook = async () => {
    const { data: bookData } = await client.mutate({
      mutation: CREATE_BOOK,
      variables: {
        input: {
          title: bookTitle,
          description: bookDescription,
          published_date: bookPublishedDate,
          cover_url: coverUrl,
          author_id: bookAuthorId,
        },
      },
    });
    alert("Book created successfully!");
    return bookData.createBook;
  }

  const updateBook = async () => {
    const { data: bookData } = await client.mutate({
      mutation: UPDATE_BOOK,
      variables: {
        id: book.id,
        input: {
          title: bookTitle,
          description: bookDescription,
          published_date: bookPublishedDate,
          cover_url: coverUrl,
          author_id: bookAuthorId,
        },
      },
    });
    alert("Book updated successfully!");
    return bookData.updateBook;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bookTitle.trim()) {
      alert("Title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const book = isEditing ? await updateBook() : await createBook();
      handleClose();
      router.push(`/books/${book.id}`);
    } catch (error) {
      console.error("Error creating book:", error);
      alert("Failed to create book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    handleClose();
    // router.back();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h1 className="text-2xl font-bold text-slate-700 mb-8">
        Create New Book
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <FormLabel label="Title" name="title" required={true} />
          <FormInput
            type="text"
            id="title"
            name="title"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
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
            value={bookAuthorId}
            onChange={(e) => setBookAuthorId(e.target.value)}
          >
            <option value="">Select an author</option>
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
            value={bookDescription}
            onChange={(e) => setBookDescription(e.target.value)}
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
            value={bookPublishedDate}
            onChange={(e) => setBookPublishedDate(e.target.value)}
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

            {coverUrl && !isUploading && (
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
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              !canSubmit
                ? "bg-blue-300 text-blue-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Creating Book...
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
