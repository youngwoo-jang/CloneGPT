'use client'

import OpenAI from "openai";
import { useCallback, useRef, useState } from "react";
import styled from "styled-components";

const Base = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
`;

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  dangerouslyAllowBrowser: true
});

export default function Home() {
  const textInputRef = useRef(null);
  const [textInput, setTextInput] = useState<string>("");
  const [messages, setMessages] = useState<{role:string, content:string}[]>([]);

  const handleSubmit = useCallback(async () => {
    const content = textInput;
    setTextInput("");

    setMessages((prevMessages)=>[...prevMessages, {role:"user", content:content}]);

    const stream = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: content}],
      stream: true,
    });

    for await (const chunk of stream) {
      setMessages((prevMessages)=> {
        if(prevMessages[prevMessages.length-1].role == "user") {
          const newMessage = {role:"assistant", content:chunk.choices[0]?.delta?.content || ""};
          return [...prevMessages, newMessage];
        } else {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length-1].content += chunk.choices[0]?.delta?.content || "";
          return newMessages;
        }
      });
    }
  },[textInput]);

  return (
    <Base>
      <input 
        ref={textInputRef}
        placeholder="input"
        value={textInput}
        onChange={(e)=>setTextInput(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
      <div>
        {messages.map((message, index)=> {
          return (
          <div key={index}>
            <div>{message.role}</div>
            <div>{message.content}</div>
            <br/>
          </div>
          )
        })}
      </div>
    </Base>
  )
}
