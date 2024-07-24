// Importa a coleção de imagens Landsat 8 TOA (Top of Atmosphere).
var landsat8 = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA');

// Função para calcular o NDVI
// NDVI = (NIR - Vermelho) / (NIR + Vermelho)
var calcularNDVI = function(image) {
  return image.normalizedDifference(['B5', 'B4']).rename('NDVI');
};


// Periodo 01: Media do NDVI do mes de OUTUBRO de 2023 (Periodo Chuvoso):
// Define o intervalo de datas para outubro de 2023.
var inicioOutubro2023 = '2023-10-01';
var fimOutubro2023 = '2023-10-31';

// Filtra a coleção para o período de outubro de 2023.
var colecaoOutubro2023 = landsat8.filterDate(inicioOutubro2023, fimOutubro2023);

// Aplica a função de NDVI para a coleção de outubro de 2023.
var ndviOutubro2023 = colecaoOutubro2023.map(calcularNDVI);

// Calcula a média do NDVI para o período de outubro de 2023.
var mediaNdviOutubro2023 = ndviOutubro2023.mean();


// Periodo 02: Media do NDVI do mes de ABRIL de 2024 (Periodo Estiagem):
// Define o intervalo de datas para abril de 2024.
var inicioAbril2024 = '2024-04-01';
var fimAbril2024 = '2024-04-30';

// Filtra a coleção para o período de abril de 2024.
var colecaoAbril2024 = landsat8.filterDate(inicioAbril2024, fimAbril2024);

// Aplica a função de NDVI para a coleção de abril de 2024.
var ndviAbril2024 = colecaoAbril2024.map(calcularNDVI);

// Calcula a média do NDVI para o período de abril de 2024.
var mediaNdviAbril2024 = ndviAbril2024.mean();


// Parâmetros de VISUALIZAÇÃO para o NDVI.
var visParams = {
  min: 0,
  max: 1,
  palette: [
      'FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718',
      '74A901', '66A000', '529400', '3E8601', '207401', '056201',
      '004C00', '023B01', '012E01', '011D01', '011301'
  ]
};

// CENTRALIZA o mapa em uma localização de interesse (exemplo: coordenadas específicas).
Map.setCenter(-60.6676, 2.8292, 12); //(LONG, LAT, ZOOM)

// Adiciona as camadas de NDVI para os dois períodos ao mapa.
Map.addLayer(mediaNdviOutubro2023, visParams, 'Média NDVI Outubro 2023');
Map.addLayer(mediaNdviAbril2024, visParams, 'Média NDVI Abril 2024');
