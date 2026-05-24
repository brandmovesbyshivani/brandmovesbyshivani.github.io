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
  const duration = 1600;
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

document.querySelectorAll(".hero-stat strong[data-count]").forEach((el) => {
  statObserver.observe(el);
});

const initPortfolio3D = async () => {
  const canvas = document.querySelector("[data-portfolio-3d]");
  const wrap = canvas?.closest(".hero-visual-3d");
  if (!canvas || !wrap) return;

  let THREE;
  try {
    THREE = await import("https://unpkg.com/three@0.164.1/build/three.module.js");
  } catch {
    wrap.classList.add("is-3d-fallback");
    return;
  }

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0.18, 6.4);

  const group = new THREE.Group();
  scene.add(group);

  const light = new THREE.HemisphereLight(0xffffff, 0xe9dccf, 2.4);
  scene.add(light);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.1);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);

  const textureLoader = new THREE.TextureLoader();
  const loadTexture = (src) => new Promise((resolve) => {
    textureLoader.load(src, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      resolve(texture);
    }, undefined, () => resolve(null));
  });

  const sources = [
    "assets/episodes/cetaphil/day-7-called-out-thumbnail.png",
    "assets/episodes/otrivin-naak-ki-diary/naak-ki-diary-card-16x9.png",
    "assets/episodes/cetaphil-packaging/system-lineup.png"
  ];
  const textures = await Promise.all(sources.map(loadTexture));

  const makeCard = (texture, x, y, z, ry) => {
    const geometry = new THREE.BoxGeometry(2.72, 1.62, 0.12);
    const materials = [
      new THREE.MeshStandardMaterial({ color: 0xf4eee6, roughness: 0.55 }),
      new THREE.MeshStandardMaterial({ color: 0xf4eee6, roughness: 0.55 }),
      new THREE.MeshStandardMaterial({ color: 0xf4eee6, roughness: 0.55 }),
      new THREE.MeshStandardMaterial({ color: 0xf4eee6, roughness: 0.55 }),
      new THREE.MeshStandardMaterial({ map: texture, roughness: 0.42 }),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.72 })
    ];
    const mesh = new THREE.Mesh(geometry, materials);
    mesh.position.set(x, y, z);
    mesh.rotation.set(-0.18, ry, 0.02);
    group.add(mesh);
    return mesh;
  };

  const cards = textures.map((texture, index) => makeCard(
    texture,
    [-1.65, 0.55, 1.78][index],
    [0.95, 0.12, -0.88][index],
    [0.2, 0.55, -0.1][index],
    [-0.38, 0.08, 0.34][index]
  ));

  const core = new THREE.Mesh(
    new THREE.BoxGeometry(2.05, 1.15, 0.18),
    new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.48,
      metalness: 0.16
    })
  );
  core.position.set(-0.08, -0.05, 1.15);
  core.rotation.set(-0.16, 0.03, 0.03);
  group.add(core);

  const accent = new THREE.Mesh(
    new THREE.TorusGeometry(1.7, 0.018, 8, 96),
    new THREE.MeshStandardMaterial({ color: 0xe85d04, roughness: 0.38 })
  );
  accent.position.set(0.15, 0.05, -0.35);
  accent.rotation.set(1.22, 0.15, -0.32);
  group.add(accent);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(3.6, 96),
    new THREE.MeshBasicMaterial({ color: 0x1a1a1a, transparent: true, opacity: 0.08 })
  );
  floor.position.set(0, -1.45, -0.55);
  floor.rotation.x = -Math.PI / 2;
  group.add(floor);

  const pointer = { x: 0, y: 0, active: 0 };
  wrap.addEventListener("pointermove", (event) => {
    const rect = wrap.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    pointer.active = 1;
    wrap.style.setProperty("--tilt-x", `${pointer.x * 3.5}deg`);
    wrap.style.setProperty("--tilt-y", `${pointer.y * -2}deg`);
  });
  wrap.addEventListener("pointerleave", () => {
    pointer.active = 0;
    wrap.style.setProperty("--tilt-x", "0deg");
    wrap.style.setProperty("--tilt-y", "0deg");
  });

  const setSize = () => {
    const rect = wrap.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  };
  setSize();
  window.addEventListener("resize", setSize);
  group.scale.setScalar(1.24);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const start = performance.now();
  const animate = (now) => {
    const t = (now - start) / 1000;
    const hover = pointer.active;
    group.rotation.y += ((pointer.x * 0.22) - group.rotation.y) * 0.06;
    group.rotation.x += ((-pointer.y * 0.12) - group.rotation.x) * 0.06;
    group.position.y = Math.sin(t * 1.2) * (reduceMotion ? 0.015 : 0.05);
    accent.rotation.z += reduceMotion ? 0.001 : 0.006;
    cards.forEach((card, index) => {
      card.position.z += (((hover ? 0.18 : 0) + [0.2, 0.55, -0.1][index]) - card.position.z) * 0.04;
      card.rotation.z = Math.sin(t + index) * (reduceMotion ? 0.005 : 0.018);
    });
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
};

initPortfolio3D();
