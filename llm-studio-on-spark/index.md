# LLM studio on Spark

- Canonical URL: https://leandeep.com/llm-studio-on-spark/
- Author: Olivier Eeckhoutte
- Published: 2026-04-26T07:15:00Z
- Updated: 2026-04-26T07:15:00Z
- Language: fr
- Tags: AI, Machine Learning, Private AI
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



## Installation

```
curl -fsSL https://lmstudio.ai/install.sh | bash

curl -L -O https://raw.githubusercontent.com/lmstudio-ai/docs/main/_assets/nvidia-spark-playbook/bash/run.sh
# Or with Python
curl -L -O https://raw.githubusercontent.com/lmstudio-ai/docs/main/_assets/nvidia-spark-playbook/py/run.py

```

<br/>

## Download model

```
lms get openai/gpt-oss-120b
lms get qwen/qwen3.6-27b
```

<br/>

## Test

```
lms server start --bind 0.0.0.0 --port 1234

hostname -I
curl http://server_ip:1234/api/v1/models 

curl -LsSf https://astral.sh/uv/install.sh | sh
uv run --script run.py
```

<br/>

## Connect lms headless to LM Link network

On the server run:

```
lms login
lms link enable
```

<br/>

## Create a service

Create a file `/etc/systemd/system/lms.service` and add the content:

```
[Unit]
Description=LM Studio Server
After=network.target

[Service]
Type=simple
User=olivier
Environment=HOME=/home/olivier

ExecStart=/bin/bash -c '\
/home/olivier/.lmstudio/bin/lms daemon up && \
sleep 5 && \
tail -f /dev/null'

Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

<br/>

Then execute the following commands:

```
sudo systemctl daemon-reload
sudo systemctl enable lms
sudo systemctl start lms
```

<br/>

In case it does not work:

```
journalctl -u lms -f
sudo systemctl status lms
```
