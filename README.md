[README-HOSTING.txt](https://github.com/user-attachments/files/32840208/README-HOSTING.txt)
GLOBAL JOURNEY — E-MAIL DE BOAS-VINDAS

O site continua funcionando como demonstração mesmo sem o envio real de e-mail.
Para ativar o envio automático depois do login, publique o projeto em uma plataforma que execute a função /api/welcome-email.js (por exemplo, Vercel) e configure estas variáveis de ambiente:

RESEND_API_KEY = sua chave da Resend
WELCOME_FROM_EMAIL = e-mail remetente verificado no serviço de e-mail

O navegador chama POST /api/welcome-email após o login. A chave da Resend fica somente no servidor.

IMPORTANTE: não coloque RESEND_API_KEY no JavaScript do navegador e não publique essa chave no GitHub.

O perfil também registra localmente:
- nome e e-mail do usuário;
- empresa indicada para o destino escolhido;
- empresas selecionadas pelo usuário;
- empresa mais utilizada no histórico.

As empresas indicadas são exemplos demonstrativos e não representam recomendação comercial, preço, disponibilidade ou avaliação de qualidade.
