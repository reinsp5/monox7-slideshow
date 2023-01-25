import { createAPI } from "openweatherapi-js-sdk";
import {
  AnimatedWeatherIcon,
  AnimatedWeatherTypes,
  AnimatedWeatherTimes,
} from "animated-weather-icon";

export const useWeather = () => {
  const config = useRuntimeConfig();
  const api = createAPI(config.OPEN_WEATHER_KEY);
  const weather = ref();
  const weatherIconDOM = ref(document.createElement("div"));
  const weatherIcon = ref(new AnimatedWeatherIcon(weatherIconDOM.value));

  weatherIcon.value.setType(
    AnimatedWeatherTypes.Rain,
    AnimatedWeatherTimes.Day
  );

  const getWeather = async () => {
    weather.value = await api.weather.getWeatherByCityId({
      cityId: 2128295,
      lang: "ja",
      units: "metric",
    });
  };

  return {
    getWeather,
    weather,
    weatherIconDOM,
    weatherIcon,
  };
};
