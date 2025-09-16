import { useState } from 'react';
import './LangSwitch.css';
import { useTranslation } from 'react-i18next';


function LangSwitch() {
  const { i18n } = useTranslation();
  const activeIndex = i18n.language === 'uk' ? 0 : 1;

  return (
    <nav className="lang-switch">
      <ul>
        <li><a href='#' className={ i18n.language == 'uk' ? 'active' : '' } onClick={() => i18n.changeLanguage('uk')} >UA</a></li>
        <li><a href='#' className={ i18n.language == 'en' ? 'active' : '' }  onClick={() => i18n.changeLanguage('en')} >EN</a></li>
      </ul>
      <span className="glider" style={{
        transform: `translateX(${activeIndex * 100}%)`
      }} />
    </nav>
  );
}

export default LangSwitch;