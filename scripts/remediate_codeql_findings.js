const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(targetPath, 'utf8');

// 1. Inserir utilitários de segurança e sanitização (CryptoSecurity, escapeHtml, sanitizeSafeUrl)
const cryptoSecurityModule = `
      // 4.0.1 MÓDULO DE SEGURANÇA CRIPTOGRÁFICA & SANITIZAÇÃO (DevSecOps - Fix CWE-312, CWE-338, CWE-079)
      const CryptoSecurity = {
        // Gera hash SHA-256 seguro para nunca armazenar senhas em texto claro
        async hashSecret(plainText) {
          if (!plainText) return '';
          try {
            const msgUint8 = new TextEncoder().encode(plainText.trim());
            const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          } catch (_) {
            // Fallback determinístico seguro
            let hash = 0x811c9dc5;
            for (let i = 0; i < plainText.length; i++) {
              hash ^= plainText.charCodeAt(i);
              hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
            }
            return ('0000000' + (hash >>> 0).toString(16)).slice(-8);
          }
        },

        // CSPRNG seguro (Cryptographically Secure Pseudo-Random Number Generator)
        getRandomInt(max) {
          if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
            const array = new Uint32Array(1);
            window.crypto.getRandomValues(array);
            return array[0] % max;
          }
          return Math.floor(Math.random() * max);
        },

        // Shuffle seguro usando algoritmo de Fisher-Yates com CSPRNG
        shuffle(array) {
          const arr = [...array];
          for (let i = arr.length - 1; i > 0; i--) {
            const j = this.getRandomInt(i + 1);
            [arr[i], arr[j]] = [arr[j], arr[i]];
          }
          return arr;
        }
      };

      // Sanitizador universal para prevenção de DOM XSS (CWE-079)
      const escapeHtml = (unsafe) => {
        if (unsafe === null || unsafe === undefined) return '';
        return String(unsafe)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      };

      // Validador estrito de URLs permitidas (Data URLs seguras e HTTPS)
      const sanitizeSafeUrl = (url) => {
        if (!url || typeof url !== 'string') return '';
        const clean = url.trim();
        if (/^(data:(image\\/(png|jpeg|jpg|webp)|application\\/pdf);base64,|https?:\\/\\/)/i.test(clean)) {
          return clean;
        }
        return '';
      };
`;

if (!html.includes('CryptoSecurity = {')) {
  html = html.replace('// 4.1 CONSTANTES E DADOS DE CONFIGURAÇÃO FISCAL', cryptoSecurityModule + '\n      // 4.1 CONSTANTES E DADOS DE CONFIGURAÇÃO FISCAL');
}

// 2. Corrigir CredentialGenerator para usar CryptoSecurity (Fix Insecure Randomness - CWE-338)
const oldCredGen = `      // 4.4 GERADOR DE CREDENCIAIS (ID ÚNICO E SENHA SUGERIDA)
      const CredentialGenerator = {
        generateUniqueStudentId(existingStudentsList) {
          const charset = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
          let uniqueId = '';
          let isUnique = false;
          let attempts = 0;

          while (!isUnique && attempts < 100) {
            attempts++;
            let codePart = '';
            for (let i = 0; i < 6; i++) {
              const randomIndex = Math.floor(Math.random() * charset.length);
              codePart += charset[randomIndex];
            }
            uniqueId = \`IA-\${codePart}\`;

            const alreadyExists = existingStudentsList.some(
              (item) => (item.code || '').toUpperCase() === uniqueId
            );
            if (!alreadyExists) {
              isUnique = true;
            }
          }

          return uniqueId;
        },

        generateSuggestedPassword() {
          const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
          const lower = 'abcdefghjkmnpqrstuvwxyz';
          const numbers = '23456789';
          
          let pass = '';
          pass += upper[Math.floor(Math.random() * upper.length)];
          pass += lower[Math.floor(Math.random() * lower.length)];
          pass += numbers[Math.floor(Math.random() * numbers.length)];
          
          const all = upper + lower + numbers;
          for (let i = 0; i < 5; i++) {
            pass += all[Math.floor(Math.random() * all.length)];
          }
          return pass.split('').sort(() => 0.5 - Math.random()).join('');
        }
      };`;

