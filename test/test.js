var assert = require('assert');
var axios = require('axios');

const rightCredential = {
  userid: '1',
  password: '123'
};

const wrongCredential = {
  userid: '1',
  password: '1234'
};

describe('Checking Right Credential at Current Time', () => {
  it('should return RIGHT for right credential at current time', async () => {
    const timestamp = new Date().getTime();
    const resp = await authCheck(rightCredential, timestamp);
      assert.equal(resp.data, 'RIGHT');
  });
});

describe('Checking 3 Wrong Attempts at Current Time', () => {
  it('should return WRONG 1st Attempt', async () => {
    const timestamp = new Date().getTime();
    const resp = await authCheck(wrongCredential, timestamp);
    assert.equal(resp.data, 'WRONG');
  });
  it('should return RIGHT for right attempt', async () => {
    const timestamp = new Date().getTime();
    const resp = await authCheck(rightCredential, timestamp);
    assert.equal(resp.data, 'RIGHT');
  });
  it('should return WRONG 2nd Attempt After 2 Seconds', async () => {
    const timestamp = new Date().getTime() + 2000;
    const resp = await authCheck(wrongCredential, timestamp);
    assert.equal(resp.data, 'WRONG');
  });
  it('should return RIGHT for right attempt after 2 seconds', async () => {
    const timestamp = new Date().getTime() + 2000;
    const resp = await authCheck(rightCredential, timestamp);
    assert.equal(resp.data, 'RIGHT');
  });
  it('should return BLOCKED on 3rd Wrong Attempt', async () => {
    const timestamp = new Date().getTime() + 2000;
    const resp = await authCheck(wrongCredential, timestamp);
    assert.equal(resp.data, 'BLOCKED : LOGIN AFTER 2 MINUTES');
  });
  it('should return BLOCKED for right attempt after 10 seconds', async () => {
    const timestamp = new Date().getTime() + 10000;
    const resp = await authCheck(rightCredential, timestamp);
    assert.equal(resp.data, 'BLOCKED : LOGIN AFTER 2 MINUTES');
  });
  it('should return RIGHt for right attempt after 2 minutes', async () => {
    const timestamp = new Date().getTime() + (2 * 60 * 1010);
    const resp = await authCheck(rightCredential, timestamp);
    assert.equal(resp.data, 'RIGHT');
  });
});

describe('Checking Right Credential after 2 Minutes', () => {
  it('should return RIGHt for right attempt after 2 minutes', async () => {
    const timestamp = new Date().getTime() + (2 * 60 * 1010);
    const resp = await authCheck(rightCredential, timestamp);
    assert.equal(resp.data, 'RIGHT');
  });
});

async function authCheck(credential, timestamp) {
  const resp = await axios
    .post(
      'http://localhost:4000/userlogin',
      {
        userid: credential.userid,
        password: credential.password,
        timestamp,
      });
  return resp;
}
