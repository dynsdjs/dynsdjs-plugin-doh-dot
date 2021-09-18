# dynsdjs-plugin-doh-dot

DNS-over-HTTPS/DNS-over-TLS plugin for dynsdjs

## Installation

Just install the package via npm by doing

```shell
$ npm install -g dynsdjs-plugin-doh-dot
```

## Options

You can configure this plugin through Environment variables

- `DYNSD_USE_DOH`: This variable will tell the plugin if you want to use DNS-over-HTTPS to resolve your queries. Possible values: `false`, `true`. Default value: `false`
- `DYNSD_USE_DOT`: This variable will tell the plugin if you want to use DNS-over-TLS to resolve your queries. Possible values: `false`, `true`. Default value: `false`
- `DYNSD_DOHT_PROVIDER`: This variable will tell the plugin which provider you want to use. Possible values: `google`, `cloudflare`, `cleanbrowsing`, `quad9`. Default value: `cloudflare`
- `DYNSD_DOT_PRIVATE_KEY`: This variable will tell the plugin the path to your private key to make DNS-over-TLS requests correctly. Used only when `DYNSD_USE_DOT==true`.
- `DYNSD_DOT_CERTIFICATE`: This variable will tell the plugin the path to your certificate to make DNS-over-TLS requests correctly. Used only when `DYNSD_USE_DOT==true`.

If both `DYNSD_USE_DOH` and `DYNSD_USE_DOT` are enabled, DNS-over-HTTPS will take precedence and will be used for every query.

## Certificate files

In order to use the DNS-over-TLS feature you are required to generate a set of private key and certificate.

To make this job simpler for you, I suggest you using the awesome tool name [`mkcert`](https://github.com/FiloSottile/mkcert) by FiloSottile.

In order to generate your certificates you can simply run these commands:

```sh
$ mkcert -install
$ mkcert -key-file key.pem -cert-file cert.pem localhost 127.0.0.1 ::1
```

## Usage

### DNS-over-HTTPS

```sh
$ DYNSD_USE_DOH=true dynsdjs
```

### DNS-over-TLS

```sh
$ DYNSD_USE_DOT=true DYNSD_DOT_PRIVATE_KEY=path/to/key.pem DYNSD_DOT_CERTIFICATE=path/to/cert.pem dynsdjs
```
