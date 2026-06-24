const searchInput = document.querySelector("#post-search");
const articleRows = Array.from(document.querySelectorAll(".article-row"));

searchInput?.addEventListener("input", (event) => {
  const query = event.target.value.trim().toLowerCase();

  articleRows.forEach((row) => {
    const haystack = `${row.dataset.title} ${row.dataset.tags} ${row.textContent}`.toLowerCase();
    row.hidden = query.length > 0 && !haystack.includes(query);
  });
});
