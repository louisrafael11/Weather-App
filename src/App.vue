<template>
  <v-app :style="{ background: backgroundColor }">
    <v-container fluid class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="10" md="8" lg="6">
          <v-card class="elevation-12" rounded>
            <v-card-title class="text-h4 font-weight-bold text-center py-4">
              Weather Tracker
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="fetchWeather">
                <v-row>
                  <v-col cols="12" sm="8">
                    <v-text-field
                      v-model="city"
                      label="Enter city"
                      outlined
                      dense
                      @keyup.enter="fetchWeather"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-btn
                      color="green"
                      block
                      @click="fetchWeather"
                      :loading="loading"
                      :disabled="loading"
                    >
                      Add City
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>

              <v-alert v-if="error" type="error" class="mt-4">
                {{ error }}
              </v-alert>

              <!-- Render the containers for multiple cities -->
              <v-row>
                <v-col v-for="(weather, index) in weatherData" :key="index" cols="12" sm="6">
                  <v-card :style="{ backgroundColor: weather.bgColor }" class="rounded-container">
                    <v-card-title class="text-h5">
                      {{ weather.name }}, {{ weather.sys.country }}
                      <v-icon large class="ml-2">{{ weatherIcon(weather.weather[0].main) }}</v-icon>
                    </v-card-title>
                    <v-card-subtitle>{{ weather.weather[0].description }}</v-card-subtitle>
                    <v-card-text>
                      <v-row>
                        <v-col cols="6" class="hover-effect">
                          <v-list-item>
                            <v-list-item-icon>
                              <v-icon>mdi-thermometer</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-title>Temperature</v-list-item-title>
                              <v-list-item-subtitle>{{ weather.main.temp.toFixed(1) }} °C</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-col>
                        <v-col cols="6" class="hover-effect">
                          <v-list-item>
                            <v-list-item-icon>
                              <v-icon>mdi-water-percent</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-title>Humidity</v-list-item-title>
                              <v-list-item-subtitle>{{ weather.main.humidity }}%</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-col>
                        <v-col cols="6" class="hover-effect">
                          <v-list-item>
                            <v-list-item-icon>
                              <v-icon>mdi-weather-windy</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-title>Wind Speed</v-list-item-title>
                              <v-list-item-subtitle>{{ weather.wind.speed.toFixed(1) }} m/s</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-col>
                        <v-col cols="6" class="hover-effect">
                          <v-list-item>
                            <v-list-item-icon>
                              <v-icon>mdi-thermometer-lines</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-title>Feels Like</v-list-item-title>
                              <v-list-item-subtitle>{{ weather.main.feels_like.toFixed(1) }} °C</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data() {
    return {
      city: '',
      weatherData: [], // Holds multiple city weather data
      error: '',
      loading: false,
      backgroundColor: '#E3F2FD',
      bgColors: ['#FFF9C4', '#B3E5FC', '#BBDEFB', '#FCE4EC', '#E1F5FE'],
    };
  },
  methods: {
    async fetchWeather() {
      if (this.city.trim() === '') {
        this.error = 'Please enter a city name.';
        return;
      }

      // Prevent multiple requests when loading
      if (this.loading) return;

      // Check if the city already exists in weatherData to prevent duplication
      const cityExists = this.weatherData.some(
        (weather) => weather.name.toLowerCase() === this.city.toLowerCase()
      );
      if (cityExists) {
        this.error = 'City already added.';
        return;
      }

      this.loading = true;
      this.error = '';

      try {
        const apiKey = '0c18116f082f50f32fb0faffe725eea2'; // Replace with your actual API key
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=${apiKey}`
        );
        const data = await response.json();

        if (data.cod === 200) {
          const randomBgColor = this.bgColors[this.weatherData.length % this.bgColors.length];
          this.weatherData.push({ ...data, bgColor: randomBgColor });
          this.city = ''; // Clear the input field after a successful search
        } else {
          this.error = 'City not found.';
        }
      } catch (error) {
        this.error = 'Unable to fetch weather data.';
      } finally {
        this.loading = false;
      }
    },
    weatherIcon(condition) {
      switch (condition.toLowerCase()) {
        case 'clear':
          return 'mdi-weather-sunny';
        case 'clouds':
          return 'mdi-weather-cloudy';
        case 'rain':
        case 'drizzle':
          return 'mdi-weather-rainy';
        case 'thunderstorm':
          return 'mdi-weather-lightning';
        case 'snow':
          return 'mdi-weather-snowy';
        default:
          return 'mdi-weather-cloudy';
      }
    },
  },
};
</script>

<style scoped>
.hover-effect {
  transition: transform 0.2s;
}

.hover-effect:hover {
  transform: scale(1.05);
  background-color: rgba(0, 0, 0, 0.05);
}

.rounded-container {
  border-radius: 20px;
}
</style>
