const onFn = function (events, selector, data, handler) {

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
    
                    if (!currentElement.ev[currentEvent]) {
                        currentElement.ev[currentEvent] = {
                            nel: {}, //namespaced eventListeners TODO
                            el: [], //no-namespaced eventListeners
                            del: {} //delegate eventListeners
                        };
                    }
    
                    addListener(currentElement, currentEvent, realHandler, realSelector);
                }
            }
        }
    }
};

const offFn = function (events, selector, handler) {

    //if event is null or empty, don't run anything
    if (events) {
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

        eventsSplitted = events.split(' ');

        elementList = getRealEventList(this);

        for (let elementIndex = 0; elementIndex < elementList.length; elementIndex++) {
            const currentElement = elementList[elementIndex];

            for (let eventIndex = 0; eventIndex < eventsSplitted.length; eventIndex++) {
                const currentEvent = eventsSplitted[eventIndex];

                if (realHandler){
                    removeListener(currentElement, currentEvent, realHandler, realSelector);
                }
                else {
                    let handlerList = getHandlerList(currentElement, currentEvent, realSelector);
                    if (handlerList) {
                        for (let handlerIndex = 0; handlerIndex < handlerList.length; handlerIndex++) {
                            const currentHandler = handlerList[handlerIndex];
                            removeListener(currentElement, currentEvent, currentHandler, realSelector);
                        }
                    }
                }
            }
        }
    }
};

const getRealEventList = function (parentElement) {
    let result = null;

    //In this case we assign the event to the elements itselfs
    if (parentElement === document || parentElement instanceof Element) {
        result = [parentElement];
    }
    else if (parentElement instanceof HTMLCollection || parentElement instanceof NodeList) {
        result = parentElement;
    }

    return result;
};

const addListener = function (element, currentEvent, handler, delegateSelector) {
    if (element && currentEvent && handler){
        if (!delegateSelector){
            element.ev[currentEvent].el.push(handler);
            element.addEventListener(currentEvent, handler);
        } else {
            const delegateHandler = createDelegateHandler(handler, delegateSelector);
            if (!element.ev[currentEvent].del[delegateSelector]){
                element.ev[currentEvent].del[delegateSelector] = [];
            }
            element.ev[currentEvent].del[delegateSelector].push(delegateHandler);
            element.addEventListener(currentEvent, delegateHandler, false);
        }
    }
};

const removeListener = function (element, currentEvent, handler, delegateSelector) {
    if (element && currentEvent && handler){
        if (!delegateSelector){
            if (element.ev && element.ev[currentEvent] && element.ev[currentEvent].el)
            element.ev[currentEvent].el = element.ev[currentEvent].el.filter(el => el != handler);
            element.removeEventListener(currentEvent, handler);
        } else {
            const delegateHandler = getDelegateHandler(element, currentEvent, handler, delegateSelector);
            if (delegateHandler){
                element.ev[currentEvent].el = element.ev[currentEvent].del[delegateSelector].filter(el => el != delegateHandler);
                element.removeEventListener(currentEvent, delegateHandler);
            }
        }
    }
}

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

const getDelegateHandler = function (element, currentEvent, handler, delegateSelector) {
    let outcome = null;

    if (element && currentEvent && handler && delegateSelector) {
        if (element.ev && element.ev[currentEvent] && element.ev[currentEvent].del && element.ev[currentEvent].del[delegateSelector]){
            outcome = element.ev[currentEvent].el = element.ev[currentEvent].del[delegateSelector].find( dh => dh.realHandler === handler);
        }
    }

    return outcome;
};

const getHandlerList = function (element, currentEvent, delegateSelector) {
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

export { onFn as on, offFn as off };