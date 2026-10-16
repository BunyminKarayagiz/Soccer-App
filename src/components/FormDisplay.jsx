// Son maç formu (W = galibiyet, D = beraberlik, L = mağlubiyet) renkli küçük rozetler olarak gösterilir.
// Renkler tema değişkenlerinden gelir (win / draw / lose), bkz. index.css.
const STYLES = {
  W: "bg-win/20 text-win",
  D: "bg-draw/20 text-draw",
  L: "bg-lose/20 text-lose",
};

function FormDisplay({ form }) {
  return (
    <div className="flex justify-center gap-1">
      {(form || "").split("").map((char, index) => (
        <span
          key={index}
          className={`grid size-5 place-items-center rounded-md text-[10px] font-bold sm:size-6 sm:text-xs ${
            STYLES[char] || "bg-surface-3 text-muted"
          }`}
        >
          {char}
        </span>
      ))}
    </div>
  );
}

export default FormDisplay;
