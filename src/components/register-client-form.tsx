
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export function ClientRegistrationForm() {
  const [agreedToContract, setAgreedToContract] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToContract) {
      toast({
        variant: "destructive",
        title: "Erro de Validação",
        description: "Por favor, leia e aceite os Termos de Uso e a Política de Privacidade para continuar.",
      });
      return;
    }
    if (password !== confirmPassword) {
        toast({
            variant: "destructive",
            title: "Erro de Validação",
            description: "As senhas não coincidem.",
        });
        return;
    }
    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Erro de Validação",
        description: "A senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }


    setIsLoading(true);

    try {
        // 1. Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Save additional user info to Firestore
        await setDoc(doc(db, "clients", user.uid), {
            fullName: fullName,
            email: user.email,
            phone: phone,
            address: address,
            cpf: cpf,
        });

        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            role: "client",
            name: fullName,
            email: user.email,
        });
        
        // --- INÍCIO DO CÓDIGO DO E-MAIL DE BOAS-VINDAS ---
        console.log("Cadastro salvo com sucesso! Preparando para enviar e-mail de boas-vindas...");

        const subject = `Bem-vindo(a) à ServirLar, ${fullName}!`;
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; margin: 0; padding: 0; background-color: #f4f4f7; }
                    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
                    .header { background-color: #4A90E2; padding: 20px; text-align: center; }
                    .header img { max-width: 150px; }
                    .content { padding: 30px; line-height: 1.6; color: #333; }
                    .content h1 { color: #1e293b; font-size: 24px; }
                    .content p { font-size: 16px; margin-bottom: 20px; }
                    .button { display: inline-block; background-color: #50E3C2; color: #1e293b; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold; }
                    .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://i.postimg.cc/dQWcQ6kF/logo-oficial-5.png" alt="ServirLar Logo">
                    </div>
                    <div class="content">
                        <h1>Bem-vindo(a), ${fullName}!</h1>
                        <p>Seu cadastro em nossa plataforma foi realizado com sucesso. Estamos muito felizes em ter você conosco.</p>
                        <p>Agora você pode agendar os melhores serviços para seu lar e sua empresa com apenas alguns cliques. Explore a plataforma e descubra como podemos facilitar o seu dia a dia.</p>
                        <p style="text-align: center; margin-top: 30px;">
                            <a href="https://lar-seguro-76fan.web.app/login" class="button">Acessar minha conta</a>
                        </p>
                        <p>Se precisar de algo, nossa equipe está sempre à disposição.</p>
                        <p>Atenciosamente,<br>Equipe ServirLar</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} ServirLar. Todos os direitos reservados.</p>
                        <p>Se você não se cadastrou, por favor, ignore este e-mail.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        try {
            await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: email,
                    subject: subject,
                    html: htmlContent,
                }),
            });
            console.log(`E-mail de boas-vindas enviado para ${email}`);
        } catch (emailError) {
            console.error("ERRO AO ENVIAR E-MAIL DE BOAS-VINDAS:", emailError);
        }
        // --- FIM DO CÓDIGO DO E-MAIL DE BOAS-VINDAS ---

        toast({
            title: "Cadastro Realizado!",
            description: "Sua conta foi criada com sucesso. Redirecionando...",
        });
        
        // Sign in the user automatically and redirect
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/dashboard/my-account');

    } catch (error: any) {
        let errorMessage = "Ocorreu um erro ao criar sua conta. Tente novamente.";
      
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = "Este email já está em uso. Tente fazer login ou use outro email.";
            break;
          case 'auth/invalid-email':
            errorMessage = "Email inválido. Por favor, verifique o formato do email.";
            break;
          case 'auth/weak-password':
            errorMessage = "Senha muito fraca. Use pelo menos 6 caracteres.";
            break;
          case 'auth/network-request-failed':
            errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
            break;
        }

        toast({
            variant: "destructive",
            title: "Erro no Cadastro",
            description: errorMessage,
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Crie sua conta com e-mail e senha
          </span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input id="fullName" name="fullName" placeholder="Seu nome" required value={fullName} onChange={e => setFullName(e.target.value)} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="seu@email.com" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" name="phone" placeholder="(00) 00000-0000" required value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
          </div>
           <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                  <Label htmlFor="address">Endereço Principal</Label>
                  <Input id="address" name="address" placeholder="Rua, Número, Bairro, Cidade, Estado" required value={address} onChange={e => setAddress(e.target.value)} />
              </div>
                <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input id="cpf" name="cpf" placeholder="000.000.000-00" required value={cpf} onChange={e => setCpf(e.target.value)} />
                </div>
            </div>
          <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          </div>
          </div>
          
          <div className="space-y-4 pt-4">
            <div className="flex items-start space-x-2">
                <Checkbox id="agreeContract" checked={agreedToContract} onCheckedChange={(checked) => setAgreedToContract(!!checked)} className="mt-1" />
                <Label htmlFor="agreeContract" className="text-sm font-normal leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Eu li e concordo com os <Link href="/legal" target="_blank" className="font-semibold text-primary underline-offset-4 hover:underline">Termos de Uso</Link> e a <Link href="/legal#privacy" target="_blank" className="font-semibold text-primary underline-offset-4 hover:underline">Política de Privacidade</Link> da plataforma.
                </Label>
            </div>
          </div>

          <div className="text-center pt-4">
          <Button type="submit" size="lg" disabled={!agreedToContract || isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Criar Conta"}
          </Button>
          </div>
      </form>
    </div>
  );
}
