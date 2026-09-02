# Openclaw on Kali Linux

- Canonical URL: https://leandeep.com/openclaw-on-kali-linux/
- Author: Olivier Eeckhoutte
- Published: 2026-04-20T19:15:00Z
- Updated: 2026-04-20T19:15:00Z
- Language: fr
- Tags: OpenClaw, AI, Kali, LLM, Machine Learning
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



## Prepare Kali

**Setup SSH**
```
sudo apt update
sudo apt install -y openssh-server vim

# uncomment line with ListenAddress 0.0.0.0
sudo vim /etc/ssh/sshd_config

sudo systemctl start ssh
sudo systemctl enable ssh

ip a
```

<br/>

## Install Openclaw on Kali Linux

> For this setup I isolated Kali in a VM. So it's a dedicated host with dedicated VM. Here are the commands to manage the hypervisor. I used Virtualbox but you can use faster ones ofc like firecracker. In my case I wanted super simplicity.

<br/>

**Manage VM**
```
# List VMs
VBoxManage list vms

# Start VM
VBoxManage startvm "kali openclaw"  --type headless

# Stop VM
VBoxManage controlvm "kali openclaw" acpipowerbutton

# Force stop VM
VBoxManage controlvm "kali openclaw" poweroff

# Get IP
VBoxManage guestproperty get "kali openclaw" "/VirtualBox/GuestInfo/Net/0/V4/IP"

# Get the VM IP "the hard way"
nmap -sn 192.168.1.0/24 # OR arp -a

# Clone VM
VBoxManage clonevm "kali openclaw Backup setup OK" --name "kali openclaw" --mode all --register

# Delete a VM
VBoxManage list runningvms
VBoxManage controlvm "kali openclaw" poweroff
VBoxManage unregistervm "kali openclaw" --delete
```

<br/>

**Setup Openclaw**

```
# node 24 needed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

<br/>

Add in the `~/.zshrc` and source it
```
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

<br/>

```
nvm list-remote
nvm install v24.14.1
nvm use v24.14.1
nvm use default v24.14.1
npm install -g openclaw@v2026.4.15
```

<br/>

## OpenClaw Configuration

```
openclaw onboard --install-daemon

# I understand this is personal-by-default and shared/multi-user use requires lock-down. Continue?
Yes

# Setup mode
Manual

# What do you want to set up?
Local gateway

# Workspace directory
Keep default

# Model/auth provider
OpenRouter -> openrouter/openai/gpt-4o-mini

# Gateway port
Custom

# Gateway bind
Loopback

# Gateway auth
Token

# Tailscale
Off

# How do you want to provide the gateway token?
Generate/store plaintext token (Default)

# Gateway token (blank to generate)
blank

# Configure chat channels now?
Yes

# Select a channel
Telegram

# Create a bot using @BotFather
# Get the bot token

# Configure DM access policies now? (default: pairing)
Yes Pairing

# Telegram DM policy
Allowlist (specific users only)

# Telegram allowFrom
Enter your username ID -> Get my user ID -> Via @UserInfoBot

# Search provider
skip for now

# Plugins
skip for now

# Skills
skip for now

# Enable hooks?
Select all

# Gateway service runtime
Node

# Enable zsh shell completion for openclaw?
Yes
```


<br/>

## Test

```
openclaw dashboard
openclaw tui
```

<br/>

## Quickly change API key, model, network config

Edit `vim ~/.openclaw/openclaw.json` and restart:
```
# Restrict access to 192.168.1.0/24 or only one host
systemctl --user restart openclaw-gateway.service
```

> If needed for the firewall
> ```
> sudo ufw allow 18789 # or custom port
> # Or authorise the LAN: sudo ufw allow from 192.168.1.0/24 to any port 18789
> # refuse the rest: sudo ufw deny 18789
> sudo ufw disable # for quick test
> ```

<br/>

## Troubleshooting

```
systemctl --user status openclaw-gateway.service
systemctl --user restart openclaw-gateway.service
tail -f /tmp/openclaw/...log
DEBUG=agent,llm,openrouter npx openclaw tui

Issue I had and manual fix applied:
https://github.com/openclaw/openclaw/issues/68076#issuecomment-4267446040
```

<br/>

## Restart setup

```
rm -rf ~/.npm/_npx
rm -rf ~/.openclaw
# Or trash your VM
```

<br/>

## Output once running


```
hi

HEARTBEAT_OK

comment vas-tu ?

Je vais bien, merci ! Et toi ? Comment ça se passe ?
 gateway connected | idle
 agent main | session main (openclaw-tui) | openrouter/openai/gpt-4o-mini | tokens 12k/200k (6%)
──────────────────────────────────────────────────────────────────────────────────────────────────
```


<br/>

## Conclusion

This product is not yet ready for production, but it's interesting to explore it as it's one starting point for building agents. I plan to use it to replace expensive services with local, private AI.

It will also allow me to automate certain everyday tasks, like an assistant that doesn’t send all my data to the cloud.

In a future article, we’ll look at how to leverage these skills alongside Kali tools to automate security audits. There may also be another article focused on private AI.

I’ll have a badass private instance running 24/7 within the next two weeks. I’m going to add a highly interactive and fun assistant to it. More to come.

