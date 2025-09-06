# ServirLar - Projeto Firebase Studio

Este é um projeto Next.js gerenciado através do Firebase Studio.

## Como Configurar as Chaves Secretas (Stripe)

Certas configurações, como chaves de API secretas, não podem ser definidas diretamente no editor do Firebase Studio por razões de segurança. Elas devem ser configuradas usando o terminal do seu computador (como o PowerShell ou o Terminal do macOS/Linux).

Siga os passos abaixo no seu computador local.

### Passo 1: Tenha o Código no seu Computador

Certifique-se de que você tem a versão mais recente do código do seu projeto salva em uma pasta no seu computador.

### Passo 2: Abra o Terminal na Pasta do Projeto

Use o comando `cd` para navegar até a pasta onde você salvou o projeto.

**Exemplo (Windows PowerShell):**
```powershell
cd C:\caminho\para\seu\projeto\servirlar
```

### Passo 3: Faça Login na sua Conta Firebase

Se ainda não estiver logado, execute:
```bash
firebase login
```
Uma janela do navegador será aberta para você fazer login com a conta do Google associada a este projeto.

### Passo 4: Configure as Chaves do Stripe

Execute os dois comandos abaixo, um de cada vez. **Substitua os valores de exemplo pelas suas chaves reais** que você pegou no seu painel do Stripe.

**Chave Secreta:**
```bash
firebase functions:config:set stripe.secret="sk_test_SUA_CHAVE_SECRETA_REAL"
```

**Webhook Secret:**
```bash
firebase functions:config:set stripe.webhook_secret="whsec_SEU_WEBHOOK_SECRET_REAL"
```

O terminal confirmará que cada configuração foi salva.

### Passo 5: Faça o Deploy das Funções

Para que as funções no servidor do Firebase comecem a usar as chaves que você acabou de configurar, execute o comando de deploy:

```bash
firebase deploy --only functions
```

Aguarde a mensagem "Deploy complete!".

**Pronto!** Após seguir estes passos, seu sistema de pagamento estará configurado de forma correta e segura.
