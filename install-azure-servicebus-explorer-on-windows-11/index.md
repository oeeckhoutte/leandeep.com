# Install Azure Servicebus explorer on Windows 11

- Canonical URL: https://leandeep.com/install-azure-servicebus-explorer-on-windows-11/
- Author: Olivier Eeckhoutte
- Published: 2019-12-03T10:59:00Z
- Updated: 2019-12-03T10:59:00Z
- Language: fr
- Tags: Azure, Servicebus
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Install Chocolatey

Open a Powershell window and execute the following command as admin:
```
Set-ExecutionPolicy Bypass -Scope Process -Force; `
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; `
iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
```

<br/>

## Install Azure servicebus explorer

Once choco is installed execute simply:

```
choco install servicebusexplorer
```

<br/>

Once it is installed. Just run `ServiceBusExplorer.exe` in a Powershell terminal to open it.

