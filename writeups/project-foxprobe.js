// ─────────────────────────────────────────────────────────────────
//  PROJECT: FoxProbe  —  writeups/project-foxprobe.js
// ─────────────────────────────────────────────────────────────────

const WRITEUP = {
  slug:        "project-foxprobe",
  title:       "FoxProbe — Network Traffic Analyzer",
  date:        "2025-03-18",
  type:        "project",
  language:    "C++ / Qt / libpcap",
  status:      "done",
  repo:        "https://github.com/OmniSecura/FoxProbe",
  tags:        ["programming"],
  description: "Desktop network inspection suite — live packet capture, protocol-aware decoding, anomaly detection (EWMA, entropy), TCP stream reconstruction and geo-mapping. Engineering thesis project.",

  toc: [
    { id: "about",      label: "About",               level: 2 },
    { id: "thesis",     label: "Engineering Thesis",  level: 2 },
    { id: "gallery",    label: "Screenshots",         level: 2 },
    { id: "features",   label: "Features",            level: 2 },
    { id: "detection",  label: "Anomaly Detection",   level: 3 },
    { id: "decoding",   label: "Protocol Decoding",   level: 3 },
    { id: "visual",     label: "Visual Context",      level: 3 },
    { id: "install",    label: "Getting Started",     level: 2 },
    { id: "usage",      label: "Operating FoxProbe",  level: 2 },
  ],

  content: `
<h2 id="about">About</h2>
<p>
  <strong>FoxProbe</strong> is a desktop network inspection suite that captures live traffic,
  enriches it with protocol awareness, and presents the results through a richly instrumented
  interface. Designed for analysts who need rapid feedback while troubleshooting, hunting
  anomalies, or studying how protocols behave on the wire.
</p>

<div class="callout tip">
  <div class="callout-label">Links</div>
  Repository: <a href="https://github.com/OmniSecura/FoxProbe" target="_blank">github.com/OmniSecura/FoxProbe</a>
  &nbsp;·&nbsp;
  Website: <a href="https://omnisecura.github.io/FoxProbeWebsite/" target="_blank">omnisecura.github.io/FoxProbeWebsite</a>
</div>

<h2 id="thesis">🎓 Engineering Thesis</h2>
<p>
  FoxProbe was built as my <strong>engineering thesis project</strong> — I defended it
  successfully and passed my degree with it. The full technical details, architecture
  decisions, protocol implementation notes, and evaluation methodology are documented
  in the thesis document. If you want a deep dive into how everything works under the
  hood, the thesis covers it all.
</p>

<div class="callout flag">
  <div class="callout-label">Result</div>
  Engineering degree — defended &amp; passed. ✓
</div>

<h2 id="gallery">Screenshots</h2>
<p>Six views from the application — click any screenshot to open fullscreen, use arrow keys to navigate.</p>

<div class="gallery" data-cols="2">

  <div class="gallery-item" data-caption="Main capture interface — live packet list with protocol coloring">
    <img src="images/foxprobe1.png" alt="FoxProbe main capture view">
  </div>

  <div class="gallery-item" data-caption="Protocol tree and hex/ASCII pane — full field inspection">
    <img src="images/foxprobe2.png" alt="FoxProbe protocol inspector">
  </div>

  <div class="gallery-item" data-caption="TCP/UDP stream reconstruction — bidirectional conversation timeline">
    <img src="images/foxprobe3.png" alt="FoxProbe stream follow">
  </div>

  <div class="gallery-item" data-caption="GeoMap — live traffic flows with animated flight paths">
    <img src="images/foxprobe4.png" alt="FoxProbe geomap">
  </div>

  <div class="gallery-item" data-caption="Protocol distribution — live pie chart and statistics">
    <img src="images/foxprobe5.png" alt="FoxProbe statistics">
  </div>

  <div class="gallery-item" data-caption="Session manager — stored PCAPs and historic traffic exploration">
    <img src="images/foxprobe6.png" alt="FoxProbe session manager">
  </div>

</div>

<h2 id="features">Features</h2>
<p>
  FoxProbe is built around a modular detection engine and a layer-aware decoder.
  Capture sessions run in a dedicated worker thread so the UI stays fully responsive
  during heavy traffic loads.
</p>

<ul>
  <li><strong>Live capture control</strong> — pick an interface, toggle promiscuous mode,
      apply BPF filters from the toolbar without interrupting the session</li>
  <li><strong>Layer-aware decoding</strong> — Ethernet II, Linux Cooked Capture, IPv4/IPv6,
      TCP/UDP, ICMP, VPN tunnels, MPLS, RSVP, PIM and more</li>
  <li><strong>Conversation reconstruction</strong> — follow TCP or UDP streams with
      bidirectional timelines, TCP flags, sequence numbers, and payload rendering</li>
  <li><strong>Visual context</strong> — live protocol pie charts and a geo-map with
      animated flight paths per flow</li>
  <li><strong>Coloring and annotations</strong> — rule-driven BPF-based highlighting,
      threat level tags, JSON report export</li>
  <li><strong>Session intelligence</strong> — persist PCAP files, statistics, and metadata
      for offline review</li>
</ul>

<h3 id="detection">Anomaly Detection</h3>
<p>
  The detection engine runs statistical analysis in real-time alongside the capture loop.
  Three complementary methods are combined to minimise false positives:
</p>

<ul>
  <li><strong>EWMA</strong> (Exponentially Weighted Moving Average) — smoothed baseline
      for traffic rate; deviations above a configurable threshold trigger an alert</li>
  <li><strong>Entropy analysis</strong> — Shannon entropy over IP destination distribution;
      sudden drops indicate scanning, sudden spikes indicate DDoS or exfiltration</li>
  <li><strong>PPS / BPS thresholds</strong> — hard rate limits per protocol that fire
      immediately on high-volume bursts regardless of baseline</li>
  <li><strong>Attack pattern matching</strong> — signature-based layer over the statistical
      engine for known attack shapes (SYN floods, port scans, ARP spoofing)</li>
</ul>

<h3 id="decoding">Protocol Decoding</h3>
<p>
  Every captured frame is parsed through a recursive decoder. The protocol tree widget
  exposes every decoded field with its offset, raw bytes, and interpreted value.
  The hex/ASCII pane syncs with tree selection so clicking a field highlights the
  exact bytes in the payload.
</p>

<div class="callout tip">
  <div class="callout-label">Supported protocols</div>
  Ethernet II · Linux SLL · IPv4 · IPv6 · TCP · UDP · ICMP · ICMPv6 ·
  ARP · DNS · HTTP · TLS · DHCP · MPLS · GRE · VPN tunnels · RSVP · PIM
</div>

<h3 id="visual">Visual Context</h3>
<p>
  Traffic is visualised through two live components updated on every capture tick:
</p>

<ul>
  <li><strong>Protocol distribution pie chart</strong> — shows share of each protocol
      by packet count or byte volume, updated in real time</li>
  <li><strong>GeoMap</strong> — embeds an OpenStreetMap-based world map, plots source
      and destination IPs with animated arcs showing flow direction and volume</li>
  <li><strong>Statistics dialogs</strong> — bar and line charts for historic sessions,
      geo-temporal exploration of stored traffic</li>
</ul>

<h2 id="install">Getting Started</h2>
<p>Requires a Qt toolchain, <code>libpcap</code> development headers, and GCC or Clang.</p>

<div class="code-block">
  <div class="code-block-header">
    <span class="code-lang">bash</span>
    <button class="copy-btn" onclick="copyCode(this)">copy</button>
  </div>
  <pre><code># Clone
$ git clone https://github.com/omnisecura/FoxProbe.git
$ cd FoxProbe

# Build (release)
$ qmake PacketSniffer.pro CONFIG+=release && make -j"$(nproc)"

# Run (root required for raw packet capture)
$ sudo ./PacketSniffer

# Clean build artifacts
$ make distclean</code></pre>
</div>

<h2 id="usage">Operating FoxProbe</h2>
<ol>
  <li>Launch the application and choose the capture interface from the toolbar dropdown.</li>
  <li>Optionally enter a BPF filter expression and enable promiscuous mode.</li>
  <li>Press <strong>Start</strong> — the session timer, packet counter, charts, and GeoMap update in real time.</li>
  <li>Select any packet to inspect decoded headers, payload bytes, and protocol-specific summaries in the tree pane.</li>
  <li>Use <strong>Follow Stream</strong> to reconstruct TCP/UDP conversations, or open the Statistics dialogs for charts and geo-overview.</li>
  <li>Save sessions via the session manager or export annotated selections as JSON reports from the reporting dialog.</li>
</ol>

<div class="callout tip">
  <div class="callout-label">Source layout</div>
  Core logic lives in <code>mainwindow_*</code>, <code>packets/</code>, <code>statistics/</code>,
  and <code>packetworker.cpp</code>. The modular detection engine makes it straightforward
  to add new protocol decoders or detection strategies.
</div>
`,
};
