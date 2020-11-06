import { getRealEventList, getNameAndNamespace } from './common.module';

const on = function (events, selector, data, handler) {

    //if event is null or empty, don't run anything
    if (events) {
        let elementList,
        realSelector,
        realData,
        realHandler,
        eventsSplitted;

        if (selector && !data && !handler) {
            realHandler = selector;
        }
        else if (selector && data && !handler) {
            realSelector = selector;
            realHandler = data;
        }
        else if (selector && data && handler) {
            realSelector = selector;
            realData = data;
            realHandler = handler;
        }

        eventsSplitted = events.split(' ');

        elementList = getRealEventList(this);

        for (let elementIndex = 0; elementIndex < elementList.length; elementIndex++) {
            const currentElement = elementList[elementIndex];
    
            //Create the dictionary to next off the events properly
            if (!currentElement.ev){
                currentElement.ev = {};
            }
    
            if (eventsSplitted) {
                for (let eventIndex = 0; eventIndex < eventsSplitted.length; eventIndex++) {
                    const currentEvent = eventsSplitted[eventIndex];
    
                    let currentEventName, namespace;
                    [currentEventName, namespace] = getNameAndNamespace(currentEvent);
                    if (!currentElement.ev[currentEventName]) {
                        currentElement.ev[currentEventName] = createEmptyEventStructure(true);
                    }
    
                    addListener(currentElement, namespace, currentEventName, realHandler, realSelector);
                }
            }
        }
    }
};

const addListener = function (element, namespace, currentEvent, handler, delegateSelector) {
    if (element && currentEvent && handler) {

        let realEventStructure;
        if (namespace) {
            if (!element.ev[currentEvent].nel[namespace]) {
                element.ev[currentEvent].nel[namespace] = createEmptyEventStructure();
            }
            realEventStructure = element.ev[currentEvent].nel[namespace];
        } else {
            realEventStructure = element.ev[currentEvent];
        }

        if (!delegateSelector){
            realEventStructure.el.push(handler);
            element.addEventListener(currentEvent, handler);
        } else {
            const delegateHandler = createDelegateHandler(handler, delegateSelector);
            if (!realEventStructure.del[delegateSelector]){
                realEventStructure.del[delegateSelector] = [];
            }
            realEventStructure.del[delegateSelector].push(delegateHandler);
            element.addEventListener(currentEvent, delegateHandler, false);
        }
    }
};

const createDelegateHandler = function (handler, delegateSelector) {
    let outcome = null;

    if (handler && delegateSelector){
        outcome = function(e) {
            // loop parent nodes from the target to the delegation node
            for (let target = e.target; target && target != this; target = target.parentNode) {
                if (target.matches(delegateSelector)) {
                    handler.call(target, e);
                    break;
                }
            }
        };

        outcome.realHandler = handler;
    }

    return outcome;
};

const createEmptyEventStructure = function (withNamespacedEvents) {
    let outcome = {
        el: [], //no-namespaced eventListeners
        del: {} //delegate eventListeners
    };

    if (withNamespacedEvents) {
        outcome.nel = {}; //namespaced eventListeners
    }

    return outcome;
};

export { on };