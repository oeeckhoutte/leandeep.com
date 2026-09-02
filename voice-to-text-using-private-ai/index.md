# Voice to text using private AI

- Canonical URL: https://leandeep.com/voice-to-text-using-private-ai/
- Author: Olivier Eeckhoutte
- Published: 2026-04-26T07:15:00Z
- Updated: 2026-04-26T07:15:00Z
- Language: fr
- Tags: AI, Machine Learning, Private AI
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



In this article we are going to use Whisper model to build a private speech recognition and private speech translation system.
To do a quick test the easiest option is to use Jupyter lab.

<br/>

## Installation

> Python version used `3.11.8`

To run the model, first install the Transformers library

```
pyenv local 3.11.8
python --version
which python
cd ~/Dev/speech-to-text/
python -m venv ./whisper-venv
source ./whisper-venv/bin/activate

```

```
pip install ipykernel
python -m ipykernel install --user --name=whisper-projet --display-name "Python (whisper-projet)"
```

<br/>

Create a `requirements.txt` file containing

```
# Core PyTorch stack (déjà compatible CUDA 13 chez toi)
torch==2.11.0
torchaudio==2.11.0
torchvision==0.26.0

# Transformers Whisper
transformers==4.44.2
accelerate>=0.33.0

# Audio / preprocessing (Whisper dépend fortement de ça)
datasets[audio]==2.21.0
soundfile>=0.12.1
librosa>=0.10.2
ffmpeg-python>=0.2.0
pydub==0.25.1


# Utilities
numpy>=1.26.0
tqdm>=4.66.0
sentencepiece>=0.2.0

# Optional (utile pour perf / stabilité audio)
scipy>=1.11.0
```

`pip install -r requirements.txt`



<br/>


## Test

```
import torch
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline


device = "cuda:0" if torch.cuda.is_available() else "cpu"
torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32

model_id = "openai/whisper-large-v3-turbo"

model = AutoModelForSpeechSeq2Seq.from_pretrained(
    model_id, torch_dtype=torch_dtype, low_cpu_mem_usage=True, use_safetensors=True
)
model.to(device)

processor = AutoProcessor.from_pretrained(model_id)

audio = "./recording.mp3"

pipe = pipeline(
    "automatic-speech-recognition",
    model=model,
    chunk_length_s=30,        # split in 30s segments
    stride_length_s=5,        # overlap to ovoid cuts
    return_timestamps=True,
    tokenizer=processor.tokenizer,
    feature_extractor=processor.feature_extractor,
    torch_dtype=torch_dtype,
    device="cuda"
)

result = pipe(audio)
print(result["text"])

```

<br/>

Output:

``` 
 [...]
 Thank you. Have a nice day. Bye-bye.
```


<br/>


To take it further, you can use a wake word using `pip install openwakeword`

Basic example:
```
import openwakeword
from openwakeword.model import Model
import pyaudio, numpy as np

openwakeword.utils.download_models()  # dl the models

model = Model(wakeword_models=["hey_bob"])

pa = pyaudio.PyAudio()
stream = pa.open(rate=16000, channels=1,
                 format=pyaudio.paInt16, input=True,
                 frames_per_buffer=1280)

print("Waiting...")
while True:
    audio = np.frombuffer(stream.read(1280), dtype=np.int16)
    prediction = model.predict(audio)
    
    for key, score in prediction.items():
        if score > 0.5:
            print(f"Wake word '{key}' detected ! (score: {score:.2f})")
            # → Trigger Whisper now
```

<br/>

## Other

**Convert m4a file to mp3**

```
from pydub import AudioSegment

audio = AudioSegment.from_file("Locmaria.m4a", format="m4a")
audio.export("locmaria.mp3", format="mp3")
```

<br/>

**Models location**

`ls -al ~/.cache/huggingface/hub/`

