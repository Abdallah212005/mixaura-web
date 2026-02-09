export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="container mx-auto p-4 md:p-6 w-full animate-fade-in" style={{ animationDuration: '1s' }}>
      <div className="text-center text-sm text-muted-foreground">
        © {currentYear} Mix Aura Digital. All Rights Reserved.
      </div>
    </footer>
  );
}
