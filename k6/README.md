# Automação de Teste com K6

## Sobre

- Teste de Performance, Carga e Stress na API **[SERVEREST](https://serverest.dev/)** com **K6**
- O plano de teste e o report estão na pasta **Doc**

## Stacks
- K6
- Javascript
- Git

## Instalar o K6

## Linux
- Debian/Ubuntu
```
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```
- Fedora/CentOS
```
sudo dnf install https://dl.k6.io/rpm/repo.rpm
sudo dnf install k6
```
## MacOs
- Homebrew
```
brew install k6
```
## Windows
- Clica no link: the latest official installer

- LINK: **[Install k6](https://grafana.com/docs/k6/latest/set-up/install-k6/)**


## Etapas para executar os testes deve está na dentro da pasta tests

1. Executar o teste de Perforance
```
k6 run performance.js
```
2. Executar o teste de Perforance com report HTML
```
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=html-report.html k6 run testPerformance.js
```

<hr>

<div style="display: inline-block">
  <br>
  <img align="center" alt="Ton-Javascript" heigh="50" width="50" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" />        
  <img align="center" alt="Ton-K6" heigh="50" width="50" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/k6/k6-original.svg" />
  <img align="center" alt="Ton-Vscode" heigh="50" width="50" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" />
  <img align="center" alt="Ton-Git" heigh="50" width="50" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" />
</div>


            
          