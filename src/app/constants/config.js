export const config = {
  mapOptions: {
    center: {
      latitude: 45,
      longitude: -73
    },
    zoom: 8
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
  }
};
