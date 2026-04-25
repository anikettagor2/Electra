
import * as admin from "firebase-admin";

admin.initializeApp();

// Export the simulation function from the separate file
export * from "./simulate";
