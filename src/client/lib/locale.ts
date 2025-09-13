import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      header : {
        title: "Vinnytsia National Agrarian University",
        main: "News",
        applicants: "For Applicants",
        schedule: "Schedule"
      },
      footer: {
        info: "© 2025 VNAU. Information may be updated. For current data, please contact the admissions office.",
        created_pt1: "Created with",
        created_pt2: "for students. ",
        devs_link: "Development Team"
      }
    }
  },
  uk: {
    translation: {
      header: {
        title: "Вінницький національний аграрний університет",
        main: "Новини",
        applicants: "Абітурієнтам",
        schedule: "Розклад"
      },
      footer: {
        info: "© 2025 ВНАУ. Інформація може оновлюватися. Актуальні дані уточнюйте в приймальній комісії",
        created_pt1: "Створено з ",
        created_pt2: " для студентів. ",
        devs_link: "Команда розробників"
      }
    }
  }
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "uk",
    fallbackLng: "uk",
    interpolation: { escapeValue: false }
  });

export default i18n;