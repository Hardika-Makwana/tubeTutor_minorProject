import React, { useState } from "react";
import axios from "axios";

export default function Admin() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://127.0.0.1:8000/upload_video", formData);
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Upload failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-purple-50 to-pink-50">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">Admin Panel</h1>
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 flex flex-col gap-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleUpload}
          className="bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition"
        >
          Upload Video
        </button>
        {message && <p className="text-green-600 font-medium">{message}</p>}
      </div>
    </div>
  );
}



