import React, {useState, useEffect} from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import Autocomplete from 'react-google-autocomplete';
import Style from '../Components/css/LocationFinder.module.css'
import axios from 'axios'
import Geocode from "react-geocode";

export default function LocationFinder() {

  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY

  Geocode.setApiKey(apiKey);

  Geocode.setLanguage("en");

  Geocode.setRegion("en");

  Geocode.setLocationType("ROOFTOP");

  Geocode.enableDebug();

  const [inputtedLocation, setInputtedLocation] = useState()
  const [weatherData, setWeatherData] = useState()
  const [icon, setIcon] = useState()
  const [temp, setTemp] = useState()
  const [tempConverter, setTempConverter] = useState()
  const [tempHolder, setTempHolder] = useState()
  const [cAndF, setCAndF] = useState('Change to &deg;F')
  const [time, setTime] = useState()

  useEffect(() => {

    // get and set time
    let options = { hour: '2-digit', minute: '2-digit', second: '2-digit',weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    
    const dateHolder = String(new Date().toLocaleString('en-US', options));
    setTime(dateHolder)

    axios.post(`http://localhost:4000/onLoad`,{
    // Default to Wellington
    lat: '-41.2923814',
    lng: '174.7787463',
    }).then((res) => {
        const clouds = res.data.weather[0].description
        const icon = res.data.weather[0].icon
        const celcius = res.data.main.temp
        const location = res.data.name
        
        setWeatherData(clouds)
        setIcon(`http://openweathermap.org/img/wn/${icon}@2x.png`)
        setTemp(parseFloat(celcius).toFixed(1))
        setInputtedLocation(location)

        setTempConverter(parseFloat(celcius).toFixed(1))
        setTempHolder('&deg;C')
    })
        
  },[])

  const location = () => {
    const locationInput = document.getElementById('selectedLocation').value

    setInputtedLocation(locationInput)

    Geocode.fromAddress(locationInput)
    .then((response) => {
        const lat = response.results[0].geometry.location.lat;
        const lng = response.results[0].geometry.location.lng;

        axios.post(`http://localhost:4000/weather`,{
          lat: lat,
          test: 'TEST',
          lng: lng})
        .then((res) => {
          const clouds = res.data.weather[0].description
          const icon = res.data.weather[0].icon
          const celcius = res.data.main.temp
          const time = res.data.timezone

          setWeatherData(clouds)
          setIcon(`http://openweathermap.org/img/wn/${icon}@2x.png`)
          setTemp(parseFloat(celcius).toFixed(1))
          
          setTempConverter(parseFloat(celcius).toFixed(1))
          setTempHolder('&deg;C')
          
          return 
        })
        return

      }
    );
    return
  }

  const tempConversion = () => {
    
    // const fToC = (temp - 32) * 5/9 
    const cToF = (temp * 9/5) + 32 
    
    if(tempConverter === temp){
      setTempConverter(parseFloat(cToF).toFixed(1))
      setTempHolder(`&deg; F`)
      setCAndF('Change to &deg;C')
    } else {
      setTempConverter(parseFloat(temp).toFixed(1))
      setTempHolder('&deg;C')
      setCAndF('Change to &deg;F')
    }
  }

  return (
    <div className={Style.locationFinderBody}>
        <div className={Style.locationFinderTitle}>
            Weather API
        </div>
        <div>
            <Autocomplete 
            apiKey={apiKey}
            placeholder='Enter Location'
            id='selectedLocation'
            className={Style.inputBox}
            />
        </div>
            <div className={Style.submitBtn} onClick={location}>
              SUBMIT
            </div>
        <div className={Style.weatherInfo}>
            <div>
              {time}
            </div>
            <div className={Style.weatherLocation}>
              {inputtedLocation}  
            </div>
            
            <div className={Style.weatherTemp}>
                {tempConverter}<span dangerouslySetInnerHTML={{__html: tempHolder}} /><br/>
            </div>
            <div className={Style.weatherIcon}>
                <img src={icon} alt={weatherData}/>
            </div>
            <div className={Style.weatherDescription}>
                {weatherData}
            </div>
            <div onClick={tempConversion} className={Style.tempButton}><span dangerouslySetInnerHTML={{__html: cAndF}} />
            </div>
        </div>
    </div>
  )
}
