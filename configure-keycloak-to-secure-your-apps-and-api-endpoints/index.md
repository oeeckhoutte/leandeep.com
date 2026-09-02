# Configure Keycloak to secure your apps and API endpoints

- Canonical URL: https://leandeep.com/configure-keycloak-to-secure-your-apps-and-api-endpoints/
- Author: Olivier Eeckhoutte
- Published: 2024-11-13T07:00:00+02:00
- Updated: 2024-11-13T07:00:00+02:00
- Language: fr
- Tags: Keycloak, ciam
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


In this brief article we are going to create a basic realm in Keycloak to secure an API. It's a very minimal setup to quickly get started and secure your app and API. No RBAC, no security defense, and no Google/ Facebook Connect... configs are explained in this article. I will probably create other articles about these subjets later as I am extensively leveraging Keycloak features. There is indeed no need to setup a complexe Identity and Access Management tool like Keycloak if you are not going to leverage it...

<br/>

## Installation

**Via Docker compose**
```
x-logging: &logging
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"

services:
  postgres:
    image: postgres:${POSTGRES_VERSION}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "keycloak"]
    environment:
      POSTGRES_DB: keycloak
      POSTGRES_USER: keycloak
      POSTGRES_PASSWORD: password
    volumes:
      - type: tmpfs
        target: /var/lib/postgresql/data
        tmpfs:
          size: 100000000
    logging: *logging

  keycloak:
    image: quay.io/keycloak/keycloak:${KC_VERSION}
    command: ["start-dev", "--import-realm"]
    restart: unless-stopped
    environment:
      KC_DB: postgres
      KC_DB_USERNAME: keycloak
      KC_DB_PASSWORD: password
      KC_DB_URL: "jdbc:postgresql://postgres:5432/keycloak"
      KC_METRICS_ENABLED: true
      KC_LOG_LEVEL: ${KC_LOG_LEVEL}
      KC_REALM_NAME: ${KC_REALM_NAME}
      KC_BOOTSTRAP_ADMIN_USERNAME: ${KEYCLOAK_ADMIN}
      KC_BOOTSTRAP_ADMIN_PASSWORD: ${KEYCLOAK_ADMIN_PASSWORD}
      GF_URL: ${GF_HOSTNAME}:${GF_SERVER_HTTP_PORT}
      GF_ADMIN_USERNAME: ${GF_ADMIN_USERNAME}
      GF_ADMIN_PASSWORD: ${GF_ADMIN_PASSWORD}
    ports:
      - ${KC_PORT}:8080
    volumes:
      - ./keycloak/realm.json:/opt/keycloak/data/import/realm.json:ro
    logging: *logging

  prometheus:
    image: prom/prometheus:${PROMETHEUS_VERSION}
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=30d'
      - '--storage.tsdb.wal-compression'
      - '--web.enable-lifecycle'
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--tries=1", "--spider", "http://localhost:9090/-/healthy"]
    ports:
      - ${PROMETHEUS_PORT}:9090
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
    logging: *logging

  grafana:
    image: grafana/grafana-oss:${GF_VERSION}
    restart: unless-stopped
    ports:
      - ${GF_SERVER_HTTP_PORT}:${GF_SERVER_HTTP_PORT}
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:${GF_SERVER_HTTP_PORT}/api/health"]
    environment:
      GF_SERVER_HTTP_PORT: ${GF_SERVER_HTTP_PORT}
      GF_SERVER_ROOT_URL: ${GF_HOSTNAME}:${GF_SERVER_HTTP_PORT}
      GF_LOG_LEVEL: ${GF_LOG_LEVEL}
      GF_AUTH_BASIC_ENABLED: true
      GF_AUTH_DISABLE_LOGIN_FORM: true
      GF_AUTH_GENERIC_OAUTH_TLS_SKIP_VERIFY_INSECURE: true
      GF_AUTH_GENERIC_OAUTH_ENABLED: true
      GF_AUTH_GENERIC_OAUTH_NAME: Keycloak
      GF_AUTH_GENERIC_OAUTH_ALLOW_SIGN_UP: true
      GF_AUTH_GENERIC_OAUTH_CLIENT_ID: "grafana"
      GF_AUTH_GENERIC_OAUTH_EMAIL_ATTRIBUTE_NAME: "email:primary"
      GF_AUTH_GENERIC_OAUTH_SCOPES: "openid profile email"
      GF_AUTH_GENERIC_OAUTH_AUTH_URL: ${KC_HOSTNAME}:${KC_PORT}/realms/${KC_REALM_NAME}/protocol/openid-connect/auth
      GF_AUTH_GENERIC_OAUTH_TOKEN_URL: http://keycloak:${KC_PORT}/realms/${KC_REALM_NAME}/protocol/openid-connect/token
      GF_AUTH_GENERIC_OAUTH_API_URL: ${KC_HOSTNAME}:${KC_PORT}/realms/${KC_REALM_NAME}/protocol/openid-connect/userinfo
    volumes:
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards:ro
      - ./grafana/datasources:/etc/grafana/provisioning/datasources:ro
    logging: *logging
```

> Obviously it's not the config for your prod environment.

<br/>

## Configuration 

### Option 1: configuration via GUI

Go to http://localhost:8080/ and login using `admin`/`keycloak` credentials.

