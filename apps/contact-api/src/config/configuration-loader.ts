export const configLoader = () => ({
  port: parseInt(process.env.PORT, 10) || 3500,
  key_recapta: process.env.GOOGLE_RECAPTCHA_KEY_CLIENT,
  my_namespace: process.env.MY_NAMESPACE,
  key_create_form: process.env.KEY_CREATE_FORM,
  endpoint_bff: process.env.HOST_BFF_BACKEND + '/bff/v1/bff-gateway',
  endpoint_CES: process.env.HOST_BFF_BACKEND + '/bff/v1/bff-gateway/survey',
  endpoint_host: process.env.HOST_API,
  secret_session: process.env.SECRET_SESSION
});