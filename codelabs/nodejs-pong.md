summary: Build a public endpoint using Node.js
id: nodejs-pong
categories: nodejs
tags: medium
status: Published
authors: Gus Narea
Feedback Link: https://github.com/AwalaNetwork/codelabs

# Build a public endpoint using Node.js

## Overview

Duration: 0:5:00

An _Awala service_ is a collection of mobile, desktop, server-side and/or CLI apps that exchange mutually-intelligible messages using _endpoints_. Server-side apps exposed as Internet hosts will have _public endpoints_ (e.g., `your-service.com`), whilst all other apps (e.g., mobile, desktop) will have _private endpoints_.

The service is _centralised_ if there's a public endpoint as the sender or recipient of all messages, or _decentralised_ if all endpoints are private. Alternatively, if there's a public endpoint involved in some but not necessarily all messages, then the service is _hybrid_.

Anyone can define Awala services, but to keep this codelab simple, we'll just build an Android app for [Awala Ping](https://specs.awala.network/RS-014), which is a trivial service used to test Awala implementations.

### What you'll build

You'll build an Android app that will send _ping_ messages to the public endpoint at `ping.awala.services`, and it'll also receive _pong_ messages from said public endpoint. Awala Ping is a hybrid service, but we'll use it as a centralised service here. Your app will look like this:

![](./images/android-centralised/app-screenshot.png)

As illustrated in the picture below, when you send a ping from your Android app to `ping.awala.services`, the message will pass through the [private gateway](https://play.google.com/store/apps/details?id=tech.relaycorp.gateway) and then on to the public gateway (at `frankfurt.relaycorp.cloud`, for example).

![](./images/android-centralised/service-architecture-ping.png)

On the other hand, `ping.awala.services` has to respond to your ping by sending a pong message back via the same gateways as illustrated below:

![](./images/android-centralised/service-architecture-pong.png)

Awala requires messages bound for private endpoints (such as the one inside this Android app) to be pre-authorised by the recipient, so that means your ping message will have to include an authorisation for `ping.awala.services` to reply with a pong message. In a regular service, authorisations would be issued once and renewed periodically, but `ping.awala.services` is stateless, so your app will have to issue an authorisation each time.

You'll be using the Android endpoint library _[awaladroid](https://github.com/relaycorp/awala-endpoint-android)_ to send and receive messages via the private gateway.

### What you'll need

- Prior experience building Android apps. If you've never built an Android app, the [first app guide](https://developer.android.com/training/basics/firstapp) will teach you what you need to complete this codelab.
- [Android Studio](https://developer.android.com/studio) 4.1+.
- An Android phone or table running Android 5+.
- The [private gateway](https://play.google.com/store/apps/details?id=tech.relaycorp.gateway) installed on that Android device.

### In case you need help

If you have any issues in the course of this codelab, please post a message on [our forum](https://community.awala.network/) and we'll help you out! You can also check out the [final version of the app you're going to build](https://github.com/AwalaNetwork/codelabs/tree/main/examples/android-centralised).

## Set up Google App Engine

Duration: 0:10:00

https://console.cloud.google.com/apis/library/cloudbuild.googleapis.com

gcloud config set project myProject

gcloud app deploy

## Generate an identity certificate

Duration: 0:5:00

## Process incoming pings

Duration: 0:10:00

## Send pongs

Duration: 0:10:00

## Test it with an Android app

Duration: 0:10:00

## That's it!

Duration: 0:3:00

Well done! You've just built an Android app for a centralised Awala service.

### Delete the GCP project



### What's next?

- Learn more about the [architecture of Awala services](https://awala.network/service-providers/implementation/architecture).
- Read the [API documentation for awaladroid](https://docs.relaycorp.tech/awala-endpoint-android/).
- [Join the Awala community](https://community.awala.network/) and give us some feedback on the codelab.
- [Share what you've just done on Twitter](https://twitter.com/intent/tweet?url=https%3A%2F%2Fawala.network%2Fservice-providers%2F&via=AwalaNetwork&text=I%27ve%20just%20built%20an%20app%20that%20can%20sync%20with%20the%20Internet%20even%20if%20the%20user%20is%20disconnected%20from%20it%21).
