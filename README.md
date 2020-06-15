# Utils for monitoring web applications with Sentry

## Usage

```javascript
initSentry({
  release: 'ec1c1c',
  buildTimestamp: '2019-04-11T00:06+02:00', // Optional
  environment: "...", // Optional, e.g. prod
  sentryDsn: '...'
})
```

## Features

- Throttling of error messages to prevent flooding Sentry
- Determining if Sentry is enabled for the application
- Provides default configuration for Sentry initialization

### Throttling

Evaluate and throttle before sending message to Sentry in case of excessive amount of failures. This will allow for a spike of 4-5 requests, decaying using mean lifetime of 1 minute.

### Determining if Sentry is enabled for the application

Currently simply checks if provided DSN is available and if it has length more than zero.

## Contributing

This project uses [semantic release](https://semantic-release.gitbook.io/semantic-release/)
to automate releases and follows
[Git commit guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit)
from the Angular project.
