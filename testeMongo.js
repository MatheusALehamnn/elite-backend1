// testeMongo.js
require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("✅ Conectado com sucesso ao MongoDB Atlas")
    mongoose.connection.close() // fecha a conexão após o teste
  })
  .catch(err => {
    console.error("❌ Falha na conexão:", err.message)
    process.exit(1)
  })