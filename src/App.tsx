import React, { useState } from 'react';
import axios from 'axios';
import { useForm, SubmitHandler} from 'react-hook-form';
import './index.css';

interface Message {
  role: string;
  content: string;
}

const API_KEY = process.env.REACT_APP_API_KEY;
const API_URL = 'https://api.openai.com/v1/completions';

const App: React.FC = () => {
  const { handleSubmit, register, reset } = useForm();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFormSubmit: SubmitHandler<any> = async (data) => {
    if(data.length === 0){
      window.alert("Message cannot be empty");
      return;
    }
    setLoading(true);
    const { message } = data;
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: message },
    ]);

    try {
      const response = await axios.post(API_URL, {
        prompt: message,
        model: 'text-davinci-003',
        max_tokens: 50,
      }, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const botMessage = response.data.choices[0].text.trim();
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'bot', content: botMessage },
      ]);

      reset();
    } catch (error) {
      console.error('Error:', error);
    } finally{
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>ChatGPT React App</h1>

      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            {message.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <input
          type="text"
          placeholder="Type your message..."
          {...register('message', {required: true})}
        />
        {!loading ?
        <button type="submit">Send</button>: <div className="loader"></div>}
      </form>
    </div>
  );
};

export default App;
