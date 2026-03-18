// ─────────────────────────────────────────────────────────────────
//  PROJECT: PocketCoach  —  writeups/project-pocketcoach.js
//
//  Wideo z GitHub Assets są osadzone przez natywny <video> tag.
//  Format URL: https://github.com/user-attachments/assets/<ID>
//
//  Jeśli wrzucisz filmy na YouTube, zamień gallery-item na:
//    <div class="gallery-item" data-caption="..." data-yt="YOUTUBE_ID">
//      <img src="images/thumb.jpg" alt="thumbnail">
//    </div>
// ─────────────────────────────────────────────────────────────────

const WRITEUP = {
  slug:        "project-pocketcoach",
  title:       "PocketCoach",
  date:        "2025-03-18",
  type:        "project",
  language:    "Python / React / ML",
  status:      "wip",
  repo:        "https://github.com/OmniSecura/Pocket-Coach-showcase",
  tags:        ["programming"],
  description: "AI fitness web app — pose estimation, exercise form analysis, body proportions from photos, diet tracking and social feed. FastAPI + React.",

  toc: [
    { id: "about",      label: "About",              level: 2 },
    { id: "stack",      label: "Tech Stack",         level: 2 },
    { id: "auth",       label: "Register & Login",   level: 2 },
    { id: "feed",       label: "Social Feed",        level: 2 },
    { id: "exercises",  label: "Exercises",          level: 2 },
    { id: "body",       label: "Body Proportions",   level: 2 },
    { id: "assessment", label: "Self Assessment",    level: 2 },
    { id: "analysis",   label: "Exercise Analysis",  level: 2 },
    { id: "diet",       label: "Diet Tracker",       level: 2 },
    { id: "recipes",    label: "Recipes",            level: 2 },
    { id: "roadmap",    label: "Roadmap",            level: 2 },
    { id: "contact",    label: "Contact",            level: 2 },
  ],

  content: `
<h2 id="about">About</h2>
<p>
  <strong>PocketCoach</strong> is an advanced fitness web application combining
  <em>machine learning</em>, <em>computer vision</em>, and modern web technologies
  to help users improve training quality, track progress, and manage nutrition —
  all in one platform.
</p>

<div class="callout tip">
  <div class="callout-label">Highlights</div>
  AI exercise form analysis &nbsp;·&nbsp;
  Body proportions from a photo &nbsp;·&nbsp;
  Social feed with posts &amp; comments &nbsp;·&nbsp;
  Diet &amp; macro tracking &nbsp;·&nbsp;
  200+ exercise database
</div>

<h2 id="stack">Tech Stack</h2>

<table>
  <thead>
    <tr><th>Layer</th><th>Technology</th><th>Role</th></tr>
  </thead>
  <tbody>
    <tr><td>Backend</td><td>Python — FastAPI</td><td>REST API, ML inference, auth, media handling</td></tr>
    <tr><td>Frontend</td><td>React</td><td>SPA, all UI pages, real-time feedback</td></tr>
    <tr><td>ML / CV</td><td>Pose estimation models</td><td>Body proportions, movement recognition, rep classification</td></tr>
    <tr><td>Storage</td><td>Cloud (S3-compatible)</td><td>Secure image &amp; video storage with pre-upload validation</td></tr>
    <tr><td>Auth</td><td>JWT + passphrase system</td><td>Optional 4-word passphrase required on every login</td></tr>
  </tbody>
</table>

<h2 id="auth">🔐 Register &amp; Login</h2>
<p>
  The authentication system is built with security as a first-class concern.
  Beyond standard login it supports an optional <strong>passphrase system</strong>
  — four custom words defined by the user, required at every login if enabled.
  Strong password policy with complexity validation and brute-force protection
  is enforced throughout.
</p>

<ul>
  <li>Standard email + password registration</li>
  <li>Strong password policy — length, complexity, validation</li>
  <li>Optional passphrase: four custom words, required on every login if set</li>
  <li>Protection against weak credentials and brute-force attempts</li>
</ul>

<div class="gallery" data-cols="1">
  <div class="gallery-item" data-caption="Register &amp; Login — demo">
    <video src="https://github.com/user-attachments/assets/9713f605-1297-4adc-90b2-bb50b040589b"></video>
  </div>
</div>

<h2 id="feed">🏠 Home / Social Feed</h2>
<p>
  The home page acts as a social hub — a randomized, infinitely-scrolling feed of posts
  from all users. Create posts with images and videos, like and comment on others'
  content. All uploaded media is validated and securely stored in the cloud.
</p>

<ul>
  <li>Randomized post layout with infinite scroll</li>
  <li>Post creation with image &amp; video upload</li>
  <li>Like system on posts and comments</li>
  <li>Commenting and browsing</li>
  <li>Secure cloud media storage with pre-upload validation</li>
</ul>

<div class="gallery" data-cols="1">
  <div class="gallery-item" data-caption="Home / Social Feed — demo">
    <video src="https://github.com/user-attachments/assets/f6bcc2b7-12e2-407e-93a7-630ab7967c4b"></video>
  </div>
</div>

<h2 id="exercises">🏋️ Exercises</h2>
<p>
  A comprehensive exercise database with over <strong>200 exercises</strong>,
  each with a demo video, target muscle groups, execution instructions, tips,
  and common mistakes. Users can filter, search, like favourites, and create
  fully custom exercises with their own videos and descriptions.
</p>

<ul>
  <li>200+ exercises with video demonstrations</li>
  <li>Per-exercise: target muscles, type, instructions, tips, common mistakes</li>
  <li>Full-text search and multi-filter browsing</li>
  <li>Like and save favourite exercises</li>
  <li>Create custom exercises — own video, image, description</li>
</ul>

<div class="gallery" data-cols="1">
  <div class="gallery-item" data-caption="Exercises database — demo">
    <video src="https://github.com/user-attachments/assets/86df65b2-acc1-48e5-a200-cb9ee83cbf03"></video>
  </div>
</div>

<h2 id="body">📐 Body Proportions</h2>
<p>
  Part of the user profile. A machine learning model estimates body proportions
  from a single user-uploaded photo — no manual measuring needed. The calculated
  values are then used to <strong>personalize exercise form analysis</strong>
  for each user's specific build and proportions.
</p>

<ul>
  <li>Basic: height, weight, BMI</li>
  <li>ML-estimated: torso, arm, leg length · shoulder &amp; hip width</li>
  <li>Ratios and proportions calculated automatically</li>
  <li>Values feed into the exercise analysis engine for personalised feedback</li>
</ul>

<div class="gallery" data-cols="1">
  <div class="gallery-item" data-caption="Body Proportions ML estimation — demo">
    <video src="https://github.com/user-attachments/assets/a873d0f6-e8b2-4267-b89e-f3adc325e5f1"></video>
  </div>
</div>

<h2 id="assessment">📝 Self Assessment</h2>
<p>
  A structured self-assessment tool for tracking personal records and evaluating
  physical fitness across multiple dimensions. Data collected here feeds into
  long-term progress reports and, in the future, personalised trainer recommendations.
</p>

<ul>
  <li>Personal records storage per exercise</li>
  <li>Questionnaires: mobility, endurance, strength balance, stability</li>
  <li>Long-term progress tracking</li>
  <li>Designed for future trainer integration</li>
</ul>

<div class="gallery" data-cols="1">
  <div class="gallery-item" data-caption="Self Assessment — demo">
    <video src="https://github.com/user-attachments/assets/e1e4cd11-5b93-4f2c-a76f-0d99dc06c691"></video>
  </div>
</div>

<h2 id="analysis">🎥 Exercise Analysis</h2>
<p>
  The core feature of PocketCoach. Upload a video of yourself performing an exercise,
  select the exercise type, and the ML pipeline does the rest — detecting movement
  patterns, splitting the footage into individual reps, and classifying each one
  as correct or incorrect with detailed feedback on what to fix.
</p>

<ul>
  <li>Upload any exercise video — processed fully automatically</li>
  <li>ML detects movement patterns and splits into individual reps</li>
  <li>Each rep classified: <strong style="color:var(--accent)">correct</strong> / <strong style="color:#ff6b6b">incorrect</strong></li>
  <li>Detailed mistake detection with improvement suggestions</li>
  <li>Repetition counter and overall accuracy percentage</li>
  <li>Interactive timeline — clickable correct / incorrect timestamps</li>
</ul>

<div class="gallery" data-cols="1">
  <div class="gallery-item" data-caption="Exercise Analysis — AI rep classification demo">
    <video src="https://github.com/user-attachments/assets/4b69b8fe-5126-4703-ad98-5aebab3443ad"></video>
  </div>
</div>

<div class="callout warn">
  <div class="callout-label">How it works</div>
  The model first runs pose estimation frame-by-frame to extract joint positions.
  A second model then classifies the movement phase sequence per rep using
  pattern recognition trained on correct and incorrect technique examples.
  Body proportion data from the profile is used to normalise measurements.
</div>

<h2 id="diet">🥗 Diet Tracker</h2>
<p>
  A full nutrition management system. Daily calorie targets are calculated
  automatically based on user goals. Each day is tracked separately with
  meal logging, barcode scanning, macro tracking, and recipe integration
  for quick meal creation.
</p>

<ul>
  <li>Automatic daily calorie target based on goals</li>
  <li>Macro tracking — protein, fats, carbohydrates</li>
  <li>Daily history with per-day breakdown</li>
  <li>Add meals: manually, barcode scan, favourites, or from recipes</li>
  <li>Each day tracked independently</li>
</ul>

<div class="gallery" data-cols="1">
  <div class="gallery-item" data-caption="Diet Tracker — demo">
    <video src="https://github.com/user-attachments/assets/acb57dec-84db-4e82-be0b-27b60fcbcac7"></video>
  </div>
</div>

<h2 id="recipes">📖 Recipes</h2>
<p>
  A recipe management system tightly integrated with the diet tracker.
  Browse, filter, and save recipes — or create your own. Each recipe shows
  ingredients, preparation steps, calories and a full macro breakdown.
  Adding any recipe as a meal to today's log takes one click.
</p>

<ul>
  <li>Full recipe browser with search</li>
  <li>Per-recipe: ingredients, steps, calories, macros</li>
  <li>Create and save custom recipes</li>
  <li>Like and bookmark favourites</li>
  <li>Advanced filters: diet type, calories, macros, ingredients, preferences</li>
  <li>One-click add to diet tracker</li>
</ul>

<div class="gallery" data-cols="1">
  <div class="gallery-item" data-caption="Recipes — demo">
    <video src="https://github.com/user-attachments/assets/1bfddc7f-ccca-4324-b938-4b94868e4b39"></video>
  </div>
</div>

<h2 id="roadmap">Roadmap</h2>

<table>
  <thead>
    <tr><th>Feature</th><th>Status</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td>Exercise form analysis (ML)</td><td style="color:var(--accent)">✓ done</td><td>Rep-by-rep classification with detailed feedback</td></tr>
    <tr><td>Body proportions estimation</td><td style="color:var(--accent)">✓ done</td><td>Photo → measurements via pose estimation model</td></tr>
    <tr><td>Social feed + media upload</td><td style="color:var(--accent)">✓ done</td><td>Posts, likes, comments, secure cloud storage</td></tr>
    <tr><td>Exercise database (200+)</td><td style="color:var(--accent)">✓ done</td><td>Video demos, filters, custom exercise creation</td></tr>
    <tr><td>Diet tracker + recipes</td><td style="color:var(--accent)">✓ done</td><td>Macros, barcode scan, recipe integration</td></tr>
    <tr><td>Self assessment tools</td><td style="color:var(--accent)">✓ done</td><td>PRs, questionnaires, progress tracking</td></tr>
    <tr><td>AI-judged competitions</td><td style="color:var(--muted)">○ planned</td><td>Community contests with AI rep verdict + community voting system</td></tr>
    <tr><td>Trainer chat + video calls</td><td style="color:var(--muted)">○ planned</td><td>Built-in messaging and live session support</td></tr>
    <tr><td>Trainer marketplace</td><td style="color:var(--muted)">○ planned</td><td>Trainer profiles, coaching offers, availability &amp; pricing</td></tr>
    <tr><td>Trainer panel</td><td style="color:var(--muted)">○ planned</td><td>Full access to trainee profiles, analysis results, progress stats</td></tr>
  </tbody>
</table>

<h2 id="contact">Contact</h2>

<table>
  <thead>
    <tr><th>Platform</th><th>Link</th></tr>
  </thead>
  <tbody>
    <tr><td>Email</td><td><a href="mailto:bartosz.malujda@gmail.com">bartosz.malujda@gmail.com</a></td></tr>
    <tr><td>LinkedIn</td><td><a href="https://www.linkedin.com/in/bartosz-malujda-2a3079306/" target="_blank">Bartosz Malujda</a></td></tr>
    <tr><td>GitHub</td><td><a href="https://github.com/Bartek-Mal" target="_blank">github.com/Bartek-Mal</a></td></tr>
  </tbody>
</table>
`,
};
