import { useState } from "react";
import { Student } from "../types";

interface Props {
  students: Student[];
  onAdd: (studentId: string, subject: string, score: number) => void;
}

export default function GradeForm({ students, onAdd }: Props) {
  const [studentId, setStudentId] = useState("");
  const [subject, setSubject] = useState("");
  const [score, setScore] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = Number(score);
    if (!studentId) {
      setError("Select a student first.");
      return;
    }
    if (!subject.trim()) {
      setError("Enter a subject/test name.");
      return;
    }
    if (score === "" || Number.isNaN(parsed) || parsed < 0 || parsed > 100) {
      setError("Score must be a number between 0 and 100.");
      return;
    }
    onAdd(studentId, subject.trim(), parsed);
    setSubject("");
    setScore("");
    setError("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
          2
        </span>
        Record a Grade
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Student</label>
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
          >
            <option value="">Select…</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Subject / Test</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Mathematics"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Score (0-100)</label>
          <input
            value={score}
            onChange={(e) => setScore(e.target.value)}
            type="number"
            min={0}
            max={100}
            placeholder="e.g. 87"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
          />
        </div>
      </div>
      {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
      <button
        type="submit"
        disabled={students.length === 0}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
      >
        + Add Grade
      </button>
      {students.length === 0 && (
        <p className="text-xs text-slate-400 dark:text-slate-500">Add a student before recording grades.</p>
      )}
    </form>
  );
}
