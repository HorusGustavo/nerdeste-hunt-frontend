// ========================================
// CONFIGURAÇÕES GLOBAIS DO JOGO
// ========================================

const CONFIG = {
    // URL da API (MUDA AQUI quando for pra produção!)
    API_URL: 'https://nerdeste-hunt-backend-production.up.railway.app',
    
    // Nome do jogo
    GAME_NAME: 'Nerdeste Hunt',
    
    // Total de desafios
    TOTAL_DESAFIOS: 12,
    
    // LocalStorage Keys
    STORAGE_KEYS: {
        JOGADOR_ID: 'jogadorId',
        USER_NAME: 'userName',
        IS_LOGGED_IN: 'isLoggedIn'
    }
};

// Função auxiliar para verificar se está logado
function isLoggedIn() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.IS_LOGGED_IN) === 'true';
}

// Função auxiliar para obter ID do jogador
function getJogadorId() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.JOGADOR_ID);
}

// Função auxiliar para obter nome do usuário
function getUserName() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.USER_NAME);
}

// Função para fazer logout
function logout() {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.JOGADOR_ID);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_NAME);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.IS_LOGGED_IN);
    window.location.href = 'index.html';
}

// Proteger páginas (redireciona se não estiver logado)
function protectPage() {
    if (!isLoggedIn()) {
        window.location.href = 'index.html';
    }
}