# CHANGELOG

Todas as alterações notáveis neste projeto serão documentadas neste ficheiro.

O formato baseia-se no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e adere ao [Semantic Versioning (SemVer)](https://semver.org/).

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
