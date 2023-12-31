'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import CodeBlock from "@/src/components/CodeBlock";
import Submit from "@/src/components/Submit";

export default function Home() {
  const [textInput, setTextInput] = useState("");
  const [messages, setMessages] = useState<{role:"user" | "assistant", content:string}[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const middleAreaRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const stoppedGenerating = useRef(false);
  const isActivatedAutoScroll = useRef(true);

  const availableToSubmit = textInput !== "";

  // Scroll to bottom when new message is added
  useEffect(()=>{
    if(middleAreaRef.current === null || isActivatedAutoScroll.current === false) return;
    middleAreaRef.current.scrollTop = Number.MAX_SAFE_INTEGER;
  },[messages])

  // Auto resize text input
  useEffect(()=>{
    if(textInputRef.current === null) return;
    textInputRef.current.style.height = 'auto';
    textInputRef.current.style.height = textInputRef.current.scrollHeight + "px";
  },[textInput])

  useEffect(()=>{
    // const eventSource = new EventSource("/api/chat", {
    //   withCredentials: true,
    // });
    // console.info("Listenting on SEE", eventSource);
    // eventSource.onmessage = (event) => {
    //   console.log("onMessage");
    // };
  
    // return () => {
    //   console.info("Closing SSE");
    //   eventSource.close();
    // };
  },[])

  const handleScroll = useCallback(() => {
    if(middleAreaRef.current === null) return;
    isActivatedAutoScroll.current = middleAreaRef.current.scrollTop >= middleAreaRef.current.scrollHeight - middleAreaRef.current.clientHeight - 50; //50 is just margin
  },[middleAreaRef]);

  const handleSubmit = useCallback(async () => {
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [...messages, { role: "user", content: textInput}]
      })
    });

    console.log("first res arrived")

    const reader = res.body?.getReader();
    let decoder = new TextDecoder();
    while(true) {
      const data = await reader?.read();
      if(data?.done===undefined || data?.value===undefined) break;

      const { done, value } = data;
      if(done) break;
      let string = decoder.decode(value);
      console.log(string);
    }
    console.log("done")

    // if(availableToSubmit === false) return;

    // setTextInput("");
    // setIsGenerating(true);
    // setMessages((prevMessages)=>[...prevMessages, {role:"user", content:textInput}]);

    // setIsGenerating(false);
  },[textInput, availableToSubmit, messages]);

  const handleStop = () => {
    stoppedGenerating.current = true;
  }

  return (
    <Base>
      <MiddleArea ref={middleAreaRef} onScroll={handleScroll}>
        <Middle>
          {messages.map((message, index)=> {
            return (
            <MessageArea key={index}>
              <MessageLogo>
                {message.role === "user" 
                  ? <HumanLogo size={30}/> 
                  : <AndroidLogo/>
                }
              </MessageLogo>
              <MessageTextArea>
                <MessageTextTitle>
                  {
                  message.role === "user"
                    ? "You"
                    : "CloneGPT"
                  }
                </MessageTextTitle>
                <MessageTextBody>
                  {
                  message.content.split("```").map((text, index)=>{
                    if(index % 2 === 1) {
                      return (
                        <CodeBlock key={index} code={text}></CodeBlock>
                      )
                    } else {
                      return text
                    }
                  })
                  }
                </MessageTextBody>
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
            ref={textInputRef}
            rows={1}
            value={textInput}
            placeholder="Message CloneGPT..." 
            onChange={(e)=>{
              setTextInput(e.target.value);
            }}
            onKeyPress={(e)=>{ //onKeyDown has a issue triggering twice in Korean)
              if(e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                
                if(textInput === "" || isGenerating) return;
                handleSubmit();
              }
            }}/>
          <SubmitButtonArea>
            {isGenerating 
              ? <StopButton 
                  onClick={handleStop}/>
              : <SubmitButton
                  $available={availableToSubmit}
                  onClick={handleSubmit}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M7 11L12 6L17 11M12 18V7" stroke={textInput !== "" ? "#000" : "#2e303a"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </SubmitButton>
            }
          </SubmitButtonArea>
        </Bottom>
      </BottomArea>
      <Submit/>
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
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 1rem;
    width: 9px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: hsla(0,0%,100%,.1);
    border-color: rgba(255,255,255,1);
    border-radius: 9999px;
    border-width: 1px;
  }
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
  padding: 17px 20px;
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
  white-space: pre-wrap;
  line-height: 1.8;
`

function HumanLogo({size}: {size?: number}) {
  return (
  <svg xmlns="http://www.w3.org/2000/svg" data-name="Isolation Mode" viewBox="0 0 24 24" width={size} height={size} style={{fill: "#fff"}}>
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
  margin: 20px 15px;
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
  margin: 15px 0px;
  line-height: 1.6;
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
  margin: 16px 15px;
`;

const StopButtonRing = styled.div`
  border-radius: 50%;
  border: 2px solid #d9d9e3;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  width: 20px;
  height: 20px;
  margin: 19px 15px;
`
const StopButtonSquare = styled.div`
  background: #d9d9e3;
  width: 40%;
  height: 40%;
`

function StopButton({...props}) {
  return (
  <StopButtonRing {...props}>
    <StopButtonSquare/>
  </StopButtonRing>
  )
}