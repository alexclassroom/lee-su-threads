/**
 * Maps location strings to country flag emojis
 * Supports multiple languages (EN, ZH_TW, ZH_CN, JA, KO)
 */

// Country flag mapping with multi-language support
const LOCATION_TO_FLAG = {
  // Taiwan
  '🇹🇼': [
    'taiwan', '台灣', '台湾', '臺灣', 'tw', 'roc',
    'タイワン', '대만', 'republic of china'
  ],

  // Japan
  '🇯🇵': [
    'japan', '日本', 'jp', 'nippon', 'nihon',
    'ジャパン', '일본'
  ],

  // South Korea
  '🇰🇷': [
    'south korea', 'korea', '韓國', '韩国', '南韓', '南韩',
    'kr', 'republic of korea', 'rok',
    '韓国', '대한민국', '한국'
  ],

  // China
  '🇨🇳': [
    'china', '中國', '中国', 'cn', 'prc',
    "people's republic of china",
    '中华人民共和国', '中華人民共和國',
    '中国本土', '大陆', '大陸',
    '中華', '中华',
    'チャイナ', '중국'
  ],

  // Hong Kong
  '🇭🇰': [
    'hong kong', '香港', 'hk', 'hongkong',
    'ホンコン', '홍콩'
  ],

  // Macau
  '🇲🇴': [
    'macau', 'macao', '澳門', '澳门', 'mo',
    'マカオ', '마카오'
  ],

  // Singapore
  '🇸🇬': [
    'singapore', '新加坡', 'sg',
    'シンガポール', '싱가포르', '싱가폴'
  ],

  // Malaysia
  '🇲🇾': [
    'malaysia', '馬來西亞', '马来西亚', 'my',
    'マレーシア', '말레이시아'
  ],

  // Thailand
  '🇹🇭': [
    'thailand', '泰國', '泰国', 'th',
    'タイ', '태국'
  ],

  // Vietnam
  '🇻🇳': [
    'vietnam', 'viet nam', '越南', 'vn',
    'ベトナム', '베트남'
  ],

  // Philippines
  '🇵🇭': [
    'philippines', '菲律賓', '菲律宾', 'ph',
    'フィリピン', '필리핀'
  ],

  // Indonesia
  '🇮🇩': [
    'indonesia', '印尼', '印度尼西亞', '印度尼西亚', 'id',
    'インドネシア', '인도네시아'
  ],

  // United States
  '🇺🇸': [
    'united states', 'usa', 'us', 'america',
    '美國', '美国', 'u.s.a', 'u.s.',
    'アメリカ', '미국'
  ],

  // Canada
  '🇨🇦': [
    'canada', '加拿大', 'ca',
    'カナダ', '캐나다'
  ],

  // United Kingdom
  '🇬🇧': [
    'united kingdom', 'uk', 'great britain', 'britain',
    '英國', '英国', 'gb',
    'イギリス', '영국',
    'england', 'scotland', 'wales'
  ],

  // Australia
  '🇦🇺': [
    'australia', '澳洲', '澳大利亞', '澳大利亚', 'au',
    'オーストラリア', '호주'
  ],

  // India
  '🇮🇳': [
    'india', '印度', 'in',
    'インド', '인도'
  ],

  // France
  '🇫🇷': [
    'france', '法國', '法国', 'fr',
    'フランス', '프랑스'
  ],

  // Germany
  '🇩🇪': [
    'germany', '德國', '德国', 'de',
    'ドイツ', '독일'
  ]
};

// Build reverse lookup map (normalized location -> flag)
const locationLookup = new Map();

for (const [flag, variants] of Object.entries(LOCATION_TO_FLAG)) {
  for (const variant of variants) {
    locationLookup.set(variant.toLowerCase(), flag);
  }
}

/**
 * Get country flag emoji for a location string
 * @param {string} location - Location string from profile
 * @returns {string|null} - Flag emoji or null if not found
 */
export function getLocationFlag(location) {
  if (!location) return null;

  const normalized = location.toLowerCase().trim();

  // Direct match
  if (locationLookup.has(normalized)) {
    return locationLookup.get(normalized);
  }

  // Partial match - check if location contains any known variant
  for (const [variant, flag] of locationLookup.entries()) {
    if (normalized.includes(variant) || variant.includes(normalized)) {
      return flag;
    }
  }

  return null;
}

/**
 * Format location string with optional flag emoji
 * @param {string} location - Location string from profile
 * @param {boolean} flagOnly - If true, return only flag; otherwise return "flag location"
 * @param {boolean} showFlags - If false, skip flag display (from user setting)
 * @returns {string} - Formatted location string
 */
export function formatLocation(location, flagOnly = false, showFlags = true) {
  if (!location) return '';

  // If flags are disabled, return location text only
  if (!showFlags) {
    return location;
  }

  const flag = getLocationFlag(location);

  if (flag) {
    return flagOnly ? flag : `${flag} ${location}`;
  }

  // No flag found - return original location
  return location;
}
