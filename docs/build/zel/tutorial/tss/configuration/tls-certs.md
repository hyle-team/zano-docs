---
sidebar_position: 1
---

# Generating mTLS certificate 

The TSS service uses mTLS (mutual TLS) to secure communication between the TSS parties. 
This ensures that both the client and server authenticate each other, providing an additional layer of security.

:::warning
The TSS service:
- Does not support non-TLS mode;
- Operates with self-signed certificates.
:::

There is an example of how to generate self-signed certificates for the TSS service using `openssl`:

```bash title="gen-certs.sh"
: "${DAYS_VALID:?Set the team-approved certificate lifetime in days}"
umask 077
export COMMON_NAME="tss"
export PARTY_KEY="tss.key"
export PARTY_CERT="tss.crt"
export DNS="{YOUR_DNS_NAME}"

cat > cnf.cnf <<EOF
[ req ]
default_bits       = 2048
distinguished_name = req_distinguished_name
req_extensions     = v3_ext
x509_extensions    = v3_ext

[ req_distinguished_name ]
commonName = ${COMMON_NAME}
commonName_default = ${COMMON_NAME}

[ v3_ext ]
subjectAltName = @alt_names
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth, clientAuth

[ alt_names ]
DNS.1 = ${DNS}
EOF

openssl genpkey -algorithm RSA -out ./$PARTY_KEY
openssl req -new -key ./$PARTY_KEY -out csr.csr -config cnf.cnf -subj "/CN=${COMMON_NAME}"
openssl x509 -req -in csr.csr -signkey ./$PARTY_KEY -out ./$PARTY_CERT -days $DAYS_VALID -extensions v3_ext -extfile cnf.cnf

rm -f csr.csr cnf.cnf
```

This script will generate a key pair that will be used to create Certificate Signing Request (CSR) and later a self-signed certificate.
It will include the basic info like the common name and the IP address of the party.

The ***.crt** file should be distributed to all other parties in the TSS network so they can identify your local party as the valid one.

:::danger
The ***.key** file should be kept secret and never shared with anyone.
:::

:::info
To use IP addresses instead of DNS names, you should modify the `alt_names` section in the config file with the following:

```bash
[ alt_names ]
IP.1 = <YOUR_IP_ADDR>
```

Also, it is possible to use both DNS and IP names in the same config file
(suitable for connecting to the TSS service using both DNS and IP names).
:::

:::note Certificate rotation
Use the team-approved lifetime and renewal procedure. Coordinate replacement certificates with the other parties before expiry; do not extend certificate lifetimes to avoid rotation.
:::
