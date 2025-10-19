import React, { useState } from "react";
import axios from "axios";

export default function UploadVideo() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [transcript, setTranscript] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a video first");
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

  const handleSaveTranscript = async () => {
    if (!transcript) {
      setMessage("Please enter transcript text");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("video_id", file.name); // ideally map to video.id after upload
      formData.append("text", transcript);

      const res = await axios.post("http://127.0.0.1:8000/transcript", formData);
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Failed to save transcript");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-green-50 to-blue-50">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Upload Video</h1>
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 flex flex-col gap-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Upload Video
        </button>
        <textarea
          placeholder="Enter transcript here..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          className="p-2 border rounded h-40 mt-2"
        />
        <button
          onClick={handleSaveTranscript}
          className="bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
        >
          Save Transcript
        </button>
        {message && <p className="text-green-600 font-medium">{message}</p>}
      </div>
    </div>
  );
}


