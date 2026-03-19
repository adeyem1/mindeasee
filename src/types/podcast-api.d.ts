declare module 'podcast-api' {
  export function Client(config: { apiKey: string }): {
    search(params: any): Promise<any>;
    [key: string]: any;
  };
}
