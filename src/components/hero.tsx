export function Hero() {
  return (
    <div className="text-center space-y-4 md:space-y-6 max-w-3xl mx-auto pt-16">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/60 animate-fade-in-up" style={{ animationFillMode: 'backwards' }}>
        Amplify Your Brand with Mix Aura
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
        We blend creative strategy with AI-powered insights to launch startups into the stratosphere. Discover your brand's true potential.
      </p>
    </div>
  );
}
