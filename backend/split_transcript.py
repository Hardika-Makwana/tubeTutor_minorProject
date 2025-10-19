import os
import psycopg2

# PostgreSQL connection
conn = psycopg2.connect(
    dbname="tubetutor_db",
    user="postgres",
    password="Hardika13postgre",
    host="localhost",
    port="5433"
)
cur = conn.cursor()

video_folder = "videos/"
words_per_checkpoint = 100  # You can adjust this

for file in os.listdir(video_folder):
    if file.endswith(".txt"):
        filepath = os.path.join(video_folder, file)
        with open(filepath, "r", encoding="utf-8") as f:
            text = f.read()
        
        words = text.split()
        checkpoints = [" ".join(words[i:i+words_per_checkpoint]) for i in range(0, len(words), words_per_checkpoint)]

        for idx, cp_text in enumerate(checkpoints):
            cur.execute(
                "INSERT INTO transcript_checkpoints (video_name, checkpoint_index, text) VALUES (%s, %s, %s)",
                (file, idx+1, cp_text)
            )
        print(f"{len(checkpoints)} checkpoints inserted for {file}")

conn.commit()
cur.close()
conn.close()

