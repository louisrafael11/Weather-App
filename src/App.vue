<template>
  <v-app :style="{ background: backgroundColor }">
    <v-container fluid class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="10" md="8" lg="6">
          <v-card class="elevation-12">
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
                      color="primary"
                      block
                      @click="fetchWeather"
                      :loading="loading"
                      :disabled="loading"
                    >
                      Get Weather
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>

              <v-alert v-if="error" type="error" class="mt-4">
                {{ error }}
              </v-alert>

              <v-card v-if="weather" class="mt-4">
                <v-card-title class="text-h5">
                  {{ weather.name }}, {{ weather.sys.country }}
                  <v-icon large class="ml-2">{{ weatherIcon }}</v-icon>
                </v-card-title>
                <v-card-subtitle>
                  {{ weather.weather[0].description }}
                </v-card-subtitle>
                <v-card-text>
                  <v-row>
                    <v-col cols="6">
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
                    <v-col cols="6">
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
                    <v-col cols="6">
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
                    <v-col cols="6">
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

              <v-card v-if="forecast" class="mt-4">
                <v-card-title class="text-h6">5-Day Forecast</v-card-title>
                <v-card-text>
                  <v-chart class="chart" :option="chartOption" autoresize />
                </v-card-text>
              </v-card>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn
                v-if="weather"
                color="primary"
                text
                @click="showDetails = !showDetails"
              >
                {{ showDetails ? 'Hide' : 'Show' }} More Details
              </v-btn>
            </v-card-actions>
            <v-expand-transition>
              <v-card-text v-if="showDetails && weather">
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Detail</th>
                        <th class="text-left">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Pressure</td>
                        <td>{{ weather.main.pressure }} hPa</td>
                      </tr>
                      <tr>
                        <td>Visibility</td>
                        <td>{{ (weather.visibility / 1000).toFixed(1) }} km</td>
                      </tr>
                      <tr>
                        <td>Sunrise</td>
                        <td>{{ new Date(weather.sys.sunrise * 1000).toLocaleTimeString() }}</td>
                      </tr>
                      <tr>
                        <td>Sunset</td>
                        <td>{{ new Date(weather.sys.sunset * 1000).toLocaleTimeString() }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
            </v-expand-transition>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent])

export default {
  name: 'App',

  data() {
    return {
      city: '',
      weather: null,
      forecast: null,
      error: '',
      loading: false,
      showDetails: false,
      backgroundColor: '#E3F2FD',
      chartOption: {
        title: {
          text: '5-Day Temperature Forecast'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} °C'
          }
        },
        series: [{
          name: 'Temperature',
          type: 'line',
          data: [],
          smooth: true
        }]
      }
    }
  },
  computed: {
    components: {
    VChart
  },
  provide: {
    [THEME_KEY]: 'light'
  },
    weatherIcon() {
      if (!this.weather) return ''
      const condition = this.weather.weather[0].main.toLowerCase()
      switch (condition) {
        case 'clear':
          return 'mdi-weather-sunny'
        case 'clouds':
          return 'mdi-weather-cloudy'
        case 'rain':
        case 'drizzle':
          return 'mdi-weather-rainy'
        case 'thunderstorm':
          return 'mdi-weather-lightning'
        case 'snow':
          return 'mdi-weather-snowy'
        default:
          return 'mdi-weather-cloudy'
      }
    }
  },
  methods: {
    async fetchWeather() {
      if (this.city.trim() === '') {
        this.error = 'Please enter a city name.'
        return
      }
      this.loading = true
      this.error = ''
      try {
        const apiKey = '0c18116f082f50f32fb0faffe725eea2' // Replace with your actual API key
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=${apiKey}`
        )
        const weatherData = await weatherResponse.json()

        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${this.city}&units=metric&appid=${apiKey}`
        )
        const forecastData = await forecastResponse.json()

        if (weatherData.cod === 200 && forecastData.cod === '200') {
          this.weather = weatherData
          this.forecast = forecastData
          this.updateBackgroundColor(weatherData.weather[0].main)
          this.updateForecastChart(forecastData)
        } else {
          this.error = 'City not found.'
          this.weather = null
          this.forecast = null
        }
      } catch (error) {
        this.error = 'Unable to fetch weather data.'
        this.weather = null
        this.forecast = null
      }
      this.loading = false
    },
    updateBackgroundColor(weatherCondition) {
      switch (weatherCondition.toLowerCase()) {
        case 'clear':
          this.backgroundColor = '#FFF9C4'
          break
        case 'clouds':
          this.backgroundColor = '#B3E5FC'
          break
        case 'rain':
          this.backgroundColor = '#BBDEFB'
          break
        case 'thunderstorm':
          this.backgroundColor = '#FCE4EC'
          break
        case 'snow':
          this.backgroundColor = '#E1F5FE'
          break
        default:
          this.backgroundColor = '#E3F2FD'
      }
    },
    updateForecastChart(forecastData) {
      const temperatures = forecastData.list.map(item => item.main.temp);
      const dates = forecastData.list.map(item => new Date(item.dt * 1000).toLocaleDateString());
      
      this.chartOption.xAxis.data = dates;
      this.chartOption.series[0].data = temperatures;
    }
  }
}
</script>

<style scoped>
.chart {
  width: 100%;
  height: 300px;
}
</style>
