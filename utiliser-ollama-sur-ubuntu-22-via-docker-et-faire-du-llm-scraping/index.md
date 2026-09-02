# Utiliser Ollama sur Ubuntu 22 via Docker et faire du LLM scraping

- Canonical URL: https://leandeep.com/utiliser-ollama-sur-ubuntu-22-via-docker-et-faire-du-llm-scraping/
- Author: Olivier Eeckhoutte
- Published: 2025-05-04T23:32:00+02:00
- Updated: 2025-05-04T23:32:00+02:00
- Language: fr
- Tags: Linux, LLM, AI
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Dans cet article, nous allons voir comment utiliser Ollama sur Ubuntu 22 via Docker tout en tirant parti du GPU connecté au serveur dans le but de faire du scraping en posant des questions à son LLM auto-hébergé.

<br/>

**Pré-requis**

* `nvidia-smi` déjà installé
* Cuda installé
* Docker installé


<br/>

**Installation du NVIDIA Container Toolkit**

```
sudo apt install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
# Vérification
docker run --rm --gpus all nvidia/cuda:12.2.0-base-ubuntu20.04 nvidia-smi

```

<br/>

**Docker compose Ollama avec accès GPU**

```
version: '3.8'
services:
  ollama:
    image: ollama/ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama-data:/root/.ollama
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              capabilities: [gpu]

  openwebui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: openwebui
    ports:
      - "3000:8080"
    volumes:
      - openwebui-data:/app/backend/data
    environment:
      - OLLAMA_API_BASE_URL=http://ollama:11434
    depends_on:
      - ollama
    restart: unless-stopped
  
  scraper-llm:
    build:
      context: ./scraper-llm
    depends_on:
      - ollama
    environment:
      - OLLAMA_HOST=http://ollama:11434
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              capabilities: [gpu]

volumes:
  ollama-data:
  openwebui-data:
```

<br/>

**Ajouter les 3 fichiers ci-dessous permettant de scraper des sites web**

1. Créer un fichier `./scraper-llm/main.py` et ajouter le contenu suivant:

```
import requests
from bs4 import BeautifulSoup
import html2text

OLLAMA_URL = "http://ollama:11434/api/generate"  # utilise le nom du service docker

def scrape_text(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    html_text = str(soup.body)
    return html2text.html2text(html_text)

def ask_ollama(prompt, model="llama3"):
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }
    response = requests.post(OLLAMA_URL, json=payload)
    response.raise_for_status()
    return response.json()["response"]

if __name__ == "__main__":
    url = "https://fr.wikipedia.org/wiki/Intelligence_artificielle"
    content = scrape_text(url)

    question = "Quels sont les grands types d'intelligence artificielle abordés dans cet article ?"
    full_prompt = f"Voici le contenu d'une page web :\n\n{content}\n\n{question}"

    print("🧠 Question envoyée au modèle...\n")
    answer = ask_ollama(full_prompt)
    print("✅ Réponse :\n")
    print(answer)
```

<br/>

2. Créer le fichier `./scraper-llm/requirements.txt` et ajouter le contenu suivant:
```
requests
beautifulsoup4
html2text
```

<br/>

3. Créer un `./scraper-llm/Dockerfile`:

```
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

CMD ["python", "main.py"]
```

<br/>

## RUN

```
docker compose build --no-cache
docker compose up

# Dans une second tab:
docker compose exec ollama ollama run llama3
docker compose exec ollama ollama run llama4
```

<br/>

* Web Interface: http://localhost:3000
* Ollama API: http://localhost:11434
