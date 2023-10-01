// import WeatherModel from "../models/weather.js";
 import axios from "axios";
 import { getTomorrowDate, dateToTimestamp, convertUNIXtoISO } from "../utils/index.js";




//WORKS history

export const historyWeather = async (req, res) => {
  console.log("hello", req.url);
      const appId = process.env.STUDENT_API_key;
      const start = dateToTimestamp(req.body.start); //format string "01/01/2022, date strictement 1 an avant de requete"
      const end = dateToTimestamp(req.body?.end);
      const lat = req.body.lat; //latitude d'une ville
      const lon = req.body.lon; //longitude d'une ville
      const type = req.body.type; //type ex hourly pour chaque 
      console.log(lat,
          lon,
          type,
          start,
          appId)
      console.log('in hourlyweather avant axios')
      
      //prvoire tous les parametres de la requete 
  await axios.get(process.env.URI_HISTORY_WEATHER, {
          params: {
              lat: lat,
              lon: lon,
              type: type,
              start: start,
              end: end,
              units:"metric", //celcius
              appId: appId
          }
      })
              .then(function (response) {
                  // en cas de réussite de la requête
                  
                  const data   = response.data.list;

                  data.map(infoblock => {
                    infoblock.dt = convertUNIXtoISO(infoblock.dt);
                  });

                  // data.map(item => {
                  //   console.log(item.dt)
                  // })
                  console.log('reponse axios', data.length, data[0],data[data.length-2], data[data.length-1]);
                  res.status(200);
                  res.send(data);
              })
              .catch(function (error) {
                  // en cas d’échec de la requête
                  console.error(error);
              })
              .finally(function () {
                  // dans tous les cas
              });
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

