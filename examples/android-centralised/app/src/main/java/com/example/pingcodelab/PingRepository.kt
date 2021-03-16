package com.example.pingcodelab

import com.squareup.moshi.Moshi
import com.squareup.moshi.Types
import com.tfcporciuncula.flow.FlowSharedPreferences
import com.tfcporciuncula.flow.Serializer
import kotlinx.coroutines.ExperimentalCoroutinesApi

data class PingMessage(
    val id: String,
    val sent: Long = System.currentTimeMillis(),
    val received: Long? = null
)

@ExperimentalCoroutinesApi
class PingRepository(
    private val flowSharedPreferences: FlowSharedPreferences,
    private val moshi: Moshi
) {
    private val repo by lazy {
        val serializer = object : Serializer<List<PingMessage>> {
            private val adapter = moshi.adapter<List<PingMessage>>(
                Types.newParameterizedType(
                    List::class.java,
                    PingMessage::class.java
                )
            )

            override fun deserialize(serialized: String) =
                adapter.fromJson(serialized) ?: emptyList()

            override fun serialize(value: List<PingMessage>) =
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

    suspend fun set(message: PingMessage) {
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