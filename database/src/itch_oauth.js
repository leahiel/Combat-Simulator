import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  doc,
  setDoc
} from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyC9v0IxCIpvte0fqrvvi3YPhj5_Aj-FfU8",
  authDomain: "metadb-a53ef.firebaseapp.com",
  projectId: "metadb-a53ef",
  storageBucket: "metadb-a53ef.appspot.com",
  messagingSenderId: "430337628550",
  appId: "1:430337628550:web:49ea52657cb16776b97407",
  measurementId: "G-NNRXRZ00G2",
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

// Get parameters from URL query.
var URLparams = new URLSearchParams(window.location.hash.slice(1));
// Get AccessToken from URL query parameters.
var accessToken = URLparams.get("access_token");
// Get State from URL query parameters.
var gameUUID = URLparams.get("state");
// Define itch.io profile:me URL.
const profileMeURL = `https://itch.io/api/1/${accessToken}/me`;

let itchID = undefined;

let ItchAccessTokenData = {
  token: accessToken,
};

// Get profile:me stuff.
function xhrGetItchInfo(url, callback) {
  let xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) callback(xhr.responseText);
  };
  xhr.open("GET", url, true); // true for asynchronous

  // Note, to test with localhost you'll have to up open up cmd:
  // cd "c:\Program Files (x86)\Google\Chrome\Application"
  // chrome.exe --disable-web-security --user-data-dir="c:/ChromeDevSession"

  xhr.send(null);
}

// Get Information from profile:me API.
xhrGetItchInfo(profileMeURL, function (result) {
  result = JSON.parse(result);

  itchID = result["user"]["id"];
  ItchAccessTokenData.itch_id = itchID;
  ItchAccessTokenData.itch_display_name = result["user"]["display_name"];
  // If there is no display name, we need to add one.
  if (typeof ItchAccessTokenData.itch_display_name === "undefined") {
    ItchAccessTokenData.itch_display_name = "n/a";
  }
  ItchAccessTokenData.itch_username = result["user"]["username"];

  Promise.all([uploadGameUUID(itchID), uploadItchAccessToken(ItchAccessTokenData)]).then(() => {
    window.close();
  });
  
});

// Link the Game UUID with the itch_id.
async function uploadGameUUID(docData) {
  const uuidDoc = doc(db, `gameUUIDs/${gameUUID}`)

  let uuidDocData = {
    itch_id: docData
  }

  try {
    await setDoc(uuidDoc, uuidDocData, {merge: true })
    console.log(`We wrote data to ${gameUUID}`);
  } catch (error) {
    console.log(`Error sending UUID to database: ${error}`);
  }

}

async function uploadItchAccessToken(docData) {
  const itchTokens = doc(db, `itchIDs/${itchID}`);

  try {
    await setDoc(itchTokens, docData, { merge: true });
    console.log(`We wrote data to ${itchID}`);
  } catch (error) {
    console.log(`Error sending data to database: ${error}`);
  }
}
