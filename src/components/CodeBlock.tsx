import Prism from "prismjs";
import { useEffect, useMemo } from "react";
import styled from "styled-components";

export default function CodeBlock({code}:{code:string}) {
    const [language, body] = useMemo(()=>{
        const indexOfFistBreak = code.indexOf('\n');
        return [code.substring(0, indexOfFistBreak), code.substring(indexOfFistBreak+1) ];
    },[code]);

    useEffect(() => {
        Prism.highlightAll();
    }, [code]);

    return (
    <Base>
        <Header>
            <Lanugage>
                {language}
            </Lanugage>
            <CopyButtonArea>
                <CopyButtonIcon/>
                <CopyButtonText>
                    Copy code
                </CopyButtonText>
            </CopyButtonArea>
        </Header>
        <CodeArea>
            <code
                className={`language-${language}`}
            >
            {body}
            </code>
        </CodeArea>
    </Base>
    );
}

const Base = styled.div`
    
`
const Header = styled.div`
    background: #202123;
    display: flex;
    align-items: center;
    border-radius: 5px 5px 0px 0px;
`
const Lanugage = styled.div`
    flex-grow: 1;
    font-size: 12px;
    padding: 0px 0px 0px 13px;
    height: 30px;
    display: flex;
    align-items: center;
`
const CopyButtonArea = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
    margin-right: 12px;
`

const CopyButtonIconArea = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`
const CopyButtonIconSvg = styled.svg`
    width: 16px;
    height: 16px;
`
function CopyButtonIcon() {
    return (
    <CopyButtonIconArea>
        <CopyButtonIconSvg width={24} height={24} viewBox={`0 0 24 24`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 4C10.8954 4 10 4.89543 10 6H14C14 4.89543 13.1046 4 12 4ZM8.53513 4C9.22675 2.8044 10.5194 2 12 2C13.4806 2 14.7733 2.8044 15.4649 4H17C18.6569 4 20 5.34315 20 7V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V7C4 5.34315 5.34315 4 7 4H8.53513ZM8 6H7C6.44772 6 6 6.44772 6 7V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V7C18 6.44772 17.5523 6 17 6H16C16 7.10457 15.1046 8 14 8H10C8.89543 8 8 7.10457 8 6Z" fill="#fff"/>
        </CopyButtonIconSvg>
    </CopyButtonIconArea>
    )
}

const CopyButtonText = styled.div`
    font-size: 13px;
    padding: 3px 5px 0px 5px;
`
const CodeArea = styled.pre`
    margin: 0px !important;
    border-radius: 0px 0px 5px 5px !important;
    background: #000 !important;
    font-size: 14px !important;
`