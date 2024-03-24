declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    AT_SECRET?: string;
    RT_SECRET?: string;
  }
}
