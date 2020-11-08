/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/common.module.js":
/*!******************************!*\
  !*** ./src/common.module.js ***!
  \******************************/
/*! namespace exports */
/*! export getNameAndNamespace [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getRealEventList [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getRealEventList": () => /* binding */ getRealEventList,
/* harmony export */   "getNameAndNamespace": () => /* binding */ getNameAndNamespace
/* harmony export */ });
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

const getNameAndNamespace = function (nameWithNamespace) {
    const outcome = [];
    if (nameWithNamespace) {
        const splitted = nameWithNamespace.split('.');
        if (splitted){

            for (let index = 0; index < splitted.length; index++) {
                outcome.push(splitted[index]);
            }
        }
    }
    return outcome;
};



/***/ }),

/***/ "./src/off.module.js":
/*!***************************!*\
  !*** ./src/off.module.js ***!
  \***************************/
/*! namespace exports */
/*! export off [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "off": () => /* binding */ off
/* harmony export */ });
/* harmony import */ var _common_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.module */ "./src/common.module.js");
;

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

    elementList = (0,_common_module__WEBPACK_IMPORTED_MODULE_0__.getRealEventList)(caller);

    for (let elementIndex = 0; elementIndex < elementList.length; elementIndex++) {
        const currentElement = elementList[elementIndex];

        if (eventsSplitted && eventsSplitted.length > 0){

            for (let eventIndex = 0; eventIndex < eventsSplitted.length; eventIndex++) {
                const currentEvent = eventsSplitted[eventIndex];

                let currentEventName, namespace;
                [currentEventName, namespace] = (0,_common_module__WEBPACK_IMPORTED_MODULE_0__.getNameAndNamespace)(currentEvent);

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



/***/ }),

/***/ "./src/on.module.js":
/*!**************************!*\
  !*** ./src/on.module.js ***!
  \**************************/
/*! namespace exports */
/*! export on [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "on": () => /* binding */ on
/* harmony export */ });
/* harmony import */ var _common_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.module */ "./src/common.module.js");
;

const on = (caller, events, selector, data, handler) => {

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

        elementList = (0,_common_module__WEBPACK_IMPORTED_MODULE_0__.getRealEventList)(caller);

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
                    [currentEventName, namespace] = (0,_common_module__WEBPACK_IMPORTED_MODULE_0__.getNameAndNamespace)(currentEvent);
                    if (!currentElement.ev[currentEventName]) {
                        currentElement.ev[currentEventName] = createEmptyEventStructure(true);
                    }
    
                    addListener(currentElement, namespace, currentEventName, realHandler, realSelector);
                }
            }
        }
    }
};

const addListener = (element, namespace, currentEvent, handler, delegateSelector) => {
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
            const delegateHandler = createDelegateHandler(element, handler, delegateSelector);
            if (!realEventStructure.del[delegateSelector]){
                realEventStructure.del[delegateSelector] = [];
            }
            realEventStructure.del[delegateSelector].push(delegateHandler);
            element.addEventListener(currentEvent, delegateHandler, false);
        }
    }
};

const createDelegateHandler = (element, handler, delegateSelector) => {
    let outcome = null;

    if (handler && delegateSelector){
        outcome = function(e) {
            // loop parent nodes from the target to the delegation node
            for (let target = e.target; target && target != element; target = target.parentNode) {
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

const createEmptyEventStructure = (withNamespacedEvents) => {
    let outcome = {
        el: [], //no-namespaced eventListeners
        del: {} //delegate eventListeners
    };

    if (withNamespacedEvents) {
        outcome.nel = {}; //namespaced eventListeners
    }

    return outcome;
};



/***/ }),

/***/ "./src/on_off.module.js":
/*!******************************!*\
  !*** ./src/on_off.module.js ***!
  \******************************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, module.loaded, module.id, module, __webpack_require__.hmd, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _on_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./on.module */ "./src/on.module.js");
/* harmony import */ var _off_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./off.module */ "./src/off.module.js");
/* module decorator */ module = __webpack_require__.hmd(module);
;



