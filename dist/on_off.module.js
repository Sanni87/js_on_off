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

    elementList = (0,_common_module__WEBPACK_IMPORTED_MODULE_0__.getRealEventList)(this);

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

const removeAllListeners = function (currentElement, namespace, currentEvent, realSelector) {
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

const removeListener = function (element, namespace, currentEvent, handler, delegateSelector) {
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

const getDelegateHandler = function (realEventStructure, handler, delegateSelector) {
    let outcome = null;

    if (realEventStructure && delegateSelector) {
        if (realEventStructure.del[delegateSelector]){
            outcome = realEventStructure.del[delegateSelector].find( dh => dh.realHandler === handler);
        }
    }

    return outcome;
};

const getHandlerList = function (element, namespace, currentEvent, delegateSelector) {
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

const getRealEventStructure = function (element, namespace, currentEvent) {
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

        elementList = (0,_common_module__WEBPACK_IMPORTED_MODULE_0__.getRealEventList)(this);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qc19vbl9vZmYvLi9zcmMvY29tbW9uLm1vZHVsZS5qcyIsIndlYnBhY2s6Ly9qc19vbl9vZmYvLi9zcmMvb2ZmLm1vZHVsZS5qcyIsIndlYnBhY2s6Ly9qc19vbl9vZmYvLi9zcmMvb24ubW9kdWxlLmpzIiwid2VicGFjazovL2pzX29uX29mZi8uL3NyYy9vbl9vZmYubW9kdWxlLmpzIiwid2VicGFjazovL2pzX29uX29mZi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9qc19vbl9vZmYvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2pzX29uX29mZi93ZWJwYWNrL3J1bnRpbWUvaGFybW9ueSBtb2R1bGUgZGVjb3JhdG9yIiwid2VicGFjazovL2pzX29uX29mZi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2pzX29uX29mZi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2pzX29uX29mZi93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwrQkFBK0IseUJBQXlCO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMUJBLENBQXdFOztBQUV4RTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCLGdFQUFnQjs7QUFFbEMsOEJBQThCLG1DQUFtQztBQUNqRTs7QUFFQTs7QUFFQSxvQ0FBb0Msb0NBQW9DO0FBQ3hFOztBQUVBO0FBQ0EsZ0RBQWdELG1FQUFtQjs7QUFFbkU7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLHNCQUFzQjs7QUFFdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsbUNBQW1DO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEpBLENBQXdFOztBQUV4RTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsc0JBQXNCLGdFQUFnQjs7QUFFdEMsa0NBQWtDLG1DQUFtQztBQUNyRTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHdDQUF3QyxvQ0FBb0M7QUFDNUU7O0FBRUE7QUFDQSxvREFBb0QsbUVBQW1CO0FBQ3ZFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLDBCQUEwQjtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjs7QUFFQTtBQUNBLHlCQUF5QjtBQUN6Qjs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEhBLENBQWlDO0FBQ0U7OztBQUduQztBQUNBLFFBQVEsMENBQUU7QUFDVixTQUFTLDRDQUFHO0FBQ1osRTs7Ozs7O1VDUEE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N4QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxFQUFFO1dBQ0Y7V0FDQSxFOzs7OztXQ1ZBLHNGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoib25fb2ZmLm1vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGdldFJlYWxFdmVudExpc3QgPSBmdW5jdGlvbiAocGFyZW50RWxlbWVudCkge1xyXG4gICAgbGV0IHJlc3VsdCA9IG51bGw7XHJcblxyXG4gICAgLy9JbiB0aGlzIGNhc2Ugd2UgYXNzaWduIHRoZSBldmVudCB0byB0aGUgZWxlbWVudHMgaXRzZWxmc1xyXG4gICAgaWYgKHBhcmVudEVsZW1lbnQgPT09IGRvY3VtZW50IHx8IHBhcmVudEVsZW1lbnQgaW5zdGFuY2VvZiBFbGVtZW50KSB7XHJcbiAgICAgICAgcmVzdWx0ID0gW3BhcmVudEVsZW1lbnRdO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocGFyZW50RWxlbWVudCBpbnN0YW5jZW9mIEhUTUxDb2xsZWN0aW9uIHx8IHBhcmVudEVsZW1lbnQgaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xyXG4gICAgICAgIHJlc3VsdCA9IHBhcmVudEVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbmNvbnN0IGdldE5hbWVBbmROYW1lc3BhY2UgPSBmdW5jdGlvbiAobmFtZVdpdGhOYW1lc3BhY2UpIHtcclxuICAgIGNvbnN0IG91dGNvbWUgPSBbXTtcclxuICAgIGlmIChuYW1lV2l0aE5hbWVzcGFjZSkge1xyXG4gICAgICAgIGNvbnN0IHNwbGl0dGVkID0gbmFtZVdpdGhOYW1lc3BhY2Uuc3BsaXQoJy4nKTtcclxuICAgICAgICBpZiAoc3BsaXR0ZWQpe1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHNwbGl0dGVkLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgb3V0Y29tZS5wdXNoKHNwbGl0dGVkW2luZGV4XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3V0Y29tZTtcclxufTtcclxuXHJcbmV4cG9ydCB7IGdldFJlYWxFdmVudExpc3QsIGdldE5hbWVBbmROYW1lc3BhY2UgfTsiLCJpbXBvcnQgeyBnZXRSZWFsRXZlbnRMaXN0LCBnZXROYW1lQW5kTmFtZXNwYWNlIH0gZnJvbSAnLi9jb21tb24ubW9kdWxlJztcclxuXHJcbmNvbnN0IG9mZiA9IGZ1bmN0aW9uIChldmVudHMsIHNlbGVjdG9yLCBoYW5kbGVyKSB7XHJcblxyXG4gICAgbGV0IGVsZW1lbnRMaXN0LFxyXG4gICAgcmVhbFNlbGVjdG9yLFxyXG4gICAgZXZlbnRzU3BsaXR0ZWQsXHJcbiAgICByZWFsSGFuZGxlcjtcclxuXHJcbiAgICBpZiAoc2VsZWN0b3IgJiYgdHlwZW9mIHNlbGVjdG9yID09PSBcImZ1bmN0aW9uXCIpe1xyXG4gICAgICAgIHJlYWxIYW5kbGVyID0gc2VsZWN0b3I7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChzZWxlY3RvciAmJiAodHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJyB8fCBzZWxlY3RvciBpbnN0YW5jZW9mIFN0cmluZykgJiYgIWhhbmRsZXIpe1xyXG4gICAgICAgIHJlYWxTZWxlY3RvciA9IHNlbGVjdG9yO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoc2VsZWN0b3IgJiYgaGFuZGxlcikge1xyXG4gICAgICAgIHJlYWxTZWxlY3RvciA9IHNlbGVjdG9yO1xyXG4gICAgICAgIHJlYWxIYW5kbGVyID0gaGFuZGxlcjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZXZlbnRzKSB7XHJcbiAgICAgICAgZXZlbnRzU3BsaXR0ZWQgPSBldmVudHMuc3BsaXQoJyAnKTtcclxuICAgIH1cclxuXHJcbiAgICBlbGVtZW50TGlzdCA9IGdldFJlYWxFdmVudExpc3QodGhpcyk7XHJcblxyXG4gICAgZm9yIChsZXQgZWxlbWVudEluZGV4ID0gMDsgZWxlbWVudEluZGV4IDwgZWxlbWVudExpc3QubGVuZ3RoOyBlbGVtZW50SW5kZXgrKykge1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRFbGVtZW50ID0gZWxlbWVudExpc3RbZWxlbWVudEluZGV4XTtcclxuXHJcbiAgICAgICAgaWYgKGV2ZW50c1NwbGl0dGVkICYmIGV2ZW50c1NwbGl0dGVkLmxlbmd0aCA+IDApe1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgZXZlbnRJbmRleCA9IDA7IGV2ZW50SW5kZXggPCBldmVudHNTcGxpdHRlZC5sZW5ndGg7IGV2ZW50SW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudEV2ZW50ID0gZXZlbnRzU3BsaXR0ZWRbZXZlbnRJbmRleF07XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRFdmVudE5hbWUsIG5hbWVzcGFjZTtcclxuICAgICAgICAgICAgICAgIFtjdXJyZW50RXZlbnROYW1lLCBuYW1lc3BhY2VdID0gZ2V0TmFtZUFuZE5hbWVzcGFjZShjdXJyZW50RXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50RXZlbnROYW1lKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWFsSGFuZGxlcil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVyKGN1cnJlbnRFbGVtZW50LCBuYW1lc3BhY2UsIGN1cnJlbnRFdmVudE5hbWUsIHJlYWxIYW5kbGVyLCByZWFsU2VsZWN0b3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlQWxsTGlzdGVuZXJzKGN1cnJlbnRFbGVtZW50LCBuYW1lc3BhY2UsIGN1cnJlbnRFdmVudE5hbWUsIHJlYWxTZWxlY3Rvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChuYW1lc3BhY2UpIHsgLy8gaW4gdGhpcyBjYXNlIHdlIGRvbid0IGhhdmUgZXZlbnROYW1lIGJ1dCB3ZSBoYXZlIG5hbWVzcGFjZVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGN1cnJlbnRFdmVudCBpbiBjdXJyZW50RWxlbWVudC5ldikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVBbGxMaXN0ZW5lcnMoY3VycmVudEVsZW1lbnQsIG5hbWVzcGFjZSwgY3VycmVudEV2ZW50LCByZWFsU2VsZWN0b3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgY3VycmVudEV2ZW50IGluIGN1cnJlbnRFbGVtZW50LmV2KSB7XHJcbiAgICAgICAgICAgICAgICByZW1vdmVBbGxMaXN0ZW5lcnMoY3VycmVudEVsZW1lbnQsIHVuZGVmaW5lZCwgY3VycmVudEV2ZW50LCByZWFsU2VsZWN0b3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgcmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24gKGN1cnJlbnRFbGVtZW50LCBuYW1lc3BhY2UsIGN1cnJlbnRFdmVudCwgcmVhbFNlbGVjdG9yKSB7XHJcbiAgICBsZXQgaGFuZGxlckxpc3QgPSBnZXRIYW5kbGVyTGlzdChjdXJyZW50RWxlbWVudCwgbmFtZXNwYWNlLCBjdXJyZW50RXZlbnQsIHJlYWxTZWxlY3Rvcik7XHJcbiAgICBpZiAoaGFuZGxlckxpc3QpIHtcclxuICAgICAgICBmb3IgKGxldCBoYW5kbGVySW5kZXggPSAwOyBoYW5kbGVySW5kZXggPCBoYW5kbGVyTGlzdC5sZW5ndGg7IGhhbmRsZXJJbmRleCsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRIYW5kbGVyID0gaGFuZGxlckxpc3RbaGFuZGxlckluZGV4XTtcclxuICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXIoY3VycmVudEVsZW1lbnQsIG5hbWVzcGFjZSwgY3VycmVudEV2ZW50LCBjdXJyZW50SGFuZGxlciwgcmVhbFNlbGVjdG9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaWYgdGhlcmUgaXMgbm8gbmFtZXNwYWNlLCB3ZSBtdXN0IHRvIHJlbW92ZSBhbHNvIG5hbWVzcGFjZWQgZXZlbnRoYW5kbGVyc1xyXG4gICAgaWYgKCFuYW1lc3BhY2UgJiYgY3VycmVudEVsZW1lbnQuZXYgJiYgY3VycmVudEVsZW1lbnQuZXZbY3VycmVudEV2ZW50XSAmJiBjdXJyZW50RWxlbWVudC5ldltjdXJyZW50RXZlbnRdLm5lbCkge1xyXG4gICAgICAgIGZvciAoY29uc3QgY3VycmVudE5hbWVzcGFjZSBpbiBjdXJyZW50RWxlbWVudC5ldltjdXJyZW50RXZlbnRdLm5lbCkge1xyXG4gICAgICAgICAgICByZW1vdmVBbGxMaXN0ZW5lcnMoY3VycmVudEVsZW1lbnQsIGN1cnJlbnROYW1lc3BhY2UsIGN1cnJlbnRFdmVudCwgcmVhbFNlbGVjdG9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaWYgdGhlcmUgaXMgbm8gZGVsZWdhdGUgc2VsZWN0b3IsIHdlIG11c3QgdG8gcmVtb3ZlIGFsc28gZGVsZWdhdGVkIGV2ZW50aGFuZGxlcnNcclxuICAgIGlmICghcmVhbFNlbGVjdG9yICYmIGN1cnJlbnRFbGVtZW50LmV2ICYmIGN1cnJlbnRFbGVtZW50LmV2W2N1cnJlbnRFdmVudF0gJiYgY3VycmVudEVsZW1lbnQuZXZbY3VycmVudEV2ZW50XS5kZWwpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGN1cnJlbnRSZWFsU2VsZWN0b3IgaW4gY3VycmVudEVsZW1lbnQuZXZbY3VycmVudEV2ZW50XS5kZWwpIHtcclxuICAgICAgICAgICAgcmVtb3ZlQWxsTGlzdGVuZXJzKGN1cnJlbnRFbGVtZW50LCBuYW1lc3BhY2UsIGN1cnJlbnRFdmVudCwgY3VycmVudFJlYWxTZWxlY3Rvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCByZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIChlbGVtZW50LCBuYW1lc3BhY2UsIGN1cnJlbnRFdmVudCwgaGFuZGxlciwgZGVsZWdhdGVTZWxlY3Rvcikge1xyXG4gICAgbGV0IHJlYWxFdmVudFN0cnVjdHVyZSA9IGdldFJlYWxFdmVudFN0cnVjdHVyZShlbGVtZW50LCBuYW1lc3BhY2UsIGN1cnJlbnRFdmVudCk7XHJcblxyXG4gICAgaWYgKHJlYWxFdmVudFN0cnVjdHVyZSAmJiBoYW5kbGVyKSB7XHJcbiAgICAgICAgaWYgKCFkZWxlZ2F0ZVNlbGVjdG9yKXtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuZXYgJiYgcmVhbEV2ZW50U3RydWN0dXJlICYmIHJlYWxFdmVudFN0cnVjdHVyZS5lbClcclxuICAgICAgICAgICAgcmVhbEV2ZW50U3RydWN0dXJlLmVsID0gcmVhbEV2ZW50U3RydWN0dXJlLmVsLmZpbHRlcihlbCA9PiBlbCAhPSBoYW5kbGVyKTtcclxuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGN1cnJlbnRFdmVudCwgaGFuZGxlcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgZGVsZWdhdGVIYW5kbGVyID0gZ2V0RGVsZWdhdGVIYW5kbGVyKHJlYWxFdmVudFN0cnVjdHVyZSwgaGFuZGxlciwgZGVsZWdhdGVTZWxlY3Rvcik7XHJcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZUhhbmRsZXIpe1xyXG4gICAgICAgICAgICAgICAgcmVhbEV2ZW50U3RydWN0dXJlLmRlbFtkZWxlZ2F0ZVNlbGVjdG9yXSA9IHJlYWxFdmVudFN0cnVjdHVyZS5kZWxbZGVsZWdhdGVTZWxlY3Rvcl0uZmlsdGVyKGVsID0+IGVsICE9IGRlbGVnYXRlSGFuZGxlcik7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoY3VycmVudEV2ZW50LCBkZWxlZ2F0ZUhhbmRsZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBnZXREZWxlZ2F0ZUhhbmRsZXIgPSBmdW5jdGlvbiAocmVhbEV2ZW50U3RydWN0dXJlLCBoYW5kbGVyLCBkZWxlZ2F0ZVNlbGVjdG9yKSB7XHJcbiAgICBsZXQgb3V0Y29tZSA9IG51bGw7XHJcblxyXG4gICAgaWYgKHJlYWxFdmVudFN0cnVjdHVyZSAmJiBkZWxlZ2F0ZVNlbGVjdG9yKSB7XHJcbiAgICAgICAgaWYgKHJlYWxFdmVudFN0cnVjdHVyZS5kZWxbZGVsZWdhdGVTZWxlY3Rvcl0pe1xyXG4gICAgICAgICAgICBvdXRjb21lID0gcmVhbEV2ZW50U3RydWN0dXJlLmRlbFtkZWxlZ2F0ZVNlbGVjdG9yXS5maW5kKCBkaCA9PiBkaC5yZWFsSGFuZGxlciA9PT0gaGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvdXRjb21lO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0SGFuZGxlckxpc3QgPSBmdW5jdGlvbiAoZWxlbWVudCwgbmFtZXNwYWNlLCBjdXJyZW50RXZlbnQsIGRlbGVnYXRlU2VsZWN0b3IpIHtcclxuICAgIGxldCBvdXRjb21lID0gbnVsbDtcclxuXHJcbiAgICBsZXQgcmVhbEV2ZW50U3RydWN0dXJlID0gZ2V0UmVhbEV2ZW50U3RydWN0dXJlKGVsZW1lbnQsIG5hbWVzcGFjZSwgY3VycmVudEV2ZW50KTtcclxuXHJcbiAgICBpZiAocmVhbEV2ZW50U3RydWN0dXJlKSB7XHJcbiAgICAgICAgaWYgKGRlbGVnYXRlU2VsZWN0b3IgJiYgcmVhbEV2ZW50U3RydWN0dXJlLmRlbFtkZWxlZ2F0ZVNlbGVjdG9yXSl7XHJcbiAgICAgICAgICAgIG91dGNvbWUgPSByZWFsRXZlbnRTdHJ1Y3R1cmUuZGVsW2RlbGVnYXRlU2VsZWN0b3JdLm1hcCggY2RlbCA9PiBjZGVsLnJlYWxIYW5kbGVyICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBvdXRjb21lID0gcmVhbEV2ZW50U3RydWN0dXJlLmVsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgcmV0dXJuIG91dGNvbWU7XHJcbn07XHJcblxyXG5jb25zdCBnZXRSZWFsRXZlbnRTdHJ1Y3R1cmUgPSBmdW5jdGlvbiAoZWxlbWVudCwgbmFtZXNwYWNlLCBjdXJyZW50RXZlbnQpIHtcclxuICAgIGxldCBvdXRjb21lO1xyXG4gICAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudC5ldiAmJiBjdXJyZW50RXZlbnQgJiYgZWxlbWVudC5ldltjdXJyZW50RXZlbnRdKSB7XHJcblxyXG4gICAgICAgIGlmIChuYW1lc3BhY2UgJiYgZWxlbWVudC5ldltjdXJyZW50RXZlbnRdLm5lbFtuYW1lc3BhY2VdKSB7XHJcbiAgICAgICAgICAgIG91dGNvbWUgPSBlbGVtZW50LmV2W2N1cnJlbnRFdmVudF0ubmVsW25hbWVzcGFjZV07XHJcbiAgICAgICAgfSBlbHNlIGlmICghbmFtZXNwYWNlKXtcclxuICAgICAgICAgICAgb3V0Y29tZSA9IGVsZW1lbnQuZXZbY3VycmVudEV2ZW50XTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG91dGNvbWU7XHJcbn1cclxuXHJcbmV4cG9ydCB7IG9mZiB9OyIsImltcG9ydCB7IGdldFJlYWxFdmVudExpc3QsIGdldE5hbWVBbmROYW1lc3BhY2UgfSBmcm9tICcuL2NvbW1vbi5tb2R1bGUnO1xyXG5cclxuY29uc3Qgb24gPSBmdW5jdGlvbiAoZXZlbnRzLCBzZWxlY3RvciwgZGF0YSwgaGFuZGxlcikge1xyXG5cclxuICAgIC8vaWYgZXZlbnQgaXMgbnVsbCBvciBlbXB0eSwgZG9uJ3QgcnVuIGFueXRoaW5nXHJcbiAgICBpZiAoZXZlbnRzKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnRMaXN0LFxyXG4gICAgICAgIHJlYWxTZWxlY3RvcixcclxuICAgICAgICByZWFsRGF0YSxcclxuICAgICAgICByZWFsSGFuZGxlcixcclxuICAgICAgICBldmVudHNTcGxpdHRlZDtcclxuXHJcbiAgICAgICAgaWYgKHNlbGVjdG9yICYmICFkYXRhICYmICFoYW5kbGVyKSB7XHJcbiAgICAgICAgICAgIHJlYWxIYW5kbGVyID0gc2VsZWN0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHNlbGVjdG9yICYmIGRhdGEgJiYgIWhhbmRsZXIpIHtcclxuICAgICAgICAgICAgcmVhbFNlbGVjdG9yID0gc2VsZWN0b3I7XHJcbiAgICAgICAgICAgIHJlYWxIYW5kbGVyID0gZGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoc2VsZWN0b3IgJiYgZGF0YSAmJiBoYW5kbGVyKSB7XHJcbiAgICAgICAgICAgIHJlYWxTZWxlY3RvciA9IHNlbGVjdG9yO1xyXG4gICAgICAgICAgICByZWFsRGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIHJlYWxIYW5kbGVyID0gaGFuZGxlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV2ZW50c1NwbGl0dGVkID0gZXZlbnRzLnNwbGl0KCcgJyk7XHJcblxyXG4gICAgICAgIGVsZW1lbnRMaXN0ID0gZ2V0UmVhbEV2ZW50TGlzdCh0aGlzKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgZWxlbWVudEluZGV4ID0gMDsgZWxlbWVudEluZGV4IDwgZWxlbWVudExpc3QubGVuZ3RoOyBlbGVtZW50SW5kZXgrKykge1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50RWxlbWVudCA9IGVsZW1lbnRMaXN0W2VsZW1lbnRJbmRleF07XHJcbiAgICBcclxuICAgICAgICAgICAgLy9DcmVhdGUgdGhlIGRpY3Rpb25hcnkgdG8gbmV4dCBvZmYgdGhlIGV2ZW50cyBwcm9wZXJseVxyXG4gICAgICAgICAgICBpZiAoIWN1cnJlbnRFbGVtZW50LmV2KXtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRFbGVtZW50LmV2ID0ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgICAgICBpZiAoZXZlbnRzU3BsaXR0ZWQpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGV2ZW50SW5kZXggPSAwOyBldmVudEluZGV4IDwgZXZlbnRzU3BsaXR0ZWQubGVuZ3RoOyBldmVudEluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50RXZlbnQgPSBldmVudHNTcGxpdHRlZFtldmVudEluZGV4XTtcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjdXJyZW50RXZlbnROYW1lLCBuYW1lc3BhY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgW2N1cnJlbnRFdmVudE5hbWUsIG5hbWVzcGFjZV0gPSBnZXROYW1lQW5kTmFtZXNwYWNlKGN1cnJlbnRFdmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjdXJyZW50RWxlbWVudC5ldltjdXJyZW50RXZlbnROYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50RWxlbWVudC5ldltjdXJyZW50RXZlbnROYW1lXSA9IGNyZWF0ZUVtcHR5RXZlbnRTdHJ1Y3R1cmUodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgICAgICAgICAgICAgYWRkTGlzdGVuZXIoY3VycmVudEVsZW1lbnQsIG5hbWVzcGFjZSwgY3VycmVudEV2ZW50TmFtZSwgcmVhbEhhbmRsZXIsIHJlYWxTZWxlY3Rvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCBhZGRMaXN0ZW5lciA9IGZ1bmN0aW9uIChlbGVtZW50LCBuYW1lc3BhY2UsIGN1cnJlbnRFdmVudCwgaGFuZGxlciwgZGVsZWdhdGVTZWxlY3Rvcikge1xyXG4gICAgaWYgKGVsZW1lbnQgJiYgY3VycmVudEV2ZW50ICYmIGhhbmRsZXIpIHtcclxuXHJcbiAgICAgICAgbGV0IHJlYWxFdmVudFN0cnVjdHVyZTtcclxuICAgICAgICBpZiAobmFtZXNwYWNlKSB7XHJcbiAgICAgICAgICAgIGlmICghZWxlbWVudC5ldltjdXJyZW50RXZlbnRdLm5lbFtuYW1lc3BhY2VdKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmV2W2N1cnJlbnRFdmVudF0ubmVsW25hbWVzcGFjZV0gPSBjcmVhdGVFbXB0eUV2ZW50U3RydWN0dXJlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVhbEV2ZW50U3RydWN0dXJlID0gZWxlbWVudC5ldltjdXJyZW50RXZlbnRdLm5lbFtuYW1lc3BhY2VdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlYWxFdmVudFN0cnVjdHVyZSA9IGVsZW1lbnQuZXZbY3VycmVudEV2ZW50XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZGVsZWdhdGVTZWxlY3Rvcil7XHJcbiAgICAgICAgICAgIHJlYWxFdmVudFN0cnVjdHVyZS5lbC5wdXNoKGhhbmRsZXIpO1xyXG4gICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoY3VycmVudEV2ZW50LCBoYW5kbGVyKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBkZWxlZ2F0ZUhhbmRsZXIgPSBjcmVhdGVEZWxlZ2F0ZUhhbmRsZXIoaGFuZGxlciwgZGVsZWdhdGVTZWxlY3Rvcik7XHJcbiAgICAgICAgICAgIGlmICghcmVhbEV2ZW50U3RydWN0dXJlLmRlbFtkZWxlZ2F0ZVNlbGVjdG9yXSl7XHJcbiAgICAgICAgICAgICAgICByZWFsRXZlbnRTdHJ1Y3R1cmUuZGVsW2RlbGVnYXRlU2VsZWN0b3JdID0gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVhbEV2ZW50U3RydWN0dXJlLmRlbFtkZWxlZ2F0ZVNlbGVjdG9yXS5wdXNoKGRlbGVnYXRlSGFuZGxlcik7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihjdXJyZW50RXZlbnQsIGRlbGVnYXRlSGFuZGxlciwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IGNyZWF0ZURlbGVnYXRlSGFuZGxlciA9IGZ1bmN0aW9uIChoYW5kbGVyLCBkZWxlZ2F0ZVNlbGVjdG9yKSB7XHJcbiAgICBsZXQgb3V0Y29tZSA9IG51bGw7XHJcblxyXG4gICAgaWYgKGhhbmRsZXIgJiYgZGVsZWdhdGVTZWxlY3Rvcil7XHJcbiAgICAgICAgb3V0Y29tZSA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgLy8gbG9vcCBwYXJlbnQgbm9kZXMgZnJvbSB0aGUgdGFyZ2V0IHRvIHRoZSBkZWxlZ2F0aW9uIG5vZGVcclxuICAgICAgICAgICAgZm9yIChsZXQgdGFyZ2V0ID0gZS50YXJnZXQ7IHRhcmdldCAmJiB0YXJnZXQgIT0gdGhpczsgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQubWF0Y2hlcyhkZWxlZ2F0ZVNlbGVjdG9yKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIuY2FsbCh0YXJnZXQsIGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgb3V0Y29tZS5yZWFsSGFuZGxlciA9IGhhbmRsZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG91dGNvbWU7XHJcbn07XHJcblxyXG5jb25zdCBjcmVhdGVFbXB0eUV2ZW50U3RydWN0dXJlID0gZnVuY3Rpb24gKHdpdGhOYW1lc3BhY2VkRXZlbnRzKSB7XHJcbiAgICBsZXQgb3V0Y29tZSA9IHtcclxuICAgICAgICBlbDogW10sIC8vbm8tbmFtZXNwYWNlZCBldmVudExpc3RlbmVyc1xyXG4gICAgICAgIGRlbDoge30gLy9kZWxlZ2F0ZSBldmVudExpc3RlbmVyc1xyXG4gICAgfTtcclxuXHJcbiAgICBpZiAod2l0aE5hbWVzcGFjZWRFdmVudHMpIHtcclxuICAgICAgICBvdXRjb21lLm5lbCA9IHt9OyAvL25hbWVzcGFjZWQgZXZlbnRMaXN0ZW5lcnNcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb3V0Y29tZTtcclxufTtcclxuXHJcbmV4cG9ydCB7IG9uIH07IiwiaW1wb3J0IHsgb24gfSBmcm9tICcuL29uLm1vZHVsZSc7XHJcbmltcG9ydCB7IG9mZiB9IGZyb20gJy4vb2ZmLm1vZHVsZSc7XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBvbjogb24sXHJcbiAgICBvZmY6IG9mZixcclxufTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0bG9hZGVkOiBmYWxzZSxcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG5cdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5obWQgPSAobW9kdWxlKSA9PiB7XG5cdG1vZHVsZSA9IE9iamVjdC5jcmVhdGUobW9kdWxlKTtcblx0aWYgKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCAnZXhwb3J0cycsIHtcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdHNldDogKCkgPT4ge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFUyBNb2R1bGVzIG1heSBub3QgYXNzaWduIG1vZHVsZS5leHBvcnRzIG9yIGV4cG9ydHMuKiwgVXNlIEVTTSBleHBvcnQgc3ludGF4LCBpbnN0ZWFkOiAnICsgbW9kdWxlLmlkKTtcblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gbW9kdWxlO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL29uX29mZi5tb2R1bGUuanNcIik7XG4iXSwic291cmNlUm9vdCI6IiJ9