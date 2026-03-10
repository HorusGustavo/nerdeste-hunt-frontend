// ========================================
// LÓGICA DE AUTENTICAÇÃO
// ========================================

// Registro de novo jogador
async function handleRegistro(event) {
    event.preventDefault();
    
    const userName = document.getElementById('register-username').value.trim();
    const senha = document.getElementById('register-password').value;
    const confirmarSenha = document.getElementById('register-confirm-password').value;
    
    // Validações
    if (!userName || !senha || !confirmarSenha) {
        showError('register-message', 'Preencha todos os campos!');
        return;
    }
    
    if (senha !== confirmarSenha) {
        showError('register-message', 'As senhas não coincidem!');
        return;
    }
    
    if (senha.length < 4) {
        showError('register-message', 'A senha deve ter pelo menos 4 caracteres!');
        return;
    }
    
    try {
        showLoading('register-message');
        
        const usuario = await API.registrar(userName, senha);
        
        // Salva no localStorage
        localStorage.setItem(CONFIG.STORAGE_KEYS.JOGADOR_ID, usuario.id);
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER_NAME, usuario.userName);
        localStorage.setItem(CONFIG.STORAGE_KEYS.IS_LOGGED_IN, 'true');
        
        // Redireciona pra home
        window.location.href = 'home.html';
        
    } catch (error) {
        showError('register-message', error.message || 'Erro ao registrar. Tente outro nome de usuário.');
    }
}

// Login de jogador existente
async function handleLogin(event) {
    event.preventDefault();
    
    const userName = document.getElementById('login-username').value.trim();
    const senha = document.getElementById('login-password').value;
    
    // Validações
    if (!userName || !senha) {
        showError('login-message', 'Preencha todos os campos!');
        return;
    }
    
    try {
        showLoading('login-message');
        
        const usuario = await API.login(userName, senha);
        
        // Salva no localStorage
        localStorage.setItem(CONFIG.STORAGE_KEYS.JOGADOR_ID, usuario.id);
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER_NAME, usuario.userName);
        localStorage.setItem(CONFIG.STORAGE_KEYS.IS_LOGGED_IN, 'true');
        
        // Redireciona pra home
        window.location.href = 'home.html';
        
    } catch (error) {
        showError('login-message', 'Usuário ou senha incorretos!');
    }
}

// Alternar entre telas de login e registro
function mostrarLogin() {
    document.getElementById('login-form-container').style.display = 'block';
    document.getElementById('register-form-container').style.display = 'none';
}

function mostrarRegistro() {
    document.getElementById('login-form-container').style.display = 'none';
    document.getElementById('register-form-container').style.display = 'block';
}