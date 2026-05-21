const postTitle = document.querySelector("[data-post-title]");
const postCategory = document.querySelector("[data-post-category]");
const postSummary = document.querySelector("[data-post-summary]");
const postHero = document.querySelector("[data-post-hero]");
const postPanelImage = document.querySelector("[data-post-panel-image]");
const postContent = document.querySelector("[data-post-content]");
const strategyCarousel = document.querySelector("[data-strategy-carousel]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector("[data-lightbox-close]");

const escapeHtml = (value = "") =>
  value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);

const renderBlock = (block, index) => {
  if (block.type === "callout") {
    return `<div class="cs-callout"><p>${escapeHtml(block.text)}</p></div>`;
  }

  if (block.type === "insight-box") {
    return `<div class="cs-insight">
      <span class="cs-insight-label">${escapeHtml(block.label)}</span>
      <p>${escapeHtml(block.text)}</p>
    </div>`;
  }

  if (block.type === "user-voices") {
    return `<div class="cs-voices">
      ${block.label ? `<div class="cs-voices-label">${escapeHtml(block.label)}</div>` : ""}
      <div class="cs-voices-grid">
        ${block.voices.map((v) => `<div class="cs-voice-card"><p>${escapeHtml(v)}</p></div>`).join("")}
      </div>
    </div>`;
  }

  if (block.type === "personas") {
    return `<div class="cs-personas">
      ${block.users.map((u) => `<div class="cs-persona">
        <span class="cs-persona-type">${escapeHtml(u.type)}</span>
        <h3>${escapeHtml(u.title)}</h3>
        <ul>${u.traits.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul>
      </div>`).join("")}
    </div>`;
  }

  if (block.type === "steps") {
    return `<div class="cs-steps">
      ${block.label ? `<div class="cs-steps-label">${escapeHtml(block.label)}</div>` : ""}
      ${block.steps.map((s) => `<div class="cs-step">
        <div class="cs-step-num">${escapeHtml(s.number)}</div>
        <div>
          <h4>${escapeHtml(s.title)}</h4>
          <p>${escapeHtml(s.text)}</p>
        </div>
      </div>`).join("")}
    </div>`;
  }

  if (block.type === "callout-examples") {
    return `<div class="cs-callout-examples">
      ${block.label ? `<div class="cs-callout-examples-label">${escapeHtml(block.label)}</div>` : ""}
      ${block.headline ? `<h3>${escapeHtml(block.headline)}</h3>` : ""}
      <div class="cs-callout-cards">
        ${block.examples.map((ex) => `<div class="cs-callout-card"><p>"${escapeHtml(ex)}"</p></div>`).join("")}
      </div>
    </div>`;
  }

  if (block.type === "metrics-grid") {
    return `<div class="cs-metrics-wrap">
      ${block["north-star"] ? `<div class="cs-north-star">
        <div class="cs-north-star-badge">
          <svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span>North Star Metric</span>
        </div>
        <h3>${escapeHtml(block["north-star"])}</h3>
        ${block["north-star-why"] ? `<p class="cs-north-star-why">${escapeHtml(block["north-star-why"])}</p>` : ""}
      </div>` : ""}
      <div class="cs-metrics-grid">
        ${block.metrics.map((m) => `<div class="cs-metric-card">
          <div class="cs-metric-card-header">
            ${m.icon ? `<span class="cs-metric-icon">${m.icon}</span>` : ""}
            <h4>${escapeHtml(m.category)}</h4>
          </div>
          <div class="cs-metric-kpis">
            ${m.items.map((i) => `<div class="cs-metric-kpi">
              <span class="cs-metric-dot"></span>
              <span>${escapeHtml(i)}</span>
            </div>`).join("")}
          </div>
        </div>`).join("")}
      </div>
    </div>`;
  }

  if (block.type === "phases") {
    return `<div class="cs-phases">
      ${block.phases.map((p) => `<div class="cs-phase">
        <div class="cs-phase-num">${escapeHtml(p.number)}</div>
        <div>
          <h4>${escapeHtml(p.title)}</h4>
          <p>${escapeHtml(p.text)}</p>
        </div>
      </div>`).join("")}
    </div>`;
  }

  if (block.type === "image") {
    return `<figure class="case-visual">
      <img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt ?? "")}" />
      ${block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : ""}
    </figure>`;
  }

  if (block.type === "heading") {
    const number = block.text.match(/^(\d+)\./)?.[1] ?? String(index + 1).padStart(2, "0");
    return `<section class="case-section">
      <div class="case-section-number">${escapeHtml(number)}</div>
      <div class="case-section-body">
        <h2>${escapeHtml(block.text.replace(/^\d+\.\s*/, ""))}</h2>
      </div>
    </section>`;
  }

  if (block.type === "list") {
    return `<div class="case-list-card">
      <ul>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </div>`;
  }

  const className = index === 0 ? "case-intro" : "case-paragraph";
  return `<p class="${className}">${escapeHtml(block.text)}</p>`;
};

const renderStrategyCarousel = (post) => {
  if (!strategyCarousel) return;
  const slides = post.strategySlides?.length ? post.strategySlides : [
    {
      label: "01 Problem",
      title: "Problem",
      text: "What is the brand or product challenge?",
      image: post.panelImage ?? post.thumbnail
    },
    {
      label: "02 Insight",
      title: "Insight",
      text: "What user behavior or market signal explains it?",
      image: post.thumbnail
    },
    {
      label: "03 Action",
      title: "Action",
      text: "What strategic move should the brand make?",
      image: post.panelImage ?? post.thumbnail
    }
  ];

  strategyCarousel.innerHTML = `
    <div class="strategy-track" data-strategy-track>
      ${slides.map((slide) => `
        <article class="strategy-slide">
          <button class="image-zoom-trigger" type="button" data-full-image="${escapeHtml(slide.image ?? "")}" aria-label="Open ${escapeHtml(slide.label)} image larger">
            <img src="${escapeHtml(slide.image ?? "")}" alt="" />
          </button>
          <div class="strategy-slide-copy">
            <span>${escapeHtml(slide.label)}</span>
            <h2>${escapeHtml(slide.title)}</h2>
            <p>${escapeHtml(slide.text)}</p>
          </div>
        </article>
      `).join("")}
    </div>
    <div class="strategy-controls" aria-label="Carousel controls">
      <button type="button" data-strategy-prev aria-label="Previous strategy slide">‹</button>
      <div class="strategy-dots">
        ${slides.map((_, index) => `<button type="button" data-strategy-dot="${index}" aria-label="Go to strategy slide ${index + 1}"></button>`).join("")}
      </div>
      <button type="button" data-strategy-next aria-label="Next strategy slide">›</button>
    </div>
  `;

  const track = strategyCarousel.querySelector("[data-strategy-track]");
  const dots = [...strategyCarousel.querySelectorAll("[data-strategy-dot]")];
  let activeIndex = 0;

  const goTo = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    track.scrollTo({ left: activeIndex * track.clientWidth, behavior: "smooth" });
    dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === activeIndex));
  };

  strategyCarousel.querySelector("[data-strategy-prev]").addEventListener("click", () => goTo(activeIndex - 1));
  strategyCarousel.querySelector("[data-strategy-next]").addEventListener("click", () => goTo(activeIndex + 1));
  dots.forEach((dot, index) => dot.addEventListener("click", () => goTo(index)));
  track.addEventListener("scroll", () => {
    const index = Math.round(track.scrollLeft / track.clientWidth);
    if (index !== activeIndex) {
      activeIndex = index;
      dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === activeIndex));
    }
  }, { passive: true });
  goTo(0);
};

const openLightbox = (src) => {
  if (!lightbox || !lightboxImage || !src) return;
  lightboxImage.src = src;
  lightbox.hidden = false;
  document.body.classList.add("has-lightbox");
};

const closeLightbox = () => {
  if (!lightbox || !lightboxImage) return;
  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.classList.remove("has-lightbox");
};

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-full-image]");
  if (trigger) openLightbox(trigger.dataset.fullImage);
});

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

const loadPost = async () => {
  const slug = new URLSearchParams(window.location.search).get("slug");
  const response = await fetch("data/blogs.json");
  const posts = await response.json();
  const post = posts.find((item) => item.slug === slug) ?? posts[0];

  if (!post) {
    postTitle.textContent = "No episodes yet";
    return;
  }

  document.title = `${post.title} | Shivani Arora`;
  postTitle.textContent = post.title;
  postCategory.textContent = post.category;
  postSummary.textContent = post.summary;
  renderStrategyCarousel(post);
  postContent.innerHTML = post.content.map(renderBlock).join("");
};

loadPost().catch(() => {
    postTitle.textContent = "Episode could not be loaded";
});
