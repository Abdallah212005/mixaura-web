import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 p-4 md:p-6 z-10 backdrop-blur-sm bg-background/30 animate-fade-in" style={{ animationDuration: '1s' }}>
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        <a href="https://wa.me/201126767443" target="_blank" rel="noopener noreferrer" aria-label="Contact us on WhatsApp">
          <Button variant="outline" className="btn-animated border-accent text-accent hover:bg-accent hover:text-accent-foreground">
            <WhatsAppIcon />
            Contact Us
          </Button>
        </a>
      </div>
    </header>
  );
}
