import React from "react";
import { useLanguage } from "../context/LanguageContext";

import "../assets/styles/languageSelector.css";

function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-selector">

      <div className="language-note">
        <p>Select your comfortable language</p>
        <p>మీకు అనుకూలమైన భాషను ఎంచుకోండి</p>
        <p>अपनी सुविधानुसार भाषा चुनें</p>
      </div>

      <div className="language-options">

        <button
          type="button"
          className={
            language === "English"
              ? "language-option active"
              : "language-option"
          }
          onClick={() => setLanguage("English")}
        >
          English
        </button>

        <button
          type="button"
          className={
            language === "Telugu"
              ? "language-option active"
              : "language-option"
          }
          onClick={() => setLanguage("Telugu")}
        >
          తెలుగు
        </button>

        <button
          type="button"
          className={
            language === "Hindi"
              ? "language-option active"
              : "language-option"
          }
          onClick={() => setLanguage("Hindi")}
        >
          हिन्दी
        </button>

      </div>

    </div>
  );
}

export default LanguageSelector;