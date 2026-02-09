"use client";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-background">
      <div className="relative h-full w-full">
        <div
          className="absolute bottom-[-20%] left-[20%] h-[20rem] w-[20rem] bg-primary/10 rounded-full blur-3xl animate-blob"
          style={{ animationDuration: '10s' }}
        />
        <div
          className="absolute top-[-10%] right-[20%] h-[20rem] w-[20rem] bg-accent/10 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: '2s', animationDuration: '12s' }}
        />
        <div
          className="absolute bottom-[5%] right-[10%] h-[15rem] w-[15rem] bg-primary/5 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: '4s', animationDuration: '8s' }}
        />
      </div>
    </div>
  );
}
