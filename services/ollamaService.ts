import { InterviewReport, QuestionAndAnswer } from '../types';
import { MAX_QUESTIONS } from "../constants";

const OLLAMA_BASE_URL = "http://localhost:11434/api";

/**
 * Ollama is a free, open-source LLM that runs locally.
 * Download and install from: https://ollama.ai
 * Then run: ollama pull mistral (or another model like llama2)
 * The model will be available at localhost:11434
 */

export async function generateQuestions(jobRole: string, resumeContent: string): Promise<string[]> {
  try {
    const prompt = `Generate ${MAX_QUESTIONS} diverse interview questions for a ${jobRole} role.
    
Resume:
${resumeContent}

Questions should cover:
1. Technical skills relevant to ${jobRole}
2. Behavioral/situational questions
3. Problem-solving ability

Return ONLY a JSON object with a "questions" array. No extra text.
Example format:
{"questions": ["Question 1?", "Question 2?", ...]}`;

    const response = await fetch(`${OLLAMA_BASE_URL}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",
        prompt: prompt,
        stream: false,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.response?.trim() || "";
    
    // Extract JSON from the response (Ollama sometimes adds extra text)
    const jsonMatch = responseText.match(/\{[\s\S]*"questions"[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("Could not parse JSON from Ollama response:", responseText);
      // Fallback: generate mock questions
      return Array.from({ length: MAX_QUESTIONS }, (_, i) => `Question ${i + 1} for ${jobRole}?`);
    }

    const result = JSON.parse(jsonMatch[0]);
    return result.questions?.slice(0, MAX_QUESTIONS) || [];
  } catch (error) {
    console.error("Error generating questions from Ollama:", error);
    // Fallback to mock questions
    return Array.from({ length: MAX_QUESTIONS }, (_, i) => `Fallback Question ${i + 1} for ${jobRole}?`);
  }
}

/**
 * Text-to-speech using Web Speech API (free, built-in to browsers)
 */
export async function textToSpeech(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));
      
      synth.cancel(); // Stop any ongoing speech
      synth.speak(utterance);
    } catch (error) {
      reject(error);
    }
  });
}

export async function generateEvaluation(
  jobRole: string,
  resumeContent: string,
  transcript: QuestionAndAnswer[]
): Promise<InterviewReport> {
  try {
    const transcriptText = transcript
      .map((item, i) => `Q${i + 1}: ${item.question}\nA${i + 1}: ${item.answer}`)
      .join("\n\n");

    const prompt = `You are an expert HR manager and technical interviewer. Evaluate this interview:

Job Role: ${jobRole}
Resume:
${resumeContent}

Interview Transcript:
${transcriptText}

Provide evaluation as JSON with this structure (NO other text):
{
  "scores": {
    "communication": <number 0-10>,
    "technical": <number 0-10>,
    "logic": <number 0-10>,
    "overall": <number 0-10>
  },
  "summary": {
    "strengths": "<string>",
    "weaknesses": "<string>",
    "suggestions": "<string>"
  },
  "details": [
    {"question": "<q>", "answer": "<a>", "feedback": "<feedback>", "score": <0-10>},
    ...
  ]
}`;

    const response = await fetch(`${OLLAMA_BASE_URL}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",
        prompt: prompt,
        stream: false,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.response?.trim() || "";

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from Ollama evaluation response");
    }

    const result = JSON.parse(jsonMatch[0]);

    return {
      id: new Date().toISOString(),
      date: new Date().toLocaleString(),
      jobRole,
      fraudStatus: false,
      scores: result.scores || { communication: 7, technical: 7, logic: 7, overall: 7 },
      summary: result.summary || {
        strengths: "Good effort",
        weaknesses: "Could improve clarity",
        suggestions: "Practice more",
      },
      details: result.details || transcript.map((t, i) => ({
        question: t.question || `Question ${i + 1}`,
        answer: t.answer || "",
        feedback: "Feedback pending",
        score: 7,
      })),
    } as InterviewReport;
  } catch (error) {
    console.error("Error generating evaluation from Ollama:", error);
    // Return a fallback report
    return {
      id: new Date().toISOString(),
      date: new Date().toLocaleString(),
      jobRole,
      fraudStatus: false,
      scores: { communication: 7, technical: 7, logic: 7, overall: 7 },
      summary: {
        strengths: "Demonstrated engagement",
        weaknesses: "Could improve technical depth",
        suggestions: "Study core concepts and practice",
      },
      details: transcript.map((t, i) => ({
        question: t.question || `Question ${i + 1}`,
        answer: t.answer || "",
        feedback: "Good effort. Keep practicing.",
        score: 7,
      })),
    } as InterviewReport;
  }
}
