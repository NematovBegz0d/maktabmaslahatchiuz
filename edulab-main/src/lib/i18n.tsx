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

    // Clubs
    clubs_title: "Maktab Klublari",
    clubs_subtitle_staff: "Maktab klublarini boshqaring va o'quvchilarni ro'yxatga oling.",
    clubs_subtitle_student: "Qiziqishlaringizga mos klubga qo'shiling va iqtidoringizni rivojlantiring.",
    clubs_total: "Jami klublar",
    clubs_total_members: "Jami a'zolar",
    clubs_top: "Eng faol klub",
    clubs_my_count: "A'zo bo'lgan klublarim",
    clubs_manage: "Boshqarish",
    clubs_view: "Ko'rish",
    clubs_details: "Batafsil",
    clubs_member: "A'zo",
    clubs_members_list: "A'zolar ro'yxati",
    clubs_add_member: "Qo'shish",
    clubs_not_found: "Klub topilmadi.",
    clubs_back: "Klublar",
    clubs_member_count: "a'zo",
    clubs_by_class: "Sinf bo'yicha",
    clubs_empty_members: "Hali a'zo yo'q",
    clubs_search_empty: "Topilmadi",
    clubs_search_name: "Ism bo'yicha...",
    clubs_my_title: "Mening Klublarim",
    clubs_my_subtitle: "A'zo bo'lgan klublaringiz va faoliyat yo'nalishlaringiz.",
    clubs_all: "Barcha klublar",
    clubs_my_empty_title: "Hali hech bir klubga a'zo emassiz",
    clubs_my_empty_desc: "Maktab maslahatchiingiz sizni klubga qo'shadi. Quyidagi klublar bilan tanishib chiqing.",
    clubs_view_all: "Klublarni ko'rish",
    clubs_member_added: "A'zo muvaffaqiyatli qo'shildi!",
    clubs_member_removed: "A'zo ro'yxatdan chiqarildi.",
    clubs_remove_title: "A'zoni ro'yxatdan chiqarish",
    clubs_other: "Boshqa klublar",
    clubs_not_member: "Hali hech bir klubga a'zo emassiz.",

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

    // Clubs
    clubs_title: "Школьные клубы",
    clubs_subtitle_staff: "Управляйте школьными клубами и записывайте учеников.",
    clubs_subtitle_student: "Присоединяйтесь к клубу по интересам и развивайте свои таланты.",
    clubs_total: "Всего клубов",
    clubs_total_members: "Всего участников",
    clubs_top: "Самый активный клуб",
    clubs_my_count: "Мои клубы",
    clubs_manage: "Управление",
    clubs_view: "Просмотр",
    clubs_details: "Подробнее",
    clubs_member: "Участник",
    clubs_members_list: "Список участников",
    clubs_add_member: "Добавить",
    clubs_not_found: "Клуб не найден.",
    clubs_back: "Клубы",
    clubs_member_count: "участников",
    clubs_by_class: "По классам",
    clubs_empty_members: "Пока нет участников",
    clubs_search_empty: "Не найдено",
    clubs_search_name: "По имени...",
    clubs_my_title: "Мои клубы",
    clubs_my_subtitle: "Клубы, в которых вы состоите, и направления деятельности.",
    clubs_all: "Все клубы",
    clubs_my_empty_title: "Вы пока не состоите ни в одном клубе",
    clubs_my_empty_desc: "Школьный консультант добавит вас в клуб. Ознакомьтесь с клубами ниже.",
    clubs_view_all: "Посмотреть клубы",
    clubs_member_added: "Участник успешно добавлен!",
    clubs_member_removed: "Участник удалён из списка.",
    clubs_remove_title: "Удалить участника",
    clubs_other: "Другие клубы",
    clubs_not_member: "Пока не состоит ни в одном клубе.",

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
