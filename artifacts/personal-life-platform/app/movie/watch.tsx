import React from 'react';
import { ActivityIndicator, Platform, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { WebView } from 'react-native-webview';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { getMovieEmbedUrl } from '@/services/liveApi';
import { AuraGlow, Screen } from '@/components/ui';

export default function MovieWatchScreen(){
 const colors=useColors(); const {id,title}=useLocalSearchParams<{id:string;title?:string}>();
 const src=getMovieEmbedUrl(id||'');
 return <View style={{flex:1,backgroundColor:colors.background}}>
   <AuraGlow/>
   <View style={{paddingTop:Platform.OS==='ios'?55:32,paddingHorizontal:16,paddingBottom:10,flexDirection:'row',alignItems:'center',gap:12}}>
    <Pressable onPress={()=>router.back()} style={{width:40,height:40,borderRadius:14,backgroundColor:colors.card,borderWidth:1,borderColor:colors.border,alignItems:'center',justifyContent:'center'}}><Feather name="arrow-left" size={19} color={colors.foreground}/></Pressable>
    <View style={{flex:1}}><Text numberOfLines={1} style={{color:colors.foreground,fontSize:17,fontWeight:'700'}}>{title||'Смотреть фильм'}</Text><Text style={{color:colors.cyan,fontSize:10,fontWeight:'700',letterSpacing:1.3,marginTop:2}}>AURA PLAYER</Text></View>
   </View>
   <View style={{flex:1,marginHorizontal:10,marginBottom:10,borderRadius:18,overflow:'hidden',backgroundColor:'#05070A',borderWidth:1,borderColor:'rgba(224,231,255,.10)'}}>
    {Platform.OS === 'web'
      ? React.createElement('iframe', { src, title: title || 'Aura Player', allow: 'autoplay; fullscreen; picture-in-picture', allowFullScreen: true, style: { width: '100%', height: '100%', border: '0', backgroundColor: '#05070A' } })
      : <WebView source={{uri:src}} style={{flex:1,backgroundColor:'#05070A'}} javaScriptEnabled domStorageEnabled allowsFullscreenVideo mediaPlaybackRequiresUserAction={false} startInLoadingState renderLoading={()=> <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#05070A'}}><ActivityIndicator color={colors.primary}/><Text style={{color:'#9CA3AF',marginTop:10}}>Запускаем плеер…</Text></View>} />}
   </View>
 </View>;
}
