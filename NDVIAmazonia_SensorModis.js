// Simple ImageCollection preview via animated GIF.

// The region of interest - a planar rectangle around Australia.
var rect = ee.Geometry.Rectangle({
  coords: [[-72.99, -14.27], [-44.34, 5.44]],
  geodesic: false
});

// Select MODIS vegetation composites from 2018.
var collection = ee.ImageCollection("MODIS/006/MOD13Q1")
  .filterDate('2018-01-01', '2020-01-01')
  .select('NDVI');

// Add the first image to the map, just as a preview.
var im = ee.Image(collection.first());
//Map.addLayer(im, {}, "first image");

Map.addLayer(rect);
Map.centerObject(rect, 4.5);

// Visualization parameters.
var args = {
  crs: 'EPSG:4674',
  dimensions: '300',
  region: rect,
  min: -2000,
  max: 10000,
  palette: 'black, blanchedalmond, green, green',
  framesPerSecond: 8,
};

// Create a video thumbnail and add it to the map.
var thumb = ui.Thumbnail({
  // Specifying a collection for "image" animates the sequence of images.
  image: collection,
  params: args,
  style: {
    position: 'bottom-right',
    width: '600px'
  }});
Map.add(thumb);
