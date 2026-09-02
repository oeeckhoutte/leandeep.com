# Claude code with Private AI

- Canonical URL: https://leandeep.com/claude-code-with-private-ai/
- Author: Olivier Eeckhoutte
- Published: 2026-05-05T07:15:00Z
- Updated: 2026-05-05T07:15:00Z
- Language: fr
- Tags: AI, Machine Learning, Private AI, Agents, Claude
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



In this article we are going to see how to use Claude code with our own private models Gemma4, Qwen3, GPT OSS 120 or uncensored ones.


<br/>

## Prerequisites

* LM Studio installed wherever you want

<br/>

## Installation

**Install Claude Code**
```
curl -fsSL https://claude.ai/install.sh | bash
```

<br/>

**Configuration**

Create a new file under `~/.claude/lmstudio.private-ai-server.json` and add the following content:

```
{
  "env": {
    "ANTHROPIC_BASE_URL": "http://127.0.0.1:1234/",
    "ANTHROPIC_AUTH_TOKEN": "dummy",
    "API_TIMEOUT _MS": "3000000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1,
    "ANTHROPIC_MODEL": "default_model",
    "ANTHROPIC_SMALL_FAST_MODEL": "default_model",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "default_model",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "default_model",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "default_model"
  }
}
```

<br/>

## Test

Load a huge thinking Open Source model in LM Studio and set the context to the maximum limit. Then run the following command in your app repository `claude --settings ~/.claude/lmstudio.private-ai-server.json`. And finally select `default_model` using /model command after claude has started.

<br/>

Voila you can now burn millions of tokens without spending a dime. Of course it's not as fast as using Anthropic directly and not as good as using Opus 4.7 but for some non complex stuffs it's enough. Also with a good multi-agent setup you could let it work autonomously while you sleep. This idea makes me dream personally. More to come.
