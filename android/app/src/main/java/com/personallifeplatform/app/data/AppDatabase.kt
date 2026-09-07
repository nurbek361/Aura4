package com.personallifeplatform.app.data

import androidx.room.Database
import androidx.room.RoomDatabase

@Database(
    entities = [TaskEntity::class, TransactionEntity::class, SurahProgressEntity::class, GoalEntity::class, AchievementEventEntity::class],
    version = 1,
    exportSchema = true,
)
abstract class AppDatabase : RoomDatabase()