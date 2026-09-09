export type WeatherData = { temperature:number; feelsLike:number; humidity:number; wind:number; precipitation:number; code:number; fetchedAt:string };
export type AirQualityData = { pm25:number|null; pm10:number|null; europeanAqi:number|null; fetchedAt:string };
export type GeoResult = { name:string; country:string; latitude:number; longitude:number };
export type Rate = { base:string; quote:string; rate:number; date:string };
export type BookResult = { title:string; authors:string[]; year?:number; coverId?:number; key:string };
export type ShowResult = { id:number; name:string; language?:string; premiered?:string; url:string; image?:string };
export type MusicResult = { track:string; artist:string; album:string; artwork?:string; preview?:string; url:string; collectionId?:number; trackId?:number };
export type MovieResult = { id:number; title:string; overview:string; poster?:string; backdrop?:string; releaseDate?:string; rating:number; genreIds:number[]; originalLanguage?:string; tmdbUrl:string; trailerKey?:string; trailerName?:string };
export type MovieDetails = MovieResult & { runtime?:number; genres:string[]; homepage?:string; cast:string[]; trailerUrl?:string };
export type NewsResult = { title:string; url:string; score:number; time:number };

const json = async <T>(url:string, init?:RequestInit):Promise<T> => {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json() as Promise<T>;
};

export async function getWeather(latitude=42.8746, longitude=74.5698):Promise<WeatherData>{
  const q = new URLSearchParams({ latitude:String(latitude), longitude:String(longitude), current:'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m', timezone:'auto' });
  const d:any = await json(`https://api.open-meteo.com/v1/forecast?${q}`);
  return { temperature:d.current.temperature_2m, feelsLike:d.current.apparent_temperature, humidity:d.current.relative_humidity_2m, wind:d.current.wind_speed_10m, precipitation:d.current.precipitation, code:d.current.weather_code, fetchedAt:d.current.time };
}

export async function getAirQuality(latitude=42.8746, longitude=74.5698):Promise<AirQualityData>{
  const q = new URLSearchParams({ latitude:String(latitude), longitude:String(longitude), current:'pm10,pm2_5,european_aqi', timezone:'auto' });
  const d:any = await json(`https://air-quality-api.open-meteo.com/v1/air-quality?${q}`);
  return { pm25:d.current?.pm2_5 ?? null, pm10:d.current?.pm10 ?? null, europeanAqi:d.current?.european_aqi ?? null, fetchedAt:d.current?.time ?? new Date().toISOString() };
}

export async function geocodeCity(name:string):Promise<GeoResult[]> {
  if (!name.trim()) return [];
  const q = new URLSearchParams({ name, count:'5', language:'ru', format:'json' });
  const d:any = await json(`https://geocoding-api.open-meteo.com/v1/search?${q}`);
  return (d.results ?? []).map((x:any)=>({name:x.name,country:x.country ?? '',latitude:x.latitude,longitude:x.longitude}));
}

export async function getRates(base='EUR', quotes=['KGS','USD','RUB','EUR','KZT','UZS','TJS']):Promise<Rate[]> {
  const q = new URLSearchParams({ base, quotes:quotes.filter(x=>x!==base).join(',') });
  const d:any = await json(`https://api.frankfurter.dev/v2/rates?${q}`);
  return (d ?? []).map((x:any)=>({base:x.base_currency,quote:x.quote_currency,rate:x.rate,date:x.date}));
}

export async function searchBooks(query:string):Promise<BookResult[]> {
  const q = new URLSearchParams({ q:query, limit:'10', fields:'key,title,author_name,first_publish_year,cover_i' });
  const d:any = await json(`https://openlibrary.org/search.json?${q}`);
  return (d.docs ?? []).map((x:any)=>({key:x.key,title:x.title,authors:x.author_name ?? [],year:x.first_publish_year,coverId:x.cover_i}));
}

