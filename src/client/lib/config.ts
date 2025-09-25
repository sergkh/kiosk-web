// 
// Kioks Android app exports Config object with a get method 
// for configurations obtained from the Firebase remote config
type Config = {
  get: (key: string) => string | null;
};

const wdLocal: {[index: string]:Config} = window as any;

const kioskConf: Config = wdLocal['Config'] || {
  get: (key: string) => null
};

const config = {
  baseUrl: import.meta.env.VITE_BASE_URL || '/',
  cacheTime: parseInt(kioskConf.get('cache_ttl') ?? "3600000"),
  showStudentInfo: Boolean(kioskConf.get('show_students_page') ?? import.meta.env.VITE_SHOW_STUD_INFO ?? 'true'),
  showAbiturientInfo: Boolean(kioskConf.get('show_abiturients_page') ?? import.meta.env.VITE_SHOW_ABITURIENT_INFO ?? 'true'),
  idleVideoId: kioskConf.get('idle_video_id') ?? import.meta.env.VITE_IDLE_VIDEO_ID ?? '',
  idleTimeout: parseInt(kioskConf.get('idle_timeout') ?? import.meta.env.VITE_IDLE_TIMEOUT ?? "600000"),
  mkrApiUrl: kioskConf.get('mkr_api_url') ?? import.meta.env.VITE_MKR_API_URL ?? 'https://mkr.sergkh.com',
  scheduleDays: parseInt(kioskConf.get('schedule_days') ?? import.meta.env.VITE_SCHEDULE_DAYS_TO_SHOW ?? "3"),
}

export default config;