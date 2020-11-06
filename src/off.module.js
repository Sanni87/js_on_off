import { getRealEventList, getNameAndNamespace } from './common.module';

const off = function (events, selector, handler) {

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

    elementList = getRealEventList(this);

    for (let elementIndex = 0; elementIndex < elementList.length; elementIndex++) {
        const currentElement = elementList[elementIndex];

        if (eventsSplitted && eventsSplitted.length > 0){

            for (let eventIndex = 0; eventIndex < eventsSplitted.length; eventIndex++) {
                const currentEvent = eventsSplitted[eventIndex];

                let currentEventName, namespace;
                [currentEventName, namespace] = getNameAndNamespace(currentEvent);

                if (realHandler){
                    removeListener(currentElement, namespace, currentEventName, realHandler, realSelector);
                }
                else {
                    removeAllListeners(currentElement, namespace, currentEventName, realSelector);
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

const removeAllListeners = function (currentElement, namespace, currentEvent, realSelector) {
    let handlerList = getHandlerList(currentElement, namespace, currentEvent, realSelector);
    if (handlerList) {
        for (let handlerIndex = 0; handlerIndex < handlerList.length; handlerIndex++) {
            const currentHandler = handlerList[handlerIndex];
            removeListener(currentElement, namespace, currentEvent, currentHandler, realSelector);
        }
    }
}

const removeListener = function (element, namespace, currentEvent, handler, delegateSelector) {
    if (element && currentEvent && handler){
        if (!delegateSelector){
            if (element.ev && element.ev[currentEvent] && element.ev[currentEvent].el)
            element.ev[currentEvent].el = element.ev[currentEvent].el.filter(el => el != handler);
            element.removeEventListener(currentEvent, handler);
        } else {
            const delegateHandler = getDelegateHandler(element, namespace, currentEvent, handler, delegateSelector);
            if (delegateHandler){
                element.ev[currentEvent].del[delegateSelector] = element.ev[currentEvent].del[delegateSelector].filter(el => el != delegateHandler);
                element.removeEventListener(currentEvent, delegateHandler);
            }
        }
    }
}

const getDelegateHandler = function (element, namespace, currentEvent, handler, delegateSelector) {
    let outcome = null;

    if (element && currentEvent && handler && delegateSelector) {
        if (element.ev && element.ev[currentEvent] && element.ev[currentEvent].del && element.ev[currentEvent].del[delegateSelector]){
            outcome = element.ev[currentEvent].el = element.ev[currentEvent].del[delegateSelector].find( dh => dh.realHandler === handler);
        }
    }

    return outcome;
};

const getHandlerList = function (element, namespace, currentEvent, delegateSelector) {
    let outcome = null;

    if (element && element.ev && currentEvent) {
        const eventListenersData = element.ev[currentEvent];
        if (delegateSelector && eventListenersData.del[delegateSelector]){
            outcome = eventListenersData.del[delegateSelector].map( cdel => cdel.realHandler );
        }
        else {
            outcome = eventListenersData.el;
        }
    }

    return outcome;
};

export { off };