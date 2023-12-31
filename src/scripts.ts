
import {
  CatImageData,
  Preferences,
  Question,
  QuizData,
  answersCard,
  buttonSection,
  catSection,
  displayResultsButton,
  downloadButton,
  loadPreferencesButton,
  numberOfQuestions,
  overallResultCard,
  questionCards, // not used
  questionsCategory,
  questionsDifficulty,
  quizSection,
  resultsAnswers,
  saveDataButton,
  shuffleCatsButton,
  startNewQuizButton,
  startQuizButton,
  userForm,
  userName
} from './utility.js';

// There might be a better way of importin all these
// unitlity.js or .ts?


let correctAnswerCounter: number = 0;
let incorrectAnswerCounter: number = 0;
let questionsArray: Array<Question> = [];

const urlForCats = "https://api.thecatapi.com/v1/images/search";


// RANDOM CAT PICTURE
function fetchRandomCatPicture() {
  fetch(urlForCats)
    .then((response) =>
      response.json())
    .then((data: CatImageData[]) => {
      const catImage = document.getElementById("catImage") as HTMLImageElement;
      // what if data[0] doesn't exist?
      return catImage.src = data[0].url;
    })
    .catch(console.error); // you can be lazy sometimes and just pass console.error to the catch

  quizSection.classList.add('hidden');
  resultsAnswers.classList.add('hidden');
}

// LOAD DATA FROM LOCAL STORAGE
function loadPreferencesAndResults() {
  const preferencesString = localStorage.getItem("quizPreferences");
  const resultsString = localStorage.getItem("quizResults");

  if (preferencesString) {
    const { category, difficulty, numOfQuestions } = JSON.parse(preferencesString) as Preferences;
    questionsCategory.value = category;
    questionsDifficulty.value = difficulty;
    numberOfQuestions.value = numOfQuestions;
  }

  if (resultsString) {
    const { correctAnswers, incorrectAnswers } = JSON.parse(resultsString);
    correctAnswerCounter = parseInt(correctAnswers);
    incorrectAnswerCounter = parseInt(incorrectAnswers);
  }
}

//COMMON FUNCTIONALITY FOR PREFERENCES ADN RESULTS
function submitForm(event: Event, questionIndex: number, correctAnswer: string) {
  event.preventDefault();
  const selectedOption = document.querySelector(
    `input[name="q${questionIndex}"]:checked`
  ) as HTMLInputElement;

  if (selectedOption) {
    localStorage.setItem(`userAnswer_q${questionIndex}`, selectedOption.value);
  } else {
    alert("Please select an answer.");
  }
}

//SAVE EVERYTHING FROM USER
function savePreferencesAndResults() {
  const preferences = {
    category: questionsCategory.value,
    difficulty: questionsDifficulty.value,
    numQuestions: numberOfQuestions.value,
  };

  const results = {
    correctAnswers: correctAnswerCounter,
    incorrectAnswers: incorrectAnswerCounter,
    questions: questionsArray,
  };

  localStorage.setItem("quizPreferences", JSON.stringify(preferences));
  localStorage.setItem("quizResults", JSON.stringify(results));
}

//INITIAL START
function startQuiz() {
  userForm.classList.add('hidden');
  quizSection.innerHTML = "";
  catSection.classList.add("hidden");
  quizSection.classList.remove('hidden');
  resultsAnswers.classList.remove('hidden');
  buttonSection.classList.remove('hidden');

  let category = questionsCategory.value;
  let difficulty = questionsDifficulty.value;
  let numberQuestions = numberOfQuestions.value;

  // can put the url in a variable above
  fetch(
    `https://opentdb.com/api.php?amount=${numberQuestions}&category=${category}&difficulty=${difficulty}&type=multiple`
  )
    .then((response) => response.json())
    .then(displayQuestions)
    .catch((error: Error) => console.error("Error fetching trivia questions:", error));
}

