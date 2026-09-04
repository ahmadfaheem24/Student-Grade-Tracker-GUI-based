import { Student, average, letterGrade } from "../types";

interface Props {
  students: Student[];
}

function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          {label}
        </p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-base ${accent}`}>
          {icon}
        </span>
      </div>
      <p className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{sub}</p>}
    </div>
  );
}

export default function SummaryReport({ students }: Props) {
  const withGrades = students.filter((s) => s.grades.length > 0);
  const allScores = withGrades.flatMap((s) => s.grades.map((g) => g.score));
  const classAverage = allScores.length
    ? allScores.reduce((a, b) => a + b, 0) / allScores.length
    : 0;

  let topStudent: { student: Student; avg: number } | null = null;
  let bottomStudent: { student: Student; avg: number } | null = null;
  for (const s of withGrades) {
    const avg = average(s.grades);
    if (!topStudent || avg > topStudent.avg) topStudent = { student: s, avg };
    if (!bottomStudent || avg < bottomStudent.avg) bottomStudent = { student: s, avg };
  }

  const highestScore = allScores.length ? Math.max(...allScores) : null;
  const lowestScore = allScores.length ? Math.min(...allScores) : null;

  const distribution: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  withGrades.forEach((s) => {
    const letter = letterGrade(average(s.grades));
    distribution[letter] = (distribution[letter] || 0) + 1;
  });
  const maxDist = Math.max(1, ...Object.values(distribution));

  const barColors: Record<string, string> = {
    A: "bg-emerald-500",
    B: "bg-sky-500",
    C: "bg-amber-500",
    D: "bg-orange-500",
    F: "bg-rose-500",
  };

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
          📊
        </span>
        Class Summary Report
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          label="Students"
          value={String(students.length)}
          icon="👥"
          accent="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300"
        />
        <StatCard
          label="Class Average"
          value={allScores.length ? classAverage.toFixed(1) : "—"}
          icon="∑"
          accent="bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300"
        />
        <StatCard
          label="Highest Score"
          value={highestScore !== null ? String(highestScore) : "—"}
          icon="🏆"
          accent="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
        />
        <StatCard
          label="Lowest Score"
          value={lowestScore !== null ? String(lowestScore) : "—"}
          icon="⚠️"
          accent="bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300"
        />
        <StatCard
          label="Total Grades"
          value={String(allScores.length)}
          icon="📝"
          accent="bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
            🥇 Top Performer
          </p>
          {topStudent ? (
            <div>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{topStudent.student.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Average score: {topStudent.avg.toFixed(1)}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-400 dark:text-slate-500">No data yet</p>
          )}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
            📉 Needs Improvement
          </p>
          {bottomStudent ? (
            <div>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{bottomStudent.student.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Average score: {bottomStudent.avg.toFixed(1)}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-400 dark:text-slate-500">No data yet</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          Grade Distribution
        </p>
        <div className="space-y-2">
          {Object.entries(distribution).map(([letter, count]) => (
            <div key={letter} className="flex items-center gap-3">
              <span className="w-4 text-sm font-semibold text-slate-600 dark:text-slate-300">{letter}</span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full ${barColors[letter]} transition-all`}
                  style={{ width: `${(count / maxDist) * 100}%` }}
                />
              </div>
              <span className="w-6 text-right text-xs font-medium text-slate-500 dark:text-slate-400">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
