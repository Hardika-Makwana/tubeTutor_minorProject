import { useEffect, useState } from "react";

function App() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/videos")
      .then(res => res.json())
      .then(data => setVideos(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">TubeTutor - Transcript Files</h1>
      {videos.length === 0 ? (
        <p>No transcripts found</p>
      ) : (
        <ul className="list-disc pl-6">
          {videos.map((v, i) => (
            <li key={i}>{v}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;


