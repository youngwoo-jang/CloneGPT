import { useCallback, useState } from "react";

type Role = "user" | "assistant";

export default function useGPT() {
    const [messages, setMessages] = useState<{role:Role, message:string}[]>([]);

    const chat = useCallback(async (message: string) => {
        
    }, []);

    return {
        chat
    }
}