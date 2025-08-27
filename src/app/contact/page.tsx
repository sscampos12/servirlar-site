
import { MarketingLayout } from "@/components/marketing-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MessageSquare } from "lucide-react";
import Link from 'next/link';

export default function ContactPage() {
  return (
    <MarketingLayout>
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <Mail className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="font-headline text-3xl">Entre em Contato</CardTitle>
            <CardDescription>
                Estamos aqui para ajudar. Escolha o melhor canal para você.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-muted/50 transition-colors">
                    <MessageSquare className="h-8 w-8 text-accent mb-2"/>
                    <h3 className="font-headline text-xl font-semibold text-foreground">WhatsApp</h3>
                    <p className="text-muted-foreground mb-3">Para um atendimento mais rápido e direto.</p>
                    <Link href="https://wa.me/5521920150039" target="_blank" className="font-bold text-primary hover:underline">
                        (21) 92015-0039
                    </Link>
                </div>
                 <div className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-muted/50 transition-colors">
                    <Mail className="h-8 w-8 text-primary mb-2"/>
                    <h3 className="font-headline text-xl font-semibold text-foreground">E-mail</h3>
                    <p className="text-muted-foreground mb-3">Para dúvidas, sugestões ou parcerias.</p>
                     <Link href="mailto:contato@servirlar.com.br" className="font-bold text-primary hover:underline">
                        contato@servirlar.com.br
                    </Link>
                </div>
          </CardContent>
        </Card>
      </div>
    </MarketingLayout>
  );
}
