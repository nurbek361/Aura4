package com.personallifeplatform.app.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun PersonalLifeApp() {
    var tab by remember { mutableIntStateOf(0) }
    val labels = listOf("Главная", "План", "Деньги", "Ещё")
    Scaffold(bottomBar = {
        NavigationBar { labels.forEachIndexed { index, label ->
            NavigationBarItem(selected = tab == index, onClick = { tab = index }, icon = {}, label = { Text(label) })
        } }
    }) { padding ->
        Column(Modifier.fillMaxSize().padding(padding).padding(horizontal = 20.dp, vertical = 18.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
            Text("Мой помощник", style = MaterialTheme.typography.headlineMedium)
            Text("Локальное пространство для спокойного дня.", color = MaterialTheme.colorScheme.onSurfaceVariant)
            Card(Modifier.fillMaxWidth()) { Column(Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text(if (tab == 0) "Сегодня" else labels[tab], style = MaterialTheme.typography.titleLarge)
                Text("Данные доступны офлайн и не отправляются без явного согласия.")
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(onClick = {}) { Text("Открыть") }
                }
            } }
        }
    }
}