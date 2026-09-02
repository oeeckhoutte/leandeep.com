# Private AI with Gemma 4

- Canonical URL: https://leandeep.com/private-ai-with-gemma-4/
- Author: Olivier Eeckhoutte
- Published: 2026-04-26T12:15:00Z
- Updated: 2026-04-26T12:15:00Z
- Language: fr
- Tags: AI, Machine Learning, Private AI
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Option 1

**Prerequisites**

- Pyenv
- Cuda 13


<br/>

**Installation**

```
pyenv install 3.12.2
pyenv global 3.12.2
python --version
```

<br/>

```
python -m venv ./vllm-gemma
source ./vllm-gemma/bin/activate
```

<br/>

```
pip install --upgrade pip

pip install torch --index-url https://download.pytorch.org/whl/cu130
python -c "import torch; print(torch.cuda.is_available())"
```

<br/>

```
pip install vllm
```

<br/>
```
pip install huggingface_hub
hf download google/gemma-4-26B-A4B-it --local-dir ~/hf_models/gemma-4-31B-it

vllm serve google/gemma-4-26B-A4B-it --max-model-len 32768 --gpu-memory-utilization 0.90 --limit-mm-per-prompt '{"image": 150, "video": 1, "audio": 0}--enable-prefix-cache --host 0.0.0.0 --port 8000 
```

<br/>

## Option 2 - Docker

```
# Base CUDA 13 (ARM sbsa)
FROM nvidia/cuda:13.0.0-devel-ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive

ENV USE_CUDA=1
ENV USE_NCCL=1
ENV USE_DISTRIBUTED=1

ENV VLLM_USE_FLASH_ATTENTION=0

# --------------------------------------------------
# System deps
# --------------------------------------------------
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    cmake \
    ninja-build \
    curl \
    wget \
    vim \
    python3 \
    python3-dev \
    python3-pip \
    python3-venv \
    libopenblas-dev \
    libssl-dev \
    zlib1g-dev \
    libffi-dev \
    libbz2-dev \
    libreadline-dev \
    libsqlite3-dev \
    libncursesw5-dev \
    xz-utils \
    tk-dev \
    libxml2-dev \
    libxmlsec1-dev \
    liblzma-dev \
    gcc-12 \
    g++-12 \
    && rm -rf /var/lib/apt/lists/*

# Set python
RUN update-alternatives --install /usr/bin/python python /usr/bin/python3 1

RUN python -m pip install --upgrade pip setuptools wheel

# --------------------------------------------------
# CUDA env
# --------------------------------------------------
ENV CUDA_HOME=/usr/local/cuda
ENV LD_LIBRARY_PATH=/usr/local/cuda/targets/sbsa-linux/lib:$LD_LIBRARY_PATH
ENV PATH=/usr/local/cuda/bin:$PATH

# --------------------------------------------------
# Compilers
# --------------------------------------------------
ENV CC=gcc-12
ENV CXX=g++-12

# --------------------------------------------------
# Build PyTorch from source
# --------------------------------------------------
WORKDIR /opt

RUN git clone --recursive https://github.com/pytorch/pytorch

WORKDIR /opt/pytorch

# CUDA arch (à ajuster selon GPU réel)
ENV TORCH_CUDA_ARCH_LIST="8.0;8.6;8.9;9.0"

# Fix ARM SVE issue
ENV BUILD_IGNORE_SVE_UNAVAILABLE=1

# Optionnel mais recommandé (évite d'autres warnings CPU)
ENV USE_NATIVE_ARCH=0

# Install Python deps
RUN python -m pip install -r requirements.txt

# Build PyTorch
RUN python setup.py develop

# --------------------------------------------------
# Install Triton
# --------------------------------------------------
RUN python -m pip install ninja cmake

# Try wheel first
RUN python -m pip install triton || true

# Fallback build Triton from source
RUN if ! python -c "import triton" ; then \
      git clone https://github.com/openai/triton /opt/triton && \
      cd /opt/triton/python && \
      python -m pip install -e . ; \
    fi

# --------------------------------------------------
# Build vLLM
# --------------------------------------------------
WORKDIR /opt

RUN git clone https://github.com/vllm-project/vllm

WORKDIR /opt/vllm

ENV VLLM_BUILD_WITH_CUDA=1
ENV MAX_JOBS=8

RUN python -m pip install -e .

# --------------------------------------------------
# Runtime
# --------------------------------------------------
WORKDIR /workspace

EXPOSE 8000

CMD ["python", "-m", "vllm.entrypoints.openai.api_server", \
     "--model /models/gemma", \
     "--trust-remote-code", \
     "--max-model-len", "8192",
     "--max-num-batched-tokens", "4096", \
     "--gpu-memory-utilization", "0.90", \
     "--disable-flash-attn",
     "--enforce-eager",
     "--host", "0.0.0.0", \
     "--port", "8000"]
```

<br/>

```
docker build -t vllm-cuda13 .
  docker run --gpus all -p 8000:8000 \
    -v ~/hf_models/gemma-4-31B-it:/models/gemma \
    vllm-cuda13
```

<br/>

If you see something like this it means it is all good:

```
(APIServer pid=1) INFO 04-26 20:41:31 [utils.py:299] 
(APIServer pid=1) INFO 04-26 20:41:31 [utils.py:299]        █     █     █▄   ▄█
(APIServer pid=1) INFO 04-26 20:41:31 [utils.py:299]  ▄▄ ▄█ █     █     █ ▀▄▀ █  version 0.19.2rc1.dev214+gb39c266da
(APIServer pid=1) INFO 04-26 20:41:31 [utils.py:299]   █▄█▀ █     █     █     █  model   google/gemma-4-26B-A4B-it
(APIServer pid=1) INFO 04-26 20:41:31 [utils.py:299]    ▀▀  ▀▀▀▀▀ ▀▀▀▀▀ ▀     ▀
(APIServer pid=1) INFO 04-26 20:41:31 [utils.py:299] 
(APIServer pid=1) INFO 04-26 20:41:31 [utils.py:233] non-default args: {'host': '0.0.0.0', 'model': 'google/gemma-4-26B-A4B-it', 'trust_remote_code': True}
```

<br/>


## Add a UI

```
docker run -d \
    --name open-webui \
    -p 3000:8080 \
    -v open-webui:/app/backend/data \
    -e OPENAI_API_BASE_URL=http://server_lan_ip:8000/v1 \
    --restart always \
    ghcr.io/open-webui/open-webui:main
```

