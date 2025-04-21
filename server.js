const express = require('express');
const jwt = require('jsonwebtoken');
const Acompanhante = require('./models/Acompanhante');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
if (!process.env.FRONTEND_URL) {
  console.error("FRONTEND_URL não definida no .env");
}
const app = express();

app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigin = process.env.FRONTEND_URL?.replace(/\/$/, '');
    const cleanedOrigin = origin?.replace(/\/$/, '');
    if (!origin || cleanedOrigin === allowedOrigin) {
      callback(null, true);
    } else {
      console.error(`❌ CORS bloqueado para origem: ${origin}`);
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const verificarToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ erro: 'Token inválido' });
    }
    req.usuarioId = decoded.id;
    next();
  });
};

// Rota /api/login já implementada e confirmada

app.post('/api/cadastrar', verificarToken, async (req, res) => {
  const { nome, idade, local, foto, servicos, descricao } = req.body;

  console.log('Dados recebidos para cadastro:', { nome, idade, local, foto, servicos, descricao });

  try {
    const novoAcompanhante = new Acompanhante({
      nome,
      idade,
      local,
      foto,
      servicos,
      descricao,
    });

    await novoAcompanhante.save();
    res.status(201).json({ mensagem: 'Acompanhante cadastrado com sucesso!' });
  } catch (err) {
    console.error('Erro ao cadastrar acompanhante:', err);
    res.status(500).json({ erro: 'Erro interno no servidor', detalhes: err.message });
  }
});

// Rota de verificação de funcionamento
app.get('/api/ping', (req, res) => {
  res.send('pong');
});

const bcrypt = require('bcrypt');
const Usuario = require('./models/Usuario'); // ajuste o caminho se necessário

// Rota de login
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await Usuario.findOne({ email });
    if (!user) return res.status(401).json({ erro: 'Usuário não encontrado' });

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) return res.status(401).json({ erro: 'Senha inválida' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ erro: 'Erro no servidor', detalhes: err.message });
  }
});

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('🟢 Conectado ao MongoDB com sucesso');
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
})
.catch((err) => {
  console.error('🔴 Erro ao conectar ao MongoDB:', err.message);
});
