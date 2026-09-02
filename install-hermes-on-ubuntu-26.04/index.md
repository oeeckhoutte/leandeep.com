# Install Hermes on Ubuntu 26.04

- Canonical URL: https://leandeep.com/install-hermes-on-ubuntu-26.04/
- Author: Olivier Eeckhoutte
- Published: 2026-05-17T22:15:00Z
- Updated: 2026-05-17T22:15:00Z
- Language: fr
- Tags: Machine Learning, AI, Agents
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



## Installation on Ubuntu 26.04

```
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash

# or update
# hermes update
```

<br/>

For the Inference Provider I used `lm studio`. 
- Enter your LM_API_KEY
- Enter your server IP (example: http://192.168.1.234:1234/v1)
- Select the LM server model you want to use


<br/>

Once fully installed execute:

```
source ~/.bashrc
hermes
```

<br/>

Ask the available skills installed by default.

```
● Which skills are available ?
```

Answer:

    I have access to a wide range of skills (abilities) designed to handle various tasks. Here's a list of the skill categories and some examples within each:

    1. Autonomous AI Agents
        - claude-code: Delegate coding to Claude Code CLI.
        - codex: Delegate coding to OpenAI Codex CLI.
        - hermes-agent: Configure, extend, or contribute to Hermes Agent.
        - opencode: Delegate coding to OpenCode CLI.

    2. Creative
        - architecture-diagram: Dark-themed SVG architecture/cloud/infra diagrams as HTML.
        - ascii-art: ASCII art: pyfiglet, cowsay, boxes, image-to-ascii.
        - ascii-video: ASCII video: convert video/audio to colored ASCII MP4/GIF.
        - baoyu-comic: Knowledge comics (educational, biography, tutorial).
        - baoyu-infographic: Infographics with 21 layouts x 21 styles.
        - claude-design: Design one-off HTML artifacts (landing, deck, prototype).
        - comfyui: Generate images, video, and audio with ComfyUI.
        - design-md: Author/validate/export Google's DESIGN.md token spec files.
        - excalidraw: Hand-drawn Excalidraw JSON diagrams (arch, flow, seq).
        - humanizer: Humanize text: strip AI-isms and add real voice.
        - ideation: Generate project ideas via creative constraints.
        - manim-video: Manim CE animations: 3Blue1Brown math/algo videos.
        - p5js: p5.js sketches: gen art, shaders, interactive, 3D.
        - pixel-art: Pixel art w/ era palettes (NES, Game Boy, PICO-8).
        - popular-web-designs: 54 real design systems (Stripe, Linear, Vercel) as HTML/CSS.
        - pretext: Create browser demos with @chenglou/pretext — DOM-free text layout.
        - sketch: Throwaway HTML mockups: 2-3 design variants to compare.
        - songwriting-and-ai-music: Songwriting craft and Suno AI music prompts.
        - touchdesigner-mcp: Control a running TouchDesigner instance via twozero MCP.

    3. Data Science
        - jupyter-live-kernel: Iterative Python via live Jupyter kernel (hamelnb).

    4. DevOps
        - kanban-orchestrator: Decomposition playbook + anti-temptation rules for orchestrating work through Kanban.
        - kanban-worker: Pitfalls, examples, and edge cases for Hermes Kanban workers.
        - webhook-subscriptions: Webhook subscriptions: event-driven agent runs.

    5. Email
        - himalaya: Himalaya CLI: IMAP/SMTP email from terminal.

    6. Gaming
        - minecraft-modpack-server: Host modded Minecraft servers (CurseForge, Modrinth).
        - pokemon-player: Play Pokemon via headless emulator + RAM reads.

    7. GitHub
        - codebase-inspection: Inspect codebases w/ pygount: LOC, languages, ratios.
        - github-auth: GitHub auth setup: HTTPS tokens, SSH keys, gh CLI login.
        - github-code-review: Review PRs: diffs, inline comments via gh or REST.
        - github-issues: Create, triage, label, assign GitHub issues via gh or REST.
        - github-pr-workflow: GitHub PR lifecycle: branch, commit, open, CI, merge.
        - github-repo-management: Clone/create/fork repos; manage remotes, releases.

    8. MCP
        - native-mcp: MCP client: connect servers, register tools (stdio/HTTP).

    9. Media
        - gif-search: Search/download GIFs from Tenor via curl + jq.
        - heartmula: HeartMuLa: Suno-like song generation from lyrics + tags.
        - songsee: Audio spectrograms/features (mel, chroma, MFCC) via CLI.
        - spotify: Spotify: play, search, queue, manage playlists and devices.
        - youtube-content: YouTube transcripts to summaries, threads, blogs.

    10. MLOps
        - audiocraft-audio-generation: AudioCraft: MusicGen text-to-music, AudioGen text-to-sound.
        - dspy: DSPy: declarative LM programs, auto-optimize prompts, RAG.
        - evaluating-llms-harness: lm-eval-harness: benchmark LLMs (MMLU, GSM8K, etc.).
        - huggingface-hub: HuggingFace hf CLI: search/download/upload models, datasets.
        - llama-cpp: llama.cpp local GGUF inference + HF Hub model discovery.
        - obliteratus: OBLITERATUS: abliterate LLM refusals (diff-in-means).
        - segment-anything-model: SAM: zero-shot image segmentation via points, boxes, masks.
        - serving-llms-vllm: vLLM: high-throughput LLM serving, OpenAI API, quantization.
        - weights-and-biases: W&B: log ML experiments, sweeps, model registry, dashboards.

    11. Note-taking
        - obsidian: Read, search, create, and edit notes in the Obsidian vault.

    12. Productivity
        - airtable: Airtable REST API via curl. Records CRUD, filters, upserts.
        - google-workspace: Gmail, Calendar, Drive, Docs, Sheets via gws CLI or Python.
        - linear: Linear: manage issues, projects, teams via GraphQL + curl.
        - maps: Geocode, POIs, routes, timezones via OpenStreetMap/OSRM.
        - nano-pdf: Edit PDF text/typos/titles via nano-pdf CLI (NL prompts).
        - notion: Notion API + ntn CLI: pages, databases, markdown, Workers.
        - ocr-and-documents: Extract text from PDFs/scans (pymupdf, marker-pdf).
        - powerpoint: Create, read, edit .pptx decks, slides, notes, templates.
        - teams-meeting-pipeline: Operate the Teams meeting summary pipeline via Hermes CLI.

    13. Red-teaming
        - godmode: Jailbreak LLMs: Parseltongue, GODMODE, ULTRAPLINIAN.

    14. Research
        - arxiv: Search arXiv papers by keyword, author, category, or ID.
        - blogwatcher: Monitor blogs and RSS/Atom feeds via blogwatcher-cli tool.
        - llm-wiki: Karpathy's LLM Wiki: build/query interlinked markdown KB.
        - polymarket: Query Polymarket: markets, prices, orderbooks, history.
        - research-paper-writing: Write ML papers for NeurIPS/ICML/ICLR: design→submit.

    15. Smart Home
        - openhue: Control Philips Hue lights, scenes, rooms via OpenHue CLI.

    16. Social Media
        - xurl: X/Twitter via xurl CLI: post, search, DM, media, v2 API.

    17. Software Development
        - debugging-hermes-tui-commands: Debug Hermes TUI slash commands: Python, gateway, Ink UI.
        - hermes-agent-skill-authoring: Author in-repo SKILL.md: frontmatter, validator, structure.
        - node-inspect-debugger: Debug Node.js via --inspect + Chrome DevTools Protocol CLI.
        - plan: Plan mode: write markdown plan to .hermes/plans/, no exec.
        - python-debugpy: Debug Python: pdb REPL + debugpy remote (DAP).
        - requesting-code-review: Pre-commit review: security scan, quality gates, auto-fix.
        - spike: Throwaway experiments to validate an idea before build.
        - subagent-driven-development: Execute plans via delegate_task subagents (2-stage review).
        - systematic-debugging: 4-phase root cause debugging: understand bugs before fixing.
        - test-driven-development: TDD: enforce RED-GREEN-REFACTOR, tests before code.
        - writing-plans: Write implementation plans: bite-sized tasks, paths, code.


<br/>

## Install Composio

Open a chat `hermes` and just enter

```
Set up Composio from composio.dev/hermes
Is composio installed ?

# Or 
# curl -fsSL https://composio.dev/install | bash
```

<br/>

## Run dashboard

Edit `~/.hermes/.env` and add the following env var:
```
export HERMES_DASHBOARD_SESSION_TOKEN=your-long-random-token-here
```
Then run:
```
hermes dashboard --host 0.0.0.0 --port 9119 --insecure --no-open --skip-build
```


