
"use client";
import { useEffect, useState, useRef } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScheduleLayout } from "@/app/schedule/layout";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
    id: string;
    from: string;
    text: string;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    } | null;
}

export default function ChatPage({ params }: { params: { chatId: string } }) {
  const chatId = params.chatId;
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const listRef = useRef<HTMLDivElement|null>(null);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
        router.push(`/login?redirect=/chat/${chatId}`);
        return;
    }

    const verifyMembership = async () => {
        const chatRef = doc(db, 'chats', chatId);
        const chatSnap = await getDoc(chatRef);

        if (chatSnap.exists()) {
            const chatData = chatSnap.data();
            if (!chatData.members.includes(user.uid)) {
                router.push('/dashboard'); // Not a member, redirect
                return;
            }
        } else {
             router.push('/dashboard'); // Chat doesn't exist
             return;
        }

        const q = query(collection(db, `chats/${chatId}/messages`), orderBy("createdAt", "asc"));
        const unsub = onSnapshot(q, (snap) => {
            const newMessages = snap.docs.map(d => ({ id: d.id, ...d.data() } as Message));
            setMessages(newMessages);
            setIsLoading(false);
            // scroll to bottom
            setTimeout(()=> listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }), 100);
        });
        return () => unsub();
    }
    
    verifyMembership();

  }, [chatId, user, authLoading, router]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user || isSending) return;

    setIsSending(true);
    const tempText = text;
    setText("");

    try {
        // add message
        await addDoc(collection(db, `chats/${chatId}/messages`), {
        from: user.uid,
        text: tempText.trim(),
        createdAt: serverTimestamp()
        });

        // Update chat metadata (lastMessage, etc.)
        const chatRef = doc(db, 'chats', chatId);
        await updateDoc(chatRef, {
            lastMessage: tempText.trim(),
            lastMessageAt: serverTimestamp()
        });

    } catch (error) {
        console.error("Error sending message:", error);
        setText(tempText); // Restore text on error
    } finally {
        setIsSending(false);
    }
  };

  if (isLoading || authLoading) {
      return (
        <ScheduleLayout>
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin" />
            </div>
        </ScheduleLayout>
      )
  }

  return (
    <ScheduleLayout>
        <Card className="max-w-3xl mx-auto flex flex-col h-[80vh]">
            <CardHeader>
                <CardTitle className="font-headline">Chat de Serviço</CardTitle>
            </CardHeader>
            <CardContent ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                 {messages.map(m => (
                    <div key={m.id} className={cn("flex items-end gap-2", m.from === user?.uid ? "justify-end" : "justify-start")}>
                         {m.from !== user?.uid && (
                            <Avatar className="h-8 w-8">
                               <AvatarFallback>{/* Can fetch other user's initial */'P'}</AvatarFallback>
                           </Avatar>
                         )}
                        <div className={cn(
                            "max-w-xs md:max-w-md p-3 rounded-lg",
                             m.from === user?.uid ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"
                        )}>
                            <p className="text-sm">{m.text}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
            <div className="p-4 border-t">
                <form onSubmit={handleSend} className="flex gap-2">
                    <Input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Escreva sua mensagem..." autoComplete="off" />
                    <Button type="submit" disabled={isSending || !text.trim()}>
                        {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </form>
            </div>
        </Card>
    </ScheduleLayout>
  );
}

    