
import { Bell, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "../ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Notification {
    id: string;
    title: string;
    description: string;
    isRead: boolean;
    link?: string;
    createdAt: any;
}

export function Notifications() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
        setIsLoading(false);
        return;
    }
    
    const q = query(
        collection(db, "notifications"), 
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const notifs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Notification));
        setNotifications(notifs);
        setIsLoading(false);
    });

    return () => unsubscribe();

  }, [user]);

  const handleNotificationClick = async (notification: Notification) => {
      if (!notification.isRead) {
          const notifRef = doc(db, 'notifications', notification.id);
          await updateDoc(notifRef, { isRead: true });
      }
      if (notification.link) {
          router.push(notification.link);
      }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
             <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">{unreadCount}</Badge>
          )}
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notificações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
            <DropdownMenuItem disabled>
                <Loader2 className="h-4 w-4 animate-spin mr-2"/> Carregando...
            </DropdownMenuItem>
        ) : notifications.length > 0 ? (
            notifications.map(notification => (
                <DropdownMenuItem 
                    key={notification.id} 
                    className={`flex flex-col items-start gap-1 whitespace-normal cursor-pointer ${!notification.isRead ? 'bg-muted/50' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                >
                    <p className="font-semibold text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.description}</p>
                </DropdownMenuItem>
            ))
        ) : (
            <DropdownMenuItem disabled>
                <p className="text-sm text-muted-foreground">Nenhuma nova notificação.</p>
            </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
