# 🌿 Circuito Terê Verde — versão corrigida

MVP web (HTML/CSS/JS) para divulgar trilhas, biodiversidade e eventos das
unidades de conservação de Teresópolis (PARNASO, Parque Estadual dos Três
Picos e Parque Natural Municipal Montanhas de Teresópolis).

## O que foi corrigido em relação à versão anterior

Com base na verificação contra as exigências da Situação-Problema #1:

1. **Segurança de dados (era o principal problema).**
   O modal de login antes mostrava a senha de demonstração em texto visível
   na própria tela (`admin@tere.com` / `senha123`). Isso foi removido. O
   login continua sendo apenas uma simulação em JavaScript no navegador —
   **isso é uma limitação conhecida de qualquer MVP sem backend**, e agora
   está sinalizada de forma explícita tanto na tela de login quanto dentro
   do painel administrativo, em vez de parecer resolvida. Para um sistema
   real, seria necessário um backend com autenticação (ex.: hash de senha,
   tokens de sessão, HTTPS).

2. **Gestão de disponibilidade.**
   Antes, o painel só tinha nome/dificuldade/distância (trilhas) e
   título/data/local (eventos) — sem status. Agora cada trilha e evento tem
   um campo de **Disponibilidade** (Disponível / Em manutenção / Fechada /
   Lotado / Cancelado) e um campo de **Horário de funcionamento**, editáveis
   pelo administrador e exibidos automaticamente nas páginas públicas
   (`trilhas.html` e `biodiversidade.html`).

3. **Duplicidade admin.html / painel.html.**
   Os dois arquivos faziam a mesma coisa. Foram unificados em um único
   `admin.html`, evitando confusão sobre qual é a área administrativa
   oficial.

4. **Login para administradores.**
   Mantido como pedido no desafio (botão "Login Admin"), mas agora o
   `admin.html` verifica a sessão e redireciona para a página inicial se
   não houver login ativo — antes, a página administrativa era acessível
   diretamente pela URL, sem qualquer checagem.

## Estrutura

```
tereverde/
├── css/style.css
├── js/main.js          # login (demo), CRUD, renderização das listas
├── images/hero.svg
├── index.html
├── trilhas.html
├── biodiversidade.html
├── admin.html
└── README.md
```

## Como usar

Basta abrir `index.html` no navegador — não há dependências. Os dados de
trilhas/eventos ficam salvos no `localStorage` do navegador (dá pra editar
pelo painel e recarregar a página que os dados continuam lá).

Para testar o login: qualquer email válido + senha com 4+ caracteres entra
no painel (é só uma simulação, como explicado acima).

## Próximos passos sugeridos (fora do escopo deste MVP)

- Backend real (Node/Express, Firebase, etc.) com autenticação segura.
- Banco de dados em vez de `localStorage`, para os dados persistirem entre
  dispositivos/navegadores.
- Testes de carga para validar o requisito de desempenho com muitos
  usuários simultâneos.
