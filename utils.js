const Utils = {
    // Validação de CPF
    validarCPF: function(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');
        
        if (cpf.length !== 11) return false;
        
        // Verifica CPFs com dígitos iguais
        if (/^(\d)\1{10}$/.test(cpf)) return false;
        
        let soma = 0;
        let resto;
        
        // Primeiro dígito verificador
        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
        }
        
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;
        
        soma = 0;
        // Segundo dígito verificador
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
        }
        
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) return false;
        
        return true;
    },

    // Formatação de CPF
    formatarCPF: function(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    },

    // Formatação de telefone
    formatarTelefone: function(telefone) {
        telefone = telefone.replace(/[^\d]/g, '');
        if (telefone.length === 11) {
            return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    },

    // Formatação de moeda
    formatarMoeda: function(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    },

    // Formatação de data
    formatarData: function(data) {
        return new Date(data).toLocaleDateString('pt-BR');
    },

    // Exibir mensagem de alerta
    mostrarAlerta: function(mensagem, tipo = 'success') {
        const alertArea = document.getElementById('alertArea');
        const alert = document.createElement('div');
        alert.className = `alert alert-${tipo} alert-dismissible fade show`;
        alert.role = 'alert';
        alert.innerHTML = `
            ${mensagem}
            <button type="button" class="close" data-dismiss="alert">
                <span>&times;</span>
            </button>
        `;
        alertArea.appendChild(alert);
        
        // Remove o alerta após 5 segundos
        setTimeout(() => {
            alert.remove();
        }, 5000);
    },

    // Salvar dados no localStorage
    salvarDados: function(chave, dados) {
        localStorage.setItem(chave, JSON.stringify(dados));
    },

    // Carregar dados do localStorage
    carregarDados: function(chave) {
        const dados = localStorage.getItem(chave);
        return dados ? JSON.parse(dados) : null;
    },

    // Gerar ID único
    gerarId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}; 