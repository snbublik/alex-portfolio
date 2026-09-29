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


// Интерактивные плашки направлений: повторное нажатие сворачивает описание.
const directionTags = document.querySelectorAll('.direction-tag');
const directionDetail = document.querySelector('#direction-detail');
if (directionTags.length && directionDetail) {
  const detailTitle = directionDetail.querySelector('h3');
  const detailText = directionDetail.querySelector('p');

  directionTags.forEach((tag) => {
    tag.addEventListener('click', () => {
      const wasOpen = tag.getAttribute('aria-expanded') === 'true';
      directionTags.forEach((item) => item.setAttribute('aria-expanded', 'false'));

      if (wasOpen) {
        directionDetail.hidden = true;
        return;
      }

      tag.setAttribute('aria-expanded', 'true');
      detailTitle.textContent = tag.dataset.title;
      detailText.textContent = tag.dataset.description;
      directionDetail.hidden = false;
    });
  });
}
