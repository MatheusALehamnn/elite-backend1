require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('./models/Usuario');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Conectado ao MongoDB');

    const email = 'admin@admin.com';
    const senha = 'admin123';
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = new Usuario({
      email,
      senha: senhaCriptografada
    });

    await usuario.save();
    console.log('✅ Usuário criado com sucesso:', email);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Erro ao conectar ou criar usuário:', err);
  });