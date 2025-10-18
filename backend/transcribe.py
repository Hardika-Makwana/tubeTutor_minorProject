import whisper
import os

# Load a free & fast Whisper model
model = whisper.load_model("base")

video_folder = "videos/"

# Loop through each file in videos folder
for file in os.listdir(video_folder):
    if file.endswith(".mp3") or file.endswith(".mp4"):
        filepath = os.path.join(video_folder, file)
        print(f"Transcribing {file} ...")
        result = model.transcribe(filepath)
        transcript = result["text"]

        # Save transcript as .txt file
        transcript_file = os.path.join(video_folder, f"{os.path.splitext(file)[0]}.txt")
        with open(transcript_file, "w", encoding="utf-8") as f:
            f.write(transcript)
        print(f"Transcript saved to {transcript_file}")
 
