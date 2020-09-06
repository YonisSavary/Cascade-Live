async function getCSSFromElement(info, tab)
{
    return browser.tabs.executeScript(tab.id, {
        frameId: info.frameId,
        code: `
            function getMatchedCSSRules (el, css = el.ownerDocument.styleSheets)
            {
                return [].concat(...[...css].map(s => [...s.cssRules||[]])).filter(r => el.matches(r.selectorText));
            }
            
            if (window.target === undefined) 
            {
                var target, classes, fullCss;
            }
            target = browser.menus.getTargetElement(${info.targetElementId});
            classes = getMatchedCSSRules(target);
            
            fullCss = "";
            classes.forEach(element => {
                fullCss += element.cssText + "\\n\\n";
            });
            fullCss = fullCss.replace(/[{]/gi,"\\n{\\n")
            fullCss = fullCss.replace(/[;]/gi,";\\n")
            fullCss = fullCss.replace(/ }/gi,"}")
            fullCss;
        `,
    });
}

browser.menus.create({
    id: "cascade-edit",
    title: "Edit with Cascade Live",
    contexts: ["page", "link"]
  });
   
browser.menus.onClicked.addListener(async function (info, tab) {
    if (info.menuItemId == "cascade-edit") {
        getCSSFromElement(info, tab).then( data => 
        {
            browser.storage.local.set({ css: data.join("") })
            browser.tabs.executeScript(tab.id, {
                frameId: info.frameId,
                code: "alert('CSS Code copied, open Cascade Live to Edit it !')"
            });
        })
        .catch(err =>
        {
            /**
             * Usually a cross-origin error
             */
            browser.tabs.executeScript(tab.id, {
                frameId: info.frameId,
                code: `alert('Error on CSS fetch, sorry :( \\n\\n${err}')`
            });
        });
    }
});
