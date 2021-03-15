summary: Build an Android app for a centralised Awala service (working draft)
id: android-centralised
categories: Android
tags: medium
status: Published
authors: Gus Narea
Feedback Link: https://community.awala.network/

# Build an Android app for a centralised Awala service (working draft)

## Overview

Duration: 0:2:00

**This is a working draft**

### What You'll Build

### Prerequisites

- [Android Studio](https://developer.android.com/studio) 4.1 or newer.

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

## That's it!

Duration: 0:3:00

### What's next?


### Further reading


### Reference documentation
 
