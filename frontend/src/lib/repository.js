
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export async function fetchPresignedURL(fileName, uploadType) {
  try {
    const response = await fetch(`${API_BASE_URL}/presignedUrl?name=${fileName}&uploadType=${uploadType}`, {
        method: "GET",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch presigned URL");
    }
    return response.json();;
  } catch (error) {
    console.error("Error fetching presigned URL:", error);
    throw error;
  }
}
