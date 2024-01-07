import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { model, messages } = req.query;
    const messagesArray = JSON.parse(messages as string);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const stream = await openai.chat.completions.create({
        model: model as string,
        stream: true,
        messages: messagesArray,
    });

    for await (const chunk of stream) {
        const data = {
            text: chunk.choices[0].delta?.content || "",
            finish_reason: chunk.choices[0].finish_reason || ""
        }
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
    
    res.end();
}