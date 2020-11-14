import { initNewDom } from '../utils/dom';
import { on } from '../../src/on.module';

QUnit.module('direct .on()');
QUnit.test('.on("click", function) works', function(assert) {
    initNewDom();
    const button = document.querySelector("#btn");
    const result = document.querySelector("#result");
    on(button, 'click', function () {
        const result = document.querySelector("#result");
        const previous = parseInt(result.innerHTML);
        result.innerHTML = previous + 1;
    })
    button.click();
    assert.equal(result.innerHTML, '1', '1 click => result == 1');
    button.click();
    assert.equal(result.innerHTML, '2', '2 click => result == 2');
    button.click();
    assert.equal(result.innerHTML, '3', '3 click => result == 3');
});