package com.example.pingcodelab

import com.squareup.moshi.Moshi
import com.squareup.moshi.Types
import com.fredporciuncula.flow.preferences.FlowSharedPreferences
import com.fredporciuncula.flow.preferences.Serializer
import kotlinx.coroutines.ExperimentalCoroutinesApi

data class Ping(
    val id: String,
    val date: Long = System.currentTimeMillis(),
    val pongDate: Long? = null
)

@ExperimentalCoroutinesApi
class PingRepository(
    private val flowSharedPreferences: FlowSharedPreferences,
    private val moshi: Moshi
) {
    private val repo by lazy {
        val serializer = object : Serializer<List<Ping>> {
            private val adapter = moshi.adapter<List<Ping>>(
                Types.newParameterizedType(
                    List::class.java,
                    Ping::class.java
                )
            )

            override fun deserialize(serialized: String) =
                adapter.fromJson(serialized) ?: emptyList()

            override fun serialize(value: List<Ping>) =
                adapter.toJson(value)
        }

        flowSharedPreferences.getObject(
            "pings",
            serializer,
            emptyList()
        )
    }

    fun observe() = repo.asFlow()

    fun get(id: String) =
        repo.get().firstOrNull { it.id == id }

    suspend fun set(message: Ping) {
        repo.setAndCommit(
            repo.get()
                .filterNot { it.id == message.id }
                    + message
        )
    }

    suspend fun clear() {
        repo.setAndCommit(emptyList())
    }
}