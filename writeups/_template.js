// ─────────────────────────────────────────────────────────────────
//  WRITEUP TEMPLATE  —  copy this file, rename it, fill it in,
//  then add an entry to writeups/registry.js
// ─────────────────────────────────────────────────────────────────

const WRITEUP = {
  slug:        "your-slug-here",       // must match filename (without .js)
  title:       "Platform — Challenge Name",
  date:        "2025-01-01",           // YYYY-MM-DD
  platform:    "HackTheBox",           // HackTheBox | PicoCTF | CTF | NahamCon | …
  os:          "Linux",                // Linux | Windows | —
  difficulty:  "medium",               // easy | medium | hard | insane
  tags:        ["pwn"],                // web pwn rev crypto forensics misc osint activedirectory hardware blockchain
  description: "One-line summary shown on the index page.",

  // ── TABLE OF CONTENTS ──────────────────────────────────────────
  // Each id must match an id="" attribute on a <h2> or <h3> in content.
  toc: [
    { id: "overview",   label: "Overview",    level: 2 },
    { id: "recon",      label: "Recon",       level: 2 },
    { id: "exploit",    label: "Exploit",     level: 2 },
    { id: "flag",       label: "Flag",        level: 2 },
    { id: "conclusion", label: "Conclusion",  level: 2 },
  ],

  // ── CONTENT ────────────────────────────────────────────────────
  // Write plain HTML. Supported elements:
  //
  //  Headings:     <h2 id="..."> <h3 id="...">
  //  Text:         <p> <strong> <em> <code> <a href="...">
  //  Lists:        <ul><li> <ol><li>
  //  Table:        <table><thead><tr><th> ... <tbody><tr><td>
  //  Separator:    <hr>
  //  Blockquote:   <blockquote>
  //
  //  Code block (auto-highlighted):
  //    Languages: bash/sh, python/py, powershell/ps1, c/cpp,
  //               javascript/js/typescript/ts, sql/mysql/postgresql/sqlite
  //    <div class="code-block">
  //      <div class="code-block-header">
  //        <span class="code-lang">bash</span>
  //        <button class="copy-btn" onclick="copyCode(this)">copy</button>
  //      </div>
  //      <pre><code>your raw code here</code></pre>
  //    </div>
  //
  //  Callout boxes:
  //    <div class="callout flag">   — green  (for flags)
  //    <div class="callout tip">    — blue   (tips/notes)
  //    <div class="callout warn">   — yellow (warnings)
  //    <div class="callout danger"> — red    (danger)
  //      <div class="callout-label">Flag</div>
  //      content here
  //    </div>
  //
  //  Images (put files in the images/ folder):
  //    Single image with caption:
  //      <figure>
  //        <img src="images/screenshot.png" alt="description">
  //        <figcaption>Fig 1. What this shows</figcaption>
  //      </figure>
  //
  //    Two images side by side:
  //      <div class="img-row">
  //        <figure><img src="images/a.png" alt="a"><figcaption>Caption A</figcaption></figure>
  //        <figure><img src="images/b.png" alt="b"><figcaption>Caption B</figcaption></figure>
  //      </div>
  //
  //    Inline image (small badge/icon):
  //      <img class="img-inline" src="images/badge.png" alt="badge">
  //
  //    Clicking any image opens a fullscreen lightbox automatically.
  // ──────────────────────────────────────────────────────────────

  content: `
<h2 id="overview">Overview</h2>
<p>Brief description of the challenge and what makes it interesting.</p>

<div class="callout flag">
  <div class="callout-label">Flag</div>
  <code>CTF{flag_goes_here}</code>
</div>

<h2 id="recon">Recon</h2>
<p>Your recon steps here.</p>

<div class="code-block">
  <div class="code-block-header">
    <span class="code-lang">bash</span>
    <button class="copy-btn" onclick="copyCode(this)">copy</button>
  </div>
  <pre><code>$ your command here</code></pre>
</div>

<h2 id="exploit">Exploit</h2>
<p>Exploitation details.</p>

<h2 id="flag">Flag</h2>
<div class="callout flag">
  <div class="callout-label">Flag</div>
  <code>CTF{flag_goes_here}</code>
</div>

<h2 id="conclusion">Conclusion</h2>
<p>What you learned.</p>
`,
};
