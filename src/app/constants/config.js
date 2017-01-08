export const config = {
  mapOptions: {
    center: {
      latitude: 45,
      longitude: -73
    },
    bounds: {},
    zoom: 8,
    control: {},
    markersControl: {},
    events: {}
  },
  cluserOptions: {
    gridSize: 20,
    maxZoom: 15,
    styles: [{
      height: 75,
      url: "images/ICO/ico_liv_v_m.svg",
      width: 75
    }]
  },
  clusterChauffeurOptions: {
    gridSize: 20,
    maxZoom: 15,
    styles: [{
      height: 75,
      url: "images/ICO/ico_truck_other.svg",
      width: 75
    }]
  },
  chauffColor: ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#009688", "#00bcd4", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548"]
};
