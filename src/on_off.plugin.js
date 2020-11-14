import { on } from './on.module';
import { off } from './off.module';

const callOn = function (...args) {
    return on(this, ...args);
};

const callOff = function (...args) {
    return off(this, ...args);
};

//We assign onFn to document, Element and NodeList
document.on = callOn;
Element.prototype.on = callOn;
HTMLCollection.prototype.on = callOn;
NodeList.prototype.on = callOn;

//We assign offFn to document, Element and NodeList
document.off = callOff;
Element.prototype.off = callOff;
HTMLCollection.prototype.off = callOff;
NodeList.prototype.off = callOff;

