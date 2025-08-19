# Gerador de Frequência de Voluntário Civil PMPA

Uma aplicação web para ciração de folhas de frequência de voluntários civis da Polícia Militar do Estado do Pará.
Esta aplicação visa otimizar o processo de produção desses documentos, fazendo com que o usuário possa focar em outras tarefas administrativas dentro da PMPA.

## Recursos

- 📝 Geração de fichas por demanda
- 📅 Seleção de mês de frequência
- 📄 Geração de documentos em formato DOCX e PDF
- 🎨 Interface responsiva

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Frontend**: EJS templates, Tailwind CSS, Vanilla JavaScript
- **Document Processing**: docxtemplater, libreoffice-convert
- **Deployment**: Docker, Fly.io

## Prerequisitos

- Node.js (v18 ou superior)
- npm or yarn
- Docker (opicional, para deployment conteinerizado)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/lemuelsousa/gerador-frequncia-vcs.git
cd gerador-frequncia-vcs
```

2. Instale dependências:
```bash
npm install
```

3. Faça o build da aplicação:
```bash
npm run build
```

## Dev mode

Para rodar a aplicação em modo de desenvolvimento:

```bash
# Start the development server
npm run dev

# In another terminal, watch for CSS changes
npm run css:dev
```

A aplicação ficará disponível em `http://localhost:3000`. Então acesse-a no navegador.

## Prod Mode

Para roda em modo de produção:

```bash
# Build the project
npm run build

# Start the production server
npm start
```

## Docker

Para rodar com docker:

```bash
# docker-compose
docker-compose up --build

# only Docker
docker build -t gerador-frequncia-vcs .
docker run -p 3000:3000 gerador-frequncia-vcs
```

## Scripts do projeto

- `npm run dev` - roda a aplicação em modo de desenvolvimento
- `npm run build` - Exporta produção
- `npm start` - Roda em produção
- `npm run css:build` - Exporta arquivos CSS de produção
- `npm run css:dev` - Tailwindcss em modo desenvolvimento
- `npm run lint` - Executa ESLint
- `npm run clean` - limpa arquivos de produção

## API Endpoints

- `POST /api/docs` - Generate attendance document with volunteer names and month

## Project Structure

```
gerador-frequncia-vcs/
├── src/
│   ├── app.ts              # Main application entry point
│   ├── routes/             # API routes
│   ├── handler/            # Request handlers
│   ├── repository/         # Data access layer
│   ├── schema/             # Validation schemas
│   ├── templates/          # Document templates
│   └── utils/              # Utility functions
├── views/                  # EJS templates
├── public/                 # Static assets (CSS, JS)
└── build/                  # Compiled output
```

## License

This project is licensed under the ISC License.

## Author

[Lemuel Sousa](https://github.com/lemuelsousa)

## Repository

[https://github.com/lemuelsousa/gerador-frequncia-vcs](https://github.com/lemuelsousa/gerador-frequncia-vcs)