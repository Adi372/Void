require("dotenv").config();
const {createAgent} = require('langchain');;

const agent = createAgent({
    model: "groq:llama-3.3-70b-versatile",
})

async function generateResponse(msg) {
    const response = await agent.invoke({
        messages: msg,
    });
    return response.messages.at(-1).content;
}

module.exports = {
    generateResponse
}