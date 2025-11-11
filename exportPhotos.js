// exportPhotos.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, orderBy } from "firebase/firestore";
import fs from "fs";

// --- Firebase config (same as your website) ---
const firebaseConfig = {
  apiKey: "AIzaSyC6P-2nngV7gL7f7UeJICkJ_uwOikFFK50",
  authDomain: "alisos-fotografija.firebaseapp.com",
  projectId: "alisos-fotografija",
  storageBucket: "alisos-fotografija.appspot.com",
  messagingSenderId: "394303533680",
  appId: "1:394303533680:web:8839ce95758766463c7ab5",
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function exportPhotos(category = "studio") {
  const q = query(
    collection(db, "photos"),
    where("category", "==", category),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  const photos = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    photos.push({
      url: data.url,
      thumb: data.thumb || null,
      caption: data.caption || "",
      createdAt: data.createdAt?.toMillis?.() || null
    });
  });

  // --- Write to JSON file ---
  fs.mkdirSync("./data", { recursive: true });
  fs.writeFileSync(`./data/${category}.json`, JSON.stringify(photos, null, 2));
  console.log(`✅ Exported ${photos.length} photos to data/${category}.json`);
}

exportPhotos().catch(console.error);
