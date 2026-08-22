/* Central blog post list — newest first.
   Published dates from each post’s <time data-published>:
   - leveling-up-my-web-setup: 2026-08-16
   - why-i-created-sounddrop: 2026-08-14
   - welcome-to-my-website: 2026-08-12
   When you publish a new post:
   1. Add the post folder under /posts/your-slug/
   2. Add an entry at the TOP of CPJR_POSTS below
   Homepage (3 latest) and Updates both read from this file. */

window.CPJR_POSTS = [
  {
    slug: "leveling-up-my-web-setup",
    title: "Leveling Up My Web Setup :D",
    date: "2026-08-16",
    image: "blog-slide-screenshot.jpg",
    excerpt:
      "Custom hamburger menu, day/night shift, social links, and more — how the site finally started to feel right."
  },
  {
    slug: "why-i-created-sounddrop",
    title: "Why I Created SoundDrop (Official Name TBD)",
    date: "2026-08-14",
    image: "soundrop-screenshot.jpg",
    excerpt:
      "Boredom, memes, and a hate of complicated UIs — how my first web project soundboard came to life."
  },
  {
    slug: "welcome-to-my-website",
    title: "Welcome to My Website",
    date: "2026-08-12",
    image: "youtube-slide-screenshot.jpg",
    excerpt:
      "Why I left template sites behind and built this hub from scratch — plus what’s coming next."
  }
];

window.CPJR_formatPostDate = function (isoDate) {
  var date = isoDate ? new Date(isoDate + "T12:00:00") : new Date();
  if (Number.isNaN(date.getTime())) date = new Date();
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};

window.CPJR_sortedPosts = function () {
  return (window.CPJR_POSTS || []).slice().sort(function (a, b) {
    return String(b.date || "").localeCompare(String(a.date || ""));
  });
};

window.CPJR_currentPostSlug = function () {
  var parts = String(window.location.pathname || "")
    .split("/")
    .filter(function (part) {
      return part && part !== "index.html";
    });
  var i = parts.indexOf("posts");
  if (i >= 0 && parts[i + 1]) return parts[i + 1];
  return parts[parts.length - 1] || "";
};

/* Next in chronological order: oldest → newer (Aug 12 → Aug 14 → Aug 16). */
window.CPJR_nextPost = function (slug) {
  var posts = (window.CPJR_POSTS || []).slice().sort(function (a, b) {
    return String(a.date || "").localeCompare(String(b.date || ""));
  });
  var n;
  for (n = 0; n < posts.length; n += 1) {
    if (posts[n].slug === slug) return posts[n + 1] || null;
  }
  return null;
};

window.CPJR_postHref = function (slug, rootPrefix) {
  return (rootPrefix || "") + "posts/" + slug + "/";
};

window.CPJR_postImageSrc = function (image, rootPrefix) {
  return (rootPrefix || "") + (image || "blog-slide-screenshot.jpg");
};
