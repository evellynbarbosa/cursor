// Objeto para gerenciar as views da aplicação
const App = {
    currentView: null,
    views: {
        funcionarios: FuncionariosView,
        produtos: ProdutosView,
        estoque: EstoqueView,
        servicos: ServicosView,
        movimentos: MovimentosView
    },

    init: function() {
        console.log('Iniciando aplicação...');
        
        // Verifica se os gerenciadores de dados estão funcionando
        console.log('Verificando dados...');
        console.log('Serviços:', servicosManager.getAll());
        console.log('Movimentos:', movimentosManager.getAll());

        this.configurarEventos();
        
        // Iniciar com a view de funcionários
        this.navegarPara('funcionarios');
    },

    configurarEventos: function() {
        console.log('Configurando eventos de navegação...');
        
        // Configurar eventos de navegação
        const links = document.querySelectorAll('.nav-link');
        console.log('Links de navegação encontrados:', links.length);

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.target.getAttribute('data-page');
                console.log('Navegando para:', view);
                if (view) {
                    this.navegarPara(view);
                }
            });
        });
    },

    navegarPara: function(viewName) {
        console.log('Mudando para view:', viewName);
        
        // Atualizar links ativos
        document.querySelectorAll('.nav-link').forEach(link => {
            const page = link.getAttribute('data-page');
            if (page === viewName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Inicializar a view selecionada
        const view = this.views[viewName];
        if (view) {
            console.log('Inicializando view:', viewName);
            this.currentView = view;
            view.init();
        } else {
            console.error('View não encontrada:', viewName);
        }
    }
};

// Garantir que o DOM está carregado antes de inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM carregado, iniciando aplicação...');
        App.init();
    });
} else {
    console.log('DOM já carregado, iniciando aplicação...');
    App.init();
} 