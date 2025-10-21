import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      header : {
        title: "VNAU",
        main: "News",
        students: "For Students",
        applicants: "For Applicants",
        schedule: "Schedule"
      },
      title: {
        students: "Information for Students",
        abiturients: "Information for Applicants",
        schedule: "Schedule"
      },
      footer: {
        info: "© 2025 VNAU. Information may be updated",
        created_pt1: "Created with",
        created_pt2: "for students. ",
        devs_link: "Development Team"
      },
      schedule: {
        day_0: "Sun",
        day_1: "Mon",
        day_2: "Tue",
        day_3: "Wed",
        day_4: "Thu",
        day_5: "Fri",
        day_6: "Sat",
      }
    }
  },
  uk: {
    translation: {
      header: {
        title: "ВНАУ",
        main: "Новини",
        students: "Студентам",
        applicants: "Абітурієнтам",
        schedule: "Розклад"
      },
      title: {
        students: "Інформація для студентів",
        abiturients: "Інформація для абітурієнтів",
        schedule: "Розклад занять"
      },
      footer: {
        info: "© 2025 ВНАУ. Інформація може оновлюватися",
        created_pt1: "Створено з ",
        created_pt2: " для студентів. ",
        devs_link: "Команда розробників"
      },
      schedule: {
        day_0: "Нд",
        day_1: "Пн",
        day_2: "Вт",
        day_3: "Ср",
        day_4: "Чт",
        day_5: "Пт",
        day_6: "Сб",
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