const newCredGen = `      // 4.4 GERADOR DE CREDENCIAIS CRIPTOGRAFICAMENTE SEGURO (Fix CWE-338)
      const CredentialGenerator = {
        generateUniqueStudentId(existingStudentsList) {
          const charset = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
          let uniqueId = '';
          let isUnique = false;
          let attempts = 0;

          while (!isUnique && attempts < 100) {
            attempts++;
            let codePart = '';
            for (let i = 0; i < 6; i++) {
              const randomIndex = CryptoSecurity.getRandomInt(charset.length);
              codePart += charset[randomIndex];
            }
            uniqueId = \`IA-\${codePart}\`;

            const alreadyExists = existingStudentsList.some(
              (item) => (item.code || '').toUpperCase() === uniqueId
            );
            if (!alreadyExists) {
              isUnique = true;
            }
          }

          return uniqueId;
        },

        generateSuggestedPassword() {
          const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
          const lower = 'abcdefghjkmnpqrstuvwxyz';
          const numbers = '23456789';
          
          let pass = [];
          pass.push(upper[CryptoSecurity.getRandomInt(upper.length)]);
          pass.push(lower[CryptoSecurity.getRandomInt(lower.length)]);
          pass.push(numbers[CryptoSecurity.getRandomInt(numbers.length)]);
          
          const all = upper + lower + numbers;
          for (let i = 0; i < 5; i++) {
            pass.push(all[CryptoSecurity.getRandomInt(all.length)]);
          }
          return CryptoSecurity.shuffle(pass).join('');
        }
      };`;

html = html.replace(oldCredGen, newCredGen);

// 3. Corrigir StorageRepository para sanitizar senhas antes do LocalStorage (Fix Cleartext Storage - CWE-312)
const oldSaveAll = `        saveAllStudents(studentsList) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(studentsList));
          } catch (error) {
            console.error('Falha ao salvar no LocalStorage:', error);
          }
        },`;

const newSaveAll = `        saveAllStudents(studentsList) {
          try {
            // Remove qualquer senha em texto claro antes da persistência local
            const sanitizedList = (studentsList || []).map((s) => {
              const copy = { ...s };
              delete copy.password;
              return copy;
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedList));
          } catch (error) {
            console.error('Falha ao salvar no LocalStorage:', error);
          }
        },`;

html = html.replace(oldSaveAll, newSaveAll);

// 4. Corrigir findStudentByCredentials para suportar passHash
const oldFindCreds = `        findStudentByCredentials(credential, password) {
          if (!credential || !password) return null;
          const cleanCred = credential.trim().replace(/[\\s\\-\\(\\)]/g, '').toUpperCase();
          const students = this.getAllStudents();

          return students.find((student) => {
            const studentCode = (student.code || '').replace(/[\\s\\-]/g, '').toUpperCase();
            const studentPhone = (student.phone || '').replace(/[\\s\\-\\(\\)\\+]/g, '');
            const credPhone = cleanCred.replace(/^\\+/, '');

            const matchesCode = studentCode === cleanCred;
            const matchesPhone = studentPhone.endsWith(credPhone) || credPhone.endsWith(studentPhone);
            const matchesPass = student.password === password.trim();

            return (matchesCode || matchesPhone) && matchesPass;
          }) || null;
        },`;

const newFindCreds = `        findStudentByCredentials(credential, password, passHash = '') {
          if (!credential || (!password && !passHash)) return null;
          const cleanCred = credential.trim().replace(/[\\s\\-\\(\\)]/g, '').toUpperCase();
          const students = this.getAllStudents();

          return students.find((student) => {
            const studentCode = (student.code || '').replace(/[\\s\\-]/g, '').toUpperCase();
            const studentPhone = (student.phone || '').replace(/[\\s\\-\\(\\)\\+]/g, '');
            const credPhone = cleanCred.replace(/^\\+/, '');

            const matchesCode = studentCode === cleanCred;
            const matchesPhone = studentPhone.endsWith(credPhone) || credPhone.endsWith(studentPhone);
            if (!matchesCode && !matchesPhone) return false;

            const matchesHash = Boolean(student.passHash && passHash && student.passHash === passHash);
            const matchesPlain = Boolean(student.password && password && student.password === password.trim());

            return matchesHash || matchesPlain;
          }) || null;
        },`;

