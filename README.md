
# js_on_off

js_on_off is a tiny js library (< 3kb) created to have jQuery on() and off() functions with no dependencies. Main features are included:

- JQuery syntax
- event delegation
- remove all event listeners with off
- Works with document, Element, HtmlElement, NodeList and HTMLCollection
- event namespacing
## Installation

Use the package manager [npm](https://pip.pypa.io/en/stable/) to install js_on_off.

```bash
npm install js_on_off --saveDev
```
Alternatively, you can just download this project from git.
Https:
```bash
https://github.com/Sanni87/js_on_off.git
```

Github CLI:
```bash
gh repo clone Sanni87/js_on_off
```

## Usage
Once downloaded, there are 2 ways to include this library in your project.

### Direct script
```html
<script src="node_modules/js_on_off/dist/on_off.min.js"></script>
``` 
You can do it from an html or of course you can reference the script to include on a custom bundle if you want it.

### Import module
If you are using tools like webpack, gulp and so on, you can also import the library as follows:
```javascript
import { on, off } from  'js_on_off';
```
## Examples
Depending on how the script is included, the syntax of the functions changes slightly. Of course, the functionality doesn't change.
### Examples with direct script
As we have said, first of all we must to include the script
```html
<script src="node_modules/js_on_off/dist/on_off.min.js"></script>
```
Then we can use on or off with direct binding:
```javascript
var button = document.querySelector("#btn");
var handler = function (event) {
    //do stuff
};

//direct binding with anonymous function
button.on('click', function (event) {
    //'event' is the same than .addEventListener() handler param
});

//direct binding with named function
button.on('click', handler); 

//direct unbinding
button.off('click', handler); //unbind just "handler" for click event on button
button.off('click'); //unbind all click events on button
button.off(); //unbind everything on button
```
Event delegation:
```html
<!--[...]-->
<div id="buttonParent">
   <button id="button">Click me</button>
</div>
<!--[...]-->
<script>
var parent = document.querySelector("#buttonParent");
var handler = function (event) {
    //do stuff
};

//delegate binding with anonymous function
//In this case click event is to parent, but handler will be executed when button is clicked
parent.on('click', '#button', function (event) {
    //'event' is the same than .addEventListener() handler param
});

//direct binding with named function
button.on('click', '#button', handler); 

//direct unbinding
parent.off('click', '#button', handler); //unbind just "handler" for click event on button
parent.off('click', '#button'); //unbind all click events on button
parent.off('click'); //unbind direct click events on parent and also every delegated binding attached to parent (in this case on '#button' click)
parent.off(); //unbind every event, direct or delegated, attached to parent
</script>
```
Namespacing:
```javascript
var button = document.querySelector("#btn");
var handler = function (event) {
    //do stuff
};

var handler2 = function (event) {
    //do stuff
};

var handler3 = function (event) {
    //do stuff
};

//bind with namespace
button.on('click.dontRemove', handler); 
button.on('click.removeThis', handler2); 
button.on('mouseup.removeThis', handler3)

//unbind with namespace
button.off('click.removeThis'); //unbind handler2
button.off('.removeThis'); //unbind handler2 and handler3
```
### Examples importing module
If we import the module in a js file, on and off functions will not be attached to NodeList, HtmlElement and so on, so the syntax is a bit different. Here are the same samples using import:
```javascript
import { on, off } from  'js_on_off';

var parent = document.querySelector("#buttonParent");
var button = document.querySelector("#btn");
var handler = function (event) {
    //do stuff
};

//binding
on(button, 'click', function (event) {
    //'event' is the same than .addEventListener() handler param
});
on(button, 'click', handler); 
on(button, 'click', '#button', handler);
on(button, 'click.removeThis', handler); 

//unbinding
off(parent, 'click', '#button', handler); //unbind just "handler" for click event on button
off(parent, 'click', '#button'); //unbind all click events on button
off(button, 'click', handler); //unbind just "handler" for click event on button
off(button, 'click'); //unbind all click events on button
off(button, 'click.removeThis'); //unbind attached 'click' events with 'removeThis' namespace on button
off(button, '.removeThis'); //unbind all events with removeThis namespace on button
off(button); //unbind everything on button

```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
