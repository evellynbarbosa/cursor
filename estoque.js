const EstoqueView = {
    init: function() {
        this.renderizar();
        this.configurarEventos();
    },

    renderizar: function() {
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="row">
                <div class="col-md-12">
                    <h2>Controle de Estoque</h2>
                    <div class="card">
                        <div class="card-body">
                            <form id="formEstoque">
                                <div class="form-row">
                                    <div class="form-group col-md-4">
                                        <label class="required">Tipo</label>
                                        <select class="form-control" id="tipo" required>
                                            <option value="">Selecione...</option>
                                            <option value="produto">Produto Pronto</option>
                                            <option value="embalagem">Embalagem/Descartável</option>
                                            <option value="ingrediente">Ingrediente</option>
                                        </select>
                                    </div>
                                    <div class="form-group col-md-5">
                                        <label class="required">Nome do Item</label>
                                        <input type="text" class="form-control" id="nome" required>
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label class="required">Quantidade</label>
                                        <input type="number" class="form-control" id="quantidade" min="0" required>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary">Adicionar ao Estoque</button>
                            </form>
                        </div>
                    </div>

                    <div class="row mt-4">
                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">Produtos Prontos</h5>
                                    <div class="table-responsive">
                                        <table class="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Nome</th>
                                                    <th>Qtd</th>
                                                    <th>Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody id="tabelaProdutosProntos"></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">Embalagens e Descartáveis</h5>
                                    <div class="table-responsive">
                                        <table class="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Nome</th>
                                                    <th>Qtd</th>
                                                    <th>Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody id="tabelaEmbalagens"></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">Ingredientes</h5>
                                    <div class="table-responsive">
                                        <table class="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Nome</th>
                                                    <th>Qtd</th>
                                                    <th>Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody id="tabelaIngredientes"></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.atualizarTabelas();
    },

    configurarEventos: function() {
        const form = document.getElementById('formEstoque');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const tipo = document.getElementById('tipo').value;
            const nome = document.getElementById('nome').value;
            const quantidade = parseInt(document.getElementById('quantidade').value);

            const item = new ItemEstoque(tipo, nome, quantidade);
            estoqueManager.add(item);
            
            Utils.mostrarAlerta('Item adicionado ao estoque com sucesso!', 'success');
            form.reset();
            this.atualizarTabelas();
        });
    },

    atualizarTabelas: function() {
        const itens = estoqueManager.getAll();
        
        // Atualiza tabela de produtos prontos
        const produtosProntos = itens.filter(item => item.tipo === 'produto');
        document.getElementById('tabelaProdutosProntos').innerHTML = this.gerarLinhasTabela(produtosProntos);
        
        // Atualiza tabela de embalagens
        const embalagens = itens.filter(item => item.tipo === 'embalagem');
        document.getElementById('tabelaEmbalagens').innerHTML = this.gerarLinhasTabela(embalagens);
        
        // Atualiza tabela de ingredientes
        const ingredientes = itens.filter(item => item.tipo === 'ingrediente');
        document.getElementById('tabelaIngredientes').innerHTML = this.gerarLinhasTabela(ingredientes);
    },

    gerarLinhasTabela: function(itens) {
        return itens.map(item => `
            <tr>
                <td>${item.nome}</td>
                <td>${item.quantidade}</td>
                <td>
                    <button class="btn btn-sm btn-info mr-1" onclick="EstoqueView.atualizarQuantidade('${item.id}')">
                        Atualizar
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="EstoqueView.excluir('${item.id}')">
                        Excluir
                    </button>
                </td>
            </tr>
        `).join('');
    },

    atualizarQuantidade: function(id) {
        const item = estoqueManager.getById(id);
        const novaQuantidade = prompt(`Digite a nova quantidade para ${item.nome}:`, item.quantidade);
        
        if (novaQuantidade !== null) {
            const quantidade = parseInt(novaQuantidade);
            if (!isNaN(quantidade) && quantidade >= 0) {
                estoqueManager.update(id, { quantidade });
                Utils.mostrarAlerta('Quantidade atualizada com sucesso!', 'success');
                this.atualizarTabelas();
            } else {
                Utils.mostrarAlerta('Quantidade inválida!', 'danger');
            }
        }
    },

    excluir: function(id) {
        if (confirm('Tem certeza que deseja excluir este item do estoque?')) {
            estoqueManager.delete(id);
            Utils.mostrarAlerta('Item excluído com sucesso!', 'success');
            this.atualizarTabelas();
        }
    }
}; 