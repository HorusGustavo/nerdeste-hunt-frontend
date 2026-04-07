// ========================================
// LÓGICA DA TELA DE COLEÇÃO
// ========================================

// Carregar e exibir coleção de cards
async function carregarColecao() {
    try {
        showLoading('colecao-container');
        
        const jogadorId = getJogadorId();
        const data = await API.obterColecao(jogadorId);
        
        // Atualizar estatísticas
        document.getElementById('total-cards').textContent = data.totalCards;
        document.getElementById('total-basicos').textContent = data.estatisticas.basicos;
        document.getElementById('total-raros').textContent = data.estatisticas.raros;
        document.getElementById('total-lendarios').textContent = data.estatisticas.lendarios;
        
        // Calcular percentual de conclusão
        const percentual = Math.round((data.totalCards / CONFIG.TOTAL_DESAFIOS) * 100);
        document.getElementById('colecao-percentual').textContent = `${percentual}%`;
        
        // Exibir cards
        const container = document.getElementById('colecao-container');
        container.innerHTML = '';
        
        if (data.cards.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <p>Você ainda não coletou nenhum card.</p>
                    <p>Complete desafios para ganhar cards!</p>
                </div>
            `;
            return;
        }
        
        data.cards.forEach(item => {
            const raridadeClass = getRaridadeClass(item.card.raridade);
            const raridadeEmoji = getRaridadeEmoji(item.card.raridade);
            
            const card = document.createElement('div');
            card.className = `collection-card ${raridadeClass} fade-in`;
            
            // Monta HTML com ou sem imagem
            let cardHTML = '';
            
            // Se tem imagem, mostra a imagem
            if (item.card.imagemUrl) {
                cardHTML = `
                <img src="assets/cards/card-${card.id}.png" alt="${item.card.nome}" 
                         style="width: 100%; max-width: 200px; height: auto; border-radius: 10px; margin-bottom: 15px;"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div style="font-size: 60px; margin-bottom: 15px; display: none;">
                        ${raridadeEmoji}
                    </div>
                `;
            } else {
                // Se não tem imagem, mostra emoji
                cardHTML = `
                    <div style="font-size: 60px; margin-bottom: 15px;">
                        ${raridadeEmoji}
                    </div>
                `;
            }
            
            cardHTML += `
                <h3>${item.card.nome}</h3>
                <span class="badge badge-${raridadeClass}">${item.card.raridade}</span>
                <p style="margin-top: 10px; font-size: 12px; color: var(--text-secondary);">
                    Obtido em: ${new Date(item.dataObtencao).toLocaleDateString('pt-BR')}
                </p>
            `;
            
            card.innerHTML = cardHTML;
            container.appendChild(card);
        });
        
    } catch (error) {
        showError('colecao-container', 'Erro ao carregar coleção');
    }
}

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    protectPage(); // Verifica se está logado
    carregarColecao();
});