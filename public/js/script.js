// Initialize carousel with vertical sliding and pause on card hover
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector("#verticalCarousel");
  const bsCarousel = new bootstrap.Carousel(carousel, {
    interval: 3500,
    ride: "carousel",
    vertical: true,
  });

  document.querySelectorAll(".carousel .card").forEach((card) => {
    card.addEventListener("mouseenter", () => bsCarousel.pause());
    card.addEventListener("mouseleave", () => bsCarousel.cycle());
  });

  // Animate count function
  const animateCount = (elementId, endValue, duration, increment = 100) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const stepTime = Math.abs(duration / (endValue / increment));
    let currentValue = 0;

    const updateCount = () => {
      if (currentValue >= endValue) {
        element.textContent = formatNumber(endValue);
        return;
      }

      currentValue += increment;
      if (currentValue > endValue) {
        currentValue = endValue; 
      }
      element.textContent = formatNumber(currentValue);
      setTimeout(updateCount, stepTime);
    };

    const formatNumber = (value) => {
      if (value >= 1000000) {
        return `${Math.floor(value / 1000000)}M`;
      } else if (value >= 1000) {
        return `${Math.floor(value / 1000)}K`;
      } else {
        return value;
      }
    };

    updateCount();
  };

  // Trigger count animations
  animateCount("restaurants-count", 5000, 5000);
  animateCount("customers-count", 10000, 10000);
  animateCount("reviews-count", 25000, 10000);

  // Scroll to Top Button
  const scrollToTopBtn = document.getElementById("scrollToTop");

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", () => {
    scrollToTopBtn.style.display = window.scrollY > 200 ? "block" : "none";
  });

  // Form Validation
  document.querySelectorAll(".needs-validation").forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add("was-validated");
    });
  });
  // Password length validation
  const passwordInput = document.getElementById("password");
  const passwordFeedback = document.getElementById("password-feedback");

  passwordInput.addEventListener("input", () => {
    const value = passwordInput.value;
    if (value.length < 8) {
      passwordFeedback.textContent =
        "Password must be at least 8 characters long.";
      passwordInput.classList.add("is-invalid");
    } else if (value.length > 16) {
      passwordFeedback.textContent =
        "Password must be less than 16 characters long.";
      passwordInput.classList.add("is-invalid");
    } else {
      passwordFeedback.textContent = "";
      passwordInput.classList.remove("is-invalid");
    }
  });

  document.querySelector("form").addEventListener("submit", (event) => {
    if (passwordInput.value.length < 8 || passwordInput.value.length > 16) {
      event.preventDefault();
      passwordInput.focus();
    }
  });
});

// Item search and sort
const searchBar = document.getElementById("search-bar");
const categoryButtons = document.querySelectorAll("#category-buttons button");
const itemCards = document.querySelectorAll(".card-item");

categoryButtons.forEach((button) => {
  button.addEventListener("click", () =>
    filterItems(button.getAttribute("data-category"))
  );
});

searchBar.addEventListener("input", () =>
  filterItems(searchBar.value.toLowerCase())
);

const filterItems = (filter) => {
  itemCards.forEach((card) => {
    const itemCategory = card.getAttribute("data-category");
    const itemTitle = card.querySelector(".card-title").innerText.toLowerCase();

    if (
      filter === "all" ||
      itemCategory === filter ||
      itemTitle.includes(filter)
    ) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
};

 document
   .getElementById("restaurantForm")
   .addEventListener("submit", function (event) {
     // Select all input and textarea elements
     const inputs = document.querySelectorAll(
       "#restaurantForm input, #restaurantForm textarea"
     );

     // Trim whitespace from the values
     inputs.forEach((input) => {
       if (input.type !== "file") {
         // Skip file inputs
         input.value = input.value.trim();
       }
     });
   });