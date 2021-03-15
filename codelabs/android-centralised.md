summary: Build an Android app for a centralised Awala service
id: android-centralised
categories: Android
tags: medium
status: Published
authors: Gus Narea
Feedback Link: https://github.com/AwalaNetwork/codelabs

# Build an Android app for a centralised Awala service

## Overview

Duration: 0:5:00

An _Awala service_ is a collection of mobile, desktop, server-side and/or CLI apps that exchange mutually-intelligible messages using _endpoints_. Server-side apps exposed as Internet hosts will have _public endpoints_ (e.g., `your-service.com`), whilst all other apps (e.g., mobile, desktop) will have _private endpoints_.

The service is _centralised_ if there's a public endpoint as the sender or recipient of all messages, _decentralised_ if all endpoints are private. Alternatively, if there's a public endpoint involved in some but not necessarily all messages, then the service is _hybrid_.

Anyone can define Awala services, but to keep this codelab simple, we'll just build an Android app for [Awala Ping](https://specs.awala.network/RS-014), which is a trivial service used to test Awala implementations.

### What you'll build

You'll build an Android app that will send _ping_ messages to the public endpoint at `ping.awala.services`, and it'll also receive _pong_ messages from said public endpoint. Awala Ping is a hybrid service, but we'll use it as a centralised service here. Your app will look like this:

![](./images/android-centralised/app-screenshot.png)

As illustrated in the picture below, when you send a ping from your Android app to `ping.awala.services`, the message will pass through the local Awala gateway and then on to the public gateway (at `frankfurt.relaycorp.cloud`, for example).

![](./images/android-centralised/service-architecture-ping.png)

On the other hand, `ping.awala.services` has to respond to your ping by sending a pong message back via the same gateways as illustrated below:

![](./images/android-centralised/service-architecture-pong.png)

### What you'll need

- Prior experience building Android apps. If you've never built an Android app, the [first app guide](https://developer.android.com/training/basics/firstapp) will teach you what you need to complete this codelab.
- [Android Studio](https://developer.android.com/studio) 4+.
- An Android phone or table running Android 5+.
- The [private gateway](https://play.google.com/store/apps/details?id=tech.relaycorp.gateway) installed on that Android device.

## Set up a new project

Duration: 0:5:00

Let's create a new project on Android Studio by going to `File` -> `New` -> `New project...`. Once in the wizard, select the empty activity template and click `Next`.

![](./images/android-centralised/android-studio-project-template.png)

In the final screen, make sure to leave Kotlin as the programming language and API 21 as the minimum Android SDK.

![](./images/android-centralised/android-studio-project-config.png)

### Define dependencies

Open `app/build.gradle` and add the following inside `dependencies { ... }`:

```groovy
    // Awala
    implementation 'tech.relaycorp:awaladroid:1.5.1'
    // Preferences
    implementation 'androidx.preference:preference-ktx:1.1.1'
    implementation 'com.github.tfcporciuncula.flow-preferences:flow-preferences:1.3.4'
    implementation 'com.squareup.moshi:moshi:1.9.3'
    implementation 'com.squareup.moshi:moshi-kotlin:1.9.3'
```

Android Studio should now be recommending that you do a project sync following the change to your build file. Accept it.

### Implement user interface

Replace the contents of `src/main/res/layout/activity_main.xml` with the following:

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
              xmlns:tools="http://schemas.android.com/tools"
              android:layout_width="match_parent"
              android:layout_height="match_parent"
              android:clipChildren="false"
              android:clipToPadding="false"
              android:orientation="vertical"
              android:padding="16dp"
              tools:context=".MainActivity">

    <androidx.core.widget.NestedScrollView
            android:layout_width="match_parent"
            android:layout_height="0dp"
            android:layout_weight="1">

        <TextView
                android:id="@+id/pings"
                android:layout_width="match_parent"
                android:layout_height="wrap_content" />
    </androidx.core.widget.NestedScrollView>

    <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:gravity="end"
            android:orientation="horizontal">

        <com.google.android.material.button.MaterialButton
                android:id="@+id/clear"
                style="@style/Widget.MaterialComponents.Button.TextButton"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_gravity="top|end"
                android:layout_marginHorizontal="8dp"
                android:text="Clear" />

        <com.google.android.material.button.MaterialButton
                android:id="@+id/send"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginHorizontal="8dp"
                android:text="Send Ping" />
    </LinearLayout>
</LinearLayout>
```

You should now see the following when you activate the `Design` view of the activity:

![](./images/android-centralised/activity-design-view.png)

### Request permission to communicate with the private gateway

Add the following line inside the `&lt;manifest>` of your `AndroidManifest.xml` file for your app to be able to communicate with the [private gateway](https://play.google.com/store/apps/details?id=tech.relaycorp.gateway):

```xml
<uses-permission android:name="tech.relaycorp.gateway.SYNC" />
```

### Bind to the private gateway

TODO

## Configure endpoints

Whilst Internet apps communicate with each other using _clients_ and _servers_, Awala apps use _endpoints_. Awala makes extensive use of cryptography to ensure the communication between endpoints is private and secure, which requires some upfront work before the actual communication can start. 

Fortunately, you'll be using the [Android endpoint library](https://github.com/relaycorp/awala-endpoint-android), which abstracts the low-level details so that you can focus on the important features that will make your app stand out from the rest.

### Configure the third-party endpoint

Because you're implementing a centralised service, all the endpoints in the service will be communicating with a specific public endpoint, so you'll need the organisation operating the public endpoint to give you some information about it. In this case, you'll use a public endpoint operated by Relaycorp, whose parameters are:

- Public address: `ping.awala.services`.
- Identity certificate: Can be downloaded from `https://pong-pohttp.awala.services/certificates/identity.der`.

**Apps in a centralised service must be shipped with the data above**. Identity certificates will expire eventually and the operator should also periodically rotate them, so you should make sure that your app is distributed with a relatively recent version of the public endpoint's identity certificate. For example, your release process could automatically download the certificate.

To keep things simple in this codelab, you're just going to manually download the identity certificate once and save it on `app/src/main/res/raw/pub-endpoint-identity.der`. If you're running Linux or macOS, the following should work from the root of the project:

```shell
mkdir app/src/main/res/raw
curl -o app/src/main/res/raw/pub-endpoint-identity.der \
  https://pong-pohttp.awala.services/certificates/identity.der
```

With the certificate on disk, it's now time to register the public endpoint the first time the app starts.

### Configure your own endpoint



## Send pings

Duration: 0:10:00

## Receive pongs

Duration: 0:10:00

Awala requires messages bound for private endpoints to be pre-authorised by the recipient in order to prevent abuse, but no authorisation is required when the message is bound for public endpoints.

## That's it!

Duration: 0:3:00

Well done!

### What's next?


### Further reading

- Reference documentation
