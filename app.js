// Gerenciador da aplicação
const App = {
    init: function() {
        this.setupEventListeners();
        this.carregarPaginaInicial();
    },

    setupEventListeners: function() {
        // Navegação
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pagina = e.target.getAttribute('data-page');
                this.carregarPagina(pagina);
            });
        });

        // Eventos de formulários
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'clienteForm') {
                e.preventDefault();
                this.salvarCliente(e.target);
            } else if (e.target.id === 'coffeeBreakForm') {
                e.preventDefault();
                this.salvarCoffeeBreak(e.target);
            } else if (e.target.id === 'servicoForm') {
                e.preventDefault();
                this.salvarServico(e.target);
            } else if (e.target.id === 'encomendaForm') {
                e.preventDefault();
                this.salvarEncomenda(e.target);
            }
        });
    },

    carregarPaginaInicial: function() {
        this.carregarPagina('clientes');
    },

    carregarPagina: function(pagina) {
        const template = document.getElementById(`${pagina}Template`);
        if (template) {
            const mainContent = document.getElementById('mainContent');
            mainContent.innerHTML = template.innerHTML;

            // Carregar dados específicos da página
            switch(pagina) {
                case 'clientes':
                    this.carregarClientes();
                    break;
                case 'coffee-break':
                    this.carregarCoffeeBreaks();
                    break;
                case 'servicos':
                    this.carregarServicos();
                    break;
                case 'encomendas':
                    this.carregarEncomendas();
                    break;
            }
        }
    },

    // Métodos para Cliente
    salvarCliente: function(form) {
        const cpf = form.cpf.value;
        if (!Utils.validarCPF(cpf)) {
            Utils.mostrarAlerta('CPF inválido!', 'danger');
            return;
        }

        const clienteData = {
            nome: form.nome.value,
            cpf: Utils.formatarCPF(cpf),
            telefone: Utils.formatarTelefone(form.telefone.value),
            endereco: form.endereco.value,
            dataNascimento: form.dataNascimento.value,
            jaComprou: form.jaComprou.checked
        };

        const editId = form.querySelector('input[name="editId"]')?.value;
        
        if (editId) {
            // Atualização
            if (DataManager.atualizarItem(DataManager.KEYS.CLIENTES, editId, clienteData)) {
                Utils.mostrarAlerta('Cliente atualizado com sucesso!');
                form.querySelector('input[name="editId"]').remove();
                form.querySelector('button[type="submit"]').textContent = 'Salvar';
            }
        } else {
            // Novo registro
            const cliente = new Cliente(
                clienteData.nome,
                clienteData.cpf,
                clienteData.telefone,
                clienteData.endereco,
                clienteData.dataNascimento,
                clienteData.jaComprou
            );
            DataManager.salvarCliente(cliente);
            Utils.mostrarAlerta('Cliente salvo com sucesso!');
        }

        form.reset();
        this.carregarClientes();
    },

    carregarClientes: function() {
        const clientes = DataManager.getClientes();
        const tbody = document.querySelector('#clientesTable tbody');
        if (tbody) {
            tbody.innerHTML = clientes.map(cliente => `
                <tr>
                    <td>${cliente.nome}</td>
                    <td>${cliente.cpf}</td>
                    <td>${cliente.telefone}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="App.editarCliente('${cliente.id}')">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="App.excluirCliente('${cliente.id}')">Excluir</button>
                    </td>
                </tr>
            `).join('');
        }
    },

    editarCliente: function(id) {
        const clientes = DataManager.getClientes();
        const cliente = clientes.find(c => c.id === id);
        
        if (cliente) {
            const form = document.getElementById('clienteForm');
            form.nome.value = cliente.nome;
            form.cpf.value = cliente.cpf;
            form.telefone.value = cliente.telefone;
            form.endereco.value = cliente.endereco;
            form.dataNascimento.value = cliente.dataNascimento;
            form.jaComprou.checked = cliente.jaComprou;

            // Adicionar ID oculto e mudar botão
            if (!form.querySelector('input[name="editId"]')) {
                const idInput = document.createElement('input');
                idInput.type = 'hidden';
                idInput.name = 'editId';
                form.appendChild(idInput);
            }
            form.querySelector('input[name="editId"]').value = id;
            
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Atualizar';
            
            // Scroll para o formulário
            form.scrollIntoView({ behavior: 'smooth' });
        }
    },

    excluirCliente: function(id) {
        if (confirm('Deseja realmente excluir este cliente?')) {
            DataManager.removerItem(DataManager.KEYS.CLIENTES, id);
            Utils.mostrarAlerta('Cliente excluído com sucesso!');
            this.carregarClientes();
        }
    },

    // Métodos para Coffee Break
    salvarCoffeeBreak: function(form) {
        const coffeeBreakData = {
            tipoEvento: form.tipoEvento.value,
            dataHora: form.dataHora.value,
            local: form.local.value,
            quantidadePessoas: parseInt(form.quantidadePessoas.value),
            itensIncluidos: form.itensIncluidos.value.split('\n'),
            montagemLocal: form.montagemLocal.checked,
            valorFechado: parseFloat(form.valorFechado.value)
        };

        const editId = form.querySelector('input[name="editId"]')?.value;
        
        if (editId) {
            if (DataManager.atualizarItem(DataManager.KEYS.COFFEE_BREAK, editId, coffeeBreakData)) {
                Utils.mostrarAlerta('Coffee Break atualizado com sucesso!');
                form.querySelector('input[name="editId"]').remove();
                form.querySelector('button[type="submit"]').textContent = 'Salvar';
            }
        } else {
            const coffeeBreak = new CoffeeBreak(
                coffeeBreakData.tipoEvento,
                coffeeBreakData.dataHora,
                coffeeBreakData.local,
                coffeeBreakData.quantidadePessoas,
                coffeeBreakData.itensIncluidos,
                coffeeBreakData.montagemLocal,
                coffeeBreakData.valorFechado
            );
            DataManager.salvarCoffeeBreak(coffeeBreak);
            Utils.mostrarAlerta('Coffee Break salvo com sucesso!');
        }

        form.reset();
        this.carregarCoffeeBreaks();
    },

    carregarCoffeeBreaks: function() {
        const eventos = DataManager.getCoffeeBreaks();
        const mainContent = document.getElementById('mainContent');
        
        // Adicionar tabela se não existir
        if (!document.getElementById('coffeeBreakTable')) {
            const tabelaHTML = `
                <div class="card mt-4">
                    <div class="card-header">
                        <h3>Coffee Breaks Cadastrados</h3>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-striped" id="coffeeBreakTable">
                                <thead>
                                    <tr>
                                        <th>Tipo do Evento</th>
                                        <th>Data/Hora</th>
                                        <th>Local</th>
                                        <th>Valor</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
            mainContent.insertAdjacentHTML('beforeend', tabelaHTML);
        }

        const tbody = document.querySelector('#coffeeBreakTable tbody');
        if (tbody) {
            tbody.innerHTML = eventos.map(evento => `
                <tr>
                    <td>${evento.tipoEvento}</td>
                    <td>${new Date(evento.dataHora).toLocaleString('pt-BR')}</td>
                    <td>${evento.local}</td>
                    <td>${Utils.formatarMoeda(evento.valorFechado)}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="App.editarCoffeeBreak('${evento.id}')">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="App.excluirCoffeeBreak('${evento.id}')">Excluir</button>
                    </td>
                </tr>
            `).join('');
        }
    },

    editarCoffeeBreak: function(id) {
        const eventos = DataManager.getCoffeeBreaks();
        const evento = eventos.find(e => e.id === id);
        
        if (evento) {
            const form = document.getElementById('coffeeBreakForm');
            form.tipoEvento.value = evento.tipoEvento;
            form.dataHora.value = evento.dataHora;
            form.local.value = evento.local;
            form.quantidadePessoas.value = evento.quantidadePessoas;
            form.itensIncluidos.value = evento.itensIncluidos.join('\n');
            form.montagemLocal.checked = evento.montagemLocal;
            form.valorFechado.value = evento.valorFechado;

            if (!form.querySelector('input[name="editId"]')) {
                const idInput = document.createElement('input');
                idInput.type = 'hidden';
                idInput.name = 'editId';
                form.appendChild(idInput);
            }
            form.querySelector('input[name="editId"]').value = id;
            
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Atualizar';
            
            form.scrollIntoView({ behavior: 'smooth' });
        }
    },

    excluirCoffeeBreak: function(id) {
        if (confirm('Deseja realmente excluir este Coffee Break?')) {
            DataManager.removerItem(DataManager.KEYS.COFFEE_BREAK, id);
            Utils.mostrarAlerta('Coffee Break excluído com sucesso!');
            this.carregarCoffeeBreaks();
        }
    },

    // Métodos para Serviços
    salvarServico: function(form) {
        const servicoData = {
            tipo: form.tipo.value,
            descricao: form.descricao.value,
            preco: parseFloat(form.preco.value)
        };

        const editId = form.querySelector('input[name="editId"]')?.value;
        
        if (editId) {
            if (DataManager.atualizarItem(DataManager.KEYS.SERVICOS, editId, servicoData)) {
                Utils.mostrarAlerta('Serviço atualizado com sucesso!');
                form.querySelector('input[name="editId"]').remove();
                form.querySelector('button[type="submit"]').textContent = 'Salvar';
            }
        } else {
            const servico = new Servico(
                servicoData.tipo,
                servicoData.descricao,
                servicoData.preco
            );
            DataManager.salvarServico(servico);
            Utils.mostrarAlerta('Serviço salvo com sucesso!');
        }

        form.reset();
        this.carregarServicos();
    },

    carregarServicos: function() {
        const servicos = DataManager.getServicos();
        const mainContent = document.getElementById('mainContent');
        
        // Adicionar tabela se não existir
        if (!document.getElementById('servicosTable')) {
            const tabelaHTML = `
                <div class="card mt-4">
                    <div class="card-header">
                        <h3>Serviços Cadastrados</h3>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-striped" id="servicosTable">
                                <thead>
                                    <tr>
                                        <th>Tipo</th>
                                        <th>Descrição</th>
                                        <th>Preço</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
            mainContent.insertAdjacentHTML('beforeend', tabelaHTML);
        }

        const tbody = document.querySelector('#servicosTable tbody');
        if (tbody) {
            tbody.innerHTML = servicos.map(servico => `
                <tr>
                    <td>${servico.tipo}</td>
                    <td>${servico.descricao}</td>
                    <td>${Utils.formatarMoeda(servico.preco)}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="App.editarServico('${servico.id}')">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="App.excluirServico('${servico.id}')">Excluir</button>
                    </td>
                </tr>
            `).join('');
        }
    },

    editarServico: function(id) {
        const servicos = DataManager.getServicos();
        const servico = servicos.find(s => s.id === id);
        
        if (servico) {
            const form = document.getElementById('servicoForm');
            form.tipo.value = servico.tipo;
            form.descricao.value = servico.descricao;
            form.preco.value = servico.preco;

            if (!form.querySelector('input[name="editId"]')) {
                const idInput = document.createElement('input');
                idInput.type = 'hidden';
                idInput.name = 'editId';
                form.appendChild(idInput);
            }
            form.querySelector('input[name="editId"]').value = id;
            
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Atualizar';
            
            form.scrollIntoView({ behavior: 'smooth' });
        }
    },

    excluirServico: function(id) {
        if (confirm('Deseja realmente excluir este serviço?')) {
            DataManager.removerItem(DataManager.KEYS.SERVICOS, id);
            Utils.mostrarAlerta('Serviço excluído com sucesso!');
            this.carregarServicos();
        }
    },

    // Métodos para Encomendas
    salvarEncomenda: function(form) {
        const encomendaData = {
            nomeCliente: form.nomeCliente.value,
            telefone: Utils.formatarTelefone(form.telefone.value),
            dataEntrega: form.dataEntrega.value,
            tipoBolo: form.tipoBolo.value,
            saborMassa: form.saborMassa.value,
            recheio: form.recheio.value,
            cobertura: form.cobertura.value,
            peso: parseFloat(form.peso.value),
            tamanho: form.tamanho.value,
            mensagem: form.mensagem.value,
            valorTotal: parseFloat(form.valorTotal.value),
            formaPagamento: form.formaPagamento.value
        };

        const editId = form.querySelector('input[name="editId"]')?.value;
        
        if (editId) {
            if (DataManager.atualizarItem(DataManager.KEYS.ENCOMENDAS, editId, encomendaData)) {
                Utils.mostrarAlerta('Encomenda atualizada com sucesso!');
                form.querySelector('input[name="editId"]').remove();
                form.querySelector('button[type="submit"]').textContent = 'Salvar';
            }
        } else {
            const encomenda = new EncomendaBolo(
                encomendaData.nomeCliente,
                encomendaData.telefone,
                encomendaData.dataEntrega,
                encomendaData.tipoBolo,
                encomendaData.saborMassa,
                encomendaData.recheio,
                encomendaData.cobertura,
                encomendaData.peso,
                encomendaData.tamanho,
                encomendaData.mensagem,
                encomendaData.valorTotal,
                encomendaData.formaPagamento
            );
            DataManager.salvarEncomenda(encomenda);
            Utils.mostrarAlerta('Encomenda salva com sucesso!');
        }

        form.reset();
        this.carregarEncomendas();
    },

    carregarEncomendas: function() {
        const encomendas = DataManager.getEncomendas();
        const mainContent = document.getElementById('mainContent');
        
        // Adicionar tabela se não existir
        if (!document.getElementById('encomendasTable')) {
            const tabelaHTML = `
                <div class="card mt-4">
                    <div class="card-header">
                        <h3>Encomendas Cadastradas</h3>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-striped" id="encomendasTable">
                                <thead>
                                    <tr>
                                        <th>Cliente</th>
                                        <th>Data Entrega</th>
                                        <th>Tipo de Bolo</th>
                                        <th>Mensagem</th>
                                        <th>Valor</th>
                                        <th>Status</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
            mainContent.insertAdjacentHTML('beforeend', tabelaHTML);
        }

        const tbody = document.querySelector('#encomendasTable tbody');
        if (tbody) {
            tbody.innerHTML = encomendas.map(encomenda => `
                <tr>
                    <td>${encomenda.nomeCliente}</td>
                    <td>${new Date(encomenda.dataEntrega).toLocaleString('pt-BR')}</td>
                    <td>${encomenda.tipoBolo}</td>
                    <td>${encomenda.mensagem || '-'}</td>
                    <td>${Utils.formatarMoeda(encomenda.valorTotal)}</td>
                    <td>
                        <select class="form-control form-control-sm" onchange="App.atualizarStatusEncomenda('${encomenda.id}', this.value)">
                            <option value="Em andamento" ${encomenda.status === 'Em andamento' ? 'selected' : ''}>Em andamento</option>
                            <option value="Pronto" ${encomenda.status === 'Pronto' ? 'selected' : ''}>Pronto</option>
                            <option value="Entregue" ${encomenda.status === 'Entregue' ? 'selected' : ''}>Entregue</option>
                        </select>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="App.editarEncomenda('${encomenda.id}')">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="App.excluirEncomenda('${encomenda.id}')">Excluir</button>
                    </td>
                </tr>
            `).join('');
        }
    },

    editarEncomenda: function(id) {
        const encomendas = DataManager.getEncomendas();
        const encomenda = encomendas.find(e => e.id === id);
        
        if (encomenda) {
            const form = document.getElementById('encomendaForm');
            form.nomeCliente.value = encomenda.nomeCliente;
            form.telefone.value = encomenda.telefone;
            form.dataEntrega.value = encomenda.dataEntrega;
            form.tipoBolo.value = encomenda.tipoBolo;
            form.saborMassa.value = encomenda.saborMassa;
            form.recheio.value = encomenda.recheio;
            form.cobertura.value = encomenda.cobertura;
            form.peso.value = encomenda.peso;
            form.tamanho.value = encomenda.tamanho;
            form.mensagem.value = encomenda.mensagem;
            form.valorTotal.value = encomenda.valorTotal;
            form.formaPagamento.value = encomenda.formaPagamento;

            if (!form.querySelector('input[name="editId"]')) {
                const idInput = document.createElement('input');
                idInput.type = 'hidden';
                idInput.name = 'editId';
                form.appendChild(idInput);
            }
            form.querySelector('input[name="editId"]').value = id;
            
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Atualizar';
            
            form.scrollIntoView({ behavior: 'smooth' });
        }
    },

    excluirEncomenda: function(id) {
        if (confirm('Deseja realmente excluir esta encomenda?')) {
            DataManager.removerItem(DataManager.KEYS.ENCOMENDAS, id);
            Utils.mostrarAlerta('Encomenda excluída com sucesso!');
            this.carregarEncomendas();
        }
    },

    atualizarStatusEncomenda: function(id, novoStatus) {
        if (DataManager.atualizarItem(DataManager.KEYS.ENCOMENDAS, id, { status: novoStatus })) {
            Utils.mostrarAlerta('Status da encomenda atualizado com sucesso!');
        }
    }
};

// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => App.init()); 