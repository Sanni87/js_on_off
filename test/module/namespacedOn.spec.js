import { initNewDom, triggerMouseEvent } from '../utils/dom';
import { on } from '../../src/on.module';
import { off } from '../../src/off.module';

QUnit.module('.on() with namespace works', function() {
    QUnit.test('direct .on() with event and namespace works', function(assert) {
      initNewDom();

      const button = document.querySelector("#btn");
      const handler = () => {
          const result = document.querySelector("#result");
          const previous = parseInt(result.innerHTML);
          result.innerHTML = previous + 1;
      };
      on(button, 'click.withNamespace', handler);

      //THEN
      const result = document.querySelector("#result");
      button.click();
      assert.equal(result.innerHTML, '1', '1 click => result == 1');
      button.click();
      assert.equal(result.innerHTML, '2', '2 click => result == 2');
      button.click();
      assert.equal(result.innerHTML, '3', '3 click => result == 3');
    });

    QUnit.test('direct .off() with event and namespace works', function(assert) {
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
      on(button, 'click.removeThis', handler2);

      off(button, 'click.removeThis');

      //THEN
      const result = document.querySelector("#result");
      button.click();
      assert.equal(result.innerHTML, '1', '1 click => result == 1');
      button.click();
      assert.equal(result.innerHTML, '2', '2 click => result == 2');
      button.click();
      assert.equal(result.innerHTML, '3', '3 click => result == 3');
    });

    QUnit.test('direct .off() with only namespace works', function(assert) {
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
      on(button, 'click.removeThis', handler2);
      on(button, 'mouseup.removeThis', handler2);

      off(button, '.removeThis');

      //THEN
      const result = document.querySelector("#result");
      triggerMouseEvent (document, button, "mouseup");
      button.click();
      assert.equal(result.innerHTML, '1', '1 click => result == 1');
      triggerMouseEvent (document, button, "mouseup");
      button.click();
      assert.equal(result.innerHTML, '2', '2 click => result == 2');
      triggerMouseEvent (document, button, "mouseup");
      button.click();
      assert.equal(result.innerHTML, '3', '3 click => result == 3');
    });

    QUnit.test('direct .off() with no params remove namespaced events', function(assert) {
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
      const handler3 = () => {
          const result = document.querySelector("#result");
          const previous = parseInt(result.innerHTML);
          result.innerHTML = previous + 7;
      };
      on(button, 'click.removeThis', handler3);
      on(button, 'click', handler2);
      on(button, 'mouseup.dontRemove', handler);
      
      off(button, 'click');

      //THEN
      const result = document.querySelector("#result");
      triggerMouseEvent(document, button, "mouseup");
      button.click();
      assert.equal(result.innerHTML, '1', '1 click => result == 1');
      triggerMouseEvent(document, button, "mouseup");
      button.click();
      assert.equal(result.innerHTML, '2', '2 click => result == 2');
      triggerMouseEvent(document, button, "mouseup");
      button.click();
      assert.equal(result.innerHTML, '3', '3 click => result == 3');
    });
  });