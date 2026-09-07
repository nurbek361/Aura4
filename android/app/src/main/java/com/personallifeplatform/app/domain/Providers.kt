package com.personallifeplatform.app.domain

import java.math.BigDecimal

data class WeatherSnapshot(val temperatureCelsius: BigDecimal, val description: String, val fetchedAt: Long, val isCached: Boolean)
data class NewsItem(val title: String, val source: String, val originalUrl: String, val publishedAt: Long)
data class CurrencyRate(val base: Currency, val quote: Currency, val value: BigDecimal, val source: String, val asOf: Long)

interface WeatherProvider { suspend fun current(latitude: Double, longitude: Double): Result<WeatherSnapshot> }
interface NewsProvider { suspend fun latest(category: String): Result<List<NewsItem>> }
interface CurrencyProvider { suspend fun rates(base: Currency): Result<List<CurrencyRate>> }
interface AirQualityProvider { suspend fun current(latitude: Double, longitude: Double): Result<Int?> }
interface GeocodingProvider { suspend fun city(latitude: Double, longitude: Double): Result<String> }
interface BookProvider { suspend fun search(query: String): Result<List<String>> }