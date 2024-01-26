# Utils for monitoring web applications with Sentry

> [!NOTE]
> This project has been archived, as the responsible team has been dissolved.

## Usage

Install the dependency:

```bash
npm install --save-exact @capraconsulting/sentry-utils-js
```

Find your DSN in Sentry under "Settings" -> "Client Keys", to be used
in the next snippet.

Initialize Sentry in your application. This should be done as early as
possible, preferably before other imports, so that it can catch errors
during the rest of initialization.

```javascript
initSentry({
  // Options specified by Sentry, see type Sentry.BrowserOptions.
  options: {
    release: 'ec1c1c',
    environment: '...',
    dsn: '...',
  },
  buildTime: '2019-04-11T00:06+02:00', // Optional
});
```

The following is a full example of how this can be done:

```ts
import {
  initSentry,
  reportSentryNotEnabled,
} from "@capraconsulting/sentry-utils-js";
import { getConfig } from "./common/config";

const config = getConfig();

if (config.sentryDsn) {
  initSentry({
    options: {
      release: __BUILD_INFO__.commitHash,
      environment: config.sentryEnv,
      dsn: config.sentryDsn,
    },
    buildTime: __BUILD_INFO__.appBuildTime,
  });
} else {
  reportSentryNotEnabled();
}
```

Capture log events when needed:

```ts
import { captureError } from "@capraconsulting/sentry-utils-js";

if (...) {
  captureError("Something bad happened")
}
```

See types for additional capture methods and parameters that can be used.

## Features

- Throttles messages to prevent flooding Sentry
- Provides default configuration for Sentry initialization
- Provides more opiniated helpers to capture messages
- Includes `buildTime` as tag if provided during initialization

### Throttling

Evaluate and throttle before sending message to Sentry in case of excessive
amount of failures. This will allow for a spike of 4-5 requests, decaying
using mean lifetime of 1 minute.

## Contributing

This project uses [semantic release](https://semantic-release.gitbook.io/semantic-release/)
to automate releases and follows
[Git commit guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit)
from the Angular project.
