summary: Build an Android app for a centralised Awala service
id: android-centralised
categories: Android
tags: medium
status: Published
authors: Gus Narea
Feedback Link: https://community.awala.network/

# Build an Android app for a centralised Awala service

## Overview

Duration: 0:5:00

An _Awala service_ is a collection of apps that exchange mutually-intelligible messages using _endpoints_. Server-side apps exposed as Internet hosts will have _public endpoints_ (e.g., `your-service.com`), whilst all other apps (e.g., mobile, desktop) will have _private endpoints_.

The service is _centralised_ if there's a public endpoint as the sender or recipient of all messages, _decentralised_ if all endpoints are private. Alternatively, if there's a public endpoint involved in some but not necessarily all messages, then the service is _hybrid_.

Anyone can define Awala services, but to keep this codelab simple, we'll just build an Android app for [Awala Ping](https://specs.awala.network/RS-014), which is a trivial service used to test Awala implementations.

### What you'll build

You'll build an Android app that will send _ping_ messages to the public endpoint at `ping.awala.services`, and it'll also receive _pong_ messages from said public endpoint. Awala Ping is a hybrid service, but we'll use it as a centralised service here.

As illustrated in the picture below, when you send a ping from your Android app to `ping.awala.services`, the message will travel through the local Awala gateway and then on to the public gateway (at `frankfurt.relaycorp.cloud`, for example).

![](./images/android-centralised/service-architecture-ping.png)

On the other hand, `ping.awala.services` has to respond to your ping by sending a pong message back via the same gateways as illustrated below:

![](./images/android-centralised/service-architecture-pong.png)

Finally, your app will look like this:

![](./images/android-centralised/app-screenshot.png)

### What you'll need

- Prior experience building Android apps. If you've never built an Android app, the [first app guide](https://developer.android.com/training/basics/firstapp) will teach you what you need to complete this codelab.
- [Android Studio](https://developer.android.com/studio) 4+.
- An Android phone or table running Android 5+.
- The [private gateway](https://play.google.com/store/apps/details?id=tech.relaycorp.gateway) installed on that Android device.

## Set up a new project

Duration: 0:5:00

![](./images/android-centralised/android-studio-project-template.png)

![](./images/android-centralised/android-studio-project-config.png)

### Define dependencies

### Implement user interface

Replace `src/main/res/layout/activity_main.xml` with the following:

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

## Send pings

Duration: 0:10:00

## Receive pongs

Duration: 0:5:00

Awala requires messages bound for private endpoints to be pre-authorised by the recipient in order to prevent abuse, but no authorisation is required when the message is bound for public endpoints.

## That's it!

Duration: 0:3:00

### What's next?


### Further reading


### Reference documentation
 
