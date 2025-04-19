const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const path = require('path');

const app = express(); // ✅ app criado antes de usar

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado ao MongoDB'))
.catch((err) => {
  console.error('❌ Erro ao conectar ao MongoDB:', err.message);
  process.exit(1);
});

// MODELOS
const Acompanhante = mongoose.model('Acompanhante', new mongoose.Schema({
  nome: String,
  idade: Number,
  local: String,
  foto: String,
}));

const Usuario = mongoose.model('Usuario', new mongoose.Schema({
  usuario: String,
  senha: String,
}));

// ROTAS BÁSICAS
app.get('/', (req, res) => {
  res.send('🎉 Backend Elite Acompanhantes está online!');
});

app.get('/api/acompanhantes', async (req, res) => {
  const dados = await Acompanhante.find();
  res.json(dados);
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

// PORTA
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
