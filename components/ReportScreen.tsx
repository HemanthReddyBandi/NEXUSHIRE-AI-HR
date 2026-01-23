// ReportScreen.tsx
import React from 'react';
import ScoreCard from './ScoreCard';
import { InterviewReport, InterviewPurpose } from '../types';

/* ================= PROPS ================= */
interface ReportScreenProps {
  report: InterviewReport | null;
  onStartNew: () => void;
  onViewHistory: () => void;
  isLoading?: boolean;
}

/* ================= ICONS ================= */
const HistoryIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RefreshCwIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const TargetIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChartBarIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" />
  </svg>
);

/* ================= PURPOSE CONFIG ================= */
const purposeConfigs = {
  general: {
    title: (role: string) => `Interview Performance Report - ${role}`,
    icon: ChartBarIcon,
    primary: 'from-indigo-600 to-purple-600'
  }
} as const;

const getPurposeConfig = (purpose?: InterviewPurpose) =>
  purposeConfigs[purpose as keyof typeof purposeConfigs] || purposeConfigs.general;

/* ================= HELPERS ================= */
const metricLabel = (key: string) => {
  const map: Record<string, string> = {
    overall: 'Overall Performance',
    communication: 'Communication Skills',
    technical: 'Technical Skills',
    logic: 'Logic & Reasoning'
  };
  return map[key] || key;
};

const clamp = (n: number) => Math.max(0, Math.min(10, n));

/* ================= METRIC CALCULATORS ================= */
const calcCommunication = (details: any[]) => {
  if (!details.length) return 0;
  const avgClarity =
    details.reduce((a, d) => a + (d.clarityScore || 0), 0) / details.length;
  const avgHesitation =
    details.reduce((a, d) => a + (d.hesitationCount || 0), 0) / details.length;

  return clamp(avgClarity * 0.7 + (10 - avgHesitation) * 0.3);
};

const calcTechnical = (details: any[]) => {
  if (!details.length) return 0;
  const avgWords =
    details.reduce(
      (a, d) => a + (d.answer?.split(/\s+/).length || 0),
      0
    ) / details.length;

  if (avgWords <= 5) return 0;
  if (avgWords <= 15) return 3;
  if (avgWords <= 30) return 5;
  if (avgWords <= 60) return 7;
  return 9;
};

const calcLogic = (details: any[]) => {
  if (!details.length) return 0;

  const avgResponseTime =
    details.reduce((a, d) => a + (d.responseTime || 0), 0) / details.length;

  const avgWords =
    details.reduce(
      (a, d) => a + (d.answer?.split(/\s+/).length || 0),
      0
    ) / details.length;

  // 🚫 No logic if answer is empty or extremely short
  if (avgWords <= 3) return 0;

  // ⏱ Base logic from response time
  let logicScore = 10 - avgResponseTime / 8;

  // 🧠 Penalize shallow thinking
  if (avgWords <= 10) logicScore -= 3;
  else if (avgWords <= 20) logicScore -= 1.5;

  return Math.max(0, Math.min(10, Number(logicScore.toFixed(1))));
};


const calcOverall = (c: number, t: number, l: number) =>
  clamp(c * 0.4 + t * 0.35 + l * 0.25);