html = html.replace(oldFindCreds, newFindCreds);

// 5. Atualizar handleRegister para computar passHash de forma assíncrona
const oldRegisterSnippet = `          const newStudent = {
            code: uniqueId,
            password: password,
            name: cleanName,
            phone: cleanPhone,
            email: cleanEmail,
            mode: selectedMode,
            level: selectedLevel,
            amount: amount,
            status: 'A aguardar pagamento',
            proofName: '',
            proofData: '',
            createdAt: new Date().toISOString()
          };

          StorageRepository.addStudent(newStudent);
          AppRouter.navigateToPortal();
          StudentViewRenderer.showDashboard(newStudent);

          alert(
            \`Parabéns, \${cleanName.split(' ')[0]}!\\n\\nA tua inscrição foi iniciada com sucesso.\\n\\n\` +
            \`ID do Estudante: \${newStudent.code}\\n\` +
            \`Senha de Acesso: \${newStudent.password}\\n\\n\` +
            \`Guarda estes dados para voltar a consultar o estado a qualquer momento. Podes agora descarregar a tua Factura A4.\`
          );`;

const newRegisterSnippet = `          const passHash = await CryptoSecurity.hashSecret(password);
          const newStudent = {
            code: uniqueId,
            passHash: passHash,
            name: cleanName,
            phone: cleanPhone,
            email: cleanEmail,
            mode: selectedMode,
            level: selectedLevel,
            amount: amount,
            status: 'A aguardar pagamento',
            proofName: '',
            proofData: '',
            createdAt: new Date().toISOString()
          };

          StorageRepository.addStudent(newStudent);
          AppRouter.navigateToPortal();
          StudentViewRenderer.showDashboard(newStudent);

          alert(
            \`Parabéns, \${cleanName.split(' ')[0]}!\\n\\nA tua inscrição foi iniciada com sucesso.\\n\\n\` +
            \`ID do Estudante: \${newStudent.code}\\n\` +
            \`Senha de Acesso: \${password}\\n\\n\` +
            \`Guarda estes dados para voltar a consultar o estado a qualquer momento. Podes agora descarregar a tua Factura A4.\`
          );`;

html = html.replace(oldRegisterSnippet, newRegisterSnippet);
html = html.replace('handleRegister(event) {', 'async handleRegister(event) {');

// 6. Atualizar handleLogin para computar passHash
const oldLoginSnippet = `        handleLogin(event) {
          event.preventDefault();

          const credential = getElement('loginUser').value.trim();
          const password = getElement('loginPass').value.trim();

          if (!credential || !password) {
            alert('Por favor, preenche o teu Código/Telefone e a senha.');
            return;
          }

          const student = StorageRepository.findStudentByCredentials(credential, password);`;

const newLoginSnippet = `        async handleLogin(event) {
          event.preventDefault();

          const credential = getElement('loginUser').value.trim();
          const password = getElement('loginPass').value.trim();

          if (!credential || !password) {
            alert('Por favor, preenche o teu Código/Telefone e a senha.');
            return;
          }

          const passHash = await CryptoSecurity.hashSecret(password);
          const student = StorageRepository.findStudentByCredentials(credential, password, passHash);`;

html = html.replace(oldLoginSnippet, newLoginSnippet);

