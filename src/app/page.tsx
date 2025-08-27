import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home as HomeIcon, Building2, CheckCircle, Clock, Shield, Star, ArrowRight, Phone, Mail, MapPin } from 'lucide-react';

// A importação da imagem 'heroImage' foi removida daqui, pois ela será acessada diretamente da pasta public

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-servirlarBlue to-servirlarGreen rounded-lg flex items-center justify-center">
                <HomeIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-servirlarGray">ServirLar</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="#servicos" className="text-gray-600 hover:text-servirlarBlue transition-colors">Serviços</Link>
              <Link href="#sobre" className="text-gray-600 hover:text-servirlarBlue transition-colors">Sobre</Link>
              <Link href="#depoimentos" className="text-gray-600 hover:text-servirlarBlue transition-colors">Depoimentos</Link>
              <Link href="#contato" className="text-gray-600 hover:text-servirlarBlue transition-colors">Contato</Link>
            </nav>
            <Button style={{backgroundColor: 'var(--servirlar-blue)'}} className="text-white hover:opacity-90">
              Solicitar Orçamento
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="border-servirlarGreen text-servirlarGreen">
                  Novo Conceito
                </Badge>
                <h1 className="text-5xl font-bold text-servirlarGray leading-tight">
                  Cuidado e Excelência para Seu 
                  <span className="text-servirlarBlue"> Lar</span> e Sua 
                  <span className="text-servirlarGreen"> Empresa</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Profissionais qualificados em limpeza, organização e bem-estar, 
                  agora atendendo residências e ambientes corporativos com a confiança que você merece.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-servirlarBlue hover:bg-blue-600 text-white flex items-center gap-2"
                >
                  <HomeIcon className="w-5 h-5" />
                  Serviços para Casa
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-servirlarGreen text-servirlarGreen hover:bg-green-50 flex items-center gap-2"
                >
                  <Building2 className="w-5 h-5" />
                  Serviços para Empresas
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image 
                src="/hero-image.png" // O caminho da imagem foi corrigido aqui para a pasta public
                alt="Ambiente residencial e corporativo limpo e organizado" 
                className="rounded-2xl shadow-2xl w-full h-auto"
                width={800} 
                height={600} 
                layout="responsive"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Nossos Serviços */}
      <section id="servicos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-servirlarGray mb-4">
              Soluções Completas para Cada Necessidade
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Oferecemos serviços especializados tanto para o conforto do seu lar quanto para a produtividade da sua empresa
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-blue-100 hover:border-servirlarBlue transition-colors group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-servirlarBlue transition-colors">
                  <HomeIcon className="w-8 h-8 text-servirlarBlue group-hover:text-white transition-colors" />
                </div>
                <CardTitle className="text-2xl text-servirlarBlue">Para Sua Casa</CardTitle>
                <CardDescription className="text-lg">
                  Mais tempo livre e um lar impecável
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Limpeza, organização e cuidados diários com a confiança que você merece.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-servirlarGreen" />
                    <span>Limpeza residencial completa</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-servirlarGreen" />
                    <span>Organização de ambientes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-servirlarGreen" />
                    <span>Limpeza pós-obra</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-servirlarGreen" />
                    <span>Manutenção periódica</span>
                  </li>
                </ul>
                <Button className="w-full bg-servirlarBlue hover:bg-blue-600 text-white">
                  Saiba Mais
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100 hover:border-servirlarGreen transition-colors group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-servirlarGreen transition-colors">
                  <Building2 className="w-8 h-8 text-servirlarGreen group-hover:text-white transition-colors" />
                </div>
                <CardTitle className="text-2xl text-servirlarGreen">Para Sua Empresa</CardTitle>
                <CardDescription className="text-lg">
                  Ambientes produtivos e acolhedores
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Limpeza comercial, organização de escritórios e manutenção para o sucesso do seu negócio.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-servirlarBlue" />
                    <span>Limpeza comercial especializada</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-servirlarBlue" />
                    <span>Organização de escritórios</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-servirlarBlue" />
                    <span>Manutenção predial</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-servirlarBlue" />
                    <span>Serviços personalizados</span>
                  </li>
                </ul>
                <Button className="w-full bg-servirlarGreen hover:bg-green-600 text-white">
                  Saiba Mais
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Por Que Escolher */}
      <section id="sobre" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-servirlarGray mb-4">
              Por Que Escolher a ServirLar?
            </h2>
            <p className="text-xl text-gray-600">
              Confiança, Qualidade e Praticidade em Cada Detalhe
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-servirlarBlue rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-servirlarGray">Profissionais Qualificados</h3>
              <p className="text-gray-600">
                Equipe rigorosamente selecionada e treinada para garantir excelência em cada serviço.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-servirlarGreen rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-servirlarGray">Flexibilidade e Conveniência</h3>
              <p className="text-gray-600">
                Agendamento fácil e serviços personalizados para sua rotina e necessidades específicas.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-servirlarBlue rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-servirlarGray">Segurança e Transparência</h3>
              <p className="text-gray-600">
                Processos claros e sistema de avaliação que garantem sua total tranquilidade.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-servirlarGreen rounded-full flex items-center justify-center mx-auto">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-servirlarGray">Bem-Estar e Produtividade</h3>
              <p className="text-gray-600">
                Transformamos espaços para melhorar sua qualidade de vida e eficiência no trabalho.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section id="depoimentos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-servirlarGray mb-4">
              Quem Confia na ServirLar Recomenda
            </h2>
            <p className="text-xl text-gray-600">
              Veja o que nossos clientes falam sobre nossos serviços
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-l-4 border-l-servirlarGreen">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "Serviço excelente! Minha casa ficou impecável. A equipe é muito profissional e confiável."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-servirlarGreen rounded-full flex items-center justify-center text-white font-semibold">
                    M
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-servirlarGray">Maria S.</p>
                    <p className="text-sm text-gray-500">Cliente Residencial</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-servirlarBlue">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "Contratamos para nosso escritório e o resultado superou as expectativas. Ambiente sempre limpo e organizado."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-servirlarBlue rounded-full flex items-center justify-center text-white font-semibold">
                    J
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-servirlarGray">João P.</p>
                    <p className="text-sm text-gray-500">Gerente Comercial</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-servirlarGreen">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "Praticidade e qualidade em um só lugar. Recomendo para quem busca tranquilidade e excelência."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-servirlarGreen rounded-full flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-servirlarGray">Ana L.</p>
                    <p className="text-sm text-gray-500">Empresária</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-servirlarGray mb-4">
              Seu Cuidado a Apenas Alguns Cliques
            </h2>
            <p className="text-xl text-gray-600">
              Processo simples e transparente para contratar nossos serviços
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-servirlarBlue rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-servirlarGray">Escolha o Serviço</h3>
              <p className="text-gray-600">
                Selecione o tipo de serviço (casa ou empresa) e suas necessidades específicas.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-servirlarGreen rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-servirlarGray">Agende</h3>
              <p className="text-gray-600">
                Defina a data e horário que melhor se encaixam na sua agenda.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-servirlarBlue rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-servirlarGray">Receba o Profissional</h3>
              <p className="text-gray-600">
                Nossos especialistas chegam prontos para transformar seu espaço.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-servirlarGreen rounded-full flex items-center justify-center mx-auto">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-servirlarGray">Avalie</h3>
              <p className="text-gray-600">
                Sua opinião é fundamental para mantermos a excelência em nossos serviços.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section id="contato" className="py-20 bg-servirlarGray text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Pronto para Transformar Seu Espaço?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Entre em contato conosco e descubra como a ServirLar pode facilitar sua vida e otimizar seu negócio.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-servirlarBlue hover:bg-blue-600 text-white"
            >
              Solicitar Orçamento
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-servirlarGray"
            >
              Fale Conosco
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex items-center justify-center gap-3">
              <Phone className="w-6 h-6 text-servirlarGreen" />
              <span>(11) 99999-9999</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Mail className="w-6 h-6 text-servirlarGreen" />
              <span>contato@servirlar.com.br</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <MapPin className="w-6 h-6 text-servirlarGreen" />
              <span>São Paulo, SP</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-servirlarBlue to-servirlarGreen rounded-lg flex items-center justify-center">
                <HomeIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-servirlarGray">ServirLar</span>
            </div>
            <p className="text-gray-600 text-center md:text-right">
              © 2024 ServirLar. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
