/* global dataLayer, process */
import { getCLS, getFID, getLCP } from 'web-vitals';

function sendToGTM({ name, delta, id }) {
  // Assumes the global `dataLayer` array exists, see:
  // https://developers.google.com/tag-manager/devguide
  dataLayer.push({
    event: 'web-vitals',
    event_category: 'Web Vitals',
    event_action: name,
    // Google Analytics metrics must be integers, so the value is rounded.
    // For CLS the value is first multiplied by 1000 for greater precision
    // (note: increase the multiplier for greater precision if needed).
    event_value: Math.round(name === 'CLS' ? delta * 1000 : delta),
    // The `id` value will be unique to the current page load. When sending
    // multiple values from the same page (e.g. for CLS), Google Analytics can
    // compute a total by grouping on this ID (note: requires `eventLabel` to
    // be a dimension in your report).
    event_label: id,
  });
}

if (process.env.NODE_ENV === 'production') {
  getCLS(sendToGTM);
  getFID(sendToGTM);
  getLCP(sendToGTM);
}
