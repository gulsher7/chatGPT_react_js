import React, { useState, useEffect } from 'react';
import './App.css';
import env from "react-dotenv";


import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from "@chatscope/chat-ui-kit-react";
import axios from 'axios';


function App() {
  const [data, setData] = useState([])
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    myPrompt('hey')
  }, [])


  const myPrompt = (text) => {
    const url = 'https://api.openai.com/v1/chat/completions'
    const config = {
      headers: {
        Authorization: `Bearer ${env.GPT_KEY}`
      }
    }
    const data = {
      "model": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "system",
          "content": "Your helping assistant. give answer in short way."
        },
        {
          "role": "user",
          "content": `${text}`
        }
      ],
      "temperature": 0.7,
      "stream": false
    }
    setLoading(true)
    axios.post(url, data, config).then((res) => {
      let result = res.data.choices[0]['message']['content']
      console.log("res++++", result)

      let my_value = [
        {
          message: result,
          sentTime: 'just now',
          sender: 'system',
          direction: 'incoming',
          position: 'single'
        },
      ]
      setData(prev => [...prev, ...my_value])
      setLoading(false)
    }).catch((error) => {
      console.log("error raised", error)
      alert(error?.response?.data?.error?.message)
      setLoading(false)
    })

  }


  const onClick = (text) =>{

    let my_value = [
      {
        message: text,
        sentTime: 'just now',
        sender: 'user',
        direction: 'outgoing',
        position: 'single'
      },
    ]
    setData(prev => [...prev, ...my_value])
    myPrompt(text)
  }

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <MainContainer>
        <ChatContainer>
          <MessageList typingIndicator={isLoading ? <TypingIndicator content="Eliot is typing..." /> : null}  >
            {data.map((val, i) => {
              return (
                <Message
                  key={String(i)}
                  model={{
                    message: val?.message,
                    sentTime: val?.sentTime,
                    sender: val?.sender,
                    direction: val?.direction
                  }}
                />
              )
            })}
          </MessageList>
          <MessageInput placeholder="Type message here" onSend={onClick} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}

export default App;
