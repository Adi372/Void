require("dotenv").config();
const {createAgent} = require('langchain');
const {GoogleGenAI} = require('@google/genai')
const { ChatGroq } = require("@langchain/groq");

const model = new ChatGroq({
    model: "llama-3.1-8b-instant",
    apiKey: process.env.GROQ_API_KEY,
});

const agent = createAgent({
    model,
});

const geminiAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function generateResponse(msg) {
    const response = await agent.invoke({
        messages: msg,
    });
    return response.messages.at(-1).content;
}

async function generateVector(content){
    const response = await geminiAI.models.embedContent({
        model: 'gemini-embedding-2',
        contents: content,
        config: {
          outputDimensionality: 768
        }
    });
    return response.embeddings[0].values
}

module.exports = {
    generateResponse,
    generateVector
}
