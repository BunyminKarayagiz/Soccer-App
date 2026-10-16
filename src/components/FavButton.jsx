import { IoStar, IoStarOutline } from "react-icons/io5";

// Favori (yıldız) düğmesi. Eskiden tıklanabilir <svg> idi; şimdi gerçek bir <button>:
// klavye ile kullanılabilir ve ekran okuyucular için etiketi var.
function FavButton({
  active,
  onClick,
  label = "Favorilere ekle",
  activeLabel = "Favorilerden çıkar",
  className = "",
}) {
  const Icon = active ? IoStar : IoStarOutline;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!!active}
      aria-label={active ? activeLabel : label}
      className={`grid size-9 shrink-0 place-items-center rounded-full transition hover:scale-110 hover:bg-white/10 ${
        active ? "text-accent" : "text-muted hover:text-ink"
      } ${className}`}
    >
      <Icon className="size-5" aria-hidden="true" />
    </button>
  );
}

export default FavButton;
