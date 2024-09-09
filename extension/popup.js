document.getElementById("fetch-otp").addEventListener("click", () => {
  chrome.identity.getAuthToken({ interactive: true }, function(token) {
      if (chrome.runtime.lastError || !token) {
          console.error(chrome.runtime.lastError);
          document.getElementById("status").textContent = "Error fetching token.";
          return;
      }

      fetch('https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=1', {
          method: 'GET',
          headers: {
              'Authorization': 'Bearer ' + token
          }
      })
      .then(response => response.json())
      .then(data => {
          const messages = data.messages;
          if (messages && messages.length > 0) {
              const messageId = messages[0].id;
              fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`, {
                  method: 'GET',
                  headers: {
                      'Authorization': 'Bearer ' + token
                  }
              })
              .then(response => response.json())
              .then(messageData => {
                  const payload = messageData.payload;
                  let body = '';

                  if (payload.parts) {
                      payload.parts.forEach(part => {
                          if (part.mimeType === 'text/plain') {
                              body = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
                          }
                      });
                  } else if (payload.mimeType === 'text/plain') {
                      body = atob(payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
                  }

                  // Regex to find the number that comes after "OTP" with any text in between
                  const otpMatch = body.match(/OTP[\s\S]*?(\d{4,9})/);
                  const otp = otpMatch ? otpMatch[1] : "OTP not found";

                  document.getElementById("status").textContent = otp;
                  document.getElementById('copy-otp').addEventListener('click', function () {
                    
                    navigator.clipboard.writeText(otp).then(
                     function () {
                            alert('OTP copied to clipboard!');
                        },
                    function () {
                    alert('Failed to copy OTP.');
          }
        );
      });
              })
              .catch(error => {
                  console.error('Error fetching message:', error);
                  document.getElementById("status").textContent = "Error fetching message.";
              });
          } else {
              console.log("No messages found");
              document.getElementById("status").textContent = "No messages found.";
          }
      })
      .catch(error => {
          console.error('Error fetching messages:', error);
          document.getElementById("status").textContent = "Error fetching messages.";
      });
  });
});