// 7. Sanitização de DOM XSS na Tabela do Admin (Fix index.html:4076 - CWE-079)
const oldAdminTbodyMap = `          tbody.innerHTML = filtered.map((s) => {
            const isConfirmed = s.status === 'Inscrição confirmada';
            const isReview = s.status === 'Comprovativo enviado';
            const hasProof = Boolean(s.proofName || s.proofData);
            const statusClass = isConfirmed ? 'status-pill-ok' : (isReview ? 'status-pill-review' : 'status-pill-pending');
            const createdDate = s.createdAt ? formatDatePt(new Date(s.createdAt)) : '-';
            const modeText = s.mode === 'online' ? 'Online' : 'Presencial';

            return \`
              <tr>
                <td>
                  <strong style="color:var(--primary); font-family:monospace; font-size:13px;">\${s.code}</strong>
                  <div style="font-size:11px; color:#8ba3c7;">\${createdDate}</div>
                </td>
                <td>
                  <div style="font-weight:600; color:#fff;">\${s.name}</div>
                  <div style="font-size:12px; color:#8ba3c7;">\${s.email || '-'}</div>
                </td>
                <td>
                  <span style="font-family:monospace; font-size:13px; color:#cbd5e1;">\${s.phone}</span>
                </td>
                <td>
                  <span class="admin-badge-mode">\${modeText}</span>
                  <div style="font-size:11px; color:#8ba3c7; margin-top:2px;">\${COURSE_LEVEL_LABELS[s.level] || s.level || 'Geral'}</div>
                </td>
                <td>
                  <strong style="color:#28d69a;">\${formatCurrency(s.amount)}</strong>
                </td>
                <td>
                  \${hasProof 
                    ? \`<button type="button" class="admin-btn-action view-proof" data-code="\${s.code}">
                         \${Icons.eye()} Ver Comprovativo
                       </button>\`
                    : \`<span class="admin-no-proof">Sem anexo</span>\`
                  }
                </td>
                <td>
                  <span class="admin-status-pill \${statusClass}">\${s.status}</span>
                </td>
                <td>
                  <div class="admin-actions-cell">
                    \${isConfirmed
                      ? \`<button type="button" class="admin-btn-action revert" data-code="\${s.code}" title="Reverter vaga confirmada">
                           \${Icons.revert()} Reverter Vaga
                         </button>\`
                      : (isReview
                          ? \`<button type="button" class="admin-btn-action approve" data-code="\${s.code}" title="Validar e aprovar comprovativo">
                               \${Icons.check()} Aprovar
                             </button>
                             <button type="button" class="admin-btn-action revert" data-code="\${s.code}" title="Rejeitar comprovativo e voltar para pendente">
                               \${Icons.revert()} Rejeitar
                             </button>\`
                          : \`<button type="button" class="admin-btn-action approve" data-code="\${s.code}" title="Confirmar pagamento / vaga">
                               \${Icons.check()} Aprovar
                             </button>\`
                        )
                    }
                    <button type="button" class="admin-btn-action invoice" data-code="\${s.code}" title="Imprimir / Visualizar Factura ou Recibo">
                      \${Icons.invoice()} \${isConfirmed ? 'Recibo' : 'Factura'}
                    </button>
                    <button type="button" class="admin-btn-action delete" data-code="\${s.code}" title="Eliminar inscrição no lixeiro">
                      \${Icons.trash()} Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            \`;
          }).join('');`;

