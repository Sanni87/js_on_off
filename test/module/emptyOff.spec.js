import { initNewDom, resetParent } from '../utils/dom';
import { on } from '../../src/on.module';
import { off } from '../../src/off.module';

QUnit.module('.off() with no params', function() {
    QUnit.test('.off() with no params works', function(assert) {
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

      //WHEN
      off(button);

      //THEN
      const result = document.querySelector("#result");
      button.click();
      assert.equal(result.innerHTML, '0', '1 click => result == 0');
      button.click();
      assert.equal(result.innerHTML, '0', '2 click => result == 0');
      button.click();
      assert.equal(result.innerHTML, '0', '3 click => result == 0');
    });
  });