const palette=' .,:;i1tfLCG08@';
export const modes=['sphere','torus','wave'];
/** Pure, deterministic character renderer. 3D points project into a z-buffer. */
export function renderAscii(mode='sphere',time=0,pointer={x:0,y:0},width=64,height=29){
 const chars=Array(width*height).fill(' '),depth=new Float32Array(width*height).fill(-Infinity);
 const a=time*.36+pointer.x*.7,b=.4+pointer.y*.65;
 const ca=Math.cos(a),sa=Math.sin(a),cb=Math.cos(b),sb=Math.sin(b);
 const point=(x,y,z,light)=>{
  const rx=x*ca-z*sa,rz=x*sa+z*ca,ry=y*cb-rz*sb,zz=y*sb+rz*cb;
  const perspective=3.7/(4.6-zz),scale=height*.30;
  const col=Math.round(width/2+rx*scale*2.15*perspective),row=Math.round(height/2+ry*scale*perspective);
  if(col<0||col>=width||row<0||row>=height)return;
  const i=row*width+col;if(zz>depth[i]){depth[i]=zz;chars[i]=palette[Math.max(1,Math.min(palette.length-1,Math.floor((light*.45+zz*.14+.45)*(palette.length-1))))]}
 };
 if(mode==='wave'){
  for(let x=-1.9;x<=1.9;x+=.075)for(let z=-1.6;z<=1.6;z+=.075){const y=.32*Math.sin(x*2.7+time*1.7)+.2*Math.cos(z*3-time);point(x,y,z,(y+.6)/1.2)}
 }else{
  const torus=mode==='torus';
  for(let u=0;u<Math.PI*2;u+=.075)for(let v=0;v<Math.PI*2;v+=.075){
   const radius=torus?1+.48*Math.cos(v):1.45*Math.sin(v);
   const x=radius*Math.cos(u),z=radius*Math.sin(u),y=torus?.48*Math.sin(v):1.45*Math.cos(v);
   point(x,y,z,(Math.cos(u-v)+1)/2);
  }
 }
 return Array.from({length:height},(_,row)=>chars.slice(row*width,(row+1)*width).join('')).join('\n');
}
