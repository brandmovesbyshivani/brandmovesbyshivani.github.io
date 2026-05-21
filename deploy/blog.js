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
    const gauge = block["north-star-gauge"] || 60;
    const r = 52;
    const circ = +(2 * Math.PI * r).toFixed(2);
    const offset = +((1 - gauge / 100) * circ).toFixed(2);

    const renderItem = (item) => {
      if (typeof item === "string") {
        return `<div class="cs-metric-kpi"><span class="cs-metric-dot"></span><span>${escapeHtml(item)}</span></div>`;
      }
      return `<details class="cs-metric-stat-row">
        <summary class="cs-metric-stat-top">
          <span class="cs-metric-stat-name">${escapeHtml(item.name)}</span>
          <strong class="cs-metric-stat-value"><span>Est.</span>${escapeHtml(item.value)}</strong>
        </summary>
        <div class="cs-metric-bar">
          <span class="cs-metric-bar-fill" style="--bar-w:${item.bar || 0}%"></span>
        </div>
        <p class="cs-metric-note">${escapeHtml(item.note || "Projected KPI for concept validation, not a reported live campaign result.")}</p>
      </details>`;
    };

    return `<div class="cs-metrics-wrap">
      <div class="cs-metrics-disclaimer">
        <span>Estimated KPI model</span>
        <p>These are forecast targets for a proposed product/campaign concept, not actual Cetaphil performance data.</p>
      </div>
      ${block["north-star"] ? `<div class="cs-north-star">
        <div class="cs-north-star-left">
          <div class="cs-north-star-badge">
            <svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>Estimated North Star</span>
          </div>
          <h3>${escapeHtml(block["north-star"])}</h3>
          ${block["north-star-why"] ? `<p class="cs-north-star-why">${escapeHtml(block["north-star-why"])}</p>` : ""}
        </div>
        <div class="cs-ns-gauge" aria-hidden="true">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="${r}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="9"/>
            <circle cx="60" cy="60" r="${r}" fill="none" stroke="#e85d04" stroke-width="9"
              stroke-dasharray="${circ}" stroke-dashoffset="${offset}"
              stroke-linecap="round" transform="rotate(-90 60 60)"
              class="cs-gauge-arc"/>
          </svg>
          <div class="cs-ns-gauge-label">
            <strong>${escapeHtml(block["north-star-target"] || gauge + "%")}</strong>
            <span>est. target</span>
          </div>
        </div>
      </div>` : ""}
      <div class="cs-metrics-grid">
        ${block.metrics.map((m) => `<div class="cs-metric-card">
          <div class="cs-metric-card-header">
            ${m.icon ? `<span class="cs-metric-icon">${m.icon}</span>` : ""}
            <h4>${escapeHtml(m.category)}</h4>
          </div>
          <div class="cs-metric-kpis">
            ${m.items.map(renderItem).join("")}
          </div>
        </div>`).join("")}
      </div>
    </div>`;
  }

  if (block.type === "mvp-screens") {
    const renderMockScreen = (s) => {
      const c = s.content || {};
      const esc = escapeHtml;
      // Real prototype screenshot takes priority over CSS mockup
      if (s.img) {
        return `<div class="cs-mock-screen cs-mock-photo">
          <img src="${esc(s.img)}" alt="${esc(s.name)}" loading="lazy" />
        </div>`;
      }
      switch (s.variant) {
        case "landing":
          return `<div class="cs-mock-screen cs-mock-landing">
            <div class="cs-mock-top-bar"><span></span><span></span><span></span></div>
            <div class="cs-mock-landing-body">
              <div class="cs-mock-pill">${esc(c.tag || "")}</div>
              <div class="cs-mock-big-text">${esc(c.headline || "")}</div>
              <div class="cs-mock-btn cs-mock-btn-accent">${esc(c.cta || "")}</div>
            </div>
          </div>`;
        case "onboarding":
          return `<div class="cs-mock-screen cs-mock-light">
            <div class="cs-mock-top-bar light"><span></span><span></span><span></span></div>
            <div class="cs-mock-body">
              <div class="cs-mock-pill-light">${esc(c.tag || "")}</div>
              <div class="cs-mock-question-text">${esc(c.question || "")}</div>
              <div class="cs-mock-option-grid">
                ${(c.options || []).map(o => `<div class="cs-mock-option-pill">${esc(o)}</div>`).join("")}
              </div>
            </div>
          </div>`;
        case "checkin":
          return `<div class="cs-mock-screen cs-mock-light">
            <div class="cs-mock-top-bar light"><span></span><span></span><span></span></div>
            <div class="cs-mock-body">
              <div class="cs-mock-day-badge">${esc(c.tag || "")}</div>
              <div class="cs-mock-question-text">${esc(c.question || "")}</div>
              <div class="cs-mock-radio-list">
                ${(c.options || []).map((o, i) => `<div class="cs-mock-radio-row ${i === 0 ? "selected" : ""}"><span class="cs-mock-radio-dot"></span><span>${esc(o)}</span></div>`).join("")}
              </div>
              <div class="cs-mock-btn cs-mock-btn-accent">Submit</div>
            </div>
          </div>`;
        case "feedback":
          return `<div class="cs-mock-screen cs-mock-light">
            <div class="cs-mock-top-bar light"><span></span><span></span><span></span></div>
            <div class="cs-mock-body">
              <div class="cs-mock-pill-light">${esc(c.tag || "")}</div>
              <div class="cs-mock-feedback-card">${esc(c.message || "")}</div>
              <div class="cs-mock-btn cs-mock-btn-ghost">${esc(c.cta || "")}</div>
            </div>
          </div>`;
        case "avatar":
          return `<div class="cs-mock-screen cs-mock-light">
            <div class="cs-mock-top-bar light"><span></span><span></span><span></span></div>
            <div class="cs-mock-body cs-mock-body-center">
              <div class="cs-mock-pill-light">${esc(c.tag || "")}</div>
              <div class="cs-mock-avatar-circle"></div>
              <div class="cs-mock-avatar-label">${esc(c.state || "")}</div>
              <div class="cs-mock-progress-wrap">
                <div class="cs-mock-progress-bar"><span style="width:${esc(c.score || "0")}%"></span></div>
                <span class="cs-mock-progress-val">${esc(c.score || "0")}% consistency</span>
              </div>
            </div>
          </div>`;
        case "result":
          return `<div class="cs-mock-screen cs-mock-result">
            <div class="cs-mock-top-bar"><span></span><span></span><span></span></div>
            <div class="cs-mock-landing-body">
              <div class="cs-mock-pill">${esc(c.tag || "")}</div>
              <div class="cs-mock-result-bottle">C</div>
              <div class="cs-mock-big-text">${esc(c.message || "")}</div>
              <div class="cs-mock-btn cs-mock-btn-accent">${esc(c.cta || "")}</div>
            </div>
          </div>`;
        case "share":
          return `<div class="cs-mock-screen cs-mock-light">
            <div class="cs-mock-top-bar light"><span></span><span></span><span></span></div>
            <div class="cs-mock-body cs-mock-body-center">
              <div class="cs-mock-share-card">
                <div class="cs-mock-share-logo">C</div>
                <div class="cs-mock-share-quote">"${esc(c.quote || "")}"</div>
                <div class="cs-mock-share-hashtag">${esc(c.tag || "")}</div>
              </div>
              <div class="cs-mock-btn cs-mock-btn-accent">Share →</div>
            </div>
          </div>`;
        case "dashboard":
          return `<div class="cs-mock-screen cs-mock-light">
            <div class="cs-mock-top-bar light"><span></span><span></span><span></span></div>
            <div class="cs-mock-body">
              <div class="cs-mock-pill-light">${esc(c.tag || "")}</div>
              <div class="cs-mock-dash-stat"><span>${esc(c.streak || "")}</span><span>🔥</span></div>
              <div class="cs-mock-dash-label">Consistency Score</div>
              <div class="cs-mock-progress-wrap">
                <div class="cs-mock-progress-bar"><span style="width:${esc(c.score || "0")}%"></span></div>
                <span class="cs-mock-progress-val">${esc(c.score || "0")}%</span>
              </div>
              <div class="cs-mock-status-chip">${esc(c.status || "")}</div>
            </div>
          </div>`;
        default:
          return `<div class="cs-mock-screen cs-mock-light"></div>`;
      }
    };

    return `<div class="cs-mvp-showcase">
      <div class="cs-mvp-scroll">
        ${block.screens.map((s) => `
          <div class="cs-mvp-item">
            <span class="cs-mvp-priority cs-mvp-p${(s.priority || "P0").slice(1)}">${escapeHtml(s.priority || "P0")}</span>
            <div class="cs-phone-mock">
              <div class="cs-phone-notch"></div>
              ${renderMockScreen(s)}
            </div>
            <div class="cs-mvp-meta">
              <strong>${escapeHtml(s.name)}</strong>
              <span>${escapeHtml(s.desc)}</span>
            </div>
          </div>
        `).join("")}
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
