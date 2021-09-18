import { DoH, DoT } from 'doh-js-client'
import fs from 'fs'

const useDoH = process.env.DYNSD_USE_DOH == 'true',
      useDoT = process.env.DYNSD_USE_DOT == 'true',
      dnsProvider = process.env.DYNSD_DOHT_PROVIDER || 'cloudflare',
      dotPrivateKey = process.env.DYNSD_DOT_PRIVATE_KEY || '',
      dotCertificate = process.env.DYNSD_DOT_CERTIFICATE || ''

// We will use this to store a reference to the dynsd chalk instance
let chalk = null
// We will use this to store a reference to the packet types consts
let consts = null

function ensureFileExists(path) {
  try {
    fs.accessSync(path, fs.constants.R_OK)
  } catch(ex) {
    return false
  }

  return true
}

async function query(name, type) {
  let ret = null, dns = null, dnsType = ''

  if (useDoH) {
    dns = new DoH(dnsProvider)
    dnsType = 'DNS-over-HTTPS'
  } else if (useDoT) {
    dns = new DoT(dnsProvider, dotPrivateKey, dotCertificate)
    dnsType = 'DNS-over-TLS'
  }

  if (dns != null) {
    try {
      console.log(`Trying to resolve query ${chalk.green(name)} using ${chalk.blue(dnsType)} with provider ${chalk.gray(dnsProvider)}`)

      ret = (await dns.resolve(name, type))[0]
    } catch (ex) {
      console.error(ex)
    }
  }

  return ret
}

async function answer(resolve, reject, data ) {
  try {
    for (const question of data.req.question) {
      let res = await query(question.name, consts.QTYPE_TO_NAME[question.type])
      
      if (res != null) data.res.answer.push(res)
    }
    resolve()
  } catch (ex) {
    reject(ex)
  }
}

export default class {
  constructor( dns ) {
    chalk = dns.chalk
    consts = dns.consts

    dns
      .on( 'init', ( resolve, reject, data ) => {
        if (useDoT) {
          if (!ensureFileExists(dotPrivateKey) || !ensureFileExists(dotCertificate)) {
            reject('In order to use DNS-over-TLS you must provide a valid private/certificate key. Please see the documentation for more information.')
          }
        }

        resolve()
      })
      .on( 'resolve.external', ( resolve, reject, data ) => answer( resolve, reject, data ) )
  }
}