1. Create a new realm: `realm_test`
2. On `realm settings` -> `login` check `Email as username`.
3. Create a new client and select:
   - Client type: `OpenID Connect`
   - Clent ID: `test_config`
   - Name: `test_config`
   - Client authentication: `Off`
   - Authorization: `Off`
   - Authentication Flow: `Standard flow` + `Direct access grants`
   - Web origins: `*` (for CORS -> We don't care in dev)
4. Create a user: `olivier.olivier@example.com` with email verified and set a non temporary password `olivierolivier`.

<br/>

### Option 2: configuration via curl

Get admin token
```
export TOKEN=$(curl -s -X POST \
  "http://localhost:8080/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin" \
  -d "password=keycloak" \
  -d "grant_type=password" \
  -d "client_id=admin-cli" | jq -r .access_token)
```

<br/>

`realm` creation:
```
curl -X POST "http://localhost:8080/admin/realms" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "realm": "myrealm",
    "enabled": true,
    "registrationEmailAsUsername": true
  }'
```

<br/>

Create a new `client_id` (warning it is permissive as webOrigins & redirectUris are equal to `*`)
```
curl -X POST "http://localhost:8080/admin/realms/myrealm/clients" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "myrealm_client_id",
    "name": "myrealm_client_id",
    "protocol": "openid-connect",
    "publicClient": true,
    "authorizationServicesEnabled": false,
    "standardFlowEnabled": true,
    "directAccessGrantsEnabled": true,
    "implicitFlowEnabled": false,
    "serviceAccountsEnabled": false,
    "webOrigins": ["*"],
    "redirectUris": ["*"]
  }'
```

<br/>

Create a user
```
curl -X POST "http://localhost:8080/admin/realms/myrealm/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
        "username": "user",
        "email": "user@example.com",
        "enabled": true,
        "emailVerified": true,
        "firstName": "Papa",
        "lastName": "Example"
  }'
```

<br/>

Get user id
```
USER_ID=$(curl -s -X GET "http://localhost:8080/admin/realms/myrealm/users?username=user" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq -r '.[0].id')
```

<br/>

Set password

```
curl -X PUT "http://localhost:8080/admin/realms/myrealm/users/$USER_ID/reset-password" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "password",
    "value": "password",
    "temporary": false
  }'
```





<br/>

## Login/ Verify config OK

Verify you can connect using your newly created account on the realm.

To do so go to [http://localhost:8080/realms/myrealm/protocol/openid-connect/auth?client_id=account-console](http://localhost:8080/realms/myrealm/protocol/openid-connect/auth?client_id=account-console) and try to login using the UI.

<br/>

If it's ok let's try to get an access_token using the REST API:

```
curl -X POST "http://localhost:8080/realms/myrealm/protocol/openid-connect/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "client_id=test_config" \
     -d "grant_type=password" \
     -d "username=user@example.com" \
     -d "password=password" \
     -d "scope=openid"
```

If you get a response like this you are all set:

```
{"access_token":"eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJqaTNPRHRHS0tmcW9XNHVtOGptN1p4eVVUU3NxMGFEWFJJSnYtZGRNQXZ3In0.eyJleHAiOjE3MzE1MzQ2MzksImlhdCI6MTczMTUzNDMzOSwianRpIjoiMGQ4NDRjNWQtZGRhYi00YTg1LTljMjItY2FjNTg0NWI4NWU5IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy90ZV9kaXJlIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImUzYzhkZjM2LWY3NmEtNDc4OC05OWM1LWU0N...
```

<br/>

Extract your access_token and now try to retrieve your account personal info:

```
curl -X GET "http://localhost:8080/realms/myrealm/protocol/openid-connect/userinfo" \
     -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJqaTNPRHRHS0tmcW9XNHVtOGptN1p4eVVUU3NxMGFEWFJJSnYtZGRNQXZ3In0.eyJleHAiOjE3MzE1MzQ2MzksImlhdCI6MTczMTUzNDMzOSwianRpIjoiMGQ4NDRjNWQtZGRhYi00YTg1LTljMjItY2FjNTg0NWI4NWU5IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy90ZV9kaXJlIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImUzYzhkZjM2LWY3NmEtNDc4OC05OWM1LWU0N..."
```

<br/>

If you get a response like the one below, it means Keycloak is properly configured for your development environment. You can then place it in front of your API and use it in your app to log in your users.

```
{"sub":"e3c8df36-f76a-4788-99c5-e45553d71893","email_verified":true,"name":"Olivier Olivier","preferred_username":"olivier.olivier@example.com","given_name":"Olivier","family_name":"Olivier","email":"olivier.olivier@example.com"}%
```

<br/>

## Create an account in a non admin realm via the API

**Python code example:**

```
# Get an admin token using the master realm and then execute something like:
url = f"{settings.keycloak_base_url}/admin/realms/{settings.keycloak_realm}/users"
headers = {
    "Authorization": f"Bearer {admin_token}",
    "Content-Type": "application/json",
}
user_data = {
    "username": email,
    "email": email,
    "firstName": first_name,
    "lastName": last_name,
    "enabled": enabled,
    "credentials": [
        {
            "type": "password",
            "value": "olivierolivier2",
            "temporary": False,
        }
    ],
}
response = requests.post(url, headers=headers, data=json.dumps(user_data))
if response.status_code == 201:
  ...
# You get the idea...
```

