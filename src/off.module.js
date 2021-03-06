import { getRealEventList, getNameAndNamespace } from './common.module';

const off = (caller, events, selector, handler) => {

    let elementList,
    realSelector,
    eventsSplitted,
    realHandler;

    if (selector && typeof selector === "function"){
        realHandler = selector;
    }
    else if (selector && (typeof selector === 'string' || selector instanceof String) && !handler){
        realSelector = selector;
    }
    else if (selector && handler) {
        realSelector = selector;
        realHandler = handler;
    }

    if (events) {
        eventsSplitted = events.split(' ');
    }

    elementList = getRealEventList(caller);

    for (let elementIndex = 0; elementIndex < elementList.length; elementIndex++) {
        const currentElement = elementList[elementIndex];

        if (eventsSplitted && eventsSplitted.length > 0){

            for (let eventIndex = 0; eventIndex < eventsSplitted.length; eventIndex++) {
                const currentEvent = eventsSplitted[eventIndex];

                let currentEventName, namespace;
                [currentEventName, namespace] = getNameAndNamespace(currentEvent);

                if (currentEventName) {

                    if (realHandler){
                        removeListener(currentElement, namespace, currentEventName, realHandler, realSelector);
                    }
                    else {
                        removeAllListeners(currentElement, namespace, currentEventName, realSelector);
                    }
                } else if (namespace) { // in this case we don't have eventName but we have namespace

                    for (const currentEvent in currentElement.ev) {
                        removeAllListeners(currentElement, namespace, currentEvent, realSelector);
                    }
                }
            }
        } 
        else {
            for (const currentEvent in currentElement.ev) {
                removeAllListeners(currentElement, undefined, currentEvent, realSelector);
            }
        }
    }
};

const removeAllListeners = (currentElement, namespace, currentEvent, realSelector) => {
    let handlerList = getHandlerList(currentElement, namespace, currentEvent, realSelector);
    if (handlerList) {
        for (let handlerIndex = 0; handlerIndex < handlerList.length; handlerIndex++) {
            const currentHandler = handlerList[handlerIndex];
            removeListener(currentElement, namespace, currentEvent, currentHandler, realSelector);
        }
    }

    // if there is no namespace, we must to remove also namespaced eventhandlers
    if (!namespace && currentElement.ev && currentElement.ev[currentEvent] && currentElement.ev[currentEvent].nel) {
        for (const currentNamespace in currentElement.ev[currentEvent].nel) {
            removeAllListeners(currentElement, currentNamespace, currentEvent, realSelector);
        }
    }

    // if there is no delegate selector, we must to remove also delegated eventhandlers
    if (!realSelector && currentElement.ev && currentElement.ev[currentEvent] && currentElement.ev[currentEvent].del) {
        for (const currentRealSelector in currentElement.ev[currentEvent].del) {
            removeAllListeners(currentElement, namespace, currentEvent, currentRealSelector);
        }
    }
}

const removeListener = (element, namespace, currentEvent, handler, delegateSelector) => {
    let realEventStructure = getRealEventStructure(element, namespace, currentEvent);

    if (realEventStructure && handler) {
        if (!delegateSelector){
            if (element.ev && realEventStructure && realEventStructure.el)
            realEventStructure.el = realEventStructure.el.filter(el => el != handler);
            element.removeEventListener(currentEvent, handler);
        } else {
            const delegateHandler = getDelegateHandler(realEventStructure, handler, delegateSelector);
            if (delegateHandler){
                realEventStructure.del[delegateSelector] = realEventStructure.del[delegateSelector].filter(el => el != delegateHandler);
                element.removeEventListener(currentEvent, delegateHandler);
            }
        }
    }
}

const getDelegateHandler = (realEventStructure, handler, delegateSelector) => {
    let outcome = null;

    if (realEventStructure && delegateSelector) {
        if (realEventStructure.del[delegateSelector]){
            outcome = realEventStructure.del[delegateSelector].find( dh => dh.realHandler === handler);
        }
    }

    return outcome;
};

const getHandlerList = (element, namespace, currentEvent, delegateSelector) => {
    let outcome = null;

    let realEventStructure = getRealEventStructure(element, namespace, currentEvent);

    if (realEventStructure) {
        if (delegateSelector && realEventStructure.del[delegateSelector]){
            outcome = realEventStructure.del[delegateSelector].map( cdel => cdel.realHandler );
        }
        else {
            outcome = realEventStructure.el;
        }
    }
    
    return outcome;
};

const getRealEventStructure = (element, namespace, currentEvent) => {
    let outcome;
    if (element && element.ev && currentEvent && element.ev[currentEvent]) {

        if (namespace && element.ev[currentEvent].nel[namespace]) {
            outcome = element.ev[currentEvent].nel[namespace];
        } else if (!namespace){
            outcome = element.ev[currentEvent];
        }
    }

    return outcome;
}

export { off };