/* ================= MAIN COMPONENT ================= */
const ReportScreen: React.FC<ReportScreenProps> = ({
  report,
  onStartNew,
  onViewHistory,
  isLoading = false
}) => {

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-400">
        Generating interview report…
      </div>
    );
  }

  const safeReport: InterviewReport = report ?? {
    jobRole: 'Interview',
    purpose: 'general',
    date: new Date().toLocaleDateString(),
    scores: {},
    summary: { strengths: '', weaknesses: '', suggestions: '' },
    details: []
  };

  const config = getPurposeConfig(safeReport.purpose);
  const Icon = config.icon;
  const details = safeReport.details || [];

  /* ===== FINAL SCORES (FIXED) ===== */
  const communication = calcCommunication(details);
  const technical = calcTechnical(details);
  const logic = calcLogic(details);
  const overall = calcOverall(communication, technical, logic);

  const scoreEntries: [string, number][] = [
    ['overall', overall],
    ['communication', communication],
    ['technical', technical],
    ['logic', logic]
  ];

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10 no-print">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${config.primary}`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              {config.title(safeReport.jobRole)}
            </h1>
          </div>

          <button
            onClick={() => window.print()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600
            text-white font-bold hover:scale-105"
          >
            Download Report (PDF)
          </button>
        </div>
      {/* ================= SCORING CRITERIA ================= */}
<section className="mb-12">
  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
    <ChartBarIcon className="w-6 h-6 text-purple-400" />
    Scoring Criteria
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

    {/* Communication */}
    <div className="bg-gray-800/60 p-6 rounded-xl border border-gray-700">
      <h3 className="text-lg font-semibold text-cyan-400 mb-3">
        Communication Skills
      </h3>
      <ul className="text-sm text-gray-300 space-y-2">
        <li>• Speech clarity</li>
        <li>• Confidence level</li>
        <li>• Filler words (um, uh, maybe)</li>
      </ul>
      <p className="mt-4 text-xs text-gray-400">
        Higher clarity and fewer hesitations result in a higher score.
      </p>
    </div>

    {/* Technical */}
    <div className="bg-gray-800/60 p-6 rounded-xl border border-gray-700">
      <h3 className="text-lg font-semibold text-green-400 mb-3">
        Technical Skills
      </h3>
      <ul className="text-sm text-gray-300 space-y-2">
        <li>• Depth of explanation</li>
        <li>• Structured responses</li>
        <li>• Answer length</li>
      </ul>
      <p className="mt-4 text-xs text-gray-400">
        Longer, well-explained answers score higher than short responses.
      </p>
    </div>

    {/* Logic */}
    <div className="bg-gray-800/60 p-6 rounded-xl border border-gray-700">
      <h3 className="text-lg font-semibold text-yellow-400 mb-3">
        Logic & Reasoning
      </h3>
      <ul className="text-sm text-gray-300 space-y-2">
        <li>• Response time</li>
        <li>• Consistency of answers</li>
        <li>• Meaningful reasoning</li>
      </ul>
      <p className="mt-4 text-xs text-gray-400">
        Fast but shallow answers are penalized. Depth matters.
      </p>
    </div>

    {/* Overall */}
    <div className="bg-gray-800/60 p-6 rounded-xl border border-gray-700">
      <h3 className="text-lg font-semibold text-purple-400 mb-3">
        Overall Performance
      </h3>
      <ul className="text-sm text-gray-300 space-y-2">
        <li>• Communication (40%)</li>
        <li>• Technical (35%)</li>
        <li>• Logic (25%)</li>
      </ul>
      <p className="mt-4 text-xs text-gray-400">
        Final score is a weighted average of all sections.
      </p>
    </div>

  </div>
</section>

        {/* PERFORMANCE */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <TargetIcon className="w-6 h-6 text-cyan-400" />
            Performance Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {scoreEntries.map(([key, value], index) => (
              <ScoreCard
                key={key}
                title={metricLabel(key)}
                score={Number(value.toFixed(1))}
                description={`Evaluation for ${metricLabel(key)}`}
                size={index === 0 ? 'large' : 'medium'}
              />
            ))}
          </div>
        </section>
        {/* ================= SCORING GRADES ================= */}
<section className="mb-12">
  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
    <ChartBarIcon className="w-6 h-6 text-emerald-400" />
    Score Grades & Interpretation
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

    {/* Needs Improvement */}
    <div className="bg-gray-800/60 p-6 rounded-xl border border-red-500/30">
      <h3 className="text-lg font-semibold text-red-400 mb-2">
        1 – 3 : Needs Improvement
      </h3>
      <ul className="text-sm text-gray-300 space-y-1">
        <li>• Very short or no answers</li>
        <li>• Poor clarity or confidence</li>
        <li>• High hesitation or silence</li>
      </ul>
      <p className="mt-3 text-xs text-gray-400">
        Candidate needs significant improvement in this area.
      </p>
    </div>

    {/* Average */}
    <div className="bg-gray-800/60 p-6 rounded-xl border border-yellow-500/30">
      <h3 className="text-lg font-semibold text-yellow-400 mb-2">
        4 – 6 : Average
      </h3>
      <ul className="text-sm text-gray-300 space-y-1">
        <li>• Basic understanding shown</li>
        <li>• Some clarity, minor hesitation</li>
        <li>• Answers lack depth</li>
      </ul>
      <p className="mt-3 text-xs text-gray-400">
        Candidate meets minimum expectations but needs refinement.
      </p>
    </div>

    {/* Good / Excellent */}
    <div className="bg-gray-800/60 p-6 rounded-xl border border-green-500/30">
      <h3 className="text-lg font-semibold text-green-400 mb-2">
        7 – 10 : Good / Excellent
      </h3>
      <ul className="text-sm text-gray-300 space-y-1">
        <li>• Clear, confident communication</li>
        <li>• Strong reasoning & explanation</li>
        <li>• Minimal hesitation</li>
      </ul>
      <p className="mt-3 text-xs text-gray-400">
        Candidate demonstrates strong performance in this area.
      </p>
    </div>

  </div>
</section>


        {/* ACTIONS */}
        <div className="flex gap-6 justify-center mt-12 no-print">
          <button
            onClick={onStartNew}
            className="px-8 py-4 rounded-xl bg-indigo-600 text-white font-bold"
          >
            <RefreshCwIcon className="inline mr-2" />
            Start New Interview
          </button>

          <button
            onClick={onViewHistory}
            className="px-8 py-4 rounded-xl bg-gray-800 border border-gray-700 text-white font-bold"
          >
            <HistoryIcon className="inline mr-2" />
            View History
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default ReportScreen;
