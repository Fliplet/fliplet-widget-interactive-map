/**
 * Utility functions to replace lodash dependencies
 */

/**
 * Creates an object composed of the picked object properties
 * @param {Object} object - The source object
 * @param {Array|string} paths - The property paths to pick
 * @returns {Object} Returns the new object
 */
function pick(object, paths) {
  if (!object || typeof object !== 'object') return {};
  if (!paths) return {};

  const keys = Array.isArray(paths) ? paths : [paths];
  const result = {};

  keys.forEach(key => {
    if (typeof key === 'string' &&  key in object) {
      result[key] = object[key];
    }
  });

  return result;
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} Returns the new debounced function
 */
function debounce(func, wait) {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }

  const delay = Number(wait) || 0;
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
}

/**
 * Creates an array of the own enumerable property names of object
 * @param {Object} object - The object to query
 * @returns {Array} Returns the array of property names
 */
function keys(object) {
  if (!object || typeof object !== 'object') return [];

  return Object.keys(object);
}

/**
 * Iterates over elements of collection, returning the first element predicate returns truthy for
 * @param {Array|Object} collection - The collection to inspect
 * @param {Function|Object|string} predicate - The function invoked per iteration
 * @returns {*} Returns the matched element, else undefined
 */
function find(collection, predicate) {
  if (!collection) return undefined;
  if (!predicate) return undefined;

  const isFunction = typeof predicate === 'function';
  const isObject = typeof predicate === 'object' && predicate !== null;
  const isString = typeof predicate === 'string';

  if (Array.isArray(collection)) {
    return collection.find(item => {
      if (isFunction) {
        try {
          return predicate(item);
        } catch (e) {
          return false;
        }
      }

      if (isObject) return Object.keys(predicate).every(key => item && item[key] === predicate[key]);
      if (isString) return item && item[predicate];

      return false;
    });
  }

  return undefined;
}

/**
 * Iterates over elements of collection, returning an array of all elements predicate returns truthy for
 * @param {Array} collection - The collection to iterate over
 * @param {Function|Object|string} predicate - The function invoked per iteration
 * @returns {Array} Returns the new filtered array
 */
function filter(collection, predicate) {
  if (!Array.isArray(collection)) return [];
  if (!predicate) return [];

  const isFunction = typeof predicate === 'function';
  const isObject = typeof predicate === 'object' && predicate !== null;
  const isString = typeof predicate === 'string';

  return collection.filter(item => {
    if (isFunction) {
      try {
        return predicate(item);
      } catch (e) {
        return false;
      }
    }

    if (isObject) return Object.keys(predicate).every(key => item && item[key] === predicate[key]);
    if (isString) return item && item[predicate];

    return false;
  });
}

/**
 * Removes all elements from array that predicate returns truthy for
 * @param {Array} array - The array to modify
 * @param {Function|Object|string} predicate - The function invoked per iteration
 * @returns {Array} Returns an array of removed elements
 */
function remove(array, predicate) {
  if (!Array.isArray(array)) return [];
  if (!predicate) return [];

  const isFunction = typeof predicate === 'function';
  const isObject = typeof predicate === 'object' && predicate !== null;
  const isString = typeof predicate === 'string';

  const removed = [];

  for (let i = array.length - 1; i >= 0; i--) {
    const item = array[i];
    let shouldRemove = false;

    if (isFunction) {
      try {
        shouldRemove = predicate(item);
      } catch (e) {
        shouldRemove = false;
      }
    } else if (isObject) {
      shouldRemove = Object.keys(predicate).every(key => item && item[key] === predicate[key]);
    } else if (isString) {
      shouldRemove = item && item[predicate];
    }

    if (shouldRemove) {
      removed.unshift(array.splice(i, 1)[0]);
    }
  }

  return removed;
}

/**
 * This method is like find except that it returns the index of the first element predicate returns truthy for
 * @param {Array} array - The array to inspect
 * @param {Function|Object|string} predicate - The function invoked per iteration
 * @param {number} fromIndex - The index to search from
 * @returns {number} Returns the index of the found element, else -1
 */
function findIndex(array, predicate, fromIndex = 0) {
  if (!Array.isArray(array)) return -1;
  if (!predicate) return -1;

  const startIndex = Math.max(0, Math.floor(fromIndex) || 0);
  const isFunction = typeof predicate === 'function';
  const isObject = typeof predicate === 'object' && predicate !== null;
  const isString = typeof predicate === 'string';

  for (let i = startIndex; i < array.length; i++) {
    const item = array[i];

    if (isFunction) {
      try {
        if (predicate(item)) return i;
      } catch (e) {
        continue;
      }
    } else if (isObject && Object.keys(predicate).every(key => item && item[key] === predicate[key])) {
      return i;
    } else if (isString && item && item[predicate]) {
      return i;
    }
  }

  return -1;
}

/**
 * Checks if value is an empty object, collection, map, or set
 * @param {*} value - The value to check
 * @returns {boolean} Returns true if value is empty, else false
 */
function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (Array.isArray(value) || typeof value === 'string') return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;

  return false;
}

/**
 * Checks if path is a direct or inherited property of object
 * @param {Object} object - The object to query
 * @param {string} path - The path to check
 * @returns {boolean} Returns true if path exists, else false
 */
function hasIn(object, path) {
  if (!object || typeof object !== 'object') return false;
  if (!path || typeof path !== 'string') return false;

  const keys = path.split('.');
  let current = object;

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object' || !(key in current)) return false;
    current = current[key];
  }

  return true;
}

