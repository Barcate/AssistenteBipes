import express from "express";
import multer from "multer";
import OpenAI from "openai";
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import { promisify } from 'util';
import { tmpdir } from 'os';
import { join } from 'path';

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

async function convertTextToSpeech(text) {
  try {
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });
    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    console.error("Error converting text to speech:", error);
    throw error;
  }
}

async function convertAudioToText(audioBuffer) {
  try {
    const tempFilePath = join(tmpdir(), 'upload.wav');
    await writeFileAsync(tempFilePath, audioBuffer);

    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "whisper-1",
    });

    await unlinkAsync(tempFilePath); // Clean up the temp file

    if (!response.text || response.text.trim() === '') {
      throw new Error("Audio not clear enough");
    }
    return response.text.trim();
  } catch (error) {
    console.error("Error converting audio to text:", error);
    throw error;
  }
}

app.post('/message', upload.single('audio'), async (req, res) => {
  try {
    let textToProcess;

    if (req.file) {
      try {
        textToProcess = await convertAudioToText(req.file.buffer);
      } catch (error) {
        console.log('Audio transcription failed:', error);
        const apologyAudio = await convertTextToSpeech("Por favor, seja mais claro.");
        res.set('Content-Type', 'audio/mpeg');
        return res.send(apologyAudio);
      }
    } else if (req.body.messageContent) {
      textToProcess = req.body.messageContent;
    } else {
      return res.status(400).send("No text or audio message received");
    }

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are the HexaCodeAssistant" }, { role: "user", content: textToProcess }],
      model: "ft:gpt-3.5-turbo-0125:pete::9EgX74fq",
    });

    const responseText = completion.choices[0].message.content;
    const audioResponse = await convertTextToSpeech(responseText);

    res.set('Content-Type', 'audio/mpeg');
    res.send(audioResponse);
    console.log("Transcribed text: " + textToProcess); // Log the transcribed text for debugging
  } catch (error) {
    console.error("Error calling AI:", error);
    res.status(500).send(error.message);
  }
});
app.post('/bloco', upload.single('audio'), async (req, res) => {
  try {
    let textToProcess;

    if (req.file) {
      try {
        textToProcess = await convertAudioToText(req.file.buffer);
      } catch (error) {
        console.log('Audio transcription failed:', error);
        const apologyAudio = await convertTextToSpeech("Por favor, seja mais claro.");
        res.set('Content-Type', 'audio/mpeg');
        return res.send(apologyAudio);
      }
    } else if (req.body.messageContent) {
      textToProcess = req.body.messageContent;
    } else {
      return res.status(400).send("No text or audio message received");
    }

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "Retorne apenas o que foi pedido, evite conversas" }, { role: "user", content: textToProcess }],
      model: "ft:gpt-3.5-turbo-0125:pete:teste2:9ILBJVQR",
    });

    const responseText = completion.choices[0].message.content;

    res.send(responseText);
    console.log("Transcribed text: " + textToProcess); // Log the transcribed text for debugging
  } catch (error) {
    console.error("Error calling AI:", error);
    res.status(500).send(error.message);
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
