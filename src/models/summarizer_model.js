import mongoose, { Schema } from 'mongoose';

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
        title: String,
        num_sections: Number,
        overview: String,
        result_html: String,
    },
    sections: [SectionSchema] * num_sections,
}, {
    toJSON: {
        virtuals: true,
    },
});

const SummarizerModel = mongoose.model('Content', SummarizerSchema);

export default SummarizerModel;
