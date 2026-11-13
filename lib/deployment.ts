export function isProductionDeployment(env = process.env) {
  return env.VERCEL_ENV === 'production' || env.DYANE_DEPLOYMENT_ENV === 'production'
}

export function orderDatabaseUrl(env = process.env) {
  return env.STRIPE_DATABASE_URL || (env.DYANE_DEPLOYMENT_ENV === 'production' ? env.NETLIFY_DB_URL : undefined)
}
