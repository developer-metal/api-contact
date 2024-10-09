export const configConnect = {
  useFactory: () => ({
    uri: process.env.URI_MONGO ?? 'mongodb://mongodb:27017/contact-api'
  })
};
