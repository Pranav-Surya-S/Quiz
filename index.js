$(document).ready(function () {
  const holdDuration = 500;
  let holdTimeout = null;

  //*Getting Questions from the json file  and shuffling the order
  $.getJSON("questions.json", function (data) {
    const validQuestions = data.filter((question) => {
      const correctAnswers = question.correct_answers;
      const trueCount = Object.values(correctAnswers).filter(
        (answer) => answer === "true"
      ).length;
      const falseCount = Object.values(correctAnswers).filter(
        (answer) => answer === "false"
      ).length;
      return trueCount > 0 && falseCount > 0;
    });

    if (validQuestions.length > 0) {
      const randomQuestionIndex = Math.floor(
        Math.random() * validQuestions.length
      );
      const questionData = validQuestions[randomQuestionIndex];

      $(".question-box").text(questionData.question);

      const answers = Object.values(questionData.answers).filter(
        (answer) => answer !== null
      );
      const shuffledAnswers = shuffleArray(answers);

      $(".option").each(function (index) {
        if (shuffledAnswers[index]) {
          $(this).text(shuffledAnswers[index]);
          $(this).show();
          const answerKey = Object.keys(questionData.answers).find(
            (key) => questionData.answers[key] === shuffledAnswers[index]
          );
          $(this).data(
            "isCorrect",
            questionData.correct_answers[`${answerKey}_correct`] === "true"
          );
        } else {
          $(this).hide();
        }
      });
    } else {
      $(".question-box").text("No valid questions available.");
    }
  });

  //* Mmm shuffling algorithim
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  $(".question-box, .option")
    .on("mousedown touchstart", function () {
      const that = this;

      holdTimeout = setTimeout(function () {
        const alertText = $(that).hasClass("option")
          ? $(that).text()
          : $(that).text();
        showAlert(alertText);
      }, holdDuration);
    })
    .on("mouseup mouseleave touchend", function () {
      clearTimeout(holdTimeout);
    });

  function showAlert(text) {
    $(".alert-box").text(text).addClass("active");
  }

  $(".alert-box").on("click", function () {
    $(this).removeClass("active");
  });

  $(".option").on("click", function () {
    const isCorrect = $(this).data("isCorrect");

    if (isCorrect) {
      $(this).addClass("correct");
      $("body").addClass("correct").removeClass("wrong");
    } else {
      $(this).addClass("wrong");
      $("body").addClass("wrong").removeClass("correct");
    }

    $(".option").off("click");
  });

  $(".refresh").on("click", function () {
    location.reload();
  });
});
