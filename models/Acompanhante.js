const mongoose = require('mongoose');

const AcompanhanteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  idade: { type: Number, required: true },
  local: { type: String, required: true },
  foto: { type: String, required: true },
  servicos: { type: String, required: true },
  descricao: { type: String, required: true }
});

module.exports = mongoose.model('Acompanhante', AcompanhanteSchema);
