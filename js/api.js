// ========================================
// FUNÇÕES DE COMUNICAÇÃO COM A API
// ========================================

const API = {
    
    // ==================
    // AUTENTICAÇÃO
    // ==================
    
    async registrar(userName, senha) {
        try {
            const response = await fetch(`${CONFIG.API_URL}/auth/registro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userName, senha })
            });
            
            if (response.status === 201) {
                return await response.json();
            } else {
                const error = await response.text();
                throw new Error(error);
            }
        } catch (error) {
            console.error('Erro ao registrar:', error);
            throw error;
        }
    },
    
    async login(userName, senha) {
        try {
            const response = await fetch(`${CONFIG.API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userName, senha })
            });
            
            if (response.ok) {
                return await response.json();
            } else {
                const error = await response.text();
                throw new Error(error);
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            throw error;
        }
    },
    
    // ==================
    // DESAFIOS
    // ==================
    
    async listarDesafios() {
        try {
            const response = await fetch(`${CONFIG.API_URL}/desafios`);
            return await response.json();
        } catch (error) {
            console.error('Erro ao listar desafios:', error);
            throw error;
        }
    },
    
    async buscarDesafio(id) {
        try {
            const response = await fetch(`${CONFIG.API_URL}/desafios/${id}`);
            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Desafio não encontrado');
            }
        } catch (error) {
            console.error('Erro ao buscar desafio:', error);
            throw error;
        }
    },
    
    // ==================
    // JOGADOR
    // ==================
    
    async obterProgresso(jogadorId) {
        try {
            const response = await fetch(
                `${CONFIG.API_URL}/jogador/progresso?jogadorId=${jogadorId}`
            );
            return await response.json();
        } catch (error) {
            console.error('Erro ao obter progresso:', error);
            throw error;
        }
    },
    
    async validarQrCode(jogadorId, desafioId, qrCodeToken) {
        try {
            const response = await fetch(`${CONFIG.API_URL}/jogador/validar-qr`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    jogadorId: parseInt(jogadorId),
                    desafioId: parseInt(desafioId),
                    qrCodeToken: qrCodeToken
                })
            });
            
            return await response.json();
        } catch (error) {
            console.error('Erro ao validar QR Code:', error);
            throw error;
        }
    },
    
    async obterColecao(jogadorId) {
        try {
            const response = await fetch(
                `${CONFIG.API_URL}/jogador/cards?jogadorId=${jogadorId}`
            );
            return await response.json();
        } catch (error) {
            console.error('Erro ao obter coleção:', error);
            throw error;
        }
    },
    
    // ==================
    // RANKING
    // ==================
    
    async obterTop10() {
        try {
            const response = await fetch(`${CONFIG.API_URL}/ranking/top10`);
            return await response.json();
        } catch (error) {
            console.error('Erro ao obter ranking:', error);
            throw error;
        }
    },
    
    async obterPosicao(jogadorId) {
        try {
            const response = await fetch(
                `${CONFIG.API_URL}/ranking/posicao?jogadorId=${jogadorId}`
            );
            if (response.ok) {
                return await response.json();
            } else {
                return null; // Jogador não completou o jogo ainda
            }
        } catch (error) {
            console.error('Erro ao obter posição:', error);
            return null;
        }
    }
};

// ==================
// FUNÇÕES AUXILIARES
// ==================

// Mostrar loading
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Carregando...</p>
            </div>
        `;
    }
}

// Mostrar erro
function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="alert alert-error">
                <strong>Erro!</strong> ${message}
            </div>
        `;
    }
}

// Mostrar sucesso
function showSuccess(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="alert alert-success">
                <strong>Sucesso!</strong> ${message}
            </div>
        `;
    }
}

// Formatar tempo (segundos → "Xh Ymin Zs")
function formatarTempo(segundos) {
    if (!segundos) return 'N/A';
    
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    
    return `${horas}h ${minutos}min ${segs}s`;
}

// Obter classe CSS da raridade
function getRaridadeClass(raridade) {
    return raridade.toLowerCase();
}

// Obter emoji da raridade
function getRaridadeEmoji(raridade) {
    switch(raridade.toUpperCase()) {
        case 'BASICO': return '⭐';
        case 'RARO': return '💎';
        case 'LENDARIO': return '👑';
        default: return '';
    }
}