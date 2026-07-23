# SauceDemo UI Automation — WebdriverIO

Automação de testes E2E com **Node.js + TypeScript + WebdriverIO + Mocha** para o site [https://www.saucedemo.com](https://www.saucedemo.com).

<img width="894" height="379" alt="image" src="https://github.com/user-attachments/assets/635cb11f-cbad-4bff-85ce-c7fb6424b9f2" />

<img width="1887" height="891" alt="image" src="https://github.com/user-attachments/assets/2b6bd1d8-a354-42d8-9e4f-744d698534b4" />

---

## Tecnologias

| Tecnologia | Versão |
|---|---|
| Node.js | 18+ |
| TypeScript | ^5.4 |
| WebdriverIO | ^8.40 |
| Mocha | via `@wdio/mocha-framework` |
| ChromeDriver | 149 (fixado para compatibilidade) |
| Google Chrome | 149 |
| Allure Reporter | `@wdio/allure-reporter` + `allure-commandline` |
| PDFKit | ^0.15 (geração de evidências em PDF) |

---

## Pré-requisitos

- **Node.js 18+** instalado
- **Google Chrome 149** instalado
- **Java 11+** instalado (necessário para geração do relatório Allure)

Verificar instalações:

```bash
node -v
java -version
```

---

## Estrutura do Projeto

```
saucedemoUIAutomationWebdriverIO/
├── test/
│   ├── pageobjects/
│   │   ├── login.page.ts       # Tela de login
│   │   ├── home.page.ts        # Inventário (home)
│   │   ├── cart.page.ts        # Carrinho de compras
│   │   └── checkout.page.ts    # Fluxo de checkout
│   └── specs/
│       ├── login.spec.ts       # 6 cenários
│       ├── home.spec.ts        # 10 cenários
│       ├── cart.spec.ts        # 5 cenários
│       └── checkout.spec.ts    # 5 cenários
├── evidence/                   # PDFs de evidência (gerado, não versionado)
├── allure-results/             # Resultados brutos do Allure (gerado, não versionado)
├── allure-report/              # Relatório HTML do Allure (gerado, não versionado)
├── wdio.conf.ts                # Configuração do WebdriverIO
├── tsconfig.json
└── package.json
```

---

## Instalação

```bash
npm install
```

> O `chromedriver@149` é baixado automaticamente durante o `npm install`.

---

## Executando os Testes

### Rodar todos os testes

```bash
npm test
```

Os testes rodam em **paralelo** — cada spec file abre uma instância do Chrome independente simultaneamente.

### Rodar uma suite específica

```bash
npx wdio run wdio.conf.ts --spec test/specs/login.spec.ts
npx wdio run wdio.conf.ts --spec test/specs/home.spec.ts
npx wdio run wdio.conf.ts --spec test/specs/cart.spec.ts
npx wdio run wdio.conf.ts --spec test/specs/checkout.spec.ts
```

---

## Cenários de Teste

### Login — 6 cenários
- Validar login com sucesso
- Validar login com credenciais inválidas
- Validar login com campos vazios
- Validar login com usuário vazio
- Validar login com senha vazia
- Validar login com usuário bloqueado

### Home — 10 cenários
- Validar homepage carregada
- Validar quantidade de produtos exibidos (6)
- Validar card de produto (nome, preço, imagem, botão)
- Validar carrinho persistido após reload da página
- Validar ordenação por nome A → Z
- Validar ordenação por nome Z → A
- Validar ordenação por preço menor → maior
- Validar ordenação por preço maior → menor
- Validar About via menu hamburguer
- Validar All Items via menu hamburguer

### Carrinho — 5 cenários
- Validar que item adicionado aparece no carrinho
- Validar badge do carrinho ao adicionar item
- Validar badge ao adicionar múltiplos itens
- Validar remover item do carrinho
- Validar continuar comprando a partir do carrinho

### Checkout — 5 cenários
- Validar checkout sem preencher informações
- Validar checkout sem sobrenome
- Validar checkout sem CEP
- Validar cancelar compra e voltar ao carrinho
- Validar compra completa com sucesso

**Total: 26 cenários automatizados**

---

## Paralelismo

Cada spec file roda em um worker independente com seu próprio browser:

```
Execution of 4 workers started

[0-0] RUNNING in chrome - login.spec.ts
[0-1] RUNNING in chrome - home.spec.ts
[0-2] RUNNING in chrome - cart.spec.ts
[0-3] RUNNING in chrome - checkout.spec.ts
```

---

## Relatório Allure

### 1. Rodar os testes

```bash
npm test
```

Os dados brutos são gerados automaticamente em `allure-results/` ao final da execução.

### 2. Gerar o relatório HTML

```bash
npm run allure:generate
```

### 3. Abrir o relatório no browser

```bash
npm run allure:open
```

### Gerar e abrir em um único comando

```bash
npm run allure:report
```

O relatório é gerado em `allure-report/` e exibe gráficos de resultados, histórico de execuções e screenshots dos testes que falharam.

---

## Evidências em PDF

Ao final de cada execução, um PDF é gerado automaticamente por suite na pasta `evidence/`:

```
evidence/
├── 2026-07-23T22-30-00_login.pdf
├── 2026-07-23T22-30-00_home.pdf
├── 2026-07-23T22-30-00_cart.pdf
└── 2026-07-23T22-30-00_checkout.pdf
```

Cada PDF contém:

- **Capa** — nome da suite, data/hora de execução, total PASSED e FAILED
- **Uma página por teste** — status (PASSED/FAILED), nome do cenário, timestamp e screenshot da tela capturada no momento da execução

> Os PDFs são gerados para todos os testes, independente do resultado.

---

## .gitignore

Os seguintes artefatos são ignorados pelo git:

```
node_modules/     # dependências npm
dist/             # build TypeScript
allure-results/   # dados brutos do Allure
allure-report/    # relatório HTML gerado
evidence/         # PDFs de evidência
screenshots/      # screenshots avulsas
*.log
```
