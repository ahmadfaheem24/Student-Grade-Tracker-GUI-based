import { Student, average, highest, lowest, letterGrade, letterColor } from "../types";

interface Props {
  students: Student[];
  onDeleteStudent: (id: string) => void;
  onDeleteGrade: (studentId: string, gradeId: string) => void;
}

export default function StudentList({ students, onDeleteStudent, onDeleteGrade }: Props) {
  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center dark:border-slate-700 dark:bg-slate-900/50">
        <span className="text-4xl">🎓</span>
        <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
          No students yet. Add your first student above to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {students.map((student) => {
        const avg = average(student.grades);
        const hi = highest(student.grades);
        const lo = lowest(student.grades);
        const letter = student.grades.length ? letterGrade(avg) : "–";
        return (
          <div
            key={student.id}
            className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
                  {student.name
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{student.name}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {student.rollNo ? `Roll No. ${student.rollNo} · ` : ""}
                    {student.grades.length} grade{student.grades.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-slate-400 dark:text-slate-500">Average</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    {student.grades.length ? avg.toFixed(1) : "—"}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-sm font-bold ${letterColor(letter === "–" ? "" : letter)}`}
                >
                  {letter}
                </span>
                <button
                  onClick={() => onDeleteStudent(student.id)}
                  title="Remove student"
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500 dark:text-slate-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                >
                  ✕
                </button>
              </div>
            </div>

            {student.grades.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-2 text-xs dark:bg-slate-800/60 sm:grid-cols-2">
                <p className="text-slate-500 dark:text-slate-400">
                  🔼 Highest:{" "}
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{hi?.score}</span>{" "}
                  <span className="text-slate-400 dark:text-slate-500">({hi?.subject})</span>
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  🔽 Lowest:{" "}
                  <span className="font-semibold text-rose-600 dark:text-rose-400">{lo?.score}</span>{" "}
                  <span className="text-slate-400 dark:text-slate-500">({lo?.subject})</span>
                </p>
              </div>
            )}

            {student.grades.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {student.grades.map((g) => (
                  <span
                    key={g.id}
                    className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <span className="font-medium text-slate-700 dark:text-slate-200">{g.subject}</span>
                    <span className="rounded-full bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                      {g.score}
                    </span>
                    <button
                      onClick={() => onDeleteGrade(student.id, g.id)}
                      className="text-slate-300 opacity-0 transition group-hover:opacity-100 hover:text-rose-500 dark:text-slate-600 dark:hover:text-rose-400"
                      title="Remove grade"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
