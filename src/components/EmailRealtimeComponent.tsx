import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Email {
    uid: number;
    subject: string;
    from: string;
    to: string;
    date: string;
    seen: boolean;
    text: string;
}

const BACKEND_URL = "http://localhost:3002";
const EmailRealtimeComponent: React.FC = () => {
    const [emails, setEmails] = useState<Email[]>([]);

    useEffect(() => {
        const socket: Socket = io(BACKEND_URL);

        socket.on("connect", () => {
            console.log("Connected to backend websocket!");
        });

        // Nhận email mới từ backend
        socket.on("new-email", (email: Email) => {
            setEmails(prev => [email, ...prev]);
        });

        // Clean up khi component unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            <h2>Email nhận realtime</h2>
            {emails.length === 0 && <p>Chưa có email mới.</p>}
            <ul>
                {emails.map((e, i) => (
                    <li key={e.uid + "_" + i} style={{ marginBottom: 8, borderBottom: "1px solid #eee", padding: 8 }}>
                        <div><b>From:</b> {e.from}</div>
                        <div><b>Subject:</b> {e.subject}</div>
                        <div><b>Date:</b> {e.date}</div>
                        <div><b>Text:</b> {e.text?.slice(0, 100) || "[no text]"}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EmailRealtimeComponent;
