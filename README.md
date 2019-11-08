# Utils for monitoring web applications with Sentry

## Usage

```javascript
initSentry({
  release: 'ec1c1c',
  buildTimestamp: '2019-04-11T00:06+02:00', // Optional
  isProd: true/false // Optional
  sentryDsn: '...'
})
```

## Features

- Throttling of error messages to prevent flooding Sentry
- Determining environment for application based on origin
- Determining if Sentry is enabled for the application
- Provides default configuration for Sentry initialization

### Throttling

Evaluate and throttle before sending message to Sentry in case of excessive amount of failures. This will allow for a spike of 4-5 requests, decaying using mean lifetime of 1 minute.

### Determining environment for application based on origin

Eligible environment tags in url (such as 'https://dev.company.xyz') are as follows:

- dev
- test
- qa
- devtest
- systest

They will be determined based on origin. Currently supporting:

- http://localhost:{PORT} --> local
- https://{Environment}.company.xyz --> {Environment}
- https://some-project-{Environment}.company.xyz --> {Environment}
- https://{Environment}-some-project.company.xyz --> {Environment}
- https://some-{Environment}-project.company.xyz --> {Environment}
- https://www.{Environment}.company.xyz --> {Environment}

### Determining if Sentry is enabled for the application

Currently simply checks if provided DSN is available and if it has length more than zero.

## Contributing

This project uses [semantic release](https://semantic-release.gitbook.io/semantic-release/)
to automate releases and follows
[Git commit guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit)
from the Angular project.
