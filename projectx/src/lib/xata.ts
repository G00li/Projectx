  // import { XataApiClient } from '@xata.io/client';
  // export const xata = new XataApiClient({
  //   apiKey: "xau_uWsofLGdfoiuqTQn4QwwWMZhivA8ss3i4"
  // });
  
  import { getXataClient } from '@/xata';


  export const xata = getXataClient();
  