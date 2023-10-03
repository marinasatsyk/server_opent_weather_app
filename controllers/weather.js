// import WeatherModel from "../models/weather.js";
 import axios from "axios";
 import moment from "moment-timezone";
 import { getTomorrowDate, dateToTimestamp, convertUNIXtoISO } from "../utils/index.js";
 import fs from "node:fs/promises";
import mongoose from "mongoose";

import historicalWeatherModel from "../models/hourlyweather.js";
import chalk from "chalk";



//WORKS history

export const historyWeather = async (req, res) => {
  console.log("hello", req.url);
      const appId = process.env.STUDENT_API_key;
       const start = dateToTimestamp(req.body.start); //format string "01/01/2022, date strictement 1 an avant de requete"
      const end = dateToTimestamp(req.body?.end);
      const lat = req.body.lat; //latitude d'une ville
      const lon = req.body.lon; //longitude d'une ville
      const type = req.body.type; //type ex hourly pour chaque 
      const zipCode = req.body.zip;
      console.log(lat,
          lon,
          type,
          // start,
          appId)
      console.log('in hourlyweather avant axios')
      
      // fetchYearlyWeather(start, end, lat, lon, type, appId)
      // .then((yearlyData) => {
      //   // Traitement des données annuelles ici
      //   console.log("Données météorologiques annuelles :", yearlyData);
      // })
      // .catch((error) => {
      //   console.error("Erreur lors de la récupération des données :", error);
      // });
       try {
        const yearlyData = await fetchYearlyWeather(start, end, lat, lon, type, appId);
        
          // Convertissez les données en une chaîne JSON.
          // const jsonData = JSON.stringify(yearlyData, null, 2); // Le paramètre "null, 2" permet d'obtenir une mise en forme lisible.

          // Spécifiez le nom du fichier dans lequel vous souhaitez enregistrer les données.
          // const fileName = 'donnees.json';

          // Utilisez la fonction writeFile pour enregistrer les données dans le fichier.
          // fs.writeFile(fileName, jsonData, (err) => {
          //   if (err) {
          //     console.error('Une erreur s\'est produite lors de l\'enregistrement du fichier :', err);
          //   } else {
          //     console.log('Les données ont été enregistrées dans le fichier avec succès.');
          //   }
          // });

          console.log(chalk.blue("yearlyData")  , chalk.bgGreen("length", yearlyData.length), yearlyData)
        // Traitement des données annuelles ici
        for(const dataItem of yearlyData[0]){
          const existingRecord = await historicalWeatherModel.findOne({
            dt: dataItem.dt , // Convertissez la date UNIX en objet Date
            zip: zipCode, // Remplacez par la valeur correcte pour zip
          });

          if(existingRecord){
            const error = new Error();
            error.message = `for ${dataItem.dt} the records exists`;
            throw error;
          }
          // console.log(chalk.redBright(dataItem.dt), dataItem.main);
          if (!existingRecord) {
            const historicalWeather = new historicalWeatherModel({
              dt: dataItem.dt, // Convertissez la date UNIX en objet Date
              main: {
                temp: dataItem.main.temp,
                feels_like: dataItem.main.feels_like,
                pressure: dataItem.main.pressure,
                humidity: dataItem.main.humidity,
                temp_min: dataItem.main.temp_min,
                temp_max: dataItem.main.temp_max,
              },
              wind: {
                speed: dataItem.wind.speed,
                deg: dataItem.wind.deg,
              },
              clouds: {
                all: dataItem.clouds.all,
              },
               weather: dataItem.weather.map(item => {
                return{id: item.id,
                      main: item.main,
                      description: item.description,
                      icon: item.icon,
                    }               }),
             // [
              //   {
              //     id: dataItem.weather[0].id,
              //     main: dataItem.weather[0].main,
              //     description: dataItem.weather[0].description,
              //     icon: dataItem.weather[0].icon,
              //   },
              // ],
              zip: zipCode, // Remplacez par la valeur correcte pour zip
            });
        // console.log(chalk.redBright("historicalWeather"), historicalWeather);
             await historicalWeather.save();
            console.log(chalk.bgGreenBright('Nouvel enregistrement inséré dans la base de données.'));
          }

          console.log("********Données météorologiques annuelles :", yearlyData);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }

}


export const currentweather = async (req, res) =>  {

}


export const statisticWeather = async (req, res) =>  {

}

export const previousWeather = async (req, res) => {
  //api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt={cnt}&appid={API key}
}

//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
//http://api.openweathermap.org/geo/1.0/zip?zip={zip code},{country code}&appid={API key}
// http://api.openweathermap.org/geo/1.0/zip?zip=06270,FR&appid=804d50c4c95ef933a7b068b9edbc5435
export const getCurrentLocation =  async (req, res) =>  {
  let opts = {
    enableHighAccurace: true,
    timeout: 1000*10,
    maximumAge: 1000*60*5
  };
  navigator.geolocation.getCurrentPosition(app.ftw, app.wtf, opts);
}

const ftw = () => {
  
}
const wtf = () => {

}

async function getWeatherData(start, end, lat, lon, type, appId) {
  console.log("in getWeatherData")
  const response = await axios.get(process.env.URI_HISTORY_WEATHER, {
    params: {
      lat,
      lon,
      type,
      start,
      end,
      units: "metric", // Celsius
      appId
    }
  });
  return response.data; // Supposons que la réponse contient les données météorologiques
}

// Fonction récursive avec délai pour récupérer l'historique météorologique pour une année complète
async function fetchYearlyWeather(startDateUnix, endDateUnix, lat, lon, type, appId) {
  const data = [];

  while (startDateUnix < endDateUnix) {
    console.log("while", convertUNIXtoISO(startDateUnix), convertUNIXtoISO(endDateUnix))
    const endOfPeriodUnix = startDateUnix + 7 * 24 * 60 * 60; // Ajoute 7 jours en secondes UNIX

    const weatherData = await getWeatherData(
      startDateUnix,
      endOfPeriodUnix,
      lat,
      lon,
      type,
      appId
    );
    
    const convertedWeatherData = {
      ...weatherData,
      list: weatherData.list.map((item) => ({
        ...item,
        dt: convertUNIXtoISO(item.dt)
      }))
    };
    data.push(convertedWeatherData.list);

    startDateUnix = endOfPeriodUnix; // Met à jour la date de début pour la prochaine itération

    // Attendez 500 millisecondes avant de lancer la prochaine requête
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // À ce stade, "data" contient les données météorologiques pour chaque période de 7 jours
  // Vous pouvez traiter ces données ou les renvoyer, selon vos besoins
  return data;
}
