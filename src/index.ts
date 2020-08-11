import { isEmail } from './regex/regex'
import { checkTypo } from './typo/typo'
import { getMx } from './dns/dns'
import { checkSMTP } from './smtp/smtp'
import { checkDisposable } from './disposable/disposable'
import { getOptions, ValidatorOptions } from './options/options'
import { OutputFormat, createOutput } from './output/output'
import './types'

const returnConversation = (conversation: OutputFormat): boolean => {
  return conversation.valid ||
    (!conversation.valid && conversation.validators?.smtp?.reason === 'Mailbox not found.');
}

export async function validate(
  emailOrOptions: string | ValidatorOptions
): Promise<OutputFormat> {
  const options = getOptions(emailOrOptions)
  const email = options.email

  if (options.validateRegex) {
    const regexResponse = isEmail(email)
    if (regexResponse) return createOutput('', 'regex', regexResponse)
  }

  if (options.validateTypo) {
    const typoResponse = await checkTypo(email)
    if (typoResponse) return createOutput('', 'typo', typoResponse)
  }

  const domain = email.split('@')[1]

  if (options.validateDisposable) {
    const disposableResponse = await checkDisposable(domain)
    if (disposableResponse)
      return createOutput('', 'disposable', disposableResponse)
  }

  if (options.validateMx) {
    const records = await getMx(domain);
    if (!records || records.length === 0) return createOutput('', 'mx', 'MX record not found')
    if (options.validateSMTP) {
      for (const mx of records) {
        const conversation = await checkSMTP(options.sender, email, mx.exchange)
        // if we received a clear conversation response or this is the last MX record to be checked
        if (returnConversation(conversation)) {
          return conversation
        }
      }

      return createOutput('', 'smtp', 'None of the MX records returned a valid answer')
    }
  }

  return createOutput()
}

export default validate
