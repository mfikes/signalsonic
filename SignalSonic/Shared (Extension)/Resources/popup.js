document.addEventListener('DOMContentLoaded', function() {
    // Query the active tab
    browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
            // Send a message to the content script in the active tab
            browser.tabs.sendMessage(tabs[0].id, {method: "getSelection"}).then(response => {
                if(response && response.data){
                    var m = new jscw();
                    m.setWpm(20);
                    m.setEff(20);
                    m.setFreq(600);
                    m.setText(response.data);
                    m.play();
                } else {
                    document.getElementById('message').textContent = "No text selected. Please select text on the page to play it as Morse code.";
                                        
                }
            }).catch(error => console.error('Error:', error));
        }
    });
});


