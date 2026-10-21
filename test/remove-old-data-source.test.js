const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { loadUtils, storeMerge } = require('./load');

// PS-2345: after the markers data source was switched, dataSourceToDelete
// stayed in the settings once the old data source was deleted. Every later
// Save & Close deleted it again, got a 404 and stopped the save.
// The API merges saved settings into the stored ones (see storeMerge), so the
// tests check the stored result, not only the in-memory settings.

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

  it('deletes the old data source once and clears the stored field', async() => {
    const stored = { markersDataSourceId: 10, dataSourceToDelete: 5 };
    const settings = Object.assign({}, stored);
    const del = deleteStub();

    await removeOldDataSource(settings, del);

    assert.deepEqual(del.calls, [5]);
    assert.equal('dataSourceToDelete' in storeMerge(stored, settings), false);
  });

  it('does not delete again on the next save', async() => {
    const settings = { markersDataSourceId: 10, dataSourceToDelete: 5 };
    const del = deleteStub();

    await removeOldDataSource(settings, del);
    await removeOldDataSource(settings, del);

    assert.deepEqual(del.calls, [5]);
  });

  it('does not delete again after the saved settings are reopened', async() => {
    const stored = { markersDataSourceId: 10, dataSourceToDelete: 5 };
    const settings = Object.assign({}, stored);
    const del = deleteStub();

    await removeOldDataSource(settings, del);

    const reopened = storeMerge(stored, settings);

    assert.equal('dataSourceToDelete' in reopened, false);

    await removeOldDataSource(reopened, del);

    assert.deepEqual(del.calls, [5]);
  });

  it('removing the key instead of setting null leaves the old ID stored', () => {
    // Guards against switching back to `delete settings.dataSourceToDelete`
    const stored = { markersDataSourceId: 10, dataSourceToDelete: 5 };
    const sent = Object.assign({}, stored);

    delete sent.dataSourceToDelete;

    assert.equal(storeMerge(stored, sent).dataSourceToDelete, 5);
    assert.equal('dataSourceToDelete' in storeMerge(stored, Object.assign({}, sent, { dataSourceToDelete: null })), false);
  });

  it('treats a 404 as already deleted and clears the stored field', async() => {
    const stored = { markersDataSourceId: 10, dataSourceToDelete: 5 };
    const settings = Object.assign({}, stored);
    const del = deleteStub(() => Promise.reject({ status: 404 }));

    await removeOldDataSource(settings, del);

    assert.deepEqual(del.calls, [5]);
    assert.equal('dataSourceToDelete' in storeMerge(stored, settings), false);
  });

  [401, 403, 500, 0].forEach((status) => {
    it(`rejects with the original error and keeps the field on status ${status}`, async() => {
      const stored = { markersDataSourceId: 10, dataSourceToDelete: 5 };
      const settings = Object.assign({}, stored);
      const error = { status: status };
      const del = deleteStub(() => Promise.reject(error));

      await assert.rejects(removeOldDataSource(settings, del), (err) => err === error);

      assert.deepEqual(del.calls, [5]);
      assert.equal(settings.dataSourceToDelete, 5);
      assert.equal(storeMerge(stored, settings).dataSourceToDelete, 5);
    });
  });

  it('never deletes the active markers data source', async() => {
    const stored = { markersDataSourceId: 10, dataSourceToDelete: 10 };
    const settings = Object.assign({}, stored);
    const del = deleteStub();

    await removeOldDataSource(settings, del);

    assert.deepEqual(del.calls, []);
    assert.equal('dataSourceToDelete' in storeMerge(stored, settings), false);
  });

  it('never deletes the active markers data source when one ID is a string', async() => {
    const stored = { markersDataSourceId: 10, dataSourceToDelete: '10' };
    const settings = Object.assign({}, stored);
    const del = deleteStub();

    await removeOldDataSource(settings, del);

    assert.deepEqual(del.calls, []);
    assert.equal('dataSourceToDelete' in storeMerge(stored, settings), false);
  });
});
