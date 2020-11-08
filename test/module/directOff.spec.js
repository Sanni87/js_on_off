import { initNewDom } from '../utils/dom';
import { on } from '../../src/on.module';
import { off } from '../../src/off.module';

QUnit.module('direct .off() after .on()', function() {
    QUnit.test('.off("click") works', function(assert) {
      initNewDom();
      const button = document.querySelector("#btn");
      const handler = () => {
          const result = document.querySelector("#result");
          const previous = parseInt(result.innerHTML);
          result.innerHTML = previous + 1;
      };
      const handler2 = () => {
          const result = document.querySelector("#result");
          const previous = parseInt(result.innerHTML);
          result.innerHTML = previous + 7;
      };
      on(button, 'click', handler);
      on(button, 'click', handler2);
      off(button, 'click');

      const result = document.querySelector("#result");
      button.click();
      assert.equal(result.innerHTML, '0', '1 click => result == 0');
      button.click();
      assert.equal(result.innerHTML, '0', '2 click => result == 0');
      button.click();
      assert.equal(result.innerHTML, '0', '3 click => result == 0');
    });

    QUnit.test('.off("click", handler) works', function(assert) {
      initNewDom();
      const button = document.querySelector("#btn");
      const handler = () => {
          const result = document.querySelector("#result");
          const previous = parseInt(result.innerHTML);
          result.innerHTML = previous + 1;
      };
      const handler2 = () => {
          const result = document.querySelector("#result");
          const previous = parseInt(result.innerHTML);
          result.innerHTML = previous + 7;
      };
      on(button, 'click', handler);
      on(button, 'click', handler2);
      off(button, 'click', handler2);
      
      const result = document.querySelector("#result");
      button.click();
      assert.equal(result.innerHTML, '1', '1 click => result == 1');
      button.click();
      assert.equal(result.innerHTML, '2', '2 click => result == 2');
      button.click();
      assert.equal(result.innerHTML, '3', '3 click => result == 3');
    });
  });