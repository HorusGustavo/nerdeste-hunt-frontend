// ========================================
// LÓGICA DA TELA DE DESAFIOS
// ========================================

// Carregar e exibir todos os desafios
async function carregarDesafios() {
    try {
        showLoading('desafios-container');
        
        const desafios = await API.listarDesafios();
        
        const container = document.getElementById('desafios-container');
        container.innerHTML = '';
        
        desafios.forEach(desafio => {
            const card = document.createElement('div');
            card.className = 'card fade-in';
            card.innerHTML = `
                <h3>${desafio.nome}</h3>
                <p>${desafio.descricao}</p>
                <span class="badge badge-raro">Desafio #${desafio.id}</span>
            `;
            container.appendChild(card);
        });
        
    } catch (error) {
        showError('desafios-container', 'Erro ao carregar desafios');
    }
}

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    protectPage(); // Verifica se está logado
    carregarDesafios();
});