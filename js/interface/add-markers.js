import Multiselect from 'vue-multiselect'

Fliplet.InteractiveMap.component('add-markers', {
  componentName: 'Add Markers',
  props: {
    id: {
      type: Number,
      default: undefined
    },
    widgetData: {
      type: Object,
      default: undefined
    },
    markersDataSourceId: {
      type: Number,
      default: undefined
    },
    markerNameColumn: {
      type: String,
      default: ''
    },
    markerMapColumn: {
      type: String,
      default: ''
    },
    markerTypeColumn: {
      type: String,
      default: ''
    },
    markerXPositionColumn: {
      type: String,
      default: ''
    },
    markerYPositionColumn: {
      type: String,
      default: ''
    },
    dataSources: {
      type: Array,
      default: []
    },
    changedDataSource: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Multiselect
  },
  data() {
    return {
      selector: '#interactive-map-app',
      isLoading: true,
      manualSetSettings: false,
      savedData: this.widgetData.savedData,
      markersDataSource: _.find(this.dataSources, { id: this.markersDataSourceId }),
      dataSourceId: this.markersDataSourceId,
      dataWasChanged: this.changedDataSource,
      dataSourceConnection: undefined,
      flPanZoomInstances: {},
      pzElement: undefined,
      pzHandler: undefined,
      markerElemHandler: undefined,
      markersData: undefined,
      mappedMarkerData: [],
      imageLoaded: false,
      activeMarker: 0,
      selectedMarkerData: {
        map: undefined,
        marker: undefined
      },
      selectedPinchMarker: undefined,
      tappedMarkerId: undefined,
      saveDebounced: _.debounce(this.saveToDataSource, 1000),
      dsConfigError: false,
      dataSourceToDelete: undefined,
      showEditMarkerOverlay: false
    }
  },
  computed: {
    selectedMap() {
      return this.widgetData.maps[this.selectedMapIndex]
    }
  },
  watch: {
    dataSourceId(id, oldId) {
      console.log('ds id', id)
    },
    markersDataSource(ds, oldDs) {
      if (!ds || !oldDs || (ds.id !== this.dataSourceId && !this.dataWasChanged)) {
        return Fliplet.Modal.confirm({
          title: 'Changing data source',
          message: '<p>If you change the data source, the one we created for you will be deleted.<br>Are you sure you want to continue?</p>'
        }).then((result) => {
          if (!result) {
            this.markersDataSource = oldDs
            this.dataSourceId = oldDs.id
            return
          }

          this.dataSourceToDelete = oldDs.id
          this.dataSourceId = ds.id
          this.dataWasChanged = true

          // Remove from dataSources
          this.dataSources = _.filter(this.dataSources, (dataSource) => {
            return dataSource.id !== oldDs.id
          })

          // Resets select fields
          this.markerNameColumn = ''
          this.markerMapColumn = ''
          this.markerTypeColumn = ''
          this.markerXPositionColumn = ''
          this.markerYPositionColumn = ''
        })
      }

      this.dataSourceId = ds.id

      // Resets select fields
      this.markerNameColumn = ''
      this.markerMapColumn = ''
      this.markerTypeColumn = ''
      this.markerXPositionColumn = ''
      this.markerYPositionColumn = ''
    }
  },
  methods: {
    mapMarkerData() {
      const newMarkerData = this.markersData.map((marker) => {
        const markerData = _.find(this.widgetData.markers, { name: marker.data[this.markerTypeColumn] })
        return {
          id: marker.id,
          data: {
            name: marker.data[this.markerNameColumn] || 'Data source marker',
            map: marker.data[this.markerMapColumn] || this.widgetData.maps[0].name,
            type: marker.data[this.markerTypeColumn] || this.widgetData.markers[0].name,
            icon: markerData ? markerData.icon : this.widgetData.markers[0].icon,
            color: markerData ? markerData.color : this.widgetData.markers[0].color,
            size: markerData ? markerData.size : this.widgetData.markers[0].size,
            positionX: marker.data[this.markerXPositionColumn] || '100',
            positionY: marker.data[this.markerYPositionColumn] || '100',
            updateName: false,
            copyOfName: ''
          }
        }
      })

      return newMarkerData
    },
    setActiveMarker(index, forced) {
      if (this.activeMarker !== index || forced) {
        this.activeMarker = index
        this.setupFlPanZoom()
      }
    },
    updateMap(mapName, index) {
      this.mappedMarkerData[index].data.map = mapName
      this.saveDebounced()
      this.setupFlPanZoom()
    },
    updateMarker(marker, index) {
      this.mappedMarkerData[index].data.type = marker.name
      this.mappedMarkerData[index].data.icon = marker.icon
      this.mappedMarkerData[index].data.color = marker.color
      this.mappedMarkerData[index].data.size = marker.size
      this.saveDebounced()
      this.setupFlPanZoom()
    },
    toUpdateName(index, currentName) {
      this.mappedMarkerData[index].data.updateName = !this.mappedMarkerData[index].data.updateName
      this.mappedMarkerData[index].data.copyOfName = currentName
      this.$nextTick(() => this.$refs['changename-' + index][0].focus())
    },
    confirmName(index, fromCancel) {
      this.mappedMarkerData[index].data.updateName = !this.mappedMarkerData[index].data.updateName

      if (!fromCancel) {
        this.saveDebounced()
        this.setupFlPanZoom()
      }
    },
    cancelNameUpdate(index) {
      this.mappedMarkerData[index].data.name = this.mappedMarkerData[index].data.copyOfName
      this.mappedMarkerData[index].data.copyOfName = ''
      this.confirmName(index, true)
    },
    deleteMarker(index) {
      const markers = this.flPanZoomInstances[this.selectedMarkerData.map.id].markers.getAll()
      const markerId = $('.map-wrapper-holder')
        .find('.marker[data-name="' + this.mappedMarkerData[index].data.name + '"]')
        .attr('id')
        
      if (markerId) {
        this.flPanZoomInstances[this.selectedMarkerData.map.id].markers.remove(markerId, {keepInDom: false})
      }

      this.mappedMarkerData.splice(index, 1)
      this.setActiveMarker(0, true)
      this.saveDebounced()
    },
    nameWithId({ name, id }) {
      return `${name} — [${id}]`
    },
    chooseExistingData() {
      this.savedData = false
      Fliplet.Studio.emit('widget-mode', 'normal')
    },
    editDataSource() {
      Fliplet.Studio.emit('overlay', {
        name: 'widget',
        options: {
          size: 'large',
          package: 'com.fliplet.data-sources',
          title: 'Edit Data Sources',
          classes: 'data-source-overlay',
          data: {
            context: 'overlay',
            dataSourceId: this.dataSourceId
          }
        }
      })
    },
    reloadDataSources() {
      return Fliplet.DataSources.get({
        roles: 'publisher,editor',
        type: null
      }, {
        cache: false
      })
    },
    useSettings() {
      if (this.markerYPositionColumn === ''
        || this.markerXPositionColumn === ''
        || this.markerTypeColumn === ''
        || this.markerMapColumn === ''
        || this.markerNameColumn === ''
        || this.markersDataSource === '')
      {
        this.dsConfigError = true
        return
      }

      this.dataSourceId = this.markersDataSource.id
      this.savedData = true
      Fliplet.Studio.emit('widget-mode', 'full-screen')
    },
    onMarkerPanelSettingChanged(panelData) {
      this.widgetData.markers.forEach((panel, index) => {
        if (panelData.name == panel.name && panelData.id !== panel.id) {
          panelData.error = 'Marker styles must have different names'
        }

        if (panelData.id === panel.id) {
          // To overcome the array change caveat
          // https://vuejs.org/v2/guide/list.html#Caveats
          Vue.set(this.widgetData.markers, index, panelData)
        }
      })

      this.saveData()
    },
    onAddMarker() {
      const newItem = {
        id: Fliplet.guid(),
        isFromNew: true,
        name: `Marker ${this.widgetData.markers.length + 1}`,
        icon: 'fa fa-circle',
        color: '#337ab7',
        type: 'marker-panel',
        size: '24px'
      }

      this.widgetData.markers.push(newItem)
      this.saveData()
    },
    deleteMarker(index) {
      Fliplet.Modal.confirm({
        title: 'Delete marker style',
        message: '<p>You will have to manually update any marker that has this style applied.</p><p>Are you sure you want to delete this marker style?</p>'
      }).then((result) => {
        if (!result) {
          return
        }

        this.widgetData.markers.splice(index, 1)
      })
    },
    toggleEditMarkerOverlay() {
      this.showEditMarkerOverlay = !!!this.showEditMarkerOverlay
    },
    setupFlPanZoom() {
      const mapName = this.mappedMarkerData.length
        ? this.mappedMarkerData[this.activeMarker].data.map
        : this.widgetData.maps[0].name
      this.selectedMarkerData.marker = this.mappedMarkerData[this.activeMarker] || this.widgetData.markers[0].name
      this.selectedMarkerData.map = _.find(this.widgetData.maps, { name: mapName })
      // If the map doesn't exist anymore set the first one in the list
      if (!this.selectedMarkerData.map) {
        this.selectedMarkerData.map = this.widgetData.maps[0]
        this.mappedMarkerData[this.activeMarker].data.map = this.selectedMarkerData.map.name
        this.saveDebounced()
      }

      this.pzElement = $('#map-' + this.selectedMarkerData.map.id)

      if (_.isEmpty(this.flPanZoomInstances) || !this.flPanZoomInstances[this.selectedMarkerData.map.id]) {
        this.imageLoaded = false
        
        this.flPanZoomInstances[this.selectedMarkerData.map.id] = Fliplet.UI.PanZoom.create(this.pzElement, {
          maxZoom: 4,
          zoomStep: 0.25,
          doubleTapZoom: 3,
          animDuration: 0.1,
          tapMarkerToActivate: false
        })

        this.pzHandler = new Hammer(this.pzElement.get(0))
        this.attachEventHandler()
      } else {
        this.flPanZoomInstances[this.selectedMarkerData.map.id].markers.removeAll()
      }

      this.flPanZoomInstances[this.selectedMarkerData.map.id].on('mapImageLoaded', () => {
        this.imageLoaded = true
      })

      if (this.mappedMarkerData.length) {
        this.addMarkers(true)
        this.selectPinchMarker()
      }
    },
    removeMarkers() {
      $(this.selector).find('.marker').remove()
    },
    addMarkers(fromLoad, options) {
      let markerElem = undefined
      options = options || {}

      if (fromLoad) {
        // Manually removes markers
        this.removeMarkers()

        this.mappedMarkerData.forEach((marker, index) => {
          if (marker.data.map === this.selectedMarkerData.map.name) {
            const markersLength = this.flPanZoomInstances[this.selectedMarkerData.map.id].markers.getAll().length
            markerElem = $("<div id='" + marker.id + "' class='marker' data-name='" + marker.data.name + "' style='left: -15px; top: -15px; position: absolute; font-size: " + marker.data.size + ";'><i class='" + marker.data.icon + "' style='color: " + marker.data.color + "; font-size: " + marker.data.size + ";'></i><div class='active-state'><i class='" + marker.data.icon + "' style='color: " + marker.data.color + ";'></i></div></div>")
            this.markerElemHandler = new Hammer(markerElem.get(0))
            this.flPanZoomInstances[this.selectedMarkerData.map.id].markers.set([Fliplet.UI.PanZoom.Markers.create(markerElem, { x: marker.data.positionX, y: marker.data.positionY, name: marker.data.name, id: marker.id })])
            this.markerElemHandler.on('tap', this.onMarkerHandler)
          }
        })
        return
      }

      if (options.existingMarker) {
        options.existingMarker.update({x: options.x, y: options.y}, true)
        this.updateMarkerCoordinates({
          x: options.x,
          y: options.y,
          marker: options.existingMarker.vars
        })
        $('#' + options.id).addClass('active')
      } else if (this.selectedMarkerData && this.selectedMarkerData.marker) {
        const markersLength = this.tappedMarkerId || this.flPanZoomInstances[this.selectedMarkerData.map.id].markers.getAll().length
        markerElem = $("<div id='" + this.selectedMarkerData.marker.id + "' class='marker' data-name='" + this.selectedMarkerData.marker.data.name + "' style='left: -15px; top: -15px; position: absolute; font-size: " + this.selectedMarkerData.marker.data.size + ";'><i class='" + this.selectedMarkerData.marker.data.icon + "' style='color: " + this.selectedMarkerData.marker.data.color + "; font-size: " + this.selectedMarkerData.marker.data.size + ";'></i><div class='active-state'><i class='" + this.selectedMarkerData.marker.data.icon + "' style='color: " + this.selectedMarkerData.marker.data.color + ";'></i></div></div>")
        this.markerElemHandler = new Hammer(markerElem.get(0))
        this.flPanZoomInstances[this.selectedMarkerData.map.id].markers.set([Fliplet.UI.PanZoom.Markers.create(markerElem, { x: options.x, y: options.y, name: this.selectedMarkerData.marker.data.name, id: this.selectedMarkerData.marker.id })])
        $('#marker-' + markersLength).addClass('active')
        this.tappedMarkerId = undefined
      } else {
        return Fliplet.Modal.confirm({
          title: 'Add a new marker',
          message: '<p>You have no markers to place on the map, do you want to create one now?</p>',
          buttons: {
            confirm: {
              label: 'Create marker',
              className: 'btn-primary'
            },
            cancel: {
              label: 'Cancel',
              className: 'btn-default'
            }
          }
        }).then((result) => {
          if (!result) {
            return
          }

          return this.addNewMarker(options)
        })
      }
      
      this.markerElemHandler.on('tap', this.onMarkerHandler)
    },
    updateMarkerCoordinates(coordinates) {
      if (!coordinates) {
        return
      }

      this.mappedMarkerData.forEach((marker, index) => {
        if (marker.id === coordinates.marker.id) {
          this.mappedMarkerData[index].data.positionX = coordinates.x
          this.mappedMarkerData[index].data.positionY = coordinates.y
        }
      })
      this.saveDebounced()
    },
    attachEventHandler() {
      this.pzHandler.on('tap', this.onTapHandler)
    },
    detachEventHandler() {
      this.pzHandler.off('tap', this.onTapHandler)
    },
    onTapHandler(e) {
      const markers = this.flPanZoomInstances[this.selectedMarkerData.map.id].markers.getAll()

      if (!$(e.target).hasClass('marker')) {
        // Find a marker
        let markerId = undefined
        const markerIndex = _.findIndex(markers, (marker) => {
          return marker.vars.id === this.selectedMarkerData.marker.id
        })
        const markerFound = markers[markerIndex]

        if (markerFound) {
          markerId = markerFound.vars.id
        }

        const clientRect = this.pzElement.get(0).getBoundingClientRect()
        const elemPosX = clientRect.left
        const elemPosY = clientRect.top
        const center = e.center
        const x = (center.x - elemPosX) / (this.flPanZoomInstances[this.selectedMarkerData.map.id].getBaseZoom() * this.flPanZoomInstances[this.selectedMarkerData.map.id].getCurrentZoom())
        const y = (center.y - elemPosY) / (this.flPanZoomInstances[this.selectedMarkerData.map.id].getBaseZoom() * this.flPanZoomInstances[this.selectedMarkerData.map.id].getCurrentZoom())

        this.addMarkers(false, {
          x: x,
          y: y,
          id: markerId,
          existingMarker: markerFound
        })
      }
    },
    onMarkerHandler(e) {
      const markers = this.flPanZoomInstances[this.selectedMarkerData.map.id].markers.getAll()
      const markerId = $(e.target).attr('id')
      
      if (markerId && markerId === this.selectedMarkerData.marker.id) {
        this.flPanZoomInstances[this.selectedMarkerData.map.id].markers.remove(markerId, true)
      }
    },
    selectPinchMarker() {
      // Remove any active marker
      $('.marker').removeClass('active')
      // Get markers
      const markers = this.flPanZoomInstances[this.selectedMarkerData.map.id].markers.getAll()
      // Store first marker
      const marker = markers[0]

      // Find the new selected marker from flPanZoomInstance
      this.selectedPinchMarker = _.find(markers, (marker) => {
        return marker.vars.id === this.mappedMarkerData[this.activeMarker].id
      })
      // Apply class active
      if (this.selectedPinchMarker) {
        $(this.selectedPinchMarker.getElement().get(0)).addClass('active')
      } else {
        this.activeMarker = _.findIndex(this.mappedMarkerData, (o) => { return o.id == marker.vars.id })
        $(markers[0].getElement().get(0)).addClass('active')
      }
    },
    getMarkersData() {
      return Fliplet.DataSources.connect(this.dataSourceId, { offline: false })
        .then((connection) => {
          // If you want to do specific queries to return your rows
          // See the documentation here: https://developers.fliplet.com/API/fliplet-datasources.html
          this.dataSourceConnection = connection // To keep the connection to update/delete data later on
          return connection.find()
        })
    },
    cleanData() {
      const newData = []

      this.mappedMarkerData.forEach((marker, index) => {
        const newObj = {
          id: marker.id,
          data: {}
        }

        newObj.data[this.markerNameColumn] = marker.data.name
        newObj.data[this.markerMapColumn] = marker.data.map
        newObj.data[this.markerTypeColumn] = marker.data.type
        newObj.data[this.markerXPositionColumn] = marker.data.positionX
        newObj.data[this.markerYPositionColumn] = marker.data.positionY

        newData.push(newObj)
      })

      return newData
    },
    saveToDataSource() {
      const data = this.cleanData()
      this.dataSourceConnection.commit(data)
    },
    addNewMarker(options) {
      const newObj = {}
      const markerLength = this.mappedMarkerData.length
      let mapName
      if (this.selectedMarkerData && this.selectedMarkerData.map) {
        mapName = this.selectedMarkerData.map.name
      } else if (this.widgetData.maps && this.widgetData.maps.length) {
        mapName = this.widgetData.maps[0].name
      }

      // Get image size and center position
      const image = $('#map-' + this.selectedMarkerData.map.id).find('img')[0]
      const rect = image.getBoundingClientRect()
      const position = {
        x: (rect.width * 0.5) / (this.flPanZoomInstances[this.selectedMarkerData.map.id].getBaseZoom() * this.flPanZoomInstances[this.selectedMarkerData.map.id].getCurrentZoom()),
        y: (rect.height * 0.5) / (this.flPanZoomInstances[this.selectedMarkerData.map.id].getBaseZoom() * this.flPanZoomInstances[this.selectedMarkerData.map.id].getCurrentZoom())
      }

      newObj[this.markerNameColumn] = `New marker ${markerLength + 1}`
      newObj[this.markerMapColumn] = mapName
      newObj[this.markerTypeColumn] = this.widgetData.markers.length ? this.widgetData.markers[0].name : ''
      newObj[this.markerXPositionColumn] = options && _.hasIn(options, 'existingMarker') ? options.x : position.x
      newObj[this.markerYPositionColumn] = options && _.hasIn(options, 'existingMarker') ? options.y : position.y

      this.dataSourceConnection.insert(newObj)
        .then(() => {
          return this.getMarkersData()
        })
        .then((data) => {
          this.markersData = data
          this.mappedMarkerData = this.mapMarkerData()
          const newMarkerIndex = _.findIndex(this.mappedMarkerData, (o) => {
            return o.data.name == newObj[this.markerNameColumn]
          })
          this.setActiveMarker(newMarkerIndex, true)
        })
    },
    saveData() {
      const markersData = _.pick(this, [
        'markerNameColumn',
        'markerMapColumn',
        'markerTypeColumn',
        'markerXPositionColumn',
        'markerYPositionColumn',
        'dataSourceToDelete'
      ])
      markersData.markersDataSourceId = this.dataSourceId
      markersData.changedDataSource = this.dataWasChanged
      markersData.markers = this.widgetData.markers

      Fliplet.InteractiveMap.emit('add-markers-settings-changed', markersData)
    }
  },
  async created() {
    this.markersData = await this.getMarkersData()
    this.isLoading = false
    this.mappedMarkerData = this.mapMarkerData()

    Fliplet.Studio.onMessage((event) => {
      if (event.data && event.data.event === 'overlay-close' && event.data.data && event.data.data.dataSourceId) {
        this.reloadDataSources()
          .then((dataSources) => {
            this.dataSources = dataSources
            return this.getMarkersData()
          })
          .then((data) => {
            this.markersData = data
            this.mappedMarkerData = this.mapMarkerData()
            this.saveDebounced()
            this.setupFlPanZoom()
          })
      }
    })

    Fliplet.InteractiveMap.on('add-markers-save', this.saveData)
    Fliplet.InteractiveMap.on('marker-panel-settings-changed', this.onMarkerPanelSettingChanged)
  },
  mounted() {
    // vm.$nextTick is not enough
    setTimeout(this.setupFlPanZoom, 1000)
  },
  destroyed() {
    Fliplet.InteractiveMap.off('add-markers-save', this.saveData)
    Fliplet.InteractiveMap.off('marker-panel-settings-changed', this.onMarkerPanelSettingChanged)
  }
});