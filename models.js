// Classe base para todos os modelos
class Model {
    constructor() {
        this.id = Utils.gerarId();
    }
}

// Modelo de Funcionário
class Funcionario extends Model {
    constructor(nome, cpf, telefone, cargaHoraria, escala) {
        super();
        this.nome = nome;
        this.cpf = cpf;
        this.telefone = telefone;
        this.cargaHoraria = cargaHoraria;
        this.escala = escala;
    }
}

// Modelo de Produto
class Produto extends Model {
    constructor(nome, quantidade, valor) {
        super();
        this.nome = nome;
        this.quantidade = quantidade;
        this.valor = valor;
    }
}

// Modelo de Item de Estoque
class ItemEstoque extends Model {
    constructor(tipo, nome, quantidade) {
        super();
        this.tipo = tipo; // 'produto', 'embalagem', 'ingrediente'
        this.nome = nome;
        this.quantidade = quantidade;
    }
}

// Modelo de Serviço
class Servico extends Model {
    constructor(descricao, preco) {
        super();
        this.descricao = descricao;
        this.preco = parseFloat(preco); // Garante que o preço seja um número
    }
}

// Modelo de Movimento de Serviço
class MovimentoServico extends Model {
    constructor(cliente, servicos, valorTotal, data) {
        super();
        this.cliente = cliente;
        this.servicos = servicos; // Array de IDs de serviços
        this.valorTotal = parseFloat(valorTotal); // Garante que o valor total seja um número
        this.data = data || new Date();
    }
}

// Gerenciador de Dados
class DataManager {
    constructor(storageKey) {
        this.storageKey = storageKey;
        this.items = [];
        this.loadFromStorage();
    }

    loadFromStorage() {
        try {
            const data = Utils.carregarDados(this.storageKey);
            this.items = Array.isArray(data) ? data : [];
            console.log(`Dados carregados para ${this.storageKey}:`, this.items);
        } catch (error) {
            console.error(`Erro ao carregar dados de ${this.storageKey}:`, error);
            this.items = [];
        }
    }

    add(item) {
        if (!item || !item.id) {
            console.error('Item inválido:', item);
            throw new Error('Item inválido');
        }
        this.items.push(item);
        this.save();
        console.log(`Item adicionado a ${this.storageKey}:`, item);
        return item;
    }

    update(id, newData) {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            this.items[index] = { ...this.items[index], ...newData };
            this.save();
            console.log(`Item atualizado em ${this.storageKey}:`, this.items[index]);
            return true;
        }
        console.error(`Item não encontrado em ${this.storageKey}:`, id);
        return false;
    }

    delete(id) {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            const deletedItem = this.items.splice(index, 1)[0];
            this.save();
            console.log(`Item removido de ${this.storageKey}:`, deletedItem);
            return true;
        }
        console.error(`Item não encontrado para exclusão em ${this.storageKey}:`, id);
        return false;
    }

    getAll() {
        return this.items;
    }

    getById(id) {
        const item = this.items.find(item => item.id === id);
        if (!item) {
            console.error(`Item não encontrado em ${this.storageKey}:`, id);
        }
        return item;
    }

    save() {
        try {
            Utils.salvarDados(this.storageKey, this.items);
            console.log(`Dados salvos em ${this.storageKey}:`, this.items);
        } catch (error) {
            console.error(`Erro ao salvar dados em ${this.storageKey}:`, error);
        }
    }

    clear() {
        this.items = [];
        this.save();
        console.log(`Dados limpos em ${this.storageKey}`);
    }
}

// Instâncias dos gerenciadores de dados
const funcionariosManager = new DataManager('funcionarios');
const produtosManager = new DataManager('produtos');
const estoqueManager = new DataManager('estoque');
const servicosManager = new DataManager('servicos');
const movimentosManager = new DataManager('movimentos'); 