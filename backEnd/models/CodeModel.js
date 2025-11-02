import mongoose from 'mongoose';

const CodeSchema = new mongoose.Schema({
  name: String,
  jsx: String,
  metadata: Object
});

const CodeModel = mongoose.model('Code', CodeSchema);
export default CodeModel;
