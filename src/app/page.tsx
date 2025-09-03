
import { MarketingLayout } from "@/components/marketing-layout";
import { Button } from "@/components/ui/button";
import { Clock, ShieldCheck, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const WhyChooseUsCard = ({ icon, title, description, iconColor }: { icon: React.ReactNode, title: string, description: string, iconColor: string }) => (
  <div className="text-center p-10 bg-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
      <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-gradient-to-br ${iconColor}`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4 font-headline">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
  </div>
);

const whyChooseUsFeatures = [
    {
      id: 1,
      title: "Profissionais Qualificados",
      description: "Equipe rigorosamente selecionada e treinada para garantir excelência em cada serviço.",
      iconColor: "from-blue-500 to-blue-600",
      icon: (
         <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M12 7C13.4 7 14.8 8.6 14.8 10V11.5C15.4 11.5 16 12.4 16 13V16C16 17.4 15.4 18 14.8 18H9.2C8.6 18 8 17.4 8 16V13C8 12.4 8.6 11.5 9.2 11.5V10C9.2 8.6 10.6 7 12 7M12 8.2C11.2 8.2 10.5 8.7 10.5 10V11.5H13.5V10C13.5 8.7 12.8 8.2 12 8.2Z"/>
        </svg>
      )
    },
    {
      id: 2,
      title: "Flexibilidade e Conveniência",
      description: "Agendamento fácil e serviços personalizados para sua rotina e necessidades específicas.",
      iconColor: "from-green-500 to-green-600",
      icon: (
        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
        </svg>
      )
    },
    {
      id: 3,
      title: "Segurança e Transparência",
      description: "Processos claros e sistema de avaliação que garantem sua total tranquilidade.",
      iconColor: "from-blue-500 to-blue-600",
      icon: (
         <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2M21 9V7L15 1L13.5 2.5L16.17 5.33L10.5 11L15.5 16L21 10.5L19.33 8.83L21 9M7.91 17.91C7.91 17.91 4.6 14.6 1.29 17.91C1.29 17.91 4.6 21.22 7.91 17.91M8.5 12.5L12 16L8.5 19.5L5 16L8.5 12.5Z"/>
        </svg>
      )
    },
    {
      id: 4,
      title: "Bem-Estar e Produtividade",
      description: "Transformamos espaços para melhorar sua qualidade de vida e eficiência no trabalho.",
      iconColor: "from-cyan-500 to-cyan-600",
      icon: (
        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/>
        </svg>
      )
    }
];

const testimonials = [
    {
      id: 1,
      name: "Maria S.",
      role: "Cliente Residencial",
      rating: 5,
      text: "Serviço excelente! Minha casa ficou impecável. A equipe é muito profissional e confiável.",
      avatar: "M",
      avatarColor: "from-cyan-500 to-cyan-600"
    },
    {
      id: 2,
      name: "João P.",
      role: "Gerente Comercial",
      rating: 5,
      text: "Contratamos para nosso escritório e o resultado superou as expectativas. Ambiente sempre limpo e organizado.",
      avatar: "J",
      avatarColor: "from-blue-500 to-blue-600"
    },
    {
      id: 3,
      name: "Ana L.",
      role: "Empresária",
      rating: 5,
      text: "Praticidade e qualidade em um só lugar. Recomendo para quem busca tranquilidade e excelência.",
      avatar: "A",
      avatarColor: "from-green-500 to-green-600"
    }
  ];

const TestimonialsSection = () => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${index < rating ? 'fill-yellow-400' : 'fill-gray-300'}`}
        viewBox="0 0 24 24"
      >
        <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/>
      </svg>
    ));
  };

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-headline">
            Quem Confia na ServirLar Recomenda
          </h2>
          <p className="text-xl text-gray-600 font-normal">
            Veja o que nossos clientes falam sobre nossos serviços
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 hover:border-blue-100 transition-all duration-300"
            >
              <div className="flex gap-1 mb-5">
                {renderStars(testimonial.rating)}
              </div>
              
              <blockquote className="text-lg leading-relaxed text-gray-800 mb-6 italic">
                "{testimonial.text}"
              </blockquote>
              
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg text-white bg-gradient-to-br ${testimonial.avatarColor}`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorksStep = ({ number, title, description, icon, isLast = false }: { number?: number, title: string, description: string, icon?: React.ReactNode, isLast?: boolean }) => (
    <div className="flex flex-col items-center text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${number ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'}`}>
            {number ? (
                 <span className="text-2xl font-bold">{number}</span>
            ) : (
                icon
            )}
        </div>
        <h3 className="font-headline text-xl mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
    </div>
);


