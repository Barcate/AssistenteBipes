import React, { useState, useEffect } from 'react';
import './App.css';
import assistantImage1 from './teste1.png';
import assistantImage3 from './teste3.png';
// import assistantImage2 from './teste2.png';
import BlocklyComponent from './components/BlocklyComponent';
import { useBlocklyData } from './contexto/BlocklyDataContext';
import axios from 'axios';

function App() {
  const [chatVisible, setChatVisible] = useState(false);
  const [assistantImage, setAssistantImage] = useState(assistantImage1);
  const [chatMessages, setChatMessages] = useState([]);
  const [textMessage, setTextMessage] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [chatVisible2, setChatVisible2] = useState(false);
  const [assistantImage2, setAssistantImage2] = useState(assistantImage3); // Updated for clarity
  const [chatMessages2, setChatMessages2] = useState([]);
  const [textMessage2, setTextMessage2] = useState('');
  const [mediaRecorder2, setMediaRecorder2] = useState(null);
  const [isRecording2, setIsRecording2] = useState(false);
  const { setBlockResponse } = useBlocklyData();


  const speak = () => {
    const msg = new SpeechSynthesisUtterance('Eu sou o assistente virtual Bipes, o que você precisa?');
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
    }
    return () => clearInterval(intervalId);
  }, [chatVisible, isRecording]);

  const handleAssistantClick = (setChatVisibleFunc, setImageFunc, isVisible) => {
    setChatVisibleFunc(!isVisible);
    if (!isVisible) {
      speak();
    }
  };

  const sendToServer = async (data) => {
    try {
      let formData = new FormData();
      if (data.messageType === 'audio') {
        // Assumindo que 'data.messageContent' é um Blob de áudio
        formData.append('audio', data.messageContent, 'message.mp3');
        // Adicionar áudio ao chat antes de enviar
        const url = URL.createObjectURL(data.messageContent);
        setChatMessages(prevMessages => [...prevMessages, { type: 'audio', content: url, sent: true }]);
      } else {
        formData.append('messageContent', data.messageContent);

        setChatMessages(prevMessages => [...prevMessages, { type: 'text', content: data.messageContent, sent: true }]);
      }
  
      const response = await axios.post('http://localhost:5000/message', formData, {
        headers: {
          'Content-Type': 'multipart/form-data' 
        },
        responseType: 'blob' 
      });
  
      const url = URL.createObjectURL(response.data);
      setChatMessages(prevMessages => [...prevMessages, { type: 'audio', content: url }]);
    } catch (error) {
      console.error('Error sending/receiving data from server:', error);
    }
  };

  const handleTextSubmit = (event, setTextMessageFunc, setChatMessagesFunc, textMessageVar) => {
    event.preventDefault();
    if (textMessageVar.trim()) {
      sendToServer({ messageType: 'text', messageContent: textMessageVar });
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
        sendToServer({ messageType: 'audio', messageContent: audioBlob });
        setIsRecording(false);
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
  const sendToBlockServer = async (data) => {
    try {
      let formData = new FormData();
      if (data.messageType === 'audio') {
        formData.append('audio', data.messageContent, 'message.mp3');
        const url = URL.createObjectURL(data.messageContent);
        setChatMessages2(prevMessages => [...prevMessages, { type: 'audio', content: url, sent: true }]);
      } else {
        formData.append('messageContent', data.messageContent);
        const responseText = await data.messageContent;
        setChatMessages2(prevMessages => [...prevMessages, { type: 'text', content: responseText, sent: true }]);
      }
  
      const response = await axios.post('http://localhost:5000/bloco', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const responseText = await response.data;
      setBlockResponse(''); // Clear the response
      setTimeout(() => {
        setBlockResponse(responseText); // Set new response
      }, 0);
      setChatMessages2(prevMessages => [...prevMessages, { type: 'text', content: responseText }]);
    } catch (error) {
      console.error('Error sending/receiving data from server:', error);
    }
  };
  
  const handleTextSubmit2 = (event, setTextMessageFunc, setChatMessagesFunc, textMessageVar) => {
    event.preventDefault();
    if (textMessageVar.trim()) {
      sendToBlockServer({ messageType: 'text', messageContent: textMessageVar });
      setTextMessageFunc('');
    }
  };
  const handleAudioStart2 = async (event) => {
    event.stopPropagation();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder2(recorder);
      recorder.start();
      setIsRecording2(true);
  
      recorder.ondataavailable = (event) => {
        const audioBlob = new Blob([event.data], { type: 'audio/wav' });
        sendToBlockServer({ messageType: 'audio', messageContent: audioBlob }, setBlockResponse);
        setIsRecording2(false);
      };
    } catch (error) {
      console.error("Erro ao acessar o microfone", error);
    }
  };
  const handleAudioStop2 = (event, mediaRecorderVar, setIsRecordingFunc) => {
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
          <img src={assistantImage2} alt="Assistant Icon" className='assistant-icon2' />
          {chatVisible2 && (
            <div className="chat-bubble" onClick={(e) => e.stopPropagation()}>
              <div className="messages">
                {chatMessages2.map((message, index) => (
                  <div key={index} className={message.type}>
                    {message.type === 'text' ? <p>{message.content}</p> : <audio controls src={message.content} />}
                  </div>
                ))}
              </div>
              <form onSubmit={(e) => handleTextSubmit2(e, setTextMessage2, setChatMessages2, textMessage2, chatMessages2)}>
                <input
                  type="text"
                  value={textMessage2}
                  onChange={(e) => setTextMessage2(e.target.value)}
                  disabled={isRecording2}
                />
                <button type="submit">Enviar</button>
                </form>
              {isRecording2 ? (
                <button onClick={(e) => handleAudioStop2(e, mediaRecorder2, setIsRecording2)}>Parar gravação</button>
              ) : (
                <button onClick={(e) => handleAudioStart2(e, setIsRecording2, setMediaRecorder2, setChatMessages2, chatMessages2)}>Gravar áudio</button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
