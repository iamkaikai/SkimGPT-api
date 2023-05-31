import mongoose from 'mongoose';

const { Schema } = mongoose;

const SectionSchema = new Schema({
  id: Number,
  length: Number,
  title: String,
  content: String,
}, {
  toJSON: {
    virtuals: true,
  },
});

const RetoneSchema = new Schema({
  general: {
    url: String,
    tone: String,
    title: String,
    num_sections: Number,
  },
  sections: [SectionSchema],
}, {
  toJSON: {
    virtuals: true,
  },
});

const RetoneModel = mongoose.model('Retone', RetoneSchema);

export default RetoneModel;
