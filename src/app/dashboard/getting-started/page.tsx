
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Shield, Database } from "lucide-react";

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm my-2">
        <code>{children}</code>
    </pre>
);

export default function GettingStartedPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-lg font-semibold md:text-2xl mb-4">
          Guia de Configuração Essencial
        </h1>
        <p className="text-muted-foreground">
            Siga estes passos no seu Console do Firebase para garantir que a aplicação funcione corretamente.
        </p>
      </div>

       <Alert className="border-primary bg-primary/5">
          <Lightbulb className="h-4 w-4" />
          <AlertTitle className="font-headline text-primary">Por que isso é necessário?</AlertTitle>
          <AlertDescription>
            O Firebase protege seu projeto por padrão. Precisamos configurar permissões para que sua aplicação possa se conectar ao banco de dados e autenticar usuários de forma segura.
          </AlertDescription>
        </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Database className="h-5 w-5" />
            1. Regras de Segurança do Firestore
          </CardTitle>
          <CardDescription>
            Permita que a aplicação leia e escreva dados no banco de dados.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="mb-2">1. Navegue até <strong className="text-primary">Build &gt; Firestore Database &gt; Rules</strong> no Console do Firebase.</p>
            <p className="mb-2">2. Substitua o conteúdo existente por estas regras:</p>
            <CodeBlock>
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permite leitura e escrita para todos durante o desenvolvimento.
    // Em produção, implemente regras mais restritivas.
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
            </CodeBlock>
            <p>3. Clique em <strong>Publish</strong>.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Shield className="h-5 w-5" />
            2. Domínios de Autenticação Autorizados
          </CardTitle>
          <CardDescription>
            Permita que o Firebase Auth aceite logins do seu ambiente de desenvolvimento e produção.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="mb-2">1. Navegue até <strong className="text-primary">Build &gt; Authentication &gt; Settings &gt; Authorized domains</strong>.</p>
            <p className="mb-2">2. Clique em <strong>Add domain</strong> e adicione os seguintes domínios, um de cada vez:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
                <li><CodeBlock>localhost</CodeBlock></li>
                <li><CodeBlock>lar-seguro-76fan.web.app</CodeBlock></li>
            </ul>
        </CardContent>
      </Card>
    </div>
  )
}
