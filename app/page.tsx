'use client'

import OpenAI from "openai";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  dangerouslyAllowBrowser: true
});

export default function Home() {
  const [textInput, setTextInput] = useState("");
  const [messages, setMessages] = useState<{role:"You" | "ChatGPT", content:string}[]>([]);
  const middleAreaRef = useRef<HTMLDivElement>(null);

  const handleSubmit = useCallback(async () => {
    if(textInput === "") return;

    setMessages((prevMessages)=>[...prevMessages, {role:"You", content:textInput}]);

    const stream = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: textInput}],
      stream: true,
    });

    for await (const chunk of stream) {
      setMessages((prevMessages)=> {
        if(prevMessages[prevMessages.length-1].role == "You") {
          return [...prevMessages, {role:"ChatGPT", content:chunk.choices[0]?.delta?.content || ""}];
        } else {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length-1].content += chunk.choices[0]?.delta?.content || "";
          return newMessages;
        }
      });
    }
  },[textInput]);

  useEffect(()=>{
    if(middleAreaRef.current === null) return;
    middleAreaRef.current.scrollTop = middleAreaRef.current.scrollHeight;
  },[messages])

  return (
    <Base>
      <MiddleArea ref={middleAreaRef}>
        <Middle>
          {messages.map((message, index)=> {
            return (
            <MessageArea key={index}>
              <MessageLogo>
                {message.role === "You" ? <HumanLogo/> : <AndroidLogo/>}
              </MessageLogo>
              <MessageTextArea>
                <MessageTextTitle>{message.role}</MessageTextTitle>
                <MessageTextBody>{message.content}</MessageTextBody>
              </MessageTextArea>
            </MessageArea>
            )
          })}
        </Middle>
      </MiddleArea>
      <BottomArea>
        <Bottom>
          <AttachButtonArea>
            <AttachButton>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M9 7C9 4.23858 11.2386 2 14 2C16.7614 2 19 4.23858 19 7V15C19 18.866 15.866 22 12 22C8.13401 22 5 18.866 5 15V9C5 8.44772 5.44772 8 6 8C6.55228 8 7 8.44772 7 9V15C7 17.7614 9.23858 20 12 20C14.7614 20 17 17.7614 17 15V7C17 5.34315 15.6569 4 14 4C12.3431 4 11 5.34315 11 7V15C11 15.5523 11.4477 16 12 16C12.5523 16 13 15.5523 13 15V9C13 8.44772 13.4477 8 14 8C14.5523 8 15 8.44772 15 9V15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15V7Z" fill="#fff"/>
              </svg>
            </AttachButton>
          </AttachButtonArea>
          <TextInput
            rows={1}
            value={textInput}
            placeholder="Message CloneGPT..." 
            onChange={(e)=>{
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + "px";
              setTextInput(e.target.value);
            }}
            onKeyPress={(e)=>{ //onKeyDown has a issue triggering twice in Korean
              if(e.key === "Enter") {
                handleSubmit();
                setTextInput("");
                e.preventDefault();
              }
            }}/>
          <SubmitButtonArea>
            <SubmitButton
              $available={textInput !== ""}
              onClick={handleSubmit}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 11L12 6L17 11M12 18V7" stroke={textInput !== "" ? "#000" : "#2e303a"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </SubmitButton>
          </SubmitButtonArea>
        </Bottom>
      </BottomArea>
    </Base>
  )
}

const Base = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
`;

const MiddleArea = styled.div`
  width: 100%;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  overflow-y: scroll;
`

const Middle = styled.div`
  color: #fff;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const MessageArea = styled.div`
  display: flex;
  padding: 30px 20px;
  width: 100%;
  max-width: 700px;
  box-sizing: border-box;
`
const MessageLogo = styled.div`
  width: 30px;
  height: 30px;
  margin: 10px 10px 0px 0px;
`
const MessageTextArea = styled.div`
  flex-grow: 1;
`
const MessageTextTitle = styled.div`
  font-weight: 800;
  margin: 15px 0px 8px 0px;
  font-size: 17px;
`;
const MessageTextBody = styled.div`
  font-weight: 300;
  font-size: 16px;
`

function HumanLogo() {
  return (
  <svg xmlns="http://www.w3.org/2000/svg" data-name="Isolation Mode" viewBox="0 0 24 24" width="30" height="30" style={{fill: "#fff"}}>
    <path d="M21,24H18V19a2,2,0,0,0-2-2H8a2,2,0,0,0-2,2v5H3V19a5.006,5.006,0,0,1,5-5h8a5.006,5.006,0,0,1,5,5Z"/>
    <path d="M12,12a6,6,0,1,1,6-6A6.006,6.006,0,0,1,12,12Zm0-9a3,3,0,1,0,3,3A3,3,0,0,0,12,3Z"/>
  </svg>
  )
}

const AndroidLogo = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background: url("/android.jpeg");
  background-size: contain;
  background-position: center;
`

const BottomArea = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  max-width: 700px;
`;

const Bottom = styled.div`
  border: 1px solid #595a64;
  border-radius: 17px;
  margin: 30px 10px;
  width: 100%;
  display: flex;
  align-items: center;
`;

const AttachButtonArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: end;
  height: 100%;
`
const AttachButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15px;
`;

const TextInput = styled.textarea`
  color: #fff;
  background: transparent;
  flex-grow: 1;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  font-size: 16px;
  max-height: 200px;
  height: auto;
  resize: none;
`;

const SubmitButtonArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: end;
  height: 100%;
`;

const SubmitButton = styled.div<{$available: boolean}>`
  background: ${({$available})=>$available ? "#fff" : "#4b4d56"};
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 8px;
`;