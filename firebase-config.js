import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyClU-fKXxkLnEr8ijBMP5msuMnnmiDXTQA",
  authDomain: "caldiran-gazino-menu.firebaseapp.com",
  projectId: "caldiran-gazino-menu",
  messagingSenderId: "1057224968437",
  appId: "1:1057224968437:web:8fce87e540c9376a485dbc"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };