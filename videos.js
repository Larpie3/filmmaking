/*
  VIDEOS.JS — the catalog for the archive.
  ------------------------------------------------
  This is the only file you need to touch to add, remove, or edit videos.
  Every entry is one object in the VIDEOS array below.

  HOW TO ADD A VIDEO:
  1. Drop the video file into the /videos folder next to index.html.
  2. (Optional) Drop a thumbnail image into /thumbnails. If you skip this,
     the site will show a plain placeholder card instead — it still works.
  3. Copy one of the objects below, paste it into the array, and fill in
     the fields for your video.

  FIELD REFERENCE:
    id           - a short unique code, no spaces (e.g. "sports-day-2026")
    title        - the video's title, shown on the card and watch page
    date         - shown as-is, e.g. "March 2026" or "2026-03-14"
    description  - a paragraph shown on the watch page (optional)
    tags         - an array of short labels, used by search (optional)
    duration     - shown as text, e.g. "4:32" (optional — type it in by hand)
    src          - path to the video file, relative to index.html
    thumbnail    - path to a thumbnail image, relative to index.html
                   (leave as "" or remove the line if you don't have one)
*/

const VIDEOS = [
  {
    id: "sample-welcome",
    title: "Welcome to the Northbridge Media Archive",
    date: "2026",
    description: "This is a sample entry so you can see how a video card and watch page look. Replace this with your first real video by editing videos.js — see the instructions at the top of this file.",
    tags: ["sample", "guide"],
    duration: "0:30",
    src: "videos/sample-welcome.mp4",
    thumbnail: ""
  },
  {
    id: "sample-second",
    title: "A Second Example Entry",
    date: "2026",
    description: "Add as many entries as you like — the gallery and search update automatically. Delete these two sample entries once you've added your own videos.",
    tags: ["sample"],
    duration: "1:10",
    src: "videos/sample-second.mp4",
    thumbnail: ""
  }
];
