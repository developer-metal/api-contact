export const jwtConstants = {
  secret: Buffer.from(process.env.SECRETKEY ?? 'secretKey', 'base64')
};
