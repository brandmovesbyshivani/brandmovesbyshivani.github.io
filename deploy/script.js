const header = document.querySelector(".site-header");
const blogGrid = document.querySelector("[data-blog-grid]");

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const escapeHtml = (value = "") =>
  value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);

const renderBlogCards = async () => {
  if (!blogGrid) return;

  try {
    const limit = Number(blogGrid.dataset.limit) || 3;
    const response = await fetch("data/blogs.json");
    const posts = (await response.json()).slice(0, limit);

    blogGrid.innerHTML = posts
      .map((post) => `
        <a class="blog-card" href="blog.html?slug=${encodeURIComponent(post.slug)}">
          ${post.thumbnail ? `<img class="blog-card-image" src="${escapeHtml(post.thumbnail)}" alt="" />` : ""}
          <span class="blog-category">${escapeHtml(post.category)}</span>
          <div>
            <h3>${escapeHtml(post.title)}</h3>
            <p>${escapeHtml(post.summary)}</p>
          </div>
        </a>
      `)
      .join("");
  } catch {
    blogGrid.innerHTML = `
      <article class="blog-card">
        <span class="blog-category">Episodes</span>
        <h3>Episodes could not be loaded</h3>
        <p>Please check data/blogs.json and refresh the page.</p>
      </article>
    `;
  }
};

renderBlogCards();

// Count-up animation for hero stats
const animateCount = (el) => {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const isDecimal = target % 1 !== 0;
  const duration = 1400;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll(".hero-stat strong[data-count]").forEach((el) => {
  statObserver.observe(el);
});
