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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qc19vbl9vZmYvLi9zcmMvY29tbW9uLm1vZHVsZS5qcyIsIndlYnBhY2s6Ly9qc19vbl9vZmYvLi9zcmMvb2ZmLm1vZHVsZS5qcyIsIndlYnBhY2s6Ly9qc19vbl9vZmYvLi9zcmMvb24ubW9kdWxlLmpzIiwid2VicGFjazovL2pzX29uX29mZi8uL3NyYy9vbl9vZmYubW9kdWxlLmpzIiwid2VicGFjazovL2pzX29uX29mZi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9qc19vbl9vZmYvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2pzX29uX29mZi93ZWJwYWNrL3J1bnRpbWUvaGFybW9ueSBtb2R1bGUgZGVjb3JhdG9yIiwid2VicGFjazovL2pzX29uX29mZi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2pzX29uX29mZi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2pzX29uX29mZi93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwrQkFBK0IseUJBQXlCO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMUJBLENBQXdFOztBQUV4RTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCLGdFQUFnQjs7QUFFbEMsOEJBQThCLG1DQUFtQztBQUNqRTs7QUFFQTs7QUFFQSxvQ0FBb0Msb0NBQW9DO0FBQ3hFOztBQUVBO0FBQ0EsZ0RBQWdELG1FQUFtQjs7QUFFbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLG1DQUFtQztBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3pHQSxDQUF3RTs7QUFFeEU7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLHNCQUFzQixnRUFBZ0I7O0FBRXRDLGtDQUFrQyxtQ0FBbUM7QUFDckU7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3Q0FBd0Msb0NBQW9DO0FBQzVFOztBQUVBO0FBQ0Esb0RBQW9ELG1FQUFtQjtBQUN2RTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QywwQkFBMEI7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7O0FBRUE7QUFDQSx5QkFBeUI7QUFDekI7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hIQSxDQUFpQztBQUNFOzs7QUFHbkM7QUFDQSxRQUFRLDBDQUFFO0FBQ1YsU0FBUyw0Q0FBRztBQUNaLEU7Ozs7OztVQ1BBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDeEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRUFBRTtXQUNGO1dBQ0EsRTs7Ozs7V0NWQSxzRjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6Im9uX29mZi5tb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBnZXRSZWFsRXZlbnRMaXN0ID0gZnVuY3Rpb24gKHBhcmVudEVsZW1lbnQpIHtcclxuICAgIGxldCByZXN1bHQgPSBudWxsO1xyXG5cclxuICAgIC8vSW4gdGhpcyBjYXNlIHdlIGFzc2lnbiB0aGUgZXZlbnQgdG8gdGhlIGVsZW1lbnRzIGl0c2VsZnNcclxuICAgIGlmIChwYXJlbnRFbGVtZW50ID09PSBkb2N1bWVudCB8fCBwYXJlbnRFbGVtZW50IGluc3RhbmNlb2YgRWxlbWVudCkge1xyXG4gICAgICAgIHJlc3VsdCA9IFtwYXJlbnRFbGVtZW50XTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHBhcmVudEVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MQ29sbGVjdGlvbiB8fCBwYXJlbnRFbGVtZW50IGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcclxuICAgICAgICByZXN1bHQgPSBwYXJlbnRFbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG5jb25zdCBnZXROYW1lQW5kTmFtZXNwYWNlID0gZnVuY3Rpb24gKG5hbWVXaXRoTmFtZXNwYWNlKSB7XHJcbiAgICBjb25zdCBvdXRjb21lID0gW107XHJcbiAgICBpZiAobmFtZVdpdGhOYW1lc3BhY2UpIHtcclxuICAgICAgICBjb25zdCBzcGxpdHRlZCA9IG5hbWVXaXRoTmFtZXNwYWNlLnNwbGl0KCcuJyk7XHJcbiAgICAgICAgaWYgKHNwbGl0dGVkKXtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBzcGxpdHRlZC5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgIG91dGNvbWUucHVzaChzcGxpdHRlZFtpbmRleF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG91dGNvbWU7XHJcbn07XHJcblxyXG5leHBvcnQgeyBnZXRSZWFsRXZlbnRMaXN0LCBnZXROYW1lQW5kTmFtZXNwYWNlIH07IiwiaW1wb3J0IHsgZ2V0UmVhbEV2ZW50TGlzdCwgZ2V0TmFtZUFuZE5hbWVzcGFjZSB9IGZyb20gJy4vY29tbW9uLm1vZHVsZSc7XHJcblxyXG5jb25zdCBvZmYgPSBmdW5jdGlvbiAoZXZlbnRzLCBzZWxlY3RvciwgaGFuZGxlcikge1xyXG5cclxuICAgIGxldCBlbGVtZW50TGlzdCxcclxuICAgIHJlYWxTZWxlY3RvcixcclxuICAgIGV2ZW50c1NwbGl0dGVkLFxyXG4gICAgcmVhbEhhbmRsZXI7XHJcblxyXG4gICAgaWYgKHNlbGVjdG9yICYmIHR5cGVvZiBzZWxlY3RvciA9PT0gXCJmdW5jdGlvblwiKXtcclxuICAgICAgICByZWFsSGFuZGxlciA9IHNlbGVjdG9yO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoc2VsZWN0b3IgJiYgKHR5cGVvZiBzZWxlY3RvciA9PT0gJ3N0cmluZycgfHwgc2VsZWN0b3IgaW5zdGFuY2VvZiBTdHJpbmcpICYmICFoYW5kbGVyKXtcclxuICAgICAgICByZWFsU2VsZWN0b3IgPSBzZWxlY3RvcjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHNlbGVjdG9yICYmIGhhbmRsZXIpIHtcclxuICAgICAgICByZWFsU2VsZWN0b3IgPSBzZWxlY3RvcjtcclxuICAgICAgICByZWFsSGFuZGxlciA9IGhhbmRsZXI7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGV2ZW50cykge1xyXG4gICAgICAgIGV2ZW50c1NwbGl0dGVkID0gZXZlbnRzLnNwbGl0KCcgJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZWxlbWVudExpc3QgPSBnZXRSZWFsRXZlbnRMaXN0KHRoaXMpO1xyXG5cclxuICAgIGZvciAobGV0IGVsZW1lbnRJbmRleCA9IDA7IGVsZW1lbnRJbmRleCA8IGVsZW1lbnRMaXN0Lmxlbmd0aDsgZWxlbWVudEluZGV4KyspIHtcclxuICAgICAgICBjb25zdCBjdXJyZW50RWxlbWVudCA9IGVsZW1lbnRMaXN0W2VsZW1lbnRJbmRleF07XHJcblxyXG4gICAgICAgIGlmIChldmVudHNTcGxpdHRlZCAmJiBldmVudHNTcGxpdHRlZC5sZW5ndGggPiAwKXtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGV2ZW50SW5kZXggPSAwOyBldmVudEluZGV4IDwgZXZlbnRzU3BsaXR0ZWQubGVuZ3RoOyBldmVudEluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRFdmVudCA9IGV2ZW50c1NwbGl0dGVkW2V2ZW50SW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50RXZlbnROYW1lLCBuYW1lc3BhY2U7XHJcbiAgICAgICAgICAgICAgICBbY3VycmVudEV2ZW50TmFtZSwgbmFtZXNwYWNlXSA9IGdldE5hbWVBbmROYW1lc3BhY2UoY3VycmVudEV2ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVhbEhhbmRsZXIpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVyKGN1cnJlbnRFbGVtZW50LCBuYW1lc3BhY2UsIGN1cnJlbnRFdmVudE5hbWUsIHJlYWxIYW5kbGVyLCByZWFsU2VsZWN0b3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlQWxsTGlzdGVuZXJzKGN1cnJlbnRFbGVtZW50LCBuYW1lc3BhY2UsIGN1cnJlbnRFdmVudE5hbWUsIHJlYWxTZWxlY3Rvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IFxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGN1cnJlbnRFdmVudCBpbiBjdXJyZW50RWxlbWVudC5ldikge1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlQWxsTGlzdGVuZXJzKGN1cnJlbnRFbGVtZW50LCB1bmRlZmluZWQsIGN1cnJlbnRFdmVudCwgcmVhbFNlbGVjdG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IHJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uIChjdXJyZW50RWxlbWVudCwgbmFtZXNwYWNlLCBjdXJyZW50RXZlbnQsIHJlYWxTZWxlY3Rvcikge1xyXG4gICAgbGV0IGhhbmRsZXJMaXN0ID0gZ2V0SGFuZGxlckxpc3QoY3VycmVudEVsZW1lbnQsIG5hbWVzcGFjZSwgY3VycmVudEV2ZW50LCByZWFsU2VsZWN0b3IpO1xyXG4gICAgaWYgKGhhbmRsZXJMaXN0KSB7XHJcbiAgICAgICAgZm9yIChsZXQgaGFuZGxlckluZGV4ID0gMDsgaGFuZGxlckluZGV4IDwgaGFuZGxlckxpc3QubGVuZ3RoOyBoYW5kbGVySW5kZXgrKykge1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50SGFuZGxlciA9IGhhbmRsZXJMaXN0W2hhbmRsZXJJbmRleF07XHJcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVyKGN1cnJlbnRFbGVtZW50LCBuYW1lc3BhY2UsIGN1cnJlbnRFdmVudCwgY3VycmVudEhhbmRsZXIsIHJlYWxTZWxlY3Rvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCByZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIChlbGVtZW50LCBuYW1lc3BhY2UsIGN1cnJlbnRFdmVudCwgaGFuZGxlciwgZGVsZWdhdGVTZWxlY3Rvcikge1xyXG4gICAgaWYgKGVsZW1lbnQgJiYgY3VycmVudEV2ZW50ICYmIGhhbmRsZXIpe1xyXG4gICAgICAgIGlmICghZGVsZWdhdGVTZWxlY3Rvcil7XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmV2ICYmIGVsZW1lbnQuZXZbY3VycmVudEV2ZW50XSAmJiBlbGVtZW50LmV2W2N1cnJlbnRFdmVudF0uZWwpXHJcbiAgICAgICAgICAgIGVsZW1lbnQuZXZbY3VycmVudEV2ZW50XS5lbCA9IGVsZW1lbnQuZXZbY3VycmVudEV2ZW50XS5lbC5maWx0ZXIoZWwgPT4gZWwgIT0gaGFuZGxlcik7XHJcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihjdXJyZW50RXZlbnQsIGhhbmRsZXIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlbGVnYXRlSGFuZGxlciA9IGdldERlbGVnYXRlSGFuZGxlcihlbGVtZW50LCBuYW1lc3BhY2UsIGN1cnJlbnRFdmVudCwgaGFuZGxlciwgZGVsZWdhdGVTZWxlY3Rvcik7XHJcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZUhhbmRsZXIpe1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5ldltjdXJyZW50RXZlbnRdLmRlbFtkZWxlZ2F0ZVNlbGVjdG9yXSA9IGVsZW1lbnQuZXZbY3VycmVudEV2ZW50XS5kZWxbZGVsZWdhdGVTZWxlY3Rvcl0uZmlsdGVyKGVsID0+IGVsICE9IGRlbGVnYXRlSGFuZGxlcik7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoY3VycmVudEV2ZW50LCBkZWxlZ2F0ZUhhbmRsZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBnZXREZWxlZ2F0ZUhhbmRsZXIgPSBmdW5jdGlvbiAoZWxlbWVudCwgbmFtZXNwYWNlLCBjdXJyZW50RXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRlU2VsZWN0b3IpIHtcclxuICAgIGxldCBvdXRjb21lID0gbnVsbDtcclxuXHJcbiAgICBpZiAoZWxlbWVudCAmJiBjdXJyZW50RXZlbnQgJiYgaGFuZGxlciAmJiBkZWxlZ2F0ZVNlbGVjdG9yKSB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQuZXYgJiYgZWxlbWVudC5ldltjdXJyZW50RXZlbnRdICYmIGVsZW1lbnQuZXZbY3VycmVudEV2ZW50XS5kZWwgJiYgZWxlbWVudC5ldltjdXJyZW50RXZlbnRdLmRlbFtkZWxlZ2F0ZVNlbGVjdG9yXSl7XHJcbiAgICAgICAgICAgIG91dGNvbWUgPSBlbGVtZW50LmV2W2N1cnJlbnRFdmVudF0uZWwgPSBlbGVtZW50LmV2W2N1cnJlbnRFdmVudF0uZGVsW2RlbGVnYXRlU2VsZWN0b3JdLmZpbmQoIGRoID0+IGRoLnJlYWxIYW5kbGVyID09PSBoYW5kbGVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG91dGNvbWU7XHJcbn07XHJcblxyXG5jb25zdCBnZXRIYW5kbGVyTGlzdCA9IGZ1bmN0aW9uIChlbGVtZW50LCBuYW1lc3BhY2UsIGN1cnJlbnRFdmVudCwgZGVsZWdhdGVTZWxlY3Rvcikge1xyXG4gICAgbGV0IG91dGNvbWUgPSBudWxsO1xyXG5cclxuICAgIGlmIChlbGVtZW50ICYmIGVsZW1lbnQuZXYgJiYgY3VycmVudEV2ZW50KSB7XHJcbiAgICAgICAgY29uc3QgZXZlbnRMaXN0ZW5lcnNEYXRhID0gZWxlbWVudC5ldltjdXJyZW50RXZlbnRdO1xyXG4gICAgICAgIGlmIChkZWxlZ2F0ZVNlbGVjdG9yICYmIGV2ZW50TGlzdGVuZXJzRGF0YS5kZWxbZGVsZWdhdGVTZWxlY3Rvcl0pe1xyXG4gICAgICAgICAgICBvdXRjb21lID0gZXZlbnRMaXN0ZW5lcnNEYXRhLmRlbFtkZWxlZ2F0ZVNlbGVjdG9yXS5tYXAoIGNkZWwgPT4gY2RlbC5yZWFsSGFuZGxlciApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgb3V0Y29tZSA9IGV2ZW50TGlzdGVuZXJzRGF0YS5lbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG91dGNvbWU7XHJcbn07XHJcblxyXG5leHBvcnQgeyBvZmYgfTsiLCJpbXBvcnQgeyBnZXRSZWFsRXZlbnRMaXN0LCBnZXROYW1lQW5kTmFtZXNwYWNlIH0gZnJvbSAnLi9jb21tb24ubW9kdWxlJztcclxuXHJcbmNvbnN0IG9uID0gZnVuY3Rpb24gKGV2ZW50cywgc2VsZWN0b3IsIGRhdGEsIGhhbmRsZXIpIHtcclxuXHJcbiAgICAvL2lmIGV2ZW50IGlzIG51bGwgb3IgZW1wdHksIGRvbid0IHJ1biBhbnl0aGluZ1xyXG4gICAgaWYgKGV2ZW50cykge1xyXG4gICAgICAgIGxldCBlbGVtZW50TGlzdCxcclxuICAgICAgICByZWFsU2VsZWN0b3IsXHJcbiAgICAgICAgcmVhbERhdGEsXHJcbiAgICAgICAgcmVhbEhhbmRsZXIsXHJcbiAgICAgICAgZXZlbnRzU3BsaXR0ZWQ7XHJcblxyXG4gICAgICAgIGlmIChzZWxlY3RvciAmJiAhZGF0YSAmJiAhaGFuZGxlcikge1xyXG4gICAgICAgICAgICByZWFsSGFuZGxlciA9IHNlbGVjdG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChzZWxlY3RvciAmJiBkYXRhICYmICFoYW5kbGVyKSB7XHJcbiAgICAgICAgICAgIHJlYWxTZWxlY3RvciA9IHNlbGVjdG9yO1xyXG4gICAgICAgICAgICByZWFsSGFuZGxlciA9IGRhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHNlbGVjdG9yICYmIGRhdGEgJiYgaGFuZGxlcikge1xyXG4gICAgICAgICAgICByZWFsU2VsZWN0b3IgPSBzZWxlY3RvcjtcclxuICAgICAgICAgICAgcmVhbERhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICByZWFsSGFuZGxlciA9IGhhbmRsZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBldmVudHNTcGxpdHRlZCA9IGV2ZW50cy5zcGxpdCgnICcpO1xyXG5cclxuICAgICAgICBlbGVtZW50TGlzdCA9IGdldFJlYWxFdmVudExpc3QodGhpcyk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGVsZW1lbnRJbmRleCA9IDA7IGVsZW1lbnRJbmRleCA8IGVsZW1lbnRMaXN0Lmxlbmd0aDsgZWxlbWVudEluZGV4KyspIHtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudEVsZW1lbnQgPSBlbGVtZW50TGlzdFtlbGVtZW50SW5kZXhdO1xyXG4gICAgXHJcbiAgICAgICAgICAgIC8vQ3JlYXRlIHRoZSBkaWN0aW9uYXJ5IHRvIG5leHQgb2ZmIHRoZSBldmVudHMgcHJvcGVybHlcclxuICAgICAgICAgICAgaWYgKCFjdXJyZW50RWxlbWVudC5ldil7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50RWxlbWVudC5ldiA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAgICAgaWYgKGV2ZW50c1NwbGl0dGVkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBldmVudEluZGV4ID0gMDsgZXZlbnRJbmRleCA8IGV2ZW50c1NwbGl0dGVkLmxlbmd0aDsgZXZlbnRJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudEV2ZW50ID0gZXZlbnRzU3BsaXR0ZWRbZXZlbnRJbmRleF07XHJcbiAgICBcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY3VycmVudEV2ZW50TmFtZSwgbmFtZXNwYWNlO1xyXG4gICAgICAgICAgICAgICAgICAgIFtjdXJyZW50RXZlbnROYW1lLCBuYW1lc3BhY2VdID0gZ2V0TmFtZUFuZE5hbWVzcGFjZShjdXJyZW50RXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghY3VycmVudEVsZW1lbnQuZXZbY3VycmVudEV2ZW50TmFtZV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEVsZW1lbnQuZXZbY3VycmVudEV2ZW50TmFtZV0gPSBjcmVhdGVFbXB0eUV2ZW50U3RydWN0dXJlKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGFkZExpc3RlbmVyKGN1cnJlbnRFbGVtZW50LCBuYW1lc3BhY2UsIGN1cnJlbnRFdmVudE5hbWUsIHJlYWxIYW5kbGVyLCByZWFsU2VsZWN0b3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgYWRkTGlzdGVuZXIgPSBmdW5jdGlvbiAoZWxlbWVudCwgbmFtZXNwYWNlLCBjdXJyZW50RXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRlU2VsZWN0b3IpIHtcclxuICAgIGlmIChlbGVtZW50ICYmIGN1cnJlbnRFdmVudCAmJiBoYW5kbGVyKSB7XHJcblxyXG4gICAgICAgIGxldCByZWFsRXZlbnRTdHJ1Y3R1cmU7XHJcbiAgICAgICAgaWYgKG5hbWVzcGFjZSkge1xyXG4gICAgICAgICAgICBpZiAoIWVsZW1lbnQuZXZbY3VycmVudEV2ZW50XS5uZWxbbmFtZXNwYWNlXSkge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5ldltjdXJyZW50RXZlbnRdLm5lbFtuYW1lc3BhY2VdID0gY3JlYXRlRW1wdHlFdmVudFN0cnVjdHVyZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlYWxFdmVudFN0cnVjdHVyZSA9IGVsZW1lbnQuZXZbY3VycmVudEV2ZW50XS5uZWxbbmFtZXNwYWNlXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZWFsRXZlbnRTdHJ1Y3R1cmUgPSBlbGVtZW50LmV2W2N1cnJlbnRFdmVudF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWRlbGVnYXRlU2VsZWN0b3Ipe1xyXG4gICAgICAgICAgICByZWFsRXZlbnRTdHJ1Y3R1cmUuZWwucHVzaChoYW5kbGVyKTtcclxuICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGN1cnJlbnRFdmVudCwgaGFuZGxlcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgZGVsZWdhdGVIYW5kbGVyID0gY3JlYXRlRGVsZWdhdGVIYW5kbGVyKGhhbmRsZXIsIGRlbGVnYXRlU2VsZWN0b3IpO1xyXG4gICAgICAgICAgICBpZiAoIXJlYWxFdmVudFN0cnVjdHVyZS5kZWxbZGVsZWdhdGVTZWxlY3Rvcl0pe1xyXG4gICAgICAgICAgICAgICAgcmVhbEV2ZW50U3RydWN0dXJlLmRlbFtkZWxlZ2F0ZVNlbGVjdG9yXSA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlYWxFdmVudFN0cnVjdHVyZS5kZWxbZGVsZWdhdGVTZWxlY3Rvcl0ucHVzaChkZWxlZ2F0ZUhhbmRsZXIpO1xyXG4gICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoY3VycmVudEV2ZW50LCBkZWxlZ2F0ZUhhbmRsZXIsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCBjcmVhdGVEZWxlZ2F0ZUhhbmRsZXIgPSBmdW5jdGlvbiAoaGFuZGxlciwgZGVsZWdhdGVTZWxlY3Rvcikge1xyXG4gICAgbGV0IG91dGNvbWUgPSBudWxsO1xyXG5cclxuICAgIGlmIChoYW5kbGVyICYmIGRlbGVnYXRlU2VsZWN0b3Ipe1xyXG4gICAgICAgIG91dGNvbWUgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIC8vIGxvb3AgcGFyZW50IG5vZGVzIGZyb20gdGhlIHRhcmdldCB0byB0aGUgZGVsZWdhdGlvbiBub2RlXHJcbiAgICAgICAgICAgIGZvciAobGV0IHRhcmdldCA9IGUudGFyZ2V0OyB0YXJnZXQgJiYgdGFyZ2V0ICE9IHRoaXM7IHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0Lm1hdGNoZXMoZGVsZWdhdGVTZWxlY3RvcikpIHtcclxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyLmNhbGwodGFyZ2V0LCBlKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIG91dGNvbWUucmVhbEhhbmRsZXIgPSBoYW5kbGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvdXRjb21lO1xyXG59O1xyXG5cclxuY29uc3QgY3JlYXRlRW1wdHlFdmVudFN0cnVjdHVyZSA9IGZ1bmN0aW9uICh3aXRoTmFtZXNwYWNlZEV2ZW50cykge1xyXG4gICAgbGV0IG91dGNvbWUgPSB7XHJcbiAgICAgICAgZWw6IFtdLCAvL25vLW5hbWVzcGFjZWQgZXZlbnRMaXN0ZW5lcnNcclxuICAgICAgICBkZWw6IHt9IC8vZGVsZWdhdGUgZXZlbnRMaXN0ZW5lcnNcclxuICAgIH07XHJcblxyXG4gICAgaWYgKHdpdGhOYW1lc3BhY2VkRXZlbnRzKSB7XHJcbiAgICAgICAgb3V0Y29tZS5uZWwgPSB7fTsgLy9uYW1lc3BhY2VkIGV2ZW50TGlzdGVuZXJzXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG91dGNvbWU7XHJcbn07XHJcblxyXG5leHBvcnQgeyBvbiB9OyIsImltcG9ydCB7IG9uIH0gZnJvbSAnLi9vbi5tb2R1bGUnO1xyXG5pbXBvcnQgeyBvZmYgfSBmcm9tICcuL29mZi5tb2R1bGUnO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgb246IG9uLFxyXG4gICAgb2ZmOiBvZmYsXHJcbn07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdGxvYWRlZDogZmFsc2UsXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuXHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uaG1kID0gKG1vZHVsZSkgPT4ge1xuXHRtb2R1bGUgPSBPYmplY3QuY3JlYXRlKG1vZHVsZSk7XG5cdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgJ2V4cG9ydHMnLCB7XG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRzZXQ6ICgpID0+IHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignRVMgTW9kdWxlcyBtYXkgbm90IGFzc2lnbiBtb2R1bGUuZXhwb3J0cyBvciBleHBvcnRzLiosIFVzZSBFU00gZXhwb3J0IHN5bnRheCwgaW5zdGVhZDogJyArIG1vZHVsZS5pZCk7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIG1vZHVsZTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZVxuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9vbl9vZmYubW9kdWxlLmpzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==