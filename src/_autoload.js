
browser.storage.local.get("autoload").then((data, err)=>
{
    if (err) console.log(err);
    if (data.autoload == true )
    {
        browser.storage.local.get("css").then((data, err)=>
        {
            if (err) console.log(err);

            const commentRegex = /\/\*[^\*]*\*\//gi;
            let rules = data.css;
            rules = rules.replace(/[\n\t]/gi,"");
            rules = rules.replace(commentRegex,"");
            console.log(rules)
            let sheet = window.document.styleSheets[0];
            sheet.insertRule(rules, sheet.cssRules.length);
        })
    }
})