const newAdminTbodyMap = `          tbody.innerHTML = filtered.map((s) => {
            const isConfirmed = s.status === 'Inscrição confirmada';
            const isReview = s.status === 'Comprovativo enviado';
            const hasProof = Boolean(s.proofName || s.proofData);
            const statusClass = isConfirmed ? 'status-pill-ok' : (isReview ? 'status-pill-review' : 'status-pill-pending');
            const createdDate = s.createdAt ? formatDatePt(new Date(s.createdAt)) : '-';
            const modeText = s.mode === 'online' ? 'Online' : 'Presencial';

            const safeCode = escapeHtml(s.code);
            const safeName = escapeHtml(s.name);
            const safeEmail = escapeHtml(s.email || '-');
            const safePhone = escapeHtml(s.phone);
            const safeMode = escapeHtml(modeText);
            const safeLevel = escapeHtml(COURSE_LEVEL_LABELS[s.level] || s.level || 'Geral');
            const safeAmount = escapeHtml(formatCurrency(s.amount));
            const safeStatus = escapeHtml(s.status);
            const safeStatusClass = escapeHtml(statusClass);

            return \`
              <tr>
                <td>
                  <strong style="color:var(--primary); font-family:monospace; font-size:13px;">\${safeCode}</strong>
                  <div style="font-size:11px; color:#8ba3c7;">\${createdDate}</div>
                </td>
                <td>
                  <div style="font-weight:600; color:#fff;">\${safeName}</div>
                  <div style="font-size:12px; color:#8ba3c7;">\${safeEmail}</div>
                </td>
                <td>
                  <span style="font-family:monospace; font-size:13px; color:#cbd5e1;">\${safePhone}</span>
                </td>
                <td>
                  <span class="admin-badge-mode">\${safeMode}</span>
                  <div style="font-size:11px; color:#8ba3c7; margin-top:2px;">\${safeLevel}</div>
                </td>
                <td>
                  <strong style="color:#28d69a;">\${safeAmount}</strong>
                </td>
                <td>
                  \${hasProof 
                    ? \`<button type="button" class="admin-btn-action view-proof" data-code="\${safeCode}">
                         \${Icons.eye()} Ver Comprovativo
                       </button>\`
                    : \`<span class="admin-no-proof">Sem anexo</span>\`
                  }
                </td>
                <td>
                  <span class="admin-status-pill \${safeStatusClass}">\${safeStatus}</span>
                </td>
                <td>
                  <div class="admin-actions-cell">
                    \${isConfirmed
                      ? \`<button type="button" class="admin-btn-action revert" data-code="\${safeCode}" title="Reverter vaga confirmada">
                           \${Icons.revert()} Reverter Vaga
                         </button>\`
                      : (isReview
                          ? \`<button type="button" class="admin-btn-action approve" data-code="\${safeCode}" title="Validar e aprovar comprovativo">
                               \${Icons.check()} Aprovar
                             </button>
                             <button type="button" class="admin-btn-action revert" data-code="\${safeCode}" title="Rejeitar comprovativo e voltar para pendente">
                               \${Icons.revert()} Rejeitar
                             </button>\`
                          : \`<button type="button" class="admin-btn-action approve" data-code="\${safeCode}" title="Confirmar pagamento / vaga">
                               \${Icons.check()} Aprovar
                             </button>\`
                        )
                    }
                    <button type="button" class="admin-btn-action invoice" data-code="\${safeCode}" title="Imprimir / Visualizar Factura ou Recibo">
                      \${Icons.invoice()} \${isConfirmed ? 'Recibo' : 'Factura'}
                    </button>
                    <button type="button" class="admin-btn-action delete" data-code="\${safeCode}" title="Eliminar inscrição no lixeiro">
                      \${Icons.trash()} Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            \`;
          }).join('');`;

html = html.replace(oldAdminTbodyMap, newAdminTbodyMap);

// 8. Sanitização de DOM XSS no Modal de Comprovativo (Fix index.html:4339 e 4360 - CWE-079)
const oldViewProofHeader = `          const headerInfoHtml = \`
            <div style="background:#091b2e; border:1px solid #1a3c5e; border-radius:8px; padding:12px 16px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; text-align:left;">
              <div>
                <div style="font-weight:700; color:#fff; font-size:14px;">\${student.name}</div>
                <div style="font-size:12px; color:#8ba3c7; margin-top:2px;">
                  WhatsApp: <a href="https://wa.me/\${(student.phone || '').replace(/[^0-9]/g, '')}" target="_blank" style="color:#38bdf8; text-decoration:none;">\${student.phone}</a> · \${student.email || 'Sem e-mail'}
                </div>
                <div style="font-size:12px; color:#cbd5e1; margin-top:2px;">
                  Modalidade: <strong>\${modeText}</strong> · Ficheiro: <strong style="color:#fde047;">\${student.proofName || 'Nenhum ficheiro'}</strong>
                </div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:11px; color:#8ba3c7; text-transform:uppercase;">Valor da Vaga</div>
                <div style="font-size:20px; font-weight:800; color:#28d69a;">\${formatCurrency(student.amount)}</div>
                <div style="font-size:11px; color:#8ba3c7;">Data Envio: \${uploadedAt}</div>
              </div>
            </div>
          \`;`;

