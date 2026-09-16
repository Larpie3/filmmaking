(function () {
  "use strict";

  const grid = document.getElementById("gallery-grid");
  const resultCount = document.getElementById("result-count");
  const emptyState = document.getElementById("empty-state");
  const searchInput = document.getElementById("search-input");

  const viewGallery = document.getElementById("view-gallery");
  const viewWatch = document.getElementById("view-watch");
  const backBtn = document.getElementById("back-btn");
  const brandLink = document.getElementById("brand-link");

  const player = document.getElementById("player");
  const watchTitle = document.getElementById("watch-title");
  const watchDate = document.getElementById("watch-date");
  const watchDuration = document.getElementById("watch-duration");
  const watchTags = document.getElementById("watch-tags");
  const watchDescription = document.getElementById("watch-description");
  const sidebarList = document.getElementById("sidebar-list");

  const byId = new Map((window.VIDEOS || []).map(v => [v.id, v]));

  // ---------- helpers ----------

  function thumbHTML(video, opts) {
    opts = opts || {};
    const durationBadge = video.duration
      ? `<span class="card-duration" data-duration-for="${video.id}">${video.duration}</span>`
      : `<span class="card-duration" data-duration-for="${video.id}" hidden></span>`;

    const image = video.thumbnail
      ? `<img src="${video.thumbnail}" alt="" loading="lazy">`
      : `<div class="card-thumb-fallback">${escapeHTML(video.title)}</div>`;

    const playIcon = opts.withPlayIcon !== false
      ? `<div class="card-play" aria-hidden="true">
           <svg viewBox="0 0 48 48" fill="none">
             <circle cx="24" cy="24" r="23" fill="rgba(18,21,27,0.55)" stroke="white" stroke-opacity="0.6"/>
             <path d="M19 15L33 24L19 33V15Z" fill="white"/>
           </svg>
         </div>`
      : "";

    return `<div class="${opts.sidebarStyle ? 'sidebar-thumb' : 'card-thumb'}">
        ${image}
        ${playIcon}
        ${durationBadge}
      </div>`;
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function formatDuration(seconds) {
    seconds = Math.round(seconds);
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  // Progressive enhancement: if a video has no manual duration, probe the
  // file itself for its length once the card is on screen. Fails silently
  // if the file isn't there yet (e.g. sample entries).
  function probeDuration(video) {
    if (video.duration || video._probed) return;
    video._probed = true;
    const probe = document.createElement("video");
    probe.preload = "metadata";
    probe.src = video.src;
    probe.addEventListener("loadedmetadata", () => {
      if (isFinite(probe.duration)) {
        const text = formatDuration(probe.duration);
        document.querySelectorAll(`[data-duration-for="${video.id}"]`).forEach(el => {
          el.textContent = text;
          el.hidden = false;
        });
      }
    });
    probe.addEventListener("error", () => {});
  }

  // ---------- gallery rendering ----------

  function renderGallery(list) {
    grid.innerHTML = "";
    resultCount.textContent = list.length === 1
      ? "1 video in the archive"
      : `${list.length} videos in the archive`;
    emptyState.hidden = list.length !== 0;

    list.forEach((video, i) => {
      const card = document.createElement("a");
      card.href = `#watch=${encodeURIComponent(video.id)}`;
      card.className = "video-card";
      card.style.animationDelay = `${Math.min(i, 10) * 30}ms`;
      card.innerHTML = `
        ${thumbHTML(video)}
        <h2 class="card-title">${escapeHTML(video.title)}</h2>
        <p class="card-meta">${escapeHTML(video.date || "")}</p>
      `;
      grid.appendChild(card);
      probeDuration(video);
    });
  }

  function matchesQuery(video, query) {
    if (!query) return true;
    const haystack = [video.title, video.date, ...(video.tags || [])]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  }

  function applySearch() {
    const query = searchInput.value.trim().toLowerCase();
    const all = window.VIDEOS || [];
    renderGallery(all.filter(v => matchesQuery(v, query)));
  }

  // ---------- watch view ----------

  function renderSidebar(currentId) {
    const others = (window.VIDEOS || []).filter(v => v.id !== currentId);
    sidebarList.innerHTML = "";
    others.forEach(video => {
      const item = document.createElement("a");
      item.href = `#watch=${encodeURIComponent(video.id)}`;
      item.className = "sidebar-item";
      item.innerHTML = `
        ${thumbHTML(video, { sidebarStyle: true })}
        <div class="sidebar-info">
          <h3 class="sidebar-title">${escapeHTML(video.title)}</h3>
          <p class="sidebar-date">${escapeHTML(video.date || "")}</p>
        </div>
      `;
      sidebarList.appendChild(item);
      probeDuration(video);
    });
  }

  function showWatch(id) {
    const video = byId.get(id);
    if (!video) {
      location.hash = "";
      return;
    }

    player.src = video.src;
    if (video.thumbnail) player.poster = video.thumbnail;
    watchTitle.textContent = video.title;
    watchDate.textContent = video.date || "";
    watchDuration.textContent = video.duration || "";
    watchDuration.hidden = !video.duration;
    watchDescription.textContent = video.description || "";

    watchTags.innerHTML = (video.tags || [])
      .map(tag => `<span class="tag-pill">${escapeHTML(tag)}</span>`)
      .join("");

    renderSidebar(id);

    viewGallery.hidden = true;
    viewWatch.hidden = false;
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  function showGallery() {
    player.pause();
    player.removeAttribute("src");
    player.load();
    viewWatch.hidden = true;
    viewGallery.hidden = false;
  }

  // ---------- routing ----------

  function route() {
    const hash = location.hash;
    const match = hash.match(/^#watch=(.+)$/);
    if (match) {
      showWatch(decodeURIComponent(match[1]));
    } else {
      showGallery();
    }
  }

  window.addEventListener("hashchange", route);
  backBtn.addEventListener("click", () => { location.hash = ""; });
  brandLink.addEventListener("click", (e) => { e.preventDefault(); location.hash = ""; });
  searchInput.addEventListener("input", applySearch);

  // ---------- init ----------

  applySearch();
  route();
})();
