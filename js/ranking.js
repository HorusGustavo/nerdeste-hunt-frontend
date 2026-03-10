// ========================================
// LÓGICA DA TELA DE RANKING
// ========================================

// Carregar e exibir ranking
async function carregarRanking() {
    try {
        showLoading('ranking-container');
        
        const data = await API.obterTop10();
        
        // Atualizar total de jogadores
        document.getElementById('total-jogadores').textContent = data.totalJogadoresCompletos;
        
        // Verificar posição do jogador atual
        const jogadorId = getJogadorId();
        const posicao = await API.obterPosicao(jogadorId);
        
        if (posicao) {
            document.getElementById('minha-posicao').textContent = `${posicao.posicao}º`;
            document.getElementById('posicao-container').style.display = 'block';
        } else {
            document.getElementById('posicao-container').style.display = 'none';
        }
        
        // Exibir ranking
        const container = document.getElementById('ranking-container');
        container.innerHTML = '';
        
        if (data.ranking.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <p>Ainda não há jogadores no ranking.</p>
                    <p>Seja o primeiro a completar todos os desafios!</p>
                </div>
            `;
            return;
        }
        
        data.ranking.forEach(item => {
            const div = document.createElement('div');
            div.className = 'ranking-item fade-in';
            
            // Destaque para top 3
            let positionStyle = '';
            if (item.posicao === 1) {
                positionStyle = 'background: linear-gradient(135deg, #F59E0B 0%, #EF4444 100%);';
            } else if (item.posicao === 2) {
                positionStyle = 'background: linear-gradient(135deg, #94A3B8 0%, #64748B 100%);';
            } else if (item.posicao === 3) {
                positionStyle = 'background: linear-gradient(135deg, #CD7F32 0%, #8B4513 100%);';
            }
            
            // Destacar o jogador atual
            const isCurrentPlayer = item.userName === getUserName();
            if (isCurrentPlayer) {
                div.style.border = '3px solid var(--primary)';
                div.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.5)';
            }
            
            div.innerHTML = `
                <div class="ranking-position" style="${positionStyle}">
                    ${item.posicao}º
                </div>
                <div class="ranking-info">
                    <h4>${item.userName} ${isCurrentPlayer ? '(Você)' : ''}</h4>
                    <p>⏱️ ${item.tempoFormatado}</p>
                    <p style="font-size: 11px; opacity: 0.7;">
                        Concluído em: ${new Date(item.dataConclusao).toLocaleDateString('pt-BR')}
                    </p>
                </div>
            `;
            
            container.appendChild(div);
        });
        
    } catch (error) {
        showError('ranking-container', 'Erro ao carregar ranking');
    }
}

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    protectPage(); // Verifica se está logado
    carregarRanking();
});