if (typeof $sn === 'undefined'){
    var $sn = {};
}
$sn.onFn = function (events, selector, data, handler) {

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

        elementList = $sn.getRealEventList(this, realSelector);

        for (let elementIndex = 0; elementIndex < elementList.length; elementIndex++) {
            const currentElement = elementList[elementIndex];
    
            //Create the dictionary to next off the events properly
            if (!currentElement.el){
                currentElement.el = {};
            }
    
            if (eventsSplitted) {
                for (let eventIndex = 0; eventIndex < eventsSplitted.length; eventIndex++) {
                    const currentEvent = eventsSplitted[eventIndex];
    
                    if (!currentElement.el[currentEvent]){
                        currentElement.el[currentEvent] = {
                            nel: {}, //namespaced eventListeners TODO
                            dev: [] //no-namespaced eventListeners
                        };
                    }
    
                    currentElement.el[currentEvent].dev.push(realHandler);
                    currentElement.addEventListener(currentEvent, realHandler);
                }
            }
        }
    }
};

$sn.offFn = function (events, selector, handler) {

    //if event is null or empty, don't run anything
    if (events) {
        let elementList,
        realSelector,
        eventsSplitted,
        realHandler;

        if (selector && !handler){
            realHandler = selector;
        }
        else if (selector && handler) {
            realSelector = selector;
            realHandler = handler;
        }

        eventsSplitted = events.split(' ');

        elementList = $sn.getRealEventList(this, realSelector);

        for (let elementIndex = 0; elementIndex < elementList.length; elementIndex++) {
            const currentElement = elementList[elementIndex];
    
            if (currentElement.el){
                if (eventsSplitted) {
                    for (let eventIndex = 0; eventIndex < eventsSplitted.length; eventIndex++) {
                        const currentEvent = eventsSplitted[eventIndex];
                        
                        if (currentElement.el[currentEvent] && currentElement.el[currentEvent].dev){

                            if (realHandler){
                                currentElement.el[currentEvent].dev = currentElement.el[currentEvent].dev.filter(el => el != realHandler);
                                currentElement.removeEventListener(currentEvent, realHandler);
                            }
                            else {
                                for (let handlerIndex = 0; handlerIndex < currentElement.el[currentEvent].dev.length; handlerIndex++) {
                                    const currentHandler = currentElement.el[currentEvent].dev[handlerIndex];
                                    currentElement.removeEventListener(currentEvent, currentHandler);
                                }
                                currentElement.el[currentEvent].dev = [];
                            }
                        }
                        
                    }
                }
            }
        }
    }
};

$sn.getRealEventList = function (parentElement, realSelector) {
    let result = null;

    if (!realSelector) {

        //In this case we assign the event to the elements itselfs
        if (parentElement instanceof Element) {
            result = [parentElement];
        }
        else if (parentElement instanceof HTMLCollection || parentElement instanceof NodeList) {
            result = parentElement;
        }
    }
    else {

        //In this case we assign the event to the childrenElements
        if (parentElement instanceof Element) {
            result = parentElement.querySelectorAll(realSelector);
        }
        else if (parentElement instanceof HTMLCollection || parentElement instanceof NodeList) {
            result = [];
            for (let parentElementIndex = 0; parentElementIndex < parentElement.length; parentElementIndex++) {
                const currentParentElement = parentElement[parentElementIndex];
                const currentChildrenElements = currentParentElement.querySelectorAll(realSelector);
                for (let currentChildIndex = 0; currentChildIndex < currentChildrenElements.length; currentChildIndex++) {
                    const currentChild = currentChildrenElements[currentChildIndex];
                    result.push(currentChild);
                }
            }
        }
    }

    return result;
};

//We assign onFn to Element and NodeList
Element.prototype.on = $sn.onFn;
HTMLCollection.prototype.on = $sn.onFn;
NodeList.prototype.on = $sn.onFn;

//We assign offFn to Element and NodeList
Element.prototype.off = $sn.offFn;
HTMLCollection.prototype.off = $sn.offFn;
NodeList.prototype.off = $sn.offFn;



