var dataset = ee.ImageCollection('LANDSAT/LT05/C02/T1_TOA')
  .filterDate('1985-01-01', '1985-12-31');

// Function to mask clouds based on the cloud score.
function maskClouds(image) {
  var cloudScore = ee.Algorithms.Landsat.simpleCloudScore(image).select('cloud');
  var mask = cloudScore.lt(10); // Keeping images with less than 10% cloud cover
  return image.updateMask(mask);
}

// Apply cloud mask to the dataset.
var maskedDataset = dataset.map(maskClouds);

// Select the true color bands.
var trueColor321 = maskedDataset.select(['B3', 'B2', 'B1']);

// Create a median composite to get the best pixels over the time series.
var medianComposite = trueColor321.median();

var trueColor321Vis = {
  min: 0.0,
  max: 0.35,
  gamma: 1.2,
};

Map.setCenter(-60.6698, 2.83, 13);
Map.addLayer(medianComposite, trueColor321Vis, 'True Color (321) Median Composite');