export async function searchShows(query:string):Promise<ShowResult[]> {
  const d:any[] = await json(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
  return d.map(x=>({id:x.show.id,name:x.show.name,language:x.show.language,premiered:x.show.premiered,url:x.show.url,image:x.show.image?.medium}));
}

export async function searchMusic(query:string):Promise<MusicResult[]> {
  const q = new URLSearchParams({ term:query, media:'music', entity:'song', limit:'10' });
  const d:any = await json(`https://itunes.apple.com/search?${q}`);
  return (d.results ?? []).map((x:any)=>({track:x.trackName,artist:x.artistName,album:x.collectionName,artwork:x.artworkUrl100,preview:x.previewUrl,url:x.trackViewUrl,collectionId:x.collectionId,trackId:x.trackId}));
}

export async function getTechNews(limit=10):Promise<NewsResult[]> {
  const ids:number[] = await json('https://hacker-news.firebaseio.com/v0/topstories.json');
  const picked = ids.slice(0,limit);
  const items = await Promise.all(picked.map(id=>json<any>(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)));
  return items.filter(Boolean).map(x=>({title:x.title ?? 'Без названия',url:x.url ?? `https://news.ycombinator.com/item?id=${x.id}`,score:x.score ?? 0,time:x.time ?? 0}));
}

export function weatherDescription(code:number){
  if(code===0) return 'Ясно'; if([1,2,3].includes(code)) return 'Облачно'; if([45,48].includes(code)) return 'Туман'; if([51,53,55,56,57].includes(code)) return 'Морось'; if([61,63,65,66,67].includes(code)) return 'Дождь'; if([71,73,75,77].includes(code)) return 'Снег'; if([80,81,82].includes(code)) return 'Ливень'; if([95,96,99].includes(code)) return 'Гроза'; return 'Неизвестно';
}


const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_TOKEN = process.env.EXPO_PUBLIC_TMDB_ACCESS_TOKEN;

async function tmdb<T>(path:string):Promise<T>{
  if (!TMDB_TOKEN) throw new Error('TMDB API key is not configured. Set EXPO_PUBLIC_TMDB_ACCESS_TOKEN.');
  return json<T>(`${TMDB_BASE}${path}`, { headers: { Authorization: `Bearer ${TMDB_TOKEN}`, accept: 'application/json' } });
}

export async function searchMovies(query:string):Promise<MovieResult[]> {
  if (!query.trim()) return [];
  const q = new URLSearchParams({ query, include_adult:'false', language:'ru-RU', page:'1' });
  const d:any = await tmdb(`/search/movie?${q}`);
  return (d.results ?? []).map((x:any)=>({
    id:x.id,title:x.title,overview:x.overview ?? '',poster:x.poster_path ? `https://image.tmdb.org/t/p/w500${x.poster_path}` : undefined,
    backdrop:x.backdrop_path ? `https://image.tmdb.org/t/p/w780${x.backdrop_path}` : undefined,releaseDate:x.release_date,
    rating:Number(x.vote_average ?? 0),genreIds:x.genre_ids ?? [],originalLanguage:x.original_language,tmdbUrl:`https://www.themoviedb.org/movie/${x.id}`
  }));
}

export async function getMovieDetails(id:number):Promise<MovieDetails> {
  const [movie, videos, credits] = await Promise.all([
    tmdb<any>(`/movie/${id}?language=ru-RU`),
    tmdb<any>(`/movie/${id}/videos?language=ru-RU`),
    tmdb<any>(`/movie/${id}/credits?language=ru-RU`)
  ]);
  const trailer = (videos.results ?? []).find((v:any)=>v.site === 'YouTube' && v.type === 'Trailer') || (videos.results ?? []).find((v:any)=>v.site === 'YouTube');
  return {
    id:movie.id,title:movie.title,overview:movie.overview ?? '',poster:movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
    backdrop:movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : undefined,releaseDate:movie.release_date,rating:Number(movie.vote_average ?? 0),
    genreIds:(movie.genres ?? []).map((g:any)=>g.id),genres:(movie.genres ?? []).map((g:any)=>g.name),runtime:movie.runtime,homepage:movie.homepage || undefined,
    cast:(credits.cast ?? []).slice(0,8).map((c:any)=>c.name),originalLanguage:movie.original_language,tmdbUrl:`https://www.themoviedb.org/movie/${movie.id}`,
    trailerKey:trailer?.key,trailerName:trailer?.name,trailerUrl:trailer?.key ? `https://www.youtube.com/watch?v=${trailer.key}` : undefined
  };
}
