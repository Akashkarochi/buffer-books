import { Anchor, Ship } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-foreground/10 rounded-xl backdrop-blur-sm">
              <Ship className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold tracking-tight">
                Buffer Shipping Agency
              </h1>
              <p className="text-primary-foreground/80 text-sm">
                Financial Transaction Manager
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-primary-foreground/60">
            <Anchor className="h-5 w-5" />
            <span className="text-sm font-medium">Secure • Simple • Reliable</span>
          </div>
        </div>
      </div>
    </header>
  );
};
