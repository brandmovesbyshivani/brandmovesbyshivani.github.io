const header = document.querySelector(".site-header");
const blogGrid = document.querySelector("[data-blog-grid]");

const fallbackEpisodePosts = [
  {
    title: "#CetaphilCalledMeOut: Behavior-Led Brand Strategy",
    slug: "cetaphil-called-me-out-behavior-led-strategy",
    category: "#IFIRANTHEBRAND Episode 01",
    summary: "A PM-level strategy case study for Cetaphil: moving from skincare awareness to habit formation through a 7-day behavior-led experience.",
    thumbnail: "assets/episodes/cetaphil/day-7-called-out-thumbnail.png"
  },
  {
    title: "Not Handwash: Packaging-Led Behavior Strategy",
    slug: "cetaphil-packaging-behavior-shift",
    category: "#IFIRANTHEBRAND Episode",
    summary: "A PM-level strategy case study for Cetaphil: redesigning packaging perception, refill behavior, travel usability, and sustainability around a premium skincare system.",
    thumbnail: "assets/episodes/cetaphil-packaging/system-lineup.png"
  },
  {
    title: "Otrivin — Naak Ki Diary: Responsible Nasal Health System",
    slug: "otrivin-naak-ki-diary",
    category: "#IFIRANTHEBRAND Episode 03",
    summary: "A PM-level strategy case study for Otrivin: turning fast nasal relief into a responsible WhatsApp-led nasal health system with behavior tracking, Naak Score cards, pledges, and doctor referrals.",
    thumbnail: "assets/episodes/otrivin/naak-ki-diary-card.png"
  }
];

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

  const renderPosts = (posts) => {
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
  };

  try {
    const limit = Number(blogGrid.dataset.limit) || 3;
    const response = await fetch("data/blogs.json");
    if (!response.ok) throw new Error("Episodes unavailable");
    const posts = (await response.json()).slice(0, limit);
    renderPosts(posts);
  } catch {
    const limit = Number(blogGrid.dataset.limit) || 3;
    renderPosts(fallbackEpisodePosts.slice(0, limit));
  }
};

renderBlogCards();

// Count-up animation for hero stats
const animateCount = (el) => {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const isDecimal = target % 1 !== 0;
  const duration = 900;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    // Softer ease-out so the final number lands crisply
    const eased = 1 - Math.pow(1 - progress, 2.5);
    const current = target * eased;

    // On the last frame snap to exact value so it never stalls
    if (progress >= 1) {
      el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
    } else {
      // Math.round instead of Math.floor prevents sticking one digit below
      el.textContent = (isDecimal ? current.toFixed(1) : Math.min(Math.round(current), target)) + suffix;
    }

    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    // Re-trigger every time the section scrolls into view
    if (entry.isIntersecting) {
      animateCount(entry.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll(".hero-stat strong[data-count], .metric-card-count[data-count]").forEach((el) => {
  statObserver.observe(el);
});

const skillScenarios = {
  problem: {
    label: "Scenario 01",
    title: "When the problem is fuzzy",
    summary: "I slow the team down just enough to find the real user signal, define the pain clearly, and turn it into a decision-ready product opportunity.",
    steps: ["Listen to users", "Frame the problem", "Define success"],
    output: "Research synthesis, problem statement, user segments, and north-star metric.",
    proofs: ["User interviews + review mining", "Prioritized product bet", "Outcome-focused success measure"]
  },
  launch: {
    label: "Scenario 02",
    title: "When a launch needs a story",
    summary: "I connect audience, positioning, channels, and product value so the launch does not feel like a list of features.",
    steps: ["Segment audience", "Shape narrative", "Plan activation"],
    output: "GTM brief, launch narrative, channel plan, and activation ideas.",
    proofs: ["Audience segmentation", "Brand positioning", "Launch-ready roadmap"]
  },
  growth: {
    label: "Scenario 03",
    title: "When growth has stalled",
    summary: "I look for friction in the funnel, form testable hypotheses, and design experiments that teach the team what to do next.",
    steps: ["Map funnel", "Find friction", "Run experiments"],
    output: "Growth hypothesis, experiment design, measurement plan, and learnings loop.",
    proofs: ["Funnel thinking", "Growth experiments", "Product analytics"]
  },
  alignment: {
    label: "Scenario 04",
    title: "When the room needs clarity",
    summary: "I translate messy inputs into a crisp decision, name the tradeoffs, and keep stakeholders aligned on what matters.",
    steps: ["Clarify tradeoffs", "Make the call", "Communicate next steps"],
    output: "Decision memo, stakeholder update, risks, and next-step plan.",
    proofs: ["Stakeholder communication", "Roadmapping", "Clear decision framing"]
  }
};

const skillsLab = document.querySelector("[data-skills-lab]");

if (skillsLab) {
  const buttons = skillsLab.querySelectorAll("[data-skill-scenario]");
  const fields = {
    label: skillsLab.querySelector("[data-skill-label]"),
    title: skillsLab.querySelector("[data-skill-title]"),
    summary: skillsLab.querySelector("[data-skill-summary]"),
    steps: [
      skillsLab.querySelector("[data-skill-step-one]"),
      skillsLab.querySelector("[data-skill-step-two]"),
      skillsLab.querySelector("[data-skill-step-three]")
    ],
    output: skillsLab.querySelector("[data-skill-output]"),
    proofs: [
      skillsLab.querySelector("[data-skill-proof-one]"),
      skillsLab.querySelector("[data-skill-proof-two]"),
      skillsLab.querySelector("[data-skill-proof-three]")
    ]
  };

  const selectScenario = (key) => {
    const scenario = skillScenarios[key];
    if (!scenario) return;

    buttons.forEach((button) => {
      button.setAttribute("aria-selected", String(button.dataset.skillScenario === key));
    });

    fields.label.textContent = scenario.label;
    fields.title.textContent = scenario.title;
    fields.summary.textContent = scenario.summary;
    fields.output.textContent = scenario.output;
    fields.steps.forEach((field, index) => {
      field.textContent = scenario.steps[index];
    });
    fields.proofs.forEach((field, index) => {
      field.textContent = scenario.proofs[index];
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => selectScenario(button.dataset.skillScenario));
  });
}
