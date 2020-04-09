var axios = require('axios');

const rightCredential = {
  userid: '1',
  password: '123'
};

const wrongCredential = {
  userid: '1',
  password: '1234'
};

async function authCheck(credential) {
  const resp = await axios
    .post(
      'http://localhost:4000/userlogin',
      {
        userid: credential.userid,
        password: credential.password
      });
  return resp;
}

async function testAuth(rightCred, wrongCred) {
  // Checking Right Credential
  // Checking Wrong Credential 3 times within 2 minutes of time
  // Checking Right Credential when access is blocked within 2 min of time
  // Checking Right Credential after 2 minutes of time.

  console.log("Checking Right Credential");
  const firstResponse = await authCheck(rightCred);
  if (firstResponse) {
    console.log('1. Response -> ', firstResponse.data);
    if (firstResponse.data === 'RIGHT') {
      console.log("   1. First Check Passed + ");
    } else {
      if (firstResponse.data === 'USER DOES NOT EXISTS') {
        console.log('KINDLY RUN ""npm run add"" before running test ');
      }
      console.log("   1. First Check Failed -");
    }
    console.log('      ');
    console.log('Checking Wrong Password 3 times within 2 minutes');

    setTimeout(async function(){
      const resp = await authCheck(wrongCred);
      console.log(' 2.1 Response ', resp.data);
      if (resp.data === 'WRONG') {
        console.log("   2.1. First Wrong Check Passed + ");
      } else {
        console.log("   2.1. First Wrong Check Failed -");
      }
      console.log('      ');
    }, 4000);

    setTimeout(async function(){
      const resp = await authCheck(wrongCred);
      console.log(' 2.2 Response ', resp.data);
      if (resp.data === 'WRONG') {
        console.log("   2.2. Second Wrong Check Passed + ");
      } else {
        console.log("   2.2. Second Wrong Check Failed -");
      }
      console.log('      ');
    }, 5000);

    setTimeout(async function(){
      const resp = await authCheck(wrongCred);
      console.log(' 2.3 Response ', resp.data);
      if (resp.data === 'BLOCKED : LOGIN AFTER 2 MINUTES') {
        console.log("   2.3. Third Block Check Passed + ");
      } else {
        console.log("   2.3. Third Block Check Failed -");
      }
      console.log('      ');
    }, 6000);

    // console.log(' Checking Right Password after 3 Wrong Attempt within 2 minutes ');
    // console.log('  ');

    setTimeout(async function(){
      console.log('Checking Right Password within 2 minutes to check blocked access');
      const resp = await authCheck(rightCred);
      console.log(' 3 Response ', resp.data);
      if (resp.data === 'BLOCKED : LOGIN AFTER 2 MINUTES') {
        console.log("   3. Third Check Passed + ");
      } else {
        console.log("   3. Third Check Failed -");
      }
      console.log('      ');
    }, 7000);

    setTimeout(function() {
      console.log(' Checking Right Password after 2 minutes to check access');
      console.log('      ');
    }, 8000);

    setTimeout(function() {
      console.log(' ------Wait For 2 Minutes ---');
      console.log('      ');
    }, 9000);

    setTimeout(async function(){
      console.log(' 4. Going to Check Right Credentials now');
      const resp = await authCheck(rightCred);
      console.log(' 4 Response ', resp.data);
      if (resp.data === 'RIGHT') {
        console.log("   4. Fourth Check Passed + ");
      } else {
        console.log("   3. Fourth Check Failed -");
      }
    }, (2.5 * 60 * 1000));

  }
}

// addUser(rightCredential);

testAuth(rightCredential, wrongCredential);
