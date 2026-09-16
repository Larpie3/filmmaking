document.addEventListener("DOMContentLoaded", () => {
  const galleryGrid = document.getElementById("gallery-grid");
  const searchInput = document.getElementById("search-input");
  const resultCount = document.getElementById("result-count");
  const emptyState = document.getElementById("empty-state");
  
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

  // SVG Fallback for items with empty thumbnails
  const fallbackThumb = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="100%" height="100%" fill="%231a1a1a"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23666666" font-family="sans-serif" font-size="20">SCC Media Archive</text></svg>`;

  function renderGallery(items) {
    galleryGrid.innerHTML = "";
    
    if (!items || items.length === 0) {
      emptyState.hidden = false;
      resultCount.textContent = "0 entries";
      return;
    }

    emptyState.hidden = true;
    resultCount.textContent = `${items.length} ${items.length === 1 ? 'entry' : 'entries'}`;

    items.forEach(video => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <div class="card-thumb">
          <img src="${video.thumbnail && video.thumbnail.trim() !== '' ? video.thumbnail : fallbackThumb}" alt="${video.title}" loading="lazy">
          ${video.duration ? `<span class="card-duration">${video.duration}</span>` : ''}
        </div>
        <div class="card-body">
          <h2 class="card-title">${video.title}</h2>
          <div class="card-meta">
            <span>${video.date || ''}</span>
          </div>
          <p class="card-desc">${video.description || ''}</p>
        </div>
      `;

      card.addEventListener("click", () => openVideo(video));
      galleryGrid.appendChild(card);
    });
  }

  function openVideo(video) {
    viewGallery.hidden = true;
    viewWatch.hidden = false;
    window.scrollTo(0, 0);

    player.src = video.src;
    watchTitle.textContent = video.title;
    watchDate.textContent = video.date || "";
    watchDuration.textContent = video.duration || "";
    watchDescription.textContent = video.description || "";

    // Render tags
    watchTags.innerHTML = "";
    if (video.tags && video.tags.length > 0) {
      video.tags.forEach(tag => {
        const tagSpan = document.createElement("span");
        tagSpan.className = "tag";
        tagSpan.textContent = `#${tag}`;
        watchTags.appendChild(tagSpan);
      });
    }

    // Render sidebar
    sidebarList.innerHTML = "";
    const catalog = window.VIDEOS || [];
    const remainingVideos = catalog.filter(v => v.id !== video.id);
    remainingVideos.forEach(rel => {
      const sideItem = document.createElement("div");
      sideItem.className = "sidebar-item";
      sideItem.innerHTML = `
        <div class="sidebar-thumb">
          <img src="${rel.thumbnail && rel.thumbnail.trim() !== '' ? rel.thumbnail : fallbackThumb}" alt="${rel.title}">
        </div>
        <div class="sidebar-info">
          <h4>${rel.title}</h4>
          <small>${rel.date || ''}</small>
        </div>
      `;
      sideItem.addEventListener("click", () => openVideo(rel));
      sidebarList.appendChild(sideItem);
    });

    player.play().catch(() => {});
  }

  function showGallery() {
    player.pause();
    player.src = "";
    viewWatch.hidden = true;
    viewGallery.hidden = false;
  }

  // Search filter listener
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      const catalog = window.VIDEOS || [];
      const filtered = catalog.filter(v => {
        const titleMatch = v.title.toLowerCase().includes(query);
        const descMatch = (v.description || "").toLowerCase().includes(query);
        const dateMatch = (v.date || "").toLowerCase().includes(query);
        const tagMatch = v.tags && v.tags.some(t => t.toLowerCase().includes(query));
        return titleMatch || descMatch || dateMatch || tagMatch;
      });
      renderGallery(filtered);
    });
  }

  // Navigation handlers
  if (backBtn) backBtn.addEventListener("click", showGallery);
  if (brandLink) brandLink.addEventListener("click", (e) => {
    e.preventDefault();
    showGallery();
  });

  // Initial render using window.VIDEOS safely
  const initialCatalog = window.VIDEOS || [];
  renderGallery(initialCatalog);
});
