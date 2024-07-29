//Código com zoom em área de garimpo na região do Surucucus na T.I. Yanomami, próximo à fronteira com Venezuela.
//A camada em vermelho é o limite territprial do Brasil.

// Importando a coleção de imagens LANDSAT
var dataset = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')
    .filterDate('2024-01-01', '2024-02-01');

// Aplicando os fatores de escala
function applyScaleFactors(image) {
  var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2);
  var thermalBands = image.select('ST_B.*').multiply(0.00341802).add(149.0);
  return image.addBands(opticalBands, null, true)
              .addBands(thermalBands, null, true);
}

dataset = dataset.map(applyScaleFactors);

var visualization = {
  bands: ['SR_B4', 'SR_B3', 'SR_B2'],
  min: 0.0,
  max: 0.3,
};

// Centralizando o mapa em Roraima, Brasil
Map.setCenter(-63.8306, 2.4889, 12);

Map.addLayer(dataset, visualization, 'True Color (432)');

// Adicionando camada vetorial dos limites do Brasil
var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');
var brazil = countries.filter(ee.Filter.eq('country_na', 'Brazil'));
Map.addLayer(brazil, {color: 'red', fillColor: '00000000', fillOpacity: '0'}, 'Limites do Brasil');
