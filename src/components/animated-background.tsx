"use client";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background animate-background-pan" 
           style={{ backgroundSize: '200% 200%' }}/>
    </div>
  );
}
