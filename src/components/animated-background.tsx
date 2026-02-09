"use client";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-background">
      <div className="relative h-full w-full">
        <div
          className="absolute bottom-[-10%] left-[10%] h-[35rem] w-[35rem] bg-primary/20 rounded-full blur-2xl animate-blob"
          style={{ animationDuration: '7s' }}
        />
        <div
          className="absolute top-[-20%] right-[10%] h-[35rem] w-[35rem] bg-accent/20 rounded-full blur-2xl animate-blob"
          style={{ animationDelay: '2s', animationDuration: '9s' }}
        />
        <div
          className="absolute bottom-[5%] right-[5%] h-[30rem] w-[30rem] bg-primary/15 rounded-full blur-2xl animate-blob"
          style={{ animationDelay: '4s', animationDuration: '5s' }}
        />
      </div>
    </div>
  );
}
