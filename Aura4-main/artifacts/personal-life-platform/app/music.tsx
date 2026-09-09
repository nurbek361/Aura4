import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useColors } from '@/hooks/useColors';
import { useLife, MediaFavorite } from '@/context/LifeContext';
import { searchMusic, MusicResult } from '@/services/liveApi';
import { AppButton, Card, Field, Screen, SectionTitle, styles } from '@/components/ui';

function TrackCard({ item, favorite, onFavorite, onPlay }: { item: MusicResult; favorite: boolean; onFavorite: () => void; onPlay: () => void }) {
  const colors = useColors();
  return <Card style={{ padding: 12 }}>
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
      {item.artwork ? <Image source={{ uri: item.artwork.replace('100x100','300x300') }} style={{ width: 72, height: 72, borderRadius: 12 }} /> : <View style={{ width:72,height:72,borderRadius:12,backgroundColor:colors.secondary,alignItems:'center',justifyContent:'center' }}><Feather name="music" size={28} color={colors.primary} /></View>}
      <View style={{ flex: 1 }}><Text numberOfLines={1} style={{ color: colors.foreground, fontWeight:'700', fontSize:16 }}>{item.track}</Text><Text numberOfLines={1} style={{ color: colors.mutedForeground, marginTop:4 }}>{item.artist}</Text><Text numberOfLines={1} style={{ color: colors.mutedForeground, fontSize:12, marginTop:3 }}>{item.album}</Text></View>
      <Pressable onPress={onFavorite} hitSlop={10}><Feather name="heart" size={21} color={favorite ? colors.destructive : colors.mutedForeground} /></Pressable>
      <Pressable onPress={onPlay} style={{ width:42,height:42,borderRadius:21,backgroundColor:colors.primary,alignItems:'center',justifyContent:'center' }}><Feather name="play" size={19} color={colors.primaryForeground} /></Pressable>
    </View>
  </Card>;
}

