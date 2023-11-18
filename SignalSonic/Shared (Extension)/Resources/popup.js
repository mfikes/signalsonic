document.addEventListener('DOMContentLoaded', function() {
    
    var platform;
    
    // Check the user agent string to determine the platform
    var userAgent = navigator.userAgent;
    if (userAgent.match(/Macintosh/)) {
        platform = 'platform-mac';
    } else if (userAgent.match(/iPhone|iPad|iPod/)) {
        platform = 'platform-ios';
    } else {
        // Default platform if none of the above conditions match
        platform = 'platform-unknown';
    }
    
    // Apply the platform class to the body element
    document.body.classList.add(platform);
    
    // Query the active tab
    browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
            browser.tabs.sendMessage(tabs[0].id, {method: "getSelection"}).then(response => {
                if(response && response.data){
                    m.setText(response.data);
                    m.play();
                } else {
                    document.getElementById('message').textContent = "No text selected. Please select text on the page to play it as Morse code.";
                }
            }).catch(error => console.error('Error:', error));
        }
    });
});

