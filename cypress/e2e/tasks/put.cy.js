describe('PUT /tasks/:id/done', () => {

    beforeEach(function () {
        cy.fixture('tasks/put').then(function (tasks) {
            this.tasks = tasks
        })
    })

    it('update task to done', function () {
        const { user, task } = this.tasks.update

        cy.task('removeTask', task.name, user.email)
        cy.task('removeUser', user.email)
        cy.postUser(user)

        cy.postSession(user)
            .then(respUser => {
                cy.postTask(task, respUser.body.token)
                    .then(respTask => {

                        cy.putTaskDone(respTask.body._id, respUser.body.token)
                            .then(response => {
                            expect(response.status).to.eq(204)

                        cy.getUniqueTask(respTask.body._id, respUser.body.token)
                            .then(response => {
                            expect(response.body.is_done).to.be.true
                        })
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
                        cy.putTaskDone(respTask.body._id, respUser.body.token)
                            .then(response => {
                                expect(response.status).to.eq(404)
                            })
                    })
            })
    })

})