const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Substituir no CSS o content: "✓" por um ícone SVG em data-URI
html = html.replace(
  `.feature-list li::before {\n      content: "✓";\n      color: var(--green);\n      font-weight: 900;\n    }`,
  `.feature-list li::before {\n      content: "";\n      display: inline-block;\n      width: 16px;\n      height: 16px;\n      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2310b981' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E") no-repeat center center;\n      background-size: contain;\n      flex-shrink: 0;\n    }`
);

// 2. Substituir o botão de fechar modal ✕ por SVG
html = html.replace(
  `<button type="button" id="closeProofModalBtn" style="background:transparent; border:none; color:var(--muted); font-size:1.4rem; cursor:pointer; line-height:1;" title="Fechar">\n          ✕\n        </button>`,
  `<button type="button" id="closeProofModalBtn" style="background:transparent; border:none; color:var(--muted); font-size:1.2rem; cursor:pointer; line-height:1; display:flex; align-items:center; justify-content:center; padding:4px;" title="Fechar">\n          <svg class="svg-icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>\n        </button>`
);

// 3. Tabela Admin - Botões de ação dinâmica com SVGs
html = html.replace(
  `↺ Reverter Vaga`,
  `\${Icons.revert()} Reverter Vaga`
);
html = html.replaceAll(
  `✓ Aprovar`,
  `\${Icons.check()} Aprovar`
);
html = html.replace(
  `↺ Rejeitar`,
  `\${Icons.revert()} Rejeitar`
);

// 4. Modal de Comprovativo - Botões de ação no footer
html = html.replace(
  `✓ Validar & Aprovar Vaga`,
  `\${Icons.check()} Validar & Aprovar Vaga`
);
html = html.replace(
  `↺ Reverter Inscrição`,
  `\${Icons.revert()} Reverter Inscrição`
);
html = html.replace(
  `🗑️ Eliminar`,
  `\${Icons.trash()} Eliminar`
);

// 5. Mensagem de comprovativo registado
html = html.replace(
  `proofMsgEl.textContent = \`✓ Comprovativo registado: \${student.proofName}. A nossa equipa está a conferir a quitação.\`;`,
  `proofMsgEl.innerHTML = \`\${Icons.check()} Comprovativo registado: \${student.proofName}. A nossa equipa está a conferir a quitação.\`;`
);

// 6. Alerta de inscrição
html = html.replace(
  `\`🎉 Parabéns, \${cleanName.split(' ')[0]}!\\n\\nA tua inscrição foi iniciada com sucesso.\\n\\n\` +\n            \`📌 ID do Estudante: \${newStudent.code}\\n\` +\n            \`🔑 Senha de Acesso: \${newStudent.password}\\n\\n\``,
  `\`Parabéns, \${cleanName.split(' ')[0]}!\\n\\nA tua inscrição foi iniciada com sucesso.\\n\\n\` +\n            \`ID do Estudante: \${newStudent.code}\\n\` +\n            \`Senha de Acesso: \${newStudent.password}\\n\\n\``
);

fs.writeFileSync(filePath, html, 'utf8');
console.log('index.html limpo com 100% de SVGs!');
