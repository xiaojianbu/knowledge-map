import WeatherData from './WeatherData'
import CurrentConditionsDisplay from './CurrentConditionsDisplay'

let oWeatherData = new WeatherData()
// eslint-disable-next-line
new CurrentConditionsDisplay(oWeatherData)
oWeatherData.setMeasurements(80, 65, 30.4)
