import { useEffect, useMemo, useState } from "react";
import { Student, Grade, average } from "./types";
import StudentForm from "./components/StudentForm";
import GradeForm from "./components/GradeForm";
import StudentList from "./components/StudentList";
import SummaryReport from "./components/SummaryReport";
import AnimatedBackground from "./components/AnimatedBackground";
import { useTheme } from "./hooks/useTheme";

const STORAGE_KEY = "student-grade-tracker:data";

function seedData(): Student[] {
  return [
    {
      id: crypto.randomUUID(),
      name: "Ava Thompson",
      rollNo: "101",
      grades: [
        { id: crypto.randomUUID(), subject: "Mathematics", score: 92 },
        { id: crypto.randomUUID(), subject: "Science", score: 88 },
        { id: crypto.randomUUID(), subject: "History", score: 95 },
      ],
    },
    {
      id: crypto.randomUUID(),
      name: "Liam Johnson",
      rollNo: "102",
      grades: [
        { id: crypto.randomUUID(), subject: "Mathematics", score: 74 },
        { id: crypto.randomUUID(), subject: "Science", score: 68 },
      ],
    },
    {
      id: crypto.randomUUID(),
      name: "Sofia Martinez",
      rollNo: "103",
      grades: [
        { id: crypto.randomUUID(), subject: "Mathematics", score: 55 },
        { id: crypto.randomUUID(), subject: "Science", score: 61 },
        { id: crypto.randomUUID(), subject: "History", score: 58 },
      ],
    },
  ];
}

function loadInitial(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore malformed storage
  }
  return seedData();
}

type SortKey = "name" | "average" | "count";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [students, setStudents] = useState<Student[]>(loadInitial);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  function addStudent(name: string, rollNo: string) {
    const newStudent: Student = { id: crypto.randomUUID(), name, rollNo, grades: [] };
    setStudents((prev) => [...prev, newStudent]);
  }

  function deleteStudent(id: string) {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }

  function addGrade(studentId: string, subject: string, score: number) {
    const grade: Grade = { id: crypto.randomUUID(), subject, score };
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, grades: [...s.grades, grade] } : s))
    );
  }

  function deleteGrade(studentId: string, gradeId: string) {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, grades: s.grades.filter((g) => g.id !== gradeId) } : s
      )
    );
  }

  function resetAll() {
    if (confirm("This will remove all students and grades. Continue?")) {
      setStudents([]);
    }
  }

  function loadSample() {
    setStudents(seedData());
  }

  function exportCSV() {
    const rows = [["Name", "Roll No", "Subject", "Score"]];
    students.forEach((s) => {
      if (s.grades.length === 0) {
        rows.push([s.name, s.rollNo, "", ""]);
      } else {
        s.grades.forEach((g) => rows.push([s.name, s.rollNo, g.subject, String(g.score)]));
      }
    });
    const csv = rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_grades.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const filteredSorted = useMemo(() => {
    let list = students;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (s) => s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q)
      );
    }
    const sorted = [...list].sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name);
      if (sortKey === "count") return b.grades.length - a.grades.length;
      return average(b.grades) - average(a.grades);
    });
    return sorted;
  }, [students, query, sortKey]);

  return (
    <div className="min-h-screen pb-16 transition-colors duration-500">
      <AnimatedBackground />
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50">
              🎓
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Student Grade Tracker
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage students, record grades, and view class performance reports.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={toggleTheme}
              title="Toggle light / dark mode"
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <span className="text-base leading-none">{theme === "dark" ? "🌙" : "☀️"}</span>
              {theme === "dark" ? "Dark" : "Light"}
            </button>
            <button
              onClick={loadSample}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Load Sample Data
            </button>
            <button
              onClick={exportCSV}
              disabled={students.length === 0}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              ⬇ Export CSV
            </button>
            <button
              onClick={resetAll}
              disabled={students.length === 0}
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 shadow-sm transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-950/70"
            >
              Reset All
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        <section className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70">
          <SummaryReport students={students} />
        </section>

        <section className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70 lg:grid-cols-2">
          <StudentForm onAdd={addStudent} />
          <GradeForm students={students} onAdd={addGrade} />
        </section>

        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                3
              </span>
              Students ({filteredSorted.length})
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or roll no…"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
              />
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
              >
                <option value="name">Sort: Name</option>
                <option value="average">Sort: Average (high→low)</option>
                <option value="count">Sort: # Grades</option>
              </select>
            </div>
          </div>

          <StudentList
            students={filteredSorted}
            onDeleteStudent={deleteStudent}
            onDeleteGrade={deleteGrade}
          />
        </section>
      </main>

      <footer className="mx-auto mt-8 max-w-6xl px-4 text-center text-xs text-slate-400 dark:text-slate-500 sm:px-6">
        Data is stored locally in your browser (localStorage) — nothing leaves your device.
      </footer>
    </div>
  );
}
