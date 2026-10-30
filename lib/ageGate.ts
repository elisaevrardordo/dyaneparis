// Runs before first paint so a confirmed session never flashes the server-rendered gate.
// Storage failure keeps verification visible, matching the unconfirmed state.
export const AGE_GATE_BOOTSTRAP = `try{if(sessionStorage.getItem('age-confirmed'))document.documentElement.dataset.ageConfirmed='true'}catch{}`
