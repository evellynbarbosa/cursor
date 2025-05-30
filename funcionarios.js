const FuncionariosView = {
    init: function() {
        this.renderizar();
        this.configurarEventos();
    },

    renderizar: function() {
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="row">
                <div class="col-md-12">
                    <h2>Gestão de Funcionários</h2>
                    <div class="card">
                        <div class="card-body">
                            <form id="formFuncionario">
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label class="required">Nome</label>
                                        <input type="text" class="form-control" id="nome" required>
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label class="required">CPF</label>
                                        <input type="text" class="form-control" id="cpf" required>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-4">
                                        <label class="required">Telefone</label>
                                        <input type="text" class="form-control" id="telefone" required>
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label class="required">Carga Horária</label>
                                        <input type="number" class="form-control" id="cargaHoraria" required>
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label class="required">Escala</label>
                                        <select class="form-control" id="escala" required>
                                            <option value="">Selecione...</option>
                                            <option value="6x1">6x1</option>
                                            <option value="5x2">5x2</option>
                                            <option value="12x36">12x36</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary">Salvar</button>
                            </form>
                        </div>
                    </div>

                    <div class="card mt-4">
                        <div class="card-body">
                            <h5 class="card-title">Funcionários Cadastrados</h5>
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>CPF</th>
                                            <th>Telefone</th>
                                            <th>Carga Horária</th>
                                            <th>Escala</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tabelaFuncionarios"></tbody>
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
        const form = document.getElementById('formFuncionario');
        const cpfInput = document.getElementById('cpf');
        const telefoneInput = document.getElementById('telefone');

        // Máscara para CPF
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                e.target.value = value;
            }
        });

        // Máscara para telefone
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                e.target.value = value;
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value;
            const cpf = document.getElementById('cpf').value;
            const telefone = document.getElementById('telefone').value;
            const cargaHoraria = document.getElementById('cargaHoraria').value;
            const escala = document.getElementById('escala').value;

            // Validar CPF
            if (!Utils.validarCPF(cpf)) {
                Utils.mostrarAlerta('CPF inválido!', 'danger');
                return;
            }

            const funcionario = new Funcionario(nome, cpf, telefone, cargaHoraria, escala);
            funcionariosManager.add(funcionario);
            
            Utils.mostrarAlerta('Funcionário cadastrado com sucesso!', 'success');
            form.reset();
            this.atualizarTabela();
        });
    },

    atualizarTabela: function() {
        const tbody = document.getElementById('tabelaFuncionarios');
        const funcionarios = funcionariosManager.getAll();

        tbody.innerHTML = funcionarios.map(func => `
            <tr>
                <td>${func.nome}</td>
                <td>${func.cpf}</td>
                <td>${func.telefone}</td>
                <td>${func.cargaHoraria}h</td>
                <td>${func.escala}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="FuncionariosView.excluir('${func.id}')">
                        Excluir
                    </button>
                </td>
            </tr>
        `).join('');
    },

    excluir: function(id) {
        if (confirm('Tem certeza que deseja excluir este funcionário?')) {
            funcionariosManager.delete(id);
            Utils.mostrarAlerta('Funcionário excluído com sucesso!', 'success');
            this.atualizarTabela();
        }
    }
}; 