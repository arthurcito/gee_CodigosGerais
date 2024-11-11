// Carregar o dataset BESS
var dataset = ee.ImageCollection('SNU/ESL/BESS/Rad/v1');

// Filtrar os dados para o intervalo de 1º de janeiro de 2016 a 31 de dezembro de 2020
var filteredDataset = dataset.filterDate('2016-01-01', '2020-12-31');

// Parâmetros de visualização (não essencial para exportação, mas pode ser útil)
var visParams = {
  bands: ['PAR_Daily'],
  min: 0,
  max: 70,
  palette: ['black', 'purple', 'blue', 'yellow', 'orange', 'red']
};

// Definir o centro do mapa e o nível de zoom
Map.setCenter(-60.944, 2.606, 8);

// Adicionar a camada ao mapa (não afeta a exportação, apenas visualiza os dados)
Map.addLayer(
    filteredDataset.mean(), visParams,
    'Surface downwelling photosynthetic radiative flux (W/m^2)');

// Definir a região de interesse (pode ser ajustada conforme necessidade)
var region = ee.Geometry.Point([-60.944, 2.606]); // Mucajaí. Substitua por uma área de interesse

// Função para extrair os valores diários e converter em uma tabela
var getDailyValues = function(image) {
  // Extrair a data da imagem (do nome da coleção, que inclui a data)
  var date = image.date().format('YYYY-MM-dd');  // Formato de data (ano-mês-dia)
  
  // Extrair os valores de PAR para a região de interesse
  var stats = image.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: region,
    scale: 5000, // Ajuste conforme necessário
    maxPixels: 1e8
  });
  
  // Criar uma Feature com a data e o valor de PAR
  return ee.Feature(null, stats).set('date', date);
};

// Aplicar a função a cada imagem na coleção filtrada
var dailyPAR = filteredDataset.map(getDailyValues);

// Exportar a tabela para o Google Drive
Export.table.toDrive({
  collection: dailyPAR,
  description: 'PAR_daily_values_2016_2020',
  fileFormat: 'CSV'
});
