export function Hero() {
  return (
    <div className="text-center space-y-4 md:space-y-6 max-w-3xl mx-auto pt-16">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/60 animate-fade-in-up" style={{ animationFillMode: 'backwards' }}>
        Mix Aura
      </h1>
      <p className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground/90 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
        Start like a pro.
      </p>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}>
        We are a marketing agency and development team dedicated to building brands that make an impact.
      </p>
    </div>
  );
}
