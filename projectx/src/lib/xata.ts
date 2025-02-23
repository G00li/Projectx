  // // src/lib/xata.ts
  // import { getXataClient } from '@/xata'; // Caminho pode variar

  // export const xata = getXataClient();

  // export default xata;


  // src/lib/xata.ts
  import { XataApiClient } from '@xata.io/client';

  // O cliente Xata deve ser instanciado no lado do servidor
  // if (!process.env.XATA_API_KEY) {
  //   throw new Error("XATA_API_KEY não está definida. Defina a chave da API no arquivo .env");
  // }
  
  export const xata = new XataApiClient({
    apiKey: "xau_uWsofLGdfoiuqTQn4QwwWMZhivA8ss3i4"
  });
  