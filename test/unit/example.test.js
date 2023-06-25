import { jest } from '@jest/globals';
import { greet } from './fixtures/greet.js';
import { getTimeOfDay } from './fixtures/get-time-of-day.js';
import * as getTimeOfDayModule from './fixtures/get-time-of-day.js';

// Suite
// -----------------------------------------------------------------------------
describe(`Example Tests`, function () {
  // Tests
  // ---------------------------------------------------------------------------
  describe('Jest & JSDOM basics', function () {
    test('dom manipulation (jsdom)', () => {
      const testText = 'This is a test';
      const testHTML = `<h1>Test</h1><p>${testText}</p>`;

      // Inject HTML
      document.body.innerHTML = testHTML;

      // Add class to <body> element and verify
      document.body.classList.add('foo');

      // Test HTML
      expect(document.body.getAttribute('class')).toBe('foo');
      expect(document.body.textContent).toMatch(/Test/);
      expect(document.querySelectorAll('p')).toHaveLength(1);
      expect(document.querySelector('p').textContent).toBe(testText);
      expect(document.querySelector('table')).toBeNull();
    });

    // Snapshot Testing
    // https://jestjs.io/docs/en/snapshot-testing
    test('snapshot (jsdom)', () => {
      const testText = 'This is a test';
      const testHTML = `<h1>Test</h1><p>${testText}</p>`;

      // Inject HTML
      document.body.innerHTML = testHTML;

      // Add class to <body> element and verify
      document.body.classList.add('foo');

      const documentHTML = document.documentElement.outerHTML;

      // Test snapshots
      expect(documentHTML).toMatchSnapshot(); // See __snapshots__
      expect(documentHTML).toMatchInlineSnapshot(
        `"<html><head></head><body class=\\"foo\\"><h1>Test</h1><p>This is a test</p></body></html>"`
      );
    });
  });

  // Test not working, but it is an example so no matter.
  // "TypeError: setSystemTime is not available when not using modern timers"
  describe('Fake Timers', function () {
    test.skip('data & time', () => {
      const fakeDate = new Date().setHours(1);

      jest.useFakeTimers('modern');
      jest.setSystemTime(fakeDate);

      const timeOfDay = getTimeOfDay();

      expect(timeOfDay).toBe('morning');
    });
  });

  describe('Mocks & Spys', function () {
    // TODO use jest.unstable_mockModule(), experimental support for mocking ES Modules, https://github.com/facebook/jest/issues/10025
    test.skip('mock import dependency using jest.fn()', async () => {
      const testModule = { ...(await import('./fixtures/get-time-of-day.js')) };
      const { greet: testGreet } = { ...(await import('./fixtures/greet.js')) };

      testModule.getTimeOfDay = jest.fn(() => 'day');

      const timeOfDay = testModule.getTimeOfDay();
      const greeting = testGreet('John');

      expect(timeOfDay).toBe('day');
      expect(greeting).toBe(`Good day, John!`);
    });

    // TODO use jest.unstable_mockModule(), experimental support for mocking ES Modules, https://github.com/facebook/jest/issues/10025
    test.skip('mock import dependency using jest.doMock()', async () => {
      const mockModulePath = './fixtures/get-time-of-day.js';

      jest.doMock(mockModulePath, () => ({
        __esModule: true,
        getTimeOfDay: jest.fn(() => 'night'),
      }));

      const mockGetTimeOfDay = (await import(mockModulePath)).getTimeOfDay;
      const { greet: testGreet } = await import('./fixtures/greet.js');

      const timeOfDay = mockGetTimeOfDay();
      const greeting = testGreet('John');

      expect(timeOfDay).toBe('night');
      expect(greeting).toBe(`Good night, John!`);
    });

    test('spy on native method using jest.spyOn()', () => {
      // Replace Math.random() implementation to return fixed value
      jest.spyOn(Math, 'random').mockImplementation(() => 0.1);

      expect(Math.random()).toBe(0.1);
      expect(Math.random()).toBe(0.1);
      expect(Math.random()).toBe(0.1);
    });

    // TODO use jest.unstable_mockModule(), experimental support for mocking ES Modules, https://github.com/facebook/jest/issues/10025
    test.skip('spy on import dependency using jest.spyOn()', () => {
      jest
        .spyOn(getTimeOfDayModule, 'getTimeOfDay')
        .mockImplementation(() => 'night');

      const timeOfDay = getTimeOfDay();
      const greeting = greet('John');

      expect(timeOfDay).toBe('night');
      expect(greeting).toBe(`Good night, John!`);
    });
  });

  describe('Verify Special Changes Test Case', function () {
    test('document.querySelector with id=pure number', () => {
      const testText = 'This is a test';
      const testHTML = `<div id=24><p>${testText}</p></div>`;

      // Inject HTML
      document.body.innerHTML = testHTML;
      expect(() => {
        document.querySelector('#24');
      }).toThrow(DOMException);

      expect(document.querySelector("[id='24']").textContent).toBe(testText);
    });
  });
});
