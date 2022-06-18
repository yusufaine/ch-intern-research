import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import * as dotenv from "dotenv";

// Inplace of SECRET_NAME
enum envTypes {
  dev_uri,
  local_uri,
  prod_uri,
}

export async function getUri() {
  dotenv.config();
  const client = new SecretManagerServiceClient();
  const projectName = process.env.GCLOUD_PROJECT;
  const envs = Object.keys(envTypes).filter((key) => isNaN(Number(key)));

  const res: string[] = [];
  for (const env of envs) {
    const name = `projects/${projectName}/secrets/${env}/versions/latest`;
    const [version] = await client.accessSecretVersion({
      name: name,
    });

    const payload = version.payload?.data?.toString();
    if (payload) {
      res.push(payload);
    }
  }
  res.push(process.env.MONGO_LINK!);
  res.push(process.env.MONGO_USER!);
  return res;
}
