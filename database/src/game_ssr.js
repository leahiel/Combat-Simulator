// This file will eventually be bundled into the game proper. It should be able to ask the server for information with oauth details.

import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

export default class leahdb {
  constructor() {
    this.firebaseConfig = {
      apiKey: "AIzaSyC9v0IxCIpvte0fqrvvi3YPhj5_Aj-FfU8",
      authDomain: "metadb-a53ef.firebaseapp.com",
      projectId: "metadb-a53ef",
      storageBucket: "metadb-a53ef.appspot.com",
      messagingSenderId: "430337628550",
      appId: "1:430337628550:web:49ea52657cb16776b97407",
      measurementId: "G-NNRXRZ00G2",
    };
    this.app = initializeApp(this.firebaseConfig);
    // const analytics = getAnalytics(app);
    this.db = getFirestore(this.app);
  }

  async getItchID(UUID) {
    const docRef = doc(this.db, "gameUUIDs", UUID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // doc.data() will be undefined in this case, but I don't think I have to do anything special here.
    }
  }

  createLoginChecker(UUID, arbitfn) {
    return onSnapshot(doc(this.db, "gameUUIDs", UUID), (doc) => {
      if (doc.data() === undefined || doc.data().itch_id === undefined) {
        return;
      }

      console.log("Data: ", doc.data().itch_id);
      arbitfn(doc.data().itch_id);
    });
  }

  async getDBVars(id) {
    const docRef = doc(this.db, `itchIDs/${id}/metavars/vars`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return undefined;
    }
  }

  async setDBVars(id, varObj) {
    const metaVarsDoc = doc(this.db, `itchIDs/${id}/metavars/vars`);

    try {
      await setDoc(metaVarsDoc, varObj, { merge: true });
      console.log(`Successfully wrote metavars data.`);
    } catch (error) {
      console.log(`Error sending metavars to database: ${error}`);
    }
  }

}
