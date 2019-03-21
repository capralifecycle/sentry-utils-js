# Utils for monitoring web applications with Sentry

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/f86584c4fb714afdb5b8565adc64cbb7)](https://app.codacy.com/app/oyvindym/sentry-utils-js?utm_source=github.com&utm_medium=referral&utm_content=capraconsulting/sentry-utils-js&utm_campaign=Badge_Grade_Settings)

## Usage

```
getDefaultConfiguration({
    appName: 'example-app',
    appVersion: '1.0.0',
    prodOrigin: 'example-app.xyz',
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
- https://www.${Environment}.company.xyz --> {Environment}
- https://{Full URL for production environment} --> prod

### Determining if Sentry is enabled for the application

Currently simply checks if provided DSN is available and if it has length more than zero.
