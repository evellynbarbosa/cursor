class Cliente {
    constructor(nome, cpf, telefone, endereco, dataNascimento, jaComprou = false) {
        this.id = Utils.gerarId();
        this.nome = nome;
        this.cpf = cpf;
        this.telefone = telefone;
        this.endereco = endereco;
        this.dataNascimento = dataNascimento;
        this.jaComprou = jaComprou;
    }
}

class CoffeeBreak {
    constructor(tipoEvento, dataHora, local, quantidadePessoas, itensIncluidos, montagemLocal, valorFechado) {
        this.id = Utils.gerarId();
        this.tipoEvento = tipoEvento;
        this.dataHora = dataHora;
        this.local = local;
        this.quantidadePessoas = quantidadePessoas;
        this.itensIncluidos = itensIncluidos;
        this.montagemLocal = montagemLocal;
        this.valorFechado = valorFechado;
    }
}

class Servico {
    constructor(tipo, descricao, preco) {
        this.id = Utils.gerarId();
        this.tipo = tipo;
        this.descricao = descricao;
        this.preco = preco;
    }
}

class EncomendaBolo {
    constructor(nomeCliente, telefone, dataEntrega, tipoBolo, saborMassa, recheio, cobertura, 
                peso, tamanho, mensagem, valorTotal, formaPagamento) {
        this.id = Utils.gerarId();
        this.nomeCliente = nomeCliente;
        this.telefone = telefone;
        this.dataEntrega = dataEntrega;
        this.tipoBolo = tipoBolo;
        this.saborMassa = saborMassa;
        this.recheio = recheio;
        this.cobertura = cobertura;
        this.peso = peso;
        this.tamanho = tamanho;
        this.mensagem = mensagem;
        this.valorTotal = valorTotal;
        this.formaPagamento = formaPagamento;
        this.status = 'Em andamento';
    }
}

// Gerenciador de dados
const DataManager = {
    // Chaves para localStorage
    KEYS: {
        CLIENTES: 'clientes',
        COFFEE_BREAK: 'coffeeBreak',
        SERVICOS: 'servicos',
        ENCOMENDAS: 'encomendas'
    },

    // Métodos para Clientes
    salvarCliente: function(cliente) {
        const clientes = this.getClientes();
        clientes.push(cliente);
        Utils.salvarDados(this.KEYS.CLIENTES, clientes);
    },

    getClientes: function() {
        return Utils.carregarDados(this.KEYS.CLIENTES) || [];
    },

    // Métodos para Coffee Break
    salvarCoffeeBreak: function(coffeeBreak) {
        const eventos = this.getCoffeeBreaks();
        eventos.push(coffeeBreak);
        Utils.salvarDados(this.KEYS.COFFEE_BREAK, eventos);
    },

    getCoffeeBreaks: function() {
        return Utils.carregarDados(this.KEYS.COFFEE_BREAK) || [];
    },

    // Métodos para Serviços
    salvarServico: function(servico) {
        const servicos = this.getServicos();
        servicos.push(servico);
        Utils.salvarDados(this.KEYS.SERVICOS, servicos);
    },

    getServicos: function() {
        return Utils.carregarDados(this.KEYS.SERVICOS) || [];
    },

    // Métodos para Encomendas
    salvarEncomenda: function(encomenda) {
        const encomendas = this.getEncomendas();
        encomendas.push(encomenda);
        Utils.salvarDados(this.KEYS.ENCOMENDAS, encomendas);
    },

    getEncomendas: function() {
        return Utils.carregarDados(this.KEYS.ENCOMENDAS) || [];
    },

    // Métodos genéricos de atualização e remoção
    atualizarItem: function(key, id, novosDados) {
        const items = Utils.carregarDados(key) || [];
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...novosDados };
            Utils.salvarDados(key, items);
            return true;
        }
        return false;
    },

    removerItem: function(key, id) {
        const items = Utils.carregarDados(key) || [];
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items.splice(index, 1);
            Utils.salvarDados(key, items);
            return true;
        }
        return false;
    }
}; 