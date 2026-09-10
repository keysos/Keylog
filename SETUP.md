# Configuração do Keylog com Supabase

## O que está pronto e o que precisa ser configurado

O código usa Supabase de verdade para autenticação, perfis, favoritos, registros, reviews, listas e avatares. Não há imports de `mocks/data/` nem contas de demonstração no aplicativo.

A integração conectada retornou **zero projetos acessíveis** nesta sessão. Nenhum banco hospedado foi criado ou modificado. O download do executável do CLI também não ficou disponível neste ambiente; por isso o pacote fornece `supabase/schema.sql` para o SQL Editor, sem inventar um histórico de migrações aplicado. O SQL foi executado e testado localmente em PGlite, com estruturas mínimas de Auth e Storage usadas apenas pelo teste. O envio real de e-mails e o upload no Supabase precisam ser verificados no seu projeto.

## 1. Escolha o projeto correto

1. Entre em [Supabase Dashboard](https://supabase.com/dashboard).
2. Abra o projeto do **Keylog**, conferindo nome e Project ID. Não use o projeto da barbearia ou da Vanessa.
3. Se ainda não existir um projeto para o Keylog, clique em **New project**, selecione sua organização, dê o nome `Keylog`, crie uma senha forte para o banco e escolha a região desejada. Aguarde o provisionamento.
4. Confira se a Data API está habilitada e se `public` está nos schemas expostos em **Integrations → Data API**.

O aplicativo não precisa de `DATABASE_URL`. Ele utiliza a URL HTTP do projeto e as chaves da API.

## 2. Verifique tabelas existentes antes de executar o SQL

Abra **SQL Editor → New query** e execute:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;
```

A baseline cria `games`, `profiles`, `user_games`, `reviews`, `lists`, `list_games` e `favorites`. Ela foi preparada para um schema `public` sem essas tabelas.

Se você já criou alguma delas, **não apague seus dados para fazer o SQL passar**. Exporte o schema e os dados, compare as colunas com `supabase/schema.sql` e adapte a migração com `ALTER TABLE`. Como o schema remoto existente não estava acessível, não foi possível produzir uma migração específica para ele. O arquivo usa uma transação: uma tabela incompatível faz a operação falhar, sem substituir silenciosamente a estrutura anterior.

## 3. Execute a baseline

1. No projeto correto, abra **SQL Editor → New query**.
2. Abra o arquivo `supabase/schema.sql` deste ZIP e copie **todo** o conteúdo.
3. Cole no editor e clique em **Run** uma vez.
4. Confira as sete tabelas no **Table Editor**.
5. Em **Storage**, confira o bucket público `avatars`, com limite de 2 MB e tipos JPG, PNG e WebP.
6. Em **Database → Advisors**, execute as verificações de segurança e desempenho. Aplique correções pertinentes sem desabilitar RLS.

O SQL contém PKs, FKs, índices, constraints, grants explícitos, RLS, trigger de criação de perfil e regras de Storage. Contas reais já existentes em `auth.users` recebem um perfil com username provisório `user_...`, editável após login.

Os grants explícitos são necessários para projetos que não expõem automaticamente novas tabelas. Consulte [a mudança oficial na Data API](https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically).

Validação básica:

```sql
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('profiles','games','user_games','reviews','lists','list_games','favorites');

select tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

Todas as sete tabelas devem mostrar `rowsecurity = true`.

## 4. Configure Auth e os links de e-mail

1. Em **Authentication → Sign In / Providers**, habilite **Email** e mantenha a confirmação de e-mail habilitada.
2. Em **Authentication → URL Configuration**, defina **Site URL** como `http://localhost:3000` durante o desenvolvimento.
3. Adicione estes Redirect URLs:

```text
http://localhost:3000/auth/callback
http://localhost:3000/auth/callback?next=/reset-password
http://localhost:3000/auth/confirm
http://localhost:3000/reset-password
```

4. Para links que funcionem mesmo quando o usuário abre o e-mail em outro navegador, configure os templates em **Authentication → Email Templates**:

**Confirm signup** — use este link no corpo do template:

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">Confirm your email</a>
```

**Reset password** — use este link:

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery">Reset your password</a>
```

O app também implementa `/auth/callback` com troca PKCE de `code`, compatível com o fluxo padrão de redirecionamento no mesmo navegador. A rota de confirmação aceita somente os tipos `email` e `recovery`; destinos arbitrários de redirecionamento não são aceitos.

5. Para disponibilizar o cadastro a usuários reais, configure um serviço SMTP em **Authentication → SMTP Settings**. O serviço de e-mail padrão do Supabase possui restrições de destinatários e limites; consulte [SMTP oficial](https://supabase.com/docs/guides/auth/auth-smtp).
6. Ao publicar, altere Site URL para o domínio HTTPS real e adicione as mesmas rotas com esse domínio. Não use `localhost` como Site URL de produção.

## 5. Preencha `.env.local`

Na pasta onde está o `package.json`, copie `.env.example` para `.env.local`.

Linux/macOS:

```bash
cp .env.example .env.local
```

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Preencha:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_SUA_CHAVE
SUPABASE_SECRET_KEY=sb_secret_SUA_CHAVE
IGDB_CLIENT_ID=SEU_CLIENT_ID_TWITCH
IGDB_CLIENT_SECRET=SEU_CLIENT_SECRET_TWITCH
```

| Variável | Onde obter | Finalidade |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Botão **Connect** do projeto | URL da API, não a URL do dashboard |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | **Connect** ou **Settings → API Keys** | Chave pública usada com RLS |
| `SUPABASE_SECRET_KEY` | **Settings → API Keys → Secret key** | Apenas no servidor, para importar metadados reais da IGDB |
| `IGDB_CLIENT_ID` | [Twitch Developer Console](https://dev.twitch.tv/console/apps) | Identificação da aplicação IGDB |
| `IGDB_CLIENT_SECRET` | Mesma aplicação Twitch, opção de criar secret | Autenticação do servidor na IGDB |

Uma chave legada `anon` pode ocupar a variável publishable; uma chave legada `service_role` pode ocupar `SUPABASE_SECRET_KEY`. **Nunca** coloque secret/service_role em uma variável `NEXT_PUBLIC_` ou no código do navegador.

Se você já tem as credenciais IGDB do projeto original, reutilize-as. Elas não estão incluídas neste ZIP. Se precisar criar uma aplicação Twitch, siga [IGDB Getting Started](https://api-docs.igdb.com/#getting-started); o token de acesso é obtido automaticamente pelo servidor.

### Como o catálogo é salvo

- Com as credenciais IGDB, a navegação e a busca consultam o catálogo real da IGDB.
- Ao registrar um jogo, escrever uma review, escolher um favorito ou adicionar a uma lista, o servidor consulta a IGDB pelo slug e salva os metadados em `public.games`, se o jogo ainda não estiver lá.
- Somente essa importação de catálogo usa a chave secret. O cliente não pode inserir metadados falsos diretamente em `games`.
- As escritas de usuários continuam usando sua sessão e RLS.
- Sem as credenciais IGDB, o app consulta apenas os jogos já presentes no Supabase. Um banco vazio exibe estado vazio; não são inseridos jogos fictícios.

## 6. Instale e execute

Use Node.js 22 LTS ou superior compatível com Next.js.

```bash
npm ci
npm run dev
```

Abra [localhost:3000](http://localhost:3000). Sempre reinicie o servidor após alterar `.env.local`.

Para produção:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm start
```

Configure as cinco variáveis também no provedor de hospedagem **antes do build**, porque `NEXT_PUBLIC_` é incorporado ao código do navegador. A aplicação precisa de um servidor Next.js; não é uma exportação HTML estática.

## 7. Teste com duas contas reais

1. Cadastre a conta A, confirme o e-mail, faça login e confira o menu **Profile / Log out**.
2. Edite nome, username e bio. Faça upload de uma imagem pequena e confira o avatar após recarregar a página.
3. Busque um jogo, abra sua página e salve um status com estrelas e datas. Publique uma review; edite e exclua a review para conferir as ações.
4. Selecione favoritos nas posições 1–5. Salvar em uma posição ocupada substitui o jogo. A posição 1 corresponde a `profiles.favorite_game_id`.
5. Em **Profile → Lists**, crie uma lista pública. Adicione dois jogos e clique **Hide** em um deles.
6. Em uma janela anônima, abra o link dessa lista. Somente o jogo revelado deve aparecer, inclusive nas capas do perfil.
7. Altere a lista para privada. A conta A continua acessando; visitantes e a conta B recebem página indisponível.
8. Faça login como B. Confira que não existem botões para editar o perfil, a lista ou as reviews de A. A RLS também bloqueia escritas diretas na API.
9. De volta a A, revele/remova jogos, edite a lista e exclua-a. Os itens da lista são excluídos por FK com cascade; jogos e reviews continuam existindo.
10. Saia da conta, clique em **Forgot your password?**, abra o e-mail e defina a nova senha. O app encerra a sessão após a troca e direciona ao login.
11. Atualize a página e repita o login/logout para conferir persistência de sessão. Não compartilhe caches de páginas autenticadas no CDN.

### Regras de visibilidade

Perfis, favoritos, registros e reviews são públicos. O e-mail da conta permanece em Auth, fora de `profiles`. A privacidade configurável é da lista; um jogo oculto é oculto **dentro daquela lista**, não no catálogo global. O proprietário vê jogos ocultos e pode revelá-los. Visitantes não recebem essas linhas da API.

O avatar é público por ser imagem de perfil. Upload, substituição e exclusão são limitados à pasta UUID do proprietário. O limite de formato/tamanho é aplicado também pelo bucket.

A nota do registro pessoal e a nota publicada na review são campos separados e identificados como **Your rating** e **Review rating**. Uma pode ser alterada sem mudar a outra.

## 8. CLI opcional para versionar o SQL

Se preferir CLI, em seu computador:

```bash
npx supabase --help
npx supabase init --help
npx supabase init
npx supabase migration new --help
npx supabase migration new keylog_baseline
```

Copie `supabase/schema.sql` para o arquivo recém-criado em `supabase/migrations/`. Depois confira os comandos na versão instalada:

```bash
npx supabase login --help
npx supabase login
npx supabase link --help
npx supabase link --project-ref SEU_PROJECT_REF
npx supabase db push --help
npx supabase db push --dry-run
npx supabase db push
```

Use o CLI **ou** o SQL Editor para aplicar a baseline, não ambos. Se já executou pelo SQL Editor, utilize o fluxo documentado de `db pull` para capturar o estado remoto e reconciliar o histórico; não tente executar novamente o mesmo `CREATE TABLE`. Consulte [desenvolvimento local e migrações](https://supabase.com/docs/guides/local-development/overview).

## Solução de problemas

| Sintoma | Verificação |
| --- | --- |
| Integração mostra zero projetos | Reconecte à conta/organização correta; isso não indica que seu projeto foi excluído |
| `relation already exists` | Há tabelas anteriores; compare e adapte o schema sem apagar dados |
| `permission denied for table` | Confira grants e RLS do SQL; confirme Data API e schema exposto |
| `Database error saving new user` | Confira username duplicado e os logs do trigger em Auth/Database |
| Cadastro não envia e-mail | Confira SMTP, destinatários autorizados e limites do provedor |
| Link de recuperação expirado | Solicite um novo link e confira Site URL/templates |
| Avatar não envia | Confira bucket `avatars`, MIME, tamanho ≤2 MB e pasta do proprietário |
| Busca sem jogos | Configure IGDB ou use um catálogo já importado |
| `Catalog import is not configured` | Defina `SUPABASE_SECRET_KEY` apenas no servidor |
| Erro de autorização IGDB | Confira Client ID e Client Secret da mesma aplicação Twitch |
| Variável alterada sem efeito | Reinicie localmente; em produção, gere novo build |

Referências oficiais: [SSR em Next.js](https://supabase.com/docs/guides/auth/server-side/creating-a-client), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Storage access control](https://supabase.com/docs/guides/storage/security/access-control).
