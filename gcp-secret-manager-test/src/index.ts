import * as functions from "firebase-functions";
import { getUri } from "./env";

export const getSecret = functions.https.onRequest((req, res) => {
  (async () => {
    res.send(await getUri());
  })();
});
