# SecureAPI_AuthAPI

This project is part of the SecureAPI suite. It handles authentication and authorization for the SecureAPI services.

## Setup

### Generate Keypair

Before you start, you need to generate a keypair that will be used for signing and verifying JWT tokens. This keypair should be generated once and shared among all SecureAPI services.

You can generate a keypair using the following command:

```bash
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```
This will generate a private key (jwtRS256.key) and a public key (jwtRS256.key.pub).

### Configure Database Connection
The database connection information should be configured in a .env file. Here's an example:
``` properties
DB_HOST=localhost
DB_PORT=5432
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=mydatabase
```
Replace localhost, 5432, myuser, mypassword, and mydatabase with your actual database host, port, username, password, and database name.

### Running the Project
To run the project, use the following command:

``` properties
npm run start
```
If you want to run the project in a Kubernetes cluster, please check out my other repository for Kubernetes setup instructions.

Building and Publishing the Project
To build the project, use the following command:
``` properties
npm run build
```
After building the project, you can publish it to your private repository.
### Kubernetes Deployment
For instructions on how to deploy the project to a Kubernetes cluster, please check out my Kubernetes repository.


