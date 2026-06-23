const STID = ""
const QUIZSET = "20"

async function getUnfinishedVideos() {
  const fetchRes = await fetch(
    "https://cloud.ovec.go.th/vqa_api/video_progress_fetch.php",
    {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        ApiKey: "ovecktc2025",
        student_id: STID,
        quiz_set_id: QUIZSET
      })
    }
  );

  const fetchData = await fetchRes.json();

  if (!fetchData?.status || !fetchData?.data?.videos) {
    throw new Error("Fetch Failed");
  }

  return fetchData.data.videos.filter(
    v => Number(v.is_completed) !== 1
  );
}

const videos = await getUnfinishedVideos();
for (let i = 0; i < videos.length; i++) {
  const result = videos[i];

  const startRes = await fetch(
    "https://cloud.ovec.go.th/vqa_api/video_progress.php",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ApiKey: "ovecktc2025",
        action: "start_watching",
        student_id: STID,
        quiz_set_id: QUIZSET,
        lesson_contents_id: result.lesson_contents_id,
        topic_activities_id: result.topic_activities_id,
        lesson_topics_id: result.lesson_topics_id,
        video_url: result.lesson_contents_path,
        video_duration: result.video_duration || 0
      })
    }
  );

  const startData = await startRes.json();
  
  if (!startData || !startData.data) {
    console.error(`Error Create Session  ${i + 1} Failed`);
    continue;
  }

  const actualProgressId = startData.data.progress_id;
  const actualSessionToken = startData.data.session_token;

  console.log(`${result.lesson_contents_id}`);

  const completeRes = await fetch("https://cloud.ovec.go.th/vqa_api/video_progress.php", {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "content-type": "application/json",
    },
    "referrer": "https://cloud.ovec.go.th/student/lesson/20",
    "body": JSON.stringify({
      "ApiKey": "ovecktc2025",
      "action": "complete_video",
      "progress_id": actualProgressId,        
      "session_token": actualSessionToken,    
      "video_duration": result.video_duration,
      "student_id": "1409903855839",
      "lesson_contents_id": result.lesson_contents_id
    }),
    "method": "POST"
  });

  const completeResult = await completeRes.json();
  console.log(`${i + 1}:`, completeResult);
}
