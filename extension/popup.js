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
            const messageSnippet = messageData.snippet;
            
            document.getElementById("status").textContent = messageSnippet;
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
  