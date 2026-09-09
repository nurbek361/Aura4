package com.personallifeplatform.app.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "tasks")
data class TaskEntity(@PrimaryKey val id: String, val title: String, val done: Boolean, val createdAt: Long)

@Entity(tableName = "transactions", indices = [androidx.room.Index("date")])
data class TransactionEntity(
    @PrimaryKey val id: String,
    val amountMinor: Long,
    val currency: String,
    val kind: String,
    val category: String,
    val description: String,
    val date: Long,
    val createdAt: Long,
    val updatedAt: Long = createdAt,
)

@Entity(tableName = "surah_progress")
data class SurahProgressEntity(@PrimaryKey val number: Int, val isLearned: Boolean, val learningDate: Long?)

@Entity(tableName = "goals")
data class GoalEntity(@PrimaryKey val id: String, val title: String, val description: String, val deadline: Long?, val progress: Int, val status: String)

@Entity(tableName = "achievement_events")
data class AchievementEventEntity(@PrimaryKey val eventId: String, val type: String, val occurredAt: Long)