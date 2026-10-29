// Website palettes adapted from Microsoft VS Code's built-in themes (MIT).
export const themes = [
  {id:'solarized-light',name:'Solarized Light',kind:'light',bg:'#fdf6e3',panel:'#eee8d5',ink:'#334b54',muted:'#536970',line:'#d6d1bd',accent:'#a34215',secondary:'#176e73',selection:'#e4ddc3'},
  {id:'solarized-dark',name:'Solarized Dark',kind:'dark',bg:'#002b36',panel:'#073642',ink:'#eee8d5',muted:'#a3b4b4',line:'#22505a',accent:'#e4b04f',secondary:'#57c3ba',selection:'#164854'},
  {id:'dark-modern',name:'Dark Modern',kind:'dark',bg:'#1f1f1f',panel:'#181818',ink:'#e5e5e5',muted:'#acacac',line:'#414141',accent:'#4daafc',secondary:'#ce9178',selection:'#313131'},
  {id:'light-modern',name:'Light Modern',kind:'light',bg:'#ffffff',panel:'#f8f8f8',ink:'#1f1f1f',muted:'#616161',line:'#dedede',accent:'#005fb8',secondary:'#a31515',selection:'#e5ebf1'},
  {id:'monokai',name:'Monokai',kind:'dark',bg:'#272822',panel:'#1e1f1c',ink:'#f8f8f2',muted:'#b2b3a9',line:'#494b40',accent:'#a6e22e',secondary:'#fd7ab1',selection:'#414339'},
  {id:'quiet-light',name:'Quiet Light',kind:'light',bg:'#f5f5f5',panel:'#e9e9e9',ink:'#333333',muted:'#656565',line:'#d4d4d4',accent:'#705697',secondary:'#32731d',selection:'#ded9e8'},
  {id:'abyss',name:'Abyss',kind:'dark',bg:'#000c18',panel:'#060621',ink:'#d4dcf3',muted:'#9baacb',line:'#243355',accent:'#f280d0',secondary:'#ddbb88',selection:'#15213c'},
  {id:'high-contrast',name:'High Contrast',kind:'dark',bg:'#000000',panel:'#080808',ink:'#ffffff',muted:'#eeeeee',line:'#ffffff',accent:'#ffff00',secondary:'#00ffff',selection:'#252525'},
];
export const defaultTheme='solarized-light';
export function resolveTheme(value){return themes.find(t=>t.id===value)||themes[0]}
