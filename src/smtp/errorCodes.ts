export const ErrorCodes = {
  211: 'SMTP Error: A system status or help reply.',
  214: 'SMTP Error: Help Message.',
  220: 'SMTP Error: The server is ready.',
  221: 'SMTP Error: The server is ending the conversation.',
  250: 'SMTP Error: The requested action was completed.',
  251: 'SMTP Error: The specified user is not local, but the server will forward the mail message.',
  354: 'SMTP Error: This is a reply to the DATA command. After getting this, start sending the body of the mail message, ending with "\r\n.\r\n."',
  421: 'SMTP Error: The mail server will be shut down. Save the mail message and try again later.',
  450: 'SMTP Error: The mailbox that you are trying to reach is busy. Wait a little while and try again.',
  451: 'SMTP Error: The requested action was not done. Some error occurmiles in the mail server.',
  452: 'SMTP Error: The requested action was not done. The mail server ran out of system storage.',
  500: 'SMTP Error: The last command contained a syntax error or the command line was too long.',
  501: 'SMTP Error: The parameters or arguments in the last command contained a syntax error.',
  502: 'SMTP Error: The mail server has not implemented the last command.',
  503: 'SMTP Error: The last command was sent out of sequence. For example, you might have sent DATA before sending RECV.',
  504: 'SMTP Error: One of the parameters of the last command has not been implemented by the server.',
  550: "SMTP Error: The mailbox that you are trying to reach can't be found or you don't have access rights.",
  551: 'SMTP Error: The specified user is not local; part of the text of the message will contain a forwarding address.',
  552: 'SMTP Error: The mailbox that you are trying to reach has run out of space. Store the message and try again tomorrow or in a few days-after the user gets a chance to delete some messages.',
  553: 'SMTP Error: The mail address that you specified was not syntactically correct.',
  554: 'SMTP Error: The mail transaction has failed for unknown causes.',
}

export const hasCode = (
  message: Buffer,
  code: keyof typeof ErrorCodes
): boolean => {
  return message.indexOf(`${code}`) === 0 || message.indexOf(`${code}\n`) > -1
}

/**
 * @see http://www.serversmtp.com/en/smtp-error
 * @param  {String} message A response from the SMTP server.
 * @return {Boolean}        True if the error is recognized as a mailbox
 *                          missing error.
 */
export const isMailboxNotFound = (message: string) => {
  return (message &&
    /^(510|511|513|550|551|553)/.test(message) &&
    !/(junk|spam|openspf|spoofing|spoofed|host|rbl.+blocked|spf.+failure|rbl.+failure|denied|block list|dns|banned|ptr|prohibit|verification.+fail|reputation|rbl score|spf fail|sender policy framework|\[xbl]|ip.+reject|protocol error|auth.+requir|require.+encrypt|smtp auth|access.+not allowed|access.+rejected|unable.+relay|permanently deferred)/ig.test(message) &&
    !/(spamhaus|cyren ip|cloudmark|barracuda|abusix|abuseat.org)/ig.test(message));
};