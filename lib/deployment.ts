export function isProductionDeployment(env = process.env) {
  return env.VERCEL_ENV === 'production' || env.DYANE_DEPLOYMENT_ENV === 'production'
}
