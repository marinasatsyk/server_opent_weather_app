import mongoose from "mongoose";

export function errorHandler(fn){
    return async function(req, res, next){
        try{
            const result = await fn(req, res);
            res.json(result)
        }catch(err){
            next(err)
        }
    }
}


export function withTransaction(fn){
   
    return async function(req, res, next){
       let result;
       
       await mongoose.connection.transaction(async (session) => {
        result  = await fn(req, res, session);
        return result;
       })
       return result;
    }
}


export function convertUNIXtoISO(timestampUnix) {
if (!timestampUnix || !isValidTimestamp(timestampUnix)) return;
const date = new Date(timestampUnix * 1000); 

const timeZoneOffsetInMinutes = date.getTimezoneOffset();

date.setMinutes(-timeZoneOffsetInMinutes);
date.setSeconds(0);
date.setMilliseconds(0);

const dateISO = date.toISOString();
  return dateISO
}

      
 function isValidTimestamp(date) {
    return new Date(date).getTime() > 0;
}


export function dateToTimestamp(dateString) {
    console.log("dateToTimestamp", dateString);
    const [day, month, year] = dateString.split('/').map(Number);
  
    const date = new Date(`${year}-${month}-${day}`);
  
    const timestampUnix = date.getTime() / 1000;
  
    return timestampUnix;
}

export function getTomorrowDate(dateString) {
    const [day, month, year] = dateString.split('/').map(Number);
  
    const date = new Date(`${year}-${month}-${day}`);
  
    date.setDate(date.getDate() + 1);
  
    const tomorrowDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
  
    return tomorrowDate;
}
  



// console.log("01/12/2022", dateToTimestamp("01/12/2022") )
// console.log("01/12/2022", convertUNIXtoISO(1659304800) )
  
