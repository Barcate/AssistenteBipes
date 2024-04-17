import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './logo.jpg';
import assistantImage1 from './teste1.png';
import assistantImage2 from './teste2.png';
import BlocklyComponent from './components/BlocklyComponent';
function App() {
  
  const [chatVisible, setChatVisible] = useState(false);
  const [assistantImage, setAssistantImage] = useState(assistantImage1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [textMessage, setTextMessage] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

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
      setTimeout(() => {
        clearInterval(intervalId);
      }, 5000);
    }
    return () => clearInterval(intervalId);
  }, [chatVisible, isRecording]);


  const handleAssistantClick = () => {
    setChatVisible(prevState => !prevState);
    if (!isSpeaking) {
      setIsSpeaking(true);
      speak();
      const intervalId = setInterval(toggleImage, 500);
      setTimeout(() => {
        clearInterval(intervalId);
        setIsSpeaking(false);
      }, 5000);
    }
  };
  const handleTextSubmit = (event) => {
    event.preventDefault();
    if (textMessage.trim()) {
      setChatMessages([...chatMessages, { type: 'text', content: textMessage }]);
      setTextMessage('');
    }
  };
  const handleBubbleClick = (event) => {
    event.stopPropagation();
  };

  const handleAudioStart = async (event) => {
    event.stopPropagation()
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);

      const audioChunks = [];
      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        setChatMessages([...chatMessages, { type: 'audio', content: audioUrl }]);
      };
    } catch (error) {
      console.error("Erro ao acessar o microfone", error);
    }
  };

  const handleAudioStop = (event) => {
    event.stopPropagation()
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="container">
      <section className="left">
        <img src={logo} alt="Logo" />
        <div className="App">
          <BlocklyComponent />
        </div>
      </section>
      <section className="right">
        <div className='assistant-container' onClick={handleAssistantClick}>
          <img src={assistantImage} alt="Assistant Icon" className='assistant-icon' />
          {chatVisible && (
            <div className="chat-bubble" onClick={handleBubbleClick}>
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
            <form onSubmit={handleTextSubmit}>
              <input
                type="text"
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                disabled={isRecording}
              />
              <button type="submit">Enviar</button>
            </form>
            {isRecording ? (
              <button onClick={handleAudioStop}>Parar gravação</button>
            ) : (
              <button onClick={handleAudioStart}>Gravar áudio</button>
            )}
          </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;