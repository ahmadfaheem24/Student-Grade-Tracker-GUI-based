export interface Grade {
  id: string;
  subject: string;
  score: number;
}

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  grades: Grade[];
}

export function average(grades: Grade[]): number {
  if (grades.length === 0) return 0;
  const sum = grades.reduce((acc, g) => acc + g.score, 0);
  return sum / grades.length;
}

export function highest(grades: Grade[]): Grade | null {
  if (grades.length === 0) return null;
  return grades.reduce((max, g) => (g.score > max.score ? g : max), grades[0]);
}

export function lowest(grades: Grade[]): Grade | null {
  if (grades.length === 0) return null;
  return grades.reduce((min, g) => (g.score < min.score ? g : min), grades[0]);
}

export function letterGrade(avg: number): string {
  if (avg >= 90) return "A";
  if (avg >= 80) return "B";
  if (avg >= 70) return "C";
  if (avg >= 60) return "D";
  return "F";
}

export function letterColor(letter: string): string {
  switch (letter) {
    case "A":
      return "text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/30";
    case "B":
      return "text-sky-600 bg-sky-50 border-sky-200 dark:text-sky-300 dark:bg-sky-500/10 dark:border-sky-500/30";
    case "C":
      return "text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-500/10 dark:border-amber-500/30";
    case "D":
      return "text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-300 dark:bg-orange-500/10 dark:border-orange-500/30";
    default:
      return "text-rose-600 bg-rose-50 border-rose-200 dark:text-rose-300 dark:bg-rose-500/10 dark:border-rose-500/30";
  }
}
