(async function () {
  if (window.quizAnswers === undefined) {
    try {
      const response = await fetch("https://raw.githubusercontent.com/Knuxy92/cloud.ovec/refs/heads/main/allAnswer.json");
      window.quizAnswers = await response.json();
      console.log(`%cAnswers loaded successfully! Total: ${window.quizAnswers.length} questions`, "color: #00ff00; font-weight: bold;");
    } catch (error) {
      console.error("Failed to load answer file from GitHub:", error);
      return;
    }
  }

  setInterval(() => {
    const questionElements = document.querySelectorAll(".question-item");
    
    if (questionElements.length === 0) return;

    questionElements.forEach((questionEl) => {
      const textBlock = questionEl.querySelector(".font-weight-bold.text-body-1");
      if (!textBlock) return;

      const questionText = textBlock.textContent.trim();
      const match = window.quizAnswers.find((item) => item.question === questionText);

      if (!match) return;

      const correctAnswer = match.correct_answer.trim();

      questionEl.querySelectorAll(".choice-item").forEach((choiceEl) => {
        const textEl = choiceEl.querySelector(".choice-text");
        if (!textEl) return;

        const choiceText = textEl.textContent.trim();

        const isAlreadyMarked = choiceEl.style.border.includes("rgb(76, 175, 80)") || choiceEl.style.opacity === "0.25";
        if (isAlreadyMarked) return;

        if (choiceText === correctAnswer) {
          textEl.innerHTML = `<b>${choiceText} (Correct Answer)</b>`;
          choiceEl.style.border = "3px solid #4caf50";
          choiceEl.style.backgroundColor = "rgba(76, 175, 80, 0.15)";
          choiceEl.style.opacity = "1";
        } else {
          choiceEl.style.opacity = "0.25";
          choiceEl.style.border = "none";
          choiceEl.style.backgroundColor = "transparent";
        }
      });
    });
  }, 500); 
})();
