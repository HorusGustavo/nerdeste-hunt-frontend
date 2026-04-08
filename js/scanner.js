// ========================================
// LÓGICA DO SCANNER DE QR CODE
// ========================================

let html5QrCode = null;
let scannerAtivo = false;

// Iniciar scanner
async function iniciarScanner() {
    try {
        const btnIniciar = document.getElementById('btn-iniciar-scanner');
        const btnParar = document.getElementById('btn-parar-scanner');
        const resultado = document.getElementById('scan-result');
        
        btnIniciar.disabled = true;
        btnIniciar.textContent = 'Iniciando câmera...';
        
        html5QrCode = new Html5Qrcode("qr-reader");
        
        await html5QrCode.start(
            { facingMode: "environment" }, // Câmera traseira
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },
            onScanSuccess,
            onScanError
        );
        
        scannerAtivo = true;
        btnIniciar.style.display = 'none';
        btnParar.style.display = 'block';
        resultado.innerHTML = `
            <div class="alert alert-info">
                📷 Aponte a câmera para o QR Code do desafio
            </div>
        `;
        
    } catch (error) {
        console.error('Erro ao iniciar scanner:', error);
        document.getElementById('scan-result').innerHTML = `
            <div class="alert alert-error">
                Erro ao acessar a câmera. Verifique as permissões.
            </div>
        `;
        document.getElementById('btn-iniciar-scanner').disabled = false;
        document.getElementById('btn-iniciar-scanner').textContent = 'Iniciar Scanner';
    }
}

// Parar scanner
async function pararScanner() {
    try {
        if (html5QrCode && scannerAtivo) {
            await html5QrCode.stop();
            scannerAtivo = false;
            
            document.getElementById('btn-iniciar-scanner').style.display = 'block';
            document.getElementById('btn-iniciar-scanner').disabled = false;
            document.getElementById('btn-iniciar-scanner').textContent = 'Iniciar Scanner';
            document.getElementById('btn-parar-scanner').style.display = 'none';
        }
    } catch (error) {
        console.error('Erro ao parar scanner:', error);
    }
}

// Callback quando QR Code é escaneado com sucesso
async function onScanSuccess(decodedText, decodedResult) {
    try {
        // Para o scanner
        await pararScanner();
        
        // Mostra loading
        document.getElementById('scan-result').innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Validando QR Code...</p>
            </div>
        `;
        
        // Parse do QR Code
        // Formato esperado: "NORDESTE_NERD|DESAFIO_ID|TOKEN"
        // Exemplo: "NORDESTE_NERD|1|TOKEN_DESAFIO_1"
        const parts = decodedText.split('|');
        
        if (parts.length !== 3 || parts[0] !== 'NORDESTE_NERD') {
            throw new Error('QR Code inválido! Este não é um QR Code do jogo.');
        }
        
        const desafioId = parseInt(parts[1]);
        const qrCodeToken = parts[2];
        
        // Valida com a API
        const jogadorId = getJogadorId();
        const resultado = await API.validarQrCode(jogadorId, desafioId, qrCodeToken);
        
        if (resultado.sucesso) {
            mostrarResultadoSucesso(resultado);
        } else {
            mostrarResultadoErro(resultado.mensagem);
        }
        
    } catch (error) {
        console.error('Erro ao processar QR Code:', error);
        mostrarResultadoErro(error.message || 'Erro ao validar QR Code');
    }
}

// Callback de erro do scanner (ignora)
function onScanError(error) {
    // Ignora erros de scan (muito comum)
}

// Mostrar resultado de sucesso
function mostrarResultadoSucesso(resultado) {
    const raridadeClass = getRaridadeClass(resultado.cardLiberado.raridade);
    const raridadeEmoji = getRaridadeEmoji(resultado.cardLiberado.raridade);
    
    let html = `
        <div class="alert alert-success">
            <h3 style="margin-bottom: 10px;">🎉 ${resultado.mensagem}</h3>
        </div>
        
        <div class="collection-card ${raridadeClass}" style="animation: glow 2s infinite;">
    `;
    
    // 🔥 AQUI ESTÁ A CORREÇÃO (IMAGEM DO CARD)
    if (resultado.cardLiberado.imagemUrl) {
        html += `
            <img src="${resultado.cardLiberado.imagemUrl}" 
                 alt="${resultado.cardLiberado.nome}" 
                 style="width: 100%; max-width: 200px; height: auto; border-radius: 10px; margin-bottom: 15px;"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <div style="font-size: 80px; margin-bottom: 15px; display: none;">
                ${raridadeEmoji}
            </div>
        `;
    } else {
        html += `
            <div style="font-size: 80px; margin-bottom: 15px;">
                ${raridadeEmoji}
            </div>
        `;
    }
    
    html += `
            <h2>Card Liberado!</h2>
            <h3>${resultado.cardLiberado.nome}</h3>
            <span class="badge badge-${raridadeClass}">${resultado.cardLiberado.raridade}</span>
        </div>
        
        <div class="card">
            <h3>📊 Progresso</h3>
            <p style="font-size: 24px; font-weight: bold; color: var(--primary);">
                ${resultado.totalConcluidos}/${CONFIG.TOTAL_DESAFIOS} Desafios
            </p>
        </div>
    `;
    
    if (resultado.jogoCompleto) {
        html += `
            <div class="alert alert-success" style="animation: glow 2s infinite;">
                <h2>🏆 PARABÉNS!</h2>
                <p style="font-size: 18px; margin-top: 10px;">
                    Você completou TODOS os desafios!
                </p>
                <a href="ranking.html" class="btn btn-primary" style="margin-top: 20px;">
                    Ver Ranking
                </a>
            </div>
        `;
    } else {
        html += `
            <button onclick="iniciarScanner()" class="btn btn-primary">
                Escanear Outro QR Code
            </button>
        `;
    }
    
    document.getElementById('scan-result').innerHTML = html;
}

// Mostrar resultado de erro
function mostrarResultadoErro(mensagem) {
    document.getElementById('scan-result').innerHTML = `
        <div class="alert alert-error">
            <h3>❌ Erro!</h3>
            <p>${mensagem}</p>
        </div>
        <button onclick="iniciarScanner()" class="btn btn-primary">
            Tentar Novamente
        </button>
    `;
}

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    protectPage(); // Verifica se está logado
});