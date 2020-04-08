# authCheck

1. Install Dependencies with npm install

2. Run App with npm start

3. App will run on 4000 port

4. App will connect local MongoDB instance

5. App has two routes:

   POST http://localhost:4000/createuser
        
        body => {
              	"userid": "1",
              	"password": "1234"
               }
               
    and
    
   POST http://localhost:4000/userlogin
        
        body => {
        	"userid": "1",
        	"password": "1234"
        }
   returns RIGHT if credentials match
   returns WRONG if credentials doesn't match
   returns BLOCKED if user has entered wrong credentials 3 times within 2 minutes     
