export const confirmationTemplate = (data:{name: string, otp: string}) => {
  return `
        <html>
        
        <body>

            <h2> HELLO: ${data.name}: </h2>
            <br />
            <h2> THIS IS YOU OTP: ${data.otp} </h2>
        </body>
        <html>
        `;
};



