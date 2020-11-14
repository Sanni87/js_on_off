import { initNewDom, resetParent } from '../utils/dom';
import { on } from '../../src/on.module';
import { off } from '../../src/off.module';

QUnit.module('delegate .off()', function() {
    QUnit.test('.off("click", selector) works', function(assert) {
      initNewDom();

      const elementWithDelegate = document.querySelector("#toTest");
      on(elementWithDelegate, 'click', "#btn", function () {
          const result = document.querySelector("#result");
          const previous = parseInt(result.innerHTML);
          result.innerHTML = previous + 1;
      });

      off(elementWithDelegate, 'click', "#btn");

      const result = document.querySelector("#result");
      const button = document.querySelector("#btn");
      button.click();
      assert.equal(result.innerHTML, '0', '1 click => result == 0');
      button.click();
      assert.equal(result.innerHTML, '0', '2 click => result == 0');
      button.click();
      assert.equal(result.innerHTML, '0', '3 click => result == 0');
    });

    QUnit.test('.off("click", selector, function) works', function(assert) {
      initNewDom();

      const elementWithDelegate = document.querySelector("#toTest");
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

      on(elementWithDelegate, 'click', "#btn", handler);
      on(elementWithDelegate, 'click', "#btn", handler2);

      off(elementWithDelegate, 'click', "#btn", handler2);

      const result = document.querySelector("#result");
      const button = document.querySelector("#btn");
      button.click();
      assert.equal(result.innerHTML, '1', '1 click => result == 1');
      button.click();
      assert.equal(result.innerHTML, '2', '2 click => result == 2');
      button.click();
      assert.equal(result.innerHTML, '3', '3 click => result == 3');
    });

    QUnit.test('.off("click") removes delegate eventListeners', function(assert) {
      initNewDom();

      const elementWithDelegate = document.querySelector("#toTest");
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

      on(elementWithDelegate, 'click', "#btn", handler);
      on(elementWithDelegate, 'click', "#btn", handler2);

      off(elementWithDelegate, 'click');

      const result = document.querySelector("#result");
      const button = document.querySelector("#btn");
      button.click();
      assert.equal(result.innerHTML, '0', '1 click => result == 0');
      button.click();
      assert.equal(result.innerHTML, '0', '2 click => result == 0');
      button.click();
      assert.equal(result.innerHTML, '0', '3 click => result == 0');
    });
  });