
import { MarketingLayout } from "@/components/marketing-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const TestimonialCard = ({ name, role, feedback, avatarSrc, rating }: { name: string, role: string, feedback: string, avatarSrc: string, rating: number }) => (
    <Card className="flex flex-col">
        <CardContent className="p-6 pb-4 flex-grow">
            <div className="flex mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < rating ? 'text-accent fill-accent' : 'text-muted-foreground/30'}`} />
                ))}
            </div>
            <p className="text-muted-foreground italic">"{feedback}"</p>
        </CardContent>
        <CardHeader className="flex-row items-center gap-4 pt-0">
            <Avatar>
                <AvatarImage src={avatarSrc} alt={name} data-ai-hint="person" />
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="text-base font-bold">{name}</CardTitle>
                <p className="text-sm text-muted-foreground">{role}</p>
            </div>
        </CardHeader>
    </Card>
);

export default function TestimonialsPage() {
  return (
    <MarketingLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">
            O que nossos clientes dizem
          </h1>
          <p className="text-lg text-muted-foreground">
            A satisfação de quem confia na gente é o nosso maior orgulho e o nosso principal indicador de qualidade.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard 
                name="Ana Clara S."
                role="Cliente de Faxina"
                feedback="Serviço impecável! A profissional foi pontual, muito educada e deixou minha casa brilhando. Com certeza usarei novamente."
                avatarSrc="https://placehold.co/100x100.png"
                rating={5}
            />
             <TestimonialCard 
                name="Lucas Mendes"
                role="Cliente de Cozinheira"
                feedback="Plataforma muito fácil de usar. Consegui agendar uma cozinheira para um jantar especial e foi tudo perfeito. Recomendo!"
                avatarSrc="https://placehold.co/100x100.png"
                rating={5}
            />
             <TestimonialCard 
                name="Mariana Costa"
                role="Cliente de Passadoria"
                feedback="Tinha um monte de roupa para passar e a profissional que veio foi super rápida e caprichosa. Salvou minha semana!"
                avatarSrc="https://placehold.co/100x100.png"
                rating={5}
            />
            <TestimonialCard 
                name="Roberto F."
                role="Cliente de Faxina"
                feedback="A qualidade da limpeza foi muito boa. O único ponto é que a profissional chegou 15 minutos atrasada, mas comunicou o imprevisto."
                avatarSrc="https://placehold.co/100x100.png"
                rating={4}
            />
             <TestimonialCard 
                name="Beatriz Lima"
                role="Cliente de Cuidadora"
                feedback="Contratei uma cuidadora para minha mãe e fiquei muito tranquila. A profissional foi atenciosa e muito carinhosa."
                avatarSrc="https://placehold.co/100x100.png"
                rating={5}
            />
             <TestimonialCard 
                name="Carlos Eduardo"
                role="Cliente de Faxina"
                feedback="Excelente custo-benefício. A casa ficou limpa e o processo de agendamento é o mais simples que já vi."
                avatarSrc="https://placehold.co/100x100.png"
                rating={5}
            />
        </div>
      </div>
    </MarketingLayout>
  );
}
