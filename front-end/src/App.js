import React, { useState, useEffect } from 'react';
import './App.css';
import assistantImage1 from './teste1.png';
// import assistantImage2 from './teste2.png';
import BlocklyComponent from './components/BlocklyComponent';

function App() {
  const [chatVisible, setChatVisible] = useState(false);
  const [assistantImage, setAssistantImage] = useState(assistantImage1);
  const [chatMessages, setChatMessages] = useState([]);
  const [textMessage, setTextMessage] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [chatVisible2, setChatVisible2] = useState(false);
  const [assistantImage2, setAssistantImage2] = useState(assistantImage1); // Updated for clarity
  const [chatMessages2, setChatMessages2] = useState([]);
  const [textMessage2, setTextMessage2] = useState('');
  const [mediaRecorder2, setMediaRecorder2] = useState(null);
  const [isRecording2, setIsRecording2] = useState(false);

  const toggleImage = () => {
    setAssistantImage(prevImage => prevImage === assistantImage1 ? assistantImage2 : assistantImage1);
  };

  const speak = () => {
    const msg = new SpeechSynthesisUtterance('Eu sou o assistente virtual Bipes, o que você precisa?');
    window.speechSynthesis.speak(msg);
  };

  useEffect(() => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      alert("Gravação de áudio não suportada neste navegador.");
    }
  }, []);

  useEffect(() => {
    let intervalId;
    if (chatVisible && !isRecording) {
      speak();
      intervalId = setInterval(toggleImage, 500);
      setTimeout(() => clearInterval(intervalId), 5000);
    }
    return () => clearInterval(intervalId);
  }, [chatVisible, isRecording]);

  const handleAssistantClick = (setChatVisibleFunc, setImageFunc, isVisible) => {
    setChatVisibleFunc(!isVisible);
    if (!isVisible) {
      speak();
      const intervalId = setInterval(() => setImageFunc(prevImage => prevImage === assistantImage1 ? assistantImage2 : assistantImage1), 500);
      setTimeout(() => clearInterval(intervalId), 5000);
    }
  };

  const handleTextSubmit = (event, setTextMessageFunc, setChatMessagesFunc, textMessageVar, chatMessagesVar) => {
    event.preventDefault();
    if (textMessageVar.trim()) {
      setChatMessagesFunc([...chatMessagesVar, { type: 'text', content: textMessageVar }]);
      setTextMessageFunc('');
    }
  };

  const handleAudioStart = async (event, setIsRecordingFunc, setMediaRecorderFunc, setChatMessagesFunc, chatMessagesVar) => {
    event.stopPropagation();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorderFunc(recorder);
      recorder.start();
      setIsRecordingFunc(true);

      const audioChunks = [];
      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        setChatMessagesFunc([...chatMessagesVar, { type: 'audio', content: audioUrl }]);
      };
    } catch (error) {
      console.error("Erro ao acessar o microfone", error);
    }
  };

  const handleAudioStop = (event, mediaRecorderVar, setIsRecordingFunc) => {
    event.stopPropagation();
    if (mediaRecorderVar) {
      mediaRecorderVar.stop();
      setIsRecordingFunc(false);
    }
  };

  return (
    <div className="container">
      <section className="left">
        <BlocklyComponent />
      </section>
      <section className="right">
        <div className='assistant-container' onClick={() => handleAssistantClick(setChatVisible, setAssistantImage, chatVisible)}>
          <img src={assistantImage} alt="Assistant Icon" className='assistant-icon' />
          {chatVisible && (
            <div className="chat-bubble" onClick={(e) => e.stopPropagation()}>
              <p>Eu sou o assistente virtual Bipes, o que você precisa?</p>
              <div className="messages">
                {chatMessages.map((message, index) => (
                  <div key={index} className={message.type}>
                    {message.type === 'text' ? (
                      <p>{message.content}</p>
                    ) : (
                      <audio controls src={message.content} />
                    )}
                  </div>
                ))}
              </div>
              <form onSubmit={(e) => handleTextSubmit(e, setTextMessage, setChatMessages, textMessage, chatMessages)}>
                <input
                  type="text"
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  disabled={isRecording}
                />
                <button type="submit">Enviar</button>
              </form>
              {isRecording ? (
                <button onClick={(e) => handleAudioStop(e, mediaRecorder, setIsRecording)}>Parar gravação</button>
              ) : (
                <button onClick={(e) => handleAudioStart(e, setIsRecording, setMediaRecorder, setChatMessages, chatMessages)}>Gravar áudio</button>
              )}
            </div>
          )}
        </div>
        <div className='assistant-container' onClick={() => handleAssistantClick(setChatVisible2, setAssistantImage2, chatVisible2)}>
          <img src={assistantImage2} alt="Assistant Icon" className='assistant-icon' />
          {chatVisible2 && (
            <div className="chat-bubble" onClick={(e) => e.stopPropagation()}>
              <div className="messages">
                {chatMessages2.map((message, index) => (
                  <div key={index} className={message.type}>
                    {message.type === 'text' ? <p>{message.content}</p> : <audio controls src={message.content} />}
                  </div>
                ))}
              </div>
              <form onSubmit={(e) => handleTextSubmit(e, setTextMessage2, setChatMessages2, textMessage2, chatMessages2)}>
                <input
                  type="text"
                  value={textMessage2}
                  onChange={(e) => setTextMessage2(e.target.value)}
                  disabled={isRecording2}
                />
                <button type="submit">Enviar</button>
                </form>
              {isRecording2 ? (
                <button onClick={(e) => handleAudioStop(e, mediaRecorder2, setIsRecording2)}>Parar gravação</button>
              ) : (
                <button onClick={(e) => handleAudioStart(e, setIsRecording2, setMediaRecorder2, setChatMessages2, chatMessages2)}>Gravar áudio</button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
