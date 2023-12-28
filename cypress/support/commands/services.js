Cypress.Commands.add('postUser', (user) => {
    //posso usar a função api ao invés da função request porque instalei o plugin cypress-plugin-api.
    cy.api({
      url: '/users',
      method: 'POST',
      body: user,
      //Por padrão, o cypress possui a instrução failOnStatusCode: true. Essa instrução falha o teste automaticamente quando o status code é diferente de 2xx ou 3xx. Devemos colocar ela como false. 
      failOnStatusCode: false
    }).then(response => {return response})
      //essa custom command faz a requisição na api, faz a requisição post na rota users, recebe a massa de teste e devolve o resultao. é o encapsulamento para aproveitamento de código
    //   expect(response.status).to.eq(200)
    //   //mostra o log do resultado da requisão. A api devolve os dados de cadastro confirmando o id e criptografando a senha. Esse log ajuda a verificar o cadastro para ver se o mesmo foi feito de forma correta. Não é um critério de assert
    //   cy.log(JSON.stringify(response.body))
    // })  
})

Cypress.Commands.add('postSession', (user)=> {
    cy.api({
        url: '/sessions',
        method: 'POST',
        body: {email: user.email, password: user.password},
        failOnStatusCode: false
    }).then(response => {return response})
})

Cypress.Commands.add('postTask', (task, token) => {
    cy.api({
        url: '/tasks',
        method: 'POST',
        body: task,
        headers: {
            authorization: token 
        },
        failOnStatusCode: false
    }).then(response => {return response})
  
})

Cypress.Commands.add('getTasks', (token) => {
    cy.api({
        url: '/tasks',
        method: 'GET',
        headers: {
            authorization: token
        },
        failOnStatusCode: false
    }).then(response => { return response })
})

Cypress.Commands.add('getUniqueTask', (taskId, token) => {
    cy.api({
        url: '/tasks/' + taskId,
        method: 'GET',
        headers: {
            authorization: token
        },
        failOnStatusCode: false
    }).then(response => { return response })
})

Cypress.Commands.add('deleteTask', (taskId, token) => {
    cy.api({
        url: '/tasks/' + taskId,
        method: 'DELETE',
        headers: {
            authorization: token
        },
        failOnStatusCode: false
    }).then(response => { return response })
})

Cypress.Commands.add('putTaskDone', (taskId, token) => {
    cy.api({
        //url: '/tasks/' + taskId + '/done',
        //em cima a concatenação e embaixo a interpolação, porém interpolação é recomendada quando existem mais de dois parâmetros
        url: `/tasks/${taskId}/done`,
        method: 'PUT',
        headers: {
            authorization: token
        },
        failOnStatusCode: false
    }).then(response => { return response })
})

