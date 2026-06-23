(async () => {
  const API_KEY = "ovecktc2025";
  const QUIZ_SET_ID = "20";
  const BASE_URL = "https://cloud.ovec.go.th/vqa_api";

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user?.idcard) {
    console.error("❌ UserData in SessionStorage Not Found");
    return;
  }

  const STUDENT_ID = user.idcard;

  console.log(
    `%c[Session Loaded] Student ID: ${STUDENT_ID}`,
    "color:#00ff00;font-weight:bold;"
  );

  async function postJSON(endpoint, payload) {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return response.json();
  }

  async function sendTask(task, index, total) {
    try {
      const payload = {
        ...task.payload,
        student_id: STUDENT_ID,
        quiz_set_id: QUIZ_SET_ID,
      };

      const result = await postJSON(
        "submit_quiz_assignment.php",
        payload
      );

      console.log(
        `%c[${index + 1}/${total}] [SUCCESS] ${
          payload.quiz_role
        } | Topic ${payload.lesson_topics_id} | Activity ${
          payload.topic_activities_id
        }`,
        "color:#00ffff;",
        result
      );

      return result;
    } catch (err) {
      console.error(
        `❌ [${index + 1}/${total}] Failed`,
        err
      );
    }
  }

  async function getUnfinishedVideos() {
    const result = await postJSON(
      "video_progress_fetch.php",
      {
        ApiKey: API_KEY,
        student_id: STUDENT_ID,
        quiz_set_id: QUIZ_SET_ID,
      }
    );

    if (!result?.status || !result?.data?.videos) {
      throw new Error("Fetch Video Failed");
    }

    return result.data.videos.filter(
      (video) => Number(video.is_completed) !== 1
    );
  }

  async function completeVideo(video, index, total) {
    try {
      const startSession = await postJSON(
        "video_progress.php",
        {
          ApiKey: API_KEY,
          action: "start_watching",
          student_id: STUDENT_ID,
          quiz_set_id: QUIZ_SET_ID,
          lesson_contents_id: video.lesson_contents_id,
          topic_activities_id: video.topic_activities_id,
          lesson_topics_id: video.lesson_topics_id,
          video_url: video.lesson_contents_path,
          video_duration: video.video_duration || 0,
        }
      );

      if (!startSession?.data) {
        throw new Error("Create Session Failed");
      }

      const { progress_id, session_token } =
        startSession.data;

      const completed = await postJSON(
        "video_progress.php",
        {
          ApiKey: API_KEY,
          action: "complete_video",
          progress_id,
          session_token,
          video_duration: video.video_duration,
          student_id: STUDENT_ID,
          lesson_contents_id: video.lesson_contents_id,
        }
      );

      console.log(
        `%c[${index + 1}/${total}] Video Completed`,
        "color:#00ffff;",
        completed
      );

      return completed;
    } catch (err) {
      console.error(
        `❌ Video ${index + 1} Failed`,
        err
      );
    }
  }

  const taskQueue = [
    {
      payload: {
        ApiKey: "ovecktc2025",
        quiz_set_id: 20,
        answers: { 1477: 7428, 1480: 7440, 1489: 7474, 1496: 7502, 1505: 7539 },
        registration_id: 33268,
        lesson_topics_id: 15,
        topic_activities_id: 32,
        quiz_role: "pre_test",
        actual_question_count: 5,
        selected_question_ids: [1480, 1489, 1505, 1477, 1496],
        passing_score: 3,
        max_score: 5,
      },
    },
    {
      payload: {
        ApiKey: "ovecktc2025",
        quiz_set_id: 20,
        answers: { 1534: 7655, 1539: 7676, 1550: 7719, 1605: 7939, 1627: 8029 },
        student_id: "1429900701628",
        registration_id: 33268,
        lesson_topics_id: 15,
        topic_activities_id: 33,
        quiz_role: "post_test",
        actual_question_count: 5,
        selected_question_ids: [1605, 1550, 1627, 1539, 1534],
        passing_score: 3,
        max_score: 5,
      },
    },
    {
      payload: {
        ApiKey: "ovecktc2025",
        quiz_set_id: 20,
        answers: {
          2137: 10068,
          2144: 10094,
          2154: 10136,
          2185: 10259,
          2219: 10396,
        },
        student_id: "1429900701628",
        registration_id: 33268,
        lesson_topics_id: 16,
        topic_activities_id: 39,
        quiz_role: "post_test",
        actual_question_count: 5,
        selected_question_ids: [2137, 2185, 2219, 2144, 2154],
        passing_score: 3,
        max_score: 5,
      },
    },
    {
      payload: {
        ApiKey: "ovecktc2025",
        quiz_set_id: 20,
        answers: {
          2257: 10548,
          2272: 10609,
          2278: 10633,
          2296: 10702,
          2307: 10749,
        },
        student_id: "1429900701628",
        registration_id: 33268,
        lesson_topics_id: 17,
        topic_activities_id: 40,
        quiz_role: "pre_test",
        actual_question_count: 5,
        selected_question_ids: [2257, 2278, 2307, 2272, 2296],
        passing_score: 3,
        max_score: 5,
      },
    },
    {
      payload: {
        ApiKey: "ovecktc2025",
        quiz_set_id: 20,
        answers: { 2030: 9641, 2040: 9679, 2070: 9798, 2098: 9910, 2111: 9965 },
        student_id: "1429900690341",
        registration_id: 33582,
        lesson_topics_id: 16,
        topic_activities_id: 38,
        quiz_role: "pre_test",
        actual_question_count: 5,
        selected_question_ids: [2040, 2098, 2030, 2070, 2111],
        passing_score: 3,
        max_score: 5,
      },
    },
    {
      payload: {
        ApiKey: "ovecktc2025",
        quiz_set_id: 20,
        answers: {
          2349: 10916,
          2381: 11042,
          2386: 11065,
          2394: 11096,
          2423: 11211,
        },
        student_id: "1429900701628",
        registration_id: 33268,
        lesson_topics_id: 17,
        topic_activities_id: 41,
        quiz_role: "post_test",
        actual_question_count: 5,
        selected_question_ids: [2349, 2423, 2381, 2394, 2386],
        passing_score: 3,
        max_score: 5,
      },
    },
    {
      payload: {
        ApiKey: "ovecktc2025",
        quiz_set_id: 20,
        answers: {
          2436: 11265,
          2455: 11339,
          2457: 11348,
          2470: 11400,
          2477: 11426,
        },
        student_id: "1429900701628",
        registration_id: 33268,
        lesson_topics_id: 18,
        topic_activities_id: 42,
        quiz_role: "pre_test",
        actual_question_count: 5,
        selected_question_ids: [2436, 2477, 2455, 2457, 2470],
        passing_score: 3,
        max_score: 5,
      },
    },
    {
      payload: {
        ApiKey: "ovecktc2025",
        quiz_set_id: 20,
        answers: {
          2529: 11636,
          2536: 11665,
          2548: 11710,
          2553: 11730,
          2574: 11817,
        },
        student_id: "1429900701628",
        registration_id: 33268,
        lesson_topics_id: 18,
        topic_activities_id: 43,
        quiz_role: "post_test",
        actual_question_count: 5,
        selected_question_ids: [2529, 2574, 2536, 2553, 2548],
        passing_score: 3,
        max_score: 5,
      },
    },
    {
      payload: {
        ApiKey: "ovecktc2025",
        quiz_set_id: 20,
        answers: {
          2633: 12052,
          2644: 12097,
          2673: 12213,
          2678: 12232,
          2724: 12417,
        },
        student_id: "1429900701628",
        registration_id: 33268,
        lesson_topics_id: 19,
        topic_activities_id: 44,
        quiz_role: "pre_test",
        actual_question_count: 5,
        selected_question_ids: [2678, 2673, 2644, 2633, 2724],
        passing_score: 3,
        max_score: 5,
      },
    },
    {
      payload: {
        ApiKey: "ovecktc2025",
        quiz_set_id: 20,
        answers: {
          2731: 12443,
          2749: 12514,
          2751: 12522,
          2777: 12628,
          2828: 12833,
        },
        student_id: "1429900701628",
        registration_id: 33268,
        lesson_topics_id: 19,
        topic_activities_id: 45,
        quiz_role: "post_test",
        actual_question_count: 5,
        selected_question_ids: [2777, 2749, 2828, 2731, 2751],
        passing_score: 3,
        max_score: 5,
      },
    },
    {
      payload: {
        ApiKey: "ovecktc2025",
        quiz_set_id: 20,
        answers: {
          2870: 13000,
          2872: 13009,
          2889: 13074,
          2907: 13149,
          2920: 13199,
        },
        student_id: "1429900701628",
        registration_id: 33268,
        lesson_topics_id: 20,
        topic_activities_id: 46,
        quiz_role: "pre_test",
        actual_question_count: 5,
        selected_question_ids: [2889, 2920, 2870, 2872, 2907],
        passing_score: 3,
        max_score: 5,
      },
    },
    {
      payload: {
        ApiKey: "ovecktc2025",
        quiz_set_id: 20,
        answers: {
          2937: 13269,
          2978: 13430,
          3003: 13531,
          3008: 13551,
          3010: 13560,
        },
        student_id: "1429900701628",
        registration_id: 33268,
        lesson_topics_id: 20,
        topic_activities_id: 47,
        quiz_role: "post_test",
        actual_question_count: 5,
        selected_question_ids: [2978, 3003, 2937, 3010, 3008],
        passing_score: 3,
        max_score: 5,
      },
    },
    {
      payload: {
        ApiKey: "ovecktc2025",
        quiz_set_id: 20,
        answers: {
          3041: 13685,
          3073: 13811,
          3077: 13828,
          3084: 13854,
          3128: 14033,
        },
        student_id: "1429900701628",
        registration_id: 33268,
        lesson_topics_id: 21,
        topic_activities_id: 48,
        quiz_role: "pre_test",
        actual_question_count: 5,
        selected_question_ids: [3041, 3084, 3077, 3128, 3073],
        passing_score: 3,
        max_score: 5,
      },
    },
    {
      payload: {
        ApiKey: "ovecktc2025",
        quiz_set_id: 20,
        answers: {
          3153: 14131,
          3163: 14172,
          3179: 14234,
          3188: 14273,
          3209: 14354,
        },
        student_id: "1429900701628",
        registration_id: 33268,
        lesson_topics_id: 21,
        topic_activities_id: 50,
        quiz_role: "post_test",
        actual_question_count: 5,
        selected_question_ids: [3163, 3209, 3188, 3153, 3179],
        passing_score: 3,
        max_score: 5,
      },
    },
    {
      payload: {
        ApiKey: "ovecktc2025",
        quiz_set_id: 20,
        answers: {
          3234: 14455,
          3246: 14502,
          3305: 14738,
          3310: 14760,
          3321: 14802,
        },
        student_id: "1429900701628",
        registration_id: 33268,
        lesson_topics_id: 22,
        topic_activities_id: 51,
        quiz_role: "pre_test",
        actual_question_count: 5,
        selected_question_ids: [3234, 3310, 3321, 3246, 3305],
        passing_score: 3,
        max_score: 5,
      },
    },
    {
      payload: {
        ApiKey: "ovecktc2025",
        quiz_set_id: 20,
        answers: {
          3334: 14855,
          3335: 14858,
          3351: 14922,
          3367: 14987,
          3407: 15149,
        },
        student_id: "1429900701628",
        registration_id: 33268,
        lesson_topics_id: 22,
        topic_activities_id: 52,
        quiz_role: "post_test",
        actual_question_count: 5,
        selected_question_ids: [3351, 3335, 3367, 3334, 3407],
        passing_score: 3,
        max_score: 5,
      },
    },
    {
      payload: {
        ApiKey: "ovecktc2025",
        quiz_set_id: 20,
        answers: {
          3745: 16496,
          3768: 16588,
          3783: 16648,
          3794: 16691,
          3825: 16816,
        },
        student_id: "1429900701628",
        registration_id: 33268,
        lesson_topics_id: 23,
        topic_activities_id: 53,
        quiz_role: "pre_test",
        actual_question_count: 5,
        selected_question_ids: [3768, 3783, 3794, 3825, 3745],
        passing_score: 3,
        max_score: 5,
      },
    },
    {
      payload: {
        ApiKey: "ovecktc2025",
        quiz_set_id: 20,
        answers: {
          3635: 16057,
          3647: 16105,
          3658: 16149,
          3667: 16183,
          3718: 16389,
        },
        student_id: "1429900701628",
        registration_id: 33268,
        lesson_topics_id: 23,
        topic_activities_id: 54,
        quiz_role: "post_test",
        actual_question_count: 5,
        selected_question_ids: [3718, 3667, 3635, 3647, 3658],
        passing_score: 3,
        max_score: 5,
      },
    },
  ];

  console.log(
    `%c[INFO] Found ${taskQueue.length} Payload`,
    "color:#ffee00;font-weight:bold;"
  );

  try {
    const videos = await getUnfinishedVideos();

    console.log(
      `%c[INFO] Found ${videos.length} Unfinished Videos`,
      "color:#ffee00;font-weight:bold;"
    );

    for (let i = 0; i < videos.length; i++) {
      await completeVideo(
        videos[i],
        i,
        videos.length
      );
    }

    for (let i = 0; i < taskQueue.length; i++) {
      await sendTask(
        taskQueue[i],
        i,
        taskQueue.length
      );

      await delay(500);
    }

    console.log(
      "%c[DONE] All Tasks Completed",
      "color:#ffff00;font-weight:bold;font-size:14px;"
    );
  } catch (err) {
    console.error("❌ Fatal Error", err);
  }
})();
