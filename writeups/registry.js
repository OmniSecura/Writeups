// ─────────────────────────────────────────────────────────────────
//  WRITEUP REGISTRY  —  writeups/registry.js
// ─────────────────────────────────────────────────────────────────
const WRITEUP_REGISTRY = [

  // ── PROJECTS ────────────────────────────────────────────────
  {
    slug:        "project-foxprobe",
    title:       "FoxProbe — Network Traffic Analyzer",
    date:        "2025-03-18",
    type:        "project",
    language:    "C++ / Qt / libpcap",
    status:      "done",
    repo:        "https://github.com/OmniSecura/FoxProbe",
    tags:        ["programming"],
    description: "Desktop network inspection suite — live packet capture, protocol decoding, EWMA/entropy anomaly detection, TCP stream reconstruction, geo-mapping. Engineering thesis project.",
  },

  {
    slug:        "project-pocketcoach",
    title:       "PocketCoach",
    date:        "2025-03-18",
    type:        "project",
    language:    "Python / React / ML",
    status:      "wip",
    repo:        "https://github.com/Bartek-Mal/PocketCoach",
    tags:        ["programming"],
    description: "AI fitness web app — pose estimation, exercise form analysis, body proportions from photos, diet tracking and social feed. FastAPI + React.",
  },
  {
    slug:        "thm-lookup",
    title:       "TryHackMe — Lookup",
    date:        "2026-03-19",
    platform:    "TryHackMe",
    os:          "Linux",
    difficulty:  "easy",
    tags:        ["web", "pwn"],
    description: "Username enumeration via differential error messages, elFinder RCE (CVE-2019-9194), PATH hijacking to extract credentials, sudo look GTFOBins privesc to root.",
  },
  {
    slug:        "thm-compiled",
    title:       "TryHackMe — Compiled",
    date:        "2026-03-19",
    platform:    "TryHackMe",
    os:          "Linux",
    difficulty:  "easy",
    tags:        ["rev"],
    description: "5 Minute Hacks series — reverse engineering a compiled binary with Ghidra. Analysing scanf format string behaviour to recover the correct password.",
  },
  {
    slug:        "thm-cupids-matchmaker",
    title:       "TryHackMe — Cupid's Matchmaker",
    date:        "2026-03-21",
    platform:    "TryHackMe",
    os:          "Linux",
    difficulty:  "easy",
    tags:        ["web"],
    description: "Stored XSS via a survey form — cookie-stealing payload executed by an admin viewing submissions, flag leaked via a local HTTP listener.",
  },
];
