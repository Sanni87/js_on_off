import { initNewDom, resetParent } from '../utils/dom';
import { on } from '../../src/on.module';
import { off } from '../../src/off.module';

QUnit.module('delegate .on()', function() {
    QUnit.test('.on("click", selector, function) works', function(assert) {
      initNewDom();

      const elementWithDelegate = document.querySelector("#toTest");
      on(elementWithDelegate, 'click', "#btn", function () {
          const result = document.querySelector("#result");
          const previous = parseInt(result.innerHTML);
          result.innerHTML = previous + 1;
      });
      
      const result = document.querySelector("#result");
      const button = document.querySelector("#btn");
      button.click();
      assert.equal(result.innerHTML, '1', '1 click => result == 1');
      button.click();
      assert.equal(result.innerHTML, '2', '2 click => result == 2');
      button.click();
      assert.equal(result.innerHTML, '3', '3 click => result == 3');
    });

    QUnit.test('.on("click", selector, function) works only if correct button is clicked', function(assert) {
      initNewDom();

      const elementWithDelegate = document.querySelector("#toTest");
      on(elementWithDelegate, 'click', "#btn", function () {
          const result = document.querySelector("#result");
          const previous = parseInt(result.innerHTML);
          result.innerHTML = previous + 1;
      });

      resetParent(document); //reemplazamos los botones para asegurarnos de que el evento sigue ligado
      const button = document.querySelector("#btn");
      const otherBtn = document.querySelector("#otherBtn");
      const result = document.querySelector("#result");

      button.click();
      assert.equal(result.innerHTML, '1', '1 click => result == 1');
      button.click();
      assert.equal(result.innerHTML, '2', '2 click => result == 2');
      button.click();
      assert.equal(result.innerHTML, '3', '3 click => result == 3');

      otherBtn.click();
      assert.equal(result.innerHTML, '3', '3 click => result == 3');
      otherBtn.click();
      assert.equal(result.innerHTML, '3', '3 click => result == 3');
      otherBtn.click();
      assert.equal(result.innerHTML, '3', '3 click => result == 3');
    });
  });