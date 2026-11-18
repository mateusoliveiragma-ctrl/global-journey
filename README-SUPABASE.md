# Global Journey — configuração da autenticação

1. Crie um projeto em https://supabase.com/dashboard.
2. Em **Project Settings → API**, copie a URL do projeto e a chave pública **anon/publishable**.
3. Preencha `supabase-config.js`. **Nunca** use `service_role` ou chaves secretas no navegador.
4. Em **Authentication → URL Configuration**, configure **Site URL** para a URL pública da Vercel e adicione essa URL aos **Redirect URLs**.
5. Em **Authentication → Providers → Email**, habilite e configure confirmação por e-mail. Para produção, configure SMTP próprio.
6. Publique a branch após revisão e teste: cadastro, confirmação, login, logout, sessão persistente e recuperação de senha.

## Limitações transparentes
- O mapa utiliza dados geográficos reais do OpenStreetMap, mas a posição e bateria da mala são **simuladas**.
- O chip e os planos exibem preços sugeridos. **Não há checkout nem cobrança real**.
- Viagens e histórico ainda ficam no armazenamento local do navegador; não são sincronizados ao Supabase.
- Links externos de viagens e transporte não garantem compra ou reserva.
- O fluxo de recuperação envia o e-mail, mas a tela para definir a nova senha deve ser adicionada antes do lançamento comercial.
- Revise políticas de privacidade, consentimento, acessibilidade, segurança e limites de uso do OpenStreetMap antes de produção.
