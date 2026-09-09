export interface Surah {
  number: number;
  name: string;
  transcription: string;
}

// Canonical surah names/transliterations. Text content is intentionally not
// embedded; the app tracks learning progress without fabricating scripture.
export const surahs: Surah[] = [
  ['Al-Fatihah'], ['Al-Baqarah'], ['Ali Imran'], ['An-Nisa'], ['Al-Maidah'],
  ['Al-Anam'], ['Al-Araf'], ['Al-Anfal'], ['At-Tawbah'], ['Yunus'],
  ['Hud'], ['Yusuf'], ['Ar-Rad'], ['Ibrahim'], ['Al-Hijr'],
  ['An-Nahl'], ['Al-Isra'], ['Al-Kahf'], ['Maryam'], ['Ta-Ha'],
  ['Al-Anbiya'], ['Al-Hajj'], ['Al-Muminun'], ['An-Nur'], ['Al-Furqan'],
  ['Ash-Shuara'], ['An-Naml'], ['Al-Qasas'], ['Al-Ankabut'], ['Ar-Rum'],
  ['Luqman'], ['As-Sajdah'], ['Al-Ahzab'], ['Saba'], ['Fatir'],
  ['Ya-Sin'], ['As-Saffat'], ['Sad'], ['Az-Zumar'], ['Ghafir'],
  ['Fussilat'], ['Ash-Shura'], ['Az-Zukhruf'], ['Ad-Dukhan'], ['Al-Jathiyah'],
  ['Al-Ahqaf'], ['Muhammad'], ['Al-Fath'], ['Al-Hujurat'], ['Qaf'],
  ['Adh-Dhariyat'], ['At-Tur'], ['An-Najm'], ['Al-Qamar'], ['Ar-Rahman'],
  ['Al-Waqiah'], ['Al-Hadid'], ['Al-Mujadilah'], ['Al-Hashr'], ['Al-Mumtahanah'],
  ['As-Saff'], ['Al-Jumah'], ['Al-Munafiqun'], ['At-Taghabun'], ['At-Talaq'],
  ['At-Tahrim'], ['Al-Mulk'], ['Al-Qalam'], ['Al-Haqqah'], ['Al-Maarij'],
  ['Nuh'], ['Al-Jinn'], ['Al-Muzzammil'], ['Al-Muddaththir'], ['Al-Qiyamah'],
  ['Al-Insan'], ['Al-Mursalat'], ['An-Naba'], ['An-Naziat'], ['Abasa'],
  ['At-Takwir'], ['Al-Infitar'], ['Al-Mutaffifin'], ['Al-Inshiqaq'], ['Al-Buruj'],
  ['At-Tariq'], ['Al-Ala'], ['Al-Ghashiyah'], ['Al-Fajr'], ['Al-Balad'],
  ['Ash-Shams'], ['Al-Lail'], ['Ad-Duha'], ['Ash-Sharh'], ['At-Tin'],
  ['Al-Alaq'], ['Al-Qadr'], ['Al-Bayyinah'], ['Az-Zalzalah'], ['Al-Adiyat'],
  ['Al-Qariah'], ['At-Takathur'], ['Al-Asr'], ['Al-Humazah'], ['Al-Fil'],
  ['Quraish'], ['Al-Maun'], ['Al-Kawthar'], ['Al-Kafirun'], ['An-Nasr'],
  ['Al-Masad'], ['Al-Ikhlas'], ['Al-Falaq'], ['An-Nas'],
].map(([name], index) => ({
  number: index + 1,
  name,
  transcription: name,
}));

export function validateSurahs(items: Surah[]): boolean {
  return items.length === 114
    && items.every((item, index) => item.number === index + 1 && item.name.trim() && item.transcription.trim())
    && new Set(items.map((item) => item.number)).size === 114;
}
