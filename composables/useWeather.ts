import { createAPI } from "openweatherapi-js-sdk";

export const useWeather = () => {
  const config = useRuntimeConfig();
  const api = createAPI(config.OPEN_WEATHER_KEY);
  const weather = ref();
  const weatherIcon = ref("not-available");

  const getWeather = async () => {
    weather.value = await api.weather.getWeatherByCityId({
      cityId: config.CITY_ID,
      lang: "ja",
      units: "metric",
    });
    setWeatherIcon(weather.value.weather[0].icon);
  };

  // アイコンコードを基にアイコンを設定
  const setWeatherIcon = (iconId: string) => {
    switch (iconId) {
      case "01d": // 日中
        weatherIcon.value = "clear-day"; // 晴れ
        break;
      case "02d":
        weatherIcon.value = "partly-cloudy-day"; // 晴れ時々曇り
        break;
      case "03d":
        weatherIcon.value = "cloudy"; // 曇り
        break;
      case "04d":
        weatherIcon.value = "cloudy"; // 曇り
        break;
      case "09d":
        weatherIcon.value = "extreme-day-rain"; // 雨
        break;
      case "10d":
        weatherIcon.value = "rain"; // 雨
        break;
      case "11d":
        weatherIcon.value = "thunderstorms-day-extreme"; // 雷
        break;
      case "13d":
        weatherIcon.value = "overcast-day-snow"; // 雪
        break;
      case "50d":
        weatherIcon.value = "mist"; // 霧
        break;
      case "01n": // 夜間
        weatherIcon.value = "cloudy"; // 晴れ
        break;
      case "02n":
        weatherIcon.value = "partly-cloudy-night"; // 晴れ時々曇り
        break;
      case "03n":
        weatherIcon.value = "cloudy"; // 晴れ
        break;
      case "04n":
        weatherIcon.value = "cloudy"; // 晴れ
        break;
      case "09n":
        weatherIcon.value = "extreme-night-rain"; // 雨
        break;
      case "10n":
        weatherIcon.value = "rain"; // 雨
        break;
      case "11n":
        weatherIcon.value = "thunderstorms-night-extreme"; // 雷
        break;
      case "13n":
        weatherIcon.value = "overcast-night-snow"; // 雪
        break;
      case "50n":
        weatherIcon.value = "mist"; // 霧
        break;
      default:
        weatherIcon.value = "not-available";
        break;
    }
  };

  return {
    getWeather,
    weather,
    weatherIcon,
  };
};