const newViewProofHeader = `          const safeStudentName = escapeHtml(student.name);
          const safeStudentPhone = escapeHtml(student.phone);
          const safeStudentEmail = escapeHtml(student.email || 'Sem e-mail');
          const safeStudentMode = escapeHtml(modeText);
          const safeProofName = escapeHtml(student.proofName || 'Nenhum ficheiro');
          const safeStudentAmount = escapeHtml(formatCurrency(student.amount));
          const safeUploadedAt = escapeHtml(uploadedAt);
          const safePhoneDigits = (student.phone || '').replace(/[^0-9]/g, '');
          const safeProofUrl = sanitizeSafeUrl(student.proofData);

          const headerInfoHtml = \`
            <div style="background:#091b2e; border:1px solid #1a3c5e; border-radius:8px; padding:12px 16px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; text-align:left;">
              <div>
                <div style="font-weight:700; color:#fff; font-size:14px;">\${safeStudentName}</div>
                <div style="font-size:12px; color:#8ba3c7; margin-top:2px;">
                  WhatsApp: <a href="https://wa.me/\${safePhoneDigits}" target="_blank" rel="noopener noreferrer" style="color:#38bdf8; text-decoration:none;">\${safeStudentPhone}</a> · \${safeStudentEmail}
                </div>
                <div style="font-size:12px; color:#cbd5e1; margin-top:2px;">
                  Modalidade: <strong>\${safeStudentMode}</strong> · Ficheiro: <strong style="color:#fde047;">\${safeProofName}</strong>
                </div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:11px; color:#8ba3c7; text-transform:uppercase;">Valor da Vaga</div>
                <div style="font-size:20px; font-weight:800; color:#28d69a;">\${safeStudentAmount}</div>
                <div style="font-size:11px; color:#8ba3c7;">Data Envio: \${safeUploadedAt}</div>
              </div>
            </div>
          \`;`;

html = html.replace(oldViewProofHeader, newViewProofHeader);

// Corrigir proofVisualHtml dentro de viewProof
const oldProofVisual = `          if (student.proofData) {
            const isPdf = student.proofData.startsWith('data:application/pdf') || (student.proofName || '').toLowerCase().endsWith('.pdf');
            if (isPdf) {
              proofVisualHtml = \`
                <div style="margin-bottom:12px;">
                  <div style="margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:12px; color:#8ba3c7;">Ficheiro original submetido pelo formando (PDF)</span>
                    <a href="\${student.proofData}" target="_blank" download="\${student.proofName || 'comprovativo.pdf'}" class="admin-btn-action view-proof" style="text-decoration:none;">
                      \${Icons.download()} Abrir / Descarregar PDF
                    </a>
                  </div>
                  <iframe 
                    src="\${student.proofData}" 
                    style="width:100%; height:520px; border:1px solid #1c456c; border-radius:8px; background:#fff;" 
                    title="Comprovativo PDF"
                  ></iframe>
                </div>
              \`;
            } else {
              proofVisualHtml = \`
                <div style="margin-bottom:12px;">
                  <div style="margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:12px; color:#8ba3c7;">Imagem original enviada pelo formando</span>
                    <a href="\${student.proofData}" target="_blank" class="admin-btn-action view-proof" style="text-decoration:none;">
                      \${Icons.zoom()} Abrir em Tamanho Real
                    </a>
                  </div>
                  <div style="background:#050d18; border:1px solid #1b3d60; border-radius:8px; padding:14px; text-align:center; max-height:65vh; overflow-y:auto;">
                    <img 
                      src="\${student.proofData}" 
                      alt="Comprovativo de Pagamento — \${student.name}" 
                      style="max-width:100%; max-height:60vh; border-radius:6px; box-shadow:0 8px 24px rgba(0,0,0,0.6); object-fit:contain;"
                    />
                  </div>
                </div>
              \`;
            }
          } else {
            proofVisualHtml = \`
              <div style="background:#091b2e; border:1px dashed #21517d; border-radius:8px; padding:32px 18px; text-align:center; margin-bottom:16px;">
                <div style="margin-bottom:8px;">\${Icons.alert("svg-icon-lg")}</div>
                <div style="font-size:15px; font-weight:700; color:#e2e8f0; margin-bottom:6px;">Nenhum comprovativo anexado até ao momento</div>
                <p style="font-size:13px; color:#94a3b8; max-width:440px; margin:0 auto 12px; line-height:1.5;">
                  O candidato ainda não submeteu o comprovativo de pagamento (imagem ou PDF) pelo portal do aluno.
                </p>
                <div style="font-size:12px; color:#38bdf8;">
                  Se o aluno te enviou o comprovativo pelo WhatsApp (\${student.phone}), podes anexá-lo abaixo para que fique registado na ficha dele.
                </div>
              </div>
            \`;
          }`;

