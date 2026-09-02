# Surveiller et redémarrer un script Python dès qu'un fichier est modifié

- Canonical URL: https://leandeep.com/surveiller-et-red%C3%A9marrer-un-script-python-d%C3%A8s-quun-fichier-est-modifi%C3%A9/
- Author: Olivier Eeckhoutte
- Published: 2025-01-11T23:32:00+02:00
- Updated: 2025-01-11T23:32:00+02:00
- Language: fr
- Tags: tips, Python
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



On peut utiliser watchdog pour surveiller les modifications des fichiers et relancer automatiquement un module/script lorsque des modifications sont détectées. Voici un exemple complet:


## Pré-requis

`pip install watchdog`

<br/>

## Créer un script de surveillance

**Tracker un fichier.py**

Créer par exemple un fichier appelé `run_and_reload.py`

```
import time
import os
import sys
import argparse
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class TargetFileHandler(FileSystemEventHandler):
    def __init__(self, target_file):
        self.target_file = os.path.abspath(target_file)

    def on_modified(self, event):
        if os.path.abspath(event.src_path) == self.target_file:
            print(f"[MODIFIED] {event.src_path}")

    def on_deleted(self, event):
        if os.path.abspath(event.src_path) == self.target_file:
            print(f"[DELETED] {event.src_path}")

    def on_created(self, event):
        if os.path.abspath(event.src_path) == self.target_file:
            print(f"[CREATED] {event.src_path}")

def main():
    parser = argparse.ArgumentParser(description="Monitor a .py file for changes.")
    parser.add_argument("file", help="Path to the .py file to monitor")
    parser.add_argument("-d", "--directory", help="Directory to monitor (default: file's directory)")

    args = parser.parse_args()

    file_path = os.path.abspath(args.file)

    if not os.path.isfile(file_path):
        print(f"Error: File '{file_path}' does not exist.")
        sys.exit(1)

    # Use the provided directory or fallback to the file's directory
    directory_to_watch = os.path.abspath(args.directory) if args.directory else os.path.dirname(file_path)

    if not os.path.isdir(directory_to_watch):
        print(f"Error: Directory '{directory_to_watch}' does not exist.")
        sys.exit(1)

    event_handler = TargetFileHandler(file_path)
    observer = Observer()
    observer.schedule(event_handler, path=directory_to_watch, recursive=False)
    observer.start()

    print(f"⏳ Monitoring: {file_path}")
    print(f"📁 Watched directory: {directory_to_watch}")
    print("🔔 Press Ctrl+C to stop")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        print("\nStopping monitor...")

    observer.join()

if __name__ == "__main__":
    main()

```

<br/>

Usage:

`python run_and_reload.py my_script.py` ou `python run_and_reload.py my_script.py -d ./another/path`

<br/>

**Tracker un module**

```
import time
import os
import sys
import argparse
import subprocess
import threading
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


class ModuleChangeHandler(FileSystemEventHandler):
    def __init__(self, restart_callback, extensions=(".py",)):
        self.restart_callback = restart_callback
        self.extensions = extensions

    def on_any_event(self, event):
        if any(event.src_path.endswith(ext) for ext in self.extensions):
            print(f"[CHANGE DETECTED] {event.src_path}")
            self.restart_callback()


class ModuleRunner:
    def __init__(self, module_command, watch_directory):
        self.module_command = module_command
        self.watch_directory = watch_directory
        self.process = None

    def start(self):
        print(f"▶️ Starting: {self.module_command}")
        self.process = subprocess.Popen(
            self.module_command,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True,
            bufsize=1,
        )
        threading.Thread(target=self._stream_output, daemon=True).start()

    def _stream_output(self):
        # Read the output line-by-line and forward to main stdout
        for line in self.process.stdout:
            print(line, end="")  # already includes \n

    def stop(self):
        if self.process and self.process.poll() is None:
            print("⏹️ Stopping previous process...")
            self.process.terminate()
            try:
                self.process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.process.kill()

    def restart(self):
        self.stop()
        self.start()


def main():
    parser = argparse.ArgumentParser(
        description="Watch a Python module and auto-restart on changes."
    )
    parser.add_argument("module", help="Module to run (example: my_module.main)")
    parser.add_argument(
        "-d",
        "--directory",
        help="Directory to watch (default: current directory)",
        default=".",
    )

    args = parser.parse_args()
    module_name = args.module
    directory = os.path.abspath(args.directory)

    if not os.path.isdir(directory):
        print(f"Error: Directory '{directory}' does not exist.")
        sys.exit(1)

    command = f"python -m {module_name}"
    runner = ModuleRunner(command, directory)

    handler = ModuleChangeHandler(runner.restart)
    observer = Observer()
    observer.schedule(handler, path=directory, recursive=True)

    runner.start()
    observer.start()

    print(f"📦 Watching module: {module_name}")
    print(f"📁 Watching directory: {directory}")
    print("🔄 Auto-restart on .py changes. Press Ctrl+C to exit.")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n👋 Exiting...")
        observer.stop()
        runner.stop()

    observer.join()


if __name__ == "__main__":
    main()

```

<br/>

Usage:

`python watch_module.py my_module.main -d .`

<br/>
Et voilà, aussi simple que cela.

