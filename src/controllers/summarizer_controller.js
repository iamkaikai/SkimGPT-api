import SummarizerModel from "../models/summarizer_model";
import gptCall from "../gpt";

export async function createSummarizer(url) {
    const summarizer = new SummarizerModel();
    try {
        summarizer = await gptCall(url);
        return summarizer;
    } catch (error) {
        throw new Error(`create summarizer error: ${error}`);
    }
}

export async function getSection(id) {
    try {
        const section = await SummarizerModel.sections.findById(id);
        return section;
    } catch (error) {
        throw new Error(`get section error: ${error}`);
    }
}

export async function getOverview(id) {
    try {
        const section = await SummarizerModel.sections.findById(id);
        return section;
    } catch (error) {
        throw new Error(`get section error: ${error}`);
    }
}

export async function getOverview() {
    try {
        const overview = await SummarizerModel.overview
        return overview;
    } catch (error) {
        throw new Error(`get overview error: ${error}`);
    }
}
