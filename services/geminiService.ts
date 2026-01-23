
import { GoogleGenAI, Type } from "@google/genai";
import { InterviewReport, QuestionAndAnswer } from '../types';
import { MAX_QUESTIONS } from "../constants";
import * as questionHistoryService from './questionHistoryService';

// Read Vite environment variable. In development set this in a `.env` file as `VITE_API_KEY=...`.
const API_KEY = (import.meta as any)?.env?.VITE_API_KEY as string | undefined;

// Avoid throwing at module import time so the app can render and surface a helpful message.
let ai: GoogleGenAI | null = null;
if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
    console.warn('No VITE_API_KEY found. Gemini API calls will be mocked for development.');
}

/**
 * Generate dynamic, unique interview questions using Gemini AI
 * Analyzes job domain and resume to create unique questions each session
 * Prevents question repetition across attempts
 */
export async function generateQuestions(jobRole: string, resumeContent: string): Promise<string[]> {
  try {
    // Get previously asked questions to avoid repetition
    const previousQuestions = questionHistoryService.getPreviouslyAskedQuestions(jobRole, resumeContent);
    const previousQuestionsText = previousQuestions.length > 0 
      ? `\n\nIMPORTANT: Avoid generating these previously asked questions:\n${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`
      : '';

    // If no API client is available, return a set of dynamic mock questions for development.
    if (!ai) {
      console.warn('No Gemini API key found. Using dynamic fallback questions.');
      
      // Extract keywords from resume for personalization
      const words = resumeContent
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 4)
        .map(w => w.toLowerCase());

      const uniqueWords = Array.from(new Set(words));
      const keywords = uniqueWords.slice(0, 10);

      // Dynamic templates that will be shuffled
      const technicalTemplates = [
        `What is your hands-on experience with the core technologies required for ${jobRole}?`,
        `Walk us through your most impactful ${jobRole} project and the technical decisions you made.`,
        `How would you architect a complex system for a typical ${jobRole} use case?`,
        `Describe a technical challenge you faced in ${jobRole} and how you overcame it.`,
        `What emerging technologies or trends are most relevant to ${jobRole} and how do you stay updated?`,
        `Explain a complex ${jobRole} concept you've mastered and how you would teach it to others.`,
        `Tell us about your experience with performance optimization in ${jobRole} contexts.`,
      ];

      const behavioralTemplates = [
        `Share an experience where you had to collaborate with someone from a different technical background.`,
        `Tell us about a time when you had to mentor or help a colleague succeed.`,
        `Describe a situation where you received unexpected criticism and how you handled it.`,
        `Share an example of when you took ownership of a project and drove it to completion.`,
        `Tell us about a time you had to adapt your working style to fit a team's culture.`,
        `Describe your approach to continuous learning and professional development.`,
        `Share an experience where you had to communicate complex technical ideas to non-technical stakeholders.`,
      ];

      const problemSolvingTemplates = [
        `Given a scenario where you need to optimize a slow ${jobRole} system, walk through your debugging process.`,
        `How would you approach migrating a legacy system to a modern stack in your domain?`,
        `If you needed to scale a ${jobRole} solution 10x, what would be your top priorities?`,
        `Describe how you would approach learning and implementing a new framework or tool for ${jobRole}.`,
        `If faced with conflicting requirements from two stakeholders, how would you handle it?`,
        `Tell us about a time you had to make a difficult technical trade-off and your reasoning.`,
        `How would you approach improving code quality in a large, existing codebase?`,
      ];

      // Combine all templates
      const allTemplates = [...technicalTemplates, ...behavioralTemplates, ...problemSolvingTemplates];
      
      // Use timestamp and job role for better randomization
      const timestamp = Date.now();
      const seed = (jobRole.length * 31 + timestamp) % allTemplates.length;
      
      // Generate unique questions by using different seeds and keyword injection
      const generated: string[] = [];
      const usedIndices = new Set<number>();
      
      for (let i = 0; i < MAX_QUESTIONS; i++) {
        let questionIndex = (seed + i * 7) % allTemplates.length;
        
        // Ensure we don't repeat the same template
        while (usedIndices.has(questionIndex) && usedIndices.size < allTemplates.length) {
          questionIndex = (questionIndex + 1) % allTemplates.length;
        }
        usedIndices.add(questionIndex);
        
        let baseQuestion = allTemplates[questionIndex];
        
        // Inject unique keywords for personalization
        if (keywords.length > 0) {
          const keywordIndex = (i + timestamp) % keywords.length;
          const keyword = keywords[keywordIndex];
          
          // Add context-specific variation
          if (i % 3 === 0 && baseQuestion.includes('?')) {
            baseQuestion = baseQuestion.replace('?', ` (particularly regarding ${keyword})?`);
          }
        }
        
        generated.push(baseQuestion);
      }
      
      // Save to history to prevent future repetition
      questionHistoryService.addQuestionsToHistory(jobRole, resumeContent, generated);
      
      return generated.slice(0, MAX_QUESTIONS);
    }

    // Use Gemini API for dynamic question generation
    const model = 'gemini-2.5-flash';
    const prompt = `You are an expert HR interviewer specializing in ${jobRole} interviews. Your task is to generate ${MAX_QUESTIONS} UNIQUE, DIVERSE, and NON-REPETITIVE interview questions.

CRITICAL REQUIREMENTS:
1. Analyze the job role "${jobRole}" and the provided resume
2. Generate questions that are DISTINCT from previously asked ones (listed below)
3. Mix of question types: Technical (40%), Behavioral (35%), Problem-Solving (25%)
4. Each question must be unique in context, not just rephrased versions
5. Questions should progressively challenge the candidate
6. Questions must be role-specific and resume-relevant

Question Categories:
- TECHNICAL: Deep technical knowledge, architecture, design patterns specific to ${jobRole}
- BEHAVIORAL: Teamwork, leadership, conflict resolution, learning ability
- PROBLEM-SOLVING: Real-world scenarios, debugging, optimization, trade-offs

Resume Analysis:
${resumeContent}
${previousQuestionsText}

Return ONLY a valid JSON object with this exact format:
{
  "questions": ["Question 1?", "Question 2?", "Question 3?", ...]
}`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    const questions = result.questions?.slice(0, MAX_QUESTIONS) || [];
    
    // Save generated questions to history to prevent future repetition
    if (questions.length > 0) {
      questionHistoryService.addQuestionsToHistory(jobRole, resumeContent, questions);
      
      // Log statistics
      const stats = questionHistoryService.getQuestionStatistics(jobRole, resumeContent);
      console.log('Gemini question generation stats:', {
        questionsGenerated: questions.length,
        totalQuestionsAsked: stats.totalQuestionsAsked,
        uniqueQuestions: stats.uniqueQuestions,
        averageReuse: stats.averageReuse.toFixed(2),
      });
    }
    
    return questions;
  } catch (error) {
    console.error("Error generating questions:", error);
    
    // Fallback: generate generic questions
    const fallbackQuestions = Array.from({ length: MAX_QUESTIONS }, (_, i) => 
      `Tell me about your expertise in ${jobRole} (Question ${i + 1})?`
    );
    
    try {
      questionHistoryService.addQuestionsToHistory(jobRole, resumeContent, fallbackQuestions);
    } catch (historyError) {
      console.error("Error saving fallback questions to history:", historyError);
    }
    
    if (error instanceof Error) {
      throw new Error(`Failed to generate questions from Gemini API: ${error.message}`);
    }
    throw new Error("Failed to generate questions from Gemini API.");
  }
}

