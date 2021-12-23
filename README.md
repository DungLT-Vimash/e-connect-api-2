
```shell
node server.js --tasks=print-config
```

## Run server

```shell
export LOGOLITE_FULL_LOG_MODE=false
export DEBUG=devebot*,app*
export LOGOLITE_DEBUGLOG_ENABLED=true
export DEVEBOT_CONFIG_DIR=$PWD/conf
export DEVEBOT_CONFIG_ENV=dev
export APP_TYPE=admin
export WEB_URL=http://192.168.1.10:8000
node server.js
```

## Run server mocking api

**Usage**

- Step 1: Create file texture_contact in conf/dev
- Step 2: add export DEVEBOT_TEXTURE=contact 

```shell
export LOGOLITE_FULL_LOG_MODE=false
export DEBUG=devebot*,app*
export LOGOLITE_DEBUGLOG_ENABLED=true
export DEVEBOT_CONFIG_DIR=$PWD/conf
export DEVEBOT_CONFIG_ENV=dev
export APP_TYPE=admin
export WEB_URL=http://192.168.1.10:8000
export DEVEBOT_TEXTURE=employee
node server.js
```
