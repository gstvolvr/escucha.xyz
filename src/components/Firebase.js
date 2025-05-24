import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
}

export default class Firebase {
  constructor() {
    const app = initializeApp(config);
    this.db = getFirestore(app);
    this.ref = collection(this.db, "/spotify-artists");
  }
}
