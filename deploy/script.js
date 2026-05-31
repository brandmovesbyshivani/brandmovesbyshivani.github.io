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
    slug: "otrivin-naak-ki-diary-strategy",
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
    label: "Moment 01",
    title: "The team knows something is wrong, but not what.",
    summary: "I turn scattered feedback into one clear problem the team can actually solve.",
    steps: ["Listen to users", "Name the pain", "Choose the metric"],
    output: "A clear problem statement, user signal, and success metric.",
    proofs: ["User signal", "Problem clarity", "Success metric"]
  },
  launch: {
    label: "Moment 02",
    title: "The product is ready, but the story is not.",
    summary: "I connect the audience, the promise, and the launch plan so people understand why it matters.",
    steps: ["Pick the audience", "Shape the promise", "Plan the launch"],
    output: "A simple launch story, channel plan, and first activation ideas.",
    proofs: ["Audience focus", "Positioning", "Launch plan"]
  },
  growth: {
    label: "Moment 03",
    title: "People try the product, but do not keep going.",
    summary: "I look for the point where users drop off and turn it into a small experiment.",
    steps: ["Map the journey", "Find the drop-off", "Test one fix"],
    output: "A growth hypothesis, experiment plan, and learning loop.",
    proofs: ["Journey map", "Experiment", "Learning loop"]
  },
  alignment: {
    label: "Moment 04",
    title: "Everyone has an opinion, and the team needs a call.",
    summary: "I make the tradeoffs visible, simplify the decision, and keep the next step clear.",
    steps: ["List the tradeoffs", "Make the call", "Share next steps"],
    output: "A clear decision, risks, owner, and next action.",
    proofs: ["Tradeoffs", "Decision", "Next action"]
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
