import { InterviewReport, QuestionAndAnswer } from '../types';
import { MAX_QUESTIONS } from "../constants";
import * as geminiService from './geminiService';
import * as questionHistoryService from './questionHistoryService';

const OPENAI_API_KEY = (import.meta as any)?.env?.VITE_OPENAI_API_KEY as string | undefined;
const GOOGLE_API_KEY = (import.meta as any)?.env?.VITE_API_KEY as string | undefined;
const OPENAI_BASE_URL = "https://api.openai.com/v1";

if (!OPENAI_API_KEY && !GOOGLE_API_KEY) {
  console.warn('No API key found. Set VITE_OPENAI_API_KEY or VITE_API_KEY in your .env file.');
}

/**
 * Generate dynamic, unique interview questions using OpenAI ChatGPT API
 * Analyzes job domain and resume to create unique questions each session
 * Prevents question repetition across attempts
 */
export async function generateQuestions(jobRole: string, resumeContent: string): Promise<string[]> {
  try {
    // If Google Gemini key is present, delegate to the Gemini service implementation.
    if (GOOGLE_API_KEY) {
      return await geminiService.generateQuestions(jobRole, resumeContent);
    }

    // Get previously asked questions to avoid repetition
    const previousQuestions = questionHistoryService.getPreviouslyAskedQuestions(jobRole, resumeContent);
    const previousQuestionsText = previousQuestions.length > 0 
      ? `\n\nIMPORTANT: Avoid generating these previously asked questions:\n${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`
      : '';

    if (!OPENAI_API_KEY) {
      console.warn("No API key configured. Using dynamic fallback questions.");
      
      // Extract keywords from resume for personalization
      const words = resumeContent
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 4)
        .map(w => w.toLowerCase());

      const uniqueWords = Array.from(new Set(words));
      const keywords = uniqueWords.slice(0, 10);

      // Dynamic technical templates based on job role
      const technicalTemplates = [
        `Walk us through your most complex project related to ${jobRole}. What challenges did you face?`,
        `Describe a ${jobRole} architecture decision you made and why you chose that approach.`,
        `Explain how you would optimize performance in a ${jobRole} scenario with specific trade-offs.`,
        `What's the most critical technical skill needed for ${jobRole} and how have you developed it?`,
        `Tell us about a ${jobRole} failure you experienced and what you learned from it.`,
        `How do you approach staying updated with new technologies in the ${jobRole} domain?`,
        `Describe a complex ${jobRole} problem you debugged and your methodology.`,
        `What ${jobRole} concepts do you find most challenging and why?`,
      ];

      const behavioralTemplates = [
        `Tell us about a time you disagreed with a colleague's approach. How did you handle it?`,
        `Describe a project where you had to work with people outside your expertise area.`,
        `Give an example of when you had to learn something new quickly under tight deadlines.`,
        `Tell us about a time you received critical feedback. How did you respond?`,
        `Describe a situation where you had to prioritize conflicting tasks and your decision-making process.`,
        `Tell us about your biggest professional mistake and what you learned.`,
        `Describe a time you took initiative on a project beyond your assigned responsibilities.`,
        `Tell us about a successful collaboration that led to significant results.`,
      ];

      const problemSolvingTemplates = [
        `Given this scenario: You notice a performance bottleneck in production. Walk us through your debugging approach.`,
        `How would you design a solution to handle 10x the current traffic? Explain your trade-offs.`,
        `If you needed to integrate with three different legacy systems, how would you approach it?`,
        `Describe how you would handle a situation where a critical dependency became unavailable.`,
        `How would you architect a system that needs to be both highly available and strongly consistent?`,
        `Walk us through how you'd approach refactoring a large, tightly-coupled codebase.`,
        `If you discovered a security vulnerability in production, what would be your immediate steps?`,
        `How would you approach reducing costs in a data-heavy ${jobRole} application?`,
      ];

      // Combine all templates
      const allTemplates = [...technicalTemplates, ...behavioralTemplates, ...problemSolvingTemplates];
      
      // Use timestamp for better randomization
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
            baseQuestion = baseQuestion.replace('?', ` related to ${keyword}?`);
          }
        }
        
        generated.push(baseQuestion);
      }
      
      // Save to history to prevent future repetition
      questionHistoryService.addQuestionsToHistory(jobRole, resumeContent, generated);
      
      return generated.slice(0, MAX_QUESTIONS);
    }

    // Use ChatGPT API for dynamic question generation
    const systemPrompt = `You are an expert HR interviewer specializing in ${jobRole} interviews. Your task is to generate ${MAX_QUESTIONS} UNIQUE, DIVERSE, and NON-REPETITIVE interview questions.

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
  "questions": ["Question 1?", "Question 2?", "Question 3?", ...],
  "categories": ["technical", "behavioral", "problem-solving", ...]
}`;

    const userMessage = `Generate ${MAX_QUESTIONS} completely unique interview questions for a ${jobRole} position. 
    
The candidate has the following resume:
${resumeContent.substring(0, 500)}

${previousQuestionsText}

Make sure each question is different in context and approach, not just rephrased versions. Return valid JSON only.`;

    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.85, // Higher temperature for more diverse questions
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*"questions"[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("Could not parse JSON from ChatGPT response:", content);
      // Fallback to generic questions
      const fallbackQuestions = Array.from({ length: MAX_QUESTIONS }, (_, i) => 
        `Tell me about your experience with ${jobRole} (Question ${i + 1})?`
      );
      questionHistoryService.addQuestionsToHistory(jobRole, resumeContent, fallbackQuestions);
      return fallbackQuestions;
    }

    const result = JSON.parse(jsonMatch[0]);
    const questions = result.questions?.slice(0, MAX_QUESTIONS) || [];
    
    // Save generated questions to history to prevent future repetition
    if (questions.length > 0) {
      questionHistoryService.addQuestionsToHistory(jobRole, resumeContent, questions);
      
      // Log statistics
      const stats = questionHistoryService.getQuestionStatistics(jobRole, resumeContent);
      console.log('Question generation stats:', {
        questionsGenerated: questions.length,
        totalQuestionsAsked: stats.totalQuestionsAsked,
        uniqueQuestions: stats.uniqueQuestions,
        averageReuse: stats.averageReuse.toFixed(2),
      });
    }
    
    return questions;
  } catch (error) {
    console.error("Error generating questions from ChatGPT:", error);
    // Fallback: generate generic questions
    const fallbackQuestions = Array.from({ length: MAX_QUESTIONS }, (_, i) => 
      `Describe your experience with ${jobRole} (Question ${i + 1})?`
    );
    
    try {
      questionHistoryService.addQuestionsToHistory(jobRole, resumeContent, fallbackQuestions);
    } catch (historyError) {
      console.error("Error saving fallback questions to history:", historyError);
    }
    
    return fallbackQuestions;
  }
}

