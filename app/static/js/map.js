const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v11',
  center: [-74.0060, 40.7128],
  zoom: 10,
  accessToken: "pk.eyJ1IjoicnlhbmxhdSIsImEiOiJjbGNkaTl6MjAxN2VxM3BwNHpseXYxN3BtIn0.NSi2H99_zl3PfrdhjGp6AA"
});


map.on('load', () => {
  map.addLayer({
    id: 'trips',
    type: 'line',
    source: {
      type: 'geojson',
      data: '/static/data/trips.geojson'
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#888',
      'line-width': 8
    }

  });
});