const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { loadMethods } = require('./load');

// PS-2345: Save & Close runs prepareToSaveData() with no arguments and is the
// only save that removes the previous markers data source. Image saves run
// prepareToSaveData(true, true) and must not delete anything.

function wait() {
  return new Promise((resolve) => {
    setTimeout(resolve, 5);
  });
}

/**
 * The prepareToSaveData and saveData methods from interface.js with stubbed
 * Fliplet globals and a Vue `this` holding one valid map
 * @param {Object} options - deleteResult: returns the delete promise; handled: Fliplet.Error.isHandled result
 * @returns {Object} The Vue `this` and the recorded calls
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
    'saveData(stopComplete, imageSaved) {'
  ]);

  vm.hasError = false;
  vm.hasErrorOnSave = false;
  vm.maps = [{ name: 'Map 1', image: { url: 'map.png' } }];
  vm.markers = [{ name: 'Marker 1' }];
  vm.settings = {
    markersDataSourceId: 10,
    dataSourceToDelete: 5,
    markerMapColumn: 'Map name',
    markerNameColumn: 'Name',
    markerTypeColumn: 'Marker style',
    markerXPositionColumn: 'Position X',
    markerYPositionColumn: 'Position Y'
  };

  return { vm, calls };
}

function names(calls) {
  return calls.map((call) => call[0] === 'emit' ? `emit:${call[1]}` : call[0]);
}

describe('prepareToSaveData', () => {
  it('Save & Close deletes the old data source before saving and saves without the field', async() => {
    const { vm, calls } = setup();

    vm.prepareToSaveData();
    await wait();

    assert.deepEqual(names(calls), ['delete', 'save', 'complete', 'emit:reload-widget-instance']);
    assert.equal(calls[0][1], 5);
    assert.equal('dataSourceToDelete' in calls[1][1], false);
    assert.equal(vm.hasErrorOnSave, false);
  });

  it('Save & Close saves and closes when the old data source is already gone (404)', async() => {
    const { vm, calls } = setup({ deleteResult: () => Promise.reject({ status: 404 }) });

    vm.prepareToSaveData();
    await wait();

    assert.deepEqual(names(calls), ['delete', 'save', 'complete', 'emit:reload-widget-instance']);
    assert.equal('dataSourceToDelete' in calls[1][1], false);
    assert.equal(vm.hasErrorOnSave, false);
  });

  it('Save & Close does not save and shows the error when the delete fails (500)', async() => {
    const { vm, calls } = setup({ deleteResult: () => Promise.reject({ status: 500 }) });

    vm.prepareToSaveData();
    await wait();

    assert.deepEqual(names(calls), ['delete']);
    assert.match(vm.hasErrorOnSave.message, /previous data source couldn't be removed: parsed 500/);
    assert.equal(vm.settings.dataSourceToDelete, 5);
  });

  it('Save & Close does not save and shows no extra message for a handled error', async() => {
    const { vm, calls } = setup({ deleteResult: () => Promise.reject({ status: 500 }), handled: true });

    vm.prepareToSaveData();
    await wait();

    assert.deepEqual(names(calls), ['delete']);
    assert.equal(vm.hasErrorOnSave, false);
    assert.equal(vm.settings.dataSourceToDelete, 5);
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
