const { defineConfig } = require("cypress");
//importa as funções connect e disconnect, mas aqui somente a connect no momento
const { connect } = require('./cypress/support/mongo');
const allureWriter = require('@shelex/cypress-allure-plugin/writer');
// import allureWriter from "@shelex/cypress-allure-plugin/writer";
require('dotenv').config()

module.exports = defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      //contante que da acesso ao banco de dados, que fará a conexão com o banco de dados
      allureWriter(on, config);

      const db = await connect()
      //cria o listener para ter acesso as tasks do cypress
      on('task', {
        //a função é uma operação de exclusão no banco de dados que recebe o email porque o email é o campo chave de verificação para essa operação
        async removeUser(email) {
          //quero remover um documento que está dentro da coleção users. temos duas coleções, tasks e users. Guardo essa instrução dentro da constante users
          const users = db.collection('users')
          //pra remover baseado no email
          await users.deleteMany({ email: email })
          return null
        },
        async removeTask(taskName, emailUser) {
          const users = db.collection('users')
          //para caso multiplos usuários tiverem tarefas com o mesmo nome, o teste irá excluir somente a tarefa do usuário logado, e não todas as tarefas com o nome selecionado, como é padrão pelo deleteMany
          const user = users.findOne({ email: emailUser })
          const tasks = db.collection('tasks')
          await tasks.deleteMany({ name: taskName, user: user._id })
          return null
        },
        async removeTasksLike(key) {
          const tasks = db.collection('tasks')
          await tasks.deleteMany({ name: { $regex: key } })
          return null
        }


      })

      return config

      // implement node event listeners here
    },
    baseUrl: process.env.BASE_URL,
    env: {
      amqpHost: process.env.AMQP_HOST,
      amqpQueue: process.env.AMQP_QUEUE,
      amqpToken: process.env.AMQP_TOKEN,
      allure: true
    }
    video: false,
    screenshotOnRunFailure: false,
  },
});
