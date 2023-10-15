## Install Lens Kubernetes APP (Ubuntu)

> Get the Lens Desktop public security key and add it to your keyring:

```curl -fsSL https://downloads.k8slens.dev/keys/gpg | gpg --dearmor | sudo tee /usr/share/keyrings/lens-archive-keyring.gpg > /dev/null```

> Add the Lens Desktop repo to your `/etc/apt/sources.list.d` directory.
>> Specify the `stable` channel

```echo "deb [arch=amd64 signed-by=/usr/share/keyrings/lens-archive-keyring.gpg] https://downloads.k8slens.dev/apt/debian stable main" | sudo tee /etc/apt/sources.list.d/lens.list > /dev/null```

> Install or update Lens Desktop:

```sudo apt update```

```sudo apt install lens```

> Run Lens Desktop

```lens-desktop```