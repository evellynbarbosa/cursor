const MovimentosView = {
    init: function() {
        console.log('Inicializando MovimentosView');
        this.renderizar();
        this.configurarEventos();
    },

    renderizar: function() {
        console.log('Renderizando MovimentosView');
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="row">
                <div class="col-md-12">
                    <h2>Movimentos de Serviços</h2>
                    <div class="card">
                        <div class="card-body">
                            <form id="formMovimento">
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label class="required">Nome do Cliente</label>
                                        <input type="text" class="form-control" id="cliente" required>
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label class="required">Serviços</label>
                                        <select multiple class="form-control" id="servicosSelect" required>
                                            ${this.gerarOpcoesServicos()}
                                        </select>
                                        <small class="form-text text-muted">Pressione Ctrl (ou Command no Mac) para selecionar múltiplos serviços</small>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-12">
                                        <label>Valor Total</label>
                                        <input type="text" class="form-control" id="valorTotal" readonly>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary">Registrar Movimento</button>
                            </form>
                        </div>
                    </div>

                    <div class="card mt-4">
                        <div class="card-body">
                            <h5 class="card-title">Histórico de Movimentos</h5>
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Data</th>
                                            <th>Cliente</th>
                                            <th>Serviços</th>
                                            <th>Valor Total</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tabelaMovimentos"></tbody>
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
        console.log('Configurando eventos');
        const form = document.getElementById('formMovimento');
        const servicosSelect = document.getElementById('servicosSelect');

        if (!form || !servicosSelect) {
            console.error('Elementos do formulário não encontrados');
            return;
        }

        // Atualiza o valor total quando os serviços são alterados
        servicosSelect.addEventListener('change', () => {
            console.log('Serviços selecionados alterados');
            this.atualizarValorTotal();
        });
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Formulário submetido');
            
            const cliente = document.getElementById('cliente').value;
            
            if (!cliente) {
                Utils.mostrarAlerta('Digite o nome do cliente!', 'danger');
                return;
            }

            const servicosSelecionados = Array.from(servicosSelect.selectedOptions)
                .map(option => option.value);
            
            console.log('Serviços selecionados:', servicosSelecionados);

            if (servicosSelecionados.length === 0) {
                Utils.mostrarAlerta('Selecione pelo menos um serviço!', 'danger');
                return;
            }

            const valorTotal = this.calcularValorTotal(servicosSelecionados);
            console.log('Valor total calculado:', valorTotal);

            if (valorTotal <= 0) {
                Utils.mostrarAlerta('Erro ao calcular o valor total!', 'danger');
                return;
            }

            try {
                const movimento = new MovimentoServico(cliente, servicosSelecionados, valorTotal);
                console.log('Movimento criado:', movimento);
                
                movimentosManager.add(movimento);
                console.log('Movimento adicionado ao manager');
                
                Utils.mostrarAlerta('Movimento registrado com sucesso!', 'success');
                form.reset();
                document.getElementById('valorTotal').value = '';
                this.atualizarTabela();
            } catch (error) {
                console.error('Erro ao salvar movimento:', error);
                Utils.mostrarAlerta('Erro ao salvar o movimento!', 'danger');
            }
        });
    },

    atualizarValorTotal: function() {
        const servicosSelect = document.getElementById('servicosSelect');
        const valorTotalInput = document.getElementById('valorTotal');

        if (!servicosSelect || !valorTotalInput) {
            console.error('Elementos não encontrados');
            return;
        }

        const servicosSelecionados = Array.from(servicosSelect.selectedOptions)
            .map(option => option.value);
        
        const valorTotal = this.calcularValorTotal(servicosSelecionados);
        console.log('Valor total atualizado:', valorTotal);
        
        valorTotalInput.value = Utils.formatarMoeda(valorTotal);
    },

    calcularValorTotal: function(servicosIds) {
        if (!Array.isArray(servicosIds)) {
            console.error('servicosIds não é um array:', servicosIds);
            return 0;
        }

        try {
            const total = servicosIds.reduce((total, servicoId) => {
                const servico = servicosManager.getById(servicoId);
                if (!servico) {
                    console.error('Serviço não encontrado:', servicoId);
                    return total;
                }
                const preco = parseFloat(servico.preco) || 0;
                console.log(`Serviço ${servicoId}: ${preco}`);
                return total + preco;
            }, 0);

            console.log('Total calculado:', total);
            return total;
        } catch (error) {
            console.error('Erro ao calcular valor total:', error);
            return 0;
        }
    },

    gerarOpcoesServicos: function() {
        const servicos = servicosManager.getAll();
        console.log('Serviços disponíveis:', servicos);

        if (!servicos || servicos.length === 0) {
            return '<option value="" disabled>Nenhum serviço cadastrado</option>';
        }

        return servicos.map(servico => `
            <option value="${servico.id}">
                ${servico.descricao} - ${Utils.formatarMoeda(servico.preco)}
            </option>
        `).join('');
    },

    atualizarTabela: function() {
        const tbody = document.getElementById('tabelaMovimentos');
        if (!tbody) {
            console.error('Tabela de movimentos não encontrada');
            return;
        }

        const movimentos = movimentosManager.getAll();
        console.log('Movimentos para exibir:', movimentos);

        if (!movimentos || movimentos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">Nenhum movimento registrado</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = movimentos.map(mov => {
            const servicosDesc = mov.servicos.map(servicoId => {
                const servico = servicosManager.getById(servicoId);
                return servico ? servico.descricao : 'Serviço não encontrado';
            }).join(', ');

            return `
                <tr>
                    <td>${new Date(mov.data).toLocaleString()}</td>
                    <td>${mov.cliente}</td>
                    <td>${servicosDesc}</td>
                    <td>${Utils.formatarMoeda(mov.valorTotal)}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="MovimentosView.excluir('${mov.id}')">
                            Excluir
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    excluir: function(id) {
        if (confirm('Tem certeza que deseja excluir este movimento?')) {
            try {
                movimentosManager.delete(id);
                Utils.mostrarAlerta('Movimento excluído com sucesso!', 'success');
                this.atualizarTabela();
            } catch (error) {
                console.error('Erro ao excluir movimento:', error);
                Utils.mostrarAlerta('Erro ao excluir o movimento!', 'danger');
            }
        }
    }
}; 