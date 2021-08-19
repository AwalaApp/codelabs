package com.example.pingcodelab

import android.app.Application
import androidx.core.content.edit
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import com.fredporciuncula.flow.preferences.FlowSharedPreferences
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.collect
import tech.relaycorp.awaladroid.Awala
import tech.relaycorp.awaladroid.GatewayClient
import tech.relaycorp.awaladroid.endpoint.FirstPartyEndpoint
import tech.relaycorp.awaladroid.endpoint.PublicThirdPartyEndpoint

@ExperimentalCoroutinesApi
class App : Application() {
    val setupDone = Channel<Unit>(0)

    private val coroutineContext = Dispatchers.IO + SupervisorJob()

    lateinit var pingRepository: PingRepository

    lateinit var recipient: PublicThirdPartyEndpoint
    lateinit var sender: FirstPartyEndpoint

    override fun onCreate() {
        super.onCreate()

        pingRepository = PingRepository(
            FlowSharedPreferences(getSharedPreferences("ping", MODE_PRIVATE)),
            Moshi.Builder().add(KotlinJsonAdapterFactory()).build()
        )

        CoroutineScope(coroutineContext).launch {
            Awala.setup(this@App)
            setUpEndpoints()

            // Signal that the setup is complete
            setupDone.offer(Unit)

            collectMessages()
        }
    }

    private suspend fun setUpEndpoints() {
        // Load the recipient's endpoint if it exists, or import it first if necessary
        val recipientPublicAddress = "ping.awala.services"
        recipient = PublicThirdPartyEndpoint.load(recipientPublicAddress)
            ?: PublicThirdPartyEndpoint.import(
                recipientPublicAddress,
                resources.openRawResource(R.raw.pub_endpoint_identity).use {
                    it.readBytes()
                }
            )

        // Get or create the sender's endpoint
        val globalConfig = getSharedPreferences("config", MODE_PRIVATE)
        val senderPrivateAddress = globalConfig.getString("sender", null)
        sender = if (senderPrivateAddress is String) {
            FirstPartyEndpoint.load(senderPrivateAddress)!!
        } else {
            FirstPartyEndpoint.register().also {
                globalConfig.edit {
                    putString("sender", it.privateAddress)
                }
            }
        }
    }

    private suspend fun collectMessages() {
        GatewayClient.receiveMessages().collect {
            val pingId = extractPingIdFromPongMessage(it.content)
            val pingMessage = pingRepository.get(pingId)
            if (pingMessage != null) {
                pingRepository.set(pingMessage.copy(pongDate = System.currentTimeMillis()))
            }

            it.ack()
        }
    }
}
