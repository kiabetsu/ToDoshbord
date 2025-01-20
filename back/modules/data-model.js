const { Schema, model } = require('mongoose');

const dataSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  data: { type: String },
});

module.exports = model('Data', dataSchema);
