//arquivo que me dará as funções de conexão com o banco de dados
//Vou fazer um require no pacote mongodb que é o pacote mongodb que instalamos, ao fazer o require eu tenho acesso ao objeto MongoClient que criei
const {MongoClient} = require('mongodb')

require('dotenv').config()

//mesma string de conexão da api
const mongoUri = 'mongodb+srv://qax:xperience@cluster0.p4qnw4r.mongodb.net/markdb?retryWrites=true&w=majority'
//tentei definir como variável de ambiente mas deu erro, dai deixei assim
//MONG_URI=mongodb+srv://qax:xperience@cluster0.p4qnw4r.mongodb.net/markdb?retryWrites=true&w=majority
//esse código vai gerar uma conexão com o cluster mongodb, vai conectar no cluster
const client = new MongoClient(mongoUri)

//função para conectar no banco de dados. Essa função é assíncrona, pois tenho que passar um await para esperar que a conexão seja concluída
async function connect() {
    await client.connect()
    return client.db('markdb')
}
//funfão para desconectar do banco de dados
async function disconnect() {
    await client.disconnect()
}
//module para exportar as funções quando eu precisar usar elas
module.exports = {connect, disconnect}