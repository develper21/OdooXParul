import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || process.env.DATABASE_URL || "";
const dbName = process.env.MONGODB_DB || "traveloop";

if (!uri) {
  throw new Error("Missing MONGODB_URI or DATABASE_URL environment variable.");
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedDb && cachedClient) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri);
  await client.connect();

  cachedClient = client;
  cachedDb = client.db(dbName);

  return { client, db: cachedDb };
}

export function serializeDocument<T extends { _id?: unknown }>(doc: T) {
  if (!doc) {
    return null;
  }

  const { _id, ...rest } = doc as any;
  return { id: String(_id), ...rest };
}
