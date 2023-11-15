// Select Elements
let subUrl = document.querySelector(".quiz-app .quiz-info .category span");
let countSpan = document.querySelector(".quiz-app .count span");
let bullets = document.querySelector(".bullets");
let bulletsContainer = document.querySelector(".quiz-app .bullets .spans");
let quizArea = document.querySelector(".quiz-app .quiz-area");
let answersArea = document.querySelector(".quiz-app .answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;
let jsonUrl;

function getQuestions() {
  let myRequest = new XMLHttpRequest();
  // Check Request
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(myRequest.responseText);
      let questionsLength = questionsObject.length;
      // [1] Create Bullets + Set Questions Count
      createBullets(questionsLength);
      // [2] Add Question Data
      addQuestionData(questionsObject[currentIndex], questionsLength);
      // [8] Countdown Function Came From Below
      countdown(30, questionsLength);
      // [3] Click On Submit
      submitButton.onclick = () => {
        // [1] Get Right Answer
        let rightAnswer = questionsObject[currentIndex].right_answer;
        // [2] Increase Index
        currentIndex++;
        // [3] Check The Answer
        checkAnswer(rightAnswer, questionsLength);
        // [4] Remove Previous Question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        // [5] Add Data After Current Index ++1 (Next Question)
        addQuestionData(questionsObject[currentIndex], questionsLength);
        // [6] Handle Bullets Classes
        handleBullets();
        // [7] Show Results
        showResults(questionsLength);
        // [8] Countdown Function
        clearInterval(countdownInterval);
        countdown(30, questionsLength);
      };
    }
  };
  myRequest.open("GET", './html-questions.json', true);
  myRequest.send();
}

getQuestions();

// Function : Create Bullets + Set Questions Count
function createBullets(num) {
  countSpan.innerHTML = num;
  for (let i = 0; i < num; i++) {
    // Create and Append Bullet
    let theBullet = document.createElement("span");
    if (i === currentIndex) theBullet.className = "on"; // First Bullet
    bulletsContainer.appendChild(theBullet);
  }
}

// Function : Add Question Data
function addQuestionData(obj, length) {
  if (currentIndex < length) {
    // [1] Create H2 Question - Append Text - Append Element
    let questionTitle = document.createElement("h2");
    questionTitle.appendChild(document.createTextNode(obj.title));
    quizArea.appendChild(questionTitle);
    // [2] Create Spans Answers - Append Spans
    for (let i = 1; i <= 4; i++) {
      // [2.1] Create Answer Div -> Container
      let answerDiv = document.createElement("div");
      answerDiv.classList.add("answer");
      // [2.2] Create Input + Add (type, name, id) Attribute
      let input = document.createElement("input");
      input.setAttribute("type", "radio");
      input.setAttribute("name", "question");
      input.setAttribute("id", `answer_${i}`);
      input.dataset.answer = obj[`answer_${i}`];
      if (i == 1) input.checked = true; // First Checked
      // [2.3] Create Label + Ad (for) Attribute
      let label = document.createElement("label");
      label.setAttribute("for", `answer_${i}`);
      label.appendChild(document.createTextNode(obj[`answer_${i}`]));
      // Append (Input, Label) to answerDiv
      answerDiv.appendChild(input);
      answerDiv.appendChild(label);
      answersArea.appendChild(answerDiv);
    }
  }
}

function checkAnswer(rAnswer, length) {
  let answers = document.getElementsByName("question");
  let choosenAnswer;
  //
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choosenAnswer = answers[i].dataset.answer;
    }
  }
  //
  if (rAnswer == choosenAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(length) {
  let theResults;
  if (currentIndex === length) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();
    //
    if (rightAnswers > length / 2 && rightAnswers < length) {
      theResults = `<span class= "good">Good</span>, You Answered ${rightAnswers} From ${length} Correctly.`;
      document.getElementById("success").play();
    } else if (rightAnswers === length) {
      theResults = `<span class= "perfect">Perfect</span>, You Answered ${rightAnswers} From ${length} Correctly.`;
      document.getElementById("success").play();
    } else {
      theResults = `<span class= "bad">Bad</span>, You Answered ${rightAnswers} From ${length} Correctly.`;
      document.getElementById("fail").play();
    }
    //
    resultsContainer.innerHTML = theResults;
    resultsContainer.style.cssText = `
      padding: 10px;
      background-color: white;
      margin: 10px
    `;
  }
}

function countdown(duration, length) {
  if (currentIndex < length) {
    let minutes, seconds;
    countdownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      //
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      //
      countdownElement.innerHTML = `${minutes}:${seconds}`;
      //
      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
        console.log("finished");
      }
    }, 1000);
  }
}
