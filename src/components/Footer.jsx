import { Link } from "react-router-dom";

// Sade alt bilgi. Mobilde alt sekme çubuğunun arkasında kalmasın diye
// MainLayout içinde altta boşluk bırakılır.
function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted sm:flex-row sm:px-6 lg:px-8">
        <Link to="/" className="font-display text-lg font-bold">
          <span className="text-ink">Soccer</span>
          <span className="text-accent">Ball</span>
        </Link>
        <p>Futbol verileri API-Football üzerinden sağlanır.</p>
      </div>
    </footer>
  );
}

export default Footer;
