let refreshButton   = document.querySelector("#refreshButton");
let saveButton      = document.querySelector("#saveButton");
let cssInput        = document.querySelector("#cssCode")
let validationSpan  = document.querySelector("#validationSpan")
let validationCheck = document.querySelector("#validationCheck");

function getStorageCss()
{
    browser.storage.local.get("cascadeLive").then((ok, err)=>{
        if (err)
        {
            console.log(err)
        }
        else
        {
            if (ok.cascadeLive)
            {
                cssInput.value = ok.cascadeLive.text;
            }
            else
            {
                cssInput.value = `/* type your custom css rules here to add them to the document */\n:root\n{\n\tfont-size: 16px;\n}`;
            }
        }
    })
}

function saveStorageCSS(value)
{
    let cascadeLive = {
        text: value
    }
    browser.storage.local.set({cascadeLive});
}

function handleKey(e)
{
    if (e.key === "}")
    {
        refresh();
    }
    
}

function refresh()
{
    const cssRegex = /((?:^\s*)([\w#.@*,:\-.:>,*\s]+)\s*{(?:[\s]*)((?:[A-Za-z\- \s]+[:]\s*['"0-9\w .,\/()\-!%]+;?)*)*\s*}(?:\s*))/gi
    let rules = cssInput.value;
    const O_rules = rules; // original rules before modifications
    rules = rules.replace(/\n/gi,"").replace(/\/\*[^\*]*\*\//gi,"")
    if (rules.match(cssRegex) === null && validationCheck.checked) 
    {
        validationSpan.style.color = "red";
        validationSpan.innerText = "your CSS is not valid";
    }
    else
    {
        browser.tabs.insertCSS({code: rules}).then(()=>{
            validationSpan.style.color = "green";
            validationSpan.innerText = "CSS Injected";
            saveStorageCSS(O_rules)
        })
    }
}

// thanks to : https://jsfiddle.net/2wAzx/13/
function enableTab(id) {
    var el = document.getElementById(id);
    el.onkeydown = function(e) {
        if (e.keyCode === 9) { // tab was pressed

            // get caret position/selection
            var val = this.value,
                start = this.selectionStart,
                end = this.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            this.value = val.substring(0, start) + '\t' + val.substring(end);

            // put caret at right position again
            this.selectionStart = this.selectionEnd = start + 1;

            // prevent the focus lose
            return false;

        }
    };
}
// Enable the tab character onkeypress (onkeydown) inside textarea...
// ... for a textarea that has an `id="my-textarea"`
enableTab('cssCode');


refreshButton.onclick = refresh;
cssInput.addEventListener("keyup", handleKey)
saveButton.onclick = ()=>{
    saveStorageCSS(cssInput.value)
}
getStorageCss();

/**
    "background": {
        "scripts": ["./src/cascade_debug.js"]
    }
 */