browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method === "getSelection") {
        const selectedText = window.getSelection().toString();
        sendResponse({data: selectedText});
    }
});
