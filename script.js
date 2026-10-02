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
