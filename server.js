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

app.get('/api/ping', (req, res) => {
  res.send('pong');
});

app.post('/api/login', async (req, res) => {
  const { usuario, senha } = req.body;

  try {
    const user = await Usuario.findOne({ usuario });
    if (!user) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// PORTA
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
