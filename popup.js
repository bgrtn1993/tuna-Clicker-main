let macroActive = false;
let macroType = "";

document.getElementById("startHorizontal").addEventListener("click", () => {
    if (!macroActive) {
        macroActive = true;
        macroType = "horizontal";
        document.getElementById("startHorizontal").disabled = true;
        document.getElementById("stopMacro").disabled = false;
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: startMacro,
                args: [macroType]
            });
        });
    }
});

document.getElementById("startVertical").addEventListener("click", () => {
    if (!macroActive) {
        macroActive = true;
        macroType = "vertical";
        document.getElementById("startVertical").disabled = true;
        document.getElementById("stopMacro").disabled = false;
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: startMacro,
                args: [macroType]
            });
        });
    }
});

document.getElementById("stopMacro").addEventListener("click", () => {
    if (macroActive) {
        macroActive = false;
        document.getElementById("startHorizontal").disabled = false;
        document.getElementById("startVertical").disabled = false;
        document.getElementById("stopMacro").disabled = true;
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: stopMacro
            });
        });
    }
});

function startMacro(type) {
    window.macroActive = true;

    const keyCodeA = 65, keyCodeD = 68;
    const keyCodeW = 87, keyCodeS = 83;
    const keyCode1 = 49;

    function simulateKeyPress(key, code, keyCode) {
        const eventDown = new KeyboardEvent('keydown', {
            key: key,
            code: code,
            keyCode: keyCode,
            which: keyCode,
            bubbles: true,
            cancelable: true
        });

        const eventUp = new KeyboardEvent('keyup', {
            key: key,
            code: code,
            keyCode: keyCode,
            which: keyCode,
            bubbles: true,
            cancelable: true
        });

        document.dispatchEvent(eventDown);
        setTimeout(() => {
            document.dispatchEvent(eventUp);
        }, 1000);
    }

    function pressKey1() {
        const eventDown1 = new KeyboardEvent('keydown', {
            key: '1',
            code: 'Digit1',
            keyCode: keyCode1,
            which: keyCode1,
            bubbles: true,
            cancelable: true
        });

        const eventUp1 = new KeyboardEvent('keyup', {
            key: '1',
            code: 'Digit1',
            keyCode: keyCode1,
            which: keyCode1,
            bubbles: true,
            cancelable: true
        });

        document.dispatchEvent(eventDown1);

        setTimeout(() => {
            document.dispatchEvent(eventUp1);
        }, 100);
    }

    function repeatPressKey1() {
        if (window.macroActive) {
            pressKey1();
            setTimeout(repeatPressKey1, 200);
        }
    }

    function macroLoop() {
        if (window.macroActive) {
            if (type === "horizontal") {
                simulateKeyPress('a', 'KeyA', keyCodeA);
                setTimeout(() => {
                    simulateKeyPress('d', 'KeyD', keyCodeD);
                }, 1000);
            } else if (type === "vertical") {
                simulateKeyPress('w', 'KeyW', keyCodeW);
                setTimeout(() => {
                    simulateKeyPress('s', 'KeyS', keyCodeS);
                }, 1000);
            }

            setTimeout(macroLoop, 2000);


            repeatPressKey1();
        }
    }

    macroLoop();
}


function stopMacro() {
    window.macroActive = false;
    console.log("Makro durduruldu.");
}
