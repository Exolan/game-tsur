import { Role } from "../types";

const rolesConfig: { [key: string]: Omit<Role, "isSelect"> } = {
  therapist: {
    displayName: "Доктор Шарп\nтерапевт",
    number: "+7 (111) 111-11-11",
    password: "Doctor",
    profile: "",
    task: "",
    description:
      "Хирург с невероятной точностью. Диагностирует болезни по малейшим симптомам.",
    image: "/images/therapist.png",
    buttons: [],
    maxInstances: 1,
  },

  receptionist: {
    displayName: "Сергей Талончиков\nсотрудник",
    number: "+7 (222) 222-22-22",
    password: "Talon",
    profile:
      "Сергей Талончиков, 42 года\nОпытный сотрудник регистратуры городской поликлиники.",
    description: "Ваш рабочий день — это гибрид старых и новых технологий.",
    task: "Ваша цель — обеспечить бесперебойную работу регистратуры в условиях многозадачности. Вы должны выполнить плановую работу, параллельно реагируя на срочные входящие события: телефонные звонки и живое общение с посетителями.",
    image: "/images/receptionist.png",
    buttons: [],
    maxInstances: 1,
  },

  patient: {
    displayName: "Маргарита Фильтрова\nпациент",
    profile:
      "Маргарита Фильтрова, 29 лет\nУспешный инстаграм-блогер с миллионной аудиторией.",
    task: "Ваша цель — пройти диагностику и получить лечение, а именно льготный препарат Плацебо-Фильтр.",
    description:
      "Ваша жизнь — это идеальные кадры, безупречные ракурсы и тонны фильтров. Но однажды вы осознаете, что больше не можете видеть реальность без цифровой обработки.",
    number: "+7 (333) 333-33-33",
    password: "Margo",
    image: "/images/patient.png",
    buttons: [
      {
        id: 1,
        action: "chat-bot",
        label: "Записаться на прием к терапевту через чат-бот",
        isActive: true,
      },
      {
        id: 2,
        action: "cite-registratura",
        label: "Записаться на прием к врачу на сайте «Регистратура»",
        isActive: true,
      },
      {
        id: 3,
        action: "visit-therapist",
        label:
          "Посетить терапевта для получения направления к узкому специалисту",
        isActive: true,
      },
      {
        id: 4,
        action: "visit-registation",
        label: "Обратиться в регистратуру для записи к узкому специалисту",
        isActive: true,
      },
      {
        id: 5,
        action: "visit-specialist",
        label:
          "Посетить узкого специалиста для подтверждения диагноза / необходимость льготного лекарства",
        isActive: true,
      },
      {
        id: 6,
        action: "call",
        label:
          "Обратиться в службу 666 чтобы выписали рецепт на льготное лекарство",
        isActive: true,
      },
      {
        id: 7,
        action: "visit-pharmacy",
        label: "Обратиться в аптеку для получения льготного лекарства",
        isActive: true,
      },
    ],
    maxInstances: 1,
  },

  specialist: {
    displayName: "Отоларинголог Рефлекторова\nспециалист",
    number: "+7 (444) 444-44-44",
    password: "Reflect",
    profile: "",
    task: "",
    description:
      "Гений медицинских технологий. Создает инновационные методы лечения.",
    image: "/images/specialist.png",
    buttons: [],
    maxInstances: 1,
  },
};

export default rolesConfig;
