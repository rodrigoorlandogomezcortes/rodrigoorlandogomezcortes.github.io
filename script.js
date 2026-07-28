"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-navigation");
  const navigationLinks = document.querySelectorAll(
    ".main-navigation a"
  );

  const filterButtons = document.querySelectorAll(
    ".filter-button"
  );

  const projectCards = document.querySelectorAll(
    ".project-card"
  );

  const serviceCards = document.querySelectorAll(
    "[data-service-filter]"
  );

  const visibleProjectsCounter = document.querySelector(
    "#visible-projects"
  );

  const emptyState = document.querySelector(
    "#empty-state"
  );

  const projectButtons = document.querySelectorAll(
    "[data-project-title]"
  );

  const modal = document.querySelector(
    "#project-modal"
  );

  const modalTitle = document.querySelector(
    "#modal-title"
  );

  const closeModalButtons = document.querySelectorAll(
    "[data-close-modal]"
  );

  const currentYear = document.querySelector(
    "#current-year"
  );

  let lastFocusedElement = null;

  /**
   * Menú para dispositivos móviles
   */

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });
  }

  navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (!navigation || !menuToggle) {
        return;
      }

      navigation.classList.remove("open");

      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );
    });
  });

  /**
   * Filtro de proyectos
   */

  function filterProjects(category) {
    let visibleProjects = 0;

    projectCards.forEach((card) => {
      const projectCategory =
        card.dataset.category;

      const shouldShow =
        category === "todos" ||
        projectCategory === category;

      card.classList.toggle(
        "hidden",
        !shouldShow
      );

      if (shouldShow) {
        visibleProjects += 1;
      }
    });

    if (visibleProjectsCounter) {
      visibleProjectsCounter.textContent =
        String(visibleProjects);
    }

    if (emptyState) {
      emptyState.hidden =
        visibleProjects !== 0;
    }
  }

  function activateFilter(category) {
    filterButtons.forEach((button) => {
      const isSelected =
        button.dataset.filter === category;

      button.classList.toggle(
        "active",
        isSelected
      );

      button.setAttribute(
        "aria-pressed",
        String(isSelected)
      );
    });

    filterProjects(category);
  }

  filterButtons.forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      button.classList.contains("active")
        ? "true"
        : "false"
    );

    button.addEventListener("click", () => {
      const selectedCategory =
        button.dataset.filter || "todos";

      activateFilter(selectedCategory);
    });
  });

  /**
   * Tarjetas de servicios
   */

  serviceCards.forEach((serviceCard) => {
    serviceCard.addEventListener("click", () => {
      const selectedCategory =
        serviceCard.dataset.serviceFilter;

      if (!selectedCategory) {
        return;
      }

      activateFilter(selectedCategory);

      const projectsSection =
        document.querySelector("#proyectos");

      if (projectsSection) {
        projectsSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  /**
   * Modal de información del proyecto
   */

  function openModal(projectTitle) {
    if (!modal || !modalTitle) {
      return;
    }

    lastFocusedElement =
      document.activeElement;

    modalTitle.textContent =
      projectTitle;

    modal.classList.add("visible");

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "modal-open"
    );

    const closeButton =
      modal.querySelector(".modal-close");

    if (closeButton) {
      closeButton.focus();
    }
  }

  function closeModal() {
    if (!modal) {
      return;
    }

    modal.classList.remove("visible");

    modal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "modal-open"
    );

    if (
      lastFocusedElement &&
      typeof lastFocusedElement.focus === "function"
    ) {
      lastFocusedElement.focus();
    }
  }

  projectButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const projectTitle =
        button.dataset.projectTitle ||
        "Proyecto";

      openModal(projectTitle);
    });
  });

  closeModalButtons.forEach((button) => {
    button.addEventListener(
      "click",
      closeModal
    );
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      modal &&
      modal.classList.contains("visible")
    ) {
      closeModal();
    }
  });

  /**
   * Año automático
   */

  if (currentYear) {
    currentYear.textContent =
      String(new Date().getFullYear());
  }

  /**
   * Estado inicial
   */

  filterProjects("todos");
});
