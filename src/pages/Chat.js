// Assuming you are using React for the front-end
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IconButton, CircularProgress, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import io from 'socket.io-client';


const socket = io('http://localhost:5000', {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  timeout: 10000
}); // Replace with your backend server URL

const ChatPage = () => {
  const location = useLocation();
  const formData = location.state?.formData;

  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const audioContextRef = useRef(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioQueueRef = useRef([]);

  useEffect(() => {
    console.log('Form data received:', formData);
    if (!formData) {
      setStatusMessage('No form data received. Please submit the form first.');
    }

    setStatusMessage('Initializing AudioContext...');
    console.log('Initializing AudioContext...');
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().then(() => {
        console.log('AudioContext resumed');
      });
    }

    // Handle socket connection
    socket.on('connect', () => {
      setStatusMessage('Socket connected successfully.');
      console.log('Socket connected successfully.');
    });

    socket.on('connect_error', (error) => {
      setStatusMessage('Socket connection error');
      console.error('Socket connection error:', error);
    });

    socket.on('disconnect', () => {
      setStatusMessage('Socket disconnected. Attempting to reconnect...');
      console.warn('Socket disconnected. Attempting to reconnect...');
      setTimeout(() => socket.connect(), 5000);
    });

    socket.on('reconnect_attempt', (attempt) => {
      setStatusMessage(`Reconnect attempt ${attempt}...`);
      console.log(`Reconnect attempt ${attempt}...`);
    });

    // Specific event listener for 'chat-audio-response'
    socket.on('chat-audio-response', (data) => {
      console.log('Received chat-audio-response event:', data);
      handleRealTimeAudio(data);
    });

    socket.on('error', (error) => {
      setStatusMessage('Socket.io error');
      console.error('Socket.io error:', error);
    });
  }, [formData]);

  const handleRealTimeAudio = (data) => {
    setStatusMessage('Audio response received from backend');
    console.log('Audio response received from backend:', data);
    try {
      if (data.audio) {
        setStatusMessage('Decoding audio in real-time...');
        console.log('Decoding audio in real-time...');
        const audioBuffer = base64ToArrayBuffer(data.audio);
        playRealTimeAudio(audioBuffer);
      } else {
        setStatusMessage('Invalid audio data received');
        console.log('Invalid audio data received:', data);
      }
    } catch (e) {
      setStatusMessage('Error processing incoming audio data');
      console.error('Error processing incoming audio data:', e);
    }
  };

  const playRealTimeAudio = (audioBuffer) => {
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    const wavBuffer = createWavFile(audioBuffer);

    audioContextRef.current.decodeAudioData(
      wavBuffer,
      (decodedData) => {
        audioQueueRef.current.push(decodedData);
        if (!isPlayingAudio) {
          playNextInQueue();
        }
      },
      (error) => {
        setStatusMessage('Error decoding audio data');
        console.error('Error decoding audio data:', error);
      }
    );
  };

  const playNextInQueue = () => {
    if (audioQueueRef.current.length === 0) {
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    const buffer = audioQueueRef.current.shift();
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.start();
    source.onended = () => {
      setIsPlayingAudio(false);
      playNextInQueue();
    };
  };

  const handleAudio = async () => {
    if (!isRecording) {
      setStatusMessage('Starting audio recording...');
      console.log('Starting audio recording...');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);

        processor.onaudioprocess = (e) => {
          const audioBuffer = e.inputBuffer.getChannelData(0);
          const pcm16Buffer = convertToPCM16(audioBuffer);
          sendRealTimeAudioToBackend(pcm16Buffer);
        };

        source.connect(processor);
        processor.connect(audioContextRef.current.destination);

        setIsRecording(true);
      } catch (error) {
        setStatusMessage('Error accessing microphone');
        console.error('Error accessing microphone:', error);
      }
    } else {
      setStatusMessage('Stopping audio recording...');
      console.log('Stopping audio recording...');
      audioContextRef.current.close();
      setIsRecording(false);
    }
  };

  const sendRealTimeAudioToBackend = (pcm16Buffer) => {
    setStatusMessage('Sending audio to backend in real-time...');
    console.log('Sending audio to backend in real-time...');
    const base64Audio = arrayBufferToBase64(pcm16Buffer);
    try {
      socket.emit('audio-input', { audio: base64Audio });
      console.log('Audio uploaded in real-time.');
    } catch (error) {
      setStatusMessage('Error sending audio to backend');
      console.error('Error sending audio to backend:', error);
    }
  };

  function convertToPCM16(input) {
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < input.length; i++) {
      let sample = input[i];
      sample = Math.max(-1, Math.min(1, sample));
      view.setInt16(i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    }
    return buffer;
  }

  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  const base64ToArrayBuffer = (base64String) => {
    const binaryString = window.atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  function createWavFile(audioBuffer) {
    const wavHeader = createWavHeader(audioBuffer.byteLength, 24000, 1, 16);
    const wavBuffer = new Uint8Array(wavHeader.byteLength + audioBuffer.byteLength);
    wavBuffer.set(new Uint8Array(wavHeader), 0);
    wavBuffer.set(new Uint8Array(audioBuffer), wavHeader.byteLength);
    return wavBuffer.buffer;
  }

  function createWavHeader(dataLength, sampleRate, numChannels, bitsPerSample) {
    const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const buffer = new ArrayBuffer(44);
    const view = new DataView(buffer);

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(view, 36, 'data');
    view.setUint32(40, dataLength, true);

    return buffer;
  }

  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  return (
    <div className="chat-container">
      <Typography variant="body1" style={{ marginBottom: '10px' }}>Speak</Typography>
      {formData ? (
        <div className="form-data-display">
          <Typography variant="h6">Form Data Submitted:</Typography>
          <Typography variant="body1">Role: {formData.role}</Typography>
          <Typography variant="body1">Tone: {formData.tone}</Typography>
          <Typography variant="body1">Company Name: {formData.companyName}</Typography>
          <Typography variant="body1">Industry: {formData.industry}</Typography>
          <Typography variant="body1">Target Audience: {formData.targetAudience}</Typography>
          <Typography variant="body1">Product Details: {formData.productDetails}</Typography>
        </div>
      ) : (
        <Typography variant="body1" className="fallback-message">No form data received. Please submit the form first.</Typography>
      )}
      <IconButton onClick={handleAudio} color={isRecording ? 'secondary' : 'primary'} className="chat-icon-button">
        <ChatIcon />
      </IconButton>
      {isLoading && <CircularProgress size={24} className="loading-indicator" />}
      <div className={`audio-animation ${isPlayingAudio ? 'active' : ''}`}></div>
      <Typography variant="body1" className="status-message" style={{ marginTop: '10px', whiteSpace: 'pre-line' }}>{statusMessage}</Typography>
    </div>
  );
};

export default ChatPage;