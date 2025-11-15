# To‑Do List

Aplicativo de lista de tarefas desenvolvido com React + Vite. Permite criar, editar, filtrar e ordenar tarefas, com persistência automática no `localStorage` e notificações visuais.

## Recursos
- Adicionar tarefa com texto, prioridade (`Alta`, `Média`, `Baixa`) e data de conclusão
- Editar tarefa (duplo clique), incluindo prioridade, categoria e data
- Marcar/desmarcar como concluída
- Filtros: `Todas`, `Ativas`, `Concluídas`
- Ordenação: `Manual` (drag‑and‑drop), `Data`, `Prioridade`, `Texto`, `Status`
- Persistência local: tarefas salvas no `localStorage`
- Notificações: feedback ao clicar em botões usando `react-toastify`

## Pré‑requisitos
- Node.js 18+
- npm

## Instalação e execução
```bash
npm install
npm run dev        # ambiente de desenvolvimento
npm run build      # build para produção
npm run preview    # pré-visualização do build
npm run lint       # checagem de lint
```

## Como usar
- Digite o texto da tarefa, selecione prioridade e (opcional) a data, e clique em `Adicionar` ou pressione `Enter`
- Duplo clique no texto para editar; `Enter` salva; `Esc` cancela
- Em ordenação `Manual`, arraste e solte itens para reordenar
- Use `Limpar concluídas` para remover todas as tarefas finalizadas

## Estrutura do projeto
- `src/App.jsx`: estado global, filtros, ordenação, drag‑and‑drop e persistência (`localStorage`)
- `src/components/TodoItem.jsx`: componente de item com edição, badges de prioridade/categoria/data
- `src/App.css` e `src/index.css`: estilos da aplicação
- `index.html`: documento base em `pt-br` que monta o `#root`

## Tecnologias
- React 19
- Vite 7
- ESLint (Flat Config)
- `react-toastify` para notificações

## Detalhes de comportamento
- Datas são inseridas no formato `YYYY-MM-DD` e exibidas como `DD/MM/YYYY`
- Categoria é opcional e pode ser definida durante a edição
- O contador "restantes" mostra quantas tarefas ainda não concluídas existem

## Scripts
Veja `package.json` para todos os scripts disponíveis:
- `dev`, `build`, `preview`, `lint`

## Licença
Uso educacional/demonstrativo. Ajuste conforme a necessidade do seu projeto.
