import { createAPI } from "openweatherapi-js-sdk";

export const useWeather = () => {
  const config = useRuntimeConfig();
  const api = createAPI(config.OPEN_WEATHER_KEY);
  const weather = ref();

  const getWeather = async () => {
    weather.value = await api.weather.getWeatherByCityId({
      cityId: 2128295,
      lang: "ja",
      units: "metric",
    });
  };

  return {
    getWeather,
    weather
  };
};
