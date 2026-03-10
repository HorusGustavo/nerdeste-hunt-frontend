// ========================================
// LÓGICA DA TELA DE PROGRESSO
// ========================================

// Carregar e exibir progresso do jogador
async function carregarProgresso() {
    try {
        showLoading('progresso-container');
        
        const jogadorId = getJogadorId();
        const progresso = await API.obterProgresso(jogadorId);
        
        // Calcular quantos foram concluídos
        const concluidos = progresso.filter(p => p.status === 'CONCLUIDO').length;
        const percentual = Math.round((concluidos / CONFIG.TOTAL_DESAFIOS) * 100);
        
        // Atualizar barra de progresso
        document.getElementById('progress-text').textContent = 
            `${concluidos}/${CONFIG.TOTAL_DESAFIOS} Desafios Concluídos`;
        
        const progressBar = document.getElementById('progress-bar');
        progressBar.style.width = `${percentual}%`;
        progressBar.textContent = `${percentual}%`;
        
        // Exibir lista de desafios
        const container = document.getElementById('progresso-container');
        container.innerHTML = '';
        
        progresso.forEach(item => {
            const div = document.createElement('div');
            div.className = `list-item fade-in ${item.status === 'CONCLUIDO' ? 'concluido' : ''}`;
            
            const statusClass = item.status === 'CONCLUIDO' ? 'status-concluido' : 'status-pendente';
            const statusText = item.status === 'CONCLUIDO' ? '✓ Concluído' : '○ Pendente';
            const dataText = item.dataConclusao ? 
                `<small>Concluído em: ${new Date(item.dataConclusao).toLocaleString('pt-BR')}</small>` : 
                '';
            
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4>${item.desafio.nome}</h4>
                        <p>${item.desafio.descricao}</p>
                        ${dataText}
                    </div>
                    <span class="status ${statusClass}">${statusText}</span>
                </div>
            `;
            
            container.appendChild(div);
        });
        
    } catch (error) {
        showError('progresso-container', 'Erro ao carregar progresso');
    }
}

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    protectPage(); // Verifica se está logado
    
    // Atualizar nome do usuário no header
    const userName = getUserName();
    document.getElementById('user-name').textContent = userName;
    
    carregarProgresso();
});