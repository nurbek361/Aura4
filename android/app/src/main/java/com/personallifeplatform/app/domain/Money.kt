package com.personallifeplatform.app.domain

import java.math.BigDecimal
import java.math.RoundingMode

enum class Currency { KGS, USD, RUB, EUR, KZT, UZS, TJS }

data class Money(val minorUnits: Long, val currency: Currency) {
    fun decimal(): BigDecimal = BigDecimal(minorUnits).movePointLeft(2)
    fun convert(rate: BigDecimal, target: Currency): Money =
        Money(decimal().multiply(rate).setScale(2, RoundingMode.HALF_UP).movePointRight(2).longValueExact(), target)
}