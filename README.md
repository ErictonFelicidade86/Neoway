# Neoway - Teste Técnico

# Desafio
# 🧪 Testes Automatizados - API SERVEREST

Este repositório contém testes automatizados para **API**, utilizando **Cypress** e **K6**.  
Os testes são organizados e documentados para garantir a qualidade do software.

### 📂 Pasta `api-test`
📄 Contém um **README.md** com as instruções para executar o projeto **api-test**. 

### 📂 Pasta `k6`
📄 Contém um **README.md** com as instruções para executar o projeto **k6**. 

---

## 📄 Documentação de Sugestões de Melhorias e Cenários de Teste para o Projeto de Enriquecimento de Dados de Livros



Os arquivos abaixo contêm os **cenários do desafio**:

- **api-test**: [`api-test/docs/files/Cenários_de_Teste_do_Quase.pdf`](api-test/docs/files/Cenários_de_Teste_do_Quase.pdf)
- **api-test**: [`api-test/docs/sugestoes-melhorias.md`](api-test/docs/sugestoes-melhorias.md)
- **api-test**: [`api-test/docs/analise-documentacao.md`](api-test/docs/analise-documentacao.md)
- **api-test**: [`api-test/docs/cenarios.md`](api-test/docs/cenarios.md)

---

## 📄 Relatório de execução do Teste de Performance

Os arquivos abaixo contêm os **Relatório Gerado do K6**:

- **k6**: [`k6/docs/Relatorio_Analitico_K6.pdf`](k6/docs/Relatorio_Analitico_K6.pdf)
- **k6**: [`k6/docs/Report_k6.pdf`](k6/docs/Report_k6.pdf)

---

## 📌 Considerações do Cypress

- ✅ O projeto utiliza **Cypress** para testes de **API**.
- 📂 As **fixtures** contêm arquivos **ts** para mocks de testes.
- ⚙️ Os **custom commands personalizados** estão no diretório `support/commands.ts`.
- ⚙️ As **as interface do custom commands personalizados** estão no diretório `support/index.d.ts`.
- ⚙️ As **As Interface de UserPayload e ProductPayload** estão no diretório `support/types/interface.ts`.

## 📌 Considerações do K6

- ✅ O projeto utiliza **K6** para testes de Performance da **API**.
- 📂 O **docs** contêm arquivos **pdf** com os relatórios de testes.

# 🚀Subindo o Projeto com Docker

Este projeto está configurado com Docker Compose para facilitar a execução dos testes automatizados com Cypress e K6.

📦 Passo a passo
1. Construa os containers: 

```
docker compose up --build
```

Esse comando irá instalar todas as dependências, executar os testes automatizados e gerar os relatórios.

2. Na próxima vez, basta subir normalmente

```
docker compose up
```

3. Execute com shell script

```
./scripts/run-test.sh
```

## Para visualizar a UI do Allure, conforme a imagem abaixo, execute o comando:

![Allure](assets/img/allure-report.png)



```
docker compose up allure-report
```

Em seguida, acesse:

```
http://localhost:8080/
```