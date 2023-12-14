var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BlobWriter, TextReader, ZipWriter, } from "https://unpkg.com/@zip.js/zip.js/index.js";
onmessage = (e) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield zipWriter.add("quiz_data.txt", new TextReader(text));
        const blob = yield zipWriter.close();
        postMessage(blob);
    }
    catch (error) {
        console.error("Error creating zip file:", error);
        postMessage(null);
    }
});
