import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema({
  jti: { type: String },
  exp : { type : Date, index: { expires : '24h' } },
});

export default mongoose.model('Token', TokenSchema);
