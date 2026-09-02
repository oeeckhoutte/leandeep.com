# Comfy UI installation on Ubuntu

- Canonical URL: https://leandeep.com/comfy-ui-installation-on-ubuntu/
- Author: Olivier Eeckhoutte
- Published: 2026-03-23T21:15:00Z
- Updated: 2026-03-23T21:15:00Z
- Language: fr
- Tags: AI, Machine Learning
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Prerequisites 

- Python 3.12.3
- pip 24.0
- Cuda compiler driver V13.0.88 (nvcc)
- Nvidia hardware

<br/>

## Installation 

Create a new venv
```
python3 -m venv comfyui-venv
source comfyui-venv/bin/activate

pip install torch torchvision --index-url https://download.pytorch.org/whl/cu130
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI
pip install -r requirements.txt
cd models/checkpoints/ && wget https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/resolve/main/v1-5-pruned-emaonly-fp16.safetensors && cd -
```

<br/>

## Test

```
python main.py --listen 0.0.0.0
# curl -I http://localhost:8188
```
