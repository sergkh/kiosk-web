// 
// Kioks Android app exports Config object with a get method 
// for configurations obtained from the Firebase remote config
type Config = {
  get: (key: string) => string | null;
};

const wdLocal: {[index: string]:Config} = window as any;

const kioskConf: Config = wdLocal['Config'] ?? {
  get: (key: string) => null
};

function boolParam(confKey: string, env: string | null, fallback: Boolean): Boolean {
  if (kioskConf.get(confKey) !== null) {
    return kioskConf.get(confKey) === 'true';
  }
  
  if (typeof(env) !== 'undefined' && env !== null) { 
    return env === 'true';
  }
  return fallback;
}

const config = {
  baseUrl: import.meta.env.VITE_BASE_URL || '/',
  cacheTime: parseInt(kioskConf.get('cache_ttl') ?? "3600000"),
  showStudentInfo: boolParam('show_students_page', import.meta.env.VITE_SHOW_STUD_INFO, true),
  showAbiturientInfo: boolParam('show_abiturients_page', import.meta.env.VITE_SHOW_ABITURIENT_INFO, true),
  idleVideoId: kioskConf.get('idle_video_id') ?? import.meta.env.VITE_IDLE_VIDEO_ID ?? '',
  idleTimeout: parseInt(kioskConf.get('idle_timeout') ?? import.meta.env.VITE_IDLE_TIMEOUT ?? "600000"),
  mkrApiUrl: kioskConf.get('mkr_api_url') ?? import.meta.env.VITE_MKR_API_URL ?? 'https://mkr.sergkh.com',
  scheduleDays: parseInt(kioskConf.get('schedule_days') ?? import.meta.env.VITE_SCHEDULE_DAYS_TO_SHOW ?? "3"),
  numberOfNews: parseInt(kioskConf.get('number_of_news') ?? import.meta.env.VITE_NUMBER_OF_NEWS ?? "3"),
}

console.log('Site config: ' + JSON.stringify(config))

export default config;