export async function textToSpeech(text: string): Promise<AudioBuffer> {
    try {
        if (!ai) throw new Error('No API key configured for text-to-speech.');

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `Read this question: ${text}` }] }],
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data received from API.");
        }
        
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const dataInt16 = new Int16Array(bytes.buffer);
        const frameCount = dataInt16.length / 1; // Mono channel
        const buffer = audioContext.createBuffer(1, frameCount, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i] / 32768.0;
        }

        return buffer;
    } catch (error) {
        console.error("Error with text-to-speech:", error);
        throw new Error("Failed to convert text to speech.");
    }
}


export async function generateEvaluation(jobRole: string, resumeContent: string, transcript: QuestionAndAnswer[]): Promise<InterviewReport> {
    try {
                // If no API client is configured, return a mock evaluation so the developer can continue.
                if (!ai) {
                    const mockDetails = transcript.map((t, i) => ({
                        question: t.question || `Question ${i + 1}`,
                        answer: t.answer || '',
                        feedback: 'Mock feedback: answer demonstrates basic understanding.',
                        score: 7
                    }));
                    return {
                        id: new Date().toISOString(),
                        date: new Date().toLocaleString(),
                        jobRole,
                        fraudStatus: false,
                        scores: { communication: 7, technical: 7, logic: 7, overall: 7 },
                        summary: { strengths: 'Mock strength', weaknesses: 'Mock weakness', suggestions: 'Practice problem solving.' },
                        details: mockDetails,
                    } as InterviewReport;
                }

                const model = 'gemini-2.5-flash';
                const prompt = `
        As an expert HR manager and technical interviewer, evaluate the following interview transcript with detailed analysis of communication quality, expression, tone, and confidence.

        Job Role: ${jobRole}
        Resume Summary: ${resumeContent.substring(0, 500)}
        
        Interview Transcript with Metadata:
        ${transcript.map((item, idx) => `
Q${idx + 1}: ${item.question}
A${idx + 1}: ${item.answer}

Delivery Metrics for Answer ${idx + 1}:
- Response Time: ${item.responseTime || 'N/A'} seconds
- Confidence Level: ${item.confidence || 'N/A'}/10 (based on hesitations and pauses)
- Hesitations Detected: ${item.hesitationCount || 0} (filler words, um/uh/like)
- Clarity Score: ${item.clarityScore || 'N/A'}/10 (based on speech quality)
- Tone Detected: ${item.tone || 'neutral'} (confident/uncertain/neutral/defensive)
- Answer Length: ${item.answer?.split(/\\s+/).length || 0} words
`).join('\n')}

IMPORTANT: Provide accurate, 100% precise feedback that considers:
1. **Technical Accuracy**: Is the answer technically correct for the role?
2. **Completeness**: Did they address all aspects of the question?
3. **Communication**: Clarity, confidence, tone, and professionalism
4. **Hesitations**: Impact of filler words and pauses on confidence perception
5. **Expression**: Natural flow vs. rehearsed answers
6. **Tone Analysis**: Whether tone matches job requirements (confident for leadership, humble for teamwork)
7. **Time Management**: Appropriate response time (too quick = superficial, too long = rambling)
8. **Behavioral Indicators**: Defensive tone, uncertainty, or confidence signals

Provide a detailed evaluation in JSON format ONLY (no other text):
{
  "scores": {
    "communication": <number 0-10>,
    "technical": <number 0-10>,
    "logic": <number 0-10>,
    "overall": <number 0-10>
  },
  "summary": {
    "strengths": "<detailed strengths including tone and delivery>",
    "weaknesses": "<specific weaknesses including hesitations and tone issues>",
    "suggestions": "<precise, actionable improvements for communication, tone, and confidence>"
  },
  "details": [
    {
      "question": "<q>",
      "answer": "<a>",
      "feedback": "<comprehensive feedback analyzing: technical accuracy, tone, confidence level, hesitations, clarity, and specific improvements>",
      "score": <0-10>,
      "communicationScore": <0-10 based on tone and delivery>,
      "confidenceAnalysis": "<specific feedback on confidence level based on hesitations and tone>",
      "toneAnalysis": "<analysis of detected tone and how it impacts perception>"
    },
    ...
  ]
}`;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        scores: {
                            type: Type.OBJECT,
                            properties: {
                                communication: { type: Type.NUMBER },
                                technical: { type: Type.NUMBER },
                                logic: { type: Type.NUMBER },
                                overall: { type: Type.NUMBER }
                            }
                        },
                        summary: {
                            type: Type.OBJECT,
                            properties: {
                                strengths: { type: Type.STRING },
                                weaknesses: { type: Type.STRING },
                                suggestions: { type: Type.STRING }
                            }
                        },
                        details: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    answer: { type: Type.STRING },
                                    feedback: { type: Type.STRING },
                                    score: { type: Type.NUMBER },
                                    communicationScore: { type: Type.NUMBER },
                                    confidenceAnalysis: { type: Type.STRING },
                                    toneAnalysis: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        console.log('Gemini evaluation result:', result);
        
        // Ensure all required fields are present
        const report = {
            id: new Date().toISOString(),
            date: new Date().toLocaleString(),
            jobRole,
            fraudStatus: false,
            scores: result.scores || { communication: 0, technical: 0, logic: 0, overall: 0 },
            summary: result.summary || { strengths: '', weaknesses: '', suggestions: '' },
            details: (result.details || []).map((detail: any) => ({
                question: detail.question || '',
                answer: detail.answer || '',
                feedback: detail.feedback || '',
                score: detail.score || 0,
                communicationScore: detail.communicationScore,
                confidenceAnalysis: detail.confidenceAnalysis,
                toneAnalysis: detail.toneAnalysis
            }))
        };
        
        console.log('Final Gemini report:', report);
        return report as InterviewReport;

    } catch (error) {
        console.error("Error generating evaluation:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate evaluation from Gemini API: ${error.message}`);
        }
        throw new Error("Failed to generate evaluation from Gemini API.");
    }
}
