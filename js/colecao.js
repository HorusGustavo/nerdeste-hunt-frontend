// ========================================
// LÓGICA DA TELA DE COLEÇÃO
// ========================================

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
        
        const percentual = Math.round((data.totalCards / CONFIG.TOTAL_DESAFIOS) * 100);
        document.getElementById('colecao-percentual').textContent = `${percentual}%`;
        
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
            
            const cardElement = document.createElement('div');
            cardElement.className = `collection-card ${raridadeClass} fade-in`;
            
            let cardHTML = '';
            
            if (item.card.imagemUrl) {
                // ← ESSA É A LINHA MAIS IMPORTANTE
                const imageUrl = `\( {CONFIG.API_URL} \){item.card.imagemUrl}`;
                
                cardHTML = `
                    <img src="\( {imageUrl}" alt=" \){item.card.nome}" 
                         style="width: 100%; max-width: 200px; height: auto; border-radius: 10px; margin-bottom: 15px;"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div style="font-size: 60px; margin-bottom: 15px; display: none;">
                        ${raridadeEmoji}
                    </div>
                `;
            } else {
                cardHTML = `
                    <div style="font-size: 60px; margin-bottom: 15px;">
                        ${raridadeEmoji}
                    </div>
                `;
            }
            
            cardHTML += `
                <h3>${item.card.nome}</h3>
                <span class="badge badge-\( {raridadeClass}"> \){item.card.raridade}</span>
                <p style="margin-top: 10px; font-size: 12px; color: var(--text-secondary);">
                    Obtido em: ${new Date(item.dataObtencao).toLocaleDateString('pt-BR')}
                </p>
            `;
            
            cardElement.innerHTML = cardHTML;
            container.appendChild(cardElement);
        });
        
    } catch (error) {
        console.error('Erro ao carregar coleção:', error);
        showError('colecao-container', 'Erro ao carregar coleção');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    protectPage();
    carregarColecao();
});