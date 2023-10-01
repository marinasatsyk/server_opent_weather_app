
import Mongoose from "mongoose";
import { convertUNIXtoISO } from "../utils.js";

const hourlyWeatherSchema = new Mongoose.Schema(
    {
        dt: { type: Date,  set: d => convertUNIXtoISO(d) },
        main: {
          temp: {type: Number, required: true},
          feels_like: {type: Number, required: true},
          pressure: {type: Number, required: true},
          humidity: {type: Number, required: true},
          temp_min: {type: Number, required: true},
          temp_max: {type: Number, required: true}
        },
        wind: {
          speed: {type: Number, required: true},
          deg: {type: Number, required: true}
        },
        clouds: {
          all: {type: Number, required: true}
        },
        weather: [
          {
            id: {type: Number, required: true},
            main: {type: String, required: true},
            description:{type: String, required: true},
            icon: {type: String, required: true}
          }
        ]
      },
    
    )
    

const hourlyWeatherModel = Mongoose.model("Weather", hourlyWeatherSchema);

export default hourlyWeatherModel;