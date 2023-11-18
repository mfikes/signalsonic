document.addEventListener('DOMContentLoaded', function() {
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

