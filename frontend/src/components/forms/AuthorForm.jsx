"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { fetchPresignedURL } from "@/lib/repository";
import { CREATE_AUTHOR, UPDATE_AUTHOR } from "@/lib/queries";
import FormTextArea from "./components/FormTextArea";
import FormLabel from "./components/FormLabel";
import FormInput from "./components/FormInput";

export default function AuthorForm({ author, handleClose }) {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [authorName, setAuthorName] = useState(author?.name || "");
  const [authorBiography, setAuthorBiography] = useState(author?.biography || "");
  const [authorBirthDate, setAuthorBirthDate] = useState(author?.born_date || "");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(author?.photo_url || "");
  const [isUploading, setIsUploading] = useState(false);

  const isEditing = author?.id != null;
  const isFormValid = authorName?.trim()?.length > 0;

  const [createAuthor, { loading: createLoading }] = useMutation(CREATE_AUTHOR, {
    onCompleted: (data) => {
      alert("Author created successfully!");
      handleClose();
      router.push(`/authors/${data.createAuthor.id}`);
    },
    refetchQueries: ["GetAuthors"], // Use the GraphQL operation name, not the variable name
    onError: (error) => {
      console.error("Error creating author:", error);
      alert("Failed to create author. Please try again.");
    },
  });

  const [updateAuthor, { loading: updateLoading }] = useMutation(UPDATE_AUTHOR, {
    onCompleted: (data) => {
      alert("Author updated successfully!");
      handleClose();
      router.push(`/authors/${data.updateAuthor.id}`);
    },
    refetchQueries: ["GetAuthors"],
    onError: (error) => {
      console.error("Error updating author:", error);
      alert("Failed to update author. Please try again.");
    }
  });

  const isLoading = createLoading || updateLoading;

  useEffect(() => {
    setAuthorName(author?.name || "");
    setAuthorBiography(author?.biography || "");
    setAuthorBirthDate(author?.born_date || "");
    setPhotoUrl(author?.photo_url || "");
  }, [author]);

  const getPresignedUrl = async (fileName) => {
    if (fileName) {
      try {
        const { uploadUrl, fileUrl } = await fetchPresignedURL(
          fileName,
          "photo"
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
    setPhotoFile(null);
    setPhotoUrl(null);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoFile(file);
    setIsUploading(true);

    try {
      // Step 1: Get presigned URL
      const { uploadUrl, fileUrl } = await getPresignedUrl(file.name);

      // Step 2: Upload file to S3
      await uploadToS3(uploadUrl, file);

      // Step 3: Save the file URL
      setPhotoUrl(fileUrl);

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

    if (!authorName.trim()) {
      alert("Name is required");
      return;
    }

    const variables = {
      input: {
        name: authorName,
        biography: authorBiography,
        born_date: authorBirthDate,
        photo_url: photoUrl,
      },
    };

    try {
      if (isEditing) {
        await updateAuthor({
          variables: {
            id: author.id,
            ...variables,
          },
        });
      } else {
        await createAuthor({ variables });
      }
    } catch (error) {
      // Error handling is done in the mutation's onError callback
      console.error("Error submitting form:", error);
    }
  };

  const handleCancel = () => {
    handleClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h1 className="text-2xl font-bold text-slate-700 mb-8">
        {isEditing ? "Edit Author" : "Create New Author"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <FormLabel label="Name" name="name" required={true} />
          <FormInput
            type="text"
            id="name"
            name="name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Enter author's full name"
            required={true}
          />
        </div>

        {/* Biography Field */}
        <div>
          <FormLabel label="Biography" name="biography" />
          <FormTextArea
            id="biography"
            name="biography"
            value={authorBiography}
            onChange={(e) => setAuthorBiography(e.target.value)}
            rows={6}
            placeholder="Enter author's biography..."
          />
        </div>

        {/* Birth Date Field */}
        <div>
          <FormLabel label="Birth Date" name="birthDate" />
          <FormInput
            type="date"
            id="birthDate"
            name="birthDate"
            value={authorBirthDate}
            onChange={(e) => setAuthorBirthDate(e.target.value)}
            placeholder="dd/mm/yyyy"
          />
        </div>

        {/* Author Photo Field */}
        <div>
          <FormLabel label="Author Photo" name="photo" />
          <div className="space-y-3">
            <FormInput
              ref={fileInputRef}
              type="file"
              id="photo"
              name="photo"
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

            {photoUrl && !isUploading && (
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

            {photoFile && !isUploading && (
              <>
                <div className="text-sm text-gray-600">
                  Selected: {photoFile.name} (
                  {(photoFile.size / 1024 / 1024).toFixed(2)} MB)
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
            disabled={!isFormValid || isUploading || isLoading}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              !isFormValid || isUploading || isLoading
                ? "bg-blue-300 text-blue-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                {isEditing ? "Updating Author..." : "Creating Author..."}
              </div>
            ) : (
              isEditing ? "Update Author" : "Create Author"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
