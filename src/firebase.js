import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDR9nFb-a_YbvEsC0J_99zHNOkgXfb9d9w",
  authDomain: "ma-gayatri-store.firebaseapp.com",
  projectId: "ma-gayatri-store",
  storageBucket: "ma-gayatri-store.firebasestorage.app",
  messagingSenderId: "444269883069",
  appId: "1:444269883069:web:5a9729d511c0cb401c51d4",
};


const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken };
