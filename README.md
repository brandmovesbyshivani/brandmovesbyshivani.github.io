# Shivani Arora Portfolio

Static portfolio website for two goals:

- PM job applications and recruiter review
- Brand collaborations through `#IFIRANTHEBRAND`

## Edit Before Sharing

Update these placeholders in `index.html`:

- `Resume` link with your resume PDF or Google Drive link
- `assets/profile-photo.png` with your latest profile photo if you want to change it later
- PM case-study cards with your actual projects, outcomes, and metrics
- Collaboration offers with your preferred pricing or inquiry process

## Open The Site

For live preview while editing, open:

```text
http://127.0.0.1:5173
```

If the live server is not running, start it with:

```bash
/Users/shivani/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node dev-server.mjs
```

## Add #IFIRANTHEBRAND Episodes

The episode grid under `#IFIRANTHEBRAND` is powered by `data/blogs.json`.

Non-programmer workflow:

1. Open `blog-editor.html` in the browser.
2. Fill the form after you post a reel or decide the episode strategy.
3. Click `Generate Episode Entry`.
4. Copy the generated entry.
5. Open `data/blogs.json`.
6. Paste the new entry after the opening `[` and add a comma after it if more episodes follow.

Each episode card links to `blog.html?slug=your-episode-slug`, so you do not need to create a new HTML page for every episode.
