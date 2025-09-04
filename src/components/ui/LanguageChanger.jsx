import { i18n } from "next-i18next";

function LanguageChanger() {
  return (
    <>
        <button onClick={() => i18n.changeLanguage('hu')}>
          Switch to Hungarian
        </button>
    </>
  );
}

export default LanguageChanger;