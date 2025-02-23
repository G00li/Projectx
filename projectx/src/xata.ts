import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

import dotenv from 'dotenv';
dotenv.config();

const tables = [
  {
    name: "posts",
    columns: [
      { name: "title", type: "text", notNull: true, defaultValue: "Projeto" },
      { name: "description", type: "text" },
      { name: "language", type: "text" },
      { name: "repoUrl", type: "text" },
      { name: "duration", type: "text" },
      { name: "stars", type: "int", notNull: true, defaultValue: "1" },
      {
        name: "createdAt",
        type: "datetime",
        notNull: true,
        defaultValue: "now",
      },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type Posts = InferredTypes["posts"];
export type PostsRecord = Posts & XataRecord;

export type DatabaseSchema = {
  posts: PostsRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL:
    "https://Leandro-s-workspace-01bobu.eu-central-1.xata.sh/db/projectx:main",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let xataClientInstance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (!xataClientInstance) {
    xataClientInstance = new XataClient({
      apiKey: process.env.XATA_API_KEY, // A chave da API deve ser configurada no servidor
      // ... quaisquer outras configurações necessárias
    });
  }

  return xataClientInstance;
};