/**
 * Gets the value at path of object. If the resolved value is undefined, the defaultValue is returned in its place
 * @param {Object} object - The object to query
 * @param {string} path - The path of the property to get
 * @param {*} defaultValue - The value returned for undefined resolved values
 * @returns {*} Returns the resolved value
 */
function get(object, path, defaultValue) {
  if (!object || typeof object !== 'object') return defaultValue;
  if (!path || typeof path !== 'string') return defaultValue;

  const keys = path.split('.');
  let current = object;

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object' || !(key in current)) return defaultValue;
    current = current[key];
  }

  return current === undefined ? defaultValue : current;
}

/**
 * This method is like clone except that it recursively clones value
 * @param {*} value - The value to recursively clone
 * @returns {*} Returns the deep cloned value
 */
function cloneDeep(value) {
  if (value === null || typeof value !== 'object') return value;
  if (value instanceof Date) return new Date(value.getTime());
  if (value instanceof Array) return value.map(item => cloneDeep(item));

  if (typeof value === 'object') {
    const cloned = {};

    Object.keys(value).forEach(key => {
      cloned[key] = cloneDeep(value[key]);
    });

    return cloned;
  }

  return value;
}

/**
 * Checks if predicate returns truthy for any element of collection
 * @param {Array|Object} collection - The collection to iterate over
 * @param {Function|Object|string} predicate - The function invoked per iteration
 * @returns {boolean} Returns true if any element passes the predicate check, else false
 */
function some(collection, predicate) {
  if (!collection) return false;
  if (!predicate) return false;

  const isFunction = typeof predicate === 'function';
  const isObject = typeof predicate === 'object' && predicate !== null;
  const isString = typeof predicate === 'string';

  if (Array.isArray(collection)) {
    return collection.some(item => {
      if (isFunction) {
        try {
          return predicate(item);
        } catch (e) {
          return false;
        }
      }

      if (isObject) return Object.keys(predicate).every(key => item && item[key] === predicate[key]);
      if (isString) return item && item[predicate];

      return false;
    });
  }

  if (typeof collection === 'object') {
    return Object.values(collection).some(item => {
      if (isFunction) {
        try {
          return predicate(item);
        } catch (e) {
          return false;
        }
      }

      if (isObject) return Object.keys(predicate).every(key => item && item[key] === predicate[key]);
      if (isString) return item && item[predicate];

      return false;
    });
  }

  return false;
}

/**
 * Checks if value is undefined
 * @param {*} value - The value to check
 * @returns {boolean} Returns true if value is undefined, else false
 */
function isUndefined(value) {
  return value === undefined;
}

/**
 * Creates an array of array values not included in the other given arrays
 * @param {Array} array - The array to inspect
 * @param {...Array} values - The values to exclude
 * @returns {Array} Returns the new array of filtered values
 */
function difference(array, ...values) {
  if (!Array.isArray(array)) return [];
  if (!values.length) return array.slice();

  const excluded = values.flat().filter(val => val !== undefined && val !== null);

  return array.filter(item => !excluded.includes(item));
}

/**
 * This method is like uniq except that it accepts iteratee which is invoked for each element
 * @param {Array} array - The array to inspect
 * @param {Function|string} iteratee - The iteratee invoked per element
 * @returns {Array} Returns the new duplicate free array
 */
function uniqBy(array, iteratee) {
  if (!Array.isArray(array)) return [];
  if (!iteratee) return [...new Set(array)];

  const seen = new Set();
  const isFunction = typeof iteratee === 'function';
  const isString = typeof iteratee === 'string';

  return array.filter(item => {
    let key;

    if (isFunction) {
      try {
        key = iteratee(item);
      } catch (e) {
        key = item;
      }
    } else if (isString) {
      key = item && item[iteratee];
    } else {
      key = item;
    }

    if (seen.has(key)) return false;
    seen.add(key);

    return true;
  });
}

/**
 * This method is like assign except that it iterates over own and inherited source properties
 * @param {Object} object - The destination object
 * @param {...Object} sources - The source objects
 * @returns {Object} Returns object
 */
function assignIn(object, ...sources) {
  if (!object || typeof object !== 'object') return {};
  if (!sources.length) return object;

  sources.forEach(source => {
    if (source && typeof source === 'object') {
      Object.keys(source).forEach(key => {
        object[key] = source[key];
      });
    }
  });

  return object;
}

/**
 * Iterates over elements of collection and invokes iteratee for each element
 * @param {Array|Object} collection - The collection to iterate over
 * @param {Function} iteratee - The function invoked per iteration
 * @returns {undefined} Returns undefined
 */
function each(collection, iteratee) {
  if (!collection || typeof iteratee !== 'function') return;

  if (Array.isArray(collection)) {
    collection.forEach((item, index) => {
      try {
        iteratee(item, index, collection);
      } catch (e) {
        // Silently continue on error to match lodash behavior
      }
    });
  } else if (typeof collection === 'object') {
    Object.keys(collection).forEach(key => {
      try {
        iteratee(collection[key], key, collection);
      } catch (e) {
        // Silently continue on error to match lodash behavior
      }
    });
  }
}

// Export all utility functions
window.FlipletInteractiveMapUtils = {
  pick,
  debounce,
  keys,
  find,
  filter,
  remove,
  findIndex,
  isEmpty,
  hasIn,
  get,
  cloneDeep,
  some,
  isUndefined,
  difference,
  uniqBy,
  assignIn,
  each
};
