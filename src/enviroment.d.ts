export {};
declare global {
  namespace NodeJs {
    interface ProcessEnv {
      NODE_ENV: string;
    }
  }
}