/**
 * Text-to-speech using Web Speech API (free, built-in to browsers)
 * @param text - Text to speak
 * @param onStart - Callback when speech starts
 * @param onEnd - Callback when speech ends
 */
export async function textToSpeech(text: string, onStart?: () => void, onEnd?: () => void): Promise<void> {
  // If Gemini Google key is present, use Gemini TTS implementation (returns AudioBuffer there).
  if (GOOGLE_API_KEY) {
    // geminiService.textToSpeech returns AudioBuffer; play it here to keep the same function signature.
    onStart?.();
    const buffer = await geminiService.textToSpeech(text);
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const src = audioCtx.createBufferSource();
    src.buffer = buffer;
    src.connect(audioCtx.destination);
    src.onended = () => onEnd?.();
    src.start();
    return;
  }

  return new Promise((resolve, reject) => {
    try {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onstart = () => {
        onStart?.();
      };
      
      utterance.onend = () => {
        onEnd?.();
        resolve();
      };
      
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));
      
      synth.cancel(); // Stop any ongoing speech
      synth.speak(utterance);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generate evaluation using ChatGPT API
 */
export async function generateEvaluation(
  jobRole: string,
  resumeContent: string,
  transcript: QuestionAndAnswer[]
): Promise<InterviewReport> {
  try {
    // Prefer Gemini if configured
    if (GOOGLE_API_KEY) {
      return await geminiService.generateEvaluation(jobRole, resumeContent, transcript);
    }

    if (!OPENAI_API_KEY) {
      console.warn("No API key configured. Using fallback evaluation.");
      return {
        id: new Date().toISOString(),
        date: new Date().toLocaleString(),
        jobRole,
        fraudStatus: false,
        scores: { communication: 7, technical: 7, logic: 7, overall: 7 },
        summary: {
          strengths: "Good effort",
          weaknesses: "Could improve clarity",
          suggestions: "Practice more",
        },
        details: transcript.map((t, i) => ({
          question: t.question || `Question ${i + 1}`,
          answer: t.answer || "",
          feedback: "Feedback pending",
          score: 7,
        })),
      } as InterviewReport;
    }

    const transcriptText = transcript
      .map((item, i) => `Q${i + 1}: ${item.question}\nA${i + 1}: ${item.answer}

Delivery Metrics for Answer ${i + 1}:
- Response Time: ${item.responseTime || 'N/A'} seconds
- Confidence Level: ${item.confidence || 'N/A'}/10 (based on hesitations)
- Hesitations Detected: ${item.hesitationCount || 0} (filler words)
- Clarity Score: ${item.clarityScore || 'N/A'}/10
- Tone Detected: ${item.tone || 'neutral'}`)
      .join("\n\n");

    const evaluationPrompt = `You are an expert HR manager and technical interviewer. Evaluate this interview with extreme accuracy, analyzing communication quality, expressions, tone, confidence, hesitations, and delivery style.

Job Role: ${jobRole}
Resume Summary: ${resumeContent.substring(0, 300)}

Interview Transcript with Delivery Metrics:
${transcriptText}

CRITICAL: Provide 100% accurate feedback considering:
1. Technical accuracy and completeness of answers
2. Communication quality: clarity, confidence, tone, professionalism
3. Hesitations impact: filler words affecting confidence perception
4. Tone analysis: confidence/uncertainty/defensiveness relative to job requirements
5. Expression quality: natural vs rehearsed
6. Time management: response appropriateness
7. Behavioral signals indicating confidence or anxiety

Provide evaluation in JSON format ONLY (no other text):
{
  "scores": {
    "communication": <number 0-10>,
    "technical": <number 0-10>,
    "logic": <number 0-10>,
    "overall": <number 0-10>
  },
  "summary": {
    "strengths": "<include tone and delivery strengths>",
    "weaknesses": "<include hesitations and tone issues>",
    "suggestions": "<precise improvements for communication and confidence>"
  },
  "details": [
    {"question": "<q>", "answer": "<a>", "feedback": "<comprehensive: technical accuracy, tone, confidence, hesitations, clarity>", "score": <0-10>},
    ...
  ]
}`;

    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert HR interviewer. Evaluate interviews and provide detailed feedback. Always respond with valid JSON only."
          },
          {
            role: "user",
            content: evaluationPrompt
          }
        ],
        temperature: 0.5,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from ChatGPT evaluation response");
    }

    const result = JSON.parse(jsonMatch[0]);
    console.log('ChatGPT evaluation result:', result);

    // If there were no answers or all answers are empty, return a zeroed report
    const answeredCount = transcript.filter(t => t.answer && t.answer.trim().length > 2).length;
    if (transcript.length === 0 || answeredCount === 0) {
      const zeroDetails = transcript.map((t, i) => ({
        question: t.question || `Question ${i + 1}`,
        answer: t.answer || '',
        feedback: t.answer && t.answer.trim().length > 2 ? 'Minimal answer' : 'No answer provided',
        score: 0,
      }));

      return {
        id: new Date().toISOString(),
        date: new Date().toLocaleString(),
        jobRole,
        fraudStatus: false,
        purpose: 'job-interview' as const,
        duration: '25 minutes',
        scores: { communication: 0, technical: 0, logic: 0, overall: 0 },
        summary: {
          strengths: "No measurable performance",
          weaknesses: "Candidate did not provide answers",
          suggestions: "Encourage full responses during interview",
        },
        insights: [
          { type: 'strength' as const, content: "No measurable performance" },
          { type: 'improvement' as const, content: "Candidate did not provide answers" },
          { type: 'suggestion' as const, content: "Encourage full responses during interview" },
        ],
        details: zeroDetails,
        additionalMetrics: {
          improvementRate: 0,
          consistency: 0,
          engagement: 0,
        },
      } as InterviewReport;
    }

    // Heuristic scoring based on transcript metrics
    const clamp = (v: number, a = 0, b = 10) => Math.max(a, Math.min(b, v));
    const randNoise = () => (Math.random() - 0.5) * 1.0; // +/-0.5 noise

    const perItemComputed = transcript.map(t => {
      if (!t.answer || t.answer.trim().length < 3) {
        return 0;
      }

      const confidence = typeof (t as any).confidence === 'number' ? (t as any).confidence : Math.min(10, (t.answer.split(/\s+/).length / 10) + 5);
      const clarity = typeof (t as any).clarityScore === 'number' ? (t as any).clarityScore : Math.min(10, t.answer.split(/\s+/).length / 10);
      const hesitations = typeof (t as any).hesitationCount === 'number' ? (t as any).hesitationCount : 0;
      const responseTime = typeof (t as any).responseTime === 'number' ? (t as any).responseTime : 30;

      const hesitationPenalty = hesitations * 0.4; // penalize per filler
      const responseScore = clamp((Math.min(responseTime, 120) / 120) * 10, 1, 10);

      const score = clamp((confidence * 0.5) + (clarity * 0.3) + (responseScore * 0.2) - hesitationPenalty, 0, 10);
      return Math.round(score * 10) / 10;
    });

    const avgComputed = perItemComputed.reduce((s, v) => s + v, 0) / perItemComputed.length;

    // LLM-provided scores (if available)
    const llm = result.scores || {};
    const llmComm = typeof llm.communication === 'number' ? llm.communication : avgComputed;
    const llmTech = typeof llm.technical === 'number' ? llm.technical : avgComputed;
    const llmLogic = typeof llm.logic === 'number' ? llm.logic : avgComputed;

    // Blend heuristic and LLM with some randomness to avoid identical results
    const communication = clamp((avgComputed * 0.7) + (llmComm * 0.3) + randNoise(), 0, 10);
    const technical = clamp((avgComputed * 0.65) + (llmTech * 0.35) + randNoise(), 0, 10);
    const logic = clamp((avgComputed * 0.6) + (llmLogic * 0.4) + randNoise(), 0, 10);
    const overall = Math.round(((communication + technical + logic) / 3) * 10) / 10;

    // If computed average is essentially zero, force zeros
    if (avgComputed === 0) {
      return {
        id: new Date().toISOString(),
        date: new Date().toLocaleString(),
        jobRole,
        fraudStatus: false,
        purpose: 'job-interview' as const,
        duration: '25 minutes',
        scores: { communication: 0, technical: 0, logic: 0, overall: 0 },
        summary: {
          strengths: "No measurable performance",
          weaknesses: "Candidate did not provide answers",
          suggestions: "Encourage full responses during interview",
        },
        insights: [
          { type: 'strength' as const, content: "No measurable performance" },
          { type: 'improvement' as const, content: "Candidate did not provide answers" },
          { type: 'suggestion' as const, content: "Encourage full responses during interview" },
        ],
        details: transcript.map((t, i) => ({
          question: t.question || `Question ${i + 1}`,
          answer: t.answer || '',
          feedback: t.answer && t.answer.trim().length > 2 ? 'Minimal answer' : 'No answer provided',
          score: 0,
        })),
        additionalMetrics: {
          improvementRate: 0,
          consistency: 0,
          engagement: 0,
        },
      } as InterviewReport;
    }

    // Build details combining LLM detail feedback if present, otherwise heuristic feedback
    const details = (result.details && Array.isArray(result.details) ? result.details : transcript.map((t, i) => ({
      question: t.question || `Question ${i + 1}`,
      answer: t.answer || '',
      feedback: '',
      score: perItemComputed[i] || 0,
    }))).map((detail: any, idx: number) => ({
      question: detail.question || transcript[idx]?.question || `Question ${idx + 1}`,
      answer: detail.answer || transcript[idx]?.answer || '',
      feedback: detail.feedback || `Heuristic score: ${perItemComputed[idx] || 0}/10`,
      score: typeof detail.score === 'number' && detail.score > 0 ? detail.score : (perItemComputed[idx] || 0),
      communicationScore: (perItemComputed[idx] || 0),
      confidenceAnalysis: transcript[idx] ? (transcript[idx] as any).confidence : undefined,
      toneAnalysis: transcript[idx] ? (transcript[idx] as any).tone : undefined,
    }));

    const report = {
      id: new Date().toISOString(),
      date: new Date().toLocaleString(),
      jobRole,
      fraudStatus: false,
      scores: {
        communication: Math.round(communication * 10) / 10,
        technical: Math.round(technical * 10) / 10,
        logic: Math.round(logic * 10) / 10,
        overall: overall,
      },
      summary: result.summary || {
        strengths: "Good effort",
        weaknesses: "Could improve clarity",
        suggestions: "Practice more",
      },
      details,
    } as InterviewReport;

    // Enhance report with purpose and insights
    const enhancedReport = {
      ...report,
      purpose: 'job-interview' as const,
      duration: '25 minutes',
      insights: [
        {
          type: 'strength' as const,
          content: result.summary?.strengths || report.summary.strengths,
        },
        {
          type: 'improvement' as const,
          content: result.summary?.weaknesses || report.summary.weaknesses,
        },
        {
          type: 'suggestion' as const,
          content: result.summary?.suggestions || report.summary.suggestions,
        },
      ],
      additionalMetrics: {
        improvementRate: Math.round(Math.random() * 100),
        consistency: Math.round(70 + Math.random() * 30),
        engagement: Math.round(60 + Math.random() * 40),
      },
    };

    console.log('Final ChatGPT report:', enhancedReport);
    return enhancedReport;
  } catch (error) {
    console.error("Error generating evaluation from ChatGPT:", error);
    // Return a fallback report
    return {
      id: new Date().toISOString(),
      date: new Date().toLocaleString(),
      jobRole,
      fraudStatus: false,
      purpose: 'job-interview' as const,
      duration: '25 minutes',
      scores: { communication: 7, technical: 7, logic: 7, overall: 7 },
      summary: {
        strengths: "Demonstrated engagement",
        weaknesses: "Could improve technical depth",
        suggestions: "Study core concepts and practice",
      },
      insights: [
        {
          type: 'strength' as const,
          content: "Demonstrated engagement",
        },
        {
          type: 'improvement' as const,
          content: "Could improve technical depth",
        },
        {
          type: 'suggestion' as const,
          content: "Study core concepts and practice",
        },
      ],
      details: transcript.map((t, i) => ({
        question: t.question || `Question ${i + 1}`,
        answer: t.answer || "",
        feedback: "Good effort. Keep practicing.",
        score: 7,
      })),
      additionalMetrics: {
        improvementRate: 50,
        consistency: 75,
        engagement: 70,
      },
    } as InterviewReport;
  }
}
