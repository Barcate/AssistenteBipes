import OpenAI from "openai";
import dotenv from 'dotenv';
import fs from "fs";
import xmlbuilder from "xmlbuilder";

// Carregar variáveis de ambiente
dotenv.config();

// Configure a biblioteca com sua chave de API da OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Definindo `match` globalmente
let match = null;

async function main() {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content:"quem é voce" }],
      model: "ft:gpt-3.5-turbo-0125:pete::9EgX74fq",  // Substitua por seu modelo personalizado
    });

    const resposta = completion.choices[0].message.content;
    console.log(resposta)
  } catch (error) {
    console.error("Erro ao chamar a IA:", error);
  }
}
main()