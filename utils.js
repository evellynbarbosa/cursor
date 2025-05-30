const Utils = {
    // Função para validar CPF
    validarCPF: function(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');
        
        if (cpf.length !== 11) return false;
        
        // Verifica CPFs com dígitos iguais
        if (/^(\d)\1{10}$/.test(cpf)) return false;
        
        let soma = 0;
        let resto;
        
        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
        }
        
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;
        
        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
        }
        
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) return false;
        
        return true;
    },

    // Função para formatar moeda
    formatarMoeda: function(valor) {
        if (typeof valor !== 'number') {
            console.warn('Valor inválido para formatação de moeda:', valor);
            return 'R$ 0,00';
        }
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    },

    // Função para gerar ID único
    gerarId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Função para mostrar mensagem de alerta
    mostrarAlerta: function(mensagem, tipo = 'info') {
        console.log(`Mostrando alerta: ${mensagem} (${tipo})`);
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${tipo} alert-dismissible fade show`;
        alertDiv.role = 'alert';
        
        alertDiv.innerHTML = `
            ${mensagem}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        `;

        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(alertDiv, container.firstChild);
            
            // Remove o alerta após 5 segundos
            setTimeout(() => {
                alertDiv.remove();
            }, 5000);
        } else {
            console.error('Container não encontrado para mostrar alerta');
        }
    },

    // Função para formatar telefone
    formatarTelefone: function(telefone) {
        telefone = telefone.replace(/\D/g, '');
        return telefone.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    },

    // Função para salvar dados no localStorage
    salvarDados: function(chave, dados) {
        if (!chave) {
            console.error('Chave não fornecida para salvar dados');
            throw new Error('Chave de armazenamento não fornecida');
        }

        try {
            console.log(`Salvando dados em ${chave}:`, dados);
            const dadosString = JSON.stringify(dados);
            localStorage.setItem(chave, dadosString);
            console.log(`Dados salvos com sucesso em ${chave}`);
        } catch (error) {
            console.error(`Erro ao salvar dados em ${chave}:`, error);
            throw error;
        }
    },

    // Função para carregar dados do localStorage
    carregarDados: function(chave) {
        if (!chave) {
            console.error('Chave não fornecida para carregar dados');
            throw new Error('Chave de armazenamento não fornecida');
        }

        try {
            console.log(`Carregando dados de ${chave}`);
            const dadosString = localStorage.getItem(chave);
            
            if (!dadosString) {
                console.log(`Nenhum dado encontrado em ${chave}`);
                return [];
            }

            const dados = JSON.parse(dadosString);
            console.log(`Dados carregados de ${chave}:`, dados);
            return dados;
        } catch (error) {
            console.error(`Erro ao carregar dados de ${chave}:`, error);
            throw error;
        }
    }
}; 