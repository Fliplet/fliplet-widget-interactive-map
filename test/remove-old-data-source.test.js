const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { loadUtils } = require('./load');

// PS-2345: after the markers data source was switched, dataSourceToDelete
// stayed in the settings once the old data source was deleted. Every later
// Save & Close deleted it again, got a 404 and stopped the save.

const { removeOldDataSource } = loadUtils().FlipletInteractiveMapUtils;

function deleteStub(result) {
  const calls = [];
  const fn = (id) => {
    calls.push(id);

    return result ? result(id) : Promise.resolve();
  };

  fn.calls = calls;

  return fn;
}

describe('removeOldDataSource', () => {
  it('does not delete anything when there is no dataSourceToDelete', async() => {
    const settings = { markersDataSourceId: 10 };
    const del = deleteStub();

    await removeOldDataSource(settings, del);

    assert.deepEqual(del.calls, []);
    assert.deepEqual(settings, { markersDataSourceId: 10 });
  });

  it('deletes the old data source once and clears the field', async() => {
    const settings = { markersDataSourceId: 10, dataSourceToDelete: 5 };
    const del = deleteStub();

    await removeOldDataSource(settings, del);

    assert.deepEqual(del.calls, [5]);
    assert.equal('dataSourceToDelete' in settings, false);
  });

  it('does not delete again on the next save', async() => {
    const settings = { markersDataSourceId: 10, dataSourceToDelete: 5 };
    const del = deleteStub();

    await removeOldDataSource(settings, del);
    await removeOldDataSource(settings, del);

    assert.deepEqual(del.calls, [5]);
  });

  it('does not delete again after the saved settings are reopened', async() => {
    const settings = { markersDataSourceId: 10, dataSourceToDelete: 5 };
    const del = deleteStub();

    await removeOldDataSource(settings, del);

    const reopened = JSON.parse(JSON.stringify(settings));

    assert.equal('dataSourceToDelete' in reopened, false);

    await removeOldDataSource(reopened, del);

    assert.deepEqual(del.calls, [5]);
  });

  it('treats a 404 as already deleted and clears the field', async() => {
    const settings = { markersDataSourceId: 10, dataSourceToDelete: 5 };
    const del = deleteStub(() => Promise.reject({ status: 404 }));

    await removeOldDataSource(settings, del);

    assert.deepEqual(del.calls, [5]);
    assert.equal('dataSourceToDelete' in settings, false);
  });

  [401, 403, 500, 0].forEach((status) => {
    it(`rejects with the original error and keeps the field on status ${status}`, async() => {
      const settings = { markersDataSourceId: 10, dataSourceToDelete: 5 };
      const error = { status: status };
      const del = deleteStub(() => Promise.reject(error));

      await assert.rejects(removeOldDataSource(settings, del), (err) => err === error);

      assert.deepEqual(del.calls, [5]);
      assert.equal(settings.dataSourceToDelete, 5);
    });
  });

  it('never deletes the active markers data source', async() => {
    const settings = { markersDataSourceId: 10, dataSourceToDelete: 10 };
    const del = deleteStub();

    await removeOldDataSource(settings, del);

    assert.deepEqual(del.calls, []);
    assert.equal('dataSourceToDelete' in settings, false);
  });

  it('never deletes the active markers data source when one ID is a string', async() => {
    const settings = { markersDataSourceId: 10, dataSourceToDelete: '10' };
    const del = deleteStub();

    await removeOldDataSource(settings, del);

    assert.deepEqual(del.calls, []);
    assert.equal('dataSourceToDelete' in settings, false);
  });
});
