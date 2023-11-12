browser.runtime.sendMessage({ greeting: "hello" }).then((response) => {
    console.log("mine");
    console.log("Received response: ", response);
    console.log(window.getSelection().toString());
});

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method === "getSelection") {
        const selectedText = window.getSelection().toString();
        sendResponse({data: selectedText});
    }
});
