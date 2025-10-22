class SceneTemplates {
  constructor() {
    this.templates = new Map();
    this.loadTemplates();
  }

  loadTemplates() {
    this.templates.set("therapist-accept", {
      title: "Кабинет терапевта",
      steps: {
        start: {
          background: "therapist-office.png",
          text: "Добрый день, перед началом приема Вам необходимо заполнить документы",
          choices: [
            {
              text: "Заполнить Анкету о состоянии здоровья",
              action: "show_health_form",
              target: "patient",
            },
            {
              text: "Заполнить согласие на обработку персональных данных",
              action: "show_consent_form",
              target: "patient",
            },
          ],
        },
      },
    });
  }
}

module.exports = SceneTemplates;
