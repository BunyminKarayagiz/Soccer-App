// Seçilebilir temalar. "id" değeri index.css içindeki [data-theme="..."] ile aynı olmalı.
// "swatch" sadece tema seçicideki renkli yuvarlak için kullanılır.
export const THEMES = [
  { id: "gece", name: "Mor Gece", swatch: ["#9d4edd", "#e1ff00"] },
  { id: "okyanus", name: "Kuzey Işığı", swatch: ["#56b9a8", "#f1ca83"] },
  { id: "tribun", name: "Zümrüt Saha", swatch: ["#78b875", "#d7e89a"] },
];

export const DEFAULT_THEME = "gece";
const STORAGE_KEY = "soccerball-theme";

export function getSavedTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return THEMES.some((t) => t.id === saved) ? saved : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function applyTheme(id) {
  document.documentElement.setAttribute("data-theme", id);
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* tarayıcı depolamayı engellediyse sessizce devam et */
  }
}
