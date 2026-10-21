const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { loadMethods, storeMerge } = require('./load');

// PS-2345: Save & Close runs prepareToSaveData() with no arguments and is the
// only save that removes the previous markers data source. Image saves run
// prepareToSaveData(true, true) and must not delete anything.
// The API merges each Fliplet.Widget.save payload into the stored settings
// (see storeMerge), so the tests check the stored result.

function wait() {
  return new Promise((resolve) => {
    setTimeout(resolve, 5);
  });
}

/**
 * The prepareToSaveData and saveData methods from interface.js with stubbed
 * Fliplet globals and a Vue `this` holding one valid map
 * @param {Object} options - deleteResult: returns the delete promise; handled: Fliplet.Error.isHandled result;
 *   settings: the starting settings
 * @returns {Object} The Vue `this`, the recorded calls and a copy of the starting (stored) settings
 */
function setup(options) {
  options = options || {};

  const calls = [];
  const fliplet = {
    DataSources: {
      delete: (id) => {
        calls.push(['delete', id]);

        return options.deleteResult ? options.deleteResult() : Promise.resolve();
      }
    },
    Widget: {
      save: (settings) => {
        calls.push(['save', JSON.parse(JSON.stringify(settings))]);

        return Promise.resolve();
      },
      complete: () => {
        calls.push(['complete']);
      }
    },
    Studio: {
      emit: (name, data) => {
        calls.push(['emit', name, data]);
      }
    },
    Error: {
      isHandled: () => !!options.handled
    },
    Modal: {
      alert: () => {}
    },
    parseError: (err) => `parsed ${err.status}`
  };
  const vm = loadMethods({ Fliplet: fliplet, widgetId: 1 }, [
    'prepareToSaveData(stopComplete, imageSaved) {',
    'saveData(stopComplete, imageSaved) {',
    'onAddMarkersSettingChanged(addMarkersData) {'
  ]);

  vm.hasError = false;
  vm.hasErrorOnSave = false;
  vm.maps = [{ name: 'Map 1', image: { url: 'map.png' } }];
  vm.markers = [{ name: 'Marker 1' }];
  vm.settings = options.settings || {
    markersDataSourceId: 10,
    dataSourceToDelete: 5,
    markerMapColumn: 'Map name',
    markerNameColumn: 'Name',
    markerTypeColumn: 'Marker style',
    markerXPositionColumn: 'Position X',
    markerYPositionColumn: 'Position Y'
  };

  return { vm, calls, stored: JSON.parse(JSON.stringify(vm.settings)) };
}

/**
 * The stored settings after every recorded Fliplet.Widget.save
 * @param {Object} stored - The stored settings before the saves
 * @param {Array} calls - The recorded calls
 * @returns {Object} The stored settings
 */
function storedAfter(stored, calls) {
  return calls
    .filter((call) => call[0] === 'save')
    .reduce((result, call) => storeMerge(result, call[1]), stored);
}

function names(calls) {
  return calls.map((call) => call[0] === 'emit' ? `emit:${call[1]}` : call[0]);
}

describe('prepareToSaveData', () => {
  it('Save & Close deletes the old data source before saving and saves without the field', async() => {
    const { vm, calls, stored } = setup();

    assert.equal(stored.dataSourceToDelete, 5);

    vm.prepareToSaveData();
    await wait();

    assert.deepEqual(names(calls), ['delete', 'save', 'complete', 'emit:reload-widget-instance']);
    assert.equal(calls[0][1], 5);
    assert.equal('dataSourceToDelete' in storedAfter(stored, calls), false);
    assert.equal(vm.hasErrorOnSave, false);
  });

  it('Save & Close after reopening the stored settings does not delete again', async() => {
    const first = setup();

    first.vm.prepareToSaveData();
    await wait();

    const reopened = setup({ settings: storedAfter(first.stored, first.calls) });

    reopened.vm.prepareToSaveData();
    await wait();

    assert.deepEqual(names(reopened.calls), ['save', 'complete', 'emit:reload-widget-instance']);
    assert.equal('dataSourceToDelete' in storedAfter(reopened.stored, reopened.calls), false);
  });

  it('Save & Close saves and closes when the old data source is already gone (404)', async() => {
    const { vm, calls, stored } = setup({ deleteResult: () => Promise.reject({ status: 404 }) });

    vm.prepareToSaveData();
    await wait();

    assert.deepEqual(names(calls), ['delete', 'save', 'complete', 'emit:reload-widget-instance']);
    assert.equal('dataSourceToDelete' in storedAfter(stored, calls), false);
    assert.equal(vm.hasErrorOnSave, false);
  });

  it('Save & Close does not save and shows the error when the delete fails (500)', async() => {
    const { vm, calls, stored } = setup({ deleteResult: () => Promise.reject({ status: 500 }) });

    vm.prepareToSaveData();
    await wait();

    assert.deepEqual(names(calls), ['delete']);
    assert.equal(vm.hasErrorOnSave.message, 'Couldn\'t save and close because the previous data source couldn\'t be removed: parsed 500');
    assert.equal(vm.settings.dataSourceToDelete, 5);
    assert.equal(storedAfter(stored, calls).dataSourceToDelete, 5);
  });

  it('Save & Close does not save and shows no extra message for a handled error', async() => {
    const { vm, calls, stored } = setup({ deleteResult: () => Promise.reject({ status: 500 }), handled: true });

    vm.prepareToSaveData();
    await wait();

    assert.deepEqual(names(calls), ['delete']);
    assert.equal(vm.hasErrorOnSave, false);
    assert.equal(vm.settings.dataSourceToDelete, 5);
    assert.equal(storedAfter(stored, calls).dataSourceToDelete, 5);
  });

  it('Save & Close with Mark map(s) open deletes the switched data source once and saves without the field', async() => {
    const { vm, calls, stored } = setup();

    // Mark map(s) is open: add-markers emits its fields first (a settings
    // save), then Save & Close runs
    vm.onAddMarkersSettingChanged({
      dataSourceToDelete: 5,
      markersDataSourceId: 20,
      markerMapColumn: 'Map name',
      markerNameColumn: 'Name',
      markerTypeColumn: 'Marker style',
      markerXPositionColumn: 'Position X',
      markerYPositionColumn: 'Position Y'
    });
    vm.prepareToSaveData();
    await wait();

    const deletes = calls.filter((call) => call[0] === 'delete');
    const saves = calls.filter((call) => call[0] === 'save');
    const lastSave = saves[saves.length - 1][1];

    assert.deepEqual(deletes, [['delete', 5]]);
    assert.equal('dataSourceToDelete' in storedAfter(stored, calls), false);
    assert.equal(lastSave.markersDataSourceId, 20);
    assert.equal(calls.filter((call) => call[0] === 'complete').length, 1);
    assert.equal(vm.hasErrorOnSave, false);
  });

  it('image save does not delete and still saves and reloads', async() => {
    const { vm, calls } = setup();

    vm.prepareToSaveData(true, true);
    await wait();

    assert.deepEqual(names(calls), ['save', 'emit:reload-widget-instance']);
    assert.equal(calls[0][1].dataSourceToDelete, 5);
  });

  it('settings save does not delete and still saves', async() => {
    const { vm, calls } = setup();

    vm.prepareToSaveData(true);
    await wait();

    assert.deepEqual(names(calls), ['save']);
  });
});
