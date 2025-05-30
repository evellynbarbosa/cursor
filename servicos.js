const ServicosView = {
    init: function() {
        console.log('Inicializando ServicosView');
        this.renderizar();
        this.configurarEventos();
    },

    renderizar: function() {
        console.log('Renderizando ServicosView');
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="row">
                <div class="col-md-12">
                    <h2>Gestão de Serviços</h2>
                    <div class="card">
                        <div class="card-body">
                            <form id="formServico">
                                <div class="form-row">
                                    <div class="form-group col-md-8">
                                        <label class="required">Descrição do Serviço</label>
                                        <input type="text" class="form-control" id="descricao" required>
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label class="required">Preço (R$)</label>
                                        <input type="number" class="form-control" id="preco" min="0" step="0.01" required>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary">Cadastrar Serviço</button>
                            </form>
                        </div>
                    </div>

                    <div class="card mt-4">
                        <div class="card-body">
                            <h5 class="card-title">Serviços Disponíveis</h5>
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Descrição</th>
                                            <th>Preço</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tabelaServicos"></tbody>
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
        console.log('Configurando eventos ServicosView');
        const form = document.getElementById('formServico');
        
        if (!form) {
            console.error('Formulário de serviços não encontrado');
            return;
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Formulário de serviço submetido');
            
            const descricao = document.getElementById('descricao').value.trim();
            const preco = parseFloat(document.getElementById('preco').value);

            if (!descricao) {
                Utils.mostrarAlerta('Digite a descrição do serviço!', 'danger');
                return;
            }

            if (isNaN(preco) || preco <= 0) {
                Utils.mostrarAlerta('Digite um preço válido!', 'danger');
                return;
            }

            try {
                console.log('Criando novo serviço:', { descricao, preco });
                const servico = new Servico(descricao, preco);
                servicosManager.add(servico);
                
                console.log('Serviço cadastrado:', servico);
                Utils.mostrarAlerta('Serviço cadastrado com sucesso!', 'success');
                
                form.reset();
                this.atualizarTabela();
            } catch (error) {
                console.error('Erro ao cadastrar serviço:', error);
                Utils.mostrarAlerta('Erro ao cadastrar serviço!', 'danger');
            }
        });
    },

    atualizarTabela: function() {
        console.log('Atualizando tabela de serviços');
        const tbody = document.getElementById('tabelaServicos');
        
        if (!tbody) {
            console.error('Tabela de serviços não encontrada');
            return;
        }

        const servicos = servicosManager.getAll();
        console.log('Serviços encontrados:', servicos);

        if (!servicos || servicos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center">Nenhum serviço cadastrado</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = servicos.map(serv => `
            <tr>
                <td>${serv.descricao}</td>
                <td>${Utils.formatarMoeda(serv.preco)}</td>
                <td>
                    <button class="btn btn-sm btn-info mr-2" onclick="ServicosView.editar('${serv.id}')">
                        Editar
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="ServicosView.excluir('${serv.id}')">
                        Excluir
                    </button>
                </td>
            </tr>
        `).join('');
    },

    editar: function(id) {
        console.log('Editando serviço:', id);
        const servico = servicosManager.getById(id);
        
        if (!servico) {
            Utils.mostrarAlerta('Serviço não encontrado!', 'danger');
            return;
        }

        const novoPreco = prompt(`Digite o novo preço para ${servico.descricao}:`, servico.preco);
        
        if (novoPreco !== null) {
            const preco = parseFloat(novoPreco);
            if (!isNaN(preco) && preco > 0) {
                try {
                    servicosManager.update(id, { preco });
                    console.log('Serviço atualizado:', { id, preco });
                    Utils.mostrarAlerta('Preço atualizado com sucesso!', 'success');
                    this.atualizarTabela();
                } catch (error) {
                    console.error('Erro ao atualizar serviço:', error);
                    Utils.mostrarAlerta('Erro ao atualizar o preço!', 'danger');
                }
            } else {
                Utils.mostrarAlerta('Preço inválido!', 'danger');
            }
        }
    },

    excluir: function(id) {
        console.log('Excluindo serviço:', id);
        if (confirm('Tem certeza que deseja excluir este serviço?')) {
            try {
                servicosManager.delete(id);
                console.log('Serviço excluído:', id);
                Utils.mostrarAlerta('Serviço excluído com sucesso!', 'success');
                this.atualizarTabela();
            } catch (error) {
                console.error('Erro ao excluir serviço:', error);
                Utils.mostrarAlerta('Erro ao excluir o serviço!', 'danger');
            }
        }
    }
}; 