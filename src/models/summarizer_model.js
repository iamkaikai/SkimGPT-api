import mongoose from 'mongoose';

const { Schema } = mongoose;

const SectionSchema = new Schema({
  id: Number,
  length: Number,
  title: String,
  overview: String,
  content: String,
}, {
  toJSON: {
    virtuals: true,
  },
});

const SummarizerSchema = new Schema({
  general: {
    url: String,
    title: String,
    num_sections: Number,
    overview: String,
    result_html: String,
  },
  sections: [SectionSchema],
}, {
  toJSON: {
    virtuals: true,
  },
});

const SummarizerModel = mongoose.model('Content', SummarizerSchema);

export default SummarizerModel;
