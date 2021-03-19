summary: Build a public endpoint using Node.js
id: nodejs-pong
categories: nodejs
tags: medium
status: Published
authors: Gus Narea
Feedback Link: https://github.com/AwalaNetwork/codelabs

# Build a public endpoint using Node.js

## Overview

Duration: 10:00

An _Awala service_ is a collection of mobile, desktop, server-side and/or CLI apps that exchange mutually-intelligible messages using _endpoints_. Server-side apps exposed as Internet hosts will have _public endpoints_ (e.g., `your-service.com`), whilst all other apps (e.g., mobile, desktop) will have _private endpoints_.

You're going to work with the [Awala Ping](https://specs.awala.network/RS-014) service in this codelab. Ping is a trivial service used to test Awala itself by having private endpoints send _pings_ to other endpoints and getting _pongs_ in response. The recipient of the ping can be public or private, but here you'll only use a public endpoint.

### What you'll build

You'll build a Node.js HTTP server that will act as a public endpoint in the Ping service, and you'll deploy it to [Google App Engine](https://cloud.google.com/appengine) (GAE).

Say your public endpoint address is `ping.awala.services` and a private endpoint in an Android app sends you a ping, as illustrated in the picture below. When the private endpoint sends the ping, the message will pass through the [private gateway](https://play.google.com/store/apps/details?id=tech.relaycorp.gateway), then on to a public gateway (such as `frankfurt.relaycorp.cloud`), and it'll finally arrive at your public endpoint.

![](images/ping-service/service-architecture-ping.png)

On the other hand, pong messages do the same route in reverse:

![](images/ping-service/service-architecture-pong.png)

Awala requires messages bound for private endpoints to be pre-authorised by the recipient, so each ping message includes an authorisation for the recipient (e.g., `ping.awala.services`) to reply with a pong message. In most services, authorisations would be issued once and renewed periodically, but public endpoints in the Ping service are meant to be stateless, so private endpoints have to issue an authorisation each time.

Positive
: The Ping service uses a request-response pattern because its sole purpose is to test that endpoints can send and receive data. However, **endpoints in your own services can send messages at any time** and there's no requirement to respond to messages. Your endpoints should just push data to their peers whenever new data is available, without waiting for anyone else to "initiate" the communication.

### What you'll need

- Basic understanding of Node.js and JavaScript/TypeScript.
- [Node.js](https://nodejs.org/en/download/) 14+.
- A [Google Cloud Platform](https://cloud.google.com/) (GCP) account. As of this writing, running this codelab alone won't exceed your [free quota](https://cloud.google.com/appengine/quotas).
- A domain name with DNSSEC enabled and the ability to create SRV records. If you don't have one already, register a cheap one with your favourite registrar. Alternatively, if you know of a service offering this for free, use it and please [let us know about it](https://github.com/AwalaNetwork/codelabs/issues/5).
- An Android phone or tablet running Android 5+.
- The [private gateway](https://play.google.com/store/apps/details?id=tech.relaycorp.gateway) installed on that Android device.

### In case you need help

If you have any issues in the course of this codelab, please post a message on [our forum](https://community.awala.network/) and we'll help you out! You can also check out the [final version of the app you're going to build](https://github.com/AwalaNetwork/codelabs/tree/main/examples/nodejs-pong).

## Set up Google App Engine

Duration: 10:00

### Set up a new GCP project

1. [Create a new GCP project](https://console.cloud.google.com/projectcreate) and give it any name you'd like.
1. Make sure that billing is enabled for the project. [Learn how to confirm that billing is enabled](https://cloud.google.com/billing/docs/how-to/modify-project).
1. Enable the [Cloud Build API](https://console.cloud.google.com/apis/library/cloudbuild.googleapis.com).

### Set up the GCP SDK

[Install and initialize the GCP SDK](https://cloud.google.com/sdk/docs/install), and then make the new project the default locally:

```shell
gcloud config set project [YOUR_PROJECT_ID]
```

### Deploy the app template

You're now going to deploy a trivial app to GAE to make sure everything is working so far. You're going to build on this app to implement the public endpoint later.

Start by creating the GAE app for your project in the region of your choosing:

```shell
gcloud app create --project=[YOUR_PROJECT_ID]
```

Next, [download the app template](/examples/nodejs-pong-template.zip), unzip it and change into its directory. On macOS and Linux, you can do this with the following commands:

```shell
wget https://codelabs.awala.network/examples/nodejs-pong-template.zip
unzip nodejs-pong-template.zip
cd nodejs-pong-template
```

Then install the app and build it:

```shell
npm install
npm run build
```

Let's make sure everything has worked so far by starting the server:

```shell
npm run start:dev
```

You should see the message `It works!` when you open [`http://localhost:8080`](http://localhost:8080/). Now quit the server by pressing `Ctrl`+`C` (or `Cmd`+`C` on macOS).

Now it's time to deploy it to GAE:

```shell
gcloud app deploy
```

### Test the app!

Run the following command to open the app in your browser:

```shell
gcloud app browse
```

You should see something like this:

![](images/nodejs-pong/app-template-remote.png)

## Generate an identity certificate

Duration: 5:00

## Process incoming pings

Duration: 10:00

## Send pongs

Duration: 10:00

## Test it with an Android app

Duration: 10:00

## That's it!

Duration: 5:00

Well done! You've just built an Android app for a centralised Awala service.

### Delete the GCP project

When you're done testing the public endpoint you created, do the following to delete the resources you created:

Negative
: If you created other GCP resources outside this codelab, those will be deleted too.

1. Go to the [GCP resource manager](https://console.cloud.google.com/cloud-resource-manager).
1.  In the project list, select the project that you want to delete, and then click _Delete_.
1.  In the dialog, type the project ID, and then click _Shut down_ to delete the project.

### What's next?

- Learn more about the [architecture of Awala services](https://awala.network/service-providers/implementation/architecture).
- Read the [API documentation for awaladroid](https://docs.relaycorp.tech/awala-endpoint-android/).
- [Join the Awala community](https://community.awala.network/) and give us some feedback on the codelab.
- [Share what you've just done on Twitter](https://twitter.com/intent/tweet?url=https%3A%2F%2Fawala.network%2Fservice-providers%2F&via=AwalaNetwork&text=I%27ve%20just%20built%20an%20app%20that%20can%20sync%20with%20the%20Internet%20even%20if%20the%20user%20is%20disconnected%20from%20it%21).
