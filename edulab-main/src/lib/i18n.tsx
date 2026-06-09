import { createContext, useContext, useState, type ReactNode } from "react";

export type Locale = "uz" | "ru";

const translations = {
  uz: {
    // Nav
    nav_dashboard: "Boshqaruv",
    nav_tests: "Testlar",
    nav_profile: "Profil",
    nav_students: "O'quvchilar",
    nav_analytics: "Tahlil",
    nav_children: "Farzandlarim",
    nav_clubs: "Klublar",
    nav_signout: "Chiqish",

    // Auth
    auth_login: "Kirish",
    auth_register: "Ro'yxatdan o'tish",
    auth_email: "Email",
    auth_password: "Parol",
    auth_full_name: "To'liq ism",
    auth_role: "Rol",

    // Dashboard
    dashboard_title: "Boshqaruv paneli",
    dashboard_welcome: "Xush kelibsiz",

    // Tests
    tests_title: "Testlar",
    tests_empty: "Testlar topilmadi",
    tests_start: "Testni boshlash",
    tests_continue: "Davom ettirish",
    tests_completed: "Tugallangan",

    // Students
    students_title: "O'quvchilar",
    students_search: "Ism bo'yicha qidirish...",
    students_empty: "O'quvchilar topilmadi",
    students_total: "Jami",
    students_class: "sinf",

    // Analytics
    analytics_title: "Tahlil va statistika",
    analytics_subtitle: "Maktab bo'yicha umumiy ko'rsatkichlar",
    analytics_students: "O'quvchilar",
    analytics_active: "Faol (test yechgan)",
    analytics_completed_tests: "Yechilgan testlar",
    analytics_avg_completeness: "O'rtacha to'liqlik",

    // Profile
    profile_title: "Mening profilim",
    profile_completeness: "Profil to'liqligi",
    profile_careers: "Tavsiya etilgan kasblar",
    profile_ai_summary: "AI tahlili",

    // Parent
    parent_title: "Farzandlarim",
    parent_empty: "Farzand profili topilmadi",
    parent_recent_results: "So'nggi natijalar",
    parent_no_results: "Hali test yechilmagan",

    // General
    loading: "Yuklanmoqda...",
    error: "Xatolik yuz berdi",
    try_again: "Qayta urinish",
    go_home: "Bosh sahifaga",
    save: "Saqlash",
    cancel: "Bekor qilish",
    close: "Yopish",
    back: "Orqaga",
    next: "Keyingi",
    previous: "Oldingi",
    page: "Sahifa",
  },
  ru: {
    // Nav
    nav_dashboard: "Панель",
    nav_tests: "Тесты",
    nav_profile: "Профиль",
    nav_students: "Ученики",
    nav_analytics: "Аналитика",
    nav_children: "Мои дети",
    nav_clubs: "Клубы",
    nav_signout: "Выйти",

    // Auth
    auth_login: "Войти",
    auth_register: "Регистрация",
    auth_email: "Email",
    auth_password: "Пароль",
    auth_full_name: "Полное имя",
    auth_role: "Роль",

    // Dashboard
    dashboard_title: "Панель управления",
    dashboard_welcome: "Добро пожаловать",

    // Tests
    tests_title: "Тесты",
    tests_empty: "Тесты не найдены",
    tests_start: "Начать тест",
    tests_continue: "Продолжить",
    tests_completed: "Завершено",

    // Students
    students_title: "Ученики",
    students_search: "Поиск по имени...",
    students_empty: "Ученики не найдены",
    students_total: "Всего",
    students_class: "класс",

    // Analytics
    analytics_title: "Аналитика и статистика",
    analytics_subtitle: "Общие показатели по школе",
    analytics_students: "Ученики",
    analytics_active: "Активные (прошли тест)",
    analytics_completed_tests: "Пройденные тесты",
    analytics_avg_completeness: "Средняя полнота",

    // Profile
    profile_title: "Мой профиль",
    profile_completeness: "Полнота профиля",
    profile_careers: "Рекомендуемые профессии",
    profile_ai_summary: "Анализ ИИ",

    // Parent
    parent_title: "Мои дети",
    parent_empty: "Профиль ребёнка не найден",
    parent_recent_results: "Последние результаты",
    parent_no_results: "Тесты ещё не пройдены",

    // General
    loading: "Загрузка...",
    error: "Произошла ошибка",
    try_again: "Попробовать снова",
    go_home: "На главную",
    save: "Сохранить",
    cancel: "Отмена",
    close: "Закрыть",
    back: "Назад",
    next: "Следующий",
    previous: "Предыдущий",
    page: "Страница",
  },
} satisfies Record<Locale, Record<string, string>>;

export type TranslationKey = keyof typeof translations.uz;

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "uz",
  setLocale: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return "uz";
    return (localStorage.getItem("edulens-locale") as Locale) ?? "uz";
  });

  function setLocale(l: Locale) {
    setLocaleState(l);
    localStorage.setItem("edulens-locale", l);
  }

  function t(key: TranslationKey): string {
    return translations[locale][key] ?? translations.uz[key] ?? key;
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
