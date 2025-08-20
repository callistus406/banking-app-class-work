import axios from "axios";

(async () => {
  console.log("=============|| starting loop ||==========");

  for (let i = 1; i < 300; i++) {
    try {
      await axios.get("http://localhost:4000/api/v1/profile", {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODdlYWM4MWZkYzNhNmQzMDQ2YWRiMDgiLCJpYXQiOjE3NTM5OTM5ODAsImV4cCI6MTc1Mzk5NTE4MH0.bsQDVNcOSXmRrXZEvlL1yy-LHa3HuSV6-0bKlIviKRQ",
        },
      });
      console.log(`request = ${i}`);
    } catch (error) {
      console.error(`Request ${i} Failed ${error.response.status}`);
    }
  }
})();

Devops;
DOcker;
cicd;

// (function(){})()

// for(let i of 30){

// }
