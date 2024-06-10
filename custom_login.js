// Configure Amplify with Cognito details
AWS.config.region = 'us-east-1'; // Update to your region

// Define Cognito configuration
const poolData = {
    UserPoolId: 'us-east-1_nkWUNnRze', // Your User Pool ID
    ClientId: '11q2o2hf8ehnjsalnocskligo2'      // Your App Client ID
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// Event listener for login form
document.getElementById('login-form').addEventListener('submit', handleLogin);

async function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    alert('username',+username);

    if (username.includes('@')) {
        // Handle email/password login
        loginWithEmailPassword(username, password);
    } else if (/^\d{10}$/.test(username)) {
        // Handle OTP based login
        loginWithOTP(username);
    } else {
        alert('Invalid username format');
    }
}

function loginWithEmailPassword(email, password) {
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: email,
        Password: password,
    });

    const userData = {
        Username: email,
        Pool: userPool,
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            console.log('Access token: ' + result.getAccessToken().getJwtToken());
            alert('Login successful!');
        },

        onFailure: function (err) {
            alert(err.message || JSON.stringify(err));
        },
    });
}

async function loginWithOTP(phoneNumber) {
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: phoneNumber,
        Pool: userPool,
    });

    cognitoUser.initiateAuth(new AmazonCognitoIdentity.AuthenticationDetails({
        Username: phoneNumber,
    }), {
        onSuccess: function (result) {
            console.log('Access token: ' + result.getAccessToken().getJwtToken());
            alert('Login successful!');
        },

        onFailure: function (err) {
            alert(err.message || JSON.stringify(err));
        },

        customChallenge: function (challengeParameters) {
            const otp = prompt('Enter the OTP sent to your phone number:');
            cognitoUser.sendCustomChallengeAnswer(otp, this);
        },
    });
}
