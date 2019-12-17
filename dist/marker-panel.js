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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/interface/marker-panel.js":
/*!**************************************!*\
  !*** ./js/interface/marker-panel.js ***!
  \**************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);

Fliplet.InteractiveMap.component('marker-panel', {
  componentName: 'Marker Panel',
  props: {
    id: {
      type: String,
      "default": ''
    },
    name: {
      type: String,
      "default": ''
    },
    icon: {
      type: String,
      "default": 'fa fa-circle'
    },
    color: {
      type: String,
      "default": '#337ab7'
    },
    size: {
      type: String,
      "default": '24px'
    },
    type: {
      type: String,
      "default": 'marker-panel'
    },
    isFromNew: {
      type: Boolean,
      "default": true
    },
    emptyIconNotification: {
      type: Boolean,
      "default": false
    }
  },
  data: function data() {
    return {
      widgetInstanceId: Fliplet.Widget.getDefaultId(),
      dataSourceId: Fliplet.Widget.getData().markersDataSourceId,
      updateDebounced: _.debounce(this.updateDataSource, 1000),
      entries: undefined,
      columns: undefined,
      dataSourceConnection: undefined,
      oldStyleName: ''
    };
  },
  methods: {
    onInputData: function onInputData() {
      var componentData = _.pick(this, ['id', 'name', 'icon', 'color', 'size', 'type', 'isFromNew']);

      Fliplet.InteractiveMap.emit('marker-panel-settings-changed', componentData);
    },
    updateDataSource: function updateDataSource() {
      var _this = this;

      Fliplet.DataSources.connect(this.dataSourceId).then(function (connection) {
        _this.dataSourceConnection = connection;
        connection.find({
          where: _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()({}, 'Marker style', _this.oldStyleName)
        }).then(function (records) {
          if (!records.length) {
            return;
          }

          _this.dataSourceConnection.find().then(function (records) {
            records.forEach(function (elem, index, array) {
              if (elem.data['Marker style'] === _this.oldStyleName) {
                array[index].data['Marker style'] = _this.name;
              }
            });
            _this.entries = records;
            _this.columns = _.keys(records[0].data);

            _this.dataSourceConnection.commit(_this.entries, _this.columns);

            _this.oldStyleName = _this.name;
            Fliplet.Studio.emit('reload-widget-instance', _this.widgetInstanceId);
          });
        });
      });
    },
    getStyleName: function getStyleName() {
      this.oldStyleName = this.name;
    },
    openIconPicker: function openIconPicker() {
      var _this2 = this;

      this.icon = this.icon || '';
      Fliplet.Widget.toggleCancelButton(false);
      window.iconPickerProvider = Fliplet.Widget.open('com.fliplet.icon-selector', {
        // Also send the data I have locally, so that
        // the interface gets repopulated with the same stuff
        data: this.icon,
        // Events fired from the provider
        onEvent: function onEvent(event, data) {
          if (event === 'interface-validate') {
            Fliplet.Widget.toggleSaveButton(data.isValid === true);
          }
        }
      });
      Fliplet.Studio.emit('widget-save-label-update', {
        text: 'Select & Save'
      });
      window.iconPickerProvider.then(function (data) {
        Fliplet.Widget.toggleCancelButton(true);

        if (!data.data.icon) {
          _this2.emptyIconNotification = true;
        } else {
          _this2.icon = data.data.icon;
          _this2.emptyIconNotification = false;
        }

        _this2.onInputData();

        window.iconPickerProvider = null;
        Fliplet.Studio.emit('widget-save-label-reset');
        return Promise.resolve();
      });
    }
  },
  created: function created() {
    Fliplet.InteractiveMap.on('markers-save', this.onInputData);
  },
  destroyed: function destroyed() {
    Fliplet.InteractiveMap.off('markers-save', this.onInputData);
  },
  mounted: function mounted() {
    var _this3 = this;

    var $vm = this;
    var $colorpickerElement = $('#list-item-color-' + $vm.id).parents('[colorpicker-component]');
    $colorpickerElement.colorpicker({
      container: true,
      customClass: 'colorpicker-2x',
      sliders: {
        saturation: {
          maxLeft: 235,
          maxTop: 235
        },
        hue: {
          maxTop: 235
        },
        alpha: {
          maxTop: 235
        }
      }
    });
    $colorpickerElement.on('changeColor', function (e) {
      $vm.color = e.value;
      $vm.onInputData();
    });
    $('#list-item-color-' + $vm.id).on('click', function () {
      $(_this3).prev('.input-group-addon').find('i').trigger('click');
    });
    $('.input-group-addon i').on('click', function () {
      $(_this3).parents('.input-group-addon').next('#list-item-color-' + $vm.id).trigger('focus');
    });
  }
});

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/defineProperty.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/defineProperty.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;

/***/ }),

/***/ 5:
/*!********************************************!*\
  !*** multi ./js/interface/marker-panel.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Max\Upplabs\Fliplet\interactive graphics\fliplet-widget-interactive-map\js\interface\marker-panel.js */"./js/interface/marker-panel.js");


/***/ })

/******/ });