const { initializeApp, cert } = require('firebase-admin/app');
const { getSecurityRules } = require('firebase-admin/security-rules');
const fs = require('fs');
require('dotenv').config({ path: '../fashion-gallery-admin/.env.local' });

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId) {
  console.error("Missing credentials");
  process.exit(1);
}

const app = initializeApp({
  credential: cert({ projectId, clientEmail, privateKey }),
});

const source = fs.readFileSync('./firestore.rules', 'utf8');

async function deployRules() {
  try {
const rules = getSecurityRules(app);
    const ruleset = await rules.createRuleset({
      source: {
        files: [
          {
            name: 'firestore.rules',
            content: source
          }
        ]
      }
    });
    console.log('Created ruleset:', ruleset.name);
    await rules.createRelease(ruleset.name, 'cloud.firestore');
    console.log('Successfully deployed firestore rules!');
  } catch (error) {
    console.error('Error deploying rules:', error.message);
    if (error.code) console.error('Code:', error.code);
    if (error.details) console.error('Details:', error.details);
    if (error.response) console.error('Response:', error.response.data);
    console.error(JSON.stringify(error, null, 2));
  }
}

deployRules();
