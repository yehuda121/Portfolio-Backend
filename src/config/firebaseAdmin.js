// backend/src/config/firebaseAdmin.js
const admin = require('firebase-admin');

function getServiceAccount() {

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!raw) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_JSON environment variable');
  }

  try {
    const parsed = JSON.parse(raw);

    // Fix private_key newlines if needed
    if (parsed.private_key && parsed.private_key.includes('\\n')) {
      parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    }
    return parsed;
  } catch {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON');
  }
}

if (!admin.apps.length) {
  const serviceAccount = getServiceAccount();

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

module.exports = { admin, db };
