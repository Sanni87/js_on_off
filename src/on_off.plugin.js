import {on, off} from './on_off.module';

(function () {

    //We assign onFn to document, Element and NodeList
    document.on = on;
    Element.prototype.on = on;
    HTMLCollection.prototype.on = on;
    NodeList.prototype.on = on;

    //We assign offFn to document, Element and NodeList
    document.off = off;
    Element.prototype.off = off;
    HTMLCollection.prototype.off = off;
    NodeList.prototype.off = off;

})();

