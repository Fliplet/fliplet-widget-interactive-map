/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/libs/build.js":
/*!**************************!*\
  !*** ./js/libs/build.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);


Vue.filter('auth', function (value) {
  if (!Fliplet || !Fliplet.Media || typeof Fliplet.Media.authenticate !== 'function') {
    return value;
  }
  return Fliplet.Media.authenticate(value);
});
Fliplet.Widget.instance('interactive-map', function (widgetData) {
  var selector = "[data-interactive-map-id=\"".concat(widgetData.id, "\"]");
  Fliplet().then(function () {
    new Vue({
      el: $(selector)[0],
      i18n: Fliplet.Locale.plugins.vue(),
      data: function data() {
        return {
          containsData: !!(widgetData.maps && widgetData.maps.length),
          maps: widgetData.maps && widgetData.maps.length ? widgetData.maps : [],
          markerStyles: widgetData.markers && widgetData.markers.length ? widgetData.markers : [],
          markersDataSourceId: widgetData.markersDataSourceId || undefined,
          markerNameColumn: widgetData.markerNameColumn || undefined,
          markerMapColumn: widgetData.markerMapColumn || undefined,
          markerTypeColumn: widgetData.markerTypeColumn || undefined,
          markerXPositionColumn: widgetData.markerXPositionColumn || undefined,
          markerYPositionColumn: widgetData.markerYPositionColumn || undefined,
          markersData: undefined,
          mappedMarkerData: [],
          searchMarkerData: undefined,
          flPanZoomInstances: {},
          pzElement: undefined,
          markerElemHandler: undefined,
          activeMap: 0,
          activeMarker: undefined,
          imageLoaded: false,
          selectedMapData: undefined,
          selectedMarkerData: undefined,
          selectedMarkerToggle: false,
          selectedPinchMarker: undefined,
          searchTimeout: null,
          searchValue: '',
          noSearchResults: false
        };
      },
      watch: {
        searchValue: function searchValue() {
          this.noSearchResults = false;
          if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = null;
          }
          this.searchTimeout = setTimeout(this.filterMarkers, 500);
        }
      },
      methods: {
        getMarkerId: function getMarkerId(id) {
          return "marker-".concat(widgetData.id, "-").concat(id);
        },
        filterMarkers: function filterMarkers() {
          var _this = this;
          if (!this.searchValue) {
            this.searchMarkerData = _.cloneDeep(this.mappedMarkerData);
            return;
          }
          this.searchMarkerData = _.filter(this.mappedMarkerData, function (marker) {
            return _.some(['name', 'map'], function (key) {
              return marker.data[key] && marker.data[key].toString().toLowerCase().indexOf(_this.searchValue.toLowerCase()) > -1;
            });
          });
          if (!this.searchMarkerData.length) {
            this.noSearchResults = true;
          }
        },
        clearSearch: function clearSearch() {
          this.searchValue = '';
        },
        mapMarkerData: function mapMarkerData() {
          var _this2 = this;
          var newMarkerData = this.markersData.map(function (marker) {
            var markerData = _.find(_this2.markerStyles, {
              name: marker.data[_this2.markerTypeColumn]
            });
            return {
              id: marker.id,
              data: {
                name: marker.data[_this2.markerNameColumn],
                map: marker.data[_this2.markerMapColumn],
                type: marker.data[_this2.markerTypeColumn],
                icon: markerData ? markerData.icon : '',
                color: markerData ? markerData.color : '#333333',
                size: markerData ? markerData.size : '24px',
                positionX: marker.data[_this2.markerXPositionColumn],
                positionY: marker.data[_this2.markerYPositionColumn]
              }
            };
          });

          // Check if markers have all the necessary info to be shown
          if (!this.validateMarkers(newMarkerData)) {
            Fliplet.UI.Toast({
              message: T('widgets.interactiveMap.errorToast.markersWithoutInformation')
            });
          }
          return newMarkerData;
        },
        validateMarkers: function validateMarkers(markersData) {
          if (!markersData || !markersData.length) {
            return true;
          }
          var missingInfo = markersData.some(function (marker) {
            var results = [];
            for (var key in marker.data) {
              if (!marker.data[key] || marker.data === '') {
                results.push(false);
                continue;
              }
            }
            if (results.length) {
              return false;
            }
            return true;
          });
          return missingInfo;
        },
        setupFlPanZoom: function setupFlPanZoom() {
          var _this3 = this;
          this.selectedMapData = this.maps[this.activeMap];
          this.selectedMarkerData = this.mappedMarkerData[this.activeMarker] ? this.mappedMarkerData[this.activeMarker].data : undefined;
          this.selectedMarkerToggle = !!this.selectedMarkerData;

          // Check if there is a map to initialize
          if (!this.selectedMapData || !this.selectedMapData.id) {
            return Fliplet.UI.Toast({
              message: T('widgets.interactiveMap.errorToast.mapNotFound')
            });
          }
          this.pzElement = $(selector).find(".map-".concat(this.selectedMapData.id));
          if (_.isEmpty(this.flPanZoomInstances) || !this.flPanZoomInstances[this.selectedMapData.id]) {
            this.imageLoaded = false;
            this.flPanZoomInstances[this.selectedMapData.id] = Fliplet.UI.PanZoom.create(this.pzElement, {
              maxZoom: 10,
              zoomStep: 0.25,
              doubleTapZoom: 3,
              animDuration: 0.1,
              allowMouseWheelZoom: false
            });
          } else {
            this.flPanZoomInstances[this.selectedMapData.id].markers.removeAll();
            this.flPanZoomInstances[this.selectedMapData.id].zoom(0, 0);
          }
          this.flPanZoomInstances[this.selectedMapData.id].on('mapImageLoaded', function () {
            _this3.imageLoaded = true;
          });
          if (this.mappedMarkerData.length) {
            this.addMarkers();
            this.selectPinchMarker();
          }
        },
        selectPinchMarker: function selectPinchMarker() {
          var _this4 = this;
          // Remove any active marker
          $('.marker').removeClass('active');

          // Get markers
          var markers = this.flPanZoomInstances[this.selectedMapData.id].markers.getAll();
          if (!markers.length || _.isUndefined(this.mappedMarkerData[this.activeMarker])) {
            return;
          }

          // Store first marker
          var firstMarker = markers[0];

          // Find the new selected marker from flPanZoomInstance
          this.selectedPinchMarker = _.find(markers, function (marker) {
            return marker.vars.id === _this4.getMarkerId(_this4.mappedMarkerData[_this4.activeMarker].id);
          });

          // Apply class active
          if (this.selectedPinchMarker) {
            $(this.selectedPinchMarker.getElement().get(0)).addClass('active');
          } else {
            this.activeMarker = _.findIndex(this.mappedMarkerData, function (obj) {
              return _this4.getMarkerId(obj.id) === firstMarker.vars.id;
            });
            this.selectedMarkerData = this.mappedMarkerData[this.activeMarker].data;
            $(firstMarker.getElement().get(0)).addClass('active');
          }
        },
        addMarkers: function addMarkers() {
          var _this5 = this;
          var createdMarkers = [];
          this.mappedMarkerData.forEach(function (marker) {
            if (marker.data.map === _this5.selectedMapData.name) {
              var markerElem = $("<div\n                id=\"".concat(_this5.getMarkerId(marker.id), "\"\n                class=\"marker\"\n                data-name=\"").concat(marker.data.name, "\"\n                style=\"left: -15px; top: -15px; position: absolute; font-size: ").concat(marker.data.size, ";\">\n                <i\n                  class=\"").concat(marker.data.icon, "\"\n                  style=\"color: ").concat(marker.data.color, "; font-size: ").concat(marker.data.size, ";\"></i>\n                <div class=\"active-state\">\n                  <i class=\"").concat(marker.data.icon, "\" style=\"color: ").concat(marker.data.color, ";\"></i>\n                </div>\n              </div>"));
              _this5.markerElemHandler = new Hammer(markerElem.get(0));
              _this5.markerElemHandler.on('tap', _this5.onMarkerHandler);
              createdMarkers.push(Fliplet.UI.PanZoom.Markers.create(markerElem, {
                x: marker.data.positionX,
                y: marker.data.positionY,
                name: marker.data.name,
                id: _this5.getMarkerId(marker.id)
              }));
            }
          });
          this.flPanZoomInstances[this.selectedMapData.id].markers.set(createdMarkers);
        },
        onMarkerHandler: function onMarkerHandler(e) {
          var _this6 = this;
          var markers = this.flPanZoomInstances[this.selectedMapData.id].markers.getAll();
          var id = e.target.id;
          var marker = _.find(markers, function (o) {
            return o.vars.id === id;
          });
          this.activeMarker = _.findIndex(this.mappedMarkerData, function (obj) {
            return _this6.getMarkerId(obj.id) === marker.vars.id;
          });
          this.selectPinchMarker();
          this.selectedMarkerData = this.mappedMarkerData[this.activeMarker].data;
          this.selectedMarkerToggle = true;
        },
        setActiveMap: function setActiveMap(mapIndex, fromSearch) {
          if (this.activeMap !== mapIndex) {
            this.activeMap = mapIndex;
          }
          if (!fromSearch) {
            this.setupFlPanZoom();
          }
          this.toggleMapOverlay(false);
        },
        setActiveMarker: function setActiveMarker(markerIndex) {
          this.activeMarker = markerIndex;
          this.setupFlPanZoom();
          this.toggleSearchOverlay(false);
        },
        selectedMarker: function selectedMarker(markerData) {
          var mapIndex = _.findIndex(this.maps, {
            name: markerData.data.map
          });
          var markerIndex = _.findIndex(this.mappedMarkerData, {
            id: markerData.id
          });
          this.setActiveMap(mapIndex, true);
          this.setActiveMarker(markerIndex);
        },
        selectMarkerOnStart: function selectMarkerOnStart(options) {
          var markerIndex = -1;
          var markerSelector = '';
          if (_.get(options, 'markerId')) {
            markerIndex = _.findIndex(this.mappedMarkerData, {
              id: options.markerId
            });
            markerSelector = " ".concat(options.markerId);
          }
          if (_.get(options, 'markerName')) {
            markerIndex = _.findIndex(this.mappedMarkerData, function (o) {
              return o.data.name === options.markerName;
            });
            markerSelector = " \"".concat(options.markerName, "\"");
          }
          if (markerIndex === -1) {
            Fliplet.UI.Toast({
              message: T('widgets.interactiveMap.errorToast.selectedMarkerNotFound', {
                markerSelector: markerSelector
              })
            });
          }
          var mapIndex = markerIndex > -1 ? _.findIndex(this.maps, {
            name: this.mappedMarkerData[markerIndex].data.map
          }) : 0;
          this.setActiveMap(mapIndex, true);
          this.setActiveMarker(markerIndex > -1 ? markerIndex : 0);
        },
        selectMapOnStart: function selectMapOnStart(options) {
          var mapIndex = _.findIndex(this.maps, {
            name: options.mapName
          });
          if (mapIndex === -1) {
            Fliplet.UI.Toast({
              message: T('widgets.interactiveMap.errorToast.selectedMapNotFound', {
                mapName: options.mapName ? "\"".concat(options.mapName, "\"") : ''
              })
            });
          }
          this.setActiveMap(mapIndex > -1 ? mapIndex : 0);
        },
        removeSelectedMarker: function removeSelectedMarker() {
          var _this7 = this;
          this.selectedMarkerToggle = false;

          // Wait for animation
          setTimeout(function () {
            // Remove any active marker
            $('.marker').removeClass('active');
            _this7.selectedMarkerData = undefined;
          }, 250);
        },
        closeMapsOverlay: function closeMapsOverlay() {
          this.toggleMapOverlay(false);
        },
        toggleMapOverlay: function toggleMapOverlay(forceOpen) {
          if (typeof forceOpen === 'undefined') {
            $(selector).find('.interactive-maps-overlay').toggleClass('overlay-open');
            return;
          }
          $(selector).find('.interactive-maps-overlay')[forceOpen ? 'addClass' : 'removeClass']('overlay-open');
        },
        closeSearchOverlay: function closeSearchOverlay() {
          this.toggleSearchOverlay(false);
        },
        toggleSearchOverlay: function toggleSearchOverlay(forceOpen) {
          this.searchValue = '';
          if (typeof forceOpen === 'undefined') {
            $(selector).find('.interactive-maps-search-overlay').toggleClass('overlay-open');
            return;
          }
          $(selector).find('.interactive-maps-search-overlay')[forceOpen ? 'addClass' : 'removeClass']('overlay-open');
        },
        onLabelClick: function onLabelClick() {
          Fliplet.Hooks.run('flInteractiveGraphicsLabelClick', {
            selectedMarker: this.selectedMarkerData,
            config: this,
            id: widgetData.id,
            uuid: widgetData.uuid,
            container: $(selector)
          });
        },
        fetchData: function fetchData(options) {
          return Fliplet.DataSources.connect(this.markersDataSourceId, options).then(function (connection) {
            return connection.find();
          })["catch"](function (error) {
            Fliplet.UI.Toast({
              message: T('widgets.interactiveMap.errorToast.loadFailed.title'),
              actions: [{
                label: T('widgets.interactiveMap.errorToast.loadFailed.label'),
                action: function action() {
                  Fliplet.UI.Toast({
                    html: error.message || Fliplet.parseError(error)
                  });
                }
              }]
            });
          });
        },
        refreshInstance: function refreshInstance() {
          // We should refresh ZoomInstance only if we have selectedMapData
          // If there is no selectedMapData it means that PanZoom doesn't inited
          if (this.selectedMapData) {
            this.flPanZoomInstances[this.selectedMapData.id].refresh();
          } else {
            this.setupFlPanZoom();
          }
        },
        init: function init() {
          var _this8 = this;
          var cache = {
            offline: true
          };
          return Fliplet.Hooks.run('flInteractiveGraphicsBeforeGetData', {
            config: this,
            id: widgetData.id,
            uuid: widgetData.uuid,
            container: $(selector)
          }).then(function () {
            if (_this8.getData) {
              _this8.fetchData = _this8.getData;
              if (_this8.hasOwnProperty('cache')) {
                cache.offline = _this8.cache;
              }
            }
            return _this8.fetchData(cache);
          }).then(function (dsData) {
            _this8.markersData = dsData;
            // Ordering and take into account numbers on the string
            _this8.mappedMarkerData = _this8.mapMarkerData().slice().sort(function (a, b) {
              return a.data.name.localeCompare(b.data.name, undefined, {
                numeric: true
              });
            });
            return Fliplet.Hooks.run('flInteractiveGraphicsBeforeRender', {
              config: _this8,
              id: widgetData.id,
              uuid: widgetData.uuid,
              container: $(selector),
              markers: _this8.mappedMarkerData
            });
          }).then(function (response) {
            _this8.searchMarkerData = _.cloneDeep(_this8.mappedMarkerData);
            if (!response.length) {
              _this8.$nextTick(_this8.setupFlPanZoom);
              return;
            }

            // Check if it should start with a specific marker selected or select a map
            if (_.get(response[0], 'markerId') || _.get(response[0], 'markerName')) {
              _this8.selectMarkerOnStart(response[0]);
            } else if (_.get(response[0], 'mapName')) {
              _this8.selectMapOnStart(response[0]);
            } else if (_.get(response[0], 'selectMarker') === false) {
              // Ensure no marker is selected
              _this8.setActiveMarker(-1);
            } else {
              _this8.$nextTick(_this8.setupFlPanZoom);
            }
          });
        }
      },
      mounted: function mounted() {
        var _this9 = this;
        return _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee() {
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!_this9.containsData) {
                    _context.next = 5;
                    break;
                  }
                  if (!(!_this9.markersDataSourceId || !_this9.markerNameColumn || !_this9.markerMapColumn || !_this9.markerTypeColumn || !_this9.markerXPositionColumn || !_this9.markerYPositionColumn)) {
                    _context.next = 3;
                    break;
                  }
                  return _context.abrupt("return", Fliplet.UI.Toast({
                    message: T('widgets.interactiveMap.errorToast.dataSourceMisconfigured')
                  }));
                case 3:
                  _context.next = 5;
                  return _this9.init();
                case 5:
                  Fliplet.Hooks.on('appearanceChanged', _this9.refreshInstance);
                  Fliplet.Hooks.on('appearanceFileChanged', _this9.refreshInstance);
                  $(selector).removeClass('is-loading');
                case 8:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }))();
      },
      beforeDestroy: function beforeDestroy() {
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout);
          this.searchTimeout = null;
        }
      }
    });
  });
});

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/asyncToGenerator.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
module.exports = _asyncToGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/regeneratorRuntime.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/regeneratorRuntime.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/typeof.js")["default"];
function _regeneratorRuntime() {
  "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
    return exports;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return generator._invoke = function (innerFn, self, context) {
      var state = "suspendedStart";
      return function (method, arg) {
        if ("executing" === state) throw new Error("Generator is already running");
        if ("completed" === state) {
          if ("throw" === method) throw arg;
          return doneResult();
        }
        for (context.method = method, context.arg = arg;;) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }
          if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
            if ("suspendedStart" === state) throw state = "completed", context.arg;
            context.dispatchException(context.arg);
          } else "return" === context.method && context.abrupt("return", context.arg);
          state = "executing";
          var record = tryCatch(innerFn, self, context);
          if ("normal" === record.type) {
            if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
            return {
              value: record.arg,
              done: context.done
            };
          }
          "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
        }
      };
    }(innerFn, self, context), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    this._invoke = function (method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }
      return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (undefined === method) {
      if (context.delegate = null, "throw" === context.method) {
        if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel;
        context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }
      return ContinueSentinel;
    }
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length;) {
              if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
            }
            return next.value = undefined, next.done = !0, next;
          };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) {
        "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
      }
    },
    stop: function stop() {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
          record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
            hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}
module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/typeof.js":
/*!*******************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/typeof.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(obj) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(obj);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// TODO(Babel 8): Remove this file.

var runtime = __webpack_require__(/*! ../helpers/regeneratorRuntime */ "./node_modules/@babel/runtime/helpers/regeneratorRuntime.js")();
module.exports = runtime;

// Copied from https://github.com/facebook/regenerator/blob/main/packages/runtime/runtime.js#L736=
try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}


/***/ }),

/***/ 0:
/*!********************************!*\
  !*** multi ./js/libs/build.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/twu/Sites/fliplet/widgets/fliplet-widget-interactive-map/js/libs/build.js */"./js/libs/build.js");


/***/ })

/******/ });