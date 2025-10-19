import React, { useState } from "react";
import axios from "axios";

export default function UploadVideo({ role }) {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [message, setMessage] = useState("");

  if (role !== "admin") {
    return <p style={{textAlign:"center", marginTop:"2rem"}}>Only admin can upload videos.</p>
  }

  const handleUpload = async () => {
    if (!file) return setMessage("Select a video first");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://127.0.0.1:8000/upload_video", formData);
      setMessage(res.data.message || "Uploaded successfully");
    } catch (err) {
      setMessage("Upload failed");
    }
  };

  const handleSaveTranscript = async () => {
    if (!transcript) return setMessage("Enter transcript");
    const formData = new FormData();
    formData.append("video_id", file.name);
    formData.append("text", transcript);

    try {
      const res = await axios.post("http://127.0.0.1:8000/transcript", formData);
      setMessage(res.data.message || "Transcript saved");
    } catch (err) {
      setMessage("Save failed");
    }
  };

  return (
    <div className="upload-container">
      <h1>Upload Video</h1>
      <div className="card upload-card">
        <input type="file" onChange={(e)=>setFile(e.target.files[0])}/>
        <button className="btn-upload" onClick={handleUpload}>Upload Video</button>
        <textarea
          placeholder="Enter transcript..."
          value={transcript}
          onChange={(e)=>setTranscript(e.target.value)}
          rows={6}
        />
        <button className="btn-save" onClick={handleSaveTranscript}>Save Transcript</button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}




