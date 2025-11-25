import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import axios from "axios";
import "./VideoPlayer.css";

const VideoPlayer = ({ videoId, userId }) => {
  const playerRef = useRef(null);

  const [videoData, setVideoData] = useState({});
  const [checkpointIndex, setCheckpointIndex] = useState(1);
  const [summary, setSummary] = useState("");
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [attempts, setAttempts] = useState(0);

  const fetchCheckpoint = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/checkpoint/${videoId}/${checkpointIndex}`
      );
      setSummary(res.data.summary);
      setQuestions(res.data.questions);
      setVideoData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCheckpoint();
  }, [checkpointIndex]);

  const handleAnswerChange = (question, value) => {
    setUserAnswers({ ...userAnswers, [question]: value });
  };

  const submitAnswers = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/submit_answers", {
        user_id: userId,
        video_id: videoId,
        checkpoint_index: checkpointIndex,
        answers: userAnswers,
      });

      const wrongAnswers = res.data.results.filter((r) => !r.is_correct);

      if (wrongAnswers.length >= 2 && checkpointIndex > 1) {
        setCheckpointIndex(checkpointIndex - 1);
        setAttempts(0);
        alert("2 wrong attempts! Going back to previous checkpoint.");
      } else {
        setCheckpointIndex(checkpointIndex + 1);
        setAttempts(attempts + 1);
      }
      setUserAnswers({});
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="video-player-container">
      <h2 style={{ color: "#A7C7E7" }}>Video Checkpoint {checkpointIndex}</h2>

      <ReactPlayer
        ref={playerRef}
        url={videoData.video_path}
        controls
        width="100%"
        height="500px"
      />

      <div className="summary-section" style={{ background: "#FDFD96" }}>
        <h3>Summary:</h3>
        <p>{summary}</p>
      </div>

      <div className="questions-section" style={{ background: "#FFD1DC" }}>
        <h3>Questions:</h3>
        {questions.length === 0 ? (
          <p>No questions at this checkpoint</p>
        ) : (
          questions.map((q, idx) => (
            <div key={idx}>
              <label>{q}</label>
              <input
                type="text"
                value={userAnswers[q] || ""}
                onChange={(e) => handleAnswerChange(q, e.target.value)}
              />
            </div>
          ))
        )}
      </div>

      {questions.length > 0 && (
        <button onClick={submitAnswers} style={{ background: "#AFC7CE" }}>
          Submit Answers
        </button>
      )}
    </div>
  );
};

export default VideoPlayer;

