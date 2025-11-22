import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center">
            <span className="text-accent-foreground font-black text-sm">D</span>
          </div>
          <span className="font-bold text-lg text-foreground">
            Doxing Dot Life
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}
