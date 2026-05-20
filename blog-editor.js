const form = document.querySelector("[data-blog-form]");
const outputWrap = document.querySelector("[data-generated-wrap]");
const output = document.querySelector("[data-generated-json]");

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const bodyToBlocks = (body) => {
  const blocks = [];
  const sections = body.split(/\n\s*\n/).map((section) => section.trim()).filter(Boolean);

  for (const section of sections) {
    const lines = section.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.every((line) => line.startsWith("-"))) {
      blocks.push({
        type: "list",
        items: lines.map((line) => line.replace(/^-\s*/, ""))
      });
    } else {
      blocks.push({ type: "paragraph", text: lines.join(" ") });
    }
  }

  return blocks;
};

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const title = data.get("title").trim();
  const entry = {
    title,
    slug: slugify(title),
    date: data.get("date"),
    category: data.get("category").trim(),
    readTime: data.get("readTime").trim(),
    summary: data.get("summary").trim(),
    hero: data.get("category").trim(),
    content: bodyToBlocks(data.get("body").trim())
  };

  output.value = JSON.stringify(entry, null, 2);
  outputWrap.hidden = false;
  output.select();
});
