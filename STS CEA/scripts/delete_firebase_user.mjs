// Owner: Shaheer
// Deletes one Firebase user by email using the backend's own Admin SDK setup.
// Usage (run with cwd = Backend so its .env is found): node delete_firebase_user.mjs <email>
import { pathToFileURL } from "url";
import path from "path";

const firebaseConfig = path.resolve(process.cwd(), "src/config/firebase.js");
const { admin } = await import(pathToFileURL(firebaseConfig).href);

try {
  const user = await admin.auth().getUserByEmail(process.argv[2]);
  await admin.auth().deleteUser(user.uid);
  console.log("deleted");
} catch (error) {
  console.log(error.code === "auth/user-not-found" ? "not-found" : `error: ${error.code}`);
}
process.exit(0);
