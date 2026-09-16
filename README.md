# Northbridge Media Archive — School Video Gallery

A watch-only video gallery site: one big searchable catalog, YouTube-style
watch page, no uploading/commenting/likes — visitors can only browse and
watch.

## Folder structure

```
school-video-gallery/
├── index.html       ← the page itself, don't need to touch this
├── styles.css        ← colors, fonts, layout
├── script.js         ← gallery/search/player logic, don't need to touch this
├── videos.js         ← ★ THIS is where you add your videos ★
├── videos/           ← put your actual .mp4 files in here
└── thumbnails/        ← (optional) put thumbnail images in here
```

## Quick start

1. Open `videos.js` in any text editor.
2. Delete the two sample entries.
3. For each video your school made, add one entry, e.g.:

```js
{
  id: "spring-concert-2026",
  title: "Spring Concert 2026",
  date: "May 2026",
  description: "Highlights from this year's spring choir and band concert.",
  tags: ["concert", "music", "2026"],
  duration: "6:42",
  src: "videos/spring-concert-2026.mp4",
  thumbnail: "thumbnails/spring-concert-2026.jpg"
}
```

4. Put the matching `.mp4` file in the `videos/` folder (and a thumbnail
   `.jpg`/`.png` in `thumbnails/`, if you have one — it's optional).
5. Open `index.html` in a browser. That's it — no build step, no server
   required.

## Notes

- **No thumbnail?** Leave `thumbnail: ""` — the card will show a plain
  placeholder with the title instead of breaking.
- **No duration?** Leave `duration: ""` — the site will quietly read the
  real length from the video file itself once it's added, and fill the
  badge in automatically.
- **Video format:** `.mp4` (H.264) plays in every modern browser without
  extra setup. Other formats may not play on all browsers.
- **Search** matches on title, date, and tags — so tagging videos well
  (event type, year, club name) makes them easier to find.
- **Hosting it online later:** if you eventually want this reachable from
  outside your school network, you'll need to upload the whole folder to a
  web host — video files are large, so check your host's storage/bandwidth
  limits first.

## Customizing the look

Open `styles.css` — the top of the file has a `:root { ... }` block with
all the colors and fonts as named variables (e.g. `--accent`, `--bg`).
Change the school name in `index.html` by editing the `brand-name` and
`brand-sub` text near the top of the `<body>`.
