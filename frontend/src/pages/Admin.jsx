import React, { useState } from 'react';
import axios from 'axios';

export default function Admin() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://127.0.0.1:8000/upload_video/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage('Upload failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-purple-700 mb-8">Admin Panel - Upload Videos</h1>

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="p-2 border border-purple-200 rounded"
        />
        <button
          onClick={handleUpload}
          className="bg-purple-400 text-white py-2 rounded font-semibold hover:bg-purple-500 transition"
        >
          Upload
        </button>
        {message && <p className="text-green-600 font-medium mt-2">{message}</p>}
      </div>
    </div>
  );
}


