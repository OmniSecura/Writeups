const WRITEUP = {
  slug:        "thm-compiled",
  title:       "TryHackMe — Compiled",
  date:        "2026-03-19",
  platform:    "TryHackMe",
  os:          "Linux",
  difficulty:  "easy",
  tags:        ["rev"],
  description: "5 Minute Hacks series — reverse engineering a compiled binary with Ghidra. Analysing scanf format string behaviour to recover the correct password.",
 
  toc: [
    { id: "overview",    label: "Overview",          level: 2 },
    { id: "recon",       label: "Recon",             level: 2 },
    { id: "ghidra",      label: "Ghidra Decompile",  level: 2 },
    { id: "analysis",    label: "Code Analysis",     level: 2 },
    { id: "scanf",       label: "scanf Format",      level: 3 },
    { id: "solution",    label: "Solution",          level: 2 },
  ],
 
  content: `
<h2 id="overview">Overview</h2>
<p>
  Compiled is an easy challenge from TryHackMe's <em>5 Minute Hacks</em> series.
  We are given a single compiled binary — <code>Compiled.Compiled</code> — and the
  goal is to find the correct password. Since the AttackBox environment wouldn't run
  the binary directly, we skip dynamic analysis entirely and go straight to static
  reverse engineering with Ghidra.
</p>
 
<div class="callout tip">
  <div class="callout-label">Approach</div>
  No execution needed — full static analysis in Ghidra is enough to recover the password
  just by reading the decompiled logic.
</div>
 
<h2 id="recon">Recon</h2>
<p>
  We receive a single file: <code>Compiled.Compiled</code>. Before doing anything else
  it is worth confirming what we are dealing with.
</p>
 
<div class="code-block">
  <div class="code-block-header">
    <span class="code-lang">bash</span>
    <button class="copy-btn" onclick="copyCode(this)">copy</button>
  </div>
  <pre><code>$ file Compiled.Compiled
Compiled.Compiled: ELF 64-bit LSB executable, x86-64, dynamically linked
 
$ checksec --file=Compiled.Compiled
    Arch:    amd64-64-little
    RELRO:   Partial RELRO
    Stack:   No canary found
    NX:      NX enabled
    PIE:     No PIE (0x400000)</code></pre>
</div>
 
<p>
  A standard 64-bit Linux ELF. No PIE, no stack canary — but we are not exploiting
  anything here, just reading the logic. Time to open it in Ghidra.
</p>
 
<h2 id="ghidra">Ghidra Decompile</h2>
<p>
  After importing the binary into Ghidra and letting the auto-analysis run, we navigate
  to the <code>main</code> function. The decompiler produces clean, readable output
  straight away — no obfuscation, no packing.
</p>
 
<div class="code-block">
  <div class="code-block-header">
    <span class="code-lang">c</span>
    <button class="copy-btn" onclick="copyCode(this)">copy</button>
  </div>
  <pre><code>undefined8 main(void)
 
{
  int iVar1;
  char local_28 [32];
  
  fwrite("Password: ",1,10,stdout);
  __isoc99_scanf("DoYouEven%sCTF",local_28);
  iVar1 = strcmp(local_28,"__dso_handle");
  if ((-1 < iVar1) && (iVar1 = strcmp(local_28,"__dso_handle"), iVar1 < 1)) {
    printf("Try again!");
    return 0;
  }
  iVar1 = strcmp(local_28,"_init");
  if (iVar1 == 0) {
    printf("Correct!");
  }
  else {
    printf("Try again!");
  }
  return 0;
}</code></pre>
</div>
 
<h2 id="analysis">Code Analysis</h2>
<p>
  The logic is short — let's walk through it step by step.
</p>
 
<p>
  The program prints <code>Password: </code> and then reads user input using a custom
  <code>scanf</code> format string. Whatever the user types gets stored in the
  <code>local_28</code> buffer. The program then performs two comparisons to decide
  whether to print <code>Correct!</code> or <code>Try again!</code>.
</p>
 
<p>
  The <strong>first comparison</strong> checks if <code>local_28</code> equals
  <code>__dso_handle</code>. If it does — and only if it does — the program exits early
  with <code>Try again!</code>. This is essentially a blocklist of one entry, making sure
  that particular string is never accepted as the correct answer even though it would
  otherwise satisfy the second check's range condition.
</p>
 
<p>
  The <strong>second comparison</strong> is what we care about:
  <code>strcmp(local_28, "_init")</code>. If the stored input exactly matches
  <code>_init</code>, the program prints <code>Correct!</code>. That is our target.
</p>
 
<h3 id="scanf">Understanding the scanf format string</h3>
<p>
  The non-standard format string passed to <code>scanf</code> is what makes this interesting:
</p>
 
<div class="code-block">
  <div class="code-block-header">
    <span class="code-lang">c</span>
    <button class="copy-btn" onclick="copyCode(this)">copy</button>
  </div>
  <pre><code>__isoc99_scanf("DoYouEven%sCTF", local_28);</code></pre>
</div>
 
<p>
  <code>scanf</code> processes this format string in order, left to right:
</p>
 
<ol>
  <li>The literal <code>DoYouEven</code> must appear at the start of the input — scanf
      matches and <strong>consumes</strong> it from the input stream.</li>
  <li><code>%s</code> reads a string token into <code>local_28</code>, stopping only
      at <strong>whitespace</strong>. It is greedy — it reads everything that is not
      a space, tab, or newline.</li>
  <li>The literal <code>CTF</code> at the end of the format tells scanf to try to
      match and consume those three characters from whatever is left in the input.
      If there is nothing left, scanf simply stops — it does <strong>not</strong>
      cause the call to fail or affect what was already stored.</li>
</ol>
 
<p>
  This is the key point: <code>CTF</code> in the format string is <strong>not a
  terminator</strong> for <code>%s</code>. It is a literal that scanf attempts to
  match <em>after</em> <code>%s</code> has already finished reading. Since
  <code>%s</code> reads until whitespace — not until <code>CTF</code> — it has
  no idea that <code>CTF</code> even exists in the format.
</p>
 
<table>
  <thead>
    <tr><th>Input</th><th>%s reads into local_28</th><th>strcmp result</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><code>DoYouEven_init</code></td>
      <td><code>_init</code> — stops at end of input</td>
      <td style="color:var(--accent)">✓ match</td>
    </tr>
    <tr>
      <td><code>DoYouEven_initCTF</code></td>
      <td><code>_initCTF</code> — no whitespace, reads it all</td>
      <td style="color:#ff6b6b">✗ no match</td>
    </tr>
    <tr>
      <td><code>DoYouEven_init CTF</code></td>
      <td><code>_init</code> — stops at the space</td>
      <td style="color:var(--accent)">✓ match</td>
    </tr>
  </tbody>
</table>
 
<div class="callout warn">
  <div class="callout-label">Common misconception</div>
  It is tempting to read <code>"DoYouEven%sCTF"</code> and think that <code>CTF</code>
  acts as a delimiter — that scanf will capture everything <em>between</em>
  <code>DoYouEven</code> and <code>CTF</code>. This is not how it works.
  <code>%s</code> stops at <strong>whitespace only</strong>, completely ignoring any
  literals that follow it in the format string.
</div>
 
<h2 id="solution">Solution</h2>
<p>
  We need <code>local_28</code> to hold exactly <code>_init</code>. Since
  <code>DoYouEven</code> is consumed as a literal prefix and <code>%s</code> reads
  greedily until whitespace, the correct input is just <code>DoYouEven_init</code>
  — nothing more. Adding <code>CTF</code> at the end would cause <code>%s</code> to
  swallow it too, storing <code>_initCTF</code> and failing the comparison.
</p>
 
<div class="code-block">
  <div class="code-block-header">
    <span class="code-lang">bash</span>
    <button class="copy-btn" onclick="copyCode(this)">copy</button>
  </div>
  <pre><code>Password: DoYouEven_init
 
Correct!</code></pre>
</div>
 
<div class="callout flag">
  <div class="callout-label">Password</div>
  <code>DoYouEven_init</code>
</div>
 
<p>
  <code>DoYouEven</code> is consumed by the format literal, <code>%s</code> reads
  <code>_init</code> into <code>local_28</code>, and
  <code>strcmp(local_28, "_init")</code> returns zero — printing <code>Correct!</code>.
  The trailing <code>CTF</code> in the format string never matters here because there
  is nothing left in the input for it to match against.
</p>
`,
};