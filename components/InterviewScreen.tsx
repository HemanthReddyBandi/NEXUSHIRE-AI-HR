// InterviewScreen.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { textToSpeech } from '../services/chatgptService';
import { QuestionAndAnswer, InterviewState } from '../types';
import { MAX_QUESTIONS, MAX_WARNINGS } from '../constants';
import Avatar from './Avatar';
import {
  MicIcon,
  StopIcon,
  AlertTriangleIcon,
  ClockIcon,
  SparklesIcon
} from './icons/Icons';

interface InterviewScreenProps {
  onFinish: (transcript: QuestionAndAnswer[], videoBlob?: Blob) => void;
  interviewState: InterviewState;
  dispatch: React.Dispatch<any>;
}

const InterviewScreen: React.FC<InterviewScreenProps> = ({
  onFinish,
  interviewState,
  dispatch
}) => {
  const { questions, currentQuestionIndex, webcamStream, warnings } =
    interviewState;

  /* ================= STATE ================= */
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [transcript, setTranscript] = useState<QuestionAndAnswer[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [answerStartTime, setAnswerStartTime] = useState<number | null>(null);
  const [hesitationCount, setHesitationCount] = useState(0);
  const [showTimer, setShowTimer] = useState(false);

  /* ===== VIDEO RECORDING STATE ===== */
  const [isRecording, setIsRecording] = useState(false);

  /* ================= REFS ================= */
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const lastTranscriptRef = useRef('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  /* ================= TIMER ================= */
  useEffect(() => {
    const id = setInterval(() => setElapsedTime(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const formatTime = (t: number) =>
    `${Math.floor(t / 60).toString().padStart(2, '0')}:${(t % 60)
      .toString()
      .padStart(2, '0')}`;

  /* ================= VIDEO PREVIEW ================= */
  useEffect(() => {
    if (webcamStream && videoRef.current) {
      videoRef.current.srcObject = webcamStream;
      videoRef.current.play().catch(console.error);
    }
  }, [webcamStream]);

  /* ================= VIDEO RECORDING ================= */
  const startRecording = () => {
    if (!webcamStream || isRecording) return;

    recordedChunksRef.current = [];
    const recorder = new MediaRecorder(webcamStream, {
      mimeType: 'video/webm; codecs=vp8,opus'
    });

    recorder.ondataavailable = e => {
      if (e.data.size > 0) recordedChunksRef.current.push(e.data);
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
  };

  const stopRecording = (): Blob | null => {
    if (!mediaRecorderRef.current || !isRecording) return null;

    mediaRecorderRef.current.stop();
    setIsRecording(false);

    return new Blob(recordedChunksRef.current, {
      type: 'video/webm'
    });
  };

  const downloadVideo = () => {
    if (!recordedChunksRef.current.length) {
      alert('No video recorded');
      return;
    }

    const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /* ================= ASK QUESTION ================= */
  const askQuestion = useCallback(async (question: string) => {
    setCurrentAnswer('');
    setIsAiSpeaking(false);

    setTimeout(async () => {
      try {
        setIsAiSpeaking(true);
        await textToSpeech(question);
      } catch (e) {
        console.error(e);
      } finally {
        setIsAiSpeaking(false);
      }
    }, 50);
  }, []);

  useEffect(() => {
    if (questions.length && currentQuestionIndex < questions.length) {
      askQuestion(questions[currentQuestionIndex]);
    }
  }, [questions, currentQuestionIndex]);

  /* ================= WARNINGS ================= */
  useEffect(() => {
    const handler = () => {
      if (document.hidden && warnings < MAX_WARNINGS) {
        dispatch({ type: 'ADD_WARNING' });
        alert(
          warnings + 1 === MAX_WARNINGS
            ? 'Final Warning: Malpractice will be detected.'
            : `Warning ${warnings + 1}/${MAX_WARNINGS}`
        );
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [warnings]);

  /* ================= SPEECH RECOGNITION ================= */
  const startListening = () => {
    if (isAiSpeaking) return;

    const SR =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SR) {
      alert('Speech recognition not supported');
      return;
    }

    recognitionRef.current = new SR();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    setAnswerStartTime(Date.now());
    setShowTimer(true);
    setHesitationCount(0);
    lastTranscriptRef.current = '';

    recognitionRef.current.onresult = (e: any) => {
      let text = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      setCurrentAnswer(text);

      if (text !== lastTranscriptRef.current) {
        const fillers = ['um', 'uh', 'like', 'maybe', 'i think'];
        const count = text
          .toLowerCase()
          .split(/\s+/)
          .filter(w => fillers.some(f => w.includes(f))).length;
        setHesitationCount(count);
        lastTranscriptRef.current = text;
      }
    };

    setTimeout(() => {
      recognitionRef.current.start();
      setIsListening(true);
    }, 400);
  };

  /* ================= STOP LISTEN / FINISH ================= */
  const stopListening = (finishInterview = false) => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setShowTimer(false);

    const responseTime = answerStartTime
      ? Math.round((Date.now() - answerStartTime) / 1000)
      : 0;

    const words = currentAnswer.trim().split(/\s+/).length;
    const confidence = Math.max(0, Math.min(10, 10 - hesitationCount * 0.5));
    const clarity = Math.min(10, words / 10);

    const entry: QuestionAndAnswer = {
      question: questions[currentQuestionIndex],
      answer: currentAnswer,
      feedback: finishInterview
        ? 'Interview stopped early by candidate.'
        : '',
      score: 0,
      responseTime,
      confidence,
      hesitationCount,
      clarityScore: clarity,
      tone: 'neutral',
      keywordsMatched: []
    };

    const updated = currentAnswer ? [...transcript, entry] : transcript;
    setTranscript(updated);
    setCurrentAnswer('');

    if (finishInterview) {
      const videoBlob = stopRecording();
      onFinish(updated, videoBlob || undefined);
    } else {
      dispatch({ type: 'NEXT_QUESTION', payload: { answer: currentAnswer } });
    }
  };

  /* ================= EMPTY ================= */
  if (!questions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <SparklesIcon className="w-10 h-10 animate-pulse text-purple-400" />
        <p className="mt-4 text-gray-400">Preparing interview questions…</p>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-6 max-w-7xl mx-auto">

      {/* STOP INTERVIEW */}
      <button
        onClick={() => stopListening(true)}
        className="fixed top-6 right-6 z-50 px-5 py-2.5 rounded-xl
        bg-gradient-to-r from-red-700 to-rose-700 text-white font-bold shadow-xl"
      >
        <StopIcon className="w-5 h-5 inline mr-2" />
        Stop Interview
      </button>

      {/* VIDEO CONTROLS */}
      <div className="fixed top-6 right-52 z-50 flex gap-3">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="px-4 py-2 rounded-xl bg-blue-700 text-white font-bold"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-4 py-2 rounded-xl bg-yellow-600 text-white font-bold"
          >
            Stop Recording
          </button>
        )}

        <button
          onClick={downloadVideo}
          className="px-4 py-2 rounded-xl bg-green-700 text-white font-bold"
        >
          Download Video
        </button>
      </div>

      {/* LEFT PANEL */}
      <div className="space-y-8">
        <Avatar isSpeaking={isAiSpeaking} />
        <div className="text-white text-lg">
          {questions[currentQuestionIndex]}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="space-y-8">
        <video ref={videoRef} autoPlay muted className="w-full h-72 rounded-xl object-cover" />

        <div className="bg-gray-800 p-4 rounded-xl min-h-[120px] text-gray-300">
          {currentAnswer || 'Your answer will appear here'}
        </div>

        <button
          onClick={isListening ? () => stopListening() : startListening}
          disabled={isAiSpeaking}
          className="w-full py-4 rounded-xl bg-gradient-to-r
          from-purple-600 to-indigo-600 text-white font-bold"
        >
          {isListening ? 'Stop Answering' : 'Start Answering'}
        </button>

        <div className="text-gray-400 text-sm flex items-center gap-2">
          <ClockIcon className="w-4 h-4" />
          Interview Time: {formatTime(elapsedTime)}
        </div>
      </div>
    </div>
  );
};

export default InterviewScreen;
