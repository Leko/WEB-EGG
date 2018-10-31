// @flow
import React from "react";
import ReactDOM from "react-dom";
import { Dispatcher, Context } from "almin";
import AlminLogger from "almin-logger";
import AppStoreGroup from "./store/AppStoreGroup";
import SearchApp from "./SearchApp";
import LazyLoadApp from "./LazyLoadApp";
import { registerWorkers } from "./ServiceWorker";
import swPrecacheConfig from "../../sw-precache-config";

// --- Init error tracking
// $FlowFixMe
Raven.config(
  "https://12665dacfb554ecea25f3ef119a904af@sentry.io/244064"
).install();

// --- Init SearchApp
const dispatcher = new Dispatcher();
const appContext = new Context({
  dispatcher,
  store: AppStoreGroup.create()
});

if (process.env.NODE_ENV !== "production") {
  const logger = new AlminLogger();
  logger.startLogging(appContext);
}

const searchElement = document.getElementById("search");
if (searchElement) {
  ReactDOM.render(<SearchApp appContext={appContext} />, searchElement);
}

// --- Init LazyLoadApp
LazyLoadApp(document.querySelectorAll(".markdown img"));

// --- Init ServiceWorker
registerWorkers([swPrecacheConfig.swFile]);
