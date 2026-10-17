# CHANGELOG

Todas as alterações notáveis neste projeto serão documentadas neste ficheiro.

O formato baseia-se no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e adere ao [Semantic Versioning (SemVer)](https://semver.org/).

## [0.6.0] - 2026-10-17

### Add
- Arquitetura SPA com roteamento hash (`#portal`, `#aluno`, `#estudante`): separação da Landing Page e da Área do Aluno em duas visualizações mestras independentes (`#landingView` e `#portalView`) mantendo arquivo único `index.html`.
- Cabeçalho dedicado do Portal com identificação visual corporativa, badge oficial e botão de retorno `← Voltar à Página Inicial`.
- Botão direto de acesso à Área do Aluno no cabeçalho público e no formulário de reserva de vaga.

### Modify
- Substituição do `TabNavigator` pelo `AppRouter` com sincronização nativa de rotas via `hashchange` e compatibilidade com histórico de navegação.

---

## [0.5.1] - 2026-10-17

### Update
- Validação em tempo real (Title Case, @gmail.com, prefixos 82-88) e coordenadas oficiais de pagamento (Nampula).
- Emissão direta de Factura e Recibo A4 com layout executivo e titulares ajustados (M-Pesa mascarado e E-Mola/BIM nominais).

---

## [0.5.0] - 2026-10-17

### Add
- Validações estritas de formulário: nome Title Case sem números, WhatsApp Moçambique (82-88) e @gmail.com.
- Geração em tempo real de ID de estudante único (`IA-XXXXXX`) e gerador de senha de acesso à Área do Aluno.
- Barra de progresso visual em 4 etapas (Inscrição, Factura/Pagamento, Comprovativo, Confirmação).
- Emissão e download de Factura Pró-forma A4 em PDF via `window.print()` e cards de pagamento (M-Pesa, E-Mola, BIM).
- Recibo de quitação formal após confirmação e painel de informações contínuas da turma.

---

## [0.4.1] - 2026-10-16

### Modify
- Integração orgânica das imagens no fundo do site sem cortes (`height: auto`).
- Remoção das molduras rígidas e containers de caixa (`.photo-frame`).

### Add
- Efeito de desvanecimento na base das imagens (`mask-image`).
- Halo de luz difusa atrás dos personagens para profundidade.

---

## [0.4.0] - 2026-10-16

### Add
- Pasta `assets/img/` para fotos e arquivo `assets/icone.png` para o favicon.

### Update
- Caminhos das imagens atualizados no `index.html` e `README.md`.

---

## [0.3.0] - 2026-10-16

### Modify
- Separação do `index.html` em 4 seções demarcadas (Head, CSS, HTML, JS).
- Encapsulamento da lógica JavaScript em IIFE com responsabilidade única.

### Add
- Documentação técnica com diagrama C4 no `README.md`.
- Licença Source-Available no `LICENSE.md` com política de issues.

---

## [0.2.0] - 2026-10-16

### Add
- Fotos reais de alunos e logotipo oficial da Zedecks Training.
- Badges flutuantes no Hero e blocos ilustrados de metodologia.
- Seção comparativa de preços com cards Online e Presencial.

### Change
- Desacoplamento da tabela de preços para fora do Hero.

---

## [0.1.0] - 2026-10-16

### Change
- Rebranding da marca para Zedecks Training.
- Proposta de ensino ajustada para ser agnóstica a linguagens.

### Modify
- Renomeação do arquivo principal para `index.html`.

### Add
- Configuração do servidor local na porta 2025.

---

## [0.0.1] - 2026-10-15

### Add
- Versão inicial da landing page do curso em página única.
- Formulário de inscrição com geração de código e senha.
- Área do aluno com login e upload de comprovativo via LocalStorage.
