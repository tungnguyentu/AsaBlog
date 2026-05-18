"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "vi";

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

const LangContext = createContext<LangContextValue>({
  lang: "en",
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  function handleSetLang(next: Lang) {
    setLang(next);
    // sync <html lang="..."> so CSS :lang(vi) selectors fire
    document.documentElement.lang = next;
  }

  return (
    <LangContext.Provider value={{ lang, setLang: handleSetLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
