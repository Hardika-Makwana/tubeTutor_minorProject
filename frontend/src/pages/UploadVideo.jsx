import React, { useState } from 'react';
import { uploadVideo } from '../services/api';

export default function UploadVideo() {
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
      await uploadVideo(formData);
      setMessage('Upload successful!');
    } catch (error) {
      console.error(error);
      setMessage('Upload failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-pink-50 flex items-center justify-center p-10">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-purple-700 text-center mb-4">Upload Video</h1>

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

        {message && <p className="text-green-600 font-medium mt-2 text-center">{message}</p>}
      </div>
    </div>
  );
}

