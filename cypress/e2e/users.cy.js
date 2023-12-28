
describe('POST /USERS', ()=> {

  beforeEach(function() {
    cy.fixture('users').then(function(users){
        this.users = users
    })
  })

  it('Register a new user', function() {

    const user = this.users.create

    //task criada em cypress.config.js
    cy.task('removeUser', user.email)
    //passo a massa de teste user, pego o callback e faço a validação
    cy.postUser(user)
    .then(response=> {
      expect(response.status).to.eq(201)
    })
  })

  it('duplicate email', function() {

    const user = this.users.dup_email

    //task criada em cypress.config.js
    cy.task('removeUser', user.email)
    //passo a massa de teste user, pego o callback e faço a validação
    cy.postUser(user)
    .then(response=> {
      expect(response.status).to.eq(201)
    })
    cy.postUser(user)
    .then(response=> {
      //
      const {message} = response.body
      expect(response.status).to.eq(409)
      expect(message).to.eq('Duplicated email!')
    })
  })

  context('required field', function() {

    let user;    
    //before each foi criado aqui porque quando um teste dessa suite de campos aleatórios é executado, o teste seguinte já começaria com o campo do teste anterior excluído e dessa forma resetamos a massa de teste antes de cada teste. lembrando que o ideal é deixar os testes independentes, sem uso de ganchos, mas aqui mostramos um exemplo para entender o funcionamento
    beforeEach(function() {
      user = this.users.required
    })

    it('name is required', function() {

      delete user.name

      cy.postUser(user)
      .then(response=> {

        const {message} = response.body

        expect(response.status).to.eq(400)
        expect(message).to.eq('ValidationError: \"name\" is required')
      })
      
    })

    it('email is required', function() {

      delete user.email

      cy.postUser(user)
      .then(response=> {

        const {message} = response.body

        expect(response.status).to.eq(400)
        expect(message).to.eq('ValidationError: \"email\" is required')
      })

    })

    it('password is required', function() {

      delete user.password

      cy.postUser(user)
      .then(response=> {

        const {message} = response.body

        expect(response.status).to.eq(400)
        expect(message).to.eq('ValidationError: \"password\" is required')
      })

    })

  })

})


