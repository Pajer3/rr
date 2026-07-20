declare module 'nodemailer' {
  interface Transporter {
    sendMail(options: Record<string, unknown>): Promise<unknown>;
  }
  const nodemailer: {
    createTransport(options: Record<string, unknown>): Transporter;
  };
  export default nodemailer;
}
