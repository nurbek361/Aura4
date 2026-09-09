import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Linking, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useLife } from '@/context/LifeContext';
import { getMovieDetails, MovieDetails } from '@/services/liveApi';
import { AppButton, Card, Screen, SectionTitle, styles } from '@/components/ui';

export default function MovieDetail(){
 const colors=useColors(); const {id}=useLocalSearchParams<{id:string}>(); const {isMediaFavorite,toggleMediaFavorite,addMediaHistory}=useLife();
 const [movie,setMovie]=useState<MovieDetails|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState(''); const [showTrailer,setShowTrailer]=useState(false);
 useEffect(()=>{let alive=true;(async()=>{try{setLoading(true);const d=await getMovieDetails(Number(id));if(alive)setMovie(d);}catch(e:any){if(alive)setError(e?.message||'Ошибка загрузки');}finally{if(alive)setLoading(false)}})();return()=>{alive=false}},[id]);
 if(loading)return <Screen><ActivityIndicator style={{marginTop:40}} color={colors.primary}/></Screen>;
 if(error||!movie)return <Screen><Text style={{color:colors.destructive}}>{error||'Фильм не найден'}</Text></Screen>;
 const fav=isMediaFavorite('movie',String(movie.id));
 return <Screen>
  {movie.backdrop?<Image source={{uri:movie.backdrop}} style={{width:'100%',height:190,borderRadius:18}}/>:null}
  <View style={{flexDirection:'row',gap:14,marginTop:-45,paddingHorizontal:12,alignItems:'flex-end'}}>{movie.poster?<Image source={{uri:movie.poster}} style={{width:100,height:150,borderRadius:12,borderWidth:3,borderColor:colors.background}}/>:null}<View style={{flex:1,paddingBottom:5}}><Text style={{color:colors.foreground,fontWeight:'800',fontSize:24}}>{movie.title}</Text><Text style={{color:colors.mutedForeground,marginTop:4}}>{movie.releaseDate?.slice(0,4)||'—'} · ⭐ {movie.rating.toFixed(1)} {movie.runtime?`· ${movie.runtime} мин`:''}</Text></View></View>
  <View style={{flexDirection:'row',gap:8,marginTop:16}}><AppButton icon="play" onPress={()=>movie.trailerUrl && setShowTrailer(true)} disabled={!movie.trailerUrl}>{movie.trailerUrl?'Смотреть трейлер':'Трейлер недоступен'}</AppButton><Pressable onPress={()=>toggleMediaFavorite({id:String(movie.id),kind:'movie',title:movie.title,subtitle:movie.releaseDate?.slice(0,4)||'Фильм',image:movie.poster,url:movie.tmdbUrl,externalId:String(movie.id)})} style={{width:52,borderWidth:1,borderColor:colors.border,borderRadius:12,alignItems:'center',justifyContent:'center'}}><Feather name="heart" size={20} color={fav?colors.destructive:colors.mutedForeground}/></Pressable></View>
  {movie.trailerKey&&<Card style={{marginTop:16,backgroundColor:colors.secondary}}><Text style={{color:colors.foreground,fontWeight:'700'}}>Официальный трейлер</Text>{showTrailer?<><WebView source={{uri:`https://www.youtube.com/embed/${movie.trailerKey}?autoplay=1&playsinline=1&rel=0`}} style={{height:210,marginTop:10,borderRadius:12,backgroundColor:'#000'}} allowsFullscreenVideo mediaPlaybackRequiresUserAction={false}/><AppButton variant="secondary" icon="x" onPress={()=>setShowTrailer(false)}>Скрыть плеер</AppButton></>:<><Text style={{color:colors.mutedForeground,fontSize:12,marginTop:5}}>Трейлер воспроизводится внутри приложения через официальный YouTube embed.</Text><AppButton variant="secondary" icon="play-circle" onPress={()=>{addMediaHistory({id:String(movie.id),kind:'movie',title:movie.title,subtitle:'Трейлер',image:movie.poster,url:movie.tmdbUrl,externalId:String(movie.id),playedAt:new Date().toISOString()});setShowTrailer(true)}}>Запустить трейлер</AppButton></>}</Card>}
  <SectionTitle title="О фильме"/><Card><Text style={{color:colors.foreground,lineHeight:22}}>{movie.overview||'Описание отсутствует.'}</Text><Text style={{color:colors.mutedForeground,marginTop:12}}>Жанры: {movie.genres.join(', ')||'—'}</Text>{movie.cast.length>0?<Text style={{color:colors.mutedForeground,marginTop:8}}>В ролях: {movie.cast.join(', ')}</Text>:null}</Card>
  <AppButton variant="secondary" icon="external-link" onPress={()=>Linking.openURL(movie.tmdbUrl).catch(()=>undefined)}>Открыть страницу TMDB</AppButton>
 </Screen>;
}
