

describe('POST /sessions', ()=> {
    // it('user session', ()=> { // devemos usar a palavra function e não a função seta. o javascript só consegue trabalhar com contexto se as funções forem do tipo convencional e não do tipo seta, como as que usamos 
    //masssas de testes estão no arquivo users.json em fixtures
    beforeEach(function() {
        cy.fixture('users').then(function(users){
            this.users = users
        })
    })
    it('user session', function() {

        const userData = this.users.login
        //caso alguém altere o banco de dados, faço o delete antes para me precaver disso
        cy.task('removeUser', userData.email)

        cy.postUser(userData)

        cy.postSession(userData)
        .then(response => {
            expect(response.status).to.eq(200)
            const {user, token} = response.body            
            expect(user.name).to.eq(userData.name)
            expect(user.email).to.eq(userData.email)
            //a validação do token, no nosso caso jwt jason web tolken, pode ser feita de diversas formas, como por exemplo pegar toda a string e decodificar. Porém é recomendada somente em testes unitários, então aqui validamos somente a existência dele, deixando a decodificação para teste unitátio
            expect(token).not.to.be.empty
        })
    })

    it('invalid password', function() {

        const user = this.users.inv_pass

        cy.postSession(user)
        .then(response => {
            expect(response.status).to.eq(401)
        })
    })

    it('email not found', function() {

        const user = this.users.email_404

        cy.postSession(user)
        .then(response => {
            expect(response.status).to.eq(401)
        })
    })
})

