"use client";

import { log } from "console";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function UploadPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState("sales");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileType);
    formData.append("userid", user?.primaryEmailAddress?.emailAddress)
    

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ File uploaded successfully!");
      } else {
        console.log(data);
        
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Failed to upload file.");
    }

    setUploading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">📂 Upload Excel File</h1>
        <select
        className="p-2 border rounded w-full"
        value={fileType}
        onChange={(e) => setFileType(e.target.value)}
      >
        <option value="sales">Sales Data</option>
        <option value="payments">Payment Trends</option>
      </select>

        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {uploading ? "Uploading..." : "Upload File"}
        </button>
        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </div>
    </div>
  );
}