export default function MusicScreen() {
  const colors = useColors();
  const { mediaFavorites, mediaHistory, toggleMediaFavorite, addMediaHistory, isMediaFavorite } = useLife();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MusicResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<MusicResult | null>(null);
  const [error, setError] = useState('');
  const player = useAudioPlayer(selected?.preview ?? null, { updateInterval: 500 });
  const status = useAudioPlayerStatus(player);

  const favorites = useMemo(() => mediaFavorites.filter((x) => x.kind === 'music'), [mediaFavorites]);
  const history = useMemo(() => mediaHistory.filter((x) => x.kind === 'music'), [mediaHistory]);
  useEffect(() => { if (selected?.preview) player.play(); }, [selected?.preview]);

  const doSearch = async () => {
    if (!query.trim()) return;
    setLoading(true); setError('');
    try { setResults(await searchMusic(query)); } catch (e:any) { setError(e?.message || 'Не удалось загрузить музыку'); }
    finally { setLoading(false); }
  };
  const play = (item: MusicResult) => {
    if (!item.preview) { Linking.openURL(item.url).catch(() => undefined); return; }
    setSelected(item);
    addMediaHistory({ id: String(item.trackId ?? item.url), kind:'music', title:item.track, subtitle:item.artist, image:item.artwork, url:item.url, externalId:String(item.trackId ?? '') , playedAt:new Date().toISOString() });
  };
  const favorite = (item: MusicResult) => toggleMediaFavorite({ id:String(item.trackId ?? item.url), kind:'music', title:item.track, subtitle:item.artist, image:item.artwork, url:item.url, externalId:String(item.trackId ?? '') });

  return <Screen>
    <Text style={[styles.eyebrow,{color:colors.primary}]}>MUSIC</Text>
    <Text style={[styles.sectionTitle,{color:colors.foreground,fontSize:32}]}>Музыка</Text>
    <Text style={{color:colors.mutedForeground,marginTop:6}}>Поиск реальных треков через Apple iTunes Search API. Доступное preview воспроизводится прямо в приложении.</Text>
    <View style={{ flexDirection:'row', gap:8, marginTop:18 }}><Field value={query} onChangeText={setQuery} placeholder="Исполнитель или трек…" style={{flex:1}} /><Pressable onPress={doSearch} style={{width:50,height:50,borderRadius:14,backgroundColor:colors.primary,alignItems:'center',justifyContent:'center'}}><Feather name="search" size={20} color={colors.primaryForeground}/></Pressable></View>
    {loading && <ActivityIndicator style={{marginTop:20}} color={colors.primary}/>} {error ? <Text style={{color:colors.destructive,marginTop:14}}>{error}</Text> : null}

    {selected && <Card style={{ marginTop:18, padding:16 }}>
      <View style={{flexDirection:'row',gap:12,alignItems:'center'}}>{selected.artwork ? <Image source={{uri:selected.artwork.replace('100x100','300x300')}} style={{width:70,height:70,borderRadius:12}}/> : null}<View style={{flex:1}}><Text style={{color:colors.foreground,fontWeight:'700',fontSize:17}} numberOfLines={1}>{selected.track}</Text><Text style={{color:colors.mutedForeground,marginTop:4}}>{selected.artist}</Text></View><Pressable onPress={() => status.playing ? player.pause() : player.play()} style={{width:48,height:48,borderRadius:24,backgroundColor:colors.primary,alignItems:'center',justifyContent:'center'}}><Feather name={status.playing ? 'pause' : 'play'} size={20} color={colors.primaryForeground}/></Pressable></View>
      <View style={{height:6,borderRadius:4,backgroundColor:colors.secondary,overflow:'hidden',marginTop:16}}><View style={{height:'100%',backgroundColor:colors.primary,width:`${status.duration ? Math.min(100,status.currentTime/status.duration*100) : 0}%`}}/></View>
      <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:7}}><Text style={{color:colors.mutedForeground,fontSize:11}}>{Math.floor(status.currentTime/60)}:{String(Math.floor(status.currentTime%60)).padStart(2,'0')}</Text><Text style={{color:colors.mutedForeground,fontSize:11}}>{Math.floor(status.duration/60)}:{String(Math.floor(status.duration%60)).padStart(2,'0')}</Text></View>
      <AppButton variant="secondary" icon="external-link" onPress={() => Linking.openURL(selected.url).catch(() => undefined)}>Открыть официальный источник</AppButton>
    </Card>}

    {results.length > 0 && <><SectionTitle title="Результаты" /><ScrollView scrollEnabled={false}>{results.map((item) => <TrackCard key={item.trackId ?? item.url} item={item} favorite={isMediaFavorite('music',String(item.trackId ?? item.url))} onFavorite={() => favorite(item)} onPlay={() => play(item)} />)}</ScrollView></>}
    {favorites.length > 0 && <><SectionTitle title="Избранное" /><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:10}}>{favorites.map((item) => <Pressable key={item.id} onPress={() => item.url && Linking.openURL(item.url)} style={{width:145}}><Card style={{padding:10}}>{item.image ? <Image source={{uri:item.image}} style={{width:125,height:125,borderRadius:10}}/> : null}<Text numberOfLines={1} style={{color:colors.foreground,fontWeight:'700',marginTop:8}}>{item.title}</Text><Text numberOfLines={1} style={{color:colors.mutedForeground,fontSize:12,marginTop:3}}>{item.subtitle}</Text></Card></Pressable>)}</ScrollView></>}
    {history.length > 0 && <><SectionTitle title="История" /><Card>{history.slice(0,8).map((item,index)=><Pressable key={item.id} onPress={() => item.url && Linking.openURL(item.url)} style={{paddingVertical:10,borderBottomWidth:index===Math.min(history.length,8)-1?0:1,borderBottomColor:colors.border}}><Text style={{color:colors.foreground,fontWeight:'600'}}>{item.title}</Text><Text style={{color:colors.mutedForeground,fontSize:12,marginTop:3}}>{item.subtitle} · {new Date(item.playedAt).toLocaleDateString('ru-RU')}</Text></Pressable>)}</Card></>}
  </Screen>;
}
