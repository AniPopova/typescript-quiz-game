
// GLOBAL VARIABLES AND INTERFACES
export interface Question {
  [x: string]: any;
  questionText: string;
  incorrect_answers: string[];
  correct_answer: string;
  question: string;
};

export interface QuizData {
  response_code: number;
  results: Array<Question>;
};

export interface CatImageData {
  url: string;
};

export interface Preferences {
  name?: string;
  category: string;
  difficulty: string;
  numOfQuestions: string;
};


// GLOBAL HTML ELEMENTS
export const userForm = document.getElementById("userForm") as HTMLElement;
export const quizSection = document.getElementById("quizSection") as HTMLElement;
export const catSection = document.querySelector(".cat-section") as HTMLElement;
export const resultsAnswers = document.getElementById('resultsSection') as HTMLElement;
export const answersCard = document.getElementById('answersCard') as HTMLDivElement;
export const overallResultCard = document.getElementById('overallResult') as HTMLDivElement;
export const userName = document.getElementById("userName") as HTMLInputElement || null;
export const questionsCategory = document.getElementById("category") as HTMLSelectElement || null;
export const questionsDifficulty = document.getElementById("difficulty") as HTMLSelectElement || null;
export const numberOfQuestions = document.getElementById("numQuestions") as HTMLSelectElement || null;
export const startQuizButton = document.getElementById('startButton') as HTMLAnchorElement;
export const shuffleCatsButton = document.getElementById('catButton') as HTMLAnchorElement;
export const startNewQuizButton = document.getElementById('startNewQuiz') as HTMLAnchorElement;
export const displayResultsButton = document.getElementById('resultsButton') as HTMLAnchorElement;
export const saveDataButton = document.getElementById('saveMyData') as HTMLAnchorElement;
export const downloadContainer = document.getElementById('downloadContainer') as HTMLDivElement;
export const downloadButton = document.getElementById('downloadBtn') as HTMLAnchorElement;
export const loadPreferencesButton = document.getElementById('loadButton') as HTMLAnchorElement;
export const questionCards = document.getElementById('questionCards') as HTMLDivElement;
export const buttonSection = document.getElementById('buttonSection') as HTMLElement;