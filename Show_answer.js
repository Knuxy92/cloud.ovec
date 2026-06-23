(async function () {
  window.quizAnswers = [];

  if (window.quizAnswers === undefined){
    try {
      const response = await fetch("https://raw.githubusercontent.com/Knuxy92/cloud.ovec/refs/heads/main/allAnswer.json");
      window.quizAnswers = await response.json();
      console.log(`%cAnswers loaded successfully! Total: ${window.quizAnswers.length} questions`, "color: #00ff00; font-weight: bold;");
    } catch (error) {
      console.error("Failed to load answer file from GitHub:", error);
      return;
    }
  }

  const waitForQuestions = () =>
    new Promise((resolve) => {
      const interval = setInterval(() => {
        const elements = document.querySelectorAll(".question-item");
        if (elements.length > 0) {
          clearInterval(interval);
          resolve(elements);
        } else {
          console.log("%cWaiting for question elements...", "color: #aaaaaa;");
        }
      }, 500);
    });

  const questionElements = await waitForQuestions();

  let matchCount = 0;

  questionElements.forEach((questionEl) => {
    const textBlock = questionEl.querySelector(".font-weight-bold.text-body-1");
    if (!textBlock) return;

    const questionText = textBlock.textContent.trim();
    const questionId = questionEl.getAttribute("id") || "no-id";
    const match = window.quizAnswers.find((item) => item.question === questionText);

    if (!match) {
      console.log(`%cNo answer found for question: "${questionText.substring(0, 30)}..." (${questionId})`, "color: #ff9800;");
      return;
    }

    matchCount++;
    const correctAnswer = match.correct_answer.trim();

    questionEl.querySelectorAll(".choice-item").forEach((choiceEl) => {
      const textEl = choiceEl.querySelector(".choice-text");
      if (!textEl) return;

      const choiceText = textEl.textContent.trim();

      if (choiceText === correctAnswer) {
        textEl.innerHTML = `<b>${choiceText} (Correct Answer)</b>`;
        choiceEl.style.border = "3px solid #4caf50";
        choiceEl.style.backgroundColor = "rgba(76, 175, 80, 0.15)";
      } else {
        choiceEl.style.opacity = "0.25";
      }
    });
  });

  console.log(`%cDone! Marked ${matchCount}/${questionElements.length} answers successfully`, "color: #00ff00; font-weight: bold; font-size: 14px;");
})();
