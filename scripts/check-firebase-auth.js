const readline = require('readline');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function openFirebaseConsole() {
  console.log('\n======= FIREBASE CONFIGURATION CHECKER =======');
  console.log('\nThis script will help diagnose Firebase authentication issues.');
  
  // Read Firebase config from firebase.ts
  try {
    const firebasePath = path.join(__dirname, '..', 'src', 'services', 'firebase.ts');
    const content = fs.readFileSync(firebasePath, 'utf8');
    
    // Extract project ID
    const projectIdMatch = content.match(/projectId:.*?"(.*?)"/);
    const projectId = projectIdMatch && projectIdMatch[1];
    
    if (projectId) {
      console.log(`\nDetected Firebase Project ID: ${projectId}`);
      
      // Instructions for enabling Google Auth
      console.log('\n=== STEPS TO ENABLE GOOGLE AUTHENTICATION: ===');
      console.log('1. Open Firebase Authentication console');
      console.log('2. Go to the "Sign-in method" tab');
      console.log('3. Enable Google provider');
      console.log('4. Add your app domain to the "Authorized domains" list');
      console.log('   - For local development add: localhost');
      console.log('5. Save your changes');
      console.log('\nWould you like to open the Firebase Authentication console now? (Y/n)');
      
      rl.question('', (answer) => {
        if (answer.toLowerCase() !== 'n') {
          const authUrl = `https://console.firebase.google.com/project/${projectId}/authentication/providers`;
          console.log(`\nOpening: ${authUrl}`);
          
          try {
            // Try to open the URL
            if (process.platform === 'win32') {
              execSync(`start ${authUrl}`);
            } else if (process.platform === 'darwin') {
              execSync(`open ${authUrl}`);
            } else {
              execSync(`xdg-open ${authUrl}`);
            }
            console.log('Browser opened with the Firebase Authentication console.');
          } catch (error) {
            console.log(`Could not open browser automatically. Please visit: ${authUrl}`);
          }
        }
        
        checkDomains(projectId);
      });
    } else {
      console.log('\nCould not detect Project ID from firebase.ts file.');
      console.log('Please check your Firebase configuration manually at: https://console.firebase.google.com/');
      rl.close();
    }
  } catch (error) {
    console.error('Error reading Firebase configuration:', error.message);
    rl.close();
  }
}

function checkDomains(projectId) {
  console.log('\n=== AUTHORIZED DOMAINS CHECK ===');
  console.log('For Google Authentication to work, your domains need to be authorized in Firebase console.');
  console.log('For local development, make sure "localhost" is in the authorized domains list.');
  console.log('\nHave you added "localhost" to the authorized domains list? (y/N)');
  
  rl.question('', (answer) => {
    if (answer.toLowerCase() === 'y') {
      console.log('\nGreat! The domain is authorized.');
    } else {
      console.log('\nPlease add "localhost" to the authorized domains list:');
      console.log(`1. Go to: https://console.firebase.google.com/project/${projectId}/authentication/settings`);
      console.log('2. In the "Authorized domains" section, click "Add domain"');
      console.log('3. Enter "localhost" and click "Add"');
    }
    
    checkFirebaseWeb(projectId);
  });
}

function checkFirebaseWeb(projectId) {
  console.log('\n=== WEB APP CONFIGURATION CHECK ===');
  console.log('Firebase requires a registered web application for authentication to work.');
  console.log('\nHave you registered a web application in your Firebase project? (y/N)');
  
  rl.question('', (answer) => {
    if (answer.toLowerCase() === 'y') {
      console.log('\nGreat! Make sure your web app has the correct Firebase SDK snippet configured.');
    } else {
      console.log('\nPlease register a web app in Firebase:');
      console.log(`1. Go to: https://console.firebase.google.com/project/${projectId}/settings/general/web`);
      console.log('2. Click "Add app" or register a new web app');
      console.log('3. Follow the setup instructions and copy the Firebase configuration');
      console.log('4. Make sure this configuration matches what\'s in your src/services/firebase.ts file');
    }
    
    finalInstructions();
  });
}

function finalInstructions() {
  console.log('\n=== NEXT STEPS ===');
  console.log('1. Make sure you\'ve enabled Google Sign-in method in Firebase Console');
  console.log('2. Verify that "localhost" is in the authorized domains list');
  console.log('3. Check that your Firebase configuration in src/services/firebase.ts is correct');
  console.log('4. Restart your Next.js development server');
  console.log('\nIf you continue to experience issues, you may need to create a new OAuth client ID in Google Cloud Console.');
  console.log('See Firebase documentation: https://firebase.google.com/docs/auth/web/google-signin');
  
  rl.close();
}

openFirebaseConsole();
