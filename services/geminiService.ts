import { GoogleGenAI, Type } from "@google/genai";
import { Question } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const quizSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.STRING,
        description: "El texto de la pregunta del cuestionario, en español.",
      },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Un array de exactamente 4 respuestas posibles, en español.",
      },
      correctAnswer: {
        type: Type.STRING,
        description: "La respuesta correcta, que debe ser una de las cadenas de texto del array 'options'.",
      },
      explanation: {
        type: Type.STRING,
        description: "Una explicación breve de 1-2 frases de por qué la respuesta es correcta, en español.",
      },
    },
    required: ["question", "options", "correctAnswer", "explanation"],
  },
};

export async function generateQuiz(context: string, numQuestions: number, difficulty: string): Promise<Question[]> {
  const prompt = `
    Eres un asistente experto de IA que crea exámenes para evaluar conocimientos. Basado en el siguiente contenido de texto, tu objetivo es generar un cuestionario que simule un examen real sobre los temas tratados.

    **Instrucciones:**
    1. Genera exactamente ${numQuestions} preguntas.
    2. La dificultad de las preguntas debe ser: ${difficulty}.
    3. Cada pregunta debe tener exactamente 4 respuestas posibles.
    4. Solo una respuesta puede ser correcta.
    5. Las preguntas deben evaluar la comprensión y aplicación de los conceptos del texto, no solo la memorización de datos literales. Formula preguntas que requieran que el usuario piense en las implicaciones de la información, compare conceptos o aplique el conocimiento a situaciones hipotéticas.
    6. Formatea la salida como un array de objetos JSON válido. No incluyas ningún texto, marcadores de bloque de código o formato antes o después del array JSON.
    7. Cada objeto en el array debe adherirse al esquema proporcionado.
    8. El valor de "correctAnswer" debe coincidir exactamente con una de las cadenas de texto del array "options".
    9. La "explanation" debe ser concisa, en español y basarse en el texto proporcionado.
    10. Asegúrate de que las preguntas, respuestas y explicaciones estén completamente en español.
    11. Asegúrate de que las preguntas sean relevantes para los temas principales del texto.

    **Contenido del Texto:**
    ---
    ${context.substring(0, 100000)}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    const quizData: Question[] = JSON.parse(jsonText);
    
    // Validate that we got the right number of questions
    if (quizData.length !== numQuestions) {
        console.warn(`Gemini returned ${quizData.length} questions, expected ${numQuestions}.`);
        // We can still return what we got, or throw an error. Let's return for now.
    }

    return quizData;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Error al generar el cuestionario desde Gemini. El modelo puede haber devuelto un formato inválido o un error.");
  }
}