const HowItWorksSection = () => {
    return (
        <section className="bg-muted/30 py-20 md:py-28">
            <div className="container mx-auto px-4">
                 <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="font-headline text-4xl md:text-5xl font-bold text-foreground mb-4">Seu Cuidado a Apenas Alguns Cliques</h2>
                    <p className="text-lg text-muted-foreground">Processo simples e transparente para contratar nossos serviços</p>
                </div>
                 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 items-start">
                    <HowItWorksStep 
                        number={1}
                        title="Escolha o Serviço"
                        description="Selecione o tipo de serviço (casa ou empresa) e suas necessidades específicas."
                    />
                     <HowItWorksStep 
                        number={2}
                        title="Agende"
                        description="Defina a data e horário que melhor se encaixam na sua agenda."
                    />
                     <HowItWorksStep 
                        number={3}
                        title="Receba o Profissional"
                        description="Nossos especialistas chegam prontos para transformar seu espaço."
                    />
                     <HowItWorksStep 
                        title="Avalie"
                        description="Sua opinião é fundamental para mantermos a excelência em nossos serviços."
                        icon={<Star className="w-8 h-8" />}
                    />
                </div>
            </div>
        </section>
    )
}

const CtaSection = () => {
    return (
        <section style={{ backgroundColor: '#494949' }} className="py-20">
            <div className="container mx-auto px-4 text-center">
                <h2 className="font-headline text-4xl font-bold text-white mb-4">
                    Pronto para Transformar Seu Espaço?
                </h2>
                <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                    Agende um serviço com nossos profissionais qualificados ou junte-se à nossa equipe e comece a oferecer seus talentos.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="text-lg h-12">
                        <Link href="/login">Agendar Serviço</Link>
                    </Button>
                    <Button asChild size="lg" variant="secondary" className="text-lg h-12 bg-white text-primary hover:bg-gray-200">
                        <Link href="/register/provider">Seja um Profissional</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default function Home() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="bg-muted/30">
        <div className="container mx-auto px-4 py-20 md:py-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="text-center md:text-left">
                    <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
                        Cuidado e excelência para seu <span className="text-primary">lar</span> e sua <span className="text-accent">empresa</span>.
                    </h1>
                    <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto md:mx-0">
                        Conectamos você aos melhores profissionais, oferecendo serviços de limpeza, organização e cuidados com a confiança e a qualidade que você merece.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Button asChild size="lg" className="text-lg h-12">
                            <Link href="/login">Agendar um Serviço</Link>
                        </Button>
                        <Button asChild size="lg" variant="secondary" className="text-lg h-12">
                            <Link href="/register/provider">Seja um Profissional</Link>
                        </Button>
                    </div>
                </div>
                 <div>
                    <Image 
                        src="https://picsum.photos/600/400"
                        width={600}
                        height={400}
                        alt="Divisão entre um escritório organizado e uma sala de estar aconchegante"
                        className="rounded-lg shadow-xl"
                        data-ai-hint="office living room"
                        priority
                    />
                </div>
            </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5">
            <div className="text-center mb-16">
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Por Que Escolher a ServirLar?
            </h2>
            <p className="text-xl text-gray-600">
                Confiança, Qualidade e Praticidade em Cada Detalhe
            </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {whyChooseUsFeatures.map((feature) => (
                    <WhyChooseUsCard 
                        key={feature.id}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                        iconColor={feature.iconColor}
                    />
                ))}
            </div>
        </div>
      </section>

       {/* Testimonials Section */}
       <TestimonialsSection />

       {/* How it Works Section */}
       <HowItWorksSection />
       
       {/* Call to Action Section */}
       <CtaSection />
       
    </MarketingLayout>
  );
}
