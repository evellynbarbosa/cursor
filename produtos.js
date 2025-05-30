const ProdutosView = {
    init: function() {
        this.renderizar();
        this.configurarEventos();
    },

    renderizar: function() {
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="row">
                <div class="col-md-12">
                    <h2>Gestão de Produtos</h2>
                    <div class="card">
                        <div class="card-body">
                            <form id="formProduto">
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label class="required">Nome do Produto</label>
                                        <input type="text" class="form-control" id="nome" required>
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label class="required">Quantidade</label>
                                        <input type="number" class="form-control" id="quantidade" min="0" required>
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label class="required">Valor (R$)</label>
                                        <input type="number" class="form-control" id="valor" min="0" step="0.01" required>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary">Salvar</button>
                            </form>
                        </div>
                    </div>

                    <div class="card mt-4">
                        <div class="card-body">
                            <h5 class="card-title">Produtos Cadastrados</h5>
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Quantidade</th>
                                            <th>Valor</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tabelaProdutos"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.atualizarTabela();
    },

    configurarEventos: function() {
        const form = document.getElementById('formProduto');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value;
            const quantidade = parseInt(document.getElementById('quantidade').value);
            const valor = parseFloat(document.getElementById('valor').value);

            const produto = new Produto(nome, quantidade, valor);
            produtosManager.add(produto);
            
            Utils.mostrarAlerta('Produto cadastrado com sucesso!', 'success');
            form.reset();
            this.atualizarTabela();
        });
    },

    atualizarTabela: function() {
        const tbody = document.getElementById('tabelaProdutos');
        const produtos = produtosManager.getAll();

        tbody.innerHTML = produtos.map(prod => `
            <tr>
                <td>${prod.nome}</td>
                <td>${prod.quantidade}</td>
                <td>${Utils.formatarMoeda(prod.valor)}</td>
                <td>
                    <button class="btn btn-sm btn-info mr-2" onclick="ProdutosView.atualizarQuantidade('${prod.id}')">
                        Atualizar Quantidade
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="ProdutosView.excluir('${prod.id}')">
                        Excluir
                    </button>
                </td>
            </tr>
        `).join('');
    },

    atualizarQuantidade: function(id) {
        const produto = produtosManager.getById(id);
        const novaQuantidade = prompt(`Digite a nova quantidade para ${produto.nome}:`, produto.quantidade);
        
        if (novaQuantidade !== null) {
            const quantidade = parseInt(novaQuantidade);
            if (!isNaN(quantidade) && quantidade >= 0) {
                produtosManager.update(id, { quantidade });
                Utils.mostrarAlerta('Quantidade atualizada com sucesso!', 'success');
                this.atualizarTabela();
            } else {
                Utils.mostrarAlerta('Quantidade inválida!', 'danger');
            }
        }
    },

    excluir: function(id) {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            produtosManager.delete(id);
            Utils.mostrarAlerta('Produto excluído com sucesso!', 'success');
            this.atualizarTabela();
        }
    }
}; 