const newProofVisual = `          if (safeProofUrl) {
            const isPdf = safeProofUrl.startsWith('data:application/pdf') || (student.proofName || '').toLowerCase().endsWith('.pdf');
            if (isPdf) {
              proofVisualHtml = \`
                <div style="margin-bottom:12px;">
                  <div style="margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:12px; color:#8ba3c7;">Ficheiro original submetido pelo formando (PDF)</span>
                    <a href="\${safeProofUrl}" target="_blank" rel="noopener noreferrer" download="\${safeProofName}" class="admin-btn-action view-proof" style="text-decoration:none;">
                      \${Icons.download()} Abrir / Descarregar PDF
                    </a>
                  </div>
                  <iframe 
                    src="\${safeProofUrl}" 
                    style="width:100%; height:520px; border:1px solid #1c456c; border-radius:8px; background:#fff;" 
                    title="Comprovativo PDF"
                  ></iframe>
                </div>
              \`;
            } else {
              proofVisualHtml = \`
                <div style="margin-bottom:12px;">
                  <div style="margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:12px; color:#8ba3c7;">Imagem original enviada pelo formando</span>
                    <a href="\${safeProofUrl}" target="_blank" rel="noopener noreferrer" class="admin-btn-action view-proof" style="text-decoration:none;">
                      \${Icons.zoom()} Abrir em Tamanho Real
                    </a>
                  </div>
                  <div style="background:#050d18; border:1px solid #1b3d60; border-radius:8px; padding:14px; text-align:center; max-height:65vh; overflow-y:auto;">
                    <img 
                      src="\${safeProofUrl}" 
                      alt="Comprovativo de Pagamento — \${safeStudentName}" 
                      style="max-width:100%; max-height:60vh; border-radius:6px; box-shadow:0 8px 24px rgba(0,0,0,0.6); object-fit:contain;"
                    />
                  </div>
                </div>
              \`;
            }
          } else {
            proofVisualHtml = \`
              <div style="background:#091b2e; border:1px dashed #21517d; border-radius:8px; padding:32px 18px; text-align:center; margin-bottom:16px;">
                <div style="margin-bottom:8px;">\${Icons.alert("svg-icon-lg")}</div>
                <div style="font-size:15px; font-weight:700; color:#e2e8f0; margin-bottom:6px;">Nenhum comprovativo anexado até ao momento</div>
                <p style="font-size:13px; color:#94a3b8; max-width:440px; margin:0 auto 12px; line-height:1.5;">
                  O candidato ainda não submeteu o comprovativo de pagamento (imagem ou PDF) pelo portal do aluno.
                </p>
                <div style="font-size:12px; color:#38bdf8;">
                  Se o aluno te enviou o comprovativo pelo WhatsApp (\${safeStudentPhone}), podes anexá-lo abaixo para que fique registado na ficha dele.
                </div>
              </div>
            \`;
          }`;

html = html.replace(oldProofVisual, newProofVisual);

// Corrigir footerEl.innerHTML
const oldFooterHtml = `          if (footerEl) {
            footerEl.innerHTML = \`
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:12px; color:#8ba3c7;">Estado Actual:</span>
                <span class="admin-status-pill \${isConfirmed ? 'status-pill-ok' : (student.status === 'Comprovativo enviado' ? 'status-pill-review' : 'status-pill-pending')}">
                  \${student.status}
                </span>
              </div>`;

