import {
  BlobWriter,
  TextReader,
  ZipWriter,
} from "https://unpkg.com/@zip.js/zip.js/index.js";

onmessage = async (e) => {
  try {
    const preferencesString = e.data.preferences || '{}';
    const resultsString = e.data.results || '{}';
    const questionsArray = e.data.questions || [];

    const incorrectA = Number(e.data.incorrectAnswers) || 0;
    const correctA = Number(e.data.correctAnswers) || 0;

    // Data from localStorage and questionsArray
    const text = `
      Preferences: ${preferencesString}
      Results: ${resultsString}
      Questions: ${JSON.stringify(questionsArray)}
      You have ${correctA} correct answers and ${incorrectA} incorrect answers
    `;

    const zipWriter = new ZipWriter(new BlobWriter("application/zip"));
    await zipWriter.add("quiz_data.txt", new TextReader(text));
    const blob = await zipWriter.close();
    postMessage(blob);
  } catch (error) {
    console.error("Error creating zip file:", error);
    postMessage(null);
  }
};

