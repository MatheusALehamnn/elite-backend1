const express = require('express');
const jwt = require('jsonwebtoken');
const Acompanhante = require('./models/Acompanhante');
const app = express();

app.use(express.json());

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

// Supondo que a rota /api/login já exista aqui

app.post('/api/cadastrar', verificarToken, async (req, res) => {
  const { nome, idade, local, foto, servicos, descricao } = req.body;

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
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// Rota de verificação de funcionamento
app.get('/api/ping', (req, res) => {
  res.send('pong');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
