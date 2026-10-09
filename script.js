const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Открыть меню" : "Закрыть меню");
    mainNav.classList.toggle("is-open", !isOpen);
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Открыть меню");
    });
  });
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

// В аккордеоне открыт только один пункт за раз.
const aboutAccordionItems = document.querySelectorAll('.about-accordion-item');
aboutAccordionItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    aboutAccordionItems.forEach((otherItem) => {
      if (otherItem !== item) otherItem.open = false;
    });
  });
});
/* =========================================================
   SOFT SKILLS — CAROUSEL
========================================================= */

const softCarousel = document.querySelector(".soft-skills-section");

if (softCarousel) {

  const softCards = Array.from(
    softCarousel.querySelectorAll(".soft-skill-card")
  );

  const softPrev = softCarousel.querySelector(
    ".soft-carousel-arrow-prev"
  );

  const softNext = softCarousel.querySelector(
    ".soft-carousel-arrow-next"
  );

  const softDots = Array.from(
    softCarousel.querySelectorAll("[data-soft-dot]")
  );

  const softCounter = softCarousel.querySelector(
    ".soft-carousel-counter b"
  );

  let softActiveIndex = 0;
  let softAutoplay = null;

  const softTotal = softCards.length;


  /* -----------------------------------------
     Расстановка карточек
  ----------------------------------------- */

  function updateSoftCarousel() {

    softCards.forEach((card, index) => {

      let difference = index - softActiveIndex;

      /*
       * Делаем карусель цикличной.
       * Например:
       * активна 01 → слева 06 → справа 02
       */

      if (difference > softTotal / 2) {
        difference -= softTotal;
      }

      if (difference < -softTotal / 2) {
        difference += softTotal;
      }


      if (difference === 0) {

        card.dataset.softPosition = "0";
        card.classList.add("is-active");

        const status = card.querySelector(".soft-skill-status");

        if (status) {
          status.textContent = "×";
        }

      } else if (difference === -1) {

        card.dataset.softPosition = "-1";
        card.classList.remove("is-active");

        const status = card.querySelector(".soft-skill-status");

        if (status) {
          status.textContent = "+";
        }

      } else if (difference === 1) {

        card.dataset.softPosition = "1";
        card.classList.remove("is-active");

        const status = card.querySelector(".soft-skill-status");

        if (status) {
          status.textContent = "+";
        }

      } else {

        card.dataset.softPosition = "hidden";
        card.classList.remove("is-active");

        const status = card.querySelector(".soft-skill-status");

        if (status) {
          status.textContent = "+";
        }
      }

    });


    /* точки */

    softDots.forEach((dot, index) => {

      dot.classList.toggle(
        "is-active",
        index === softActiveIndex
      );

    });


    /* счётчик */

    if (softCounter) {

      softCounter.textContent = String(
        softActiveIndex + 1
      ).padStart(2, "0");

    }

  }


  /* -----------------------------------------
     Следующая карточка
  ----------------------------------------- */

  function nextSoftSkill() {

    softActiveIndex =
      (softActiveIndex + 1) % softTotal;

    updateSoftCarousel();

  }


  /* -----------------------------------------
     Предыдущая карточка
  ----------------------------------------- */

  function previousSoftSkill() {

    softActiveIndex =
      (softActiveIndex - 1 + softTotal) % softTotal;

    updateSoftCarousel();

  }


  /* -----------------------------------------
     Кнопки
  ----------------------------------------- */

  if (softNext) {

    softNext.addEventListener(
      "click",
      () => {

        nextSoftSkill();

        restartSoftAutoplay();

      }
    );

  }


  if (softPrev) {

    softPrev.addEventListener(
      "click",
      () => {

        previousSoftSkill();

        restartSoftAutoplay();

      }
    );

  }


  /* -----------------------------------------
     Точки
  ----------------------------------------- */

  softDots.forEach((dot) => {

    dot.addEventListener("click", () => {

      const index = Number(
        dot.dataset.softDot
      );

      if (
        Number.isNaN(index) ||
        index < 0 ||
        index >= softTotal
      ) {
        return;
      }

      softActiveIndex = index;

      updateSoftCarousel();

      restartSoftAutoplay();

    });

  });


  /* -----------------------------------------
     Клик по боковой карточке
  ----------------------------------------- */

  softCards.forEach((card, index) => {

    card.addEventListener("click", () => {

      if (
        index === softActiveIndex
      ) {
        return;
      }

      let difference =
        index - softActiveIndex;

      if (difference > softTotal / 2) {
        difference -= softTotal;
      }

      if (difference < -softTotal / 2) {
        difference += softTotal;
      }

      if (difference === -1) {
        previousSoftSkill();
      }

      if (difference === 1) {
        nextSoftSkill();
      }

      restartSoftAutoplay();

    });

  });


/* -----------------------------------------
   Автоперелистывание
----------------------------------------- */

function startSoftAutoplay() {

  if (
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {
    return;
  }

  // Не запускаем второй таймер,
  // если автоперелистывание уже работает.
  if (softAutoplay !== null) {
    return;
  }

  softAutoplay = setTimeout(() => {

    // Сначала сбрасываем текущий таймер
    softAutoplay = null;

    // Перелистываем только на одну карточку
    nextSoftSkill();

    // Запускаем отсчёт следующего перелистывания
    startSoftAutoplay();

  }, 5000);

}


function stopSoftAutoplay() {

  if (softAutoplay !== null) {

    clearTimeout(softAutoplay);

    softAutoplay = null;

  }

}


function restartSoftAutoplay() {

  stopSoftAutoplay();

  startSoftAutoplay();

}

  /* -----------------------------------------
     Пауза при наведении
  ----------------------------------------- */

  softCarousel.addEventListener(
    "mouseenter",
    stopSoftAutoplay
  );

  softCarousel.addEventListener(
    "mouseleave",
    startSoftAutoplay
  );


  /* -----------------------------------------
     Пауза при фокусе
  ----------------------------------------- */

  softCarousel.addEventListener(
    "focusin",
    stopSoftAutoplay
  );

  softCarousel.addEventListener(
    "focusout",
    () => {

      setTimeout(() => {

        if (
          !softCarousel.contains(
            document.activeElement
          )
        ) {
          startSoftAutoplay();
        }

      }, 100);

    }
  );


  /* -----------------------------------------
     Touch / swipe
  ----------------------------------------- */

  let softTouchStartX = 0;
  let softTouchEndX = 0;

  softCarousel.addEventListener(
    "touchstart",
    (event) => {

      softTouchStartX =
        event.changedTouches[0].screenX;

    },
    { passive: true }
  );


  softCarousel.addEventListener(
    "touchend",
    (event) => {

      softTouchEndX =
        event.changedTouches[0].screenX;

      const distance =
        softTouchEndX - softTouchStartX;

      if (Math.abs(distance) < 45) {
        return;
      }

      if (distance < 0) {
        nextSoftSkill();
      } else {
        previousSoftSkill();
      }

      restartSoftAutoplay();

    },
    { passive: true }
  );


  /* -----------------------------------------
     Первый запуск
  ----------------------------------------- */

  updateSoftCarousel();

  startSoftAutoplay();

}
// =========================================================
// 05. КАК Я РАБОТАЮ — WORK PROCESS
// =========================================================

const workProcess = document.querySelector(".work-process-section");

if (workProcess) {

  const processSteps = Array.from(
    workProcess.querySelectorAll(".work-process-step")
  );

  const processPanels = Array.from(
    workProcess.querySelectorAll(".work-process-panel")
  );

  const processPrev = workProcess.querySelector(
    ".work-process-arrow-prev"
  );

  const processNext = workProcess.querySelector(
    ".work-process-arrow-next"
  );

  const processCounter = workProcess.querySelector(
    ".work-process-current b"
  );

  let processActiveIndex = 0;


  /* =====================================================
     ОБНОВЛЕНИЕ СОСТОЯНИЯ
  ===================================================== */

  function updateWorkProcess() {

    /* этапы */

    processSteps.forEach((step, index) => {

      step.classList.toggle(
        "is-active",
        index === processActiveIndex
      );

      step.setAttribute(
        "aria-selected",
        index === processActiveIndex
          ? "true"
          : "false"
      );

    });


    /* карточки */

    processPanels.forEach((panel, index) => {

      panel.classList.toggle(
        "is-active",
        index === processActiveIndex
      );

    });


    /* счётчик */

    if (processCounter) {

      processCounter.textContent =
        String(processActiveIndex + 1).padStart(2, "0");

    }

  }


  /* =====================================================
     ПЕРЕХОД К ЭТАПУ
  ===================================================== */

  function goToWorkProcess(index) {

    if (index < 0) {
      index = processSteps.length - 1;
    }

    if (index >= processSteps.length) {
      index = 0;
    }

    processActiveIndex = index;

    updateWorkProcess();

  }


  /* =====================================================
     КЛИК ПО ЭТАПАМ
  ===================================================== */

  processSteps.forEach((step, index) => {

    step.addEventListener("click", () => {

      goToWorkProcess(index);

    });

  });


  /* =====================================================
     ПРЕДЫДУЩИЙ
  ===================================================== */

  if (processPrev) {

    processPrev.addEventListener("click", () => {

      goToWorkProcess(
        processActiveIndex - 1
      );

    });

  }


  /* =====================================================
     СЛЕДУЮЩИЙ
  ===================================================== */

  if (processNext) {

    processNext.addEventListener("click", () => {

      goToWorkProcess(
        processActiveIndex + 1
      );

    });

  }


  /* =====================================================
     КЛАВИАТУРА
  ===================================================== */

  processSteps.forEach((step, index) => {

    step.setAttribute("aria-selected", "false");

    step.addEventListener("keydown", (event) => {

      if (event.key === "ArrowRight") {

        event.preventDefault();

        goToWorkProcess(index + 1);

        processSteps[
          processActiveIndex
        ].focus();

      }


      if (event.key === "ArrowLeft") {

        event.preventDefault();

        goToWorkProcess(index - 1);

        processSteps[
          processActiveIndex
        ].focus();

      }

    });

  });


  /* =====================================================
     TOUCH / SWIPE
  ===================================================== */

  let processTouchStartX = 0;
  let processTouchEndX = 0;


  workProcess.addEventListener(
    "touchstart",
    (event) => {

      processTouchStartX =
        event.changedTouches[0].screenX;

    },
    { passive: true }
  );


  workProcess.addEventListener(
    "touchend",
    (event) => {

      processTouchEndX =
        event.changedTouches[0].screenX;

      const distance =
        processTouchEndX - processTouchStartX;


      /* слишком короткий свайп игнорируем */

      if (Math.abs(distance) < 45) {
        return;
      }


      if (distance < 0) {

        goToWorkProcess(
          processActiveIndex + 1
        );

      } else {

        goToWorkProcess(
          processActiveIndex - 1
        );

      }

    },
    { passive: true }
  );


  /* =====================================================
     ПЕРВИЧНАЯ ИНИЦИАЛИЗАЦИЯ
  ===================================================== */

  updateWorkProcess();

}

/* ========================================
   CASES — карусель и модальное окно
   ======================================== */

(() => {
  const section = document.querySelector("#cases");

  // Скрипт ничего не делает на страницах без блока кейсов.
  if (!section) return;

  const featured = section.querySelector(".featured-case");
  const mainButton = section.querySelector(".case-open-area");
  const caseNumber = section.querySelector(".case-number");
  const caseBrand = section.querySelector(".case-brand");
  const caseDescription = section.querySelector(".case-placeholder > p");
  const caseTags = section.querySelector(".case-tags");
  const caseFooter = section.querySelector(".case-footer > span");

  const teaserCards = [...section.querySelectorAll(".teaser-card")];
  const nextButton = section.querySelector(".case-next");
  const prevButton = section.querySelector(".cases-prev");

  const modal = document.querySelector("#case-modal");

  if (
    !featured ||
    !mainButton ||
    !caseNumber ||
    !caseBrand ||
    !caseDescription ||
    !caseTags ||
    !caseFooter ||
    teaserCards.length < 2 ||
    !nextButton ||
    !prevButton ||
    !modal
  ) {
    console.warn("Карусель кейсов: проверь HTML-разметку секции #cases.");
    return;
  }

  const modalNumber = modal.querySelector(".case-modal-number");
  const modalTitle = modal.querySelector("#case-modal-title");
  const modalDescription = modal.querySelector(".case-modal-description");
  const modalBody = modal.querySelector(".case-modal-body");
  const modalPrev = modal.querySelector(".case-modal-prev");
  const modalNext = modal.querySelector(".case-modal-next");
  const modalClose = modal.querySelector(".case-modal-close");

  /*
   * Данные проектов.
   * Для добавления работы заполни новый объект в этом массиве.
   */
  const projects = [
    {
      id: "unicar",
      number: "01",
      title: "ЮНИКАР",
      industry: "АВТОМОБИЛЬНЫЙ БИЗНЕС",
      description: "Комплексный digital-маркетинг автосалона",
      tags: [
        "Стратегия",
        "Реклама",
        "Контент",
        "Яндекс Карты",
        "Авито",
        "Лидогенерация"
      ],
      summary:
        "Комплексная работа с digital-продвижением автосалона.",
      role:
        "Разработка контент-стратегии, запуск и оптимизация VK Ads, продвижение на Яндекс Картах, подготовка материалов для Avito, создание видео, настройка чат-ботов и форм заявок, частичная работа с CRM-воронкой.",
      task:
        "Раскрыть проект автосалона через комплексный подход к продвижению.",
      approach:
        "Объединить рекламные каналы, контент и инструменты работы с заявками в единую систему продвижения.",
      results:
        "Количественные результаты добавим после подтверждения фактических данных."
    },
    {
      id: "project-02",
      number: "02",
      title: "Новый проект",
      industry: "ПРОЕКТ В ПОДГОТОВКЕ",
      description: "Описание проекта появится позже",
      tags: ["Проект", "Digital"],
      summary: "Кейс находится в подготовке.",
      role: "Информация о твоей роли будет добавлена позже.",
      task: "Описание задачи будет добавлено позже.",
      approach: "Описание подхода будет добавлено позже.",
      results: "Результаты будут добавлены после уточнения данных.",
      draft: true
    },
    {
      id: "project-03",
      number: "03",
      title: "Новый проект",
      industry: "ПРОЕКТ В ПОДГОТОВКЕ",
      description: "Описание проекта появится позже",
      tags: ["Проект", "Digital"],
      summary: "Кейс находится в подготовке.",
      role: "Информация о твоей роли будет добавлена позже.",
      task: "Описание задачи будет добавлено позже.",
      approach: "Описание подхода будет добавлено позже.",
      results: "Результаты будут добавлены после уточнения данных.",
      draft: true
    }
  ];

  let currentIndex = 0;
  let lastFocusedElement = null;

  const getProject = (index) =>
    projects[(index + projects.length) % projects.length];

  const getIndexById = (id) =>
    projects.findIndex((project) => project.id === id);

  // Безопасно создаём текстовые элементы.
  function createTag(text) {
    const tag = document.createElement("span");
    tag.textContent = text;
    return tag;
  }

  // Обновляем большую карточку и две следующие.
  function renderCarousel() {
    const current = getProject(currentIndex);

    featured.dataset.caseId = current.id;
    mainButton.dataset.openCase = current.id;
    mainButton.setAttribute(
      "aria-label",
      `Подробнее о проекте ${current.title}`
    );

    caseNumber.textContent = `${current.number} / ПРОЕКТ`;
    caseBrand.textContent = current.title;
    caseDescription.textContent = current.description;
    caseFooter.textContent = `${current.title} · ${current.industry}`;

    caseTags.replaceChildren(
      ...current.tags.map(createTag)
    );

    teaserCards.forEach((card, position) => {
      const project = getProject(currentIndex + position + 1);
      const number = card.querySelector(".teaser-number");
      const button = card.querySelector(".teaser-open");
      const title = card.querySelector(".teaser-title");
      const caption = card.querySelector(".teaser-caption");

      card.dataset.caseId = project.id;
      button.dataset.openCase = project.id;

      number.textContent = `${project.number} /`;
      title.textContent = project.title;
      caption.textContent = project.draft
        ? "Кейс появится позже"
        : project.description;

      button.setAttribute(
        "aria-label",
        `Открыть кейс: ${project.title}`
      );
    });

    // Не показываем неподтверждённые данные.
    featured.setAttribute("aria-label", `Проект ${current.title}`);
  }

  function moveCarousel(direction) {
    currentIndex =
      (currentIndex + direction + projects.length) % projects.length;

    renderCarousel();
  }

  // Заполняем содержимое модального окна выбранным проектом.
  function renderModal(project) {
    modalNumber.textContent = `${project.number} / ПРОЕКТ`;
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;

    modalBody.replaceChildren();

    const sections = project.draft
      ? [
          ["Статус", "Подробное описание этого проекта добавим позже."]
        ]
      : [
          ["Задача", project.task],
          ["Мой подход", project.approach],
          ["Что я делала", project.role],
          ["Результаты", project.results]
        ];

    sections.forEach(([heading, content]) => {
      const block = document.createElement("section");
      const title = document.createElement("h4");
      const paragraph = document.createElement("p");

      title.textContent = heading;
      paragraph.textContent = content;

      block.append(title, paragraph);
      modalBody.append(block);
    });

    modalPrev.disabled = projects.length < 2;
    modalNext.disabled = projects.length < 2;
  }

  function openModal(id) {
    const index = getIndexById(id);

    if (index < 0) return;

    currentIndex = index;
    renderCarousel();
    renderModal(getProject(currentIndex));

    lastFocusedElement = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";

    modalClose.focus();
  }

  function closeModal() {
    if (modal.hidden) return;

    modal.hidden = true;
    document.body.style.overflow = "";

    if (lastFocusedElement?.isConnected) {
      lastFocusedElement.focus();
    }
  }

  function navigateModal(direction) {
    moveCarousel(direction);
    renderModal(getProject(currentIndex));
  }

  // Стрелки переключают выбранный проект.
  nextButton.addEventListener("click", () => moveCarousel(1));
  prevButton.addEventListener("click", () => moveCarousel(-1));

  // Делегирование событий позволяет обновлять карточки без
  // повторного назначения обработчиков после каждого переключения.
  section.addEventListener("click", (event) => {
    const openButton = event.target.closest("[data-open-case]");

    if (!openButton || !section.contains(openButton)) return;

    openModal(openButton.dataset.openCase);
  });

  // Закрытие по крестику и фону.
  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-case]")) {
      closeModal();
    }
  });

  modalClose.addEventListener("click", closeModal);

  // Навигация между проектами прямо в окне.
  modalPrev.addEventListener("click", () => navigateModal(-1));
  modalNext.addEventListener("click", () => navigateModal(1));

  // Escape закрывает окно.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }

    // Стрелки клавиатуры переключают кейсы,
    // пока модальное окно открыто.
    if (!modal.hidden && event.key === "ArrowRight") {
      navigateModal(1);
    }

    if (!modal.hidden && event.key === "ArrowLeft") {
      navigateModal(-1);
    }
  });

  // Начальное состояние.
  renderCarousel();
})();
