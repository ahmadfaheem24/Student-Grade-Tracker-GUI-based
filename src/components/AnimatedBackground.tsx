export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* base grid pattern */}
      <div
        className="animate-grid absolute inset-0 opacity-[0.35] dark:opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(99,102,241,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* aurora blobs */}
      <div className="animate-aurora absolute -top-40 -left-32 h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-indigo-400/40 via-violet-400/30 to-fuchsia-400/30 blur-3xl dark:from-indigo-600/30 dark:via-violet-700/25 dark:to-fuchsia-700/25" />
      <div className="animate-aurora-reverse absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-sky-400/30 via-emerald-300/25 to-teal-300/25 blur-3xl dark:from-sky-600/25 dark:via-emerald-700/20 dark:to-teal-700/20" />
      <div className="animate-aurora absolute -bottom-40 left-1/4 h-[30rem] w-[30rem] rounded-full bg-gradient-to-br from-amber-300/25 via-rose-300/25 to-indigo-300/25 blur-3xl dark:from-amber-600/20 dark:via-rose-700/20 dark:to-indigo-700/20" />

      {/* soft vignette to keep content readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/60 to-white dark:from-slate-950/10 dark:via-slate-950/70 dark:to-slate-950" />
    </div>
  );
}
