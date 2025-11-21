class GameSession {
  constructor() {
    this.players = new Map();
    this.roles = new Map([
      [
        "therapist",
        {
          isSelect: false,
          displayName: "Доктор Шарп\nтерапевт",
          number: "+7 (111) 111-11-11",
          password: "Doctor",
          profile: "",
          task: "",
          description:
            "Хирург с невероятной точностью. Диагностирует болезни по малейшим симптомам.",
          image: "/images/therapist.png",
          buttons: [],
        },
      ],
      [
        "receptionist",
        {
          isSelect: false,
          displayName: "Сергей Талончиков\nсотрудник",
          number: "+7 (222) 222-22-22",
          password: "Talon",
          profile:
            "Сергей Талончиков, 42 года\nОпытный сотрудник регистратуры городской поликлиники.",
          description: `Ваш рабочий день — это гибрид старых и новых технологий.`,
          task: `Ваша цель — обеспечить бесперебойную работу регистратуры в условиях многозадачности. Вы должны выполнить плановую работу, параллельно реагируя на срочные входящие события: телефонные звонки и живое общение с посетителями.`,
          image: "/images/receptionist.png",
          buttons: [],
        },
      ],
      [
        "patient",
        {
          isSelect: false,
          displayName: "Маргарита Фильтрова\nпациент",
          profile:
            "Маргарита Фильтрова, 29 лет\nУспешный инстаграм-блогер с миллионной аудиторией.",
          task: "Ваша цель — пройти диагностику и получить лечение, а именно льготный препарат Плацебо-Фильтр.",
          description:
            "Ваша жизнь — это идеальные кадры, безупречные ракурсы и тонны фильтров. Но однажды вы осознаете, что больше не можете видеть реальность без цифровой обработки.",
          // condition: "«Не вижу себя в зеркале без фотошоп-фильтров».",
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
              label:
                "Обратиться в регистратуру для записи к узкому специалисту ",
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
        },
      ],
      [
        "specialist",
        {
          isSelect: false,
          displayName: "Отоларинголог Рефлекторова\nспециалист",
          number: "+7 (444) 444-44-44",
          password: "Reflect",
          profile: "",
          task: "",
          description:
            "Гений медицинских технологий. Создает инновационные методы лечения.",
          image: "/images/specialist.png",
          buttons: [],
        },
      ],
    ]);
    this.gamePhase = "lobby";
  }

  getData() {
    return {
      players: this.players,
      roles: this.roles,
      gamePhase: this.gamePhase,
    };
  }

  getPlayersRoles() {
    const rolesMap = {};

    this.players.forEach((playerID, playerData) => {
      if (playerData.role) {
        rolesMap[playerID] = playerData.role;
      }
    });
  }

  getPlayerByRole(role) {
    if (!this.roles.has(role)) {
      console.error("Роль", role, "не существует");
      return null;
    }

    for (const [playerID, playerData] of this.players.entries()) {
      if (playerData.role === role) {
        console.log("Найден", role, "с ID:", playerID);
        return playerID;
      }
    }

    console.log("Игрок с ролью", role, "не найден");
    return null;
  }

  uploadData(data) {
    const gameSession = new GameSession();
    gameSession.players = new Map(data.players);
    gameSession.roles = new Map(data.roles);
    gameSession.gamePhase = data.gamePhase;
    return gameSession;
  }

  checkAllPlayersReady(io) {
    const allPlayers = Array.from(this.players.values());
    const allReady =
      allPlayers.length >= 4 && allPlayers.every((player) => player.isReady);

    if (allReady) {
      this.gamePhase = "gameCards";
      const rolesArray = Array.from(this.roles.entries()).map(
        ([roleKey, roleGameData]) => ({
          roleKey,
          roleGameData,
        })
      );

      console.log("Sending roles array:", rolesArray);

      io.emit("gameCards", rolesArray);
      allPlayers.forEach((player) => (player.isReady = false));
    }
  }

  checkAllRolesSelected(io) {
    const playersCount = this.players.size;
    const allRoles = Array.from(this.roles.values());

    let count = 0;

    for (const element of allRoles) {
      if (element.isSelect) {
        count++;
      }

      if (count === playersCount) {
        this.gamePhase = "game";
        this.players.forEach((playerData, playerSocketId) => {
          io.to(playerSocketId).emit("startGame", {
            roleKey: playerData.role,
            roleGameData: this.roles.get(playerData.role),
          });
        });
      }
    }
  }

  resetAllRoles() {
    this.roles.forEach((roleData, roleKey) => {
      roleData.isSelect = false;
    });
  }
}

module.exports = GameSession;