// GENERATE QUESTIONS BASED ON USER CHOICE
function displayQuestions({ results: questions }: QuizData) {
  questionsArray = questions;
  quizSection.innerHTML = "";
  resultsAnswers.classList.add('hidden');
  questions.forEach((question, index) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const questionContainer = document.createElement("div");
    questionContainer.classList.add("quiz-question");

    const options = shuffle([
      ...question.incorrect_answers,
      question.correct_answer,
    ]);

    const optionsHTML = options
      .map(
        (option) => `
      <label>
      <input type="radio" name="q${index + 1}" value="${option}">
      ${option}
      </label>
      `
      )
      .join("");

    questionContainer.innerHTML = `
      <h2>Question ${index + 1}</h2>
      <p>${question.question}</p>
      <div class="options">
      ${optionsHTML}
      </div>`;
    const submitButton = document.createElement('a') as HTMLAnchorElement;
    submitButton.className = 'button quiz-question-button';
    submitButton.innerText = 'Submit';
    submitButton.addEventListener('click', (e) => submitForm(e, index + 1, question.correct_answer));

    questionContainer.appendChild(submitButton);
    card.appendChild(questionContainer);
    quizSection.appendChild(card);
  });
}

//START NEW QUIZ AFTER FINISH PREVIOUS ONE
function startNewQuiz() {
  buttonSection.classList.add('hidden');
  userForm.classList.remove('hidden');
  quizSection.innerHTML = '';
  catSection.classList.remove('hidden');
  resultsAnswers.innerHTML = '';
  downloadButton.classList.add('hidden');

  correctAnswerCounter = 0;
  incorrectAnswerCounter = 0;
}

//SHUFFLE THE CORRECT ANSWERS IN THE QUESTIONS 
function shuffle(array: Array<string>) {
  return array.sort(() => Math.random() - 0.5);
}

//DISPLAY RESULTS OF THE CURRENT USER
function displayResults() {
  resultsAnswers.classList.remove('hidden');
  resultsAnswers.innerHTML = '';
  downloadButton.classList.remove('hidden');
  startNewQuizButton.classList.remove('hidden');
  saveDataButton.classList.remove('hidden');

  questionsArray.forEach((question, index) => {
    const userAnswer = localStorage.getItem(`userAnswer_q${index + 1}`) as string;
    const isCorrect: boolean = userAnswer === question.correct_answer;
    const resultText = document.createElement('div');

    resultText.innerHTML = `
    <h2>Question ${index + 1}</h2>
    <p>${question.question}</p>
    <p>User's Answer: ${userAnswer}</p>
    <p>Correct Answer: ${question.correct_answer}</p>
    <p>Status: ${isCorrect ? 'Correct' : 'Incorrect'}</p>
    <br>
    `;
    answersCard.appendChild(resultText);
    if (isCorrect) {
      correctAnswerCounter++;
    } else {
      incorrectAnswerCounter++;
    }
  });
  overallResultCard.textContent = `Overall Results: correct answers: ${correctAnswerCounter} and incorrect answers: ${incorrectAnswerCounter}`;
  resultsAnswers.appendChild(answersCard);
  resultsAnswers.appendChild(overallResultCard);
  localStorage.setItem("userResults", JSON.stringify(resultsAnswers));
}

//LOAD DATA FROM LOCAL STORAGE AND USE IT FOR THE DOWNLOAD FILE
function downloadUserData() {
  const preferencesString = localStorage.getItem("quizPreferences");
  const resultsString = localStorage.getItem("quizResults");

  const worker = new Worker('worker.js', { type: 'module' });

  worker.onmessage = (e) => {
    if (e.data) {
      // Download link 
      const downloadLink = document.body.appendChild(Object.assign(document.createElement("a"), {
        download: "quiz_results.zip",
        href: URL.createObjectURL(e.data),
        textContent: "Download zip file",
      }));
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      console.error("Unable to download zip.");
    }
  };

  // Send the local storage data to the worker
  worker.postMessage({
    preferences: preferencesString || '{}',
    results: resultsString || '{}',
    incorrectAnswers: incorrectAnswerCounter,
    correctAnswers: correctAnswerCounter,
  });
}


// EVENT LISTENERS
userForm.addEventListener("submit", startQuiz, false);
startQuizButton.addEventListener("click", startQuiz);
shuffleCatsButton.addEventListener("click", fetchRandomCatPicture);
startNewQuizButton.addEventListener("click", startNewQuiz);
displayResultsButton.addEventListener("click", displayResults);
loadPreferencesButton.addEventListener('click', loadPreferencesAndResults);
downloadButton.addEventListener('click', downloadUserData);
saveDataButton.addEventListener('click', savePreferencesAndResults);
document.addEventListener("DOMContentLoaded", fetchRandomCatPicture);
