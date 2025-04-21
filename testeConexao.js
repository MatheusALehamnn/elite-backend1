require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('🟢 Conectado com sucesso!');
  process.exit();
})
.catch((err) => {
  console.error('❌ Erro na conexão:', err.message);
  process.exit(1);
});