module.exports = {
    on: _on_module__WEBPACK_IMPORTED_MODULE_0__.on,
    off: _off_module__WEBPACK_IMPORTED_MODULE_1__.off,
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/harmony module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.hmd = (module) => {
/******/ 			module = Object.create(module);
/******/ 			if (!module.children) module.children = [];
/******/ 			Object.defineProperty(module, 'exports', {
/******/ 				enumerable: true,
/******/ 				set: () => {
/******/ 					throw new Error('ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + module.id);
/******/ 				}
/******/ 			});
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	__webpack_require__("./src/on_off.module.js");
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qc19vbl9vZmYvLi9zcmMvY29tbW9uLm1vZHVsZS5qcyIsIndlYnBhY2s6Ly9qc19vbl9vZmYvLi9zcmMvb2ZmLm1vZHVsZS5qcyIsIndlYnBhY2s6Ly9qc19vbl9vZmYvLi9zcmMvb24ubW9kdWxlLmpzIiwid2VicGFjazovL2pzX29uX29mZi8uL3NyYy9vbl9vZmYubW9kdWxlLmpzIiwid2VicGFjazovL2pzX29uX29mZi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9qc19vbl9vZmYvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2pzX29uX29mZi93ZWJwYWNrL3J1bnRpbWUvaGFybW9ueSBtb2R1bGUgZGVjb3JhdG9yIiwid2VicGFjazovL2pzX29uX29mZi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2pzX29uX29mZi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2pzX29uX29mZi93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwrQkFBK0IseUJBQXlCO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMUJBLENBQXdFOztBQUV4RTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCLGdFQUFnQjs7QUFFbEMsOEJBQThCLG1DQUFtQztBQUNqRTs7QUFFQTs7QUFFQSxvQ0FBb0Msb0NBQW9DO0FBQ3hFOztBQUVBO0FBQ0EsZ0RBQWdELG1FQUFtQjs7QUFFbkU7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLHNCQUFzQjs7QUFFdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsbUNBQW1DO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEpBLENBQXdFOztBQUV4RTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsc0JBQXNCLGdFQUFnQjs7QUFFdEMsa0NBQWtDLG1DQUFtQztBQUNyRTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHdDQUF3QyxvQ0FBb0M7QUFDNUU7O0FBRUE7QUFDQSxvREFBb0QsbUVBQW1CO0FBQ3ZFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLDZCQUE2QjtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjs7QUFFQTtBQUNBLHlCQUF5QjtBQUN6Qjs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEhBLENBQWlDO0FBQ0U7OztBQUduQztBQUNBLFFBQVEsMENBQUU7QUFDVixTQUFTLDRDQUFHO0FBQ1osRTs7Ozs7O1VDUEE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N4QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxFQUFFO1dBQ0Y7V0FDQSxFOzs7OztXQ1ZBLHNGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoib25fb2ZmLm1vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGdldFJlYWxFdmVudExpc3QgPSBmdW5jdGlvbiAocGFyZW50RWxlbWVudCkge1xyXG4gICAgbGV0IHJlc3VsdCA9IG51bGw7XHJcblxyXG4gICAgLy9JbiB0aGlzIGNhc2Ugd2UgYXNzaWduIHRoZSBldmVudCB0byB0aGUgZWxlbWVudHMgaXRzZWxmc1xyXG4gICAgaWYgKHBhcmVudEVsZW1lbnQgPT09IGRvY3VtZW50IHx8IHBhcmVudEVsZW1lbnQgaW5zdGFuY2VvZiBFbGVtZW50KSB7XHJcbiAgICAgICAgcmVzdWx0ID0gW3BhcmVudEVsZW1lbnRdO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocGFyZW50RWxlbWVudCBpbnN0YW5jZW9mIEhUTUxDb2xsZWN0aW9uIHx8IHBhcmVudEVsZW1lbnQgaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xyXG4gICAgICAgIHJlc3VsdCA9IHBhcmVudEVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbmNvbnN0IGdldE5hbWVBbmROYW1lc3BhY2UgPSBmdW5jdGlvbiAobmFtZVdpdGhOYW1lc3BhY2UpIHtcclxuICAgIGNvbnN0IG91dGNvbWUgPSBbXTtcclxuICAgIGlmIChuYW1lV2l0aE5hbWVzcGFjZSkge1xyXG4gICAgICAgIGNvbnN0IHNwbGl0dGVkID0gbmFtZVdpdGhOYW1lc3BhY2Uuc3BsaXQoJy4nKTtcclxuICAgICAgICBpZiAoc3BsaXR0ZWQpe1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHNwbGl0dGVkLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgb3V0Y29tZS5wdXNoKHNwbGl0dGVkW2luZGV4XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3V0Y29tZTtcclxufTtcclxuXHJcbmV4cG9ydCB7IGdldFJlYWxFdmVudExpc3QsIGdldE5hbWVBbmROYW1lc3BhY2UgfTsiLCJpbXBvcnQgeyBnZXRSZWFsRXZlbnRMaXN0LCBnZXROYW1lQW5kTmFtZXNwYWNlIH0gZnJvbSAnLi9jb21tb24ubW9kdWxlJztcclxuXHJcbmNvbnN0IG9mZiA9IChjYWxsZXIsIGV2ZW50cywgc2VsZWN0b3IsIGhhbmRsZXIpID0+IHtcclxuXHJcbiAgICBsZXQgZWxlbWVudExpc3QsXHJcbiAgICByZWFsU2VsZWN0b3IsXHJcbiAgICBldmVudHNTcGxpdHRlZCxcclxuICAgIHJlYWxIYW5kbGVyO1xyXG5cclxuICAgIGlmIChzZWxlY3RvciAmJiB0eXBlb2Ygc2VsZWN0b3IgPT09IFwiZnVuY3Rpb25cIil7XHJcbiAgICAgICAgcmVhbEhhbmRsZXIgPSBzZWxlY3RvcjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHNlbGVjdG9yICYmICh0eXBlb2Ygc2VsZWN0b3IgPT09ICdzdHJpbmcnIHx8IHNlbGVjdG9yIGluc3RhbmNlb2YgU3RyaW5nKSAmJiAhaGFuZGxlcil7XHJcbiAgICAgICAgcmVhbFNlbGVjdG9yID0gc2VsZWN0b3I7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChzZWxlY3RvciAmJiBoYW5kbGVyKSB7XHJcbiAgICAgICAgcmVhbFNlbGVjdG9yID0gc2VsZWN0b3I7XHJcbiAgICAgICAgcmVhbEhhbmRsZXIgPSBoYW5kbGVyO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChldmVudHMpIHtcclxuICAgICAgICBldmVudHNTcGxpdHRlZCA9IGV2ZW50cy5zcGxpdCgnICcpO1xyXG4gICAgfVxyXG5cclxuICAgIGVsZW1lbnRMaXN0ID0gZ2V0UmVhbEV2ZW50TGlzdChjYWxsZXIpO1xyXG5cclxuICAgIGZvciAobGV0IGVsZW1lbnRJbmRleCA9IDA7IGVsZW1lbnRJbmRleCA8IGVsZW1lbnRMaXN0Lmxlbmd0aDsgZWxlbWVudEluZGV4KyspIHtcclxuICAgICAgICBjb25zdCBjdXJyZW50RWxlbWVudCA9IGVsZW1lbnRMaXN0W2VsZW1lbnRJbmRleF07XHJcblxyXG4gICAgICAgIGlmIChldmVudHNTcGxpdHRlZCAmJiBldmVudHNTcGxpdHRlZC5sZW5ndGggPiAwKXtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGV2ZW50SW5kZXggPSAwOyBldmVudEluZGV4IDwgZXZlbnRzU3BsaXR0ZWQubGVuZ3RoOyBldmVudEluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRFdmVudCA9IGV2ZW50c1NwbGl0dGVkW2V2ZW50SW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50RXZlbnROYW1lLCBuYW1lc3BhY2U7XHJcbiAgICAgICAgICAgICAgICBbY3VycmVudEV2ZW50TmFtZSwgbmFtZXNwYWNlXSA9IGdldE5hbWVBbmROYW1lc3BhY2UoY3VycmVudEV2ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudEV2ZW50TmFtZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVhbEhhbmRsZXIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVMaXN0ZW5lcihjdXJyZW50RWxlbWVudCwgbmFtZXNwYWNlLCBjdXJyZW50RXZlbnROYW1lLCByZWFsSGFuZGxlciwgcmVhbFNlbGVjdG9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZUFsbExpc3RlbmVycyhjdXJyZW50RWxlbWVudCwgbmFtZXNwYWNlLCBjdXJyZW50RXZlbnROYW1lLCByZWFsU2VsZWN0b3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobmFtZXNwYWNlKSB7IC8vIGluIHRoaXMgY2FzZSB3ZSBkb24ndCBoYXZlIGV2ZW50TmFtZSBidXQgd2UgaGF2ZSBuYW1lc3BhY2VcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBjdXJyZW50RXZlbnQgaW4gY3VycmVudEVsZW1lbnQuZXYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlQWxsTGlzdGVuZXJzKGN1cnJlbnRFbGVtZW50LCBuYW1lc3BhY2UsIGN1cnJlbnRFdmVudCwgcmVhbFNlbGVjdG9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IFxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGN1cnJlbnRFdmVudCBpbiBjdXJyZW50RWxlbWVudC5ldikge1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlQWxsTGlzdGVuZXJzKGN1cnJlbnRFbGVtZW50LCB1bmRlZmluZWQsIGN1cnJlbnRFdmVudCwgcmVhbFNlbGVjdG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IHJlbW92ZUFsbExpc3RlbmVycyA9IChjdXJyZW50RWxlbWVudCwgbmFtZXNwYWNlLCBjdXJyZW50RXZlbnQsIHJlYWxTZWxlY3RvcikgPT4ge1xyXG4gICAgbGV0IGhhbmRsZXJMaXN0ID0gZ2V0SGFuZGxlckxpc3QoY3VycmVudEVsZW1lbnQsIG5hbWVzcGFjZSwgY3VycmVudEV2ZW50LCByZWFsU2VsZWN0b3IpO1xyXG4gICAgaWYgKGhhbmRsZXJMaXN0KSB7XHJcbiAgICAgICAgZm9yIChsZXQgaGFuZGxlckluZGV4ID0gMDsgaGFuZGxlckluZGV4IDwgaGFuZGxlckxpc3QubGVuZ3RoOyBoYW5kbGVySW5kZXgrKykge1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50SGFuZGxlciA9IGhhbmRsZXJMaXN0W2hhbmRsZXJJbmRleF07XHJcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVyKGN1cnJlbnRFbGVtZW50LCBuYW1lc3BhY2UsIGN1cnJlbnRFdmVudCwgY3VycmVudEhhbmRsZXIsIHJlYWxTZWxlY3Rvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGlmIHRoZXJlIGlzIG5vIG5hbWVzcGFjZSwgd2UgbXVzdCB0byByZW1vdmUgYWxzbyBuYW1lc3BhY2VkIGV2ZW50aGFuZGxlcnNcclxuICAgIGlmICghbmFtZXNwYWNlICYmIGN1cnJlbnRFbGVtZW50LmV2ICYmIGN1cnJlbnRFbGVtZW50LmV2W2N1cnJlbnRFdmVudF0gJiYgY3VycmVudEVsZW1lbnQuZXZbY3VycmVudEV2ZW50XS5uZWwpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGN1cnJlbnROYW1lc3BhY2UgaW4gY3VycmVudEVsZW1lbnQuZXZbY3VycmVudEV2ZW50XS5uZWwpIHtcclxuICAgICAgICAgICAgcmVtb3ZlQWxsTGlzdGVuZXJzKGN1cnJlbnRFbGVtZW50LCBjdXJyZW50TmFtZXNwYWNlLCBjdXJyZW50RXZlbnQsIHJlYWxTZWxlY3Rvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGlmIHRoZXJlIGlzIG5vIGRlbGVnYXRlIHNlbGVjdG9yLCB3ZSBtdXN0IHRvIHJlbW92ZSBhbHNvIGRlbGVnYXRlZCBldmVudGhhbmRsZXJzXHJcbiAgICBpZiAoIXJlYWxTZWxlY3RvciAmJiBjdXJyZW50RWxlbWVudC5ldiAmJiBjdXJyZW50RWxlbWVudC5ldltjdXJyZW50RXZlbnRdICYmIGN1cnJlbnRFbGVtZW50LmV2W2N1cnJlbnRFdmVudF0uZGVsKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBjdXJyZW50UmVhbFNlbGVjdG9yIGluIGN1cnJlbnRFbGVtZW50LmV2W2N1cnJlbnRFdmVudF0uZGVsKSB7XHJcbiAgICAgICAgICAgIHJlbW92ZUFsbExpc3RlbmVycyhjdXJyZW50RWxlbWVudCwgbmFtZXNwYWNlLCBjdXJyZW50RXZlbnQsIGN1cnJlbnRSZWFsU2VsZWN0b3IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgcmVtb3ZlTGlzdGVuZXIgPSAoZWxlbWVudCwgbmFtZXNwYWNlLCBjdXJyZW50RXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRlU2VsZWN0b3IpID0+IHtcclxuICAgIGxldCByZWFsRXZlbnRTdHJ1Y3R1cmUgPSBnZXRSZWFsRXZlbnRTdHJ1Y3R1cmUoZWxlbWVudCwgbmFtZXNwYWNlLCBjdXJyZW50RXZlbnQpO1xyXG5cclxuICAgIGlmIChyZWFsRXZlbnRTdHJ1Y3R1cmUgJiYgaGFuZGxlcikge1xyXG4gICAgICAgIGlmICghZGVsZWdhdGVTZWxlY3Rvcil7XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmV2ICYmIHJlYWxFdmVudFN0cnVjdHVyZSAmJiByZWFsRXZlbnRTdHJ1Y3R1cmUuZWwpXHJcbiAgICAgICAgICAgIHJlYWxFdmVudFN0cnVjdHVyZS5lbCA9IHJlYWxFdmVudFN0cnVjdHVyZS5lbC5maWx0ZXIoZWwgPT4gZWwgIT0gaGFuZGxlcik7XHJcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihjdXJyZW50RXZlbnQsIGhhbmRsZXIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlbGVnYXRlSGFuZGxlciA9IGdldERlbGVnYXRlSGFuZGxlcihyZWFsRXZlbnRTdHJ1Y3R1cmUsIGhhbmRsZXIsIGRlbGVnYXRlU2VsZWN0b3IpO1xyXG4gICAgICAgICAgICBpZiAoZGVsZWdhdGVIYW5kbGVyKXtcclxuICAgICAgICAgICAgICAgIHJlYWxFdmVudFN0cnVjdHVyZS5kZWxbZGVsZWdhdGVTZWxlY3Rvcl0gPSByZWFsRXZlbnRTdHJ1Y3R1cmUuZGVsW2RlbGVnYXRlU2VsZWN0b3JdLmZpbHRlcihlbCA9PiBlbCAhPSBkZWxlZ2F0ZUhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGN1cnJlbnRFdmVudCwgZGVsZWdhdGVIYW5kbGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgZ2V0RGVsZWdhdGVIYW5kbGVyID0gKHJlYWxFdmVudFN0cnVjdHVyZSwgaGFuZGxlciwgZGVsZWdhdGVTZWxlY3RvcikgPT4ge1xyXG4gICAgbGV0IG91dGNvbWUgPSBudWxsO1xyXG5cclxuICAgIGlmIChyZWFsRXZlbnRTdHJ1Y3R1cmUgJiYgZGVsZWdhdGVTZWxlY3Rvcikge1xyXG4gICAgICAgIGlmIChyZWFsRXZlbnRTdHJ1Y3R1cmUuZGVsW2RlbGVnYXRlU2VsZWN0b3JdKXtcclxuICAgICAgICAgICAgb3V0Y29tZSA9IHJlYWxFdmVudFN0cnVjdHVyZS5kZWxbZGVsZWdhdGVTZWxlY3Rvcl0uZmluZCggZGggPT4gZGgucmVhbEhhbmRsZXIgPT09IGhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb3V0Y29tZTtcclxufTtcclxuXHJcbmNvbnN0IGdldEhhbmRsZXJMaXN0ID0gKGVsZW1lbnQsIG5hbWVzcGFjZSwgY3VycmVudEV2ZW50LCBkZWxlZ2F0ZVNlbGVjdG9yKSA9PiB7XHJcbiAgICBsZXQgb3V0Y29tZSA9IG51bGw7XHJcblxyXG4gICAgbGV0IHJlYWxFdmVudFN0cnVjdHVyZSA9IGdldFJlYWxFdmVudFN0cnVjdHVyZShlbGVtZW50LCBuYW1lc3BhY2UsIGN1cnJlbnRFdmVudCk7XHJcblxyXG4gICAgaWYgKHJlYWxFdmVudFN0cnVjdHVyZSkge1xyXG4gICAgICAgIGlmIChkZWxlZ2F0ZVNlbGVjdG9yICYmIHJlYWxFdmVudFN0cnVjdHVyZS5kZWxbZGVsZWdhdGVTZWxlY3Rvcl0pe1xyXG4gICAgICAgICAgICBvdXRjb21lID0gcmVhbEV2ZW50U3RydWN0dXJlLmRlbFtkZWxlZ2F0ZVNlbGVjdG9yXS5tYXAoIGNkZWwgPT4gY2RlbC5yZWFsSGFuZGxlciApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgb3V0Y29tZSA9IHJlYWxFdmVudFN0cnVjdHVyZS5lbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJldHVybiBvdXRjb21lO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0UmVhbEV2ZW50U3RydWN0dXJlID0gKGVsZW1lbnQsIG5hbWVzcGFjZSwgY3VycmVudEV2ZW50KSA9PiB7XHJcbiAgICBsZXQgb3V0Y29tZTtcclxuICAgIGlmIChlbGVtZW50ICYmIGVsZW1lbnQuZXYgJiYgY3VycmVudEV2ZW50ICYmIGVsZW1lbnQuZXZbY3VycmVudEV2ZW50XSkge1xyXG5cclxuICAgICAgICBpZiAobmFtZXNwYWNlICYmIGVsZW1lbnQuZXZbY3VycmVudEV2ZW50XS5uZWxbbmFtZXNwYWNlXSkge1xyXG4gICAgICAgICAgICBvdXRjb21lID0gZWxlbWVudC5ldltjdXJyZW50RXZlbnRdLm5lbFtuYW1lc3BhY2VdO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIW5hbWVzcGFjZSl7XHJcbiAgICAgICAgICAgIG91dGNvbWUgPSBlbGVtZW50LmV2W2N1cnJlbnRFdmVudF07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvdXRjb21lO1xyXG59XHJcblxyXG5leHBvcnQgeyBvZmYgfTsiLCJpbXBvcnQgeyBnZXRSZWFsRXZlbnRMaXN0LCBnZXROYW1lQW5kTmFtZXNwYWNlIH0gZnJvbSAnLi9jb21tb24ubW9kdWxlJztcclxuXHJcbmNvbnN0IG9uID0gKGNhbGxlciwgZXZlbnRzLCBzZWxlY3RvciwgZGF0YSwgaGFuZGxlcikgPT4ge1xyXG5cclxuICAgIC8vaWYgZXZlbnQgaXMgbnVsbCBvciBlbXB0eSwgZG9uJ3QgcnVuIGFueXRoaW5nXHJcbiAgICBpZiAoZXZlbnRzKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnRMaXN0LFxyXG4gICAgICAgIHJlYWxTZWxlY3RvcixcclxuICAgICAgICByZWFsRGF0YSxcclxuICAgICAgICByZWFsSGFuZGxlcixcclxuICAgICAgICBldmVudHNTcGxpdHRlZDtcclxuXHJcbiAgICAgICAgaWYgKHNlbGVjdG9yICYmICFkYXRhICYmICFoYW5kbGVyKSB7XHJcbiAgICAgICAgICAgIHJlYWxIYW5kbGVyID0gc2VsZWN0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHNlbGVjdG9yICYmIGRhdGEgJiYgIWhhbmRsZXIpIHtcclxuICAgICAgICAgICAgcmVhbFNlbGVjdG9yID0gc2VsZWN0b3I7XHJcbiAgICAgICAgICAgIHJlYWxIYW5kbGVyID0gZGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoc2VsZWN0b3IgJiYgZGF0YSAmJiBoYW5kbGVyKSB7XHJcbiAgICAgICAgICAgIHJlYWxTZWxlY3RvciA9IHNlbGVjdG9yO1xyXG4gICAgICAgICAgICByZWFsRGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIHJlYWxIYW5kbGVyID0gaGFuZGxlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV2ZW50c1NwbGl0dGVkID0gZXZlbnRzLnNwbGl0KCcgJyk7XHJcblxyXG4gICAgICAgIGVsZW1lbnRMaXN0ID0gZ2V0UmVhbEV2ZW50TGlzdChjYWxsZXIpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBlbGVtZW50SW5kZXggPSAwOyBlbGVtZW50SW5kZXggPCBlbGVtZW50TGlzdC5sZW5ndGg7IGVsZW1lbnRJbmRleCsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRFbGVtZW50ID0gZWxlbWVudExpc3RbZWxlbWVudEluZGV4XTtcclxuICAgIFxyXG4gICAgICAgICAgICAvL0NyZWF0ZSB0aGUgZGljdGlvbmFyeSB0byBuZXh0IG9mZiB0aGUgZXZlbnRzIHByb3Blcmx5XHJcbiAgICAgICAgICAgIGlmICghY3VycmVudEVsZW1lbnQuZXYpe1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEVsZW1lbnQuZXYgPSB7fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgICAgIGlmIChldmVudHNTcGxpdHRlZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZXZlbnRJbmRleCA9IDA7IGV2ZW50SW5kZXggPCBldmVudHNTcGxpdHRlZC5sZW5ndGg7IGV2ZW50SW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRFdmVudCA9IGV2ZW50c1NwbGl0dGVkW2V2ZW50SW5kZXhdO1xyXG4gICAgXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRFdmVudE5hbWUsIG5hbWVzcGFjZTtcclxuICAgICAgICAgICAgICAgICAgICBbY3VycmVudEV2ZW50TmFtZSwgbmFtZXNwYWNlXSA9IGdldE5hbWVBbmROYW1lc3BhY2UoY3VycmVudEV2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWN1cnJlbnRFbGVtZW50LmV2W2N1cnJlbnRFdmVudE5hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRFbGVtZW50LmV2W2N1cnJlbnRFdmVudE5hbWVdID0gY3JlYXRlRW1wdHlFdmVudFN0cnVjdHVyZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAgICAgICAgICAgICBhZGRMaXN0ZW5lcihjdXJyZW50RWxlbWVudCwgbmFtZXNwYWNlLCBjdXJyZW50RXZlbnROYW1lLCByZWFsSGFuZGxlciwgcmVhbFNlbGVjdG9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IGFkZExpc3RlbmVyID0gKGVsZW1lbnQsIG5hbWVzcGFjZSwgY3VycmVudEV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0ZVNlbGVjdG9yKSA9PiB7XHJcbiAgICBpZiAoZWxlbWVudCAmJiBjdXJyZW50RXZlbnQgJiYgaGFuZGxlcikge1xyXG5cclxuICAgICAgICBsZXQgcmVhbEV2ZW50U3RydWN0dXJlO1xyXG4gICAgICAgIGlmIChuYW1lc3BhY2UpIHtcclxuICAgICAgICAgICAgaWYgKCFlbGVtZW50LmV2W2N1cnJlbnRFdmVudF0ubmVsW25hbWVzcGFjZV0pIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuZXZbY3VycmVudEV2ZW50XS5uZWxbbmFtZXNwYWNlXSA9IGNyZWF0ZUVtcHR5RXZlbnRTdHJ1Y3R1cmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZWFsRXZlbnRTdHJ1Y3R1cmUgPSBlbGVtZW50LmV2W2N1cnJlbnRFdmVudF0ubmVsW25hbWVzcGFjZV07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVhbEV2ZW50U3RydWN0dXJlID0gZWxlbWVudC5ldltjdXJyZW50RXZlbnRdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFkZWxlZ2F0ZVNlbGVjdG9yKXtcclxuICAgICAgICAgICAgcmVhbEV2ZW50U3RydWN0dXJlLmVsLnB1c2goaGFuZGxlcik7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihjdXJyZW50RXZlbnQsIGhhbmRsZXIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlbGVnYXRlSGFuZGxlciA9IGNyZWF0ZURlbGVnYXRlSGFuZGxlcihlbGVtZW50LCBoYW5kbGVyLCBkZWxlZ2F0ZVNlbGVjdG9yKTtcclxuICAgICAgICAgICAgaWYgKCFyZWFsRXZlbnRTdHJ1Y3R1cmUuZGVsW2RlbGVnYXRlU2VsZWN0b3JdKXtcclxuICAgICAgICAgICAgICAgIHJlYWxFdmVudFN0cnVjdHVyZS5kZWxbZGVsZWdhdGVTZWxlY3Rvcl0gPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZWFsRXZlbnRTdHJ1Y3R1cmUuZGVsW2RlbGVnYXRlU2VsZWN0b3JdLnB1c2goZGVsZWdhdGVIYW5kbGVyKTtcclxuICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGN1cnJlbnRFdmVudCwgZGVsZWdhdGVIYW5kbGVyLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgY3JlYXRlRGVsZWdhdGVIYW5kbGVyID0gKGVsZW1lbnQsIGhhbmRsZXIsIGRlbGVnYXRlU2VsZWN0b3IpID0+IHtcclxuICAgIGxldCBvdXRjb21lID0gbnVsbDtcclxuXHJcbiAgICBpZiAoaGFuZGxlciAmJiBkZWxlZ2F0ZVNlbGVjdG9yKXtcclxuICAgICAgICBvdXRjb21lID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAvLyBsb29wIHBhcmVudCBub2RlcyBmcm9tIHRoZSB0YXJnZXQgdG8gdGhlIGRlbGVnYXRpb24gbm9kZVxyXG4gICAgICAgICAgICBmb3IgKGxldCB0YXJnZXQgPSBlLnRhcmdldDsgdGFyZ2V0ICYmIHRhcmdldCAhPSBlbGVtZW50OyB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldC5tYXRjaGVzKGRlbGVnYXRlU2VsZWN0b3IpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlci5jYWxsKHRhcmdldCwgZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBvdXRjb21lLnJlYWxIYW5kbGVyID0gaGFuZGxlcjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb3V0Y29tZTtcclxufTtcclxuXHJcbmNvbnN0IGNyZWF0ZUVtcHR5RXZlbnRTdHJ1Y3R1cmUgPSAod2l0aE5hbWVzcGFjZWRFdmVudHMpID0+IHtcclxuICAgIGxldCBvdXRjb21lID0ge1xyXG4gICAgICAgIGVsOiBbXSwgLy9uby1uYW1lc3BhY2VkIGV2ZW50TGlzdGVuZXJzXHJcbiAgICAgICAgZGVsOiB7fSAvL2RlbGVnYXRlIGV2ZW50TGlzdGVuZXJzXHJcbiAgICB9O1xyXG5cclxuICAgIGlmICh3aXRoTmFtZXNwYWNlZEV2ZW50cykge1xyXG4gICAgICAgIG91dGNvbWUubmVsID0ge307IC8vbmFtZXNwYWNlZCBldmVudExpc3RlbmVyc1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvdXRjb21lO1xyXG59O1xyXG5cclxuZXhwb3J0IHsgb24gfTsiLCJpbXBvcnQgeyBvbiB9IGZyb20gJy4vb24ubW9kdWxlJztcclxuaW1wb3J0IHsgb2ZmIH0gZnJvbSAnLi9vZmYubW9kdWxlJztcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIG9uOiBvbixcclxuICAgIG9mZjogb2ZmLFxyXG59OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHRsb2FkZWQ6IGZhbHNlLFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcblx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmhtZCA9IChtb2R1bGUpID0+IHtcblx0bW9kdWxlID0gT2JqZWN0LmNyZWF0ZShtb2R1bGUpO1xuXHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsICdleHBvcnRzJywge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0c2V0OiAoKSA9PiB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0VTIE1vZHVsZXMgbWF5IG5vdCBhc3NpZ24gbW9kdWxlLmV4cG9ydHMgb3IgZXhwb3J0cy4qLCBVc2UgRVNNIGV4cG9ydCBzeW50YXgsIGluc3RlYWQ6ICcgKyBtb2R1bGUuaWQpO1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiBtb2R1bGU7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGVcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvb25fb2ZmLm1vZHVsZS5qc1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=