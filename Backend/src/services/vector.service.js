const {Pinecone} = require('@pinecone-database/pinecone');

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
})

const socialMediaIndex = pc.index('socialmedia-ai');

async function createMemory({vectors, metadata, messageId}){
    const records = [
        {
            id: messageId,
            values: vectors,
            metadata
        }
    ]
    await socialMediaIndex.upsert({records});
    console.log("Upsert completed");
}

async function queryMemory({queryVector, limit=5, metadata}){
    const data = await socialMediaIndex.query({
        vector: queryVector,
        topK: limit,
        filter: metadata && Object.keys(metadata).length > 0
            ? metadata
            : undefined,
        includeMetadata: true
    })
    return data.matches;
}

module.exports = {
    createMemory,
    queryMemory
}