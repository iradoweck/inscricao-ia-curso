# CHANGELOG

Todas as alterações notáveis neste projeto serão documentadas neste ficheiro.

O formato baseia-se no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e adere ao [Semantic Versioning (SemVer)](https://semver.org/).

---

## [0.4.0] - 2026-10-16

### Add
- Estrutura de diretórios dedicada para ativos estáticos: pasta `assets/img/` e ícone na raiz de `assets/`.
- Posicionamento do ícone oficial como favicon em `assets/icone.png`.

### Move
- Transferência das fotografias de alunos e logotipos da raiz para a pasta `assets/img/`.
- Transferência de `icone.png` para a raiz de `assets/`.

### Update
- Atualização de todas as tags `<img>` e `<link rel="icon">` no [`index.html`](index.html) para os novos caminhos em `assets/img/` e `assets/icone.png`.
- Atualização do diagrama C4 Code-level no [`README.md`](README.md) refletindo a nova árvore de pastas.

---

## [0.3.0] - 2026-10-16

### Add
- Documentação técnica e arquitetural no arquivo [`README.md`](README.md) com diagrama Mermaid C4 Code-level.
- Termos de licença restritiva Source-Available no arquivo [`LICENSE.md`](LICENSE.md), proibindo cópia ou uso comercial não autorizado.
- Definição explícita de política de contribuição: rejeição de Pull Requests e aceitação de Issues.

### Modify
- Reestruturação completa do [`index.html`](index.html) segundo princípios de Clean Code, dividido em 4 seções principais demarcadas:
  - `[SEÇÃO 1] Metadados & Head`
  - `[SEÇÃO 2] Estilos Visuais (CSS)`
  - `[SEÇÃO 3] Estrutura Semântica (HTML)`
  - `[SEÇÃO 4] Lógica da Aplicação (Vanilla JS)`
- Modularização do JavaScript em IIFE com responsabilidades desacopladas (`StorageRepository`, `CredentialGenerator`, `TabNavigator`, `StudentViewRenderer`, `FormHandlers`).

---

## [0.2.0] - 2026-10-16

### Add
- Integração de fotografias reais de estudantes e ambiente de desenvolvimento no site.
- Inserção do logotipo oficial da Zedecks Training no cabeçalho com fallback tipográfico.
- Badges flutuantes com efeito de vidro (*glassmorphism*) sobre a fotografia do Hero.
- Seção de Metodologia e Público-alvo estruturada em dois blocos com narrativa humana.
- Seletor rápido de modalidade nos cards de preço com rolagem automática para o formulário.

### Change
- Redesenho do Hero: transferência da caixa de preços para uma seção dedicada e expansão da proposta de valor com foto em destaque.
- Nova seção horizontal comparativa de preços com card em destaque para a modalidade Presencial.

### Update
- Reformulação de textos de suporte e mensagens de confirmação do formulário e upload de comprovativo.

---

## [0.1.0] - 2026-10-16

### Change
- Rebranding institucional: alteração da identidade de `Zedecks Academy` para `Zedecks Training`.
- Posicionamento da formação: transição de grade fixa de linguagens para metodologia agnóstica a qualquer linguagem de programação.
- Ajuste dos chips de habilidades no Hero para enfatizar lógica, arquitetura real e clean code.

### Rename
- Renomeação do arquivo principal de `inscricao_programacao_ia.html` para `index.html`.

### Add
- Alocação e configuração do servidor local na porta `2025` em conformidade com as diretrizes de infraestrutura (`WaysPessoais`).

---

## [0.0.1] - 2026-10-15

### Add
- Criação inicial da página de inscrição para o curso *"Programação Assistida por IA — Do zero ao júnior"*.
- Layout de página única (Single-File) com paleta escura (azul e dourado) e tipografia de sistema.
- Caixa de preços com modalidades Online (4.000 MT) e Presencial (5.000 MT).
- Sistema de abas para alternância entre "Fazer inscrição" e "Área do aluno".
- Formulário de captação de dados (nome completo, telefone/WhatsApp e modalidade).
- Simulação de Área do Aluno com autenticação e persistência de dados em `localStorage`.
- Geração de código de inscrição (`IA-XXXXXX`) e senha temporária de acesso.
- Formulário demonstrativo para upload de comprovativo de pagamento (JPG, PNG ou PDF).
- Rodapé com canal de atendimento oficial via WhatsApp.
