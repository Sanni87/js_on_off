import jsdom from "jsdom";
const { JSDOM } = jsdom;

const resetParent = (document) => resetElement(document, 'parent');

const initNewDom = () => {
    const newDom = getNewDom();
    setWindowOnGlobal(newDom);
    return newDom;
};

const resetElement = (document, elementId) => {
    const el = document.getElementById(elementId);
    const cloned = el.cloneNode(true);
    el.parentNode.replaceChild(cloned, el);
};
const triggerMouseEvent = (document, node, eventType) => {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

const getNewDom = () => new JSDOM(`<!DOCTYPE html>
<body>
<div id="qunit"></div>
<div id="qunit-fixture"></div>
<div id="toTest" hidden>
    <div id="parent">
        <button id="btn">Click me!</button>
        <button id="otherBtn">Don't click me</button>
        <p id="result" data-init="0">0</p>
    </div>
</div>
</body>`);

const setWindowOnGlobal = (jsdomObject) => {
    globalThis.document = jsdomObject.window.document;
    globalThis.Element = jsdomObject.window.Element;
    globalThis.HTMLCollection = jsdomObject.window.HTMLCollection;
    globalThis.NodeList = jsdomObject.window.NodeList;
};

export { initNewDom, resetParent, resetElement, triggerMouseEvent };