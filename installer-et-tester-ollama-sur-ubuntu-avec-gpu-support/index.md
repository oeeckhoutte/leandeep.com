# Installer et tester Ollama sur Ubuntu avec GPU support

- Canonical URL: https://leandeep.com/installer-et-tester-ollama-sur-ubuntu-avec-gpu-support/
- Author: Olivier Eeckhoutte
- Published: 2026-01-25T12:08:20+02:00
- Updated: 2026-01-25T12:08:20+02:00
- Language: fr
- Tags: Ollama, AI, LLM, Machine Learning
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


**Verifier que le GPU est accessible**

```
nvidia-smi
```

<br/>

**Installer Ollama**

```
curl -fsSL https://ollama.com/install.sh | sh
```

> Cela va installer:<br/>
> * /usr/bin/ollama<br/>
> * le service systemd<br/>
> * le support CUDA si driver NVIDIA détecté

<br/>

**Vérifier l'installation**

```
ollama --version
ollama --info # Pour vérifier GPU visible
```

<br/>

**Forcer Ollama à utiliser uniquement un eGPU**

Identifier l'ID du eGPU**

```
nvidia-smi -L
GPU 0: RTX 5090 (internal)
GPU 1: RTX 5090 (internal 2)
GPU 2: RTX 4080 (eGPU)
# choisir 2
```

<br/>

```
CUDA_VISIBLE_DEVICES=2 ollama run llama3
```

<br/>

```
sudo systemctl edit ollama
```

Ajoute:
```
[Service]
Environment="CUDA_VISIBLE_DEVICES=2"
```

<br/>

```
sudo systemctl daemon-reexec
sudo systemctl restart ollama
```

<br/>

**Tester un modèle**

```
ollama pull llama3
ollama run llama3
> Explique en détail comment fonctionne un eGPU sous Linux
> Explique en détail le fonctionnement interne d’un LLM, en couvrant l’architecture transformer, l’attention, l’entraînement, l’inférence et les optimisations GPU.

# Vérifier les perfs
# watch -n 0.5 nvidia-smi

# Autre modèles 
#   léger:
# ollama pull mixtral:8x7b

#   plus lourd 
# ollama pull llama3:70b && ollama pull gpt-oss:20b && ollama pull qwen:14b && ollama pull wizardlm-uncensored && ollama pull wizard-vicuna-uncensored:7b && ollama pull wizard-vicuna-uncensored:13b && ollama pull wizard-vicuna-uncensored:30b


# Vérifier que le modèle tient en vRAM
nvidia-smi --query-gpu=memory.used,memory.total --format=csv
# Règle simple:
# 7B → ~6–8 Go
# 13B → ~12–16 Go
# 70B → 40+ Go
```

<br/>

**Voir les logs**

```
journalctl -u ollama -f
```
