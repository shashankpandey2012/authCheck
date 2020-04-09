var axios = require('axios');

const credential = {
  userid: '1',
  password: '123'
};

async function addUser(credential) {
  const count = await axios.get('http://localhost:4000/usercount');
  console.log('Count >>> ', count.data);
  if (count) {
    if (count.data) {
      if (count.data.count === 0 ) {
        const resp = await axios
          .post(
            'http://localhost:4000/createuser',
            {
              userid: credential.userid,
              password: credential.password
            });
        if (resp) {
          console.log("user added Successfully", resp.data);
        }
        return resp;
      }
    }
  }

}

 addUser(credential);
