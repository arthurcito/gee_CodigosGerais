/*
* O Script foi dividido em tres partes:
* 1- Adicao de um mapa base para auxiliar na escolha das amostras
* para calculo dos endmembers;
* 2- Adicao da cena Landsat8 alvo, com destaque para a area de estudo;
* 3- Codigo com aplicacao do Modelo Linear de Mistura Espectral
* este codigo foi baseado na aula do Prof. Dr. Luis Sadeck
* (link: https://www.youtube.com/watch?v=v29Sx5QcDxE&t=320s);
*/



//-------1 - Mapa Base: Planet-------//
// This collection is not publicly accessible. To sign up for access,
// please see https://developers.planet.com/docs/integrations/gee/nicfi
var nicfi = ee.ImageCollection('projects/planet-nicfi/assets/basemaps/americas');

// Filter basemaps by date and get the first image from filtered results
var basemap= nicfi.filter(ee.Filter.date('2023-11-01','2023-12-01')).first();

Map.centerObject(table,10);

var vis = {'bands':['R','G','B'],'min':64,'max':5454,'gamma':1.8};

Map.addLayer(basemap, vis, 'Planet - Nov 2023 Mosaic');
Map.addLayer(
    basemap.normalizedDifference(['N','R']).rename('NDVI'),
    {min:-0.55,max:0.8,palette: [
        '8bc4f9', 'c9995c', 'c7d270','8add60','097210'
    ]}, 'NDVI - Planet (Nov 2023)', false);



//-------2 - Imagem Landsat8 Alvo-------//
var l8img = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_231060_20231120')

//Map.setCenter(-60.4753, 0.6961, 10);
Map.addLayer(l8img,imageVisParam, 'Barni_Landsat8_20nov2023');
Map.addLayer(table.style({color:'black', fillColor:'ff000000'}), {}, "Área de Estudo");



//-------3 - Script do MLME-------//
var l8Bandas = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_231060_20231120')
    .select('SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6');

var veg = l8Bandas.reduceRegion(ee.Reducer.mean(), veg_em, 30).values();
var solo = l8Bandas.reduceRegion(ee.Reducer.mean(), solo_em, 30).values();
var agua_sombra = l8Bandas.reduceRegion(ee.Reducer.mean(), agua_em, 30).values();

var mlme = l8Bandas.unmix([agua_sombra, solo, veg]);

Map.addLayer(mlme, {}, "MLME");

Map.addLayer(mlme.select(0), imageVisParamAgua, "Água/Sombra - Imagem Fração");
Map.addLayer(mlme.select(1), imageVisParamSolo, "Solo - Imagem Fração");
Map.addLayer(mlme.select(2), imageVisParamVegetacao, "Vegetacao - Imagem Fração");

Map.addLayer(table.style({color:'white', fillColor:'ff000000'}), {}, "Área de Estudo");