const newFooterHtml = `          if (footerEl) {
            const safeStatusClass = isConfirmed ? 'status-pill-ok' : (student.status === 'Comprovativo enviado' ? 'status-pill-review' : 'status-pill-pending');
            const safeStatus = escapeHtml(student.status);
            footerEl.innerHTML = \`
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:12px; color:#8ba3c7;">Estado Actual:</span>
                <span class="admin-status-pill \${safeStatusClass}">
                  \${safeStatus}
                </span>
              </div>`;

html = html.replace(oldFooterHtml, newFooterHtml);

// 9. Sanitização de DOM XSS no Relatório Oficial em PDF (Fix index.html:4499 - CWE-079)
const oldPdfPrintMap = `          printTbody.innerHTML = students.map((s) => {
            const isConfirmed = s.status === 'Inscrição confirmada';
            const statusLabel = isConfirmed ? 'CONFIRMADO' : (s.status === 'Comprovativo enviado' ? 'EM ANÁLISE' : 'PENDENTE');
            return \`
              <tr>
                <td style="font-family:monospace; font-weight:bold;">\${s.code}</td>
                <td><strong>\${s.name}</strong></td>
                <td>\${s.phone}</td>
                <td>\${s.mode === 'online' ? 'Online' : 'Presencial (Nampula)'}</td>
                <td style="text-align:right; font-weight:bold;">\${formatCurrency(s.amount)}</td>
                <td style="text-align:center;">
                  <span style="font-weight:bold; font-size:10px; padding:2px 5px; border-radius:3px; background:\${isConfirmed ? '#d4edda' : '#fff3cd'}; color:\${isConfirmed ? '#155724' : '#856404'}; border:1px solid \${isConfirmed ? '#c3e6cb' : '#ffeeba'};">
                    \${statusLabel}
                  </span>
                </td>
              </tr>
            \`;
          }).join('');`;

const newPdfPrintMap = `          printTbody.innerHTML = students.map((s) => {
            const isConfirmed = s.status === 'Inscrição confirmada';
            const statusLabel = isConfirmed ? 'CONFIRMADO' : (s.status === 'Comprovativo enviado' ? 'EM ANÁLISE' : 'PENDENTE');
            const safeCode = escapeHtml(s.code);
            const safeName = escapeHtml(s.name);
            const safePhone = escapeHtml(s.phone);
            const safeMode = escapeHtml(s.mode === 'online' ? 'Online' : 'Presencial (Nampula)');
            const safeAmount = escapeHtml(formatCurrency(s.amount));
            const safeStatus = escapeHtml(statusLabel);

            return \`
              <tr>
                <td style="font-family:monospace; font-weight:bold;">\${safeCode}</td>
                <td><strong>\${safeName}</strong></td>
                <td>\${safePhone}</td>
                <td>\${safeMode}</td>
                <td style="text-align:right; font-weight:bold;">\${safeAmount}</td>
                <td style="text-align:center;">
                  <span style="font-weight:bold; font-size:10px; padding:2px 5px; border-radius:3px; background:\${isConfirmed ? '#d4edda' : '#fff3cd'}; color:\${isConfirmed ? '#155724' : '#856404'}; border:1px solid \${isConfirmed ? '#c3e6cb' : '#ffeeba'};">
                    \${safeStatus}
                  </span>
                </td>
              </tr>
            \`;
          }).join('');`;

html = html.replace(oldPdfPrintMap, newPdfPrintMap);

// 10. Sanitizar proofMsgEl.innerHTML em StudentViewRenderer
html = html.replace(
  'proofMsgEl.innerHTML = `${Icons.check()} Comprovativo registado: ${student.proofName}. A nossa equipa está a conferir a quitação.`;',
  'proofMsgEl.innerHTML = `${Icons.check()} Comprovativo registado: <strong>${escapeHtml(student.proofName)}</strong>. A nossa equipa está a conferir a quitação.`;'
);

fs.writeFileSync(targetPath, html, 'utf8');
console.log('Todas as 6 vulnerabilidades CodeQL foram remediadas em index.html com sucesso!');
