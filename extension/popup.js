// Fetch the most recent email and its content
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

                // Check if there are multiple parts (plain text, HTML)
                if (payload.parts) {
                    payload.parts.forEach(part => {
                        // Check if the part is HTML
                        if (part.mimeType === 'text/html') {
                            const htmlBody = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
                            console.log('HTML Body:', htmlBody);

                            // Parse the HTML content
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(htmlBody, 'text/html');

                            // Search for the <p> tag containing the OTP (assumed to have spaces around the number)
                            const pTags = doc.querySelectorAll('p');
                            pTags.forEach(p => {
                                const otpHtmlMatch = p.innerText.match(/\s*(\d{4,9})\s*/);
                                if (otpHtmlMatch) {
                                    body = otpHtmlMatch[1];  // Capture the OTP without the surrounding spaces
                                    return;
                                }
                            });
                        }
                    });
                }

                // If we didn't find the OTP in the HTML, check the plain text (if available)
                if (body === '') {
                    if (payload.mimeType === 'text/plain') {
                        body = atob(payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
                    }

                    // Use regex to find OTP in plain text
                    const otpMatch = body.match(/(?:OTP|verification code|code is)[\s\S]*?(\d{4,9})/i);
                    body = otpMatch ? otpMatch[1] : "OTP not found";
                }

                // Display the OTP or error message
                document.getElementById("status").textContent = body;

                // Add functionality to copy OTP
                document.getElementById('copy-otp').addEventListener('click', function() {
                    navigator.clipboard.writeText(body).then(
                        function() {
                            alert('OTP copied to clipboard!');
                        },
                        function() {
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
