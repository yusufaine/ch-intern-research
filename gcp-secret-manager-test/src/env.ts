import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import * as dotenv from "dotenv";

/**
 * This functions as the SECRET_NAME values that are on Secret Manager.
 * Query the appropriate SECRET_NAME and it would return the value
 * corresponding to the secret.
 */
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
  for (const secretName of envs) {
    // Get the latest version of the secret
    const name = `projects/${projectName}/secrets/${secretName}/versions/latest`;
    const [version] = await client.accessSecretVersion({
      name: name,
    });

    const payload = version.payload?.data?.toString();
    if (payload) {
      res.push(payload);
    }
  }

  // // Return local secret if found, else return payload value
  // // Local secret takes priority, so there should only exist
  // // `secret.local` or `.env.local`. -- TBC
  // return process.env.MONGO_LINK ?? payload;
  res.push(process.env.MONGO_LINK!);
  res.push(process.env.MONGO_USER!);
  return res;
}
