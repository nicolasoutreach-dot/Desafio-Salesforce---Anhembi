# Deploy manual na Vercel (sem CLI)

Se o deploy via `npx vercel --prod` falhar por permissão de Git:

1. Acesse **https://vercel.com/new**
2. Escolha **Upload** (não importar do Git)
3. Arraste toda a pasta do projeto **Desafio Salesforce: Criação de Agentes (IA)** (ou use "Browse")
   - Inclua: `index.html`, `obrigado.html`, `styles.css`, `script.js`, pasta `force-app` se precisar
   - Não precisa incluir: `.git`, `node_modules`, `.vercel`
4. Em **Output Directory** deixe em branco ou `.`
5. Clique em **Deploy**

Seu site ficará em `https://desafio-salesforce-*.vercel.app` (ou o nome que você der ao projeto).

---

## Logo da Salesforce (favicon e página de agradecimento)

- **Fundo preto:** Se o logo aparecer com fundo preto, é porque o PNG foi exportado com fundo opaco. Troque `images/salesforce-logo.png` por uma versão **com fundo transparente** (ex.: variante “on transparent” ou “for light background” no [Salesforce Brand Central](https://brand.salesforce.com/brand/logo)).
- **Tamanho:** No footer o logo usa 40px de altura, conforme mínimo recomendado pela Salesforce para uso digital. O favicon usa o mesmo arquivo; para melhor resultado em abas, use um PNG com fundo transparente.
