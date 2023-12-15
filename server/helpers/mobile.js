const accountSid = "AC09d817a94a5a1074ef608b924081a98f";
const authToken = "08759cf7a4a611218aeda873990b99e5";
const client = require("twilio")(accountSid, authToken);

const functionSendSmS = () => {
  return client.messages
    .create({
      body: "hey beauty",
      from: "+16614290592",
      to: "+919962618394",
    })
    .then((messsage) => {
      console.log(messsage);
    })
    .catch((err) => {
      console.log(err);
    });
};

functionSendSmS();
// AC09d817a94a5a1074ef608b924081a98f
// 08759cf7a4a611218aeda873990b99e5
//+16614290592
