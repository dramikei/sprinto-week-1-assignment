"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchPresignedURL } from "@/lib/repository";
import client from "@/lib/apollo";
import { CREATE_AUTHOR } from "@/lib/queries";
import FormTextArea from "./components/FormTextArea";
import FormLabel from "./components/FormLabel";
import FormInput from "./components/FormInput";

export default function CreateAuthorForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    biography: "",
    birthDate: "",
    photo: null,
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getPresignedUrl = async (fileName) => {
    if (fileName) {
      try {
        const { uploadUrl, fileUrl } = await fetchPresignedURL(fileName, "photo");
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
        throw new Error("Failed to upload image. Please try again.", response.body);
      }
      return response;
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw new Error("Failed to upload image. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      setFormData((prev) => ({
        ...prev,
        photo: fileUrl,
      }));

      console.log("Upload successful!", fileUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
      setPhotoFile(null);
      setFormData((prev) => ({
        ...prev,
        photo: null,
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Creating author with data:", formData);

      // API call
      const { data } = await client.mutate({
        mutation: CREATE_AUTHOR,
        variables: {
          input: {
            name: formData.name,
            biography: formData.biography,
            born_date: formData.birthDate,
            photo_url: formData.photo,
          },
        },
      });
      console.log(data);
      alert("Author created successfully!");
      router.push("/authors");
    } catch (error) {
      console.error("Error creating author:", error);
      alert("Failed to create author. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const isFormValid = formData.name.trim().length > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h1 className="text-2xl font-bold text-slate-700 mb-8">
        Create New Author
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <FormLabel label="Name" name="name" required={true} />
          <FormInput
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter author's full name"
            required={true}
          />
        </div>

        {/* Biography Field */}
        <div>
          <FormLabel label="Biography" name="biography" />
          <FormTextArea id="biography" name="biography" value={formData.biography} onChange={handleInputChange} rows={6} placeholder="Enter author's biography..." />
        </div>

        {/* Birth Date Field */}
        <div>
          <FormLabel label="Birth Date" name="birthDate" />
          <FormInput
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleInputChange}
            placeholder="dd/mm/yyyy"
          />
        </div>

        {/* Author Photo Field */}
        <div>
          <FormLabel label="Author Photo" name="photo" />
          <div className="space-y-3">
            <FormInput
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
              <div className="text-sm text-gray-600">
                Selected: {photoFile.name} (
                {(photoFile.size / 1024 / 1024).toFixed(2)} MB)
              </div>
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
            disabled={!isFormValid || isUploading || isSubmitting}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              !isFormValid || isUploading || isSubmitting
                ? "bg-blue-300 text-blue-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Creating Author...
              </div>
            ) : (
              "Create Author"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
