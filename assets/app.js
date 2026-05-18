const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const searchInput = document.querySelector("#post-search");
const postCards = Array.from(document.querySelectorAll(".post-card"));

const storedTheme = localStorage.getItem("theme");
if (storedTheme) {
  root.dataset.theme = storedTheme;
}

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("theme", nextTheme);
});

searchInput?.addEventListener("input", (event) => {
  const query = event.target.value.trim().toLowerCase();

  postCards.forEach((card) => {
    const haystack = `${card.dataset.title} ${card.dataset.tags} ${card.textContent}`.toLowerCase();
    card.hidden = query.length > 0 && !haystack.includes(query);
  });
});
