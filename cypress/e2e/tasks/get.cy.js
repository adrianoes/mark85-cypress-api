describe('GET /tasks', () => {

    beforeEach(function () {
        cy.fixture('tasks/get').then(function (tasks) {
            this.tasks = tasks
        })
    })

    it('get my tasks', function () {
        //no arquivo get.json. colocamos o 4 em Estud4r porque lidamos com uma lista de tarefas e nomear a massa assim facilita a localização delas para limpar o banco de dados antes do teste começar
        const { user, tasks } = this.tasks.list

        cy.task('removeTasksLike', 'Estud4r')
        cy.task('removeUser', user.email)
        cy.postUser(user)
        cy.postSession(user)
            .then(respUser => {

                //looping abaixo elimina a necessidade de repetição de código
                // cy.postTask(tasks[0], respUser.body.token)
                // cy.postTask(tasks[1], respUser.body.token)
                // cy.postTask(tasks[2], respUser.body.token)

                tasks.forEach(function (t) {
                    cy.postTask(t, respUser.body.token)
                })

                cy.getTasks(respUser.body.token)
                    .then(response => {
                        expect(response.status).to.eq(200)
                    }).its('body')
                    .should('be.an', 'array')
                    .and('have.length', tasks.length)
                //its é uma função do cypress e pega a propriedade para obter a propriedade body dessa execução, e aqui verifica se o retorno é um array e se tem o comprimento certo
            })

    })

})

describe('GET /tasks/:id', () => {

    beforeEach(function () {
        cy.fixture('tasks/get').then(function (tasks) {
            this.tasks = tasks
        })
    })

    it('get unique task', function () {
        const { user, task } = this.tasks.unique

        cy.task('removeTask', task.name, user.email)
        cy.task('removeUser', user.email)
        cy.postUser(user)

        cy.postSession(user)
            .then(respUser => {
                cy.postTask(task, respUser.body.token)
                    .then(respTask => {
                        cy.getUniqueTask(respTask.body._id, respUser.body.token)
                            .then(response => {
                            expect(response.status).to.eq(200)
                        })
                    })
            })
    })

    it('task not found', function () {
        const { user, task } = this.tasks.not_found

        cy.task('removeTask', task.name, user.email)
        cy.task('removeUser', user.email)
        cy.postUser(user)

        cy.postSession(user)
            .then(respUser => {
                cy.postTask(task, respUser.body.token)
                    .then(respTask => {
                        //Deleta a tarefa e envia o código 204, confirmando o delete e mostrando que agora está sem conteudo
                        cy.deleteTask(respTask.body._id, respUser.body.token)
                            .then(response => {
                                expect(response.status).to.eq(204)
                            })
                            
                            //Verifica a busca da tarefa pelo id da tarefa que já foi deletada acima, retornando o código not found 404, usando ids coerentes e reais ao invés de inserir ids errados
                        cy.getUniqueTask(respTask.body._id, respUser.body.token)
                            .then(response => {
                                expect(response.status).to.eq(404)
                            })
                    })
            })
    })

})

