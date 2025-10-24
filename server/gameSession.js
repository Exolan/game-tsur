class GameSession {
  constructor() {
    this.players = new Map();
    this.roles = new Map([
      [
        "therapist",
        {
          isSelect: false,
          displayName: "Доктор Шарп",
          description:
            "Хирург с невероятной точностью. Диагностирует болезни по малейшим симптомам.",
          image: "./person.png",
          buttons: [],
        },
      ],
      [
        "receptionist",
        {
          isSelect: false,
          displayName: "Терапевт Квикли",
          description:
            "Опытный диагност. Быстро ставит точные диагнозы и назначает лечение.",
          image: "./person.png",
          buttons: [],
        },
      ],
      [
        "patient",
        {
          isSelect: false,
          displayName: "Пациент Маргарита Фильтрова",
          description: `Вы — Маргарита Фильтрова, 29 лет, успешный инстаграм-блогер с миллионной аудиторией.
                    Ваша жизнь — это идеальные кадры, безупречные ракурсы и тонны фильтров. Но однажды вы осознаете, что больше не можете видеть реальность без цифровой обработки:
                    •	Зеркала вас раздражают — они показывают «сырую» версию лица.
                    •	Овощи в магазине кажутся вам «недоработанными» — хочется их «подкрасить».
                    •	Солнечный свет выглядит «в плохом разрешении» — как будто мир нуждается в апгрейде.
                    Ваша цель — пройти диагностику и получить лечение, а именно льготный препарат Плацебо-Фильтр.`,
          condition: "«Не вижу себя в зеркале без фотошоп-фильтров».",
          image: "./person.png",
          buttons: [
            {
              action: "chat-bot",
              label: "Записаться на прием к терапевту через чат-бот",
              isActive: true,
            },
            {
              action: "cite-registratura",
              label: "Записаться на прием к врачу на сайте «Регистратура»",
              isActive: true,
            },
            {
              action: "visit-therapist",
              label:
                "Посетить терапевта для получения направления к узкому специалисту",
              isActive: true,
            },
            {
              action: "visit-registation",
              label:
                "Обратиться в регистратуру для записи к узкому специалисту ",
              isActive: true,
            },
            {
              action: "visit-specialist",
              label:
                "Посетить узкого специалиста для подтверждения диагноза / необходимость льготного лекарства",
              isActive: true,
            },
            {
              action: "call",
              label:
                "Обратиться в службу 666 чтобы выписали рецепт на льготное лекарство",
              isActive: true,
            },
            {
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
          displayName: "Отоларинголог Рефлекторова",
          description:
            "Гений медицинских технологий. Создает инновационные методы лечения.",
          image: "./person.png",
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
    // Проверяем существование роли
    if (!this.roles.has(role)) {
      console.error("Роль", role, "не существует");
      return null;
    }

    // Ищем игрока с нужной ролью
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
      io.emit("gameCards", Array.from(this.roles.entries()));
      allPlayers.forEach((player) => (player.isReady = false));
    }
  }

  checkAllRolesSelected(io) {
    const playersCount = this.players.size;
    const allRoles = Array.from(this.roles.values());

    let count = 0;

    for (let i = 0; i < allRoles.length; i++) {
      if (allRoles[i].isSelect) {
        count++;
      }

      if (count === playersCount) {
        this.gamePhase = "game";
        this.players.forEach((playerData, playerSocketId) => {
          io.to(playerSocketId).emit("startGame", {
            role: playerData.role,
            roleData: this.roles.get(playerData.role),
          });
        });
      }
    }
  }
}

module.exports = GameSession;
