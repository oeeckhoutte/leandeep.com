# Install Jupyter Lab on Ubuntu 18.04

- Canonical URL: https://leandeep.com/install-jupyter-lab-on-ubuntu-18.04/
- Author: Lean Deep
- Published: 2019-07-05T12:10:32Z
- Updated: 2019-07-05T12:10:32Z
- Language: fr
- Tags: Machine Learning, Jupyter
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

In this tutorial we are going to see how to install Jupyter lab.
More on this tool here: https://jupyterlab.readthedocs.io/en/stable/

<br/>

## Install NodeJS

We are going to install NVM (Node Version Manager) to manage the install NodeJS 
version. 

```
sudo apt-get update
sudo apt-get install -y curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
```

Add the following commands in your `~/.zshrc` file:

```
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

Once it is done do not forget to reload your terminal with `source ~/.zshrc`.

Then install the lastest LTS NodeJS version:

```
nvm ls-remote
# Determine the latest LTS. For me it is v10.16.0 when I am writing this tutorial
nvm install v10.16.0
nvm use default v10.16.0
```

<br/>

**Install python 3**

```
sudo apt-get update
sudo apt-get install python3
sudo apt-get install python3-pip
```

<br/>

**Install jupyterlab**

```
pip3 install jupyterlab
```

If you are using ohmyzsh (and you should !) edit your `~/.zshrc` file and add the line at the end `export PATH=$PATH:~/.local/bin/`. Then execute `source ~/.zshrc`.

<br/>

**Verify jupyterlab works**

```
jupyter lab --allow-root --ip=0.0.0.0 --no-browser
```

<br/>

**Install extensions hub**

> Kill the previously launched server with Ctrl-c

```
jupyter labextension install @jupyterlab/hub-extension
jupyter lab build
jupyter lab --allow-root --ip=0.0.0.0 --no-browser
```

Go to "Settings" --> "Enable Extensions manager (Experimental) to enable the extensions manager.
If you click on the extensions icon that appear on the left menu you should see all available extensions to install.

<br/>

**Make Jupyterlab a service**

Generate a config file:
```
jupyter-lab --generate-config
```

Create a working directory:
```
mkdir -p /home/$USER/Dev/jupyterlab
export WorkingDirectory=/home/$USER/Dev/jupyterlab
```

Generate Service file:
```
cat << EOF | sudo tee /etc/systemd/system/jupyter-lab.service
[Unit]
Description=Jupyter Lab
[Service]
Type=simple
PIDFile=/run/jupyter.pid
ExecStart=/home/$USER/.local/bin/jupyter-lab --config=/home/$USER/.jupyter/jupyter_notebook_config.py
WorkingDirectory=$WorkingDirectory
User=$USER
Group=$USER
Restart=always
RestartSec=10
#KillMode=mixed
[Install]
WantedBy=multi-user.target
EOF
```

Reload systemctl daemon after creating service entry:
```
sudo systemctl daemon-reload
```

Enable Jupyter Lab service:
```
sudo systemctl enable jupyter-lab.service
```

Start the service:
```
sudo systemctl start jupyter-lab.service
```

Verify jupyterlab service is working and get access token:
```
sudo systemctl status jupyter-lab.service
```

<br/>

**Add custom Password**

Start a Python repl and enter the following commands:
```
from notebook.auth import passwd
passwd()
```

Copy the hashed password, uncomment the line `c.NotebookApp.password` and add the password as value.

Restart the service (or container).

<br/>

**Custom jupyter conf**

It is possible to custom jupyter lab conf with the following commands:

```
# Incoming connection whitelist. tried with IP & CIDR. not sure about ranges. should be comma separated if more than one.
sed -i.back "s/#c.NotebookApp.allow_origin = ''/c.NotebookApp.allow_origin = '10.1.0.0\/24'/" ~/.jupyter/jupyter_notebook_config.py

# Jupyter listening IP. Set to localhost if only planning on using locally.
sed -i "s/#c.NotebookApp.ip = 'localhost'/c.NotebookApp.ip = '$ipAddress'/" ~/.jupyter/jupyter_notebook_config.py

# Whether or not to open browser on jupyter launch. If headless, or server, set to False.
sed -i "s/#c.NotebookApp.open_browser = True/c.NotebookApp.open_browser = False/" ~/.jupyter/jupyter_notebook_config.py

# Listening port. Change if necessary
sed -i "s/#c.NotebookApp.port = 8888/c.NotebookApp.port = 8888/" ~/.jupyter/jupyter_notebook_config.py

# Randomly generated token for access without user/pass
sed -i "s/^#c.NotebookApp.token .*/c.NotebookApp.token = '$token'/" ~/.jupyter/jupyter_notebook_config.py

# Trash Cleanup
sed -i "s/#c.NotebookApp.cookie_secret = b''/#c.NotebookApp.cookie_secret = ''/" ~/.jupyter/jupyter_notebook_config.py
sed -i "s/#c.Session.key = b''/#c.Session.key = ''/" ~/.jupyter/jupyter_notebook_config.py
sed -i "s/#c.NotebookNotary.secret = b''/#c.NotebookNotary.secret = ''/" ~/.jupyter/jupyter_notebook_config.py
```

<br/>

Have fun !

