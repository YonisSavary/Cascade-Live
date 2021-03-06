/**
 * CASCADE LIVE SCRIPT
 * STORAGE STRUCTURE (=>key)
 * 
 * => config
 *      =>  autoload (bool)
 *          autoload custom css is one exist for the actual domain
 *      =>  validate (bool)
 *          is validate checkbox checked by default ?
 * 
 * => css
 *      =>  text
 *          custom css to load
 */


// Buttons
let refreshButton   = document.querySelector("#refreshButton");
let saveButton      = document.querySelector("#saveButton");
// Main css text area
let cssInput        = document.querySelector("#cssCode");
// Validation input / output
let validationCheck = document.querySelector("#validationCheck");
let validationSpan  = document.querySelector("#validationSpan");


function loadConfig()
{
    try
    {
        browser.storage.local.get("validate").then((data, err)=>
        {
            if (err) console.log(err);
            if (data.validate !=  undefined)
            {
                validationCheck.checked = data.validate;
            }
            else
            {
                browser.storage.local.set({ validate: true });
            }
        });
    }
    catch
    {
        console.warn("Cannot access local storage for config, default configuration applied")
    }
}

function saveStorageConfig()
{
    let config = {
        validate: validationCheck.checked
    }
    console.log(config)
    try 
    {
        browser.storage.local.set(config)
    }
    catch
    {
        console.warn("Cannot access local storage to save your configuration")
    }
}

function loadStorageCSS()
{
    try
    {
        browser.storage.local.get("css").then((data, err)=>
        {
            if (err) console.log(err);
            if (data.css != undefined)
            {
                cssInput.value = data.css;
            }
            else
            {
                cssInput.value = `/* place your custom css here */\n:root\n{\n\tfont-size: 16px;\n}`
            }
        });
    }
    catch
    {
        cssInput.value = `/* no saved css found \n * place your custom css here \n**/\n:root\n{\n\tfont-size: 16px;\n}`
    }
}

function saveStorageCSS(cssValue)
{
    let css = { css: cssValue }
    try 
    {
        browser.storage.local.set(css)
    }
    catch
    {
        console.warn("Cannot access local storage to save your code")
    }
}

function applyCss()
{
    const cssRegex = /((?:^\s*)([\w#.@*,:\-.:>,*\s]+)\s*{(?:[\s]*)((?:[A-Za-z\- \s]+[:]\s*['"0-9\w .,\/()\-!%]+;?)*)*\s*}(?:\s*))/gi
    const commentRegex = /\/\*[^\*]*\*\//gi;

    let rules = cssInput.value;
    const ORIGINAL_RULES = rules; // original rules before modifications

    rules = rules.replace(/\n/gi,"")
    rules = rules.replace(commentRegex,"")
    if (rules.match(cssRegex) === null && validationCheck.checked) 
    {
        validationSpan.style.color = "red";
        validationSpan.innerText = "your CSS is not valid";
    }
    else
    {
        browser.tabs.insertCSS({code: rules}).then(()=>{
            saveStorageCSS(ORIGINAL_RULES)
            validationSpan.style.color = "green";
            validationSpan.innerText = "CSS Injected";
        })
    }
}

/**
 * Allow tabs on cssCode textarea
 */
document.querySelector("#cssCode").onkeydown = function(e) {
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

loadConfig();
loadStorageCSS();

refreshButton.onclick = applyCss;
saveButton.onclick = ()=>{ saveStorageCSS(cssInput.value); };

validationCheck.onclick = saveStorageConfig;