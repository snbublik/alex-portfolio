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
/* =========================================================
   КАК Я РАБОТАЮ — ИНТЕРАКТИВНЫЙ МАРШРУТ
========================================================= */

(() => {

  const root = document.querySelector("#work-process-route");

  if (!root) return;

  const nodesContainer = root.querySelector(".work-process-nodes");
  const traveler = root.querySelector(".work-process-traveler");
  const travelerNumber = root.querySelector("#work-process-traveler-number");

  const title = document.querySelector("#work-process-title");
  const description = document.querySelector("#work-process-description");
  const index = document.querySelector("#work-process-index");
  const tags = document.querySelector("#work-process-tags");
  const checks = document.querySelector("#work-process-checks");
  const image = document.querySelector("#work-process-image");

  const prevButton = document.querySelector(".work-process-prev");
  const nextButton = document.querySelector(".work-process-next");

  const route = root.querySelector(".work-process-route-line");

  if (!nodesContainer || !traveler || !route) return;


  const steps = [
    {
      title: "Разбираюсь в задаче",
      description:
        "Погружаюсь в бизнес-задачу, продукт, аудиторию и текущую ситуацию.",
      tags: ["Бизнес", "ЦА", "Задача"],
      checks: [
        "Определяю цель",
        "Изучаю аудиторию",
        "Фиксирую точки роста"
      ]
    },

    {
      title: "Исследую и анализирую",
      description:
        "Изучаю рынок, конкурентов, текущие каналы продвижения и поведение аудитории.",
      tags: ["Исследование", "Аналитика", "Конкуренты"],
      checks: [
        "Анализирую рынок",
        "Изучаю конкурентов",
        "Проверяю текущие данные"
      ]
    },

    {
      title: "Формирую решение",
      description:
        "Собираю стратегию и определяю, какие инструменты действительно нужны бизнесу.",
      tags: ["Стратегия", "Каналы", "План"],
      checks: [
        "Формирую гипотезы",
        "Выбираю каналы",
        "Определяю KPI"
      ]
    },

    {
      title: "Запускаю и тестирую",
      description:
        "Перевожу стратегию в конкретные действия: запускаю рекламу, контент и инструменты привлечения.",
      tags: ["Запуск", "Контент", "Реклама"],
      checks: [
        "Настраиваю инструменты",
        "Запускаю кампании",
        "Тестирую гипотезы"
      ]
    },

    {
      title: "Анализирую результат",
      description:
        "Смотрю не только на показатели каналов, но и на то, как маркетинг влияет на бизнес-задачу.",
      tags: ["Метрики", "CRM", "Результат"],
      checks: [
        "Собираю данные",
        "Сравниваю показатели",
        "Нахожу точки роста"
      ]
    },

    {
      title: "Оптимизирую и развиваю",
      description:
        "Усиливаю работающие решения, корректирую слабые места и развиваю систему дальше.",
      tags: ["Оптимизация", "Рост", "Развитие"],
      checks: [
        "Убираю неэффективное",
        "Масштабирую рабочее",
        "Формирую следующий шаг"
      ]
    }
  ];


  const positions = [
    [7, 30],
    [31, 73],
    [50, 45],
    [68, 56],
    [86, 72],
    [96, 31]
  ];


  const progress = [
    0.025,
    0.235,
    0.405,
    0.585,
    0.775,
    0.975
  ];


  let activeIndex = 0;


  /* ---------- СОЗДАЁМ ТОЧКИ ---------- */

  steps.forEach((step, stepIndex) => {

    const node = document.createElement("button");

    node.type = "button";
    node.className = "work-process-node";

    node.textContent = String(stepIndex + 1).padStart(2, "0");

    node.setAttribute(
      "aria-label",
      `${stepIndex + 1}. ${step.title}`
    );

    node.style.left = `${positions[stepIndex][0]}%`;
    node.style.top = `${positions[stepIndex][1]}%`;

    node.addEventListener("click", () => {
      setStep(stepIndex);
    });

    nodesContainer.appendChild(node);

  });


  const nodes = Array.from(
    nodesContainer.querySelectorAll(".work-process-node")
  );


  /* ---------- ДВИЖЕНИЕ ПО SVG ---------- */

  const pathLength = route.getTotalLength();


  function moveTraveler(stepIndex, animate = true) {

    const targetLength =
      pathLength * progress[stepIndex];

    const point =
      route.getPointAtLength(targetLength);

    const svg = root.querySelector(
      ".work-process-route-svg"
    );

    const svgRect = svg.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();

    const x =
      svgRect.left -
      rootRect.left +
      (point.x / 1600) * svgRect.width;

    const y =
      svgRect.top -
      rootRect.top +
      (point.y / 240) * svgRect.height;


    if (!animate) {

      traveler.style.transition = "none";

    } else {

      traveler.style.transition =
        "left .75s cubic-bezier(.65,0,.35,1), top .75s cubic-bezier(.65,0,.35,1)";

    }


    traveler.style.left = `${x}px`;
    traveler.style.top = `${y}px`;

  }


  /* ---------- ОБНОВЛЯЕМ КОНТЕНТ ---------- */

  function setStep(newIndex) {

    activeIndex = newIndex;

    const step = steps[activeIndex];

    index.textContent =
      String(activeIndex + 1).padStart(2, "0");

    travelerNumber.textContent =
      String(activeIndex + 1).padStart(2, "0");

    title.textContent = step.title;

    description.textContent = step.description;


    tags.innerHTML = step.tags
      .map(tag => `<span>${tag}</span>`)
      .join("");


    checks.innerHTML = step.checks
      .map(check => `
        <div class="work-process-check">
          ${check}
        </div>
      `)
      .join("");


    nodes.forEach((node, nodeIndex) => {

      node.classList.toggle(
        "is-active",
        nodeIndex === activeIndex
      );

    });


    moveTraveler(activeIndex);


    if (image) {

      image.alt =
        `Этап ${activeIndex + 1}: ${step.title} — digital-маркетинг`;

    }

  }


  /* ---------- КНОПКИ ---------- */

  if (prevButton) {

    prevButton.addEventListener("click", () => {

      setStep(
        (activeIndex - 1 + steps.length) %
        steps.length
      );

    });

  }


  if (nextButton) {

    nextButton.addEventListener("click", () => {

      setStep(
        (activeIndex + 1) %
        steps.length
      );

    });

  }


  /* ---------- КЛАВИАТУРА ---------- */

  root.addEventListener("keydown", (event) => {

    if (event.key === "ArrowRight") {

      setStep(
        (activeIndex + 1) %
        steps.length
      );

    }

    if (event.key === "ArrowLeft") {

      setStep(
        (activeIndex - 1 + steps.length) %
        steps.length
      );

    }

  });


  /* ---------- ПЕРВЫЙ ЗАПУСК ---------- */

  setStep(0);


  window.addEventListener("resize", () => {

    moveTraveler(activeIndex, false);

  });

})();
