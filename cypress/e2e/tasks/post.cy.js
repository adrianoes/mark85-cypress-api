
describe('POST /tasks', () => {
    beforeEach(function () {
        cy.fixture('tasks/post').then(function (tasks) {
            this.tasks = tasks
        })
    })

    context('Register a new task', function () {
        before(function () {
            cy.purgeMessages()
                .then(response => {
                    expect(response.status).to.eq(204)
                })
        })
        //uso função convencional pois irei trabalhar com camada de fixtures para usar implementação de variáveis de contexto
        //as masssas de teste estão centralizadas no arquivo fixture para tornar os testes independentes
        it('post task', function () {
            const { user, task } = this.tasks.create
            //porque se alguém mudar a senha ou outro dado do usuário, ele vai remover o usuário e na linha debaixo inserimos o usuário com o banco de dados inalterado
            cy.task('removeUser', user.email)
            //para cadastrar o usuário caso alguém delete ou edite ele no banco de dados
            cy.postUser(user)

            cy.postSession(user)
                .then(userResp => {
                    //função criada em cypress.config.js para deletar a tarefa antes do teste para não queimar o banco de dados.
                    //para caso multiplos usuários tiverem tarefas com o mesmo nome, o teste irá excluir somente a tarefa do usuário logado, e não todas as tarefas com o nome selecionado, como é padrão pelo deleteMany
                    cy.task('removeTask', task.name, user.email)

                    cy.postTask(task, userResp.body.token)
                        .then(response => {
                            expect(response.status).to.eq(201)
                            expect(response.body.name).to.eq(task.name)
                            //função eql se preocupa com os dados e não com a tipagem dos dados. qual a diferença real?
                            expect(response.body.tags).to.eql(task.tags)
                            expect(response.body.is_done).to.be.false
                            expect(response.body.user).to.eq(userResp.body.user._id)
                            //valida somente a quatidade de caracteres do id, não valida se é o mesmo id. essa validação será feita posteriormente
                            expect(response.body._id.length).to.eq(24)
                        })
                })
        })

        after(function () {
            const { user, task } = this.tasks.create
            //na minha máquinha não precisou desse wait para dar tempo pro teste aguardar a mensagem chegar até o rabbitMq, mas o papito colocou então coloquei aqui tmb
            cy.wait(3000)
            cy.getMessageQueue()
                .then(response => {
                    expect(response.status).to.eq(200)
                    expect(response.body[0].payload).to.include(user.name.split(' ')[0])
                    expect(response.body[0].payload).to.include(task.name)
                    expect(response.body[0].payload).to.include(user.email)
                    // cy.log(JSON.stringify(response.body[0]))
                })
        })
    })

    it('duplicate task', function () {
        //usar massa de teste dup, se o erro persistir após as aulas finais
        const { user, task } = this.tasks.create
        //porque se alguém mudar a senha ou outro dado do usuário, ele vai remover o usuário e na linha debaixo inserimos o usuário com o banco de dados inalterado
        cy.task('removeUser', user.email)
        //para cadastrar o usuário caso alguém delete ou edite ele no banco de dados
        cy.postUser(user)

        cy.postSession(user)
            .then(userResp => {
                //função criada em cypress.config.js para deletar a tarefa antes do teste para não queimar o banco de dados.
                //para caso multiplos usuários tiverem tarefas com o mesmo nome, o teste irá excluir somente a tarefa do usuário logado, e não todas as tarefas com o nome selecionado, como é padrão pelo deleteMany
                cy.task('removeTask', task.name, user.email)

                cy.postTask(task, userResp.body.token)
                cy.postTask(task, userResp.body.token)
                    .then(response => {
                        expect(response.status).to.eq(409)
                        expect(response.body.message).to.eq('Duplicated task!')
                    })
            })
    })
})