const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken = process.env.MAPBOX_KEY;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: process.env.MAPBOX_STYLE_URL, // style URL
  //   center: [-74.5, 40], // starting position [lng, lat]
  //   zoom: 9, // starting zoom
  //   interactive: false,
  scrollZoom: false,
});

/** The area that will be displayed on the map */
const bounds = new mapboxgl.LngLatBounds();

locations?.forEach((location) => {
  // Create a  marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add the marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(location.coordinates)
    .addTo(map);

  // Add a popup

  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(location.coordinates)
    .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
    .addTo(map);

  // Extend the locations of the tours to the bounds
  bounds.extend(location.coordinates);
});

/** Adding bounds to the map */
map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 170,
    left: 100,
    rigth: 100,
  },
});
