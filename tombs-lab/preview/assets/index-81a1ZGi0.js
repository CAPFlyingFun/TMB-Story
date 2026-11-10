(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();const gl="185",ms={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},us={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Rf=0,th=1,Pf=2,Gm=3,Hm=0,Gr=1,If=2,er=3,Mi=0,cn=1,en=2,ii=0,gs=1,eh=2,nh=3,ih=4,Lf=5,Wm=6,Oi=100,Df=101,Nf=102,Uf=103,Of=104,Ff=200,Bf=201,kf=202,zf=203,wo=204,Eo=205,Vf=206,Gf=207,Hf=208,Wf=209,Xf=210,Yf=211,qf=212,$f=213,Zf=214,To=0,Ao=1,Co=2,vs=3,Ro=4,Po=5,Io=6,Lo=7,ga=0,Jf=1,Kf=2,Wn=0,Th=1,Ah=2,Ch=3,_l=4,Rh=5,Ph=6,Ih=7,sh="attached",jf="detached",xl=300,si=301,Hi=302,Hr=303,Wr=304,xr=306,or=1e3,_n=1001,Qr=1002,De=1003,Lh=1004,Xm=1004,nr=1005,Ym=1005,we=1006,Xr=1007,qm=1007,ti=1008,$m=1008,mn=1009,Dh=1010,Nh=1011,lr=1012,yl=1013,Un=1014,on=1015,ri=1016,vl=1017,Ml=1018,cr=1020,Uh=35902,Oh=35899,Fh=1021,Bh=1022,ln=1023,ai=1026,Fi=1027,bl=1028,_a=1029,Wi=1030,Sl=1031,Zm=1032,wl=1033,Yr=33776,qr=33777,$r=33778,Zr=33779,Do=35840,No=35841,Uo=35842,Oo=35843,Fo=36196,Bo=37492,ko=37496,zo=37488,Vo=37489,ta=37490,Go=37491,Ho=37808,Wo=37809,Xo=37810,Yo=37811,qo=37812,$o=37813,Zo=37814,Jo=37815,Ko=37816,jo=37817,Qo=37818,tl=37819,el=37820,nl=37821,il=36492,sl=36494,rl=36495,al=36283,ol=36284,ea=36285,ll=36286,Qf=2200,tp=2201,ep=2202,na=2300,cl=2301,vo=2302,rh=2303,ds=2400,fs=2401,ia=2402,El=2500,kh=2501,Jm=0,Km=1,jm=2,np=3200,Qm=3201,t0=3202,e0=3203,bi=0,ip=1,xi="",Ge="srgb",sa="srgb-linear",ra="linear",he="srgb",n0="",i0="rg",s0="ga",r0=0,cs=7680,a0=7681,o0=7682,l0=7683,c0=34055,h0=34056,u0=5386,d0=512,f0=513,p0=514,m0=515,g0=516,_0=517,x0=518,ah=519,sp=512,rp=513,ap=514,Tl=515,op=516,lp=517,Al=518,cp=519,aa=35044,y0=35048,v0=35040,M0=35045,b0=35049,S0=35041,w0=35046,E0=35050,T0=35042,A0="100",oh="300 es",wn=2e3,Ms=2001,C0={COMPUTE:"compute",RENDER:"render"},R0={PERSPECTIVE:"perspective",LINEAR:"linear",FLAT:"flat"},P0={NORMAL:"normal",CENTROID:"centroid",SAMPLE:"sample",FIRST:"first",EITHER:"either"},I0={TEXTURE_COMPARE:"depthTextureCompare"};function L0(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}const D0={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array};function ir(s,t){return new D0[s](t)}function hp(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function oa(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function up(){const s=oa("canvas");return s.style.display="block",s}const Bu={};let Xi=null;function N0(s){Xi=s}function U0(){return Xi}function la(...s){const t="THREE."+s.shift();Xi?Xi("log",t,...s):console.log(t,...s)}function dp(s){const t=s[0];if(typeof t=="string"&&t.startsWith("TSL:")){const e=s[1];e&&e.isStackTrace?s[0]+=" "+e.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function ut(...s){s=dp(s);const t="THREE."+s.shift();if(Xi)Xi("warn",t,...s);else{const e=s[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...s)}}function It(...s){s=dp(s);const t="THREE."+s.shift();if(Xi)Xi("error",t,...s);else{const e=s[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...s)}}function Vi(...s){const t=s.join(" ");t in Bu||(Bu[t]=!0,ut(...s))}function O0(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const F0={[To]:Ao,[Co]:Io,[Ro]:Lo,[vs]:Po,[Ao]:To,[Io]:Co,[Lo]:Ro,[Po]:vs};class qn{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const i=n[t];if(i!==void 0){const r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,t);t.target=null}}}const Ze=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ku=1234567;const _s=Math.PI/180,hr=180/Math.PI;function Tn(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ze[s&255]+Ze[s>>8&255]+Ze[s>>16&255]+Ze[s>>24&255]+"-"+Ze[t&255]+Ze[t>>8&255]+"-"+Ze[t>>16&15|64]+Ze[t>>24&255]+"-"+Ze[e&63|128]+Ze[e>>8&255]+"-"+Ze[e>>16&255]+Ze[e>>24&255]+Ze[n&255]+Ze[n>>8&255]+Ze[n>>16&255]+Ze[n>>24&255]).toLowerCase()}function Wt(s,t,e){return Math.max(t,Math.min(e,s))}function zh(s,t){return(s%t+t)%t}function B0(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function k0(s,t,e){return s!==t?(e-s)/(t-s):0}function Jr(s,t,e){return(1-e)*s+e*t}function z0(s,t,e,n){return Jr(s,t,1-Math.exp(-e*n))}function V0(s,t=1){return t-Math.abs(zh(s,t*2)-t)}function G0(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function H0(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function W0(s,t){return s+Math.floor(Math.random()*(t-s+1))}function X0(s,t){return s+Math.random()*(t-s)}function Y0(s){return s*(.5-Math.random())}function q0(s){s!==void 0&&(ku=s);let t=ku+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function $0(s){return s*_s}function Z0(s){return s*hr}function J0(s){return(s&s-1)===0&&s!==0}function K0(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function j0(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Q0(s,t,e,n,i){const r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+n)/2),h=a((t+n)/2),d=r((t-n)/2),u=a((t-n)/2),f=r((n-t)/2),p=a((n-t)/2);switch(i){case"XYX":s.set(o*h,l*d,l*u,o*c);break;case"YZY":s.set(l*u,o*h,l*d,o*c);break;case"ZXZ":s.set(l*d,l*u,o*h,o*c);break;case"XZX":s.set(o*h,l*p,l*f,o*c);break;case"YXY":s.set(l*f,o*h,l*p,o*c);break;case"ZYZ":s.set(l*p,l*f,o*h,o*c);break;default:ut("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function an(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Qt(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Cl={DEG2RAD:_s,RAD2DEG:hr,generateUUID:Tn,clamp:Wt,euclideanModulo:zh,mapLinear:B0,inverseLerp:k0,lerp:Jr,damp:z0,pingpong:V0,smoothstep:G0,smootherstep:H0,randInt:W0,randFloat:X0,randFloatSpread:Y0,seededRandom:q0,degToRad:$0,radToDeg:Z0,isPowerOfTwo:J0,ceilPowerOfTwo:K0,floorPowerOfTwo:j0,setQuaternionFromProperEuler:Q0,normalize:Qt,denormalize:an},wu=class wu{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Wt(this.x,t.x,e.x),this.y=Wt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Wt(this.x,t,e),this.y=Wt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Wt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Wt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*i+t.x,this.y=r*i+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};wu.prototype.isVector2=!0;let J=wu;class Xe{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],d=n[i+3],u=r[a+0],f=r[a+1],p=r[a+2],_=r[a+3];if(d!==_||l!==u||c!==f||h!==p){let m=l*u+c*f+h*p+d*_;m<0&&(u=-u,f=-f,p=-p,_=-_,m=-m);let g=1-o;if(m<.9995){const v=Math.acos(m),b=Math.sin(v);g=Math.sin(g*v)/b,o=Math.sin(o*v)/b,l=l*g+u*o,c=c*g+f*o,h=h*g+p*o,d=d*g+_*o}else{l=l*g+u*o,c=c*g+f*o,h=h*g+p*o,d=d*g+_*o;const v=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=v,c*=v,h*=v,d*=v}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,i,r,a){const o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],d=r[a],u=r[a+1],f=r[a+2],p=r[a+3];return t[e]=o*p+h*d+l*f-c*u,t[e+1]=l*p+h*u+c*d-o*f,t[e+2]=c*p+h*f+o*u-l*d,t[e+3]=h*p-o*d-l*u-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),d=o(r/2),u=l(n/2),f=l(i/2),p=l(r/2);switch(a){case"XYZ":this._x=u*h*d+c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d-u*f*p;break;case"YXZ":this._x=u*h*d+c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d+u*f*p;break;case"ZXY":this._x=u*h*d-c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d-u*f*p;break;case"ZYX":this._x=u*h*d-c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d+u*f*p;break;case"YZX":this._x=u*h*d+c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d-u*f*p;break;case"XZY":this._x=u*h*d-c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d+u*f*p;break;default:ut("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=n+o+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-i)*f}else if(n>o&&n>d){const f=2*Math.sqrt(1+n-o-d);this._w=(h-l)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(r+c)/f}else if(o>d){const f=2*Math.sqrt(1+o-n-d);this._w=(r-c)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+d-n-o);this._w=(a-i)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Wt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+i*c-r*l,this._y=i*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,i=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,i=-i,r=-r,a=-a,o=-o);let l=1-e;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Eu=class Eu{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(zu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(zu.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*i-o*n),h=2*(o*e-r*i),d=2*(r*n-a*e);return this.x=e+l*c+a*d-o*h,this.y=n+l*h+o*c-r*d,this.z=i+l*d+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Wt(this.x,t.x,e.x),this.y=Wt(this.y,t.y,e.y),this.z=Wt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Wt(this.x,t,e),this.y=Wt(this.y,t,e),this.z=Wt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Wt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=i*l-r*o,this.y=r*a-n*l,this.z=n*o-i*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ac.copy(this).projectOnVector(t),this.sub(ac)}reflect(t){return this.sub(ac.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Wt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Eu.prototype.isVector3=!0;let C=Eu;const ac=new C,zu=new Xe,Tu=class Tu{constructor(t,e,n,i,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,l,c)}set(t,e,n,i,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=i,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],f=n[5],p=n[8],_=i[0],m=i[3],g=i[6],v=i[1],b=i[4],y=i[7],T=i[2],S=i[5],A=i[8];return r[0]=a*_+o*v+l*T,r[3]=a*m+o*b+l*S,r[6]=a*g+o*y+l*A,r[1]=c*_+h*v+d*T,r[4]=c*m+h*b+d*S,r[7]=c*g+h*y+d*A,r[2]=u*_+f*v+p*T,r[5]=u*m+f*b+p*S,r[8]=u*g+f*y+p*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+i*r*c-i*a*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=h*a-o*c,u=o*l-h*r,f=c*r-a*l,p=e*d+n*u+i*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/p;return t[0]=d*_,t[1]=(i*c-h*n)*_,t[2]=(o*n-i*a)*_,t[3]=u*_,t[4]=(h*e-i*l)*_,t[5]=(i*r-o*e)*_,t[6]=f*_,t[7]=(n*l-c*e)*_,t[8]=(a*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-i*c,i*l,-i*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return Vi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(oc.makeScale(t,e)),this}rotate(t){return Vi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(oc.makeRotation(-t)),this}translate(t,e){return Vi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(oc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};Tu.prototype.isMatrix3=!0;let $t=Tu;const oc=new $t,Vu=new $t().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Gu=new $t().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function tg(){const s={enabled:!0,workingColorSpace:sa,spaces:{},convert:function(i,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===he&&(i.r=vi(i.r),i.g=vi(i.g),i.b=vi(i.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===he&&(i.r=rr(i.r),i.g=rr(i.g),i.b=rr(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===xi?ra:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,a){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return Vi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return Vi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[sa]:{primaries:t,whitePoint:n,transfer:ra,toXYZ:Vu,fromXYZ:Gu,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Ge},outputColorSpaceConfig:{drawingBufferColorSpace:Ge}},[Ge]:{primaries:t,whitePoint:n,transfer:he,toXYZ:Vu,fromXYZ:Gu,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Ge}}}),s}const ae=tg();function vi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function rr(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Ns;class fp{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Ns===void 0&&(Ns=oa("canvas")),Ns.width=t.width,Ns.height=t.height;const i=Ns.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=Ns}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=oa("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=vi(r[a]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(vi(e[n]/255)*255):e[n]=vi(e[n]);return{data:e,width:t.width,height:t.height}}else return ut("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let eg=0;class Bi{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:eg++}),this.uuid=Tn(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(lc(i[a].image)):r.push(lc(i[a]))}else r=lc(i);n.url=r}return e||(t.images[this.uuid]=n),n}}function lc(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?fp.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(ut("Texture: Unable to serialize Texture."),{})}let ng=0;const cc=new C;class Te extends qn{constructor(t=Te.DEFAULT_IMAGE,e=Te.DEFAULT_MAPPING,n=_n,i=_n,r=we,a=ti,o=ln,l=mn,c=Te.DEFAULT_ANISOTROPY,h=xi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ng++}),this.uuid=Tn(),this.name="",this.source=new Bi(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new J(0,0),this.repeat=new J(1,1),this.center=new J(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $t,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(cc).x}get height(){return this.source.getSize(cc).y}get depth(){return this.source.getSize(cc).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){ut(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){ut(`Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==xl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case or:t.x=t.x-Math.floor(t.x);break;case _n:t.x=t.x<0?0:1;break;case Qr:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case or:t.y=t.y-Math.floor(t.y);break;case _n:t.y=t.y<0?0:1;break;case Qr:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Te.DEFAULT_IMAGE=null;Te.DEFAULT_MAPPING=xl;Te.DEFAULT_ANISOTROPY=1;const Au=class Au{constructor(t=0,e=0,n=0,i=1){this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*i+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r;const l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],p=l[9],_=l[2],m=l[6],g=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-_)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+_)<.1&&Math.abs(p+m)<.1&&Math.abs(c+f+g-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const b=(c+1)/2,y=(f+1)/2,T=(g+1)/2,S=(h+u)/4,A=(d+_)/4,x=(p+m)/4;return b>y&&b>T?b<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(b),i=S/n,r=A/n):y>T?y<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(y),n=S/i,r=x/i):T<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(T),n=A/r,i=x/r),this.set(n,i,r,e),this}let v=Math.sqrt((m-p)*(m-p)+(d-_)*(d-_)+(u-h)*(u-h));return Math.abs(v)<.001&&(v=1),this.x=(m-p)/v,this.y=(d-_)/v,this.z=(u-h)/v,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Wt(this.x,t.x,e.x),this.y=Wt(this.y,t.y,e.y),this.z=Wt(this.z,t.z,e.z),this.w=Wt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Wt(this.x,t,e),this.y=Wt(this.y,t,e),this.z=Wt(this.z,t,e),this.w=Wt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Wt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Au.prototype.isVector4=!0;let pe=Au;class Vh extends qn{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:we,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new pe(0,0,t,e),this.scissorTest=!1,this.viewport=new pe(0,0,t,e),this.textures=[];const i={width:t,height:e,depth:n.depth},r=new Te(i),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){const e={minFilter:we,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const i=Object.assign({},t.textures[e].image);this.textures[e].source=new Bi(i)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class An extends Vh{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Rl extends Te{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=De,this.minFilter=De,this.wrapR=_n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class ig extends An{constructor(t=1,e=1,n=1,i={}){super(t,e,i),this.isWebGLArrayRenderTarget=!0,this.depth=n,this.texture=new Rl(null,t,e,n),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}}class Pl extends Te{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=De,this.minFilter=De,this.wrapR=_n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class sg extends An{constructor(t=1,e=1,n=1,i={}){super(t,e,i),this.isWebGL3DRenderTarget=!0,this.depth=n,this.texture=new Pl(null,t,e,n),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}}const ml=class ml{constructor(t,e,n,i,r,a,o,l,c,h,d,u,f,p,_,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,l,c,h,d,u,f,p,_,m)}set(t,e,n,i,r,a,o,l,c,h,d,u,f,p,_,m){const g=this.elements;return g[0]=t,g[4]=e,g[8]=n,g[12]=i,g[1]=r,g[5]=a,g[9]=o,g[13]=l,g[2]=c,g[6]=h,g[10]=d,g[14]=u,g[3]=f,g[7]=p,g[11]=_,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ml().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();const e=this.elements,n=t.elements,i=1/Us.setFromMatrixColumn(t,0).length(),r=1/Us.setFromMatrixColumn(t,1).length(),a=1/Us.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){const u=a*h,f=a*d,p=o*h,_=o*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=f+p*c,e[5]=u-_*c,e[9]=-o*l,e[2]=_-u*c,e[6]=p+f*c,e[10]=a*l}else if(t.order==="YXZ"){const u=l*h,f=l*d,p=c*h,_=c*d;e[0]=u+_*o,e[4]=p*o-f,e[8]=a*c,e[1]=a*d,e[5]=a*h,e[9]=-o,e[2]=f*o-p,e[6]=_+u*o,e[10]=a*l}else if(t.order==="ZXY"){const u=l*h,f=l*d,p=c*h,_=c*d;e[0]=u-_*o,e[4]=-a*d,e[8]=p+f*o,e[1]=f+p*o,e[5]=a*h,e[9]=_-u*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const u=a*h,f=a*d,p=o*h,_=o*d;e[0]=l*h,e[4]=p*c-f,e[8]=u*c+_,e[1]=l*d,e[5]=_*c+u,e[9]=f*c-p,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const u=a*l,f=a*c,p=o*l,_=o*c;e[0]=l*h,e[4]=_-u*d,e[8]=p*d+f,e[1]=d,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=f*d+p,e[10]=u-_*d}else if(t.order==="XZY"){const u=a*l,f=a*c,p=o*l,_=o*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+_,e[5]=a*h,e[9]=f*d-p,e[2]=p*d-f,e[6]=o*h,e[10]=_*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(rg,t,ag)}lookAt(t,e,n){const i=this.elements;return bn.subVectors(t,e),bn.lengthSq()===0&&(bn.z=1),bn.normalize(),Ri.crossVectors(n,bn),Ri.lengthSq()===0&&(Math.abs(n.z)===1?bn.x+=1e-4:bn.z+=1e-4,bn.normalize(),Ri.crossVectors(n,bn)),Ri.normalize(),Aa.crossVectors(bn,Ri),i[0]=Ri.x,i[4]=Aa.x,i[8]=bn.x,i[1]=Ri.y,i[5]=Aa.y,i[9]=bn.y,i[2]=Ri.z,i[6]=Aa.z,i[10]=bn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],f=n[13],p=n[2],_=n[6],m=n[10],g=n[14],v=n[3],b=n[7],y=n[11],T=n[15],S=i[0],A=i[4],x=i[8],w=i[12],L=i[1],D=i[5],N=i[9],P=i[13],F=i[2],I=i[6],z=i[10],O=i[14],X=i[3],j=i[7],at=i[11],rt=i[15];return r[0]=a*S+o*L+l*F+c*X,r[4]=a*A+o*D+l*I+c*j,r[8]=a*x+o*N+l*z+c*at,r[12]=a*w+o*P+l*O+c*rt,r[1]=h*S+d*L+u*F+f*X,r[5]=h*A+d*D+u*I+f*j,r[9]=h*x+d*N+u*z+f*at,r[13]=h*w+d*P+u*O+f*rt,r[2]=p*S+_*L+m*F+g*X,r[6]=p*A+_*D+m*I+g*j,r[10]=p*x+_*N+m*z+g*at,r[14]=p*w+_*P+m*O+g*rt,r[3]=v*S+b*L+y*F+T*X,r[7]=v*A+b*D+y*I+T*j,r[11]=v*x+b*N+y*z+T*at,r[15]=v*w+b*P+y*O+T*rt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],f=t[14],p=t[3],_=t[7],m=t[11],g=t[15],v=l*f-c*u,b=o*f-c*d,y=o*u-l*d,T=a*f-c*h,S=a*u-l*h,A=a*d-o*h;return e*(_*v-m*b+g*y)-n*(p*v-m*T+g*S)+i*(p*b-_*T+g*A)-r*(p*y-_*S+m*A)}determinantAffine(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[1],a=t[5],o=t[9],l=t[2],c=t[6],h=t[10];return e*(a*h-o*c)-n*(r*h-o*l)+i*(r*c-a*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],f=t[11],p=t[12],_=t[13],m=t[14],g=t[15],v=e*o-n*a,b=e*l-i*a,y=e*c-r*a,T=n*l-i*o,S=n*c-r*o,A=i*c-r*l,x=h*_-d*p,w=h*m-u*p,L=h*g-f*p,D=d*m-u*_,N=d*g-f*_,P=u*g-f*m,F=v*P-b*N+y*D+T*L-S*w+A*x;if(F===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const I=1/F;return t[0]=(o*P-l*N+c*D)*I,t[1]=(i*N-n*P-r*D)*I,t[2]=(_*A-m*S+g*T)*I,t[3]=(u*S-d*A-f*T)*I,t[4]=(l*L-a*P-c*w)*I,t[5]=(e*P-i*L+r*w)*I,t[6]=(m*y-p*A-g*b)*I,t[7]=(h*A-u*y+f*b)*I,t[8]=(a*N-o*L+c*x)*I,t[9]=(n*L-e*N-r*x)*I,t[10]=(p*S-_*y+g*v)*I,t[11]=(d*y-h*S-f*v)*I,t[12]=(o*w-a*D-l*x)*I,t[13]=(e*D-n*w+i*x)*I,t[14]=(_*b-p*T-m*v)*I,t[15]=(h*T-d*b+u*v)*I,this}scale(t){const e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,a){return this.set(1,n,r,0,t,1,a,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,d=o+o,u=r*c,f=r*h,p=r*d,_=a*h,m=a*d,g=o*d,v=l*c,b=l*h,y=l*d,T=n.x,S=n.y,A=n.z;return i[0]=(1-(_+g))*T,i[1]=(f+y)*T,i[2]=(p-b)*T,i[3]=0,i[4]=(f-y)*S,i[5]=(1-(u+g))*S,i[6]=(m+v)*S,i[7]=0,i[8]=(p+b)*A,i[9]=(m-v)*A,i[10]=(1-(u+_))*A,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;t.x=i[12],t.y=i[13],t.z=i[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let a=Us.set(i[0],i[1],i[2]).length();const o=Us.set(i[4],i[5],i[6]).length(),l=Us.set(i[8],i[9],i[10]).length();r<0&&(a=-a),Bn.copy(this);const c=1/a,h=1/o,d=1/l;return Bn.elements[0]*=c,Bn.elements[1]*=c,Bn.elements[2]*=c,Bn.elements[4]*=h,Bn.elements[5]*=h,Bn.elements[6]*=h,Bn.elements[8]*=d,Bn.elements[9]*=d,Bn.elements[10]*=d,e.setFromRotationMatrix(Bn),n.x=a,n.y=o,n.z=l,this}makePerspective(t,e,n,i,r,a,o=wn,l=!1){const c=this.elements,h=2*r/(e-t),d=2*r/(n-i),u=(e+t)/(e-t),f=(n+i)/(n-i);let p,_;if(l)p=r/(a-r),_=a*r/(a-r);else if(o===wn)p=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===Ms)p=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,r,a,o=wn,l=!1){const c=this.elements,h=2/(e-t),d=2/(n-i),u=-(e+t)/(e-t),f=-(n+i)/(n-i);let p,_;if(l)p=1/(a-r),_=a/(a-r);else if(o===wn)p=-2/(a-r),_=-(a+r)/(a-r);else if(o===Ms)p=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};ml.prototype.isMatrix4=!0;let Xt=ml;const Us=new C,Bn=new Xt,rg=new C(0,0,0),ag=new C(1,1,1),Ri=new C,Aa=new C,bn=new C,Hu=new Xt,Wu=new Xe;class Xn{constructor(t=0,e=0,n=0,i=Xn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,r=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],d=i[2],u=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(Wt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Wt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Wt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Wt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Wt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Wt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:ut("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Hu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Hu,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Wu.setFromEuler(this),this.setFromQuaternion(Wu,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Xn.DEFAULT_ORDER="XYZ";class Il{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let og=0;const Xu=new C,Os=new Xe,hi=new Xt,Ca=new C,br=new C,lg=new C,cg=new Xe,Yu=new C(1,0,0),qu=new C(0,1,0),$u=new C(0,0,1),Zu={type:"added"},hg={type:"removed"},Fs={type:"childadded",child:null},hc={type:"childremoved",child:null};class oe extends qn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:og++}),this.uuid=Tn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=oe.DEFAULT_UP.clone();const t=new C,e=new Xn,n=new Xe,i=new C(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Xt},normalMatrix:{value:new $t}}),this.matrix=new Xt,this.matrixWorld=new Xt,this.matrixAutoUpdate=oe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=oe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Il,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Os.setFromAxisAngle(t,e),this.quaternion.multiply(Os),this}rotateOnWorldAxis(t,e){return Os.setFromAxisAngle(t,e),this.quaternion.premultiply(Os),this}rotateX(t){return this.rotateOnAxis(Yu,t)}rotateY(t){return this.rotateOnAxis(qu,t)}rotateZ(t){return this.rotateOnAxis($u,t)}translateOnAxis(t,e){return Xu.copy(t).applyQuaternion(this.quaternion),this.position.add(Xu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Yu,t)}translateY(t){return this.translateOnAxis(qu,t)}translateZ(t){return this.translateOnAxis($u,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(hi.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Ca.copy(t):Ca.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),br.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?hi.lookAt(br,Ca,this.up):hi.lookAt(Ca,br,this.up),this.quaternion.setFromRotationMatrix(hi),i&&(hi.extractRotation(i.matrixWorld),Os.setFromRotationMatrix(hi),this.quaternion.premultiply(Os.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(It("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Zu),Fs.child=t,this.dispatchEvent(Fs),Fs.child=null):It("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(hg),hc.child=t,this.dispatchEvent(hc),hc.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),hi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),hi.multiply(t.parent.matrixWorld)),t.applyMatrix4(hi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Zu),Fs.child=t,this.dispatchEvent(Fs),Fs.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(br,t,lg),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(br,cg,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const e=t.x,n=t.y,i=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*i,r[13]+=n-r[1]*e-r[5]*n-r[9]*i,r[14]+=i-r[2]*e-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),this.static!==!1&&(i.static=this.static),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));i.material=o}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),d=a(t.shapes),u=a(t.skeletons),f=a(t.animations),p=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=i,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}oe.DEFAULT_UP=new C(0,1,0);oe.DEFAULT_MATRIX_AUTO_UPDATE=!0;oe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class de extends oe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const ug={type:"move"};class Mo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new de,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new de,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new de,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),g=this._getHandJoint(c,_);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,p=.005;c.inputState.pinching&&u>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(ug)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new de;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const pp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Pi={h:0,s:0,l:0},Ra={h:0,s:0,l:0};function uc(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class St{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ge){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ae.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=ae.workingColorSpace){return this.r=t,this.g=e,this.b=n,ae.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=ae.workingColorSpace){if(t=zh(t,1),e=Wt(e,0,1),n=Wt(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=uc(a,r,t+1/3),this.g=uc(a,r,t),this.b=uc(a,r,t-1/3)}return ae.colorSpaceToWorking(this,i),this}setStyle(t,e=Ge){function n(r){r!==void 0&&parseFloat(r)<1&&ut("Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:ut("Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);ut("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ge){const n=pp[t.toLowerCase()];return n!==void 0?this.setHex(n,e):ut("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=vi(t.r),this.g=vi(t.g),this.b=vi(t.b),this}copyLinearToSRGB(t){return this.r=rr(t.r),this.g=rr(t.g),this.b=rr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ge){return ae.workingToColorSpace(Je.copy(this),t),Math.round(Wt(Je.r*255,0,255))*65536+Math.round(Wt(Je.g*255,0,255))*256+Math.round(Wt(Je.b*255,0,255))}getHexString(t=Ge){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ae.workingColorSpace){ae.workingToColorSpace(Je.copy(this),e);const n=Je.r,i=Je.g,r=Je.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case n:l=(i-r)/d+(i<r?6:0);break;case i:l=(r-n)/d+2;break;case r:l=(n-i)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=ae.workingColorSpace){return ae.workingToColorSpace(Je.copy(this),e),t.r=Je.r,t.g=Je.g,t.b=Je.b,t}getStyle(t=Ge){ae.workingToColorSpace(Je.copy(this),t);const e=Je.r,n=Je.g,i=Je.b;return t!==Ge?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Pi),this.setHSL(Pi.h+t,Pi.s+e,Pi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Pi),t.getHSL(Ra);const n=Jr(Pi.h,Ra.h,e),i=Jr(Pi.s,Ra.s,e),r=Jr(Pi.l,Ra.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Je=new St;St.NAMES=pp;class Ll{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new St(t),this.density=e}clone(){return new Ll(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class xa{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new St(t),this.near=e,this.far=n}clone(){return new xa(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Gh extends oe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Xn,this.environmentIntensity=1,this.environmentRotation=new Xn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}const kn=new C,ui=new C,dc=new C,di=new C,Bs=new C,ks=new C,Ju=new C,fc=new C,pc=new C,mc=new C,gc=new pe,_c=new pe,xc=new pe;class gn{constructor(t=new C,e=new C,n=new C){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),kn.subVectors(t,e),i.cross(kn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){kn.subVectors(i,e),ui.subVectors(n,e),dc.subVectors(t,e);const a=kn.dot(kn),o=kn.dot(ui),l=kn.dot(dc),c=ui.dot(ui),h=ui.dot(dc),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;const u=1/d,f=(c*l-o*h)*u,p=(a*h-o*l)*u;return r.set(1-f-p,p,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,di)===null?!1:di.x>=0&&di.y>=0&&di.x+di.y<=1}static getInterpolation(t,e,n,i,r,a,o,l){return this.getBarycoord(t,e,n,i,di)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,di.x),l.addScaledVector(a,di.y),l.addScaledVector(o,di.z),l)}static getInterpolatedAttribute(t,e,n,i,r,a){return gc.setScalar(0),_c.setScalar(0),xc.setScalar(0),gc.fromBufferAttribute(t,e),_c.fromBufferAttribute(t,n),xc.fromBufferAttribute(t,i),a.setScalar(0),a.addScaledVector(gc,r.x),a.addScaledVector(_c,r.y),a.addScaledVector(xc,r.z),a}static isFrontFacing(t,e,n,i){return kn.subVectors(n,e),ui.subVectors(t,e),kn.cross(ui).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return kn.subVectors(this.c,this.b),ui.subVectors(this.a,this.b),kn.cross(ui).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return gn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return gn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return gn.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return gn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return gn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,r=this.c;let a,o;Bs.subVectors(i,n),ks.subVectors(r,n),fc.subVectors(t,n);const l=Bs.dot(fc),c=ks.dot(fc);if(l<=0&&c<=0)return e.copy(n);pc.subVectors(t,i);const h=Bs.dot(pc),d=ks.dot(pc);if(h>=0&&d<=h)return e.copy(i);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(Bs,a);mc.subVectors(t,r);const f=Bs.dot(mc),p=ks.dot(mc);if(p>=0&&f<=p)return e.copy(r);const _=f*c-l*p;if(_<=0&&c>=0&&p<=0)return o=c/(c-p),e.copy(n).addScaledVector(ks,o);const m=h*p-f*d;if(m<=0&&d-h>=0&&f-p>=0)return Ju.subVectors(r,i),o=(d-h)/(d-h+(f-p)),e.copy(i).addScaledVector(Ju,o);const g=1/(m+_+u);return a=_*g,o=u*g,e.copy(n).addScaledVector(Bs,a).addScaledVector(ks,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}class nn{constructor(t=new C(1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(zn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(zn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=zn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,zn):zn.fromBufferAttribute(r,a),zn.applyMatrix4(t.matrixWorld),this.expandByPoint(zn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Pa.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Pa.copy(n.boundingBox)),Pa.applyMatrix4(t.matrixWorld),this.union(Pa)}const i=t.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,zn),zn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Sr),Ia.subVectors(this.max,Sr),zs.subVectors(t.a,Sr),Vs.subVectors(t.b,Sr),Gs.subVectors(t.c,Sr),Ii.subVectors(Vs,zs),Li.subVectors(Gs,Vs),Ki.subVectors(zs,Gs);let e=[0,-Ii.z,Ii.y,0,-Li.z,Li.y,0,-Ki.z,Ki.y,Ii.z,0,-Ii.x,Li.z,0,-Li.x,Ki.z,0,-Ki.x,-Ii.y,Ii.x,0,-Li.y,Li.x,0,-Ki.y,Ki.x,0];return!yc(e,zs,Vs,Gs,Ia)||(e=[1,0,0,0,1,0,0,0,1],!yc(e,zs,Vs,Gs,Ia))?!1:(La.crossVectors(Ii,Li),e=[La.x,La.y,La.z],yc(e,zs,Vs,Gs,Ia))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,zn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(zn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(fi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),fi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),fi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),fi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),fi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),fi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),fi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),fi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(fi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const fi=[new C,new C,new C,new C,new C,new C,new C,new C],zn=new C,Pa=new nn,zs=new C,Vs=new C,Gs=new C,Ii=new C,Li=new C,Ki=new C,Sr=new C,Ia=new C,La=new C,ji=new C;function yc(s,t,e,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){ji.fromArray(s,r);const o=i.x*Math.abs(ji.x)+i.y*Math.abs(ji.y)+i.z*Math.abs(ji.z),l=t.dot(ji),c=e.dot(ji),h=n.dot(ji);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const yi=dg();function dg(){const s=new ArrayBuffer(4),t=new Float32Array(s),e=new Uint32Array(s),n=new Uint32Array(512),i=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(n[l]=0,n[l|256]=32768,i[l]=24,i[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,i[l]=-c-1,i[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,i[l]=13,i[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,i[l]=24,i[l|256]=24):(n[l]=31744,n[l|256]=64512,i[l]=13,i[l|256]=13)}const r=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;(c&8388608)===0;)c<<=1,h-=8388608;c&=-8388609,h+=947912704,r[l]=c|h}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:t,uint32View:e,baseTable:n,shiftTable:i,mantissaTable:r,exponentTable:a,offsetTable:o}}function pn(s){Math.abs(s)>65504&&ut("DataUtils.toHalfFloat(): Value out of range."),s=Wt(s,-65504,65504),yi.floatView[0]=s;const t=yi.uint32View[0],e=t>>23&511;return yi.baseTable[e]+((t&8388607)>>yi.shiftTable[e])}function Br(s){const t=s>>10;return yi.uint32View[0]=yi.mantissaTable[yi.offsetTable[t]+(s&1023)]+yi.exponentTable[t],yi.floatView[0]}class fg{static toHalfFloat(t){return pn(t)}static fromHalfFloat(t){return Br(t)}}const Ne=new C,Da=new J;let pg=0;class xe extends qn{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:pg++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=aa,this.updateRanges=[],this.gpuType=on,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Da.fromBufferAttribute(this,e),Da.applyMatrix3(t),this.setXY(e,Da.x,Da.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ne.fromBufferAttribute(this,e),Ne.applyMatrix3(t),this.setXYZ(e,Ne.x,Ne.y,Ne.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ne.fromBufferAttribute(this,e),Ne.applyMatrix4(t),this.setXYZ(e,Ne.x,Ne.y,Ne.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ne.fromBufferAttribute(this,e),Ne.applyNormalMatrix(t),this.setXYZ(e,Ne.x,Ne.y,Ne.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ne.fromBufferAttribute(this,e),Ne.transformDirection(t),this.setXYZ(e,Ne.x,Ne.y,Ne.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=an(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Qt(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=an(e,this.array)),e}setX(t,e){return this.normalized&&(e=Qt(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=an(e,this.array)),e}setY(t,e){return this.normalized&&(e=Qt(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=an(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Qt(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=an(e,this.array)),e}setW(t,e){return this.normalized&&(e=Qt(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Qt(e,this.array),n=Qt(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Qt(e,this.array),n=Qt(n,this.array),i=Qt(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=Qt(e,this.array),n=Qt(n,this.array),i=Qt(i,this.array),r=Qt(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==aa&&(t.usage=this.usage),t}dispose(){this.dispatchEvent({type:"dispose"})}}class mg extends xe{constructor(t,e,n){super(new Int8Array(t),e,n)}}class gg extends xe{constructor(t,e,n){super(new Uint8Array(t),e,n)}}class _g extends xe{constructor(t,e,n){super(new Uint8ClampedArray(t),e,n)}}class xg extends xe{constructor(t,e,n){super(new Int16Array(t),e,n)}}class Hh extends xe{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class yg extends xe{constructor(t,e,n){super(new Int32Array(t),e,n)}}class Wh extends xe{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class vg extends xe{constructor(t,e,n){super(new Uint16Array(t),e,n),this.isFloat16BufferAttribute=!0}getX(t){let e=Br(this.array[t*this.itemSize]);return this.normalized&&(e=an(e,this.array)),e}setX(t,e){return this.normalized&&(e=Qt(e,this.array)),this.array[t*this.itemSize]=pn(e),this}getY(t){let e=Br(this.array[t*this.itemSize+1]);return this.normalized&&(e=an(e,this.array)),e}setY(t,e){return this.normalized&&(e=Qt(e,this.array)),this.array[t*this.itemSize+1]=pn(e),this}getZ(t){let e=Br(this.array[t*this.itemSize+2]);return this.normalized&&(e=an(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Qt(e,this.array)),this.array[t*this.itemSize+2]=pn(e),this}getW(t){let e=Br(this.array[t*this.itemSize+3]);return this.normalized&&(e=an(e,this.array)),e}setW(t,e){return this.normalized&&(e=Qt(e,this.array)),this.array[t*this.itemSize+3]=pn(e),this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Qt(e,this.array),n=Qt(n,this.array)),this.array[t+0]=pn(e),this.array[t+1]=pn(n),this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Qt(e,this.array),n=Qt(n,this.array),i=Qt(i,this.array)),this.array[t+0]=pn(e),this.array[t+1]=pn(n),this.array[t+2]=pn(i),this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=Qt(e,this.array),n=Qt(n,this.array),i=Qt(i,this.array),r=Qt(r,this.array)),this.array[t+0]=pn(e),this.array[t+1]=pn(n),this.array[t+2]=pn(i),this.array[t+3]=pn(r),this}}class At extends xe{constructor(t,e,n){super(new Float32Array(t),e,n)}}const Mg=new nn,wr=new C,vc=new C;class Ye{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Mg.setFromPoints(t).getCenter(n);let i=0;for(let r=0,a=t.length;r<a;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;wr.subVectors(t,this.center);const e=wr.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(wr,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(vc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(wr.copy(t.center).add(vc)),this.expandByPoint(wr.copy(t.center).sub(vc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}let bg=0;const Pn=new Xt,Mc=new oe,Hs=new C,Sn=new nn,Er=new nn,ze=new C;class Jt extends qn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:bg++}),this.uuid=Tn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(L0(t)?Wh:Hh)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new $t().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return Pn.makeRotationFromQuaternion(t),this.applyMatrix4(Pn),this}rotateX(t){return Pn.makeRotationX(t),this.applyMatrix4(Pn),this}rotateY(t){return Pn.makeRotationY(t),this.applyMatrix4(Pn),this}rotateZ(t){return Pn.makeRotationZ(t),this.applyMatrix4(Pn),this}translate(t,e,n){return Pn.makeTranslation(t,e,n),this.applyMatrix4(Pn),this}scale(t,e,n){return Pn.makeScale(t,e,n),this.applyMatrix4(Pn),this}lookAt(t){return Mc.lookAt(t),Mc.updateMatrix(),this.applyMatrix4(Mc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Hs).negate(),this.translate(Hs.x,Hs.y,Hs.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let i=0,r=t.length;i<r;i++){const a=t[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new At(n,3))}else{const n=Math.min(t.length,e.count);for(let i=0;i<n;i++){const r=t[i];e.setXYZ(i,r.x,r.y,r.z||0)}t.length>e.count&&ut("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new nn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){It("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const r=e[n];Sn.setFromBufferAttribute(r),this.morphTargetsRelative?(ze.addVectors(this.boundingBox.min,Sn.min),this.boundingBox.expandByPoint(ze),ze.addVectors(this.boundingBox.max,Sn.max),this.boundingBox.expandByPoint(ze)):(this.boundingBox.expandByPoint(Sn.min),this.boundingBox.expandByPoint(Sn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&It('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ye);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){It("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(t){const n=this.boundingSphere.center;if(Sn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];Er.setFromBufferAttribute(o),this.morphTargetsRelative?(ze.addVectors(Sn.min,Er.min),Sn.expandByPoint(ze),ze.addVectors(Sn.max,Er.max),Sn.expandByPoint(ze)):(Sn.expandByPoint(Er.min),Sn.expandByPoint(Er.max))}Sn.getCenter(n);let i=0;for(let r=0,a=t.count;r<a;r++)ze.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(ze));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)ze.fromBufferAttribute(o,c),l&&(Hs.fromBufferAttribute(t,c),ze.add(Hs)),i=Math.max(i,n.distanceToSquared(ze))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&It('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){It("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,i=e.normal,r=e.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new xe(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let x=0;x<n.count;x++)o[x]=new C,l[x]=new C;const c=new C,h=new C,d=new C,u=new J,f=new J,p=new J,_=new C,m=new C;function g(x,w,L){c.fromBufferAttribute(n,x),h.fromBufferAttribute(n,w),d.fromBufferAttribute(n,L),u.fromBufferAttribute(r,x),f.fromBufferAttribute(r,w),p.fromBufferAttribute(r,L),h.sub(c),d.sub(c),f.sub(u),p.sub(u);const D=1/(f.x*p.y-p.x*f.y);isFinite(D)&&(_.copy(h).multiplyScalar(p.y).addScaledVector(d,-f.y).multiplyScalar(D),m.copy(d).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(D),o[x].add(_),o[w].add(_),o[L].add(_),l[x].add(m),l[w].add(m),l[L].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:t.count}]);for(let x=0,w=v.length;x<w;++x){const L=v[x],D=L.start,N=L.count;for(let P=D,F=D+N;P<F;P+=3)g(t.getX(P+0),t.getX(P+1),t.getX(P+2))}const b=new C,y=new C,T=new C,S=new C;function A(x){T.fromBufferAttribute(i,x),S.copy(T);const w=o[x];b.copy(w),b.sub(T.multiplyScalar(T.dot(w))).normalize(),y.crossVectors(S,w);const D=y.dot(l[x])<0?-1:1;a.setXYZW(x,b.x,b.y,b.z,D)}for(let x=0,w=v.length;x<w;++x){const L=v[x],D=L.start,N=L.count;for(let P=D,F=D+N;P<F;P+=3)A(t.getX(P+0)),A(t.getX(P+1)),A(t.getX(P+2))}this._transformed=!0}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new xe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);const i=new C,r=new C,a=new C,o=new C,l=new C,c=new C,h=new C,d=new C;if(t)for(let u=0,f=t.count;u<f;u+=3){const p=t.getX(u+0),_=t.getX(u+1),m=t.getX(u+2);i.fromBufferAttribute(e,p),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),h.subVectors(a,r),d.subVectors(i,r),h.cross(d),o.fromBufferAttribute(n,p),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,f=e.count;u<f;u+=3)i.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),h.subVectors(a,r),d.subVectors(i,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ze.fromBufferAttribute(t,e),ze.normalize(),t.setXYZ(e,ze.x,ze.y,ze.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,d=o.normalized,u=new c.constructor(l.length*h);let f=0,p=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?f=l[_]*o.data.stride+o.offset:f=l[_]*h;for(let g=0;g<h;g++)u[p++]=c[f++]}return new xe(u,h,d)}if(this.index===null)return ut("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Jt,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,d=c.length;h<d;h++){const u=c[h],f=t(u,n);l.push(f)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const f=c[d];h.push(f.toJSON(t.data))}h.length>0&&(i[l]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const i=t.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Dl{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=aa,this.updateRanges=[],this.version=0,this.uuid=Tn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let i=0,r=this.stride;i<r;i++)this.array[t+i]=e.array[n+i];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Tn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Tn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const sn=new C;class bs{constructor(t,e,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)sn.fromBufferAttribute(this,e),sn.applyMatrix4(t),this.setXYZ(e,sn.x,sn.y,sn.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)sn.fromBufferAttribute(this,e),sn.applyNormalMatrix(t),this.setXYZ(e,sn.x,sn.y,sn.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)sn.fromBufferAttribute(this,e),sn.transformDirection(t),this.setXYZ(e,sn.x,sn.y,sn.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=an(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Qt(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=Qt(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Qt(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Qt(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Qt(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=an(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=an(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=an(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=an(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=Qt(e,this.array),n=Qt(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=Qt(e,this.array),n=Qt(n,this.array),i=Qt(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=Qt(e,this.array),n=Qt(n,this.array),i=Qt(i,this.array),r=Qt(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this.data.array[t+3]=r,this}clone(t){if(t===void 0){la("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return new xe(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new bs(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){la("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let Sg=0;class qe extends qn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Sg++}),this.uuid=Tn(),this.name="",this.type="Material",this.blending=gs,this.side=Mi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=wo,this.blendDst=Eo,this.blendEquation=Oi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new St(0,0,0),this.blendAlpha=0,this.depthFunc=vs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ah,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=cs,this.stencilZFail=cs,this.stencilZPass=cs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){ut(`Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){ut(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==gs&&(n.blending=this.blending),this.side!==Mi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==wo&&(n.blendSrc=this.blendSrc),this.blendDst!==Eo&&(n.blendDst=this.blendDst),this.blendEquation!==Oi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==vs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ah&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==cs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==cs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==cs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=i(t.textures),a=i(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new St().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new J().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new J().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Nl extends qe{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new St(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Ws;const Tr=new C,Xs=new C,Ys=new C,qs=new J,Ar=new J,mp=new Xt,Na=new C,Cr=new C,Ua=new C,Ku=new J,bc=new J,ju=new J;class Ul extends oe{constructor(t=new Nl){if(super(),this.isSprite=!0,this.type="Sprite",Ws===void 0){Ws=new Jt;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Dl(e,5);Ws.setIndex([0,1,2,0,2,3]),Ws.setAttribute("position",new bs(n,3,0,!1)),Ws.setAttribute("uv",new bs(n,2,3,!1))}this.geometry=Ws,this.material=t,this.center=new J(.5,.5),this.count=1}raycast(t,e){t.camera===null&&It('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Xs.setFromMatrixScale(this.matrixWorld),mp.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Ys.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Xs.multiplyScalar(-Ys.z);const n=this.material.rotation;let i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));const a=this.center;Oa(Na.set(-.5,-.5,0),Ys,a,Xs,i,r),Oa(Cr.set(.5,-.5,0),Ys,a,Xs,i,r),Oa(Ua.set(.5,.5,0),Ys,a,Xs,i,r),Ku.set(0,0),bc.set(1,0),ju.set(1,1);let o=t.ray.intersectTriangle(Na,Cr,Ua,!1,Tr);if(o===null&&(Oa(Cr.set(-.5,.5,0),Ys,a,Xs,i,r),bc.set(0,1),o=t.ray.intersectTriangle(Na,Ua,Cr,!1,Tr),o===null))return;const l=t.ray.origin.distanceTo(Tr);l<t.near||l>t.far||e.push({distance:l,point:Tr.clone(),uv:gn.getInterpolation(Tr,Na,Cr,Ua,Ku,bc,ju,new J),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Oa(s,t,e,n,i,r){qs.subVectors(s,e).addScalar(.5).multiply(n),i!==void 0?(Ar.x=r*qs.x-i*qs.y,Ar.y=i*qs.x+r*qs.y):Ar.copy(qs),s.copy(t),s.x+=Ar.x,s.y+=Ar.y,s.applyMatrix4(mp)}const Fa=new C,Qu=new C;class gp extends oe{constructor(){super(),this.isLOD=!0,this._currentLevel=0,this.type="LOD",Object.defineProperties(this,{levels:{enumerable:!0,value:[]}}),this.autoUpdate=!0}copy(t){super.copy(t,!1);const e=t.levels;for(let n=0,i=e.length;n<i;n++){const r=e[n];this.addLevel(r.object.clone(),r.distance,r.hysteresis)}return this.autoUpdate=t.autoUpdate,this}addLevel(t,e=0,n=0){e=Math.abs(e);const i=this.levels;let r;for(r=0;r<i.length&&!(e<i[r].distance);r++);return i.splice(r,0,{distance:e,hysteresis:n,object:t}),this.add(t),this}removeLevel(t){const e=this.levels;for(let n=0;n<e.length;n++)if(e[n].distance===t){const i=e.splice(n,1);return this.remove(i[0].object),!0}return!1}getCurrentLevel(){return this._currentLevel}getObjectForDistance(t){const e=this.levels;if(e.length>0){let n,i;for(n=1,i=e.length;n<i;n++){let r=e[n].distance;if(e[n].object.visible&&(r-=r*e[n].hysteresis),t<r)break}return e[n-1].object}return null}raycast(t,e){if(this.levels.length>0){Fa.setFromMatrixPosition(this.matrixWorld);const i=t.ray.origin.distanceTo(Fa);this.getObjectForDistance(i).raycast(t,e)}}update(t){const e=this.levels;if(e.length>1){Fa.setFromMatrixPosition(t.matrixWorld),Qu.setFromMatrixPosition(this.matrixWorld);const n=Fa.distanceTo(Qu)/t.zoom;e[0].object.visible=!0;let i,r;for(i=1,r=e.length;i<r;i++){let a=e[i].distance;if(e[i].object.visible&&(a-=a*e[i].hysteresis),n>=a)e[i-1].object.visible=!1,e[i].object.visible=!0;else break}for(this._currentLevel=i-1;i<r;i++)e[i].object.visible=!1}}toJSON(t){const e=super.toJSON(t);this.autoUpdate===!1&&(e.object.autoUpdate=!1),e.object.levels=[];const n=this.levels;for(let i=0,r=n.length;i<r;i++){const a=n[i];e.object.levels.push({object:a.object.uuid,distance:a.distance,hysteresis:a.hysteresis})}return e}}const pi=new C,Sc=new C,Ba=new C,Di=new C,wc=new C,ka=new C,Ec=new C;class Cs{constructor(t=new C,e=new C(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,pi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=pi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(pi.copy(this.origin).addScaledVector(this.direction,e),pi.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){Sc.copy(t).add(e).multiplyScalar(.5),Ba.copy(e).sub(t).normalize(),Di.copy(this.origin).sub(Sc);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Ba),o=Di.dot(this.direction),l=-Di.dot(Ba),c=Di.lengthSq(),h=Math.abs(1-a*a);let d,u,f,p;if(h>0)if(d=a*l-o,u=a*o-l,p=r*h,d>=0)if(u>=-p)if(u<=p){const _=1/h;d*=_,u*=_,f=d*(d+a*u+2*o)+u*(a*d+u+2*l)+c}else u=r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;else u<=-p?(d=Math.max(0,-(-a*r+o)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=p?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(a*r+o)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=a>0?-r:r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(Sc).addScaledVector(Ba,u),f}intersectSphere(t,e){pi.subVectors(t.center,this.origin);const n=pi.dot(this.direction),i=pi.dot(pi)-n*n,r=t.radius*t.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,i=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,i=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,a=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,a=(t.min.y-u.y)*h),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),d>=0?(o=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(o=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,pi)!==null}intersectTriangle(t,e,n,i,r){wc.subVectors(e,t),ka.subVectors(n,t),Ec.crossVectors(wc,ka);let a=this.direction.dot(Ec),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Di.subVectors(this.origin,t);const l=o*this.direction.dot(ka.crossVectors(Di,ka));if(l<0)return null;const c=o*this.direction.dot(wc.cross(Di));if(c<0||l+c>a)return null;const h=-o*Di.dot(Ec);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class He extends qe{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new St(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Xn,this.combine=ga,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const td=new Xt,Qi=new Cs,za=new Ye,ed=new C,Va=new C,Ga=new C,Ha=new C,Tc=new C,Wa=new C,nd=new C,Xa=new C;class Gt extends oe{constructor(t=new Jt,e=new He){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const o=this.morphTargetInfluences;if(r&&o){Wa.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],d=r[l];h!==0&&(Tc.fromBufferAttribute(d,t),a?Wa.addScaledVector(Tc,h):Wa.addScaledVector(Tc.sub(e),h))}e.add(Wa)}return e}raycast(t,e){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),za.copy(n.boundingSphere),za.applyMatrix4(r),Qi.copy(t.ray).recast(t.near),!(za.containsPoint(Qi.origin)===!1&&(Qi.intersectSphere(za,ed)===null||Qi.origin.distanceToSquared(ed)>(t.far-t.near)**2))&&(td.copy(r).invert(),Qi.copy(t.ray).applyMatrix4(td),!(n.boundingBox!==null&&Qi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Qi)))}_computeIntersections(t,e,n){let i;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,_=u.length;p<_;p++){const m=u[p],g=a[m.materialIndex],v=Math.max(m.start,f.start),b=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let y=v,T=b;y<T;y+=3){const S=o.getX(y),A=o.getX(y+1),x=o.getX(y+2);i=Ya(this,g,t,n,c,h,d,S,A,x),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const p=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let m=p,g=_;m<g;m+=3){const v=o.getX(m),b=o.getX(m+1),y=o.getX(m+2);i=Ya(this,a,t,n,c,h,d,v,b,y),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,_=u.length;p<_;p++){const m=u[p],g=a[m.materialIndex],v=Math.max(m.start,f.start),b=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let y=v,T=b;y<T;y+=3){const S=y,A=y+1,x=y+2;i=Ya(this,g,t,n,c,h,d,S,A,x),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const p=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=p,g=_;m<g;m+=3){const v=m,b=m+1,y=m+2;i=Ya(this,a,t,n,c,h,d,v,b,y),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}}function wg(s,t,e,n,i,r,a,o){let l;if(t.side===cn?l=n.intersectTriangle(a,r,i,!0,o):l=n.intersectTriangle(i,r,a,t.side===Mi,o),l===null)return null;Xa.copy(o),Xa.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(Xa);return c<e.near||c>e.far?null:{distance:c,point:Xa.clone(),object:s}}function Ya(s,t,e,n,i,r,a,o,l,c){s.getVertexPosition(o,Va),s.getVertexPosition(l,Ga),s.getVertexPosition(c,Ha);const h=wg(s,t,e,n,Va,Ga,Ha,nd);if(h){const d=new C;gn.getBarycoord(nd,Va,Ga,Ha,d),i&&(h.uv=gn.getInterpolatedAttribute(i,o,l,c,d,new J)),r&&(h.uv1=gn.getInterpolatedAttribute(r,o,l,c,d,new J)),a&&(h.normal=gn.getInterpolatedAttribute(a,o,l,c,d,new C),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new C,materialIndex:0};gn.getNormal(Va,Ga,Ha,u.normal),h.face=u,h.barycoord=d}return h}const Rr=new pe,id=new pe,sd=new pe,Eg=new pe,rd=new Xt,qa=new C,Ac=new Ye,ad=new Xt,Cc=new Cs;class _p extends Gt{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=sh,this.bindMatrix=new Xt,this.bindMatrixInverse=new Xt,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const t=this.geometry;this.boundingBox===null&&(this.boundingBox=new nn),this.boundingBox.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,qa),this.boundingBox.expandByPoint(qa)}computeBoundingSphere(){const t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Ye),this.boundingSphere.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,qa),this.boundingSphere.expandByPoint(qa)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ac.copy(this.boundingSphere),Ac.applyMatrix4(i),t.ray.intersectsSphere(Ac)!==!1&&(ad.copy(i).invert(),Cc.copy(t.ray).applyMatrix4(ad),!(this.boundingBox!==null&&Cc.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,Cc)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const t=new pe,e=this.geometry.attributes.skinWeight;for(let n=0,i=e.count;n<i;n++){t.fromBufferAttribute(e,n);const r=1/t.manhattanLength();r!==1/0?t.multiplyScalar(r):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===sh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===jf?this.bindMatrixInverse.copy(this.bindMatrix).invert():ut("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){const n=this.skeleton,i=this.geometry;id.fromBufferAttribute(i.attributes.skinIndex,t),sd.fromBufferAttribute(i.attributes.skinWeight,t),e.isVector4?(Rr.copy(e),e.set(0,0,0,0)):(Rr.set(...e,1),e.set(0,0,0)),Rr.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){const a=sd.getComponent(r);if(a!==0){const o=id.getComponent(r);rd.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),e.addScaledVector(Eg.copy(Rr).applyMatrix4(rd),a)}}return e.isVector4&&(e.w=Rr.w),e.applyMatrix4(this.bindMatrixInverse)}}class Xh extends oe{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Dn extends Te{constructor(t=null,e=1,n=1,i,r,a,o,l,c=De,h=De,d,u){super(null,a,o,l,c,h,i,r,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const od=new Xt,Tg=new Xt;class Ol{constructor(t=[],e=[]){this.uuid=Tn(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){ut("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Xt)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){const n=new Xt;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const t=this.bones,e=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,a=t.length;r<a;r++){const o=t[r]?t[r].matrixWorld:Tg;od.multiplyMatrices(o,e[r]),od.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new Ol(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4);e.set(this.boneMatrices);const n=new Dn(e,t,t,ln,on);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){const i=this.bones[e];if(i.name===t)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,i=t.bones.length;n<i;n++){const r=t.bones[n];let a=e[r];a===void 0&&(ut("Skeleton: No bone found with UUID:",r),a=new Xh),this.bones.push(a),this.boneInverses.push(new Xt().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){const t={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;const e=this.bones,n=this.boneInverses;for(let i=0,r=e.length;i<r;i++){const a=e[i];t.bones.push(a.uuid);const o=n[i];t.boneInverses.push(o.toArray())}return t}}class ur extends xe{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const $s=new Xt,ld=new Xt,$a=[],cd=new nn,Ag=new Xt,Pr=new Gt,Ir=new Ye;class Yh extends Gt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new ur(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Ag)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new nn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,$s),cd.copy(t.boundingBox).applyMatrix4($s),this.boundingBox.union(cd)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ye),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,$s),Ir.copy(t.boundingSphere).applyMatrix4($s),this.boundingSphere.union(Ir)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(t,e){const n=this.matrixWorld,i=this.count;if(Pr.geometry=this.geometry,Pr.material=this.material,Pr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ir.copy(this.boundingSphere),Ir.applyMatrix4(n),t.ray.intersectsSphere(Ir)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,$s),ld.multiplyMatrices(n,$s),Pr.matrixWorld=ld,Pr.raycast(t,$a);for(let a=0,o=$a.length;a<o;a++){const l=$a[a];l.instanceId=r,l.object=this,e.push(l)}$a.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new ur(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){const n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Dn(new Float32Array(i*this.count),i,this.count,bl,on));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=i*t;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Rc=new C,Cg=new C,Rg=new $t;class _i{constructor(t=new C(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=Rc.subVectors(n,e).cross(Cg.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){const i=t.delta(Rc),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(i,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Rg.getNormalMatrix(t),i=this.coplanarPoint(Rc).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ts=new Ye,Pg=new J(.5,.5),Za=new C;class Ss{constructor(t=new _i,e=new _i,n=new _i,i=new _i,r=new _i,a=new _i){this.planes=[t,e,n,i,r,a]}set(t,e,n,i,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=wn,n=!1){const i=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],d=r[5],u=r[6],f=r[7],p=r[8],_=r[9],m=r[10],g=r[11],v=r[12],b=r[13],y=r[14],T=r[15];if(i[0].setComponents(c-a,f-h,g-p,T-v).normalize(),i[1].setComponents(c+a,f+h,g+p,T+v).normalize(),i[2].setComponents(c+o,f+d,g+_,T+b).normalize(),i[3].setComponents(c-o,f-d,g-_,T-b).normalize(),n)i[4].setComponents(l,u,m,y).normalize(),i[5].setComponents(c-l,f-u,g-m,T-y).normalize();else if(i[4].setComponents(c-l,f-u,g-m,T-y).normalize(),e===wn)i[5].setComponents(c+l,f+u,g+m,T+y).normalize();else if(e===Ms)i[5].setComponents(l,u,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ts.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ts.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ts)}intersectsSprite(t){ts.center.set(0,0,0);const e=Pg.distanceTo(t.center);return ts.radius=.7071067811865476+e,ts.applyMatrix4(t.matrixWorld),this.intersectsSphere(ts)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(Za.x=i.normal.x>0?t.max.x:t.min.x,Za.y=i.normal.y>0?t.max.y:t.min.y,Za.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Za)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const hd=new Xt;class Fl{constructor(){this.coordinateSystem=wn,this._frustums=[],this._count=0}setFromArrayCamera(t){const e=t.cameras,n=this._frustums;for(let i=0;i<e.length;i++){const r=e[i];hd.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[i]===void 0&&(n[i]=new Ss),n[i].setFromProjectionMatrix(hd,r.coordinateSystem,r.reversedDepth)}return this._count=e.length,this}intersectsObject(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsObject(t))return!0;return!1}intersectsSprite(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsSprite(t))return!0;return!1}intersectsSphere(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsSphere(t))return!0;return!1}intersectsBox(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsBox(t))return!0;return!1}containsPoint(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].containsPoint(t))return!0;return!1}copy(t){this.coordinateSystem=t.coordinateSystem;const e=this._frustums,n=t._frustums;for(let i=0;i<t._count;i++)e[i]===void 0&&(e[i]=new Ss),e[i].copy(n[i]);return this._count=t._count,this}clone(){return new Fl().copy(this)}}function Pc(s,t){return s-t}function Ig(s,t){return s.z-t.z}function Lg(s,t){return t.z-s.z}class Dg{constructor(){this.index=0,this.pool=[],this.list=[]}push(t,e,n,i){const r=this.pool,a=this.list;this.index>=r.length&&r.push({start:-1,count:-1,z:-1,index:-1});const o=r[this.index];a.push(o),this.index++,o.start=t,o.count=e,o.z=n,o.index=i}reset(){this.list.length=0,this.index=0}}const dn=new Xt,Ng=new St(1,1,1),Ug=new Ss,Og=new Fl,Ja=new nn,es=new Ye,Lr=new C,ud=new C,Fg=new C,Ic=new Dg,Ke=new Gt,Ka=[];function Bg(s,t,e=0){const n=t.itemSize;if(s.isInterleavedBufferAttribute||s.array.constructor!==t.array.constructor){const i=s.count;for(let r=0;r<i;r++)for(let a=0;a<n;a++)t.setComponent(r+e,a,s.getComponent(r,a))}else t.array.set(s.array,e*n);t.needsUpdate=!0}function ns(s,t){if(s.constructor!==t.constructor){const e=Math.min(s.length,t.length);for(let n=0;n<e;n++)t[n]=s[n]}else{const e=Math.min(s.length,t.length);t.set(new s.constructor(s.buffer,0,e))}}class xp extends Gt{constructor(t,e,n=e*2,i){super(new Jt,i),this.isBatchedMesh=!0,this.perObjectFrustumCulled=!0,this.sortObjects=!0,this.boundingBox=null,this.boundingSphere=null,this.customSort=null,this._instanceInfo=[],this._geometryInfo=[],this._availableInstanceIds=[],this._availableGeometryIds=[],this._nextIndexStart=0,this._nextVertexStart=0,this._geometryCount=0,this._visibilityChanged=!0,this._geometryInitialized=!1,this._maxInstanceCount=t,this._maxVertexCount=e,this._maxIndexCount=n,this._multiDrawCounts=new Int32Array(t),this._multiDrawStarts=new Int32Array(t),this._multiDrawCount=0,this._matricesTexture=null,this._indirectTexture=null,this._colorsTexture=null,this._initMatricesTexture(),this._initIndirectTexture()}get maxInstanceCount(){return this._maxInstanceCount}get instanceCount(){return this._instanceInfo.length-this._availableInstanceIds.length}get unusedVertexCount(){return this._maxVertexCount-this._nextVertexStart}get unusedIndexCount(){return this._maxIndexCount-this._nextIndexStart}_initMatricesTexture(){let t=Math.sqrt(this._maxInstanceCount*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4),n=new Dn(e,t,t,ln,on);this._matricesTexture=n}_initIndirectTexture(){let t=Math.sqrt(this._maxInstanceCount);t=Math.ceil(t);const e=new Uint32Array(t*t),n=new Dn(e,t,t,_a,Un);this._indirectTexture=n}_initColorsTexture(){let t=Math.sqrt(this._maxInstanceCount);t=Math.ceil(t);const e=new Float32Array(t*t*4).fill(1),n=new Dn(e,t,t,ln,on);n.colorSpace=ae.workingColorSpace,this._colorsTexture=n}_initializeGeometry(t){const e=this.geometry,n=this._maxVertexCount,i=this._maxIndexCount;if(this._geometryInitialized===!1){for(const r in t.attributes){const a=t.getAttribute(r),{array:o,itemSize:l,normalized:c}=a,h=new o.constructor(n*l),d=new xe(h,l,c);e.setAttribute(r,d)}if(t.getIndex()!==null){const r=n>65535?new Uint32Array(i):new Uint16Array(i);e.setIndex(new xe(r,1))}this._geometryInitialized=!0}}_validateGeometry(t){const e=this.geometry;if(!!t.getIndex()!=!!e.getIndex())throw new Error('THREE.BatchedMesh: All geometries must consistently have "index".');for(const n in e.attributes){if(!t.hasAttribute(n))throw new Error(`THREE.BatchedMesh: Added geometry missing "${n}". All geometries must have consistent attributes.`);const i=t.getAttribute(n),r=e.getAttribute(n);if(i.itemSize!==r.itemSize||i.normalized!==r.normalized)throw new Error("THREE.BatchedMesh: All attributes must have a consistent itemSize and normalized value.")}}validateInstanceId(t){const e=this._instanceInfo;if(t<0||t>=e.length||e[t].active===!1)throw new Error(`THREE.BatchedMesh: Invalid instanceId ${t}. Instance is either out of range or has been deleted.`)}validateGeometryId(t){const e=this._geometryInfo;if(t<0||t>=e.length||e[t].active===!1)throw new Error(`THREE.BatchedMesh: Invalid geometryId ${t}. Geometry is either out of range or has been deleted.`)}setCustomSort(t){return this.customSort=t,this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new nn);const t=this.boundingBox,e=this._instanceInfo;t.makeEmpty();for(let n=0,i=e.length;n<i;n++){if(e[n].active===!1)continue;const r=e[n].geometryIndex;this.getMatrixAt(n,dn),this.getBoundingBoxAt(r,Ja).applyMatrix4(dn),t.union(Ja)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ye);const t=this.boundingSphere,e=this._instanceInfo;t.makeEmpty();for(let n=0,i=e.length;n<i;n++){if(e[n].active===!1)continue;const r=e[n].geometryIndex;this.getMatrixAt(n,dn),this.getBoundingSphereAt(r,es).applyMatrix4(dn),t.union(es)}}addInstance(t){if(this._instanceInfo.length>=this.maxInstanceCount&&this._availableInstanceIds.length===0)throw new Error("THREE.BatchedMesh: Maximum item count reached.");const n={visible:!0,active:!0,geometryIndex:t};let i=null;this._availableInstanceIds.length>0?(this._availableInstanceIds.sort(Pc),i=this._availableInstanceIds.shift(),this._instanceInfo[i]=n):(i=this._instanceInfo.length,this._instanceInfo.push(n));const r=this._matricesTexture;dn.identity().toArray(r.image.data,i*16),r.needsUpdate=!0;const a=this._colorsTexture;return a&&(Ng.toArray(a.image.data,i*4),a.needsUpdate=!0),this._visibilityChanged=!0,i}addGeometry(t,e=-1,n=-1){this._initializeGeometry(t),this._validateGeometry(t);const i={vertexStart:-1,vertexCount:-1,reservedVertexCount:-1,indexStart:-1,indexCount:-1,reservedIndexCount:-1,start:-1,count:-1,boundingBox:null,boundingSphere:null,active:!0},r=this._geometryInfo;i.vertexStart=this._nextVertexStart,i.reservedVertexCount=e===-1?t.getAttribute("position").count:e;const a=t.getIndex();if(a!==null&&(i.indexStart=this._nextIndexStart,i.reservedIndexCount=n===-1?a.count:n),i.indexStart!==-1&&i.indexStart+i.reservedIndexCount>this._maxIndexCount||i.vertexStart+i.reservedVertexCount>this._maxVertexCount)throw new Error("THREE.BatchedMesh: Reserved space request exceeds the maximum buffer size.");let l;return this._availableGeometryIds.length>0?(this._availableGeometryIds.sort(Pc),l=this._availableGeometryIds.shift(),r[l]=i):(l=this._geometryCount,this._geometryCount++,r.push(i)),this.setGeometryAt(l,t),this._nextIndexStart=i.indexStart+i.reservedIndexCount,this._nextVertexStart=i.vertexStart+i.reservedVertexCount,l}setGeometryAt(t,e){if(t>=this._geometryCount)throw new Error("THREE.BatchedMesh: Maximum geometry count reached.");this._validateGeometry(e);const n=this.geometry,i=n.getIndex()!==null,r=n.getIndex(),a=e.getIndex(),o=this._geometryInfo[t];if(i&&a.count>o.reservedIndexCount||e.attributes.position.count>o.reservedVertexCount)throw new Error("THREE.BatchedMesh: Reserved space not large enough for provided geometry.");const l=o.vertexStart,c=o.reservedVertexCount;o.vertexCount=e.getAttribute("position").count;for(const h in n.attributes){const d=e.getAttribute(h),u=n.getAttribute(h);Bg(d,u,l);const f=d.itemSize;for(let p=d.count,_=c;p<_;p++){const m=l+p;for(let g=0;g<f;g++)u.setComponent(m,g,0)}u.needsUpdate=!0,u.addUpdateRange(l*f,c*f)}if(i){const h=o.indexStart,d=o.reservedIndexCount;o.indexCount=e.getIndex().count;for(let u=0;u<a.count;u++)r.setX(h+u,l+a.getX(u));for(let u=a.count,f=d;u<f;u++)r.setX(h+u,l);r.needsUpdate=!0,r.addUpdateRange(h,o.reservedIndexCount)}return o.start=i?o.indexStart:o.vertexStart,o.count=i?o.indexCount:o.vertexCount,o.boundingBox=null,e.boundingBox!==null&&(o.boundingBox=e.boundingBox.clone()),o.boundingSphere=null,e.boundingSphere!==null&&(o.boundingSphere=e.boundingSphere.clone()),this._visibilityChanged=!0,t}deleteGeometry(t){const e=this._geometryInfo;if(t>=e.length||e[t].active===!1)return this;const n=this._instanceInfo;for(let i=0,r=n.length;i<r;i++)n[i].active&&n[i].geometryIndex===t&&this.deleteInstance(i);return e[t].active=!1,this._availableGeometryIds.push(t),this._visibilityChanged=!0,this}deleteInstance(t){return this.validateInstanceId(t),this._instanceInfo[t].active=!1,this._availableInstanceIds.push(t),this._visibilityChanged=!0,this}optimize(){let t=0,e=0;const n=this._geometryInfo,i=n.map((a,o)=>o).sort((a,o)=>n[a].vertexStart-n[o].vertexStart),r=this.geometry;for(let a=0,o=n.length;a<o;a++){const l=i[a],c=n[l];if(c.active!==!1){if(r.index!==null){if(c.indexStart!==e){const{indexStart:h,vertexStart:d,reservedIndexCount:u}=c,f=r.index,p=f.array,_=t-d;for(let m=h;m<h+u;m++)p[m]=p[m]+_;f.array.copyWithin(e,h,h+u),f.addUpdateRange(e,u),f.needsUpdate=!0,c.indexStart=e}e+=c.reservedIndexCount}if(c.vertexStart!==t){const{vertexStart:h,reservedVertexCount:d}=c,u=r.attributes;for(const f in u){const p=u[f],{array:_,itemSize:m}=p;_.copyWithin(t*m,h*m,(h+d)*m),p.addUpdateRange(t*m,d*m),p.needsUpdate=!0}c.vertexStart=t}t+=c.reservedVertexCount,c.start=r.index?c.indexStart:c.vertexStart}}return this._nextIndexStart=e,this._nextVertexStart=t,this._visibilityChanged=!0,this}getBoundingBoxAt(t,e){if(t>=this._geometryCount)return null;const n=this.geometry,i=this._geometryInfo[t];if(i.boundingBox===null){const r=new nn,a=n.index,o=n.attributes.position;for(let l=i.start,c=i.start+i.count;l<c;l++){let h=l;a&&(h=a.getX(h)),r.expandByPoint(Lr.fromBufferAttribute(o,h))}i.boundingBox=r}return e.copy(i.boundingBox),e}getBoundingSphereAt(t,e){if(t>=this._geometryCount)return null;const n=this.geometry,i=this._geometryInfo[t];if(i.boundingSphere===null){const r=new Ye;this.getBoundingBoxAt(t,Ja),Ja.getCenter(r.center);const a=n.index,o=n.attributes.position;let l=0;for(let c=i.start,h=i.start+i.count;c<h;c++){let d=c;a&&(d=a.getX(d)),Lr.fromBufferAttribute(o,d),l=Math.max(l,r.center.distanceToSquared(Lr))}r.radius=Math.sqrt(l),i.boundingSphere=r}return e.copy(i.boundingSphere),e}setMatrixAt(t,e){this.validateInstanceId(t);const n=this._matricesTexture,i=this._matricesTexture.image.data;return e.toArray(i,t*16),n.needsUpdate=!0,this}getMatrixAt(t,e){return this.validateInstanceId(t),e.fromArray(this._matricesTexture.image.data,t*16)}setColorAt(t,e){return this.validateInstanceId(t),this._colorsTexture===null&&this._initColorsTexture(),e.toArray(this._colorsTexture.image.data,t*4),this._colorsTexture.needsUpdate=!0,this}getColorAt(t,e){return this.validateInstanceId(t),this._colorsTexture===null?e.isVector4?e.set(1,1,1,1):e.setRGB(1,1,1):e.fromArray(this._colorsTexture.image.data,t*4)}setVisibleAt(t,e){return this.validateInstanceId(t),this._instanceInfo[t].visible===e?this:(this._instanceInfo[t].visible=e,this._visibilityChanged=!0,this)}getVisibleAt(t){return this.validateInstanceId(t),this._instanceInfo[t].visible}setGeometryIdAt(t,e){return this.validateInstanceId(t),this.validateGeometryId(e),this._instanceInfo[t].geometryIndex=e,this}getGeometryIdAt(t){return this.validateInstanceId(t),this._instanceInfo[t].geometryIndex}getGeometryRangeAt(t,e={}){this.validateGeometryId(t);const n=this._geometryInfo[t];return e.vertexStart=n.vertexStart,e.vertexCount=n.vertexCount,e.reservedVertexCount=n.reservedVertexCount,e.indexStart=n.indexStart,e.indexCount=n.indexCount,e.reservedIndexCount=n.reservedIndexCount,e.start=n.start,e.count=n.count,e}setInstanceCount(t){const e=this._availableInstanceIds,n=this._instanceInfo;for(e.sort(Pc);e[e.length-1]===n.length-1;)n.pop(),e.pop();if(t<n.length)throw new Error(`THREE.BatchedMesh: Instance ids outside the range ${t} are being used. Cannot shrink instance count.`);const i=new Int32Array(t),r=new Int32Array(t);ns(this._multiDrawCounts,i),ns(this._multiDrawStarts,r),this._multiDrawCounts=i,this._multiDrawStarts=r,this._maxInstanceCount=t;const a=this._indirectTexture,o=this._matricesTexture,l=this._colorsTexture;a.dispose(),this._initIndirectTexture(),ns(a.image.data,this._indirectTexture.image.data),o.dispose(),this._initMatricesTexture(),ns(o.image.data,this._matricesTexture.image.data),l&&(l.dispose(),this._initColorsTexture(),ns(l.image.data,this._colorsTexture.image.data))}setGeometrySize(t,e){const n=[...this._geometryInfo].filter(o=>o.active);if(Math.max(...n.map(o=>o.vertexStart+o.reservedVertexCount))>t)throw new Error(`THREE.BatchedMesh: Geometry vertex values are being used outside the range ${e}. Cannot shrink further.`);if(this.geometry.index&&Math.max(...n.map(l=>l.indexStart+l.reservedIndexCount))>e)throw new Error(`THREE.BatchedMesh: Geometry index values are being used outside the range ${e}. Cannot shrink further.`);const r=this.geometry;r.dispose(),this._maxVertexCount=t,this._maxIndexCount=e,this._geometryInitialized&&(this._geometryInitialized=!1,this.geometry=new Jt,this._initializeGeometry(r));const a=this.geometry;r.index&&ns(r.index.array,a.index.array);for(const o in r.attributes)ns(r.attributes[o].array,a.attributes[o].array)}raycast(t,e){const n=this._instanceInfo,i=this._geometryInfo,r=this.matrixWorld,a=this.geometry;Ke.material=this.material,Ke.geometry.index=a.index,Ke.geometry.attributes=a.attributes,Ke.geometry.boundingBox===null&&(Ke.geometry.boundingBox=new nn),Ke.geometry.boundingSphere===null&&(Ke.geometry.boundingSphere=new Ye);for(let o=0,l=n.length;o<l;o++){if(!n[o].visible||!n[o].active)continue;const c=n[o].geometryIndex,h=i[c];Ke.geometry.setDrawRange(h.start,h.count),this.getMatrixAt(o,Ke.matrixWorld).premultiply(r),this.getBoundingBoxAt(c,Ke.geometry.boundingBox),this.getBoundingSphereAt(c,Ke.geometry.boundingSphere),Ke.raycast(t,Ka);for(let d=0,u=Ka.length;d<u;d++){const f=Ka[d];f.object=this,f.batchId=o,e.push(f)}Ka.length=0}Ke.material=null,Ke.geometry.index=null,Ke.geometry.attributes={},Ke.geometry.setDrawRange(0,1/0)}copy(t){return super.copy(t),this.geometry=t.geometry.clone(),this.perObjectFrustumCulled=t.perObjectFrustumCulled,this.sortObjects=t.sortObjects,this.boundingBox=t.boundingBox!==null?t.boundingBox.clone():null,this.boundingSphere=t.boundingSphere!==null?t.boundingSphere.clone():null,this._geometryInfo=t._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox!==null?e.boundingBox.clone():null,boundingSphere:e.boundingSphere!==null?e.boundingSphere.clone():null})),this._instanceInfo=t._instanceInfo.map(e=>({...e})),this._availableInstanceIds=t._availableInstanceIds.slice(),this._availableGeometryIds=t._availableGeometryIds.slice(),this._nextIndexStart=t._nextIndexStart,this._nextVertexStart=t._nextVertexStart,this._geometryCount=t._geometryCount,this._maxInstanceCount=t._maxInstanceCount,this._maxVertexCount=t._maxVertexCount,this._maxIndexCount=t._maxIndexCount,this._geometryInitialized=t._geometryInitialized,this._multiDrawCounts=t._multiDrawCounts.slice(),this._multiDrawStarts=t._multiDrawStarts.slice(),this._indirectTexture=t._indirectTexture.clone(),this._indirectTexture.image.data=this._indirectTexture.image.data.slice(),this._matricesTexture=t._matricesTexture.clone(),this._matricesTexture.image.data=this._matricesTexture.image.data.slice(),this._colorsTexture!==null&&(this._colorsTexture=t._colorsTexture.clone(),this._colorsTexture.image.data=this._colorsTexture.image.data.slice()),this}dispose(){this.geometry.dispose(),this._matricesTexture.dispose(),this._matricesTexture=null,this._indirectTexture.dispose(),this._indirectTexture=null,this._colorsTexture!==null&&(this._colorsTexture.dispose(),this._colorsTexture=null)}onBeforeRender(t,e,n,i,r){if(!this._visibilityChanged&&!this.perObjectFrustumCulled&&!this.sortObjects)return;const a=i.getIndex();let o=a===null?1:a.array.BYTES_PER_ELEMENT,l=1;r.wireframe&&(l=2,o=i.attributes.position.count>65535?4:2);const c=this._instanceInfo,h=this._multiDrawStarts,d=this._multiDrawCounts,u=this._geometryInfo,f=this.perObjectFrustumCulled,p=this._indirectTexture,_=p.image.data,m=n.isArrayCamera?Og:Ug;f&&(n.isArrayCamera?m.setFromArrayCamera(n):(dn.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse).multiply(this.matrixWorld),m.setFromProjectionMatrix(dn,n.coordinateSystem,n.reversedDepth)));let g=0;if(this.sortObjects){dn.copy(this.matrixWorld).invert(),Lr.setFromMatrixPosition(n.matrixWorld).applyMatrix4(dn),ud.set(0,0,-1).transformDirection(n.matrixWorld).transformDirection(dn);for(let y=0,T=c.length;y<T;y++)if(c[y].visible&&c[y].active){const S=c[y].geometryIndex;this.getMatrixAt(y,dn),this.getBoundingSphereAt(S,es).applyMatrix4(dn);let A=!1;if(f&&(A=!m.intersectsSphere(es)),!A){const x=u[S],w=Fg.subVectors(es.center,Lr).dot(ud);Ic.push(x.start,x.count,w,y)}}const v=Ic.list,b=this.customSort;b===null?v.sort(r.transparent?Lg:Ig):b.call(this,v,n);for(let y=0,T=v.length;y<T;y++){const S=v[y];h[g]=S.start*o*l,d[g]=S.count*l,_[g]=S.index,g++}Ic.reset()}else for(let v=0,b=c.length;v<b;v++)if(c[v].visible&&c[v].active){const y=c[v].geometryIndex;let T=!1;if(f&&(this.getMatrixAt(v,dn),this.getBoundingSphereAt(y,es).applyMatrix4(dn),T=!m.intersectsSphere(es)),!T){const S=u[y];h[g]=S.start*o*l,d[g]=S.count*l,_[g]=v,g++}}p.needsUpdate=!0,this._multiDrawCount=g,this._visibilityChanged=!1}onBeforeShadow(t,e,n,i,r,a){this.onBeforeRender(t,null,i,r,a)}}class un extends qe{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new St(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const hl=new C,ul=new C,dd=new Xt,Dr=new Cs,ja=new Ye,Lc=new C,fd=new C;class Yi extends oe{constructor(t=new Jt,e=new un){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let i=1,r=e.count;i<r;i++)hl.fromBufferAttribute(e,i-1),ul.fromBufferAttribute(e,i),n[i]=n[i-1],n[i]+=hl.distanceTo(ul);t.setAttribute("lineDistance",new At(n,1))}else ut("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ja.copy(n.boundingSphere),ja.applyMatrix4(i),ja.radius+=r,t.ray.intersectsSphere(ja)===!1)return;dd.copy(i).invert(),Dr.copy(t.ray).applyMatrix4(dd);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const f=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let _=f,m=p-1;_<m;_+=c){const g=h.getX(_),v=h.getX(_+1),b=Qa(this,t,Dr,l,g,v,_);b&&e.push(b)}if(this.isLineLoop){const _=h.getX(p-1),m=h.getX(f),g=Qa(this,t,Dr,l,_,m,p-1);g&&e.push(g)}}else{const f=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let _=f,m=p-1;_<m;_+=c){const g=Qa(this,t,Dr,l,_,_+1,_);g&&e.push(g)}if(this.isLineLoop){const _=Qa(this,t,Dr,l,p-1,f,p-1);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Qa(s,t,e,n,i,r,a){const o=s.geometry.attributes.position;if(hl.fromBufferAttribute(o,i),ul.fromBufferAttribute(o,r),e.distanceSqToSegment(hl,ul,Lc,fd)>n)return;Lc.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(Lc);if(!(c<t.near||c>t.far))return{distance:c,point:fd.clone().applyMatrix4(s.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:s}}const pd=new C,md=new C;class ci extends Yi{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let i=0,r=e.count;i<r;i+=2)pd.fromBufferAttribute(e,i),md.fromBufferAttribute(e,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+pd.distanceTo(md);t.setAttribute("lineDistance",new At(n,1))}else ut("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class yp extends Yi{constructor(t,e){super(t,e),this.isLineLoop=!0,this.type="LineLoop"}}class qh extends qe{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new St(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const gd=new Xt,lh=new Cs,to=new Ye,eo=new C;class vp extends oe{constructor(t=new Jt,e=new qh){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),to.copy(n.boundingSphere),to.applyMatrix4(i),to.radius+=r,t.ray.intersectsSphere(to)===!1)return;gd.copy(i).invert(),lh.copy(t.ray).applyMatrix4(gd);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){const u=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let p=u,_=f;p<_;p++){const m=c.getX(p);eo.fromBufferAttribute(d,m),_d(eo,m,l,i,t,e,this)}}else{const u=Math.max(0,a.start),f=Math.min(d.count,a.start+a.count);for(let p=u,_=f;p<_;p++)eo.fromBufferAttribute(d,p),_d(eo,p,l,i,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function _d(s,t,e,n,i,r,a){const o=lh.distanceSqToPoint(s);if(o<e){const l=new C;lh.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class Mp extends Te{constructor(t,e,n,i,r=we,a=we,o,l,c){super(t,e,n,i,r,a,o,l,c),this.isVideoTexture=!0,this.generateMipmaps=!1,this._requestVideoFrameCallbackId=0;const h=this;function d(){h.needsUpdate=!0,h._requestVideoFrameCallbackId=t.requestVideoFrameCallback(d)}"requestVideoFrameCallback"in t&&(this._requestVideoFrameCallbackId=t.requestVideoFrameCallback(d))}clone(){return new this.constructor(this.image).copy(this)}update(){const t=this.image;"requestVideoFrameCallback"in t===!1&&t.readyState>=t.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}dispose(){this._requestVideoFrameCallbackId!==0&&(this.source.data.cancelVideoFrameCallback(this._requestVideoFrameCallbackId),this._requestVideoFrameCallbackId=0),super.dispose()}}class kg extends Mp{constructor(t,e,n,i,r,a,o,l){super({},t,e,n,i,r,a,o,l),this.isVideoFrameTexture=!0}update(){}clone(){return new this.constructor().copy(this)}setFrame(t){this.image=t,this.needsUpdate=!0}}class zg extends Te{constructor(t,e){super({width:t,height:e}),this.isFramebufferTexture=!0,this.magFilter=De,this.minFilter=De,this.generateMipmaps=!1,this.needsUpdate=!0}}class Bl extends Te{constructor(t,e,n,i,r,a,o,l,c,h,d,u){super(null,a,o,l,c,h,i,r,d,u),this.isCompressedTexture=!0,this.image={width:e,height:n},this.mipmaps=t,this.flipY=!1,this.generateMipmaps=!1}}class Vg extends Bl{constructor(t,e,n,i,r,a){super(t,e,n,r,a),this.isCompressedArrayTexture=!0,this.image.depth=i,this.wrapR=_n,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Gg extends Bl{constructor(t,e,n){super(void 0,t[0].width,t[0].height,e,n,si),this.isCompressedCubeTexture=!0,this.isCubeTexture=!0,this.image=t}}class ya extends Te{constructor(t=[],e=si,n,i,r,a,o,l,c,h){super(t,e,n,i,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class $h extends Te{constructor(t,e,n,i,r,a,o,l,c){super(t,e,n,i,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Hg extends Te{constructor(t,e,n,i,r,a,o,l,c){super(t,e,n,i,r,a,o,l,c),this.isHTMLTexture=!0,this.generateMipmaps=!1,this.needsUpdate=!0;const h=t?t.parentNode:null;h!==null&&"requestPaint"in h&&(h.onpaint=()=>{this.needsUpdate=!0},h.requestPaint())}dispose(){const t=this.image?this.image.parentNode:null;t!==null&&"onpaint"in t&&(t.onpaint=null),super.dispose()}}class ws extends Te{constructor(t,e,n=Un,i,r,a,o=De,l=De,c,h=ai,d=1){if(h!==ai&&h!==Fi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:t,height:e,depth:d};super(u,i,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Bi(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class bp extends ws{constructor(t,e=Un,n=si,i,r,a=De,o=De,l,c=ai){const h={width:t,height:t,depth:1},d=[h,h,h,h,h,h];super(t,t,e,n,i,r,a,o,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class Zh extends Te{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class tn extends Jt{constructor(t=1,e=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],d=[];let u=0,f=0;p("z","y","x",-1,-1,n,e,t,a,r,0),p("z","y","x",1,-1,n,e,-t,a,r,1),p("x","z","y",1,1,t,n,e,i,a,2),p("x","z","y",1,-1,t,n,-e,i,a,3),p("x","y","z",1,-1,t,e,n,i,r,4),p("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new At(c,3)),this.setAttribute("normal",new At(h,3)),this.setAttribute("uv",new At(d,2));function p(_,m,g,v,b,y,T,S,A,x,w){const L=y/A,D=T/x,N=y/2,P=T/2,F=S/2,I=A+1,z=x+1;let O=0,X=0;const j=new C;for(let at=0;at<z;at++){const rt=at*D-P;for(let ct=0;ct<I;ct++){const Yt=ct*L-N;j[_]=Yt*v,j[m]=rt*b,j[g]=F,c.push(j.x,j.y,j.z),j[_]=0,j[m]=0,j[g]=S>0?1:-1,h.push(j.x,j.y,j.z),d.push(ct/A),d.push(1-at/x),O+=1}}for(let at=0;at<x;at++)for(let rt=0;rt<A;rt++){const ct=u+rt+I*at,Yt=u+rt+I*(at+1),ie=u+(rt+1)+I*(at+1),ee=u+(rt+1)+I*at;l.push(ct,Yt,ee),l.push(Yt,ie,ee),X+=6}o.addGroup(f,X,w),f+=X,u+=O}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new tn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}class xs extends Jt{constructor(t=1,e=1,n=4,i=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:i,heightSegments:r},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),i=Math.max(3,Math.floor(i)),r=Math.max(1,Math.floor(r));const a=[],o=[],l=[],c=[],h=e/2,d=Math.PI/2*t,u=e,f=2*d+u,p=n*2+r,_=i+1,m=new C,g=new C;for(let v=0;v<=p;v++){let b=0,y=0,T=0,S=0;if(v<=n){const w=v/n,L=w*Math.PI/2;y=-h-t*Math.cos(L),T=t*Math.sin(L),S=-t*Math.cos(L),b=w*d}else if(v<=n+r){const w=(v-n)/r;y=-h+w*e,T=t,S=0,b=d+w*u}else{const w=(v-n-r)/n,L=w*Math.PI/2;y=h+t*Math.sin(L),T=t*Math.cos(L),S=t*Math.sin(L),b=d+u+w*d}const A=Math.max(0,Math.min(1,b/f));let x=0;v===0?x=.5/i:v===p&&(x=-.5/i);for(let w=0;w<=i;w++){const L=w/i,D=L*Math.PI*2,N=Math.sin(D),P=Math.cos(D);g.x=-T*P,g.y=y,g.z=T*N,o.push(g.x,g.y,g.z),m.set(-T*P,S,T*N),m.normalize(),l.push(m.x,m.y,m.z),c.push(L+x,A)}if(v>0){const w=(v-1)*_;for(let L=0;L<i;L++){const D=w+L,N=w+L+1,P=v*_+L,F=v*_+L+1;a.push(D,N,P),a.push(N,F,P)}}}this.setIndex(a),this.setAttribute("position",new At(o,3)),this.setAttribute("normal",new At(l,3)),this.setAttribute("uv",new At(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new xs(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class va extends Jt{constructor(t=1,e=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:i},e=Math.max(3,e);const r=[],a=[],o=[],l=[],c=new C,h=new J;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let d=0,u=3;d<=e;d++,u+=3){const f=n+d/e*i;c.x=t*Math.cos(f),c.y=t*Math.sin(f),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[u]/t+1)/2,h.y=(a[u+1]/t+1)/2,l.push(h.x,h.y)}for(let d=1;d<=e;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new At(a,3)),this.setAttribute("normal",new At(o,3)),this.setAttribute("uv",new At(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new va(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class oi extends Jt{constructor(t=1,e=1,n=1,i=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const h=[],d=[],u=[],f=[];let p=0;const _=[],m=n/2;let g=0;v(),a===!1&&(t>0&&b(!0),e>0&&b(!1)),this.setIndex(h),this.setAttribute("position",new At(d,3)),this.setAttribute("normal",new At(u,3)),this.setAttribute("uv",new At(f,2));function v(){const y=new C,T=new C;let S=0;const A=(e-t)/n;for(let x=0;x<=r;x++){const w=[],L=x/r,D=L*(e-t)+t;for(let N=0;N<=i;N++){const P=N/i,F=P*l+o,I=Math.sin(F),z=Math.cos(F);T.x=D*I,T.y=-L*n+m,T.z=D*z,d.push(T.x,T.y,T.z),y.set(I,A,z).normalize(),u.push(y.x,y.y,y.z),f.push(P,1-L),w.push(p++)}_.push(w)}for(let x=0;x<i;x++)for(let w=0;w<r;w++){const L=_[w][x],D=_[w+1][x],N=_[w+1][x+1],P=_[w][x+1];(t>0||w!==0)&&(h.push(L,D,P),S+=3),(e>0||w!==r-1)&&(h.push(D,N,P),S+=3)}c.addGroup(g,S,0),g+=S}function b(y){const T=p,S=new J,A=new C;let x=0;const w=y===!0?t:e,L=y===!0?1:-1;for(let N=1;N<=i;N++)d.push(0,m*L,0),u.push(0,L,0),f.push(.5,.5),p++;const D=p;for(let N=0;N<=i;N++){const F=N/i*l+o,I=Math.cos(F),z=Math.sin(F);A.x=w*z,A.y=m*L,A.z=w*I,d.push(A.x,A.y,A.z),u.push(0,L,0),S.x=I*.5+.5,S.y=z*.5*L+.5,f.push(S.x,S.y),p++}for(let N=0;N<i;N++){const P=T+N,F=D+N;y===!0?h.push(F,F+1,P):h.push(F+1,F,P),x+=3}c.addGroup(g,x,y===!0?1:2),g+=x}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new oi(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class yr extends oi{constructor(t=1,e=1,n=32,i=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,i,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new yr(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class $i extends Jt{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};const r=[],a=[];o(i),c(n),h(),this.setAttribute("position",new At(r,3)),this.setAttribute("normal",new At(r.slice(),3)),this.setAttribute("uv",new At(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(v){const b=new C,y=new C,T=new C;for(let S=0;S<e.length;S+=3)f(e[S+0],b),f(e[S+1],y),f(e[S+2],T),l(b,y,T,v)}function l(v,b,y,T){const S=T+1,A=[];for(let x=0;x<=S;x++){A[x]=[];const w=v.clone().lerp(y,x/S),L=b.clone().lerp(y,x/S),D=S-x;for(let N=0;N<=D;N++)N===0&&x===S?A[x][N]=w:A[x][N]=w.clone().lerp(L,N/D)}for(let x=0;x<S;x++)for(let w=0;w<2*(S-x)-1;w++){const L=Math.floor(w/2);w%2===0?(u(A[x][L+1]),u(A[x+1][L]),u(A[x][L])):(u(A[x][L+1]),u(A[x+1][L+1]),u(A[x+1][L]))}}function c(v){const b=new C;for(let y=0;y<r.length;y+=3)b.x=r[y+0],b.y=r[y+1],b.z=r[y+2],b.normalize().multiplyScalar(v),r[y+0]=b.x,r[y+1]=b.y,r[y+2]=b.z}function h(){const v=new C;for(let b=0;b<r.length;b+=3){v.x=r[b+0],v.y=r[b+1],v.z=r[b+2];const y=m(v)/2/Math.PI+.5,T=g(v)/Math.PI+.5;a.push(y,1-T)}p(),d()}function d(){for(let v=0;v<a.length;v+=6){const b=a[v+0],y=a[v+2],T=a[v+4],S=Math.max(b,y,T),A=Math.min(b,y,T);S>.9&&A<.1&&(b<.2&&(a[v+0]+=1),y<.2&&(a[v+2]+=1),T<.2&&(a[v+4]+=1))}}function u(v){r.push(v.x,v.y,v.z)}function f(v,b){const y=v*3;b.x=t[y+0],b.y=t[y+1],b.z=t[y+2]}function p(){const v=new C,b=new C,y=new C,T=new C,S=new J,A=new J,x=new J;for(let w=0,L=0;w<r.length;w+=9,L+=6){v.set(r[w+0],r[w+1],r[w+2]),b.set(r[w+3],r[w+4],r[w+5]),y.set(r[w+6],r[w+7],r[w+8]),S.set(a[L+0],a[L+1]),A.set(a[L+2],a[L+3]),x.set(a[L+4],a[L+5]),T.copy(v).add(b).add(y).divideScalar(3);const D=m(T);_(S,L+0,v,D),_(A,L+2,b,D),_(x,L+4,y,D)}}function _(v,b,y,T){T<0&&v.x===1&&(a[b]=v.x-1),y.x===0&&y.z===0&&(a[b]=T/2/Math.PI+.5)}function m(v){return Math.atan2(v.z,-v.x)}function g(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new $i(t.vertices,t.indices,t.radius,t.detail)}}class kl extends $i{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new kl(t.radius,t.detail)}}const no=new C,io=new C,Dc=new C,so=new gn;class Sp extends Jt{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const i=Math.pow(10,4),r=Math.cos(_s*e),a=t.getIndex(),o=t.getAttribute("position"),l=a?a.count:o.count,c=[0,0,0],h=["a","b","c"],d=new Array(3),u={},f=[];for(let p=0;p<l;p+=3){a?(c[0]=a.getX(p),c[1]=a.getX(p+1),c[2]=a.getX(p+2)):(c[0]=p,c[1]=p+1,c[2]=p+2);const{a:_,b:m,c:g}=so;if(_.fromBufferAttribute(o,c[0]),m.fromBufferAttribute(o,c[1]),g.fromBufferAttribute(o,c[2]),so.getNormal(Dc),d[0]=`${Math.round(_.x*i)},${Math.round(_.y*i)},${Math.round(_.z*i)}`,d[1]=`${Math.round(m.x*i)},${Math.round(m.y*i)},${Math.round(m.z*i)}`,d[2]=`${Math.round(g.x*i)},${Math.round(g.y*i)},${Math.round(g.z*i)}`,!(d[0]===d[1]||d[1]===d[2]||d[2]===d[0]))for(let v=0;v<3;v++){const b=(v+1)%3,y=d[v],T=d[b],S=so[h[v]],A=so[h[b]],x=`${y}_${T}`,w=`${T}_${y}`;w in u&&u[w]?(Dc.dot(u[w].normal)<=r&&(f.push(S.x,S.y,S.z),f.push(A.x,A.y,A.z)),u[w]=null):x in u||(u[x]={index0:c[v],index1:c[b],normal:Dc.clone()})}}for(const p in u)if(u[p]){const{index0:_,index1:m}=u[p];no.fromBufferAttribute(o,_),io.fromBufferAttribute(o,m),f.push(no.x,no.y,no.z),f.push(io.x,io.y,io.z)}this.setAttribute("position",new At(f,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class $n{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){ut("Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,i=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let i=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(i=Math.floor(o+(l-o)/2),c=n[i]-a,c<0)o=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===a)return i/(r-1);const h=n[i],u=n[i+1]-h,f=(a-h)/u;return(i+f)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);const a=this.getPoint(i),o=this.getPoint(r),l=e||(a.isVector2?new J:new C);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new C,i=[],r=[],a=[],o=new C,l=new Xt;for(let f=0;f<=t;f++){const p=f/t;i[f]=this.getTangentAt(p,new C)}r[0]=new C,a[0]=new C;let c=Number.MAX_VALUE;const h=Math.abs(i[0].x),d=Math.abs(i[0].y),u=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),u<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],o),a[0].crossVectors(i[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(i[f-1],i[f]),o.length()>Number.EPSILON){o.normalize();const p=Math.acos(Wt(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,p))}a[f].crossVectors(i[f],r[f])}if(e===!0){let f=Math.acos(Wt(r[0].dot(r[t]),-1,1));f/=t,i[0].dot(o.crossVectors(r[0],r[t]))>0&&(f=-f);for(let p=1;p<=t;p++)r[p].applyMatrix4(l.makeRotationAxis(i[p],f*p)),a[p].crossVectors(i[p],r[p])}return{tangents:i,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class zl extends $n{constructor(t=0,e=0,n=1,i=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new J){const n=e,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(a?r=0:r=i),this.aClockwise===!0&&!a&&(r===i?r=-i:r=r-i);const o=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=l-this.aX,f=c-this.aY;l=u*h-f*d+this.aX,c=u*d+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class wp extends zl{constructor(t,e,n,i,r,a){super(t,e,n,n,i,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Jh(){let s=0,t=0,e=0,n=0;function i(r,a,o,l){s=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){i(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,d){let u=(a-r)/c-(o-r)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+d)+(l-o)/d;u*=h,f*=h,i(a,o,u,f)},calc:function(r){const a=r*r,o=a*r;return s+t*r+e*a+n*o}}}const xd=new C,yd=new C,Nc=new Jh,Uc=new Jh,Oc=new Jh;class Ep extends $n{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new C){const n=e,i=this.points,r=i.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=i[(o-1)%r]:(yd.subVectors(i[0],i[1]).add(i[0]),c=yd);const d=i[o%r],u=i[(o+1)%r];if(this.closed||o+2<r?h=i[(o+2)%r]:(xd.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=xd),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(d),f),_=Math.pow(d.distanceToSquared(u),f),m=Math.pow(u.distanceToSquared(h),f);_<1e-4&&(_=1),p<1e-4&&(p=_),m<1e-4&&(m=_),Nc.initNonuniformCatmullRom(c.x,d.x,u.x,h.x,p,_,m),Uc.initNonuniformCatmullRom(c.y,d.y,u.y,h.y,p,_,m),Oc.initNonuniformCatmullRom(c.z,d.z,u.z,h.z,p,_,m)}else this.curveType==="catmullrom"&&(Nc.initCatmullRom(c.x,d.x,u.x,h.x,this.tension),Uc.initCatmullRom(c.y,d.y,u.y,h.y,this.tension),Oc.initCatmullRom(c.z,d.z,u.z,h.z,this.tension));return n.set(Nc.calc(l),Uc.calc(l),Oc.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new C().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function vd(s,t,e,n,i){const r=(n-t)*.5,a=(i-e)*.5,o=s*s,l=s*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*s+e}function Wg(s,t){const e=1-s;return e*e*t}function Xg(s,t){return 2*(1-s)*s*t}function Yg(s,t){return s*s*t}function Kr(s,t,e,n){return Wg(s,t)+Xg(s,e)+Yg(s,n)}function qg(s,t){const e=1-s;return e*e*e*t}function $g(s,t){const e=1-s;return 3*e*e*s*t}function Zg(s,t){return 3*(1-s)*s*s*t}function Jg(s,t){return s*s*s*t}function jr(s,t,e,n,i){return qg(s,t)+$g(s,e)+Zg(s,n)+Jg(s,i)}class Kh extends $n{constructor(t=new J,e=new J,n=new J,i=new J){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new J){const n=e,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(jr(t,i.x,r.x,a.x,o.x),jr(t,i.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Tp extends $n{constructor(t=new C,e=new C,n=new C,i=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new C){const n=e,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(jr(t,i.x,r.x,a.x,o.x),jr(t,i.y,r.y,a.y,o.y),jr(t,i.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class jh extends $n{constructor(t=new J,e=new J){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new J){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new J){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Ap extends $n{constructor(t=new C,e=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new C){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new C){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Qh extends $n{constructor(t=new J,e=new J,n=new J){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new J){const n=e,i=this.v0,r=this.v1,a=this.v2;return n.set(Kr(t,i.x,r.x,a.x),Kr(t,i.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class tu extends $n{constructor(t=new C,e=new C,n=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new C){const n=e,i=this.v0,r=this.v1,a=this.v2;return n.set(Kr(t,i.x,r.x,a.x),Kr(t,i.y,r.y,a.y),Kr(t,i.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class eu extends $n{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new J){const n=e,i=this.points,r=(i.length-1)*t,a=Math.floor(r),o=r-a,l=i[a===0?a:a-1],c=i[a],h=i[a>i.length-2?i.length-1:a+1],d=i[a>i.length-3?i.length-1:a+2];return n.set(vd(o,l.x,c.x,h.x,d.x),vd(o,l.y,c.y,h.y,d.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new J().fromArray(i))}return this}}var dl=Object.freeze({__proto__:null,ArcCurve:wp,CatmullRomCurve3:Ep,CubicBezierCurve:Kh,CubicBezierCurve3:Tp,EllipseCurve:zl,LineCurve:jh,LineCurve3:Ap,QuadraticBezierCurve:Qh,QuadraticBezierCurve3:tu,SplineCurve:eu});class Cp extends $n{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new dl[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),i=this.getCurveLengths();let r=0;for(;r<i.length;){if(i[r]>=n){const a=i[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let i=0,r=this.curves;i<r.length;i++){const a=r[i],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const i=t.curves[e];this.curves.push(new dl[i.type]().fromJSON(i))}return this}}class ca extends Cp{constructor(t){super(),this.type="Path",this.currentPoint=new J,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new jh(this.currentPoint.clone(),new J(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){const r=new Qh(this.currentPoint.clone(),new J(t,e),new J(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,r,a){const o=new Kh(this.currentPoint.clone(),new J(t,e),new J(n,i),new J(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new eu(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,i,r,a),this}absarc(t,e,n,i,r,a){return this.absellipse(t,e,n,n,i,r,a),this}ellipse(t,e,n,i,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,i,r,a,o,l),this}absellipse(t,e,n,i,r,a,o,l){const c=new zl(t,e,n,i,r,a,o,l);if(this.curves.length>0){const d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Es extends ca{constructor(t){super(t),this.uuid=Tn(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,i=this.holes.length;n<i;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const i=t.holes[e];this.holes.push(i.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const i=this.holes[e];t.holes.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const i=t.holes[e];this.holes.push(new ca().fromJSON(i))}return this}}function Kg(s,t,e=2){const n=t&&t.length,i=n?t[0]*e:s.length;let r=Rp(s,0,i,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=n_(s,t,r,e)),s.length>80*e){o=s[0],l=s[1];let h=o,d=l;for(let u=e;u<i;u+=e){const f=s[u],p=s[u+1];f<o&&(o=f),p<l&&(l=p),f>h&&(h=f),p>d&&(d=p)}c=Math.max(h-o,d-l),c=c!==0?32767/c:0}return ha(r,a,e,o,l,c,0),a}function Rp(s,t,e,n,i){let r;if(i===f_(s,t,e,n)>0)for(let a=t;a<e;a+=n)r=Md(a/n|0,s[a],s[a+1],r);else for(let a=e-n;a>=t;a-=n)r=Md(a/n|0,s[a],s[a+1],r);return r&&dr(r,r.next)&&(da(r),r=r.next),r}function Ts(s,t){if(!s)return s;t||(t=s);let e=s,n;do if(n=!1,!e.steiner&&(dr(e,e.next)||Ee(e.prev,e,e.next)===0)){if(da(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function ha(s,t,e,n,i,r,a){if(!s)return;!a&&r&&o_(s,n,i,r);let o=s;for(;s.prev!==s.next;){const l=s.prev,c=s.next;if(r?Qg(s,n,i,r):jg(s)){t.push(l.i,s.i,c.i),da(s),s=c.next,o=c.next;continue}if(s=c,s===o){a?a===1?(s=t_(Ts(s),t),ha(s,t,e,n,i,r,2)):a===2&&e_(s,t,e,n,i,r):ha(Ts(s),t,e,n,i,r,1);break}}}function jg(s){const t=s.prev,e=s,n=s.next;if(Ee(t,e,n)>=0)return!1;const i=t.x,r=e.x,a=n.x,o=t.y,l=e.y,c=n.y,h=Math.min(i,r,a),d=Math.min(o,l,c),u=Math.max(i,r,a),f=Math.max(o,l,c);let p=n.next;for(;p!==t;){if(p.x>=h&&p.x<=u&&p.y>=d&&p.y<=f&&kr(i,o,r,l,a,c,p.x,p.y)&&Ee(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function Qg(s,t,e,n){const i=s.prev,r=s,a=s.next;if(Ee(i,r,a)>=0)return!1;const o=i.x,l=r.x,c=a.x,h=i.y,d=r.y,u=a.y,f=Math.min(o,l,c),p=Math.min(h,d,u),_=Math.max(o,l,c),m=Math.max(h,d,u),g=ch(f,p,t,e,n),v=ch(_,m,t,e,n);let b=s.prevZ,y=s.nextZ;for(;b&&b.z>=g&&y&&y.z<=v;){if(b.x>=f&&b.x<=_&&b.y>=p&&b.y<=m&&b!==i&&b!==a&&kr(o,h,l,d,c,u,b.x,b.y)&&Ee(b.prev,b,b.next)>=0||(b=b.prevZ,y.x>=f&&y.x<=_&&y.y>=p&&y.y<=m&&y!==i&&y!==a&&kr(o,h,l,d,c,u,y.x,y.y)&&Ee(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;b&&b.z>=g;){if(b.x>=f&&b.x<=_&&b.y>=p&&b.y<=m&&b!==i&&b!==a&&kr(o,h,l,d,c,u,b.x,b.y)&&Ee(b.prev,b,b.next)>=0)return!1;b=b.prevZ}for(;y&&y.z<=v;){if(y.x>=f&&y.x<=_&&y.y>=p&&y.y<=m&&y!==i&&y!==a&&kr(o,h,l,d,c,u,y.x,y.y)&&Ee(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function t_(s,t){let e=s;do{const n=e.prev,i=e.next.next;!dr(n,i)&&Ip(n,e,e.next,i)&&ua(n,i)&&ua(i,n)&&(t.push(n.i,e.i,i.i),da(e),da(e.next),e=s=i),e=e.next}while(e!==s);return Ts(e)}function e_(s,t,e,n,i,r){let a=s;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&h_(a,o)){let l=Lp(a,o);a=Ts(a,a.next),l=Ts(l,l.next),ha(a,t,e,n,i,r,0),ha(l,t,e,n,i,r,0);return}o=o.next}a=a.next}while(a!==s)}function n_(s,t,e,n){const i=[];for(let r=0,a=t.length;r<a;r++){const o=t[r]*n,l=r<a-1?t[r+1]*n:s.length,c=Rp(s,o,l,n,!1);c===c.next&&(c.steiner=!0),i.push(c_(c))}i.sort(i_);for(let r=0;r<i.length;r++)e=s_(i[r],e);return e}function i_(s,t){let e=s.x-t.x;if(e===0&&(e=s.y-t.y,e===0)){const n=(s.next.y-s.y)/(s.next.x-s.x),i=(t.next.y-t.y)/(t.next.x-t.x);e=n-i}return e}function s_(s,t){const e=r_(s,t);if(!e)return t;const n=Lp(e,s);return Ts(n,n.next),Ts(e,e.next)}function r_(s,t){let e=t;const n=s.x,i=s.y;let r=-1/0,a;if(dr(s,e))return e;do{if(dr(s,e.next))return e.next;if(i<=e.y&&i>=e.next.y&&e.next.y!==e.y){const d=e.x+(i-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=n&&d>r&&(r=d,a=e.x<e.next.x?e:e.next,d===n))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;e=a;do{if(n>=e.x&&e.x>=l&&n!==e.x&&Pp(i<c?n:r,i,l,c,i<c?r:n,i,e.x,e.y)){const d=Math.abs(i-e.y)/(n-e.x);ua(e,s)&&(d<h||d===h&&(e.x>a.x||e.x===a.x&&a_(a,e)))&&(a=e,h=d)}e=e.next}while(e!==o);return a}function a_(s,t){return Ee(s.prev,s,t.prev)<0&&Ee(t.next,s,s.next)<0}function o_(s,t,e,n){let i=s;do i.z===0&&(i.z=ch(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,l_(i)}function l_(s){let t,e=1;do{let n=s,i;s=null;let r=null;for(t=0;n;){t++;let a=n,o=0;for(let c=0;c<e&&(o++,a=a.nextZ,!!a);c++);let l=e;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(i=n,n=n.nextZ,o--):(i=a,a=a.nextZ,l--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;n=a}r.nextZ=null,e*=2}while(t>1);return s}function ch(s,t,e,n,i){return s=(s-e)*i|0,t=(t-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,s|t<<1}function c_(s){let t=s,e=s;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==s);return e}function Pp(s,t,e,n,i,r,a,o){return(i-a)*(t-o)>=(s-a)*(r-o)&&(s-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(i-a)*(n-o)}function kr(s,t,e,n,i,r,a,o){return!(s===a&&t===o)&&Pp(s,t,e,n,i,r,a,o)}function h_(s,t){return s.next.i!==t.i&&s.prev.i!==t.i&&!u_(s,t)&&(ua(s,t)&&ua(t,s)&&d_(s,t)&&(Ee(s.prev,s,t.prev)||Ee(s,t.prev,t))||dr(s,t)&&Ee(s.prev,s,s.next)>0&&Ee(t.prev,t,t.next)>0)}function Ee(s,t,e){return(t.y-s.y)*(e.x-t.x)-(t.x-s.x)*(e.y-t.y)}function dr(s,t){return s.x===t.x&&s.y===t.y}function Ip(s,t,e,n){const i=ao(Ee(s,t,e)),r=ao(Ee(s,t,n)),a=ao(Ee(e,n,s)),o=ao(Ee(e,n,t));return!!(i!==r&&a!==o||i===0&&ro(s,e,t)||r===0&&ro(s,n,t)||a===0&&ro(e,s,n)||o===0&&ro(e,t,n))}function ro(s,t,e){return t.x<=Math.max(s.x,e.x)&&t.x>=Math.min(s.x,e.x)&&t.y<=Math.max(s.y,e.y)&&t.y>=Math.min(s.y,e.y)}function ao(s){return s>0?1:s<0?-1:0}function u_(s,t){let e=s;do{if(e.i!==s.i&&e.next.i!==s.i&&e.i!==t.i&&e.next.i!==t.i&&Ip(e,e.next,s,t))return!0;e=e.next}while(e!==s);return!1}function ua(s,t){return Ee(s.prev,s,s.next)<0?Ee(s,t,s.next)>=0&&Ee(s,s.prev,t)>=0:Ee(s,t,s.prev)<0||Ee(s,s.next,t)<0}function d_(s,t){let e=s,n=!1;const i=(s.x+t.x)/2,r=(s.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&i<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==s);return n}function Lp(s,t){const e=hh(s.i,s.x,s.y),n=hh(t.i,t.x,t.y),i=s.next,r=t.prev;return s.next=t,t.prev=s,e.next=i,i.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Md(s,t,e,n){const i=hh(s,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function da(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function hh(s,t,e){return{i:s,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function f_(s,t,e,n){let i=0;for(let r=t,a=e-n;r<e;r+=n)i+=(s[a]-s[r])*(s[r+1]+s[a+1]),a=r;return i}class p_{static triangulate(t,e,n=2){return Kg(t,e,n)}}class Hn{static area(t){const e=t.length;let n=0;for(let i=e-1,r=0;r<e;i=r++)n+=t[i].x*t[r].y-t[r].x*t[i].y;return n*.5}static isClockWise(t){return Hn.area(t)<0}static triangulateShape(t,e){const n=[],i=[],r=[];bd(t),Sd(n,t);let a=t.length;e.forEach(bd);for(let l=0;l<e.length;l++)i.push(a),a+=e[l].length,Sd(n,e[l]);const o=p_.triangulate(n,i);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function bd(s){const t=s.length;t>2&&s[t-1].equals(s[0])&&s.pop()}function Sd(s,t){for(let e=0;e<t.length;e++)s.push(t[e].x),s.push(t[e].y)}class fr extends Jt{constructor(t=new Es([new J(.5,.5),new J(-.5,.5),new J(-.5,-.5),new J(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,i=[],r=[];for(let o=0,l=t.length;o<l;o++){const c=t[o];a(c)}this.setAttribute("position",new At(i,3)),this.setAttribute("uv",new At(r,2)),this.computeVertexNormals();function a(o){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1;let u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,p=e.bevelSize!==void 0?e.bevelSize:f-.1,_=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const g=e.extrudePath,v=e.UVGenerator!==void 0?e.UVGenerator:m_;let b,y=!1,T,S,A,x;if(g){b=g.getSpacedPoints(h),y=!0,u=!1;const tt=g.isCatmullRomCurve3?g.closed:!1;T=g.computeFrenetFrames(h,tt),S=new C,A=new C,x=new C}u||(m=0,f=0,p=0,_=0);const w=o.extractPoints(c);let L=w.shape;const D=w.holes;if(!Hn.isClockWise(L)){L=L.reverse();for(let tt=0,it=D.length;tt<it;tt++){const st=D[tt];Hn.isClockWise(st)&&(D[tt]=st.reverse())}}function P(tt){const st=10000000000000001e-36;let yt=tt[0];for(let _t=1;_t<=tt.length;_t++){const Vt=_t%tt.length,Nt=tt[Vt],qt=Nt.x-yt.x,Zt=Nt.y-yt.y,U=qt*qt+Zt*Zt,me=Math.max(Math.abs(Nt.x),Math.abs(Nt.y),Math.abs(yt.x),Math.abs(yt.y)),re=st*me*me;if(U<=re){tt.splice(Vt,1),_t--;continue}yt=Nt}}P(L),D.forEach(P);const F=D.length,I=L;for(let tt=0;tt<F;tt++){const it=D[tt];L=L.concat(it)}function z(tt,it,st){return it||It("ExtrudeGeometry: vec does not exist"),tt.clone().addScaledVector(it,st)}const O=L.length;function X(tt,it,st){let yt,_t,Vt;const Nt=tt.x-it.x,qt=tt.y-it.y,Zt=st.x-tt.x,U=st.y-tt.y,me=Nt*Nt+qt*qt,re=Nt*U-qt*Zt;if(Math.abs(re)>Number.EPSILON){const R=Math.sqrt(me),M=Math.sqrt(Zt*Zt+U*U),V=it.x-qt/R,W=it.y+Nt/R,q=st.x-U/M,lt=st.y+Zt/M,ht=((q-V)*U-(lt-W)*Zt)/(Nt*U-qt*Zt);yt=V+Nt*ht-tt.x,_t=W+qt*ht-tt.y;const $=yt*yt+_t*_t;if($<=2)return new J(yt,_t);Vt=Math.sqrt($/2)}else{let R=!1;Nt>Number.EPSILON?Zt>Number.EPSILON&&(R=!0):Nt<-Number.EPSILON?Zt<-Number.EPSILON&&(R=!0):Math.sign(qt)===Math.sign(U)&&(R=!0),R?(yt=-qt,_t=Nt,Vt=Math.sqrt(me)):(yt=Nt,_t=qt,Vt=Math.sqrt(me/2))}return new J(yt/Vt,_t/Vt)}const j=[];for(let tt=0,it=I.length,st=it-1,yt=tt+1;tt<it;tt++,st++,yt++)st===it&&(st=0),yt===it&&(yt=0),j[tt]=X(I[tt],I[st],I[yt]);const at=[];let rt,ct=j.concat();for(let tt=0,it=F;tt<it;tt++){const st=D[tt];rt=[];for(let yt=0,_t=st.length,Vt=_t-1,Nt=yt+1;yt<_t;yt++,Vt++,Nt++)Vt===_t&&(Vt=0),Nt===_t&&(Nt=0),rt[yt]=X(st[yt],st[Vt],st[Nt]);at.push(rt),ct=ct.concat(rt)}let Yt;if(m===0)Yt=Hn.triangulateShape(I,D);else{const tt=[],it=[];for(let st=0;st<m;st++){const yt=st/m,_t=f*Math.cos(yt*Math.PI/2),Vt=p*Math.sin(yt*Math.PI/2)+_;for(let Nt=0,qt=I.length;Nt<qt;Nt++){const Zt=z(I[Nt],j[Nt],Vt);Ct(Zt.x,Zt.y,-_t),yt===0&&tt.push(Zt)}for(let Nt=0,qt=F;Nt<qt;Nt++){const Zt=D[Nt];rt=at[Nt];const U=[];for(let me=0,re=Zt.length;me<re;me++){const R=z(Zt[me],rt[me],Vt);Ct(R.x,R.y,-_t),yt===0&&U.push(R)}yt===0&&it.push(U)}}Yt=Hn.triangulateShape(tt,it)}const ie=Yt.length,ee=p+_;for(let tt=0;tt<O;tt++){const it=u?z(L[tt],ct[tt],ee):L[tt];y?(A.copy(T.normals[0]).multiplyScalar(it.x),S.copy(T.binormals[0]).multiplyScalar(it.y),x.copy(b[0]).add(A).add(S),Ct(x.x,x.y,x.z)):Ct(it.x,it.y,0)}for(let tt=1;tt<=h;tt++)for(let it=0;it<O;it++){const st=u?z(L[it],ct[it],ee):L[it];y?(A.copy(T.normals[tt]).multiplyScalar(st.x),S.copy(T.binormals[tt]).multiplyScalar(st.y),x.copy(b[tt]).add(A).add(S),Ct(x.x,x.y,x.z)):Ct(st.x,st.y,d/h*tt)}for(let tt=m-1;tt>=0;tt--){const it=tt/m,st=f*Math.cos(it*Math.PI/2),yt=p*Math.sin(it*Math.PI/2)+_;for(let _t=0,Vt=I.length;_t<Vt;_t++){const Nt=z(I[_t],j[_t],yt);Ct(Nt.x,Nt.y,d+st)}for(let _t=0,Vt=D.length;_t<Vt;_t++){const Nt=D[_t];rt=at[_t];for(let qt=0,Zt=Nt.length;qt<Zt;qt++){const U=z(Nt[qt],rt[qt],yt);y?Ct(U.x,U.y+b[h-1].y,b[h-1].x+st):Ct(U.x,U.y,d+st)}}}Z(),ot();function Z(){const tt=i.length/3;if(u){let it=0,st=O*it;for(let yt=0;yt<ie;yt++){const _t=Yt[yt];Dt(_t[2]+st,_t[1]+st,_t[0]+st)}it=h+m*2,st=O*it;for(let yt=0;yt<ie;yt++){const _t=Yt[yt];Dt(_t[0]+st,_t[1]+st,_t[2]+st)}}else{for(let it=0;it<ie;it++){const st=Yt[it];Dt(st[2],st[1],st[0])}for(let it=0;it<ie;it++){const st=Yt[it];Dt(st[0]+O*h,st[1]+O*h,st[2]+O*h)}}n.addGroup(tt,i.length/3-tt,0)}function ot(){const tt=i.length/3;let it=0;nt(I,it),it+=I.length;for(let st=0,yt=D.length;st<yt;st++){const _t=D[st];nt(_t,it),it+=_t.length}n.addGroup(tt,i.length/3-tt,1)}function nt(tt,it){let st=tt.length;for(;--st>=0;){const yt=st;let _t=st-1;_t<0&&(_t=tt.length-1);for(let Vt=0,Nt=h+m*2;Vt<Nt;Vt++){const qt=O*Vt,Zt=O*(Vt+1),U=it+yt+qt,me=it+_t+qt,re=it+_t+Zt,R=it+yt+Zt;wt(U,me,re,R)}}}function Ct(tt,it,st){l.push(tt),l.push(it),l.push(st)}function Dt(tt,it,st){se(tt),se(it),se(st);const yt=i.length/3,_t=v.generateTopUV(n,i,yt-3,yt-2,yt-1);kt(_t[0]),kt(_t[1]),kt(_t[2])}function wt(tt,it,st,yt){se(tt),se(it),se(yt),se(it),se(st),se(yt);const _t=i.length/3,Vt=v.generateSideWallUV(n,i,_t-6,_t-3,_t-2,_t-1);kt(Vt[0]),kt(Vt[1]),kt(Vt[3]),kt(Vt[1]),kt(Vt[2]),kt(Vt[3])}function se(tt){i.push(l[tt*3+0]),i.push(l[tt*3+1]),i.push(l[tt*3+2])}function kt(tt){r.push(tt.x),r.push(tt.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return g_(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,a=t.shapes.length;r<a;r++){const o=e[t.shapes[r]];n.push(o)}const i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new dl[i.type]().fromJSON(i)),new fr(n,t.options)}}const m_={generateTopUV:function(s,t,e,n,i){const r=t[e*3],a=t[e*3+1],o=t[n*3],l=t[n*3+1],c=t[i*3],h=t[i*3+1];return[new J(r,a),new J(o,l),new J(c,h)]},generateSideWallUV:function(s,t,e,n,i,r){const a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],d=t[n*3+2],u=t[i*3],f=t[i*3+1],p=t[i*3+2],_=t[r*3],m=t[r*3+1],g=t[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new J(a,1-l),new J(c,1-d),new J(u,1-p),new J(_,1-g)]:[new J(o,1-l),new J(h,1-d),new J(f,1-p),new J(m,1-g)]}};function g_(s,t,e){if(e.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){const r=s[n];e.shapes.push(r.uuid)}else e.shapes.push(s.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Vl extends $i{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Vl(t.radius,t.detail)}}class Gl extends Jt{constructor(t=[new J(0,-.5),new J(.5,0),new J(0,.5)],e=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:i},e=Math.floor(e),i=Wt(i,0,Math.PI*2);const r=[],a=[],o=[],l=[],c=[],h=1/e,d=new C,u=new J,f=new C,p=new C,_=new C;let m=0,g=0;for(let v=0;v<=t.length-1;v++)switch(v){case 0:m=t[v+1].x-t[v].x,g=t[v+1].y-t[v].y,f.x=g*1,f.y=-m,f.z=g*0,_.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case t.length-1:l.push(_.x,_.y,_.z);break;default:m=t[v+1].x-t[v].x,g=t[v+1].y-t[v].y,f.x=g*1,f.y=-m,f.z=g*0,p.copy(f),f.x+=_.x,f.y+=_.y,f.z+=_.z,f.normalize(),l.push(f.x,f.y,f.z),_.copy(p)}for(let v=0;v<=e;v++){const b=n+v*h*i,y=Math.sin(b),T=Math.cos(b);for(let S=0;S<=t.length-1;S++){d.x=t[S].x*y,d.y=t[S].y,d.z=t[S].x*T,a.push(d.x,d.y,d.z),u.x=v/e,u.y=S/(t.length-1),o.push(u.x,u.y);const A=l[3*S+0]*y,x=l[3*S+1],w=l[3*S+0]*T;c.push(A,x,w)}}for(let v=0;v<e;v++)for(let b=0;b<t.length-1;b++){const y=b+v*t.length,T=y,S=y+t.length,A=y+t.length+1,x=y+1;r.push(T,S,x),r.push(A,x,S)}this.setIndex(r),this.setAttribute("position",new At(a,3)),this.setAttribute("uv",new At(o,2)),this.setAttribute("normal",new At(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Gl(t.points,t.segments,t.phiStart,t.phiLength)}}class Ma extends $i{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Ma(t.radius,t.detail)}}class li extends Jt{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,d=t/o,u=e/l,f=[],p=[],_=[],m=[];for(let g=0;g<h;g++){const v=g*u-a;for(let b=0;b<c;b++){const y=b*d-r;p.push(y,-v,0),_.push(0,0,1),m.push(b/o),m.push(1-g/l)}}for(let g=0;g<l;g++)for(let v=0;v<o;v++){const b=v+c*g,y=v+c*(g+1),T=v+1+c*(g+1),S=v+1+c*g;f.push(b,y,S),f.push(y,T,S)}this.setIndex(f),this.setAttribute("position",new At(p,3)),this.setAttribute("normal",new At(_,3)),this.setAttribute("uv",new At(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new li(t.width,t.height,t.widthSegments,t.heightSegments)}}class Hl extends Jt{constructor(t=.5,e=1,n=32,i=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:a},n=Math.max(3,n),i=Math.max(1,i);const o=[],l=[],c=[],h=[];let d=t;const u=(e-t)/i,f=new C,p=new J;for(let _=0;_<=i;_++){for(let m=0;m<=n;m++){const g=r+m/n*a;f.x=d*Math.cos(g),f.y=d*Math.sin(g),l.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/e+1)/2,p.y=(f.y/e+1)/2,h.push(p.x,p.y)}d+=u}for(let _=0;_<i;_++){const m=_*(n+1);for(let g=0;g<n;g++){const v=g+m,b=v,y=v+n+1,T=v+n+2,S=v+1;o.push(b,y,S),o.push(y,T,S)}}this.setIndex(o),this.setAttribute("position",new At(l,3)),this.setAttribute("normal",new At(c,3)),this.setAttribute("uv",new At(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Hl(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Wl extends Jt{constructor(t=new Es([new J(0,.5),new J(-.5,-.5),new J(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],i=[],r=[],a=[];let o=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new At(i,3)),this.setAttribute("normal",new At(r,3)),this.setAttribute("uv",new At(a,2));function c(h){const d=i.length/3,u=h.extractPoints(e);let f=u.shape;const p=u.holes;Hn.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,g=p.length;m<g;m++){const v=p[m];Hn.isClockWise(v)===!0&&(p[m]=v.reverse())}const _=Hn.triangulateShape(f,p);for(let m=0,g=p.length;m<g;m++){const v=p[m];f=f.concat(v)}for(let m=0,g=f.length;m<g;m++){const v=f[m];i.push(v.x,v.y,0),r.push(0,0,1),a.push(v.x,v.y)}for(let m=0,g=_.length;m<g;m++){const v=_[m],b=v[0]+d,y=v[1]+d,T=v[2]+d;n.push(b,y,T),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return __(e,t)}static fromJSON(t,e){const n=[];for(let i=0,r=t.shapes.length;i<r;i++){const a=e[t.shapes[i]];n.push(a)}return new Wl(n,t.curveSegments)}}function __(s,t){if(t.shapes=[],Array.isArray(s))for(let e=0,n=s.length;e<n;e++){const i=s[e];t.shapes.push(i.uuid)}else t.shapes.push(s.uuid);return t}class xn extends Jt{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],d=new C,u=new C,f=[],p=[],_=[],m=[];for(let g=0;g<=n;g++){const v=[],b=g/n,y=a+b*o,T=t*Math.cos(y),S=Math.sqrt(t*t-T*T);let A=0;g===0&&a===0?A=.5/e:g===n&&l===Math.PI&&(A=-.5/e);for(let x=0;x<=e;x++){const w=x/e,L=i+w*r;d.x=-S*Math.cos(L),d.y=T,d.z=S*Math.sin(L),p.push(d.x,d.y,d.z),u.copy(d).normalize(),_.push(u.x,u.y,u.z),m.push(w+A,1-b),v.push(c++)}h.push(v)}for(let g=0;g<n;g++)for(let v=0;v<e;v++){const b=h[g][v+1],y=h[g][v],T=h[g+1][v],S=h[g+1][v+1];(g!==0||a>0)&&f.push(b,y,S),(g!==n-1||l<Math.PI)&&f.push(y,T,S)}this.setIndex(f),this.setAttribute("position",new At(p,3)),this.setAttribute("normal",new At(_,3)),this.setAttribute("uv",new At(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new xn(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Xl extends $i{constructor(t=1,e=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],i=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,i,t,e),this.type="TetrahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Xl(t.radius,t.detail)}}class As extends Jt{constructor(t=1,e=.4,n=12,i=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),i=Math.floor(i);const l=[],c=[],h=[],d=[],u=new C,f=new C,p=new C;for(let _=0;_<=n;_++){const m=a+_/n*o;for(let g=0;g<=i;g++){const v=g/i*r;f.x=(t+e*Math.cos(m))*Math.cos(v),f.y=(t+e*Math.cos(m))*Math.sin(v),f.z=e*Math.sin(m),c.push(f.x,f.y,f.z),u.x=t*Math.cos(v),u.y=t*Math.sin(v),p.subVectors(f,u).normalize(),h.push(p.x,p.y,p.z),d.push(g/i),d.push(_/n)}}for(let _=1;_<=n;_++)for(let m=1;m<=i;m++){const g=(i+1)*_+m-1,v=(i+1)*(_-1)+m-1,b=(i+1)*(_-1)+m,y=(i+1)*_+m;l.push(g,v,y),l.push(v,b,y)}this.setIndex(l),this.setAttribute("position",new At(c,3)),this.setAttribute("normal",new At(h,3)),this.setAttribute("uv",new At(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new As(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Yl extends Jt{constructor(t=1,e=.4,n=64,i=8,r=2,a=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:t,tube:e,tubularSegments:n,radialSegments:i,p:r,q:a},n=Math.floor(n),i=Math.floor(i);const o=[],l=[],c=[],h=[],d=new C,u=new C,f=new C,p=new C,_=new C,m=new C,g=new C;for(let b=0;b<=n;++b){const y=b/n*r*Math.PI*2;v(y,r,a,t,f),v(y+.01,r,a,t,p),m.subVectors(p,f),g.addVectors(p,f),_.crossVectors(m,g),g.crossVectors(_,m),_.normalize(),g.normalize();for(let T=0;T<=i;++T){const S=T/i*Math.PI*2,A=-e*Math.cos(S),x=e*Math.sin(S);d.x=f.x+(A*g.x+x*_.x),d.y=f.y+(A*g.y+x*_.y),d.z=f.z+(A*g.z+x*_.z),l.push(d.x,d.y,d.z),u.subVectors(d,f).normalize(),c.push(u.x,u.y,u.z),h.push(b/n),h.push(T/i)}}for(let b=1;b<=n;b++)for(let y=1;y<=i;y++){const T=(i+1)*(b-1)+(y-1),S=(i+1)*b+(y-1),A=(i+1)*b+y,x=(i+1)*(b-1)+y;o.push(T,S,x),o.push(S,A,x)}this.setIndex(o),this.setAttribute("position",new At(l,3)),this.setAttribute("normal",new At(c,3)),this.setAttribute("uv",new At(h,2));function v(b,y,T,S,A){const x=Math.cos(b),w=Math.sin(b),L=T/y*b,D=Math.cos(L);A.x=S*(2+D)*.5*x,A.y=S*(2+D)*w*.5,A.z=S*Math.sin(L)*.5}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Yl(t.radius,t.tube,t.tubularSegments,t.radialSegments,t.p,t.q)}}class ql extends Jt{constructor(t=new tu(new C(-1,-1,0),new C(-1,1,0),new C(1,1,0)),e=64,n=1,i=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:i,closed:r};const a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new C,l=new C,c=new J;let h=new C;const d=[],u=[],f=[],p=[];_(),this.setIndex(p),this.setAttribute("position",new At(d,3)),this.setAttribute("normal",new At(u,3)),this.setAttribute("uv",new At(f,2));function _(){for(let b=0;b<e;b++)m(b);m(r===!1?e:0),v(),g()}function m(b){h=t.getPointAt(b/e,h);const y=a.normals[b],T=a.binormals[b];for(let S=0;S<=i;S++){const A=S/i*Math.PI*2,x=Math.sin(A),w=-Math.cos(A);l.x=w*y.x+x*T.x,l.y=w*y.y+x*T.y,l.z=w*y.z+x*T.z,l.normalize(),u.push(l.x,l.y,l.z),o.x=h.x+n*l.x,o.y=h.y+n*l.y,o.z=h.z+n*l.z,d.push(o.x,o.y,o.z)}}function g(){for(let b=1;b<=e;b++)for(let y=1;y<=i;y++){const T=(i+1)*(b-1)+(y-1),S=(i+1)*b+(y-1),A=(i+1)*b+y,x=(i+1)*(b-1)+y;p.push(T,S,x),p.push(S,A,x)}}function v(){for(let b=0;b<=e;b++)for(let y=0;y<=i;y++)c.x=b/e,c.y=y/i,f.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new ql(new dl[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class Dp extends Jt{constructor(t=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:t},t!==null){const e=[],n=new Set,i=new C,r=new C;if(t.index!==null){const a=t.attributes.position,o=t.index;let l=t.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){const d=l[c],u=d.start,f=d.count;for(let p=u,_=u+f;p<_;p+=3)for(let m=0;m<3;m++){const g=o.getX(p+m),v=o.getX(p+(m+1)%3);i.fromBufferAttribute(a,g),r.fromBufferAttribute(a,v),wd(i,r,n)===!0&&(e.push(i.x,i.y,i.z),e.push(r.x,r.y,r.z))}}}else{const a=t.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let c=0;c<3;c++){const h=3*o+c,d=3*o+(c+1)%3;i.fromBufferAttribute(a,h),r.fromBufferAttribute(a,d),wd(i,r,n)===!0&&(e.push(i.x,i.y,i.z),e.push(r.x,r.y,r.z))}}this.setAttribute("position",new At(e,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}function wd(s,t,e){const n=`${s.x},${s.y},${s.z}-${t.x},${t.y},${t.z}`,i=`${t.x},${t.y},${t.z}-${s.x},${s.y},${s.z}`;return e.has(n)===!0||e.has(i)===!0?!1:(e.add(n),e.add(i),!0)}var Ed=Object.freeze({__proto__:null,BoxGeometry:tn,CapsuleGeometry:xs,CircleGeometry:va,ConeGeometry:yr,CylinderGeometry:oi,DodecahedronGeometry:kl,EdgesGeometry:Sp,ExtrudeGeometry:fr,IcosahedronGeometry:Vl,LatheGeometry:Gl,OctahedronGeometry:Ma,PlaneGeometry:li,PolyhedronGeometry:$i,RingGeometry:Hl,ShapeGeometry:Wl,SphereGeometry:xn,TetrahedronGeometry:Xl,TorusGeometry:As,TorusKnotGeometry:Yl,TubeGeometry:ql,WireframeGeometry:Dp});class Np extends qe{constructor(t){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new St(0),this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.fog=t.fog,this}}function pr(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];if(Td(i))i.isRenderTargetTexture?(ut("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone();else if(Array.isArray(i))if(Td(i[0])){const r=[];for(let a=0,o=i.length;a<o;a++)r[a]=i[a].clone();t[e][n]=r}else t[e][n]=i.slice();else t[e][n]=i}}return t}function rn(s){const t={};for(let e=0;e<s.length;e++){const n=pr(s[e]);for(const i in n)t[i]=n[i]}return t}function Td(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function x_(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function Up(s){const t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ae.workingColorSpace}const Op={clone:pr,merge:rn};var y_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,v_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class On extends qe{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=y_,this.fragmentShader=v_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=pr(t.uniforms),this.uniformsGroups=x_(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?e.uniforms[i]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[i]={type:"m4",value:a.toArray()}:e.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(const n in t.uniforms){const i=t.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=e[i.value]||null;break;case"c":this.uniforms[n].value=new St().setHex(i.value);break;case"v2":this.uniforms[n].value=new J().fromArray(i.value);break;case"v3":this.uniforms[n].value=new C().fromArray(i.value);break;case"v4":this.uniforms[n].value=new pe().fromArray(i.value);break;case"m3":this.uniforms[n].value=new $t().fromArray(i.value);break;case"m4":this.uniforms[n].value=new Xt().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(const n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}}class nu extends On{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class je extends qe{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new St(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new St(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=bi,this.normalScale=new J(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Xn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class mr extends je{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new J(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Wt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new St(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new St(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new St(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class Fp extends qe{constructor(t){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new St(16777215),this.specular=new St(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new St(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=bi,this.normalScale=new J(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Xn,this.combine=ga,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.specular.copy(t.specular),this.shininess=t.shininess,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Bp extends qe{constructor(t){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new St(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new St(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=bi,this.normalScale=new J(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.gradientMap=t.gradientMap,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}class kp extends qe{constructor(t){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=bi,this.normalScale=new J(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}}class zp extends qe{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new St(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new St(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=bi,this.normalScale=new J(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Xn,this.combine=ga,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class iu extends qe{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=np,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class su extends qe{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Vp extends qe{constructor(t){super(),this.isMeshMatcapMaterial=!0,this.defines={MATCAP:""},this.type="MeshMatcapMaterial",this.color=new St(16777215),this.matcap=null,this.map=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=bi,this.normalScale=new J(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={MATCAP:""},this.color.copy(t.color),this.matcap=t.matcap,this.map=t.map,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Gp extends un{constructor(t){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t)}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this}}function ps(s,t){return!s||s.constructor===t?s:typeof t.BYTES_PER_ELEMENT=="number"?new t(s):Array.prototype.slice.call(s)}function Hp(s){function t(i,r){return s[i]-s[r]}const e=s.length,n=new Array(e);for(let i=0;i!==e;++i)n[i]=i;return n.sort(t),n}function uh(s,t,e){const n=s.length,i=new s.constructor(n);for(let r=0,a=0;a!==n;++r){const o=e[r]*t;for(let l=0;l!==t;++l)i[a++]=s[o+l]}return i}function Wp(s,t,e,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(t.push(r.time),e.push(...a)),r=s[i++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(t.push(r.time),a.toArray(e,e.length)),r=s[i++];while(r!==void 0);else do a=r[n],a!==void 0&&(t.push(r.time),e.push(a)),r=s[i++];while(r!==void 0)}function M_(s,t,e,n,i=30){const r=s.clone();r.name=t;const a=[];for(let l=0;l<r.tracks.length;++l){const c=r.tracks[l],h=c.getValueSize(),d=[],u=[];for(let f=0;f<c.times.length;++f){const p=c.times[f]*i;if(!(p<e||p>=n)){d.push(c.times[f]);for(let _=0;_<h;++_)u.push(c.values[f*h+_])}}d.length!==0&&(c.times=ps(d,c.times.constructor),c.values=ps(u,c.values.constructor),a.push(c))}r.tracks=a;let o=1/0;for(let l=0;l<r.tracks.length;++l)o>r.tracks[l].times[0]&&(o=r.tracks[l].times[0]);for(let l=0;l<r.tracks.length;++l)r.tracks[l].shift(-1*o);return r.resetDuration(),r}function b_(s,t=0,e=s,n=30){n<=0&&(n=30);const i=e.tracks.length,r=t/n;for(let a=0;a<i;++a){const o=e.tracks[a],l=o.ValueTypeName;if(l==="bool"||l==="string")continue;const c=s.tracks.find(function(g){return g.name===o.name&&g.ValueTypeName===l});if(c===void 0)continue;let h=0;const d=o.getValueSize();o.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(h=d/3);let u=0;const f=c.getValueSize();c.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(u=f/3);const p=o.times.length-1;let _;if(r<=o.times[0]){const g=h,v=d-h;_=o.values.slice(g,v)}else if(r>=o.times[p]){const g=p*d+h,v=g+d-h;_=o.values.slice(g,v)}else{const g=o.createInterpolant(),v=h,b=d-h;g.evaluate(r),_=g.resultBuffer.slice(v,b)}l==="quaternion"&&new Xe().fromArray(_).normalize().conjugate().toArray(_);const m=c.times.length;for(let g=0;g<m;++g){const v=g*f+u;if(l==="quaternion")Xe.multiplyQuaternionsFlat(c.values,v,_,0,c.values,v);else{const b=f-u*2;for(let y=0;y<b;++y)c.values[v+y]-=_[y]}}}return s.blendMode=kh,s}class S_{static convertArray(t,e){return ps(t,e)}static isTypedArray(t){return hp(t)}static getKeyframeOrder(t){return Hp(t)}static sortedArray(t,e,n){return uh(t,e,n)}static flattenJSON(t,e,n,i){Wp(t,e,n,i)}static subclip(t,e,n,i,r=30){return M_(t,e,n,i,r)}static makeClipAdditive(t,e=0,n=t,i=30){return b_(t,e,n,i)}}class vr{constructor(t,e,n,i){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){const e=this.parameterPositions;let n=this._cachedIndex,i=e[n],r=e[n-1];t:{e:{let a;n:{i:if(!(t<i)){for(let o=n+2;;){if(i===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=i,i=e[++n],t<i)break e}a=e.length;break n}if(!(t>=r)){const o=e[1];t<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=e[--n-1],t>=r)break e}a=n,n=0;break n}break t}for(;n<a;){const o=n+a>>>1;t<e[o]?a=o:n=o+1}if(i=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,t,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){const e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=t*i;for(let a=0;a!==i;++a)e[a]=n[r+a];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}}class Xp extends vr{constructor(t,e,n,i){super(t,e,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ds,endingEnd:ds}}intervalChanged_(t,e,n){const i=this.parameterPositions;let r=t-2,a=t+1,o=i[r],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case fs:r=t,o=2*e-n;break;case ia:r=i.length-2,o=e+i[r]-i[r+1];break;default:r=t,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case fs:a=t,l=2*n-e;break;case ia:a=1,l=n+i[1]-i[0];break;default:a=t-1,l=e}const c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(t,e,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,p=(n-e)/(i-e),_=p*p,m=_*p,g=-u*m+2*u*_-u*p,v=(1+u)*m+(-1.5-2*u)*_+(-.5+u)*p+1,b=(-1-f)*m+(1.5+f)*_+.5*p,y=f*m-f*_;for(let T=0;T!==o;++T)r[T]=g*a[h+T]+v*a[c+T]+b*a[l+T]+y*a[d+T];return r}}class ru extends vr{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=(n-e)/(i-e),d=1-h;for(let u=0;u!==o;++u)r[u]=a[c+u]*d+a[l+u]*h;return r}}class Yp extends vr{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t){return this.copySampleValue_(t-1)}}class qp extends vr{interpolate_(t,e,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this.inTangents,d=this.outTangents;if(!h||!d){const p=(n-e)/(i-e),_=1-p;for(let m=0;m!==o;++m)r[m]=a[c+m]*_+a[l+m]*p;return r}const u=o*2,f=t-1;for(let p=0;p!==o;++p){const _=a[c+p],m=a[l+p],g=f*u+p*2,v=d[g],b=d[g+1],y=t*u+p*2,T=h[y],S=h[y+1];let A=(n-e)/(i-e),x,w,L,D,N;for(let P=0;P<8;P++){x=A*A,w=x*A,L=1-A,D=L*L,N=D*L;const I=N*e+3*D*A*v+3*L*x*T+w*i-n;if(Math.abs(I)<1e-10)break;const z=3*D*(v-e)+6*L*A*(T-v)+3*x*(i-T);if(Math.abs(z)<1e-10)break;A=A-I/z,A=Math.max(0,Math.min(1,A))}r[p]=N*_+3*D*A*b+3*L*x*S+w*m}return r}}class Fn{constructor(t,e,n,i){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=ps(e,this.TimeBufferType),this.values=ps(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(t){const e=t.constructor;let n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:ps(t.times,Array),values:ps(t.values,Array)};const i=t.getInterpolation();i!==t.DefaultInterpolation&&(n.interpolation=i)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Yp(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new ru(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Xp(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){const e=new qp(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case na:e=this.InterpolantFactoryMethodDiscrete;break;case cl:e=this.InterpolantFactoryMethodLinear;break;case vo:e=this.InterpolantFactoryMethodSmooth;break;case rh:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return ut("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return na;case this.InterpolantFactoryMethodLinear:return cl;case this.InterpolantFactoryMethodSmooth:return vo;case this.InterpolantFactoryMethodBezier:return rh}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){const e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]+=t}return this}scale(t){if(t!==1){const e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]*=t}return this}trim(t,e){const n=this.times,i=n.length;let r=0,a=i-1;for(;r!==i&&n[r]<t;)++r;for(;a!==-1&&n[a]>e;)--a;if(++a,r!==0||a!==i){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0;const e=this.getValueSize();e-Math.floor(e)!==0&&(It("KeyframeTrack: Invalid value size in track.",this),t=!1);const n=this.times,i=this.values,r=n.length;r===0&&(It("KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){const l=n[o];if(typeof l=="number"&&isNaN(l)){It("KeyframeTrack: Time is not a valid number.",this,o,l),t=!1;break}if(a!==null&&a>l){It("KeyframeTrack: Out of order keys.",this,o,l,a),t=!1;break}a=l}if(i!==void 0&&hp(i))for(let o=0,l=i.length;o!==l;++o){const c=i[o];if(isNaN(c)){It("KeyframeTrack: Value is not a valid number.",this,o,c),t=!1;break}}return t}optimize(){const t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===vo,r=t.length-1;let a=1;for(let o=1;o<r;++o){let l=!1;const c=t[o],h=t[o+1];if(c!==h&&(o!==1||c!==t[0]))if(i)l=!0;else{const d=o*n,u=d-n,f=d+n;for(let p=0;p!==n;++p){const _=e[d+p];if(_!==e[u+p]||_!==e[f+p]){l=!0;break}}}if(l){if(o!==a){t[a]=t[o];const d=o*n,u=a*n;for(let f=0;f!==n;++f)e[u+f]=e[d+f]}++a}}if(r>0){t[a]=t[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)e[l+c]=e[o+c];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){const t=this.times.slice(),e=this.values.slice(),n=this.constructor,i=new n(this.name,t,e);return i.createInterpolant=this.createInterpolant,i}}Fn.prototype.ValueTypeName="";Fn.prototype.TimeBufferType=Float32Array;Fn.prototype.ValueBufferType=Float32Array;Fn.prototype.DefaultInterpolation=cl;class Rs extends Fn{constructor(t,e,n){super(t,e,n)}}Rs.prototype.ValueTypeName="bool";Rs.prototype.ValueBufferType=Array;Rs.prototype.DefaultInterpolation=na;Rs.prototype.InterpolantFactoryMethodLinear=void 0;Rs.prototype.InterpolantFactoryMethodSmooth=void 0;class au extends Fn{constructor(t,e,n,i){super(t,e,n,i)}}au.prototype.ValueTypeName="color";class $l extends Fn{constructor(t,e,n,i){super(t,e,n,i)}}$l.prototype.ValueTypeName="number";class $p extends vr{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-e)/(i-e);let c=t*o;for(let h=c+o;c!==h;c+=4)Xe.slerpFlat(r,0,a,c-o,a,c,l);return r}}class Zl extends Fn{constructor(t,e,n,i){super(t,e,n,i)}InterpolantFactoryMethodLinear(t){return new $p(this.times,this.values,this.getValueSize(),t)}}Zl.prototype.ValueTypeName="quaternion";Zl.prototype.InterpolantFactoryMethodSmooth=void 0;class Ps extends Fn{constructor(t,e,n){super(t,e,n)}}Ps.prototype.ValueTypeName="string";Ps.prototype.ValueBufferType=Array;Ps.prototype.DefaultInterpolation=na;Ps.prototype.InterpolantFactoryMethodLinear=void 0;Ps.prototype.InterpolantFactoryMethodSmooth=void 0;class ou extends Fn{constructor(t,e,n,i){super(t,e,n,i)}}ou.prototype.ValueTypeName="vector";class fa{constructor(t="",e=-1,n=[],i=El){this.name=t,this.tracks=n,this.duration=e,this.blendMode=i,this.uuid=Tn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(t){const e=[],n=t.tracks,i=1/(t.fps||1);for(let a=0,o=n.length;a!==o;++a)e.push(E_(n[a]).scale(i));const r=new this(t.name,t.duration,e,t.blendMode);return r.uuid=t.uuid,r.userData=JSON.parse(t.userData||"{}"),r}static toJSON(t){const e=[],n=t.tracks,i={name:t.name,duration:t.duration,tracks:e,uuid:t.uuid,blendMode:t.blendMode,userData:JSON.stringify(t.userData)};for(let r=0,a=n.length;r!==a;++r)e.push(Fn.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(t,e,n,i){const r=e.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);const h=Hp(l);l=uh(l,1,h),c=uh(c,1,h),!i&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new $l(".morphTargetInfluences["+e[o].name+"]",l,c).scale(1/n))}return new this(t,-1,a)}static findByName(t,e){let n=t;if(!Array.isArray(t)){const i=t;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===e)return n[i];return null}static CreateClipsFromMorphTargetSequences(t,e,n){const i={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=t.length;o<l;o++){const c=t[o],h=c.name.match(r);if(h&&h.length>1){const d=h[1];let u=i[d];u||(i[d]=u=[]),u.push(c)}}const a=[];for(const o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],e,n));return a}resetDuration(){const t=this.tracks;let e=0;for(let n=0,i=t.length;n!==i;++n){const r=this.tracks[n];e=Math.max(e,r.times[r.times.length-1])}return this.duration=e,this}trim(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].trim(0,this.duration);return this}validate(){let t=!0;for(let e=0;e<this.tracks.length;e++)t=t&&this.tracks[e].validate();return t}optimize(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].optimize();return this}clone(){const t=[];for(let n=0;n<this.tracks.length;n++)t.push(this.tracks[n].clone());const e=new this.constructor(this.name,this.duration,t,this.blendMode);return e.userData=JSON.parse(JSON.stringify(this.userData)),e}toJSON(){return this.constructor.toJSON(this)}}function w_(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return $l;case"vector":case"vector2":case"vector3":case"vector4":return ou;case"color":return au;case"quaternion":return Zl;case"bool":case"boolean":return Rs;case"string":return Ps}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function E_(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const t=w_(s.type);if(s.times===void 0){const e=[],n=[];Wp(s.keys,e,n,"value"),s.times=e,s.values=n}return t.parse!==void 0?t.parse(s):new t(s.name,s.times,s.values,s.interpolation)}const ei={enabled:!1,files:{},add:function(s,t){this.enabled!==!1&&(Ad(s)||(this.files[s]=t))},get:function(s){if(this.enabled!==!1&&!Ad(s))return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};function Ad(s){try{const t=s.slice(s.indexOf(":")+1);return new URL(t).protocol==="blob:"}catch{return!1}}class lu{constructor(t,e,n){const i=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&i.onStart!==void 0&&i.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,i.onProgress!==void 0&&i.onProgress(h,a,o),a===o&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){const d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=c.length;d<u;d+=2){const f=c[d],p=c[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const Zp=new lu;class vn{constructor(t){this.manager=t!==void 0?t:Zp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){const n=this;return new Promise(function(i,r){n.load(t,i,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}}vn.DEFAULT_MATERIAL_NAME="__DEFAULT";const mi={};class T_ extends Error{constructor(t,e){super(t),this.response=e}}class Si extends vn{constructor(t){super(t),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(t,e,n,i){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=ei.get(`file:${t}`);if(r!==void 0){this.manager.itemStart(t),setTimeout(()=>{e&&e(r),this.manager.itemEnd(t)},0);return}if(mi[t]!==void 0){mi[t].push({onLoad:e,onProgress:n,onError:i});return}mi[t]=[],mi[t].push({onLoad:e,onProgress:n,onError:i});const a=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&ut("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=mi[t],d=c.body.getReader(),u=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=u?parseInt(u):0,p=f!==0;let _=0;const m=new ReadableStream({start(g){v();function v(){d.read().then(({done:b,value:y})=>{if(b)g.close();else{_+=y.byteLength;const T=new ProgressEvent("progress",{lengthComputable:p,loaded:_,total:f});for(let S=0,A=h.length;S<A;S++){const x=h[S];x.onProgress&&x.onProgress(T)}g.enqueue(y),v()}},b=>{g.error(b)})}}});return new Response(m)}else throw new T_(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{const d=/charset="?([^;"\s]*)"?/i.exec(o),u=d&&d[1]?d[1].toLowerCase():void 0,f=new TextDecoder(u);return c.arrayBuffer().then(p=>f.decode(p))}}}).then(c=>{ei.add(`file:${t}`,c);const h=mi[t];delete mi[t];for(let d=0,u=h.length;d<u;d++){const f=h[d];f.onLoad&&f.onLoad(c)}}).catch(c=>{const h=mi[t];if(h===void 0)throw this.manager.itemError(t),c;delete mi[t];for(let d=0,u=h.length;d<u;d++){const f=h[d];f.onError&&f.onError(c)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}class A_ extends vn{constructor(t){super(t)}load(t,e,n,i){const r=this,a=new Si(this.manager);a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(t,function(o){try{e(r.parse(JSON.parse(o)))}catch(l){i?i(l):It(l),r.manager.itemError(t)}},n,i)}parse(t){const e=[];for(let n=0;n<t.length;n++){const i=fa.parse(t[n]);e.push(i)}return e}}class C_ extends vn{constructor(t){super(t)}load(t,e,n,i){const r=this,a=[],o=new Bl,l=new Si(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(r.withCredentials);let c=0;function h(d){l.load(t[d],function(u){const f=r.parse(u,!0);a[d]={width:f.width,height:f.height,format:f.format,mipmaps:f.mipmaps},c+=1,c===6&&(f.mipmapCount===1&&(o.minFilter=we),o.image=a,o.format=f.format,o.needsUpdate=!0,e&&e(o))},n,i)}if(Array.isArray(t))for(let d=0,u=t.length;d<u;++d)h(d);else l.load(t,function(d){const u=r.parse(d,!0);if(u.isCubemap){const f=u.mipmaps.length/u.mipmapCount;for(let p=0;p<f;p++){a[p]={mipmaps:[]};for(let _=0;_<u.mipmapCount;_++)a[p].mipmaps.push(u.mipmaps[p*u.mipmapCount+_]),a[p].format=u.format,a[p].width=u.width,a[p].height=u.height}o.image=a}else o.image.width=u.width,o.image.height=u.height,o.mipmaps=u.mipmaps;u.mipmapCount===1&&(o.minFilter=we),o.format=u.format,o.needsUpdate=!0,e&&e(o)},n,i);return o}}const Zs=new WeakMap;class pa extends vn{constructor(t){super(t)}load(t,e,n,i){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=this,a=ei.get(`image:${t}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(t),setTimeout(function(){e&&e(a),r.manager.itemEnd(t)},0);else{let d=Zs.get(a);d===void 0&&(d=[],Zs.set(a,d)),d.push({onLoad:e,onError:i})}return a}const o=oa("img");function l(){h(),e&&e(this);const d=Zs.get(this)||[];for(let u=0;u<d.length;u++){const f=d[u];f.onLoad&&f.onLoad(this)}Zs.delete(this),r.manager.itemEnd(t)}function c(d){h(),i&&i(d),ei.remove(`image:${t}`);const u=Zs.get(this)||[];for(let f=0;f<u.length;f++){const p=u[f];p.onError&&p.onError(d)}Zs.delete(this),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),ei.add(`image:${t}`,o),r.manager.itemStart(t),o.src=t,o}}class R_ extends vn{constructor(t){super(t)}load(t,e,n,i){const r=new ya;r.colorSpace=Ge;const a=new pa(this.manager);a.setCrossOrigin(this.crossOrigin),a.setPath(this.path);let o=0;function l(c){a.load(t[c],function(h){r.images[c]=h,o++,o===6&&(r.needsUpdate=!0,e&&e(r))},void 0,i)}for(let c=0;c<t.length;++c)l(c);return r}}class P_ extends vn{constructor(t){super(t)}load(t,e,n,i){const r=this,a=new Dn,o=new Si(this.manager);return o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setPath(this.path),o.setWithCredentials(r.withCredentials),o.load(t,function(l){let c;try{c=r.parse(l)}catch(h){i!==void 0?i(h):It(h);return}r._applyTexData(a,c),e&&e(a,c)},n,i),a}createDataTexture(t){const e=new Dn;return this._applyTexData(e,this.parse(t)),e}_applyTexData(t,e){e.image!==void 0?t.image=e.image:e.data!==void 0&&(t.image.width=e.width,t.image.height=e.height,t.image.data=e.data),t.wrapS=e.wrapS!==void 0?e.wrapS:_n,t.wrapT=e.wrapT!==void 0?e.wrapT:_n,t.magFilter=e.magFilter!==void 0?e.magFilter:we,t.minFilter=e.minFilter!==void 0?e.minFilter:we,t.anisotropy=e.anisotropy!==void 0?e.anisotropy:1,e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.mipmaps!==void 0&&(t.mipmaps=e.mipmaps,t.minFilter=ti),e.mipmapCount===1&&(t.minFilter=we),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),t.needsUpdate=!0}}class I_ extends vn{constructor(t){super(t)}load(t,e,n,i){const r=new Te,a=new pa(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(t,function(o){r.image=o,r.needsUpdate=!0,e!==void 0&&e(r)},n,i),r}}class Zi extends oe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new St(t),this.intensity=e}dispose(){this.dispatchEvent({type:"dispose"})}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}}class cu extends Zi{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(oe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new St(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){const e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}}const Fc=new Xt,Cd=new C,Rd=new C;class hu{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new J(512,512),this.mapType=mn,this.map=null,this.mapPass=null,this.matrix=new Xt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ss,this._frameExtents=new J(1,1),this._viewportCount=1,this._viewports=[new pe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Cd.setFromMatrixPosition(t.matrixWorld),e.position.copy(Cd),Rd.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Rd),e.updateMatrixWorld(),Fc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Fc,e.coordinateSystem,e.reversedDepth),e.coordinateSystem===Ms||e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Fc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const oo=new C,lo=new Xe,jn=new C;class Jl extends oe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Xt,this.projectionMatrix=new Xt,this.projectionMatrixInverse=new Xt,this.coordinateSystem=wn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(oo,lo,jn),jn.x===1&&jn.y===1&&jn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(oo,lo,jn.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(oo,lo,jn),jn.x===1&&jn.y===1&&jn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(oo,lo,jn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Ni=new C,Pd=new J,Id=new J;class Ve extends Jl{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=hr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(_s*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return hr*2*Math.atan(Math.tan(_s*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Ni.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Ni.x,Ni.y).multiplyScalar(-t/Ni.z),Ni.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ni.x,Ni.y).multiplyScalar(-t/Ni.z)}getViewSize(t,e){return this.getViewBounds(t,Pd,Id),e.subVectors(Id,Pd)}setViewOffset(t,e,n,i,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(_s*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*i/l,e-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}class L_ extends hu{constructor(){super(new Ve(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(t){const e=this.camera,n=hr*2*t.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,r=t.distance||e.far;(n!==e.fov||i!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=i,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class uu extends Zi{constructor(t,e,n=0,i=Math.PI/3,r=0,a=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(oe.DEFAULT_UP),this.updateMatrix(),this.target=new oe,this.distance=n,this.angle=i,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new L_}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.map=t.map,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.angle=this.angle,e.object.decay=this.decay,e.object.penumbra=this.penumbra,e.object.target=this.target.uuid,this.map&&this.map.isTexture&&(e.object.map=this.map.toJSON(t).uuid),e.object.shadow=this.shadow.toJSON(),e}}class D_ extends hu{constructor(){super(new Ve(90,1,.5,500)),this.isPointLightShadow=!0}}class Kl extends Zi{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new D_}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}}class ba extends Jl{constructor(t=-1,e=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class N_ extends hu{constructor(){super(new ba(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class du extends Zi{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(oe.DEFAULT_UP),this.updateMatrix(),this.target=new oe,this.shadow=new N_}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}}class Jp extends Zi{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class Kp extends Zi{constructor(t,e,n=10,i=10){super(t,e),this.isRectAreaLight=!0,this.type="RectAreaLight",this.width=n,this.height=i}get power(){return this.intensity*this.width*this.height*Math.PI}set power(t){this.intensity=t/(this.width*this.height*Math.PI)}copy(t){return super.copy(t),this.width=t.width,this.height=t.height,this}toJSON(t){const e=super.toJSON(t);return e.object.width=this.width,e.object.height=this.height,e}}class fu{constructor(){this.isSphericalHarmonics3=!0,this.coefficients=[];for(let t=0;t<9;t++)this.coefficients.push(new C)}set(t){for(let e=0;e<9;e++)this.coefficients[e].copy(t[e]);return this}zero(){for(let t=0;t<9;t++)this.coefficients[t].set(0,0,0);return this}getAt(t,e){const n=t.x,i=t.y,r=t.z,a=this.coefficients;return e.copy(a[0]).multiplyScalar(.282095),e.addScaledVector(a[1],.488603*i),e.addScaledVector(a[2],.488603*r),e.addScaledVector(a[3],.488603*n),e.addScaledVector(a[4],1.092548*(n*i)),e.addScaledVector(a[5],1.092548*(i*r)),e.addScaledVector(a[6],.315392*(3*r*r-1)),e.addScaledVector(a[7],1.092548*(n*r)),e.addScaledVector(a[8],.546274*(n*n-i*i)),e}getIrradianceAt(t,e){const n=t.x,i=t.y,r=t.z,a=this.coefficients;return e.copy(a[0]).multiplyScalar(.886227),e.addScaledVector(a[1],2*.511664*i),e.addScaledVector(a[2],2*.511664*r),e.addScaledVector(a[3],2*.511664*n),e.addScaledVector(a[4],2*.429043*n*i),e.addScaledVector(a[5],2*.429043*i*r),e.addScaledVector(a[6],.743125*r*r-.247708),e.addScaledVector(a[7],2*.429043*n*r),e.addScaledVector(a[8],.429043*(n*n-i*i)),e}add(t){for(let e=0;e<9;e++)this.coefficients[e].add(t.coefficients[e]);return this}addScaledSH(t,e){for(let n=0;n<9;n++)this.coefficients[n].addScaledVector(t.coefficients[n],e);return this}scale(t){for(let e=0;e<9;e++)this.coefficients[e].multiplyScalar(t);return this}lerp(t,e){for(let n=0;n<9;n++)this.coefficients[n].lerp(t.coefficients[n],e);return this}equals(t){for(let e=0;e<9;e++)if(!this.coefficients[e].equals(t.coefficients[e]))return!1;return!0}copy(t){return this.set(t.coefficients)}clone(){return new this.constructor().copy(this)}fromArray(t,e=0){const n=this.coefficients;for(let i=0;i<9;i++)n[i].fromArray(t,e+i*3);return this}toArray(t=[],e=0){const n=this.coefficients;for(let i=0;i<9;i++)n[i].toArray(t,e+i*3);return t}static getBasisAt(t,e){const n=t.x,i=t.y,r=t.z;e[0]=.282095,e[1]=.488603*i,e[2]=.488603*r,e[3]=.488603*n,e[4]=1.092548*n*i,e[5]=1.092548*i*r,e[6]=.315392*(3*r*r-1),e[7]=1.092548*n*r,e[8]=.546274*(n*n-i*i)}}class jp extends Zi{constructor(t=new fu,e=1){super(void 0,e),this.isLightProbe=!0,this.sh=t}copy(t){return super.copy(t),this.sh.copy(t.sh),this}toJSON(t){const e=super.toJSON(t);return e.object.sh=this.sh.toArray(),e}}const Ld={};class jl extends vn{constructor(t){super(t),this.textures={}}load(t,e,n,i){const r=this,a=new Si(r.manager);a.setPath(r.path),a.setRequestHeader(r.requestHeader),a.setWithCredentials(r.withCredentials),a.load(t,function(o){try{e(r.parse(JSON.parse(o)))}catch(l){i?i(l):It(l),r.manager.itemError(t)}},n,i)}parse(t){const e=this.createMaterialFromType(t.type);return e.fromJSON(t,this.textures),e}setTextures(t){return this.textures=t,this}createMaterialFromType(t){return jl.createMaterialFromType(t)}static createMaterialFromType(t){const n={ShadowMaterial:Np,SpriteMaterial:Nl,RawShaderMaterial:nu,ShaderMaterial:On,PointsMaterial:qh,MeshPhysicalMaterial:mr,MeshStandardMaterial:je,MeshPhongMaterial:Fp,MeshToonMaterial:Bp,MeshNormalMaterial:kp,MeshLambertMaterial:zp,MeshDepthMaterial:iu,MeshDistanceMaterial:su,MeshBasicMaterial:He,MeshMatcapMaterial:Vp,LineDashedMaterial:Gp,LineBasicMaterial:un,Material:qe,...Ld}[t];let i;return n===void 0?(Vi(`MaterialLoader: Unknown material type "${t}". Use .registerMaterial() before starting the deserialization process.`),i=new qe):i=new n,i}static registerMaterial(t,e){Ld[t]=e}}class dh{static extractUrlBase(t){const e=t.lastIndexOf("/");return e===-1?"./":t.slice(0,e+1)}static resolveURL(t,e){return typeof t!="string"||t===""?"":(/^https?:\/\//i.test(e)&&/^\//.test(t)&&(e=e.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(t)||/^data:.*,.*$/i.test(t)||/^blob:.*$/i.test(t)?t:e+t)}}class Qp extends Jt{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class tm extends vn{constructor(t){super(t)}load(t,e,n,i){const r=this,a=new Si(r.manager);a.setPath(r.path),a.setRequestHeader(r.requestHeader),a.setWithCredentials(r.withCredentials),a.load(t,function(o){try{e(r.parse(JSON.parse(o)))}catch(l){i?i(l):It(l),r.manager.itemError(t)}},n,i)}parse(t){const e={},n={};function i(f,p){if(e[p]!==void 0)return e[p];const m=f.interleavedBuffers[p],g=r(f,m.buffer),v=ir(m.type,g),b=new Dl(v,m.stride);return b.uuid=m.uuid,e[p]=b,b}function r(f,p){if(n[p]!==void 0)return n[p];const m=f.arrayBuffers[p],g=new Uint32Array(m).buffer;return n[p]=g,g}const a=t.isInstancedBufferGeometry?new Qp:new Jt,o=t.data.index;if(o!==void 0){const f=ir(o.type,o.array);a.setIndex(new xe(f,1))}const l=t.data.attributes;for(const f in l){const p=l[f];let _;if(p.isInterleavedBufferAttribute){const m=i(t.data,p.data);_=new bs(m,p.itemSize,p.offset,p.normalized)}else{const m=ir(p.type,p.array),g=p.isInstancedBufferAttribute?ur:xe;_=new g(m,p.itemSize,p.normalized)}p.name!==void 0&&(_.name=p.name),p.usage!==void 0&&_.setUsage(p.usage),a.setAttribute(f,_)}const c=t.data.morphAttributes;if(c)for(const f in c){const p=c[f],_=[];for(let m=0,g=p.length;m<g;m++){const v=p[m];let b;if(v.isInterleavedBufferAttribute){const y=i(t.data,v.data);b=new bs(y,v.itemSize,v.offset,v.normalized)}else{const y=ir(v.type,v.array);b=new xe(y,v.itemSize,v.normalized)}v.name!==void 0&&(b.name=v.name),_.push(b)}a.morphAttributes[f]=_}t.data.morphTargetsRelative&&(a.morphTargetsRelative=!0);const d=t.data.groups||t.data.drawcalls||t.data.offsets;if(d!==void 0)for(let f=0,p=d.length;f!==p;++f){const _=d[f];a.addGroup(_.start,_.count,_.materialIndex)}const u=t.data.boundingSphere;return u!==void 0&&(a.boundingSphere=new Ye().fromJSON(u)),t.name&&(a.name=t.name),t.userData&&(a.userData=t.userData),a}}const Bc={};class U_ extends vn{constructor(t){super(t)}load(t,e,n,i){const r=this,a=this.path===""?dh.extractUrlBase(t):this.path;this.resourcePath=this.resourcePath||a;const o=new Si(this.manager);o.setPath(this.path),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(t,function(l){let c=null;try{c=JSON.parse(l)}catch(d){i!==void 0&&i(d),It("ObjectLoader: Can't parse "+t+".",d.message);return}const h=c.metadata;if(h===void 0||h.type===void 0||h.type.toLowerCase()==="geometry"){i!==void 0&&i(new Error("THREE.ObjectLoader: Can't load "+t)),It("ObjectLoader: Can't load "+t);return}r.parse(c,e)},n,i)}async loadAsync(t,e){const n=this,i=this.path===""?dh.extractUrlBase(t):this.path;this.resourcePath=this.resourcePath||i;const r=new Si(this.manager);r.setPath(this.path),r.setRequestHeader(this.requestHeader),r.setWithCredentials(this.withCredentials);const a=await r.loadAsync(t,e);let o;try{o=JSON.parse(a)}catch(c){throw new Error("THREE.ObjectLoader: Can't parse "+t+". "+c.message)}const l=o.metadata;if(l===void 0||l.type===void 0||l.type.toLowerCase()==="geometry")throw new Error("THREE.ObjectLoader: Can't load "+t);return await n.parseAsync(o)}parse(t,e){const n=this.parseAnimations(t.animations),i=this.parseShapes(t.shapes),r=this.parseGeometries(t.geometries,i),a=this.parseImages(t.images,function(){e!==void 0&&e(c)}),o=this.parseTextures(t.textures,a),l=this.parseMaterials(t.materials,o),c=this.parseObject(t.object,r,l,o,n),h=this.parseSkeletons(t.skeletons,c);if(this.bindSkeletons(c,h),this.bindLightTargets(c),e!==void 0){let d=!1;for(const u in a)if(a[u].data instanceof HTMLImageElement){d=!0;break}d===!1&&e(c)}return c}async parseAsync(t){const e=this.parseAnimations(t.animations),n=this.parseShapes(t.shapes),i=this.parseGeometries(t.geometries,n),r=await this.parseImagesAsync(t.images),a=this.parseTextures(t.textures,r),o=this.parseMaterials(t.materials,a),l=this.parseObject(t.object,i,o,a,e),c=this.parseSkeletons(t.skeletons,l);return this.bindSkeletons(l,c),this.bindLightTargets(l),l}static registerGeometry(t,e){Bc[t]=e}parseShapes(t){const e={};if(t!==void 0)for(let n=0,i=t.length;n<i;n++){const r=new Es().fromJSON(t[n]);e[r.uuid]=r}return e}parseSkeletons(t,e){const n={},i={};if(e.traverse(function(r){r.isBone&&(i[r.uuid]=r)}),t!==void 0)for(let r=0,a=t.length;r<a;r++){const o=new Ol().fromJSON(t[r],i);n[o.uuid]=o}return n}parseGeometries(t,e){const n={};if(t!==void 0){const i=new tm;for(let r=0,a=t.length;r<a;r++){let o;const l=t[r];switch(l.type){case"BufferGeometry":case"InstancedBufferGeometry":o=i.parse(l);break;default:l.type in Ed?o=Ed[l.type].fromJSON(l,e):l.type in Bc?o=Bc[l.type].fromJSON(l,e):ut(`ObjectLoader: Unknown geometry type "${l.type}". Use .registerGeometry() before starting the deserialization process.`)}o.uuid=l.uuid,l.name!==void 0&&(o.name=l.name),l.userData!==void 0&&(o.userData=l.userData),n[l.uuid]=o}}return n}parseMaterials(t,e){const n={},i={};if(t!==void 0){const r=new jl;r.setTextures(e);for(let a=0,o=t.length;a<o;a++){const l=t[a];n[l.uuid]===void 0&&(n[l.uuid]=r.parse(l)),i[l.uuid]=n[l.uuid]}}return i}parseAnimations(t){const e={};if(t!==void 0)for(let n=0;n<t.length;n++){const i=t[n],r=fa.parse(i);e[r.uuid]=r}return e}parseImages(t,e){const n=this,i={};let r;function a(l){return l=n.manager.resolveURL(l),n.manager.itemStart(l),r.load(l,function(){n.manager.itemEnd(l)},void 0,function(){n.manager.itemError(l),n.manager.itemEnd(l)})}function o(l){if(typeof l=="string"){const c=l,h=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(c)?c:n.resourcePath+c;return a(h)}else return l.data?{data:ir(l.type,l.data),width:l.width,height:l.height}:null}if(t!==void 0&&t.length>0){const l=new lu(e);r=new pa(l),r.setCrossOrigin(this.crossOrigin);for(let c=0,h=t.length;c<h;c++){const d=t[c],u=d.url;if(Array.isArray(u)){const f=[];for(let p=0,_=u.length;p<_;p++){const m=u[p],g=o(m);g!==null&&(g instanceof HTMLImageElement?f.push(g):f.push(new Dn(g.data,g.width,g.height)))}i[d.uuid]=new Bi(f)}else{const f=o(d.url);i[d.uuid]=new Bi(f)}}}return i}async parseImagesAsync(t){const e=this,n={};let i;async function r(a){if(typeof a=="string"){const o=a,l=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(o)?o:e.resourcePath+o;return await i.loadAsync(l)}else return a.data?{data:ir(a.type,a.data),width:a.width,height:a.height}:null}if(t!==void 0&&t.length>0){i=new pa(this.manager),i.setCrossOrigin(this.crossOrigin);for(let a=0,o=t.length;a<o;a++){const l=t[a],c=l.url;if(Array.isArray(c)){const h=[];for(let d=0,u=c.length;d<u;d++){const f=c[d],p=await r(f);p!==null&&(p instanceof HTMLImageElement?h.push(p):h.push(new Dn(p.data,p.width,p.height)))}n[l.uuid]=new Bi(h)}else{const h=await r(l.url);n[l.uuid]=new Bi(h)}}}return n}parseTextures(t,e){function n(r,a){return typeof r=="number"?r:(ut("ObjectLoader.parseTexture: Constant should be in numeric form.",r),a[r])}const i={};if(t!==void 0)for(let r=0,a=t.length;r<a;r++){const o=t[r];o.image===void 0&&ut('ObjectLoader: No "image" specified for',o.uuid),e[o.image]===void 0&&ut("ObjectLoader: Undefined image",o.image);const l=e[o.image],c=l.data;let h;Array.isArray(c)?(h=new ya,c.length===6&&(h.needsUpdate=!0)):(c&&c.data?h=new Dn:h=new Te,c&&(h.needsUpdate=!0)),h.source=l,h.uuid=o.uuid,o.name!==void 0&&(h.name=o.name),o.mapping!==void 0&&(h.mapping=n(o.mapping,O_)),o.channel!==void 0&&(h.channel=o.channel),o.offset!==void 0&&h.offset.fromArray(o.offset),o.repeat!==void 0&&h.repeat.fromArray(o.repeat),o.center!==void 0&&h.center.fromArray(o.center),o.rotation!==void 0&&(h.rotation=o.rotation),o.wrap!==void 0&&(h.wrapS=n(o.wrap[0],Dd),h.wrapT=n(o.wrap[1],Dd)),o.format!==void 0&&(h.format=o.format),o.internalFormat!==void 0&&(h.internalFormat=o.internalFormat),o.type!==void 0&&(h.type=o.type),o.colorSpace!==void 0&&(h.colorSpace=o.colorSpace),o.minFilter!==void 0&&(h.minFilter=n(o.minFilter,Nd)),o.magFilter!==void 0&&(h.magFilter=n(o.magFilter,Nd)),o.anisotropy!==void 0&&(h.anisotropy=o.anisotropy),o.flipY!==void 0&&(h.flipY=o.flipY),o.generateMipmaps!==void 0&&(h.generateMipmaps=o.generateMipmaps),o.premultiplyAlpha!==void 0&&(h.premultiplyAlpha=o.premultiplyAlpha),o.unpackAlignment!==void 0&&(h.unpackAlignment=o.unpackAlignment),o.compareFunction!==void 0&&(h.compareFunction=o.compareFunction),o.normalized!==void 0&&(h.normalized=o.normalized),o.userData!==void 0&&(h.userData=o.userData),i[o.uuid]=h}return i}parseObject(t,e,n,i,r){let a;function o(u){return e[u]===void 0&&ut("ObjectLoader: Undefined geometry",u),e[u]}function l(u){if(u!==void 0){if(Array.isArray(u)){const f=[];for(let p=0,_=u.length;p<_;p++){const m=u[p];n[m]===void 0&&ut("ObjectLoader: Undefined material",m),f.push(n[m])}return f}return n[u]===void 0&&ut("ObjectLoader: Undefined material",u),n[u]}}function c(u){return i[u]===void 0&&ut("ObjectLoader: Undefined texture",u),i[u]}let h,d;switch(t.type){case"Scene":a=new Gh,t.background!==void 0&&(Number.isInteger(t.background)?a.background=new St(t.background):a.background=c(t.background)),t.environment!==void 0&&(a.environment=c(t.environment)),t.fog!==void 0&&(t.fog.type==="Fog"?a.fog=new xa(t.fog.color,t.fog.near,t.fog.far):t.fog.type==="FogExp2"&&(a.fog=new Ll(t.fog.color,t.fog.density)),t.fog.name!==""&&(a.fog.name=t.fog.name)),t.backgroundBlurriness!==void 0&&(a.backgroundBlurriness=t.backgroundBlurriness),t.backgroundIntensity!==void 0&&(a.backgroundIntensity=t.backgroundIntensity),t.backgroundRotation!==void 0&&a.backgroundRotation.fromArray(t.backgroundRotation),t.environmentIntensity!==void 0&&(a.environmentIntensity=t.environmentIntensity),t.environmentRotation!==void 0&&a.environmentRotation.fromArray(t.environmentRotation);break;case"PerspectiveCamera":a=new Ve(t.fov,t.aspect,t.near,t.far),t.focus!==void 0&&(a.focus=t.focus),t.zoom!==void 0&&(a.zoom=t.zoom),t.filmGauge!==void 0&&(a.filmGauge=t.filmGauge),t.filmOffset!==void 0&&(a.filmOffset=t.filmOffset),t.view!==void 0&&(a.view=Object.assign({},t.view));break;case"OrthographicCamera":a=new ba(t.left,t.right,t.top,t.bottom,t.near,t.far),t.zoom!==void 0&&(a.zoom=t.zoom),t.view!==void 0&&(a.view=Object.assign({},t.view));break;case"AmbientLight":a=new Jp(t.color,t.intensity);break;case"DirectionalLight":a=new du(t.color,t.intensity),a.target=t.target||"";break;case"PointLight":a=new Kl(t.color,t.intensity,t.distance,t.decay);break;case"RectAreaLight":a=new Kp(t.color,t.intensity,t.width,t.height);break;case"SpotLight":a=new uu(t.color,t.intensity,t.distance,t.angle,t.penumbra,t.decay),a.target=t.target||"";break;case"HemisphereLight":a=new cu(t.color,t.groundColor,t.intensity);break;case"LightProbe":const u=new fu().fromArray(t.sh);a=new jp(u,t.intensity);break;case"SkinnedMesh":h=o(t.geometry),d=l(t.material),a=new _p(h,d),t.bindMode!==void 0&&(a.bindMode=t.bindMode),t.bindMatrix!==void 0&&a.bindMatrix.fromArray(t.bindMatrix),t.skeleton!==void 0&&(a.skeleton=t.skeleton);break;case"Mesh":h=o(t.geometry),d=l(t.material),a=new Gt(h,d);break;case"InstancedMesh":h=o(t.geometry),d=l(t.material);const f=t.count,p=t.instanceMatrix,_=t.instanceColor;a=new Yh(h,d,f),a.instanceMatrix=new ur(new Float32Array(p.array),16),_!==void 0&&(a.instanceColor=new ur(new Float32Array(_.array),_.itemSize));break;case"BatchedMesh":h=o(t.geometry),d=l(t.material),a=new xp(t.maxInstanceCount,t.maxVertexCount,t.maxIndexCount,d),a.geometry=h,a.perObjectFrustumCulled=t.perObjectFrustumCulled,a.sortObjects=t.sortObjects,a._drawRanges=t.drawRanges,a._reservedRanges=t.reservedRanges,a._geometryInfo=t.geometryInfo.map(m=>{let g=null,v=null;return m.boundingBox!==void 0&&(g=new nn().fromJSON(m.boundingBox)),m.boundingSphere!==void 0&&(v=new Ye().fromJSON(m.boundingSphere)),{...m,boundingBox:g,boundingSphere:v}}),a._instanceInfo=t.instanceInfo,a._availableInstanceIds=t._availableInstanceIds,a._availableGeometryIds=t._availableGeometryIds,a._nextIndexStart=t.nextIndexStart,a._nextVertexStart=t.nextVertexStart,a._geometryCount=t.geometryCount,a._maxInstanceCount=t.maxInstanceCount,a._maxVertexCount=t.maxVertexCount,a._maxIndexCount=t.maxIndexCount,a._geometryInitialized=t.geometryInitialized,a._matricesTexture=c(t.matricesTexture.uuid),a._indirectTexture=c(t.indirectTexture.uuid),t.colorsTexture!==void 0&&(a._colorsTexture=c(t.colorsTexture.uuid)),t.boundingSphere!==void 0&&(a.boundingSphere=new Ye().fromJSON(t.boundingSphere)),t.boundingBox!==void 0&&(a.boundingBox=new nn().fromJSON(t.boundingBox));break;case"LOD":a=new gp;break;case"Line":a=new Yi(o(t.geometry),l(t.material));break;case"LineLoop":a=new yp(o(t.geometry),l(t.material));break;case"LineSegments":a=new ci(o(t.geometry),l(t.material));break;case"PointCloud":case"Points":a=new vp(o(t.geometry),l(t.material));break;case"Sprite":a=new Ul(l(t.material));break;case"Group":a=new de;break;case"Bone":a=new Xh;break;default:a=new oe}if(a.uuid=t.uuid,t.name!==void 0&&(a.name=t.name),t.matrix!==void 0?(a.matrix.fromArray(t.matrix),t.matrixAutoUpdate!==void 0&&(a.matrixAutoUpdate=t.matrixAutoUpdate),a.matrixAutoUpdate&&a.matrix.decompose(a.position,a.quaternion,a.scale)):(t.position!==void 0&&a.position.fromArray(t.position),t.rotation!==void 0&&a.rotation.fromArray(t.rotation),t.quaternion!==void 0&&a.quaternion.fromArray(t.quaternion),t.scale!==void 0&&a.scale.fromArray(t.scale)),t.up!==void 0&&a.up.fromArray(t.up),t.pivot!==void 0&&(a.pivot=new C().fromArray(t.pivot)),t.morphTargetDictionary!==void 0&&(a.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),t.morphTargetInfluences!==void 0&&(a.morphTargetInfluences=t.morphTargetInfluences.slice()),t.castShadow!==void 0&&(a.castShadow=t.castShadow),t.receiveShadow!==void 0&&(a.receiveShadow=t.receiveShadow),t.shadow&&(t.shadow.intensity!==void 0&&(a.shadow.intensity=t.shadow.intensity),t.shadow.bias!==void 0&&(a.shadow.bias=t.shadow.bias),t.shadow.normalBias!==void 0&&(a.shadow.normalBias=t.shadow.normalBias),t.shadow.radius!==void 0&&(a.shadow.radius=t.shadow.radius),t.shadow.mapSize!==void 0&&a.shadow.mapSize.fromArray(t.shadow.mapSize),t.shadow.camera!==void 0&&(a.shadow.camera=this.parseObject(t.shadow.camera))),t.visible!==void 0&&(a.visible=t.visible),t.frustumCulled!==void 0&&(a.frustumCulled=t.frustumCulled),t.renderOrder!==void 0&&(a.renderOrder=t.renderOrder),t.static!==void 0&&(a.static=t.static),t.userData!==void 0&&(a.userData=t.userData),t.layers!==void 0&&(a.layers.mask=t.layers),t.children!==void 0){const u=t.children;for(let f=0;f<u.length;f++)a.add(this.parseObject(u[f],e,n,i,r))}if(t.animations!==void 0){const u=t.animations;for(let f=0;f<u.length;f++){const p=u[f];a.animations.push(r[p])}}if(t.type==="LOD"){t.autoUpdate!==void 0&&(a.autoUpdate=t.autoUpdate);const u=t.levels;for(let f=0;f<u.length;f++){const p=u[f],_=a.getObjectByProperty("uuid",p.object);_!==void 0&&a.addLevel(_,p.distance,p.hysteresis)}}return a}bindSkeletons(t,e){Object.keys(e).length!==0&&t.traverse(function(n){if(n.isSkinnedMesh===!0&&n.skeleton!==void 0){const i=e[n.skeleton];i===void 0?ut("ObjectLoader: No skeleton found with UUID:",n.skeleton):n.bind(i,n.bindMatrix)}})}bindLightTargets(t){t.traverse(function(e){if(e.isDirectionalLight||e.isSpotLight){const n=e.target,i=t.getObjectByProperty("uuid",n);i!==void 0?e.target=i:e.target=new oe}})}}const O_={UVMapping:xl,CubeReflectionMapping:si,CubeRefractionMapping:Hi,EquirectangularReflectionMapping:Hr,EquirectangularRefractionMapping:Wr,CubeUVReflectionMapping:xr},Dd={RepeatWrapping:or,ClampToEdgeWrapping:_n,MirroredRepeatWrapping:Qr},Nd={NearestFilter:De,NearestMipmapNearestFilter:Lh,NearestMipmapLinearFilter:nr,LinearFilter:we,LinearMipmapNearestFilter:Xr,LinearMipmapLinearFilter:ti},kc=new WeakMap;class F_ extends vn{constructor(t){super(t),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&ut("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&ut("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(t){return this.options=t,this}load(t,e,n,i){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=this,a=ei.get(`image-bitmap:${t}`);if(a!==void 0){if(r.manager.itemStart(t),a.then){a.then(c=>{kc.has(a)===!0?(i&&i(kc.get(a)),r.manager.itemError(t),r.manager.itemEnd(t)):(e&&e(c),r.manager.itemEnd(t))});return}setTimeout(function(){e&&e(a),r.manager.itemEnd(t)},0);return}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(t,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(c){ei.add(`image-bitmap:${t}`,c),e&&e(c),r.manager.itemEnd(t)}).catch(function(c){i&&i(c),kc.set(l,c),ei.remove(`image-bitmap:${t}`),r.manager.itemError(t),r.manager.itemEnd(t)});ei.add(`image-bitmap:${t}`,l),r.manager.itemStart(t)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}let co;class pu{static getContext(){return co===void 0&&(co=new(window.AudioContext||window.webkitAudioContext)),co}static setContext(t){co=t}}class B_ extends vn{constructor(t){super(t)}load(t,e,n,i){const r=this,a=new Si(this.manager);a.setResponseType("arraybuffer"),a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(t,function(l){try{const c=l.slice(0),h=pu.getContext(),d=t+"#decode";r.manager.itemStart(d),h.decodeAudioData(c,function(u){e(u),r.manager.itemEnd(d)}).catch(function(u){o(u),r.manager.itemEnd(d)})}catch(c){o(c)}},n,i);function o(l){i?i(l):It(l),r.manager.itemError(t)}}}const Ud=new Xt,Od=new Xt,is=new Xt;class k_{constructor(){this.type="StereoCamera",this.aspect=1,this.eyeSep=.064,this.cameraL=new Ve,this.cameraL.layers.enable(1),this.cameraL.matrixAutoUpdate=!1,this.cameraR=new Ve,this.cameraR.layers.enable(2),this.cameraR.matrixAutoUpdate=!1,this._cache={focus:null,fov:null,aspect:null,near:null,far:null,zoom:null,eyeSep:null}}update(t){const e=this._cache;if(e.focus!==t.focus||e.fov!==t.fov||e.aspect!==t.aspect*this.aspect||e.near!==t.near||e.far!==t.far||e.zoom!==t.zoom||e.eyeSep!==this.eyeSep){e.focus=t.focus,e.fov=t.fov,e.aspect=t.aspect*this.aspect,e.near=t.near,e.far=t.far,e.zoom=t.zoom,e.eyeSep=this.eyeSep,is.copy(t.projectionMatrix);const i=e.eyeSep/2,r=i*e.near/e.focus,a=e.near*Math.tan(_s*e.fov*.5)/e.zoom;let o,l;Od.elements[12]=-i,Ud.elements[12]=i,o=-a*e.aspect+r,l=a*e.aspect+r,is.elements[0]=2*e.near/(l-o),is.elements[8]=(l+o)/(l-o),this.cameraL.projectionMatrix.copy(is),o=-a*e.aspect-r,l=a*e.aspect-r,is.elements[0]=2*e.near/(l-o),is.elements[8]=(l+o)/(l-o),this.cameraR.projectionMatrix.copy(is)}this.cameraL.matrix.copy(t.matrixWorld).multiply(Od),this.cameraL.matrixWorldNeedsUpdate=!0,this.cameraR.matrix.copy(t.matrixWorld).multiply(Ud),this.cameraR.matrixWorldNeedsUpdate=!0}}const Js=-90,Ks=1;class em extends oe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Ve(Js,Ks,t,e);i.layers=this.layers,this.add(i);const r=new Ve(Js,Ks,t,e);r.layers=this.layers,this.add(r);const a=new Ve(Js,Ks,t,e);a.layers=this.layers,this.add(a);const o=new Ve(Js,Ks,t,e);o.layers=this.layers,this.add(o);const l=new Ve(Js,Ks,t,e);l.layers=this.layers,this.add(l);const c=new Ve(Js,Ks,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===wn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Ms)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;t.isWebGLRenderer===!0?m=t.state.buffers.depth.getReversed():m=t.reversedDepthBuffer,t.setRenderTarget(n,0,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,2,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,3,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(d,u,f),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class nm extends Ve{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class im{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=z_.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function z_(){this._document.hidden===!1&&this.reset()}const ss=new C,zc=new Xe,V_=new C,rs=new C,as=new C;class G_ extends oe{constructor(){super(),this.type="AudioListener",this.context=pu.getContext(),this.gain=this.context.createGain(),this.gain.connect(this.context.destination),this.filter=null,this.timeDelta=0,this._timer=new im}getInput(){return this.gain}removeFilter(){return this.filter!==null&&(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination),this.gain.connect(this.context.destination),this.filter=null),this}getFilter(){return this.filter}setFilter(t){return this.filter!==null?(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination)):this.gain.disconnect(this.context.destination),this.filter=t,this.gain.connect(this.filter),this.filter.connect(this.context.destination),this}getMasterVolume(){return this.gain.gain.value}setMasterVolume(t){return this.gain.gain.setTargetAtTime(t,this.context.currentTime,.01),this}updateMatrixWorld(t){super.updateMatrixWorld(t),this._timer.update();const e=this.context.listener;if(this.timeDelta=this._timer.getDelta(),this.matrixWorld.decompose(ss,zc,V_),rs.set(0,0,-1).applyQuaternion(zc),as.set(0,1,0).applyQuaternion(zc),e.positionX){const n=this.context.currentTime+this.timeDelta;e.positionX.linearRampToValueAtTime(ss.x,n),e.positionY.linearRampToValueAtTime(ss.y,n),e.positionZ.linearRampToValueAtTime(ss.z,n),e.forwardX.linearRampToValueAtTime(rs.x,n),e.forwardY.linearRampToValueAtTime(rs.y,n),e.forwardZ.linearRampToValueAtTime(rs.z,n),e.upX.linearRampToValueAtTime(as.x,n),e.upY.linearRampToValueAtTime(as.y,n),e.upZ.linearRampToValueAtTime(as.z,n)}else e.setPosition(ss.x,ss.y,ss.z),e.setOrientation(rs.x,rs.y,rs.z,as.x,as.y,as.z)}}class sm extends oe{constructor(t){super(),this.type="Audio",this.listener=t,this.context=t.context,this.gain=this.context.createGain(),this.gain.connect(t.getInput()),this.autoplay=!1,this.buffer=null,this.detune=0,this.loop=!1,this.loopStart=0,this.loopEnd=0,this.offset=0,this.duration=void 0,this.playbackRate=1,this.isPlaying=!1,this.hasPlaybackControl=!0,this.source=null,this.sourceType="empty",this._startedAt=0,this._progress=0,this._connected=!1,this.filters=[]}getOutput(){return this.gain}setNodeSource(t){return this.hasPlaybackControl=!1,this.sourceType="audioNode",this.source=t,this.connect(),this}setMediaElementSource(t){return this.hasPlaybackControl=!1,this.sourceType="mediaNode",this.source=this.context.createMediaElementSource(t),this.connect(),this}setMediaStreamSource(t){return this.hasPlaybackControl=!1,this.sourceType="mediaStreamNode",this.source=this.context.createMediaStreamSource(t),this.connect(),this}setBuffer(t){return this.buffer=t,this.sourceType="buffer",this.autoplay&&this.play(),this}play(t=0){if(this.isPlaying===!0){ut("Audio: Audio is already playing.");return}if(this.hasPlaybackControl===!1){ut("Audio: this Audio has no playback control.");return}this._startedAt=this.context.currentTime+t;const e=this.context.createBufferSource();return e.buffer=this.buffer,e.loop=this.loop,e.loopStart=this.loopStart,e.loopEnd=this.loopEnd,e.onended=this.onEnded.bind(this),e.start(this._startedAt,this._progress+this.offset,this.duration),this.isPlaying=!0,this.source=e,this.setDetune(this.detune),this.setPlaybackRate(this.playbackRate),this.connect()}pause(){if(this.hasPlaybackControl===!1){ut("Audio: this Audio has no playback control.");return}return this.isPlaying===!0&&(this._progress+=Math.max(this.context.currentTime-this._startedAt,0)*this.playbackRate,this.loop===!0&&(this._progress=this._progress%(this.duration||this.buffer.duration)),this.source.stop(),this.source.onended=null,this.isPlaying=!1),this}stop(t=0){if(this.hasPlaybackControl===!1){ut("Audio: this Audio has no playback control.");return}return this._progress=0,this.source!==null&&(this.source.stop(this.context.currentTime+t),this.source.onended=null),this.isPlaying=!1,this}connect(){if(this.filters.length>0){this.source.connect(this.filters[0]);for(let t=1,e=this.filters.length;t<e;t++)this.filters[t-1].connect(this.filters[t]);this.filters[this.filters.length-1].connect(this.getOutput())}else this.source.connect(this.getOutput());return this._connected=!0,this}disconnect(){if(this._connected!==!1){if(this.filters.length>0){this.source.disconnect(this.filters[0]);for(let t=1,e=this.filters.length;t<e;t++)this.filters[t-1].disconnect(this.filters[t]);this.filters[this.filters.length-1].disconnect(this.getOutput())}else this.source.disconnect(this.getOutput());return this._connected=!1,this}}getFilters(){return this.filters}setFilters(t){return t||(t=[]),this._connected===!0?(this.disconnect(),this.filters=t.slice(),this.connect()):this.filters=t.slice(),this}setDetune(t){return this.detune=t,this.isPlaying===!0&&this.source.detune!==void 0&&this.source.detune.setTargetAtTime(this.detune,this.context.currentTime,.01),this}getDetune(){return this.detune}getFilter(){return this.getFilters()[0]}setFilter(t){return this.setFilters(t?[t]:[])}setPlaybackRate(t){if(this.hasPlaybackControl===!1){ut("Audio: this Audio has no playback control.");return}return this.playbackRate=t,this.isPlaying===!0&&this.source.playbackRate.setTargetAtTime(this.playbackRate,this.context.currentTime,.01),this}getPlaybackRate(){return this.playbackRate}onEnded(){this.isPlaying=!1,this._progress=0}getLoop(){return this.hasPlaybackControl===!1?(ut("Audio: this Audio has no playback control."),!1):this.loop}setLoop(t){if(this.hasPlaybackControl===!1){ut("Audio: this Audio has no playback control.");return}return this.loop=t,this.isPlaying===!0&&(this.source.loop=this.loop),this}setLoopStart(t){return this.loopStart=t,this}setLoopEnd(t){return this.loopEnd=t,this}getVolume(){return this.gain.gain.value}setVolume(t){return this.gain.gain.setTargetAtTime(t,this.context.currentTime,.01),this}copy(t,e){return super.copy(t,e),t.sourceType!=="buffer"?(ut("Audio: Audio source type cannot be copied."),this):(this.autoplay=t.autoplay,this.buffer=t.buffer,this.detune=t.detune,this.loop=t.loop,this.loopStart=t.loopStart,this.loopEnd=t.loopEnd,this.offset=t.offset,this.duration=t.duration,this.playbackRate=t.playbackRate,this.hasPlaybackControl=t.hasPlaybackControl,this.sourceType=t.sourceType,this.filters=t.filters.slice(),this)}clone(t){return new this.constructor(this.listener).copy(this,t)}}const os=new C,Fd=new Xe,H_=new C,ls=new C;class W_ extends sm{constructor(t){super(t),this.panner=this.context.createPanner(),this.panner.panningModel="HRTF",this.panner.connect(this.gain)}connect(){return super.connect(),this.panner.connect(this.gain),this}disconnect(){return super.disconnect(),this.panner.disconnect(this.gain),this}getOutput(){return this.panner}getRefDistance(){return this.panner.refDistance}setRefDistance(t){return this.panner.refDistance=t,this}getRolloffFactor(){return this.panner.rolloffFactor}setRolloffFactor(t){return this.panner.rolloffFactor=t,this}getDistanceModel(){return this.panner.distanceModel}setDistanceModel(t){return this.panner.distanceModel=t,this}getMaxDistance(){return this.panner.maxDistance}setMaxDistance(t){return this.panner.maxDistance=t,this}setDirectionalCone(t,e,n){return this.panner.coneInnerAngle=t,this.panner.coneOuterAngle=e,this.panner.coneOuterGain=n,this}updateMatrixWorld(t){if(super.updateMatrixWorld(t),this.hasPlaybackControl===!0&&this.isPlaying===!1)return;this.matrixWorld.decompose(os,Fd,H_),ls.set(0,0,1).applyQuaternion(Fd);const e=this.panner;if(e.positionX){const n=this.context.currentTime+this.listener.timeDelta;e.positionX.linearRampToValueAtTime(os.x,n),e.positionY.linearRampToValueAtTime(os.y,n),e.positionZ.linearRampToValueAtTime(os.z,n),e.orientationX.linearRampToValueAtTime(ls.x,n),e.orientationY.linearRampToValueAtTime(ls.y,n),e.orientationZ.linearRampToValueAtTime(ls.z,n)}else e.setPosition(os.x,os.y,os.z),e.setOrientation(ls.x,ls.y,ls.z)}}class X_{constructor(t,e=2048){this.analyser=t.context.createAnalyser(),this.analyser.fftSize=e,this.data=new Uint8Array(this.analyser.frequencyBinCount),t.getOutput().connect(this.analyser)}getFrequencyData(){return this.analyser.getByteFrequencyData(this.data),this.data}getAverageFrequency(){let t=0;const e=this.getFrequencyData();for(let n=0;n<e.length;n++)t+=e[n];return t/e.length}}class rm{constructor(t,e,n){this.binding=t,this.valueSize=n;let i,r,a;switch(e){case"quaternion":i=this._slerp,r=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,r=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,r=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=r,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(t,e){const n=this.buffer,i=this.valueSize,r=t*i+i;let a=this.cumulativeWeight;if(a===0){for(let o=0;o!==i;++o)n[r+o]=n[o];a=e}else{a+=e;const o=e/a;this._mixBufferRegion(n,r,0,o,i)}this.cumulativeWeight=a}accumulateAdditive(t){const e=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(e,i,0,t,n),this.cumulativeWeightAdditive+=t}apply(t){const e=this.valueSize,n=this.buffer,i=t*e+e,r=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){const l=e*this._origIndex;this._mixBufferRegion(n,i,l,1-r,e)}a>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*e,1,e);for(let l=e,c=e+e;l!==c;++l)if(n[l]!==n[l+e]){o.setValue(n,i);break}}saveOriginalState(){const t=this.binding,e=this.buffer,n=this.valueSize,i=n*this._origIndex;t.getValue(e,i);for(let r=n,a=i;r!==a;++r)e[r]=e[i+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const t=this.valueSize*3;this.binding.setValue(this.buffer,t)}_setAdditiveIdentityNumeric(){const t=this._addIndex*this.valueSize,e=t+this.valueSize;for(let n=t;n<e;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const t=this._origIndex*this.valueSize,e=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[e+n]=this.buffer[t+n]}_select(t,e,n,i,r){if(i>=.5)for(let a=0;a!==r;++a)t[e+a]=t[n+a]}_slerp(t,e,n,i){Xe.slerpFlat(t,e,t,e,t,n,i)}_slerpAdditive(t,e,n,i,r){const a=this._workIndex*r;Xe.multiplyQuaternionsFlat(t,a,t,e,t,n),Xe.slerpFlat(t,e,t,e,t,a,i)}_lerp(t,e,n,i,r){const a=1-i;for(let o=0;o!==r;++o){const l=e+o;t[l]=t[l]*a+t[n+o]*i}}_lerpAdditive(t,e,n,i,r){for(let a=0;a!==r;++a){const o=e+a;t[o]=t[o]+t[n+a]*i}}}const mu="\\[\\]\\.:\\/",Y_=new RegExp("["+mu+"]","g"),gu="[^"+mu+"]",q_="[^"+mu.replace("\\.","")+"]",$_=/((?:WC+[\/:])*)/.source.replace("WC",gu),Z_=/(WCOD+)?/.source.replace("WCOD",q_),J_=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",gu),K_=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",gu),j_=new RegExp("^"+$_+Z_+J_+K_+"$"),Q_=["material","materials","bones","map"];class tx{constructor(t,e,n){const i=n||ce.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,i)}getValue(t,e){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(t,e)}setValue(t,e){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(t,e)}bind(){const t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){const t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}}class ce{constructor(t,e,n){this.path=e,this.parsedPath=n||ce.parseTrackName(e),this.node=ce.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new ce.Composite(t,e,n):new ce(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Y_,"")}static parseTrackName(t){const e=j_.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);const n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const r=n.nodeName.substring(i+1);Q_.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){const n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){const n=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===e||o.uuid===e)return o;const l=n(o.children);if(l)return l}return null},i=n(t.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)t[e++]=n[i]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++]}_setValue_array_setNeedsUpdate(t,e){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node;const e=this.parsedPath,n=e.objectName,i=e.propertyName;let r=e.propertyIndex;if(t||(t=ce.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){ut("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){It("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){It("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){It("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){It("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){It("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){It("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){It("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}const a=t[i];if(a===void 0){const c=e.nodeName;It("PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!t.geometry){It("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){It("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}ce.Composite=tx;ce.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ce.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ce.prototype.GetterByBindingType=[ce.prototype._getValue_direct,ce.prototype._getValue_array,ce.prototype._getValue_arrayElement,ce.prototype._getValue_toArray];ce.prototype.SetterByBindingTypeAndVersioning=[[ce.prototype._setValue_direct,ce.prototype._setValue_direct_setNeedsUpdate,ce.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ce.prototype._setValue_array,ce.prototype._setValue_array_setNeedsUpdate,ce.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ce.prototype._setValue_arrayElement,ce.prototype._setValue_arrayElement_setNeedsUpdate,ce.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ce.prototype._setValue_fromArray,ce.prototype._setValue_fromArray_setNeedsUpdate,ce.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class ex{constructor(){this.isAnimationObjectGroup=!0,this.uuid=Tn(),this._objects=Array.prototype.slice.call(arguments),this.nCachedObjects_=0;const t={};this._indicesByUUID=t;for(let n=0,i=arguments.length;n!==i;++n)t[arguments[n].uuid]=n;this._paths=[],this._parsedPaths=[],this._bindings=[],this._bindingsIndicesByPath={};const e=this;this.stats={objects:{get total(){return e._objects.length},get inUse(){return this.total-e.nCachedObjects_}},get bindingsPerObject(){return e._bindings.length}}}add(){const t=this._objects,e=this._indicesByUUID,n=this._paths,i=this._parsedPaths,r=this._bindings,a=r.length;let o,l=t.length,c=this.nCachedObjects_;for(let h=0,d=arguments.length;h!==d;++h){const u=arguments[h],f=u.uuid;let p=e[f];if(p===void 0){p=l++,e[f]=p,t.push(u);for(let _=0,m=a;_!==m;++_)r[_].push(new ce(u,n[_],i[_]))}else if(p<c){o=t[p];const _=--c,m=t[_];e[m.uuid]=p,t[p]=m,e[f]=_,t[_]=u;for(let g=0,v=a;g!==v;++g){const b=r[g],y=b[_];let T=b[p];b[p]=y,T===void 0&&(T=new ce(u,n[g],i[g])),b[_]=T}}else t[p]!==o&&It("AnimationObjectGroup: Different objects with the same UUID detected. Clean the caches or recreate your infrastructure when reloading scenes.")}this.nCachedObjects_=c}remove(){const t=this._objects,e=this._indicesByUUID,n=this._bindings,i=n.length;let r=this.nCachedObjects_;for(let a=0,o=arguments.length;a!==o;++a){const l=arguments[a],c=l.uuid,h=e[c];if(h!==void 0&&h>=r){const d=r++,u=t[d];e[u.uuid]=h,t[h]=u,e[c]=d,t[d]=l;for(let f=0,p=i;f!==p;++f){const _=n[f],m=_[d],g=_[h];_[h]=m,_[d]=g}}}this.nCachedObjects_=r}uncache(){const t=this._objects,e=this._indicesByUUID,n=this._bindings,i=n.length;let r=this.nCachedObjects_,a=t.length;for(let o=0,l=arguments.length;o!==l;++o){const c=arguments[o],h=c.uuid,d=e[h];if(d!==void 0)if(delete e[h],d<r){const u=--r,f=t[u],p=--a,_=t[p];e[f.uuid]=d,t[d]=f,e[_.uuid]=u,t[u]=_,t.pop();for(let m=0,g=i;m!==g;++m){const v=n[m],b=v[u],y=v[p];v[d]=b,v[u]=y,v.pop()}}else{const u=--a,f=t[u];u>0&&(e[f.uuid]=d),t[d]=f,t.pop();for(let p=0,_=i;p!==_;++p){const m=n[p];m[d]=m[u],m.pop()}}}this.nCachedObjects_=r}subscribe_(t,e){const n=this._bindingsIndicesByPath;let i=n[t];const r=this._bindings;if(i!==void 0)return r[i];const a=this._paths,o=this._parsedPaths,l=this._objects,c=l.length,h=this.nCachedObjects_,d=new Array(c);i=r.length,n[t]=i,a.push(t),o.push(e),r.push(d);for(let u=h,f=l.length;u!==f;++u){const p=l[u];d[u]=new ce(p,t,e)}return d}unsubscribe_(t){const e=this._bindingsIndicesByPath,n=e[t];if(n!==void 0){const i=this._paths,r=this._parsedPaths,a=this._bindings,o=a.length-1,l=a[o],c=t[o];e[c]=n,a[n]=l,a.pop(),r[n]=r[o],r.pop(),i[n]=i[o],i.pop()}}}class am{constructor(t,e,n=null,i=e.blendMode){this._mixer=t,this._clip=e,this._localRoot=n,this.blendMode=i;const r=e.tracks,a=r.length,o=new Array(a),l={endingStart:ds,endingEnd:ds};for(let c=0;c!==a;++c){const h=r[c].createInterpolant(null);o[c]=h,h.settings=l}this._interpolantSettings=l,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=tp,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(t){return this._startTime=t,this}setLoop(t,e){return this.loop=t,this.repetitions=e,this}setEffectiveWeight(t){return this.weight=t,this._effectiveWeight=this.enabled?t:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(t){return this._scheduleFading(t,0,1)}fadeOut(t){return this._scheduleFading(t,1,0)}crossFadeFrom(t,e,n=!1){if(t.fadeOut(e),this.fadeIn(e),n===!0){const i=this._clip.duration,r=t._clip.duration,a=r/i,o=i/r;t._restoreTimeScale=t.timeScale,this._restoreTimeScale=this.timeScale,t.warp(1,a,e),this.warp(o,1,e)}return this}crossFadeTo(t,e,n=!1){return t.crossFadeFrom(this,e,n)}stopFading(){const t=this._weightInterpolant;return t!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(t)),this}setEffectiveTimeScale(t){return this.timeScale=t,this._effectiveTimeScale=this.paused?0:t,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(t){return this.timeScale=this._clip.duration/t,this.stopWarping()}syncWith(t){return this.time=t.time,this.timeScale=t.timeScale,this.stopWarping()}halt(t){return this.warp(this._effectiveTimeScale,0,t)}warp(t,e,n){const i=this._mixer,r=i.time,a=this.timeScale;let o=this._timeScaleInterpolant;o===null&&(o=i._lendControlInterpolant(),this._timeScaleInterpolant=o);const l=o.parameterPositions,c=o.sampleValues;return l[0]=r,l[1]=r+n,c[0]=t/a,c[1]=e/a,this}stopWarping(){const t=this._timeScaleInterpolant;return t!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(t)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(t,e,n,i){if(!this.enabled){this._updateWeight(t);return}const r=this._startTime;if(r!==null){const l=(t-r)*n;l<0||n===0?e=0:(this._startTime=null,e=n*l)}e*=this._updateTimeScale(t);const a=this._updateTime(e),o=this._updateWeight(t);if(o>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case kh:for(let h=0,d=l.length;h!==d;++h)l[h].evaluate(a),c[h].accumulateAdditive(o);break;case El:default:for(let h=0,d=l.length;h!==d;++h)l[h].evaluate(a),c[h].accumulate(i,o)}}}_updateWeight(t){let e=0;if(this.enabled){e=this.weight;const n=this._weightInterpolant;if(n!==null){const i=n.evaluate(t)[0];e*=i,t>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=e,e}_updateTimeScale(t){let e=0;if(!this.paused){e=this.timeScale;const n=this._timeScaleInterpolant;if(n!==null){const i=n.evaluate(t)[0];e*=i,t>n.parameterPositions[1]&&(e===0?this.paused=!0:(this._restoreTimeScale!==null&&(e=this._restoreTimeScale),this.timeScale=e),this.stopWarping())}}return this._effectiveTimeScale=e,e}_updateTime(t){const e=this._clip.duration,n=this.loop;let i=this.time+t,r=this._loopCount;const a=n===ep;if(t===0)return r===-1?i:a&&(r&1)===1?e-i:i;if(n===Qf){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));t:{if(i>=e)i=e;else if(i<0)i=0;else{this.time=i;break t}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:t<0?-1:1})}}else{if(r===-1&&(t>=0?(r=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),i>=e||i<0){const o=Math.floor(i/e);i-=e*o,r+=Math.abs(o);const l=this.repetitions-r;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=t>0?e:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:t>0?1:-1});else{if(l===1){const c=t<0;this._setEndings(c,!c,a)}else this._setEndings(!1,!1,a);this._loopCount=r,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this._loopCount=r,this.time=i;if(a&&(r&1)===1)return e-i}return i}_setEndings(t,e,n){const i=this._interpolantSettings;n?(i.endingStart=fs,i.endingEnd=fs):(t?i.endingStart=this.zeroSlopeAtStart?fs:ds:i.endingStart=ia,e?i.endingEnd=this.zeroSlopeAtEnd?fs:ds:i.endingEnd=ia)}_scheduleFading(t,e,n){const i=this._mixer,r=i.time;let a=this._weightInterpolant;a===null&&(a=i._lendControlInterpolant(),this._weightInterpolant=a);const o=a.parameterPositions,l=a.sampleValues;return o[0]=r,l[0]=e,o[1]=r+t,l[1]=n,this}}const nx=new Float32Array(1);class ix extends qn{constructor(t){super(),this._root=t,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(t,e){const n=t._localRoot||this._root,i=t._clip.tracks,r=i.length,a=t._propertyBindings,o=t._interpolants,l=n.uuid,c=this._bindingsByRootAndName;let h=c[l];h===void 0&&(h={},c[l]=h);for(let d=0;d!==r;++d){const u=i[d],f=u.name;let p=h[f];if(p!==void 0)++p.referenceCount,a[d]=p;else{if(p=a[d],p!==void 0){p._cacheIndex===null&&(++p.referenceCount,this._addInactiveBinding(p,l,f));continue}const _=e&&e._propertyBindings[d].binding.parsedPath;p=new rm(ce.create(n,f,_),u.ValueTypeName,u.getValueSize()),++p.referenceCount,this._addInactiveBinding(p,l,f),a[d]=p}o[d].resultBuffer=p.buffer}}_activateAction(t){if(!this._isActiveAction(t)){if(t._cacheIndex===null){const n=(t._localRoot||this._root).uuid,i=t._clip.uuid,r=this._actionsByClip[i];this._bindAction(t,r&&r.knownActions[0]),this._addInactiveAction(t,i,n)}const e=t._propertyBindings;for(let n=0,i=e.length;n!==i;++n){const r=e[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(t)}}_deactivateAction(t){if(this._isActiveAction(t)){const e=t._propertyBindings;for(let n=0,i=e.length;n!==i;++n){const r=e[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(t)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const t=this;this.stats={actions:{get total(){return t._actions.length},get inUse(){return t._nActiveActions}},bindings:{get total(){return t._bindings.length},get inUse(){return t._nActiveBindings}},controlInterpolants:{get total(){return t._controlInterpolants.length},get inUse(){return t._nActiveControlInterpolants}}}}_isActiveAction(t){const e=t._cacheIndex;return e!==null&&e<this._nActiveActions}_addInactiveAction(t,e,n){const i=this._actions,r=this._actionsByClip;let a=r[e];if(a===void 0)a={knownActions:[t],actionByRoot:{}},t._byClipCacheIndex=0,r[e]=a;else{const o=a.knownActions;t._byClipCacheIndex=o.length,o.push(t)}t._cacheIndex=i.length,i.push(t),a.actionByRoot[n]=t}_removeInactiveAction(t){const e=this._actions,n=e[e.length-1],i=t._cacheIndex;n._cacheIndex=i,e[i]=n,e.pop(),t._cacheIndex=null;const r=t._clip.uuid,a=this._actionsByClip,o=a[r],l=o.knownActions,c=l[l.length-1],h=t._byClipCacheIndex;c._byClipCacheIndex=h,l[h]=c,l.pop(),t._byClipCacheIndex=null;const d=o.actionByRoot,u=(t._localRoot||this._root).uuid;delete d[u],l.length===0&&delete a[r],this._removeInactiveBindingsForAction(t)}_removeInactiveBindingsForAction(t){const e=t._propertyBindings;for(let n=0,i=e.length;n!==i;++n){const r=e[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(t){const e=this._actions,n=t._cacheIndex,i=this._nActiveActions++,r=e[i];t._cacheIndex=i,e[i]=t,r._cacheIndex=n,e[n]=r}_takeBackAction(t){const e=this._actions,n=t._cacheIndex,i=--this._nActiveActions,r=e[i];t._cacheIndex=i,e[i]=t,r._cacheIndex=n,e[n]=r}_addInactiveBinding(t,e,n){const i=this._bindingsByRootAndName,r=this._bindings;let a=i[e];a===void 0&&(a={},i[e]=a),a[n]=t,t._cacheIndex=r.length,r.push(t)}_removeInactiveBinding(t){const e=this._bindings,n=t.binding,i=n.rootNode.uuid,r=n.path,a=this._bindingsByRootAndName,o=a[i],l=e[e.length-1],c=t._cacheIndex;l._cacheIndex=c,e[c]=l,e.pop(),delete o[r],Object.keys(o).length===0&&delete a[i]}_lendBinding(t){const e=this._bindings,n=t._cacheIndex,i=this._nActiveBindings++,r=e[i];t._cacheIndex=i,e[i]=t,r._cacheIndex=n,e[n]=r}_takeBackBinding(t){const e=this._bindings,n=t._cacheIndex,i=--this._nActiveBindings,r=e[i];t._cacheIndex=i,e[i]=t,r._cacheIndex=n,e[n]=r}_lendControlInterpolant(){const t=this._controlInterpolants,e=this._nActiveControlInterpolants++;let n=t[e];return n===void 0&&(n=new ru(new Float32Array(2),new Float32Array(2),1,nx),n.__cacheIndex=e,t[e]=n),n}_takeBackControlInterpolant(t){const e=this._controlInterpolants,n=t.__cacheIndex,i=--this._nActiveControlInterpolants,r=e[i];t.__cacheIndex=i,e[i]=t,r.__cacheIndex=n,e[n]=r}clipAction(t,e,n){const i=e||this._root,r=i.uuid;let a=typeof t=="string"?fa.findByName(i,t):t;const o=a!==null?a.uuid:t,l=this._actionsByClip[o];let c=null;if(n===void 0&&(a!==null?n=a.blendMode:n=El),l!==void 0){const d=l.actionByRoot[r];if(d!==void 0&&d.blendMode===n)return d;c=l.knownActions[0],a===null&&(a=c._clip)}if(a===null)return null;const h=new am(this,a,e,n);return this._bindAction(h,c),this._addInactiveAction(h,o,r),h}existingAction(t,e){const n=e||this._root,i=n.uuid,r=typeof t=="string"?fa.findByName(n,t):t,a=r?r.uuid:t,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[i]||null}stopAllAction(){const t=this._actions,e=this._nActiveActions;for(let n=e-1;n>=0;--n)t[n].stop();return this}update(t){t*=this.timeScale;const e=this._actions,n=this._nActiveActions,i=this.time+=t,r=Math.sign(t),a=this._accuIndex^=1;for(let c=0;c!==n;++c)e[c]._update(i,t,r,a);const o=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)o[c].apply(a);return this}setTime(t){this.time=0;for(let e=0;e<this._actions.length;e++)this._actions[e].time=0;return this.update(t)}getRoot(){return this._root}uncacheClip(t){const e=this._actions,n=t.uuid,i=this._actionsByClip,r=i[n];if(r!==void 0){const a=r.knownActions;for(let o=0,l=a.length;o!==l;++o){const c=a[o];this._deactivateAction(c);const h=c._cacheIndex,d=e[e.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,d._cacheIndex=h,e[h]=d,e.pop(),this._removeInactiveBindingsForAction(c)}delete i[n]}}uncacheRoot(t){const e=t.uuid,n=this._actionsByClip;for(const a in n){const o=n[a].actionByRoot,l=o[e];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}const i=this._bindingsByRootAndName,r=i[e];if(r!==void 0)for(const a in r){const o=r[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(t,e){const n=this.existingAction(t,e);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}}class sx extends Vh{constructor(t=1,e=1,n=1,i={}){super(t,e,i),this.isRenderTarget3D=!0,this.depth=n,this.texture=new Pl(null,t,e,n),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}}class _u{constructor(t){this.value=t}clone(){return new _u(this.value.clone===void 0?this.value:this.value.clone())}}let rx=0;class ax extends qn{constructor(){super(),this.isUniformsGroup=!0,Object.defineProperty(this,"id",{value:rx++}),this.name="",this.usage=aa,this.uniforms=[]}add(t){return this.uniforms.push(t),this}remove(t){const e=this.uniforms.indexOf(t);return e!==-1&&this.uniforms.splice(e,1),this}setName(t){return this.name=t,this}setUsage(t){return this.usage=t,this}dispose(){this.dispatchEvent({type:"dispose"})}copy(t){this.name=t.name,this.usage=t.usage;const e=t.uniforms;this.uniforms.length=0;for(let n=0,i=e.length;n<i;n++){const r=Array.isArray(e[n])?e[n]:[e[n]];for(let a=0;a<r.length;a++)this.uniforms.push(r[a].clone())}return this}clone(){return new this.constructor().copy(this)}}class ox extends Dl{constructor(t,e,n=1){super(t,e),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}clone(t){const e=super.clone(t);return e.meshPerAttribute=this.meshPerAttribute,e}toJSON(t){const e=super.toJSON(t);return e.isInstancedInterleavedBuffer=!0,e.meshPerAttribute=this.meshPerAttribute,e}}class lx{constructor(t,e,n,i,r,a=!1){this.isGLBufferAttribute=!0,this.name="",this.buffer=t,this.type=e,this.itemSize=n,this.elementSize=i,this.count=r,this.normalized=a,this.version=0}set needsUpdate(t){t===!0&&this.version++}setBuffer(t){return this.buffer=t,this}setType(t,e){return this.type=t,this.elementSize=e,this}setItemSize(t){return this.itemSize=t,this}setCount(t){return this.count=t,this}}const Bd=new Xt;class cx{constructor(t,e,n=0,i=1/0){this.ray=new Cs(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new Il,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):It("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Bd.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Bd),this}intersectObject(t,e=!0,n=[]){return fh(t,this,n,e),n.sort(kd),n}intersectObjects(t,e=!0,n=[]){for(let i=0,r=t.length;i<r;i++)fh(t[i],this,n,e);return n.sort(kd),n}}function kd(s,t){return s.distance-t.distance}function fh(s,t,e,n){let i=!0;if(s.layers.test(t.layers)&&s.raycast(t,e)===!1&&(i=!1),i===!0&&n===!0){const r=s.children;for(let a=0,o=r.length;a<o;a++)fh(r[a],t,e,!0)}}class hx{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,ut("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}class ph{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Wt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Wt(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class ux{constructor(t=1,e=0,n=0){this.radius=t,this.theta=e,this.y=n}set(t,e,n){return this.radius=t,this.theta=e,this.y=n,this}copy(t){return this.radius=t.radius,this.theta=t.theta,this.y=t.y,this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+n*n),this.theta=Math.atan2(t,n),this.y=e,this}clone(){return new this.constructor().copy(this)}}const Cu=class Cu{constructor(t,e,n,i){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,i){const r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=i,this}};Cu.prototype.isMatrix2=!0;let mh=Cu;const zd=new J;class om{constructor(t=new J(1/0,1/0),e=new J(-1/0,-1/0)){this.isBox2=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=zd.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(t){return this.isEmpty()?t.set(0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,zd).distanceTo(t)}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Vd=new C,ho=new C,js=new C,Qs=new C,Vc=new C,dx=new C,fx=new C;class px{constructor(t=new C,e=new C){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){Vd.subVectors(t,this.start),ho.subVectors(this.end,this.start);const n=ho.dot(ho);if(n===0)return 0;let r=ho.dot(Vd)/n;return e&&(r=Wt(r,0,1)),r}closestPointToPoint(t,e,n){const i=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(i).add(this.start)}distanceSqToLine3(t,e=dx,n=fx){const i=10000000000000001e-32;let r,a;const o=this.start,l=t.start,c=this.end,h=t.end;js.subVectors(c,o),Qs.subVectors(h,l),Vc.subVectors(o,l);const d=js.dot(js),u=Qs.dot(Qs),f=Qs.dot(Vc);if(d<=i&&u<=i)return e.copy(o),n.copy(l),e.sub(n),e.dot(e);if(d<=i)r=0,a=f/u,a=Wt(a,0,1);else{const p=js.dot(Vc);if(u<=i)a=0,r=Wt(-p/d,0,1);else{const _=js.dot(Qs),m=d*u-_*_;m!==0?r=Wt((_*f-p*u)/m,0,1):r=0,a=(_*r+f)/u,a<0?(a=0,r=Wt(-p/d,0,1)):a>1&&(a=1,r=Wt((_-p)/d,0,1))}}return e.copy(o).addScaledVector(js,r),n.copy(l).addScaledVector(Qs,a),e.distanceToSquared(n)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}const Gd=new C;class mx extends oe{constructor(t,e){super(),this.light=t,this.matrixAutoUpdate=!1,this.color=e,this.type="SpotLightHelper";const n=new Jt,i=[0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,-1,0,1,0,0,0,0,1,1,0,0,0,0,-1,1];for(let a=0,o=1,l=32;a<l;a++,o++){const c=a/l*Math.PI*2,h=o/l*Math.PI*2;i.push(Math.cos(c),Math.sin(c),1,Math.cos(h),Math.sin(h),1)}n.setAttribute("position",new At(i,3));const r=new un({fog:!1,toneMapped:!1});this.cone=new ci(n,r),this.add(this.cone),this.update()}dispose(){this.cone.geometry.dispose(),this.cone.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),this.parent?(this.parent.updateWorldMatrix(!0),this.matrix.copy(this.parent.matrixWorld).invert().multiply(this.light.matrixWorld)):this.matrix.copy(this.light.matrixWorld),this.matrixWorldNeedsUpdate=!0;const t=this.light.distance?this.light.distance:1e3,e=t*Math.tan(this.light.angle);this.cone.scale.set(e,e,t),Gd.setFromMatrixPosition(this.light.target.matrixWorld),this.cone.lookAt(Gd),this.color!==void 0?this.cone.material.color.set(this.color):this.cone.material.color.copy(this.light.color)}}const Ui=new C,uo=new Xt,Gc=new Xt;class gx extends ci{constructor(t){const e=lm(t),n=new Jt,i=[],r=[];for(let c=0;c<e.length;c++){const h=e[c];h.parent&&h.parent.isBone&&(i.push(0,0,0),i.push(0,0,0),r.push(0,0,0),r.push(0,0,0))}n.setAttribute("position",new At(i,3)),n.setAttribute("color",new At(r,3));const a=new un({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(n,a),this.isSkeletonHelper=!0,this.type="SkeletonHelper",this.root=t,this.bones=e,this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1;const o=new St(255),l=new St(65280);this.setColors(o,l)}updateMatrixWorld(t){const e=this.bones,n=this.geometry,i=n.getAttribute("position");Gc.copy(this.root.matrixWorld).invert();for(let r=0,a=0;r<e.length;r++){const o=e[r];o.parent&&o.parent.isBone&&(uo.multiplyMatrices(Gc,o.matrixWorld),Ui.setFromMatrixPosition(uo),i.setXYZ(a,Ui.x,Ui.y,Ui.z),uo.multiplyMatrices(Gc,o.parent.matrixWorld),Ui.setFromMatrixPosition(uo),i.setXYZ(a+1,Ui.x,Ui.y,Ui.z),a+=2)}n.getAttribute("position").needsUpdate=!0,super.updateMatrixWorld(t)}setColors(t,e){const i=this.geometry.getAttribute("color");for(let r=0;r<i.count;r+=2)i.setXYZ(r,t.r,t.g,t.b),i.setXYZ(r+1,e.r,e.g,e.b);return i.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}function lm(s){const t=[];s.isBone===!0&&t.push(s);for(let e=0;e<s.children.length;e++)t.push(...lm(s.children[e]));return t}class _x extends Gt{constructor(t,e,n){const i=new xn(e,4,2),r=new He({wireframe:!0,fog:!1,toneMapped:!1});super(i,r),this.light=t,this.color=n,this.type="PointLightHelper",this.matrix=this.light.matrixWorld,this.matrixAutoUpdate=!1,this.update()}dispose(){this.geometry.dispose(),this.material.dispose()}update(){this.matrixWorldNeedsUpdate=!0,this.light.updateWorldMatrix(!0,!1),this.color!==void 0?this.material.color.set(this.color):this.material.color.copy(this.light.color)}}const xx=new C,Hd=new St,Wd=new St;class yx extends oe{constructor(t,e,n){super(),this.light=t,this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,this.type="HemisphereLightHelper";const i=new Ma(e);i.rotateY(Math.PI*.5),this.material=new He({wireframe:!0,fog:!1,toneMapped:!1}),this.color===void 0&&(this.material.vertexColors=!0);const r=i.getAttribute("position"),a=new Float32Array(r.count*3);i.setAttribute("color",new xe(a,3)),this.add(new Gt(i,this.material)),this.update()}dispose(){this.children[0].geometry.dispose(),this.children[0].material.dispose()}update(){const t=this.children[0];if(this.color!==void 0)this.material.color.set(this.color);else{const e=t.geometry.getAttribute("color");Hd.copy(this.light.color),Wd.copy(this.light.groundColor);for(let n=0,i=e.count;n<i;n++){const r=n<i/2?Hd:Wd;e.setXYZ(n,r.r,r.g,r.b)}e.needsUpdate=!0}this.matrixWorldNeedsUpdate=!0,this.light.updateWorldMatrix(!0,!1),t.lookAt(xx.setFromMatrixPosition(this.light.matrixWorld).negate())}}class vx extends ci{constructor(t=10,e=10,n=4473924,i=8947848){n=new St(n),i=new St(i);const r=e/2,a=t/e,o=t/2,l=[],c=[];for(let u=0,f=0,p=-o;u<=e;u++,p+=a){l.push(-o,0,p,o,0,p),l.push(p,0,-o,p,0,o);const _=u===r?n:i;_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3}const h=new Jt;h.setAttribute("position",new At(l,3)),h.setAttribute("color",new At(c,3));const d=new un({vertexColors:!0,toneMapped:!1});super(h,d),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class Mx extends ci{constructor(t=10,e=16,n=8,i=64,r=4473924,a=8947848){r=new St(r),a=new St(a);const o=[],l=[];if(e>1)for(let d=0;d<e;d++){const u=d/e*(Math.PI*2),f=Math.sin(u)*t,p=Math.cos(u)*t;o.push(0,0,0),o.push(f,0,p);const _=d&1?r:a;l.push(_.r,_.g,_.b),l.push(_.r,_.g,_.b)}for(let d=0;d<n;d++){const u=d&1?r:a,f=t-t/n*d;for(let p=0;p<i;p++){let _=p/i*(Math.PI*2),m=Math.sin(_)*f,g=Math.cos(_)*f;o.push(m,0,g),l.push(u.r,u.g,u.b),_=(p+1)/i*(Math.PI*2),m=Math.sin(_)*f,g=Math.cos(_)*f,o.push(m,0,g),l.push(u.r,u.g,u.b)}}const c=new Jt;c.setAttribute("position",new At(o,3)),c.setAttribute("color",new At(l,3));const h=new un({vertexColors:!0,toneMapped:!1});super(c,h),this.type="PolarGridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}const Xd=new C,fo=new C,Yd=new C;class bx extends oe{constructor(t,e,n){super(),this.light=t,this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,this.type="DirectionalLightHelper",e===void 0&&(e=1);let i=new Jt;i.setAttribute("position",new At([-e,e,0,e,e,0,e,-e,0,-e,-e,0,-e,e,0],3));const r=new un({fog:!1,toneMapped:!1});this.lightPlane=new Yi(i,r),this.add(this.lightPlane),i=new Jt,i.setAttribute("position",new At([0,0,0,0,0,1],3)),this.targetLine=new Yi(i,r),this.add(this.targetLine),this.update()}dispose(){this.lightPlane.geometry.dispose(),this.lightPlane.material.dispose(),this.targetLine.geometry.dispose(),this.targetLine.material.dispose()}update(){this.matrixWorldNeedsUpdate=!0,this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),Xd.setFromMatrixPosition(this.light.matrixWorld),fo.setFromMatrixPosition(this.light.target.matrixWorld),Yd.subVectors(fo,Xd),this.lightPlane.lookAt(fo),this.color!==void 0?(this.lightPlane.material.color.set(this.color),this.targetLine.material.color.set(this.color)):(this.lightPlane.material.color.copy(this.light.color),this.targetLine.material.color.copy(this.light.color)),this.targetLine.lookAt(fo),this.targetLine.scale.z=Yd.length()}}const po=new C,Re=new Jl;class Sx extends ci{constructor(t){const e=new Jt,n=new un({color:16777215,vertexColors:!0,toneMapped:!1}),i=[],r=[],a={};o("n1","n2"),o("n2","n4"),o("n4","n3"),o("n3","n1"),o("f1","f2"),o("f2","f4"),o("f4","f3"),o("f3","f1"),o("n1","f1"),o("n2","f2"),o("n3","f3"),o("n4","f4"),o("p","n1"),o("p","n2"),o("p","n3"),o("p","n4"),o("u1","u2"),o("u2","u3"),o("u3","u1"),o("c","t"),o("p","c"),o("cn1","cn2"),o("cn3","cn4"),o("cf1","cf2"),o("cf3","cf4");function o(p,_){l(p),l(_)}function l(p){i.push(0,0,0),r.push(0,0,0),a[p]===void 0&&(a[p]=[]),a[p].push(i.length/3-1)}e.setAttribute("position",new At(i,3)),e.setAttribute("color",new At(r,3)),super(e,n),this.type="CameraHelper",this.camera=t,this.camera.updateProjectionMatrix&&this.camera.updateProjectionMatrix(),this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1,this.pointMap=a,this.update();const c=new St(16755200),h=new St(16711680),d=new St(43775),u=new St(16777215),f=new St(3355443);this.setColors(c,h,d,u,f)}setColors(t,e,n,i,r){const o=this.geometry.getAttribute("color");return o.setXYZ(0,t.r,t.g,t.b),o.setXYZ(1,t.r,t.g,t.b),o.setXYZ(2,t.r,t.g,t.b),o.setXYZ(3,t.r,t.g,t.b),o.setXYZ(4,t.r,t.g,t.b),o.setXYZ(5,t.r,t.g,t.b),o.setXYZ(6,t.r,t.g,t.b),o.setXYZ(7,t.r,t.g,t.b),o.setXYZ(8,t.r,t.g,t.b),o.setXYZ(9,t.r,t.g,t.b),o.setXYZ(10,t.r,t.g,t.b),o.setXYZ(11,t.r,t.g,t.b),o.setXYZ(12,t.r,t.g,t.b),o.setXYZ(13,t.r,t.g,t.b),o.setXYZ(14,t.r,t.g,t.b),o.setXYZ(15,t.r,t.g,t.b),o.setXYZ(16,t.r,t.g,t.b),o.setXYZ(17,t.r,t.g,t.b),o.setXYZ(18,t.r,t.g,t.b),o.setXYZ(19,t.r,t.g,t.b),o.setXYZ(20,t.r,t.g,t.b),o.setXYZ(21,t.r,t.g,t.b),o.setXYZ(22,t.r,t.g,t.b),o.setXYZ(23,t.r,t.g,t.b),o.setXYZ(24,e.r,e.g,e.b),o.setXYZ(25,e.r,e.g,e.b),o.setXYZ(26,e.r,e.g,e.b),o.setXYZ(27,e.r,e.g,e.b),o.setXYZ(28,e.r,e.g,e.b),o.setXYZ(29,e.r,e.g,e.b),o.setXYZ(30,e.r,e.g,e.b),o.setXYZ(31,e.r,e.g,e.b),o.setXYZ(32,n.r,n.g,n.b),o.setXYZ(33,n.r,n.g,n.b),o.setXYZ(34,n.r,n.g,n.b),o.setXYZ(35,n.r,n.g,n.b),o.setXYZ(36,n.r,n.g,n.b),o.setXYZ(37,n.r,n.g,n.b),o.setXYZ(38,i.r,i.g,i.b),o.setXYZ(39,i.r,i.g,i.b),o.setXYZ(40,r.r,r.g,r.b),o.setXYZ(41,r.r,r.g,r.b),o.setXYZ(42,r.r,r.g,r.b),o.setXYZ(43,r.r,r.g,r.b),o.setXYZ(44,r.r,r.g,r.b),o.setXYZ(45,r.r,r.g,r.b),o.setXYZ(46,r.r,r.g,r.b),o.setXYZ(47,r.r,r.g,r.b),o.setXYZ(48,r.r,r.g,r.b),o.setXYZ(49,r.r,r.g,r.b),o.needsUpdate=!0,this}update(){const t=this.geometry,e=this.pointMap,n=1,i=1;let r,a;if(Re.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse),this.camera.reversedDepth===!0)r=1,a=0;else if(this.camera.coordinateSystem===wn)r=-1,a=1;else if(this.camera.coordinateSystem===Ms)r=0,a=1;else throw new Error("THREE.CameraHelper.update(): Invalid coordinate system: "+this.camera.coordinateSystem);Le("c",e,t,Re,0,0,r),Le("t",e,t,Re,0,0,a),Le("n1",e,t,Re,-n,-i,r),Le("n2",e,t,Re,n,-i,r),Le("n3",e,t,Re,-n,i,r),Le("n4",e,t,Re,n,i,r),Le("f1",e,t,Re,-n,-i,a),Le("f2",e,t,Re,n,-i,a),Le("f3",e,t,Re,-n,i,a),Le("f4",e,t,Re,n,i,a),Le("u1",e,t,Re,n*.7,i*1.1,r),Le("u2",e,t,Re,-n*.7,i*1.1,r),Le("u3",e,t,Re,0,i*2,r),Le("cf1",e,t,Re,-n,0,a),Le("cf2",e,t,Re,n,0,a),Le("cf3",e,t,Re,0,-i,a),Le("cf4",e,t,Re,0,i,a),Le("cn1",e,t,Re,-n,0,r),Le("cn2",e,t,Re,n,0,r),Le("cn3",e,t,Re,0,-i,r),Le("cn4",e,t,Re,0,i,r),t.getAttribute("position").needsUpdate=!0}dispose(){this.geometry.dispose(),this.material.dispose()}}function Le(s,t,e,n,i,r,a){po.set(i,r,a).unproject(n);const o=t[s];if(o!==void 0){const l=e.getAttribute("position");for(let c=0,h=o.length;c<h;c++)l.setXYZ(o[c],po.x,po.y,po.z)}}const mo=new nn;class wx extends ci{constructor(t,e=16776960){const n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),i=new Float32Array(24),r=new Jt;r.setIndex(new xe(n,1)),r.setAttribute("position",new xe(i,3)),super(r,new un({color:e,toneMapped:!1})),this.object=t,this.type="BoxHelper",this.matrixAutoUpdate=!1,this.update()}update(){if(this.object!==void 0&&mo.setFromObject(this.object),mo.isEmpty())return;const t=mo.min,e=mo.max,n=this.geometry.attributes.position,i=n.array;i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=t.x,i[4]=e.y,i[5]=e.z,i[6]=t.x,i[7]=t.y,i[8]=e.z,i[9]=e.x,i[10]=t.y,i[11]=e.z,i[12]=e.x,i[13]=e.y,i[14]=t.z,i[15]=t.x,i[16]=e.y,i[17]=t.z,i[18]=t.x,i[19]=t.y,i[20]=t.z,i[21]=e.x,i[22]=t.y,i[23]=t.z,n.needsUpdate=!0,this.geometry.computeBoundingSphere()}setFromObject(t){return this.object=t,this.update(),this}copy(t,e){return super.copy(t,e),this.object=t.object,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class Ex extends ci{constructor(t,e=16776960){const n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),i=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],r=new Jt;r.setIndex(new xe(n,1)),r.setAttribute("position",new At(i,3)),super(r,new un({color:e,toneMapped:!1})),this.box=t,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(t){const e=this.box;e.isEmpty()||(e.getCenter(this.position),e.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(t))}dispose(){this.geometry.dispose(),this.material.dispose()}}class Tx extends Yi{constructor(t,e=1,n=16776960){const i=n,r=[1,-1,0,-1,1,0,-1,-1,0,1,1,0,-1,1,0,-1,-1,0,1,-1,0,1,1,0],a=new Jt;a.setAttribute("position",new At(r,3)),a.computeBoundingSphere(),super(a,new un({color:i,toneMapped:!1})),this.type="PlaneHelper",this.plane=t,this.size=e;const o=[1,1,0,-1,1,0,-1,-1,0,1,1,0,-1,-1,0,1,-1,0],l=new Jt;l.setAttribute("position",new At(o,3)),l.computeBoundingSphere(),this.add(new Gt(l,new He({color:i,opacity:.2,transparent:!0,depthWrite:!1,toneMapped:!1})))}updateMatrixWorld(t){this.position.set(0,0,0),this.scale.set(.5*this.size,.5*this.size,1),this.lookAt(this.plane.normal),this.translateZ(-this.plane.constant),super.updateMatrixWorld(t)}dispose(){this.geometry.dispose(),this.material.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose()}}const qd=new C;let go,Hc;class Ax extends oe{constructor(t=new C(0,0,1),e=new C(0,0,0),n=1,i=16776960,r=n*.2,a=r*.2){super(),this.type="ArrowHelper",go===void 0&&(go=new Jt,go.setAttribute("position",new At([0,0,0,0,1,0],3)),Hc=new yr(.5,1,5,1),Hc.translate(0,-.5,0)),this.position.copy(e),this.line=new Yi(go,new un({color:i,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new Gt(Hc,new He({color:i,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(t),this.setLength(n,r,a)}setDirection(t){if(t.y>.99999)this.quaternion.set(0,0,0,1);else if(t.y<-.99999)this.quaternion.set(1,0,0,0);else{qd.set(t.z,0,-t.x).normalize();const e=Math.acos(t.y);this.quaternion.setFromAxisAngle(qd,e)}}setLength(t,e=t*.2,n=e*.2){this.line.scale.set(1,Math.max(1e-4,t-e),1),this.line.updateMatrix(),this.cone.scale.set(n,e,n),this.cone.position.y=t,this.cone.updateMatrix()}setColor(t){this.line.material.color.set(t),this.cone.material.color.set(t)}copy(t){return super.copy(t,!1),this.line.copy(t.line),this.cone.copy(t.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}}class Cx extends ci{constructor(t=1){const e=[0,0,0,t,0,0,0,0,0,0,t,0,0,0,0,0,0,t],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],i=new Jt;i.setAttribute("position",new At(e,3)),i.setAttribute("color",new At(n,3));const r=new un({vertexColors:!0,toneMapped:!1});super(i,r),this.type="AxesHelper"}setColors(t,e,n){const i=new St,r=this.geometry.attributes.color.array;return i.set(t),i.toArray(r,0),i.toArray(r,3),i.set(e),i.toArray(r,6),i.toArray(r,9),i.set(n),i.toArray(r,12),i.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class Rx{constructor(){this.type="ShapePath",this.color=new St,this.subPaths=[],this.currentPath=null,this.userData={}}moveTo(t,e){return this.currentPath=new ca,this.subPaths.push(this.currentPath),this.currentPath.moveTo(t,e),this}lineTo(t,e){return this.currentPath.lineTo(t,e),this}quadraticCurveTo(t,e,n,i){return this.currentPath.quadraticCurveTo(t,e,n,i),this}bezierCurveTo(t,e,n,i,r,a){return this.currentPath.bezierCurveTo(t,e,n,i,r,a),this}splineThru(t){return this.currentPath.splineThru(t),this}toShapes(){function t(l,c){let h=!1;const d=c.length;for(let u=0,f=d-1;u<d;f=u++){const p=c[u],_=c[f];p.y>l.y!=_.y>l.y&&l.x<(_.x-p.x)*(l.y-p.y)/(_.y-p.y)+p.x&&(h=!h)}return h}function e(l,c){const h=c.getCenter(new J);if(t(h,l))return h;const d=h.y,u=[],f=l.length;for(let p=0;p<f;p++){const _=l[p],m=l[(p+1)%f];if(_.y>d!=m.y>d){const g=_.x+(d-_.y)*(m.x-_.x)/(m.y-_.y);u.push(g)}}return u.length>1&&(u.sort((p,_)=>p-_),h.x=(u[0]+u[1])/2),h}let n=this.userData.style&&this.userData.style.fillRule||"nonzero";n!=="nonzero"&&n!=="evenodd"&&(ut('Fill-rule "'+n+'" is not supported, falling back to "nonzero".'),n="nonzero");const i=n==="nonzero"?(l=>l!==0):(l=>(l&1)!==0),r=[];for(const l of this.subPaths){const c=l.getPoints();if(c.length<3)continue;const h=Hn.area(c);if(h===0)continue;const d=new om;for(let u=0;u<c.length;u++)d.expandByPoint(c[u]);r.push({subPath:l,points:c,boundingBox:d,interiorPoint:e(c,d),absArea:Math.abs(h),winding:h<0?-1:1,container:null,exclude:!1,role:null})}r.sort((l,c)=>c.absArea-l.absArea);for(let l=0;l<r.length;l++){const c=r[l];let h=0;for(let d=l-1;d>=0;d--){const u=r[d];if(u.boundingBox.containsBox(c.boundingBox)&&t(c.interiorPoint,u.points)){c.container=u.exclude?u.container:u,h=u.winding,c.winding+=h;break}}i(c.winding)===i(h)&&(c.exclude=!0)}for(const l of r)l.exclude||(l.role=l.container===null||l.container.role==="hole"?"outer":"hole");const a=[],o=new Map;for(const l of r){if(l.exclude||l.role!=="outer")continue;const c=new Es;c.curves=l.subPath.curves,a.push(c),o.set(l,c)}for(const l of r){if(l.exclude||l.role!=="hole")continue;const c=o.get(l.container);if(!c)continue;const h=new ca;h.curves=l.subPath.curves,c.holes.push(h)}return a}}class cm extends qn{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){if(t===void 0){ut("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}}function Px(s,t){const e=s.image&&s.image.width?s.image.width/s.image.height:1;return e>t?(s.repeat.x=1,s.repeat.y=e/t,s.offset.x=0,s.offset.y=(1-s.repeat.y)/2):(s.repeat.x=t/e,s.repeat.y=1,s.offset.x=(1-s.repeat.x)/2,s.offset.y=0),s}function Ix(s,t){const e=s.image&&s.image.width?s.image.width/s.image.height:1;return e>t?(s.repeat.x=t/e,s.repeat.y=1,s.offset.x=(1-s.repeat.x)/2,s.offset.y=0):(s.repeat.x=1,s.repeat.y=e/t,s.offset.x=0,s.offset.y=(1-s.repeat.y)/2),s}function Lx(s){return s.repeat.x=1,s.repeat.y=1,s.offset.x=0,s.offset.y=0,s}function gh(s,t,e,n){const i=Dx(n);switch(e){case Fh:return s*t;case bl:return s*t/i.components*i.byteLength;case _a:return s*t/i.components*i.byteLength;case Wi:return s*t*2/i.components*i.byteLength;case Sl:return s*t*2/i.components*i.byteLength;case Bh:return s*t*3/i.components*i.byteLength;case ln:return s*t*4/i.components*i.byteLength;case wl:return s*t*4/i.components*i.byteLength;case Yr:case qr:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case $r:case Zr:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case No:case Oo:return Math.max(s,16)*Math.max(t,8)/4;case Do:case Uo:return Math.max(s,8)*Math.max(t,8)/2;case Fo:case Bo:case zo:case Vo:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case ko:case ta:case Go:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Ho:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Wo:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case Xo:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case Yo:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case qo:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case $o:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case Zo:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case Jo:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case Ko:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case jo:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case Qo:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case tl:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case el:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case nl:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case il:case sl:case rl:return Math.ceil(s/4)*Math.ceil(t/4)*16;case al:case ol:return Math.ceil(s/4)*Math.ceil(t/4)*8;case ea:case ll:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Dx(s){switch(s){case mn:case Dh:return{byteLength:1,components:1};case lr:case Nh:case ri:return{byteLength:2,components:1};case vl:case Ml:return{byteLength:2,components:4};case Un:case yl:case on:return{byteLength:4,components:1};case Uh:case Oh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}class Nx{static contain(t,e){return Px(t,e)}static cover(t,e){return Ix(t,e)}static fill(t){return Lx(t)}static getByteLength(t,e,n,i){return gh(t,e,n,i)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:gl}}));typeof window<"u"&&(window.__THREE__?ut("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=gl);function hm(){let s=null,t=!1,e=null,n=null;function i(r,a){e(r,a),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&s!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function Ux(s){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,d=c.byteLength,u=s.createBuffer();s.bindBuffer(l,u),s.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=s.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){const h=l.array,d=l.updateRanges;if(s.bindBuffer(c,o),d.length===0)s.bufferSubData(c,0,h);else{d.sort((f,p)=>f.start-p.start);let u=0;for(let f=1;f<d.length;f++){const p=d[u],_=d[f];_.start<=p.start+p.count+1?p.count=Math.max(p.count,_.start+_.count-p.start):(++u,d[u]=_)}d.length=u+1;for(let f=0,p=d.length;f<p;f++){const _=d[f];s.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(s.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:r,update:a}}var Ox=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Fx=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Bx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,kx=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,zx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Vx=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Gx=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Hx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Wx=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Xx=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Yx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,qx=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,$x=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Zx=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Jx=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Kx=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,jx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Qx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ty=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ey=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,ny=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,iy=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,sy=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,ry=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,ay=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,oy=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,ly=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,cy=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,hy=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,uy=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,dy="gl_FragColor = linearToOutputTexel( gl_FragColor );",fy=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,py=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,my=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,gy=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,_y=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,xy=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,yy=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,vy=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,My=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,by=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Sy=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,wy=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ey=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ty=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ay=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Cy=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Ry=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Py=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Iy=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ly=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Dy=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Ny=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Uy=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Oy=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Fy=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,By=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,ky=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,zy=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Vy=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Gy=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Hy=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Wy=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Xy=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Yy=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,qy=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,$y=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Zy=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Jy=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ky=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,jy=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Qy=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,tv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,ev=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,nv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,iv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,sv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,rv=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,av=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ov=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,lv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,cv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,hv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,uv=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,dv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,fv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,pv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,mv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,gv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,_v=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,xv=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,yv=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,vv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Mv=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,bv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Sv=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,wv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ev=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Tv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Av=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Cv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Rv=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Pv=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Iv=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Lv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Dv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Nv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Uv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Ov=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Fv=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,kv=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Vv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Gv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Hv=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Wv=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Xv=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Yv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,qv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$v=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Zv=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Jv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Kv=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,jv=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Qv=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tM=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,eM=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,nM=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,iM=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,sM=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,rM=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,aM=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,oM=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lM=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,cM=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hM=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,uM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,dM=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fM=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,pM=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,mM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,te={alphahash_fragment:Ox,alphahash_pars_fragment:Fx,alphamap_fragment:Bx,alphamap_pars_fragment:kx,alphatest_fragment:zx,alphatest_pars_fragment:Vx,aomap_fragment:Gx,aomap_pars_fragment:Hx,batching_pars_vertex:Wx,batching_vertex:Xx,begin_vertex:Yx,beginnormal_vertex:qx,bsdfs:$x,iridescence_fragment:Zx,bumpmap_pars_fragment:Jx,clipping_planes_fragment:Kx,clipping_planes_pars_fragment:jx,clipping_planes_pars_vertex:Qx,clipping_planes_vertex:ty,color_fragment:ey,color_pars_fragment:ny,color_pars_vertex:iy,color_vertex:sy,common:ry,cube_uv_reflection_fragment:ay,defaultnormal_vertex:oy,displacementmap_pars_vertex:ly,displacementmap_vertex:cy,emissivemap_fragment:hy,emissivemap_pars_fragment:uy,colorspace_fragment:dy,colorspace_pars_fragment:fy,envmap_fragment:py,envmap_common_pars_fragment:my,envmap_pars_fragment:gy,envmap_pars_vertex:_y,envmap_physical_pars_fragment:Cy,envmap_vertex:xy,fog_vertex:yy,fog_pars_vertex:vy,fog_fragment:My,fog_pars_fragment:by,gradientmap_pars_fragment:Sy,lightmap_pars_fragment:wy,lights_lambert_fragment:Ey,lights_lambert_pars_fragment:Ty,lights_pars_begin:Ay,lights_toon_fragment:Ry,lights_toon_pars_fragment:Py,lights_phong_fragment:Iy,lights_phong_pars_fragment:Ly,lights_physical_fragment:Dy,lights_physical_pars_fragment:Ny,lights_fragment_begin:Uy,lights_fragment_maps:Oy,lights_fragment_end:Fy,lightprobes_pars_fragment:By,logdepthbuf_fragment:ky,logdepthbuf_pars_fragment:zy,logdepthbuf_pars_vertex:Vy,logdepthbuf_vertex:Gy,map_fragment:Hy,map_pars_fragment:Wy,map_particle_fragment:Xy,map_particle_pars_fragment:Yy,metalnessmap_fragment:qy,metalnessmap_pars_fragment:$y,morphinstance_vertex:Zy,morphcolor_vertex:Jy,morphnormal_vertex:Ky,morphtarget_pars_vertex:jy,morphtarget_vertex:Qy,normal_fragment_begin:tv,normal_fragment_maps:ev,normal_pars_fragment:nv,normal_pars_vertex:iv,normal_vertex:sv,normalmap_pars_fragment:rv,clearcoat_normal_fragment_begin:av,clearcoat_normal_fragment_maps:ov,clearcoat_pars_fragment:lv,iridescence_pars_fragment:cv,opaque_fragment:hv,packing:uv,premultiplied_alpha_fragment:dv,project_vertex:fv,dithering_fragment:pv,dithering_pars_fragment:mv,roughnessmap_fragment:gv,roughnessmap_pars_fragment:_v,shadowmap_pars_fragment:xv,shadowmap_pars_vertex:yv,shadowmap_vertex:vv,shadowmask_pars_fragment:Mv,skinbase_vertex:bv,skinning_pars_vertex:Sv,skinning_vertex:wv,skinnormal_vertex:Ev,specularmap_fragment:Tv,specularmap_pars_fragment:Av,tonemapping_fragment:Cv,tonemapping_pars_fragment:Rv,transmission_fragment:Pv,transmission_pars_fragment:Iv,uv_pars_fragment:Lv,uv_pars_vertex:Dv,uv_vertex:Nv,worldpos_vertex:Uv,background_vert:Ov,background_frag:Fv,backgroundCube_vert:Bv,backgroundCube_frag:kv,cube_vert:zv,cube_frag:Vv,depth_vert:Gv,depth_frag:Hv,distance_vert:Wv,distance_frag:Xv,equirect_vert:Yv,equirect_frag:qv,linedashed_vert:$v,linedashed_frag:Zv,meshbasic_vert:Jv,meshbasic_frag:Kv,meshlambert_vert:jv,meshlambert_frag:Qv,meshmatcap_vert:tM,meshmatcap_frag:eM,meshnormal_vert:nM,meshnormal_frag:iM,meshphong_vert:sM,meshphong_frag:rM,meshphysical_vert:aM,meshphysical_frag:oM,meshtoon_vert:lM,meshtoon_frag:cM,points_vert:hM,points_frag:uM,shadow_vert:dM,shadow_frag:fM,sprite_vert:pM,sprite_frag:mM},gt={common:{diffuse:{value:new St(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $t},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $t}},envmap:{envMap:{value:null},envMapRotation:{value:new $t},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $t}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $t}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $t},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $t},normalScale:{value:new J(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $t},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $t}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $t}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $t}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new St(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new C},probesMax:{value:new C},probesResolution:{value:new C}},points:{diffuse:{value:new St(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0},uvTransform:{value:new $t}},sprite:{diffuse:{value:new St(16777215)},opacity:{value:1},center:{value:new J(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $t},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0}}},Gn={basic:{uniforms:rn([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.fog]),vertexShader:te.meshbasic_vert,fragmentShader:te.meshbasic_frag},lambert:{uniforms:rn([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,gt.lights,{emissive:{value:new St(0)},envMapIntensity:{value:1}}]),vertexShader:te.meshlambert_vert,fragmentShader:te.meshlambert_frag},phong:{uniforms:rn([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,gt.lights,{emissive:{value:new St(0)},specular:{value:new St(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:te.meshphong_vert,fragmentShader:te.meshphong_frag},standard:{uniforms:rn([gt.common,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.roughnessmap,gt.metalnessmap,gt.fog,gt.lights,{emissive:{value:new St(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:te.meshphysical_vert,fragmentShader:te.meshphysical_frag},toon:{uniforms:rn([gt.common,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.gradientmap,gt.fog,gt.lights,{emissive:{value:new St(0)}}]),vertexShader:te.meshtoon_vert,fragmentShader:te.meshtoon_frag},matcap:{uniforms:rn([gt.common,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,{matcap:{value:null}}]),vertexShader:te.meshmatcap_vert,fragmentShader:te.meshmatcap_frag},points:{uniforms:rn([gt.points,gt.fog]),vertexShader:te.points_vert,fragmentShader:te.points_frag},dashed:{uniforms:rn([gt.common,gt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:te.linedashed_vert,fragmentShader:te.linedashed_frag},depth:{uniforms:rn([gt.common,gt.displacementmap]),vertexShader:te.depth_vert,fragmentShader:te.depth_frag},normal:{uniforms:rn([gt.common,gt.bumpmap,gt.normalmap,gt.displacementmap,{opacity:{value:1}}]),vertexShader:te.meshnormal_vert,fragmentShader:te.meshnormal_frag},sprite:{uniforms:rn([gt.sprite,gt.fog]),vertexShader:te.sprite_vert,fragmentShader:te.sprite_frag},background:{uniforms:{uvTransform:{value:new $t},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:te.background_vert,fragmentShader:te.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new $t}},vertexShader:te.backgroundCube_vert,fragmentShader:te.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:te.cube_vert,fragmentShader:te.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:te.equirect_vert,fragmentShader:te.equirect_frag},distance:{uniforms:rn([gt.common,gt.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:te.distance_vert,fragmentShader:te.distance_frag},shadow:{uniforms:rn([gt.lights,gt.fog,{color:{value:new St(0)},opacity:{value:1}}]),vertexShader:te.shadow_vert,fragmentShader:te.shadow_frag}};Gn.physical={uniforms:rn([Gn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $t},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $t},clearcoatNormalScale:{value:new J(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $t},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $t},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $t},sheen:{value:0},sheenColor:{value:new St(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $t},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $t},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $t},transmissionSamplerSize:{value:new J},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $t},attenuationDistance:{value:0},attenuationColor:{value:new St(0)},specularColor:{value:new St(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $t},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $t},anisotropyVector:{value:new J},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $t}}]),vertexShader:te.meshphysical_vert,fragmentShader:te.meshphysical_frag};const _o={r:0,b:0,g:0},gM=new Xt,um=new $t;um.set(-1,0,0,0,1,0,0,0,1);function _M(s,t,e,n,i,r){const a=new St(0);let o=i===!0?0:1,l,c,h=null,d=0,u=null;function f(v){let b=v.isScene===!0?v.background:null;if(b&&b.isTexture){const y=v.backgroundBlurriness>0;b=t.get(b,y)}return b}function p(v){let b=!1;const y=f(v);y===null?m(a,o):y&&y.isColor&&(m(y,1),b=!0);const T=s.xr.getEnvironmentBlendMode();T==="additive"?e.buffers.color.setClear(0,0,0,1,r):T==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(s.autoClear||b)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function _(v,b){const y=f(b);y&&(y.isCubeTexture||y.mapping===xr)?(c===void 0&&(c=new Gt(new tn(1,1,1),new On({name:"BackgroundCubeMaterial",uniforms:pr(Gn.backgroundCube.uniforms),vertexShader:Gn.backgroundCube.vertexShader,fragmentShader:Gn.backgroundCube.fragmentShader,side:cn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(T,S,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(gM.makeRotationFromEuler(b.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(um),c.material.toneMapped=ae.getTransfer(y.colorSpace)!==he,(h!==y||d!==y.version||u!==s.toneMapping)&&(c.material.needsUpdate=!0,h=y,d=y.version,u=s.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new Gt(new li(2,2),new On({name:"BackgroundMaterial",uniforms:pr(Gn.background.uniforms),vertexShader:Gn.background.vertexShader,fragmentShader:Gn.background.fragmentShader,side:Mi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,l.material.toneMapped=ae.getTransfer(y.colorSpace)!==he,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||d!==y.version||u!==s.toneMapping)&&(l.material.needsUpdate=!0,h=y,d=y.version,u=s.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function m(v,b){v.getRGB(_o,Up(s)),e.buffers.color.setClear(_o.r,_o.g,_o.b,b,r)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(v,b=1){a.set(v),o=b,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(v){o=v,m(a,o)},render:p,addToRenderList:_,dispose:g}}function xM(s,t){const e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=u(null);let r=i,a=!1;function o(D,N,P,F,I){let z=!1;const O=d(D,F,P,N);r!==O&&(r=O,c(r.object)),z=f(D,F,P,I),z&&p(D,F,P,I),I!==null&&t.update(I,s.ELEMENT_ARRAY_BUFFER),(z||a)&&(a=!1,y(D,N,P,F),I!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(I).buffer))}function l(){return s.createVertexArray()}function c(D){return s.bindVertexArray(D)}function h(D){return s.deleteVertexArray(D)}function d(D,N,P,F){const I=F.wireframe===!0;let z=n[N.id];z===void 0&&(z={},n[N.id]=z);const O=D.isInstancedMesh===!0?D.id:0;let X=z[O];X===void 0&&(X={},z[O]=X);let j=X[P.id];j===void 0&&(j={},X[P.id]=j);let at=j[I];return at===void 0&&(at=u(l()),j[I]=at),at}function u(D){const N=[],P=[],F=[];for(let I=0;I<e;I++)N[I]=0,P[I]=0,F[I]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:P,attributeDivisors:F,object:D,attributes:{},index:null}}function f(D,N,P,F){const I=r.attributes,z=N.attributes;let O=0;const X=P.getAttributes();for(const j in X)if(X[j].location>=0){const rt=I[j];let ct=z[j];if(ct===void 0&&(j==="instanceMatrix"&&D.instanceMatrix&&(ct=D.instanceMatrix),j==="instanceColor"&&D.instanceColor&&(ct=D.instanceColor)),rt===void 0||rt.attribute!==ct||ct&&rt.data!==ct.data)return!0;O++}return r.attributesNum!==O||r.index!==F}function p(D,N,P,F){const I={},z=N.attributes;let O=0;const X=P.getAttributes();for(const j in X)if(X[j].location>=0){let rt=z[j];rt===void 0&&(j==="instanceMatrix"&&D.instanceMatrix&&(rt=D.instanceMatrix),j==="instanceColor"&&D.instanceColor&&(rt=D.instanceColor));const ct={};ct.attribute=rt,rt&&rt.data&&(ct.data=rt.data),I[j]=ct,O++}r.attributes=I,r.attributesNum=O,r.index=F}function _(){const D=r.newAttributes;for(let N=0,P=D.length;N<P;N++)D[N]=0}function m(D){g(D,0)}function g(D,N){const P=r.newAttributes,F=r.enabledAttributes,I=r.attributeDivisors;P[D]=1,F[D]===0&&(s.enableVertexAttribArray(D),F[D]=1),I[D]!==N&&(s.vertexAttribDivisor(D,N),I[D]=N)}function v(){const D=r.newAttributes,N=r.enabledAttributes;for(let P=0,F=N.length;P<F;P++)N[P]!==D[P]&&(s.disableVertexAttribArray(P),N[P]=0)}function b(D,N,P,F,I,z,O){O===!0?s.vertexAttribIPointer(D,N,P,I,z):s.vertexAttribPointer(D,N,P,F,I,z)}function y(D,N,P,F){_();const I=F.attributes,z=P.getAttributes(),O=N.defaultAttributeValues;for(const X in z){const j=z[X];if(j.location>=0){let at=I[X];if(at===void 0&&(X==="instanceMatrix"&&D.instanceMatrix&&(at=D.instanceMatrix),X==="instanceColor"&&D.instanceColor&&(at=D.instanceColor)),at!==void 0){const rt=at.normalized,ct=at.itemSize,Yt=t.get(at);if(Yt===void 0)continue;const ie=Yt.buffer,ee=Yt.type,Z=Yt.bytesPerElement,ot=ee===s.INT||ee===s.UNSIGNED_INT||at.gpuType===yl;if(at.isInterleavedBufferAttribute){const nt=at.data,Ct=nt.stride,Dt=at.offset;if(nt.isInstancedInterleavedBuffer){for(let wt=0;wt<j.locationSize;wt++)g(j.location+wt,nt.meshPerAttribute);D.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=nt.meshPerAttribute*nt.count)}else for(let wt=0;wt<j.locationSize;wt++)m(j.location+wt);s.bindBuffer(s.ARRAY_BUFFER,ie);for(let wt=0;wt<j.locationSize;wt++)b(j.location+wt,ct/j.locationSize,ee,rt,Ct*Z,(Dt+ct/j.locationSize*wt)*Z,ot)}else{if(at.isInstancedBufferAttribute){for(let nt=0;nt<j.locationSize;nt++)g(j.location+nt,at.meshPerAttribute);D.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let nt=0;nt<j.locationSize;nt++)m(j.location+nt);s.bindBuffer(s.ARRAY_BUFFER,ie);for(let nt=0;nt<j.locationSize;nt++)b(j.location+nt,ct/j.locationSize,ee,rt,ct*Z,ct/j.locationSize*nt*Z,ot)}}else if(O!==void 0){const rt=O[X];if(rt!==void 0)switch(rt.length){case 2:s.vertexAttrib2fv(j.location,rt);break;case 3:s.vertexAttrib3fv(j.location,rt);break;case 4:s.vertexAttrib4fv(j.location,rt);break;default:s.vertexAttrib1fv(j.location,rt)}}}}v()}function T(){w();for(const D in n){const N=n[D];for(const P in N){const F=N[P];for(const I in F){const z=F[I];for(const O in z)h(z[O].object),delete z[O];delete F[I]}}delete n[D]}}function S(D){if(n[D.id]===void 0)return;const N=n[D.id];for(const P in N){const F=N[P];for(const I in F){const z=F[I];for(const O in z)h(z[O].object),delete z[O];delete F[I]}}delete n[D.id]}function A(D){for(const N in n){const P=n[N];for(const F in P){const I=P[F];if(I[D.id]===void 0)continue;const z=I[D.id];for(const O in z)h(z[O].object),delete z[O];delete I[D.id]}}}function x(D){for(const N in n){const P=n[N],F=D.isInstancedMesh===!0?D.id:0,I=P[F];if(I!==void 0){for(const z in I){const O=I[z];for(const X in O)h(O[X].object),delete O[X];delete I[z]}delete P[F],Object.keys(P).length===0&&delete n[N]}}}function w(){L(),a=!0,r!==i&&(r=i,c(r.object))}function L(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:w,resetDefaultState:L,dispose:T,releaseStatesOfGeometry:S,releaseStatesOfObject:x,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:v}}function yM(s,t,e){let n;function i(l){n=l}function r(l,c){s.drawArrays(n,l,c),e.update(c,n,1)}function a(l,c,h){h!==0&&(s.drawArraysInstanced(n,l,c,h),e.update(c,n,h))}function o(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let f=0;f<h;f++)u+=c[f];e.update(u,n,1)}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function vM(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(A){return!(A!==ln&&n.convert(A)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const x=A===ri&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==mn&&n.convert(A)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==on&&!x)}function l(A){if(A==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(ut("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&ut("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),p=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),g=s.getParameter(s.MAX_VERTEX_ATTRIBS),v=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),b=s.getParameter(s.MAX_VARYING_VECTORS),y=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),T=s.getParameter(s.MAX_SAMPLES),S=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:p,maxTextureSize:_,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:v,maxVaryings:b,maxFragmentUniforms:y,maxSamples:T,samples:S}}function MM(s){const t=this;let e=null,n=0,i=!1,r=!1;const a=new _i,o=new $t,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||n!==0||i;return i=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,f){const p=d.clippingPlanes,_=d.clipIntersection,m=d.clipShadows,g=s.get(d);if(!i||p===null||p.length===0||r&&!m)r?h(null):c();else{const v=r?0:n,b=v*4;let y=g.clippingState||null;l.value=y,y=h(p,u,b,f);for(let T=0;T!==b;++T)y[T]=e[T];g.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,f,p){const _=d!==null?d.length:0;let m=null;if(_!==0){if(m=l.value,p!==!0||m===null){const g=f+_*4,v=u.matrixWorldInverse;o.getNormalMatrix(v),(m===null||m.length<g)&&(m=new Float32Array(g));for(let b=0,y=f;b!==_;++b,y+=4)a.copy(d[b]).applyMatrix4(v,o),a.normal.toArray(m,y),m[y+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}const ki=4,$d=[.125,.215,.35,.446,.526,.582],hs=20,bM=256,Nr=new ba,Zd=new St;let Wc=null,Xc=0,Yc=0,qc=!1;const SM=new C;class _h{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,i=100,r={}){const{size:a=256,position:o=SM}=r;Wc=this._renderer.getRenderTarget(),Xc=this._renderer.getActiveCubeFace(),Yc=this._renderer.getActiveMipmapLevel(),qc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,i,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=jd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Kd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Wc,Xc,Yc),this._renderer.xr.enabled=qc,t.scissorTest=!1,tr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===si||t.mapping===Hi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Wc=this._renderer.getRenderTarget(),Xc=this._renderer.getActiveCubeFace(),Yc=this._renderer.getActiveMipmapLevel(),qc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:we,minFilter:we,generateMipmaps:!1,type:ri,format:ln,colorSpace:sa,depthBuffer:!1},i=Jd(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Jd(t,e,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=wM(r)),this._blurMaterial=TM(r,t,e),this._ggxMaterial=EM(r,t,e)}return i}_compileMaterial(t){const e=new Gt(new Jt,t);this._renderer.compile(e,Nr)}_sceneToCubeUV(t,e,n,i,r){const l=new Ve(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(Zd),d.toneMapping=Wn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(i),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Gt(new tn,new He({name:"PMREM.Background",side:cn,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,m=_.material;let g=!1;const v=t.background;v?v.isColor&&(m.color.copy(v),t.background=null,g=!0):(m.color.copy(Zd),g=!0);for(let b=0;b<6;b++){const y=b%3;y===0?(l.up.set(0,c[b],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[b],r.y,r.z)):y===1?(l.up.set(0,0,c[b]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[b],r.z)):(l.up.set(0,c[b],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[b]));const T=this._cubeSize;tr(i,y*T,b>2?T:0,T,T),d.setRenderTarget(i),g&&d.render(_,l),d.render(t,l)}d.toneMapping=f,d.autoClear=u,t.background=v}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===si||t.mapping===Hi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=jd()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Kd());const r=i?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;tr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,Nr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const i=this._lodMeshes.length;for(let r=1;r<i;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){const i=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),d=Math.sqrt(c*c-h*h),u=0+c*1.25,f=d*u,{_lodMax:p}=this,_=this._sizeLods[n],m=3*_*(n>p-ki?n-p+ki:0),g=4*(this._cubeSize-_);l.envMap.value=t.texture,l.roughness.value=f,l.mipInt.value=p-e,tr(r,m,g,3*_,2*_),i.setRenderTarget(r),i.render(o,Nr),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=p-n,tr(t,m,g,3*_,2*_),i.setRenderTarget(t),i.render(o,Nr)}_blur(t,e,n,i,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,i,"latitudinal",r),this._halfBlur(a,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&It("blur direction must be either latitudinal or longitudinal!");const h=3,d=this._lodMeshes[i];d.material=c;const u=c.uniforms,f=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*hs-1),_=r/p,m=isFinite(r)?1+Math.floor(h*_):hs;m>hs&&ut(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${hs}`);const g=[];let v=0;for(let A=0;A<hs;++A){const x=A/_,w=Math.exp(-x*x/2);g.push(w),A===0?v+=w:A<m&&(v+=2*w)}for(let A=0;A<g.length;A++)g[A]=g[A]/v;u.envMap.value=t.texture,u.samples.value=m,u.weights.value=g,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:b}=this;u.dTheta.value=p,u.mipInt.value=b-n;const y=this._sizeLods[i],T=3*y*(i>b-ki?i-b+ki:0),S=4*(this._cubeSize-y);tr(e,T,S,3*y,2*y),l.setRenderTarget(e),l.render(d,Nr)}}function wM(s){const t=[],e=[],n=[];let i=s;const r=s-ki+1+$d.length;for(let a=0;a<r;a++){const o=Math.pow(2,i);t.push(o);let l=1/o;a>s-ki?l=$d[a-s+ki-1]:a===0&&(l=0),e.push(l);const c=1/(o-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],f=6,p=6,_=3,m=2,g=1,v=new Float32Array(_*p*f),b=new Float32Array(m*p*f),y=new Float32Array(g*p*f);for(let S=0;S<f;S++){const A=S%3*2/3-1,x=S>2?0:-1,w=[A,x,0,A+2/3,x,0,A+2/3,x+1,0,A,x,0,A+2/3,x+1,0,A,x+1,0];v.set(w,_*p*S),b.set(u,m*p*S);const L=[S,S,S,S,S,S];y.set(L,g*p*S)}const T=new Jt;T.setAttribute("position",new xe(v,_)),T.setAttribute("uv",new xe(b,m)),T.setAttribute("faceIndex",new xe(y,g)),n.push(new Gt(T,null)),i>ki&&i--}return{lodMeshes:n,sizeLods:t,sigmas:e}}function Jd(s,t,e){const n=new An(s,t,e);return n.texture.mapping=xr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function tr(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function EM(s,t,e){return new On({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:bM,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Ql(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:ii,depthTest:!1,depthWrite:!1})}function TM(s,t,e){const n=new Float32Array(hs),i=new C(0,1,0);return new On({name:"SphericalGaussianBlur",defines:{n:hs,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Ql(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ii,depthTest:!1,depthWrite:!1})}function Kd(){return new On({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ql(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ii,depthTest:!1,depthWrite:!1})}function jd(){return new On({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ql(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ii,depthTest:!1,depthWrite:!1})}function Ql(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class xu extends An{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new ya(i),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new tn(5,5,5),r=new On({name:"CubemapFromEquirect",uniforms:pr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:cn,blending:ii});r.uniforms.tEquirect.value=e;const a=new Gt(i,r),o=e.minFilter;return e.minFilter===ti&&(e.minFilter=we),new em(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,i=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,i);t.setRenderTarget(r)}}function AM(s){let t=new WeakMap,e=new WeakMap,n=null;function i(u,f=!1){return u==null?null:f?a(u):r(u)}function r(u){if(u&&u.isTexture){const f=u.mapping;if(f===Hr||f===Wr)if(t.has(u)){const p=t.get(u).texture;return o(p,u.mapping)}else{const p=u.image;if(p&&p.height>0){const _=new xu(p.height);return _.fromEquirectangularTexture(s,u),t.set(u,_),u.addEventListener("dispose",c),o(_.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){const f=u.mapping,p=f===Hr||f===Wr,_=f===si||f===Hi;if(p||_){let m=e.get(u);const g=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==g)return n===null&&(n=new _h(s)),m=p?n.fromEquirectangular(u,m):n.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),m.texture;if(m!==void 0)return m.texture;{const v=u.image;return p&&v&&v.height>0||_&&v&&l(v)?(n===null&&(n=new _h(s)),m=p?n.fromEquirectangular(u):n.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),u.addEventListener("dispose",h),m.texture):null}}}return u}function o(u,f){return f===Hr?u.mapping=si:f===Wr&&(u.mapping=Hi),u}function l(u){let f=0;const p=6;for(let _=0;_<p;_++)u[_]!==void 0&&f++;return f===p}function c(u){const f=u.target;f.removeEventListener("dispose",c);const p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function h(u){const f=u.target;f.removeEventListener("dispose",h);const p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function d(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:d}}function CM(s){const t={};function e(n){if(t[n]!==void 0)return t[n];const i=s.getExtension(n);return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const i=e(n);return i===null&&Vi("WebGLRenderer: "+n+" extension not supported."),i}}}function RM(s,t,e,n){const i={},r=new WeakMap;function a(d){const u=d.target;u.index!==null&&t.remove(u.index);for(const p in u.attributes)t.remove(u.attributes[p]);u.removeEventListener("dispose",a),delete i[u.id];const f=r.get(u);f&&(t.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function o(d,u){return i[u.id]===!0||(u.addEventListener("dispose",a),i[u.id]=!0,e.memory.geometries++),u}function l(d){const u=d.attributes;for(const f in u)t.update(u[f],s.ARRAY_BUFFER)}function c(d){const u=[],f=d.index,p=d.attributes.position;let _=0;if(p===void 0)return;if(f!==null){const v=f.array;_=f.version;for(let b=0,y=v.length;b<y;b+=3){const T=v[b+0],S=v[b+1],A=v[b+2];u.push(T,S,S,A,A,T)}}else{const v=p.array;_=p.version;for(let b=0,y=v.length/3-1;b<y;b+=3){const T=b+0,S=b+1,A=b+2;u.push(T,S,S,A,A,T)}}const m=new(p.count>=65535?Wh:Hh)(u,1);m.version=_;const g=r.get(d);g&&t.remove(g),r.set(d,m)}function h(d){const u=r.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function PM(s,t,e){let n;function i(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,u){s.drawElements(n,u,r,d*a),e.update(u,n,1)}function c(d,u,f){f!==0&&(s.drawElementsInstanced(n,u,r,d*a,f),e.update(u,n,f))}function h(d,u,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,f);let _=0;for(let m=0;m<f;m++)_+=u[m];e.update(_,n,1)}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function IM(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case s.TRIANGLES:e.triangles+=o*(r/3);break;case s.LINES:e.lines+=o*(r/2);break;case s.LINE_STRIP:e.lines+=o*(r-1);break;case s.LINE_LOOP:e.lines+=o*r;break;case s.POINTS:e.points+=o*r;break;default:It("WebGLInfo: Unknown draw mode:",a);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function LM(s,t,e){const n=new WeakMap,i=new pe;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(o);if(u===void 0||u.count!==d){let L=function(){x.dispose(),n.delete(o),o.removeEventListener("dispose",L)};var f=L;u!==void 0&&u.texture.dispose();const p=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],v=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let y=0;p===!0&&(y=1),_===!0&&(y=2),m===!0&&(y=3);let T=o.attributes.position.count*y,S=1;T>t.maxTextureSize&&(S=Math.ceil(T/t.maxTextureSize),T=t.maxTextureSize);const A=new Float32Array(T*S*4*d),x=new Rl(A,T,S,d);x.type=on,x.needsUpdate=!0;const w=y*4;for(let D=0;D<d;D++){const N=g[D],P=v[D],F=b[D],I=T*S*4*D;for(let z=0;z<N.count;z++){const O=z*w;p===!0&&(i.fromBufferAttribute(N,z),A[I+O+0]=i.x,A[I+O+1]=i.y,A[I+O+2]=i.z,A[I+O+3]=0),_===!0&&(i.fromBufferAttribute(P,z),A[I+O+4]=i.x,A[I+O+5]=i.y,A[I+O+6]=i.z,A[I+O+7]=0),m===!0&&(i.fromBufferAttribute(F,z),A[I+O+8]=i.x,A[I+O+9]=i.y,A[I+O+10]=i.z,A[I+O+11]=F.itemSize===4?i.w:1)}}u={count:d,texture:x,size:new J(T,S)},n.set(o,u),o.addEventListener("dispose",L)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,e);else{let p=0;for(let m=0;m<c.length;m++)p+=c[m];const _=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(s,"morphTargetBaseInfluence",_),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",u.size)}return{update:r}}function DM(s,t,e,n,i){let r=new WeakMap;function a(c){const h=i.render.frame,d=c.geometry,u=t.get(c,d);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return u}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:a,dispose:o}}const NM={[Th]:"LINEAR_TONE_MAPPING",[Ah]:"REINHARD_TONE_MAPPING",[Ch]:"CINEON_TONE_MAPPING",[_l]:"ACES_FILMIC_TONE_MAPPING",[Ph]:"AGX_TONE_MAPPING",[Ih]:"NEUTRAL_TONE_MAPPING",[Rh]:"CUSTOM_TONE_MAPPING"};function UM(s,t,e,n,i,r){const a=new An(t,e,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,depthTexture:i?new ws(t,e):void 0}),o=new An(t,e,{type:ri,depthBuffer:!1,stencilBuffer:!1}),l=new Jt;l.setAttribute("position",new At([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new At([0,2,0,0,2,0],2));const c=new nu({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),h=new Gt(l,c),d=new ba(-1,1,1,-1,0,1);let u=null,f=null,p=!1,_,m=null,g=[],v=!1;this.setSize=function(b,y){a.setSize(b,y),o.setSize(b,y);for(let T=0;T<g.length;T++){const S=g[T];S.setSize&&S.setSize(b,y)}},this.setEffects=function(b){g=b,v=g.length>0&&g[0].isRenderPass===!0;const y=a.width,T=a.height;for(let S=0;S<g.length;S++){const A=g[S];A.setSize&&A.setSize(y,T)}},this.begin=function(b,y){if(p||b.toneMapping===Wn&&g.length===0)return!1;if(m=y,y!==null){const T=y.width,S=y.height;(a.width!==T||a.height!==S)&&this.setSize(T,S)}return v===!1&&b.setRenderTarget(a),_=b.toneMapping,b.toneMapping=Wn,!0},this.hasRenderPass=function(){return v},this.end=function(b,y){b.toneMapping=_,p=!0;let T=a,S=o;for(let A=0;A<g.length;A++){const x=g[A];if(x.enabled!==!1&&(x.render(b,S,T,y),x.needsSwap!==!1)){const w=T;T=S,S=w}}if(u!==b.outputColorSpace||f!==b.toneMapping){u=b.outputColorSpace,f=b.toneMapping,c.defines={},ae.getTransfer(u)===he&&(c.defines.SRGB_TRANSFER="");const A=NM[f];A&&(c.defines[A]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=T.texture,b.setRenderTarget(m),b.render(h,d),m=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),l.dispose(),c.dispose()}}const dm=new Te,xh=new ws(1,1),fm=new Rl,pm=new Pl,mm=new ya,Qd=[],tf=[],ef=new Float32Array(16),nf=new Float32Array(9),sf=new Float32Array(4);function Mr(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let r=Qd[i];if(r===void 0&&(r=new Float32Array(i),Qd[i]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,s[a].toArray(r,o)}return r}function Be(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function ke(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function tc(s,t){let e=tf[t];e===void 0&&(e=new Int32Array(t),tf[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function OM(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function FM(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Be(e,t))return;s.uniform2fv(this.addr,t),ke(e,t)}}function BM(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Be(e,t))return;s.uniform3fv(this.addr,t),ke(e,t)}}function kM(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Be(e,t))return;s.uniform4fv(this.addr,t),ke(e,t)}}function zM(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Be(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),ke(e,t)}else{if(Be(e,n))return;sf.set(n),s.uniformMatrix2fv(this.addr,!1,sf),ke(e,n)}}function VM(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Be(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),ke(e,t)}else{if(Be(e,n))return;nf.set(n),s.uniformMatrix3fv(this.addr,!1,nf),ke(e,n)}}function GM(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Be(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),ke(e,t)}else{if(Be(e,n))return;ef.set(n),s.uniformMatrix4fv(this.addr,!1,ef),ke(e,n)}}function HM(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function WM(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Be(e,t))return;s.uniform2iv(this.addr,t),ke(e,t)}}function XM(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Be(e,t))return;s.uniform3iv(this.addr,t),ke(e,t)}}function YM(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Be(e,t))return;s.uniform4iv(this.addr,t),ke(e,t)}}function qM(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function $M(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Be(e,t))return;s.uniform2uiv(this.addr,t),ke(e,t)}}function ZM(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Be(e,t))return;s.uniform3uiv(this.addr,t),ke(e,t)}}function JM(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Be(e,t))return;s.uniform4uiv(this.addr,t),ke(e,t)}}function KM(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(xh.compareFunction=e.isReversedDepthBuffer()?Al:Tl,r=xh):r=dm,e.setTexture2D(t||r,i)}function jM(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||pm,i)}function QM(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||mm,i)}function tb(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||fm,i)}function eb(s){switch(s){case 5126:return OM;case 35664:return FM;case 35665:return BM;case 35666:return kM;case 35674:return zM;case 35675:return VM;case 35676:return GM;case 5124:case 35670:return HM;case 35667:case 35671:return WM;case 35668:case 35672:return XM;case 35669:case 35673:return YM;case 5125:return qM;case 36294:return $M;case 36295:return ZM;case 36296:return JM;case 35678:case 36198:case 36298:case 36306:case 35682:return KM;case 35679:case 36299:case 36307:return jM;case 35680:case 36300:case 36308:case 36293:return QM;case 36289:case 36303:case 36311:case 36292:return tb}}function nb(s,t){s.uniform1fv(this.addr,t)}function ib(s,t){const e=Mr(t,this.size,2);s.uniform2fv(this.addr,e)}function sb(s,t){const e=Mr(t,this.size,3);s.uniform3fv(this.addr,e)}function rb(s,t){const e=Mr(t,this.size,4);s.uniform4fv(this.addr,e)}function ab(s,t){const e=Mr(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function ob(s,t){const e=Mr(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function lb(s,t){const e=Mr(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function cb(s,t){s.uniform1iv(this.addr,t)}function hb(s,t){s.uniform2iv(this.addr,t)}function ub(s,t){s.uniform3iv(this.addr,t)}function db(s,t){s.uniform4iv(this.addr,t)}function fb(s,t){s.uniform1uiv(this.addr,t)}function pb(s,t){s.uniform2uiv(this.addr,t)}function mb(s,t){s.uniform3uiv(this.addr,t)}function gb(s,t){s.uniform4uiv(this.addr,t)}function _b(s,t,e){const n=this.cache,i=t.length,r=tc(e,i);Be(n,r)||(s.uniform1iv(this.addr,r),ke(n,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=xh:a=dm;for(let o=0;o!==i;++o)e.setTexture2D(t[o]||a,r[o])}function xb(s,t,e){const n=this.cache,i=t.length,r=tc(e,i);Be(n,r)||(s.uniform1iv(this.addr,r),ke(n,r));for(let a=0;a!==i;++a)e.setTexture3D(t[a]||pm,r[a])}function yb(s,t,e){const n=this.cache,i=t.length,r=tc(e,i);Be(n,r)||(s.uniform1iv(this.addr,r),ke(n,r));for(let a=0;a!==i;++a)e.setTextureCube(t[a]||mm,r[a])}function vb(s,t,e){const n=this.cache,i=t.length,r=tc(e,i);Be(n,r)||(s.uniform1iv(this.addr,r),ke(n,r));for(let a=0;a!==i;++a)e.setTexture2DArray(t[a]||fm,r[a])}function Mb(s){switch(s){case 5126:return nb;case 35664:return ib;case 35665:return sb;case 35666:return rb;case 35674:return ab;case 35675:return ob;case 35676:return lb;case 5124:case 35670:return cb;case 35667:case 35671:return hb;case 35668:case 35672:return ub;case 35669:case 35673:return db;case 5125:return fb;case 36294:return pb;case 36295:return mb;case 36296:return gb;case 35678:case 36198:case 36298:case 36306:case 35682:return _b;case 35679:case 36299:case 36307:return xb;case 35680:case 36300:case 36308:case 36293:return yb;case 36289:case 36303:case 36311:case 36292:return vb}}class bb{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=eb(e.type)}}class Sb{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Mb(e.type)}}class wb{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(t,e[o.id],n)}}}const $c=/(\w+)(\])?(\[|\.)?/g;function rf(s,t){s.seq.push(t),s.map[t.id]=t}function Eb(s,t,e){const n=s.name,i=n.length;for($c.lastIndex=0;;){const r=$c.exec(n),a=$c.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){rf(e,c===void 0?new bb(o,s,t):new Sb(o,s,t));break}else{let d=e.map[o];d===void 0&&(d=new wb(o),rf(e,d)),e=d}}}class bo{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=t.getActiveUniform(e,a),l=t.getUniformLocation(e,o.name);Eb(o,l,this)}const i=[],r=[];for(const a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?i.push(a):r.push(a);i.length>0&&(this.seq=i.concat(r))}setValue(t,e,n,i){const r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,r=t.length;i!==r;++i){const a=t[i];a.id in e&&n.push(a)}return n}}function af(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const Tb=37297;let Ab=0;function Cb(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const of=new $t;function Rb(s){ae._getMatrix(of,ae.workingColorSpace,s);const t=`mat3( ${of.elements.map(e=>e.toFixed(4))} )`;switch(ae.getTransfer(s)){case ra:return[t,"LinearTransferOETF"];case he:return[t,"sRGBTransferOETF"];default:return ut("WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function lf(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),r=(s.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+Cb(s.getShaderSource(t),o)}else return r}function Pb(s,t){const e=Rb(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}const Ib={[Th]:"Linear",[Ah]:"Reinhard",[Ch]:"Cineon",[_l]:"ACESFilmic",[Ph]:"AgX",[Ih]:"Neutral",[Rh]:"Custom"};function Lb(s,t){const e=Ib[t];return e===void 0?(ut("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const xo=new C;function Db(){ae.getLuminanceCoefficients(xo);const s=xo.x.toFixed(4),t=xo.y.toFixed(4),e=xo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Nb(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(zr).join(`
`)}function Ub(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Ob(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(t,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:s.getAttribLocation(t,a),locationSize:o}}return e}function zr(s){return s!==""}function cf(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function hf(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Fb=/^[ \t]*#include +<([\w\d./]+)>/gm;function yh(s){return s.replace(Fb,kb)}const Bb=new Map;function kb(s,t){let e=te[t];if(e===void 0){const n=Bb.get(t);if(n!==void 0)e=te[n],ut('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return yh(e)}const zb=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function uf(s){return s.replace(zb,Vb)}function Vb(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function df(s){let t=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}const Gb={[Gr]:"SHADOWMAP_TYPE_PCF",[er]:"SHADOWMAP_TYPE_VSM"};function Hb(s){return Gb[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Wb={[si]:"ENVMAP_TYPE_CUBE",[Hi]:"ENVMAP_TYPE_CUBE",[xr]:"ENVMAP_TYPE_CUBE_UV"};function Xb(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":Wb[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const Yb={[Hi]:"ENVMAP_MODE_REFRACTION"};function qb(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":Yb[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const $b={[ga]:"ENVMAP_BLENDING_MULTIPLY",[Jf]:"ENVMAP_BLENDING_MIX",[Kf]:"ENVMAP_BLENDING_ADD"};function Zb(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":$b[s.combine]||"ENVMAP_BLENDING_NONE"}function Jb(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Kb(s,t,e,n){const i=s.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=Hb(e),c=Xb(e),h=qb(e),d=Zb(e),u=Jb(e),f=Nb(e),p=Ub(r),_=i.createProgram();let m,g,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(zr).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(zr).join(`
`),g.length>0&&(g+=`
`)):(m=[df(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(zr).join(`
`),g=[df(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Wn?"#define TONE_MAPPING":"",e.toneMapping!==Wn?te.tonemapping_pars_fragment:"",e.toneMapping!==Wn?Lb("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",te.colorspace_pars_fragment,Pb("linearToOutputTexel",e.outputColorSpace),Db(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(zr).join(`
`)),a=yh(a),a=cf(a,e),a=hf(a,e),o=yh(o),o=cf(o,e),o=hf(o,e),a=uf(a),o=uf(o),e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",e.glslVersion===oh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===oh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const b=v+m+a,y=v+g+o,T=af(i,i.VERTEX_SHADER,b),S=af(i,i.FRAGMENT_SHADER,y);i.attachShader(_,T),i.attachShader(_,S),e.index0AttributeName!==void 0?i.bindAttribLocation(_,0,e.index0AttributeName):e.hasPositionAttribute===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function A(D){if(s.debug.checkShaderErrors){const N=i.getProgramInfoLog(_)||"",P=i.getShaderInfoLog(T)||"",F=i.getShaderInfoLog(S)||"",I=N.trim(),z=P.trim(),O=F.trim();let X=!0,j=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(X=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,_,T,S);else{const at=lf(i,T,"vertex"),rt=lf(i,S,"fragment");It("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+I+`
`+at+`
`+rt)}else I!==""?ut("WebGLProgram: Program Info Log:",I):(z===""||O==="")&&(j=!1);j&&(D.diagnostics={runnable:X,programLog:I,vertexShader:{log:z,prefix:m},fragmentShader:{log:O,prefix:g}})}i.deleteShader(T),i.deleteShader(S),x=new bo(i,_),w=Ob(i,_)}let x;this.getUniforms=function(){return x===void 0&&A(this),x};let w;this.getAttributes=function(){return w===void 0&&A(this),w};let L=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=i.getProgramParameter(_,Tb)),L},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Ab++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=T,this.fragmentShader=S,this}let jb=0;class Qb{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){const i=this._getShaderCacheForMaterial(t);return i.has(e)===!1&&(i.add(e),e.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new tS(t),e.set(t,n)),n}}class tS{constructor(t){this.id=jb++,this.code=t,this.usedTimes=0}}function eS(s){return s===Wi||s===ta||s===ea}function nS(s,t,e,n,i,r){const a=new Il,o=new Qb,l=new Set,c=[],h=new Map,d=n.logarithmicDepthBuffer;let u=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(x){return l.add(x),x===0?"uv":`uv${x}`}function _(x,w,L,D,N,P){const F=D.fog,I=N.geometry,z=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?D.environment:null,O=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,X=t.get(x.envMap||z,O),j=X&&X.mapping===xr?X.image.height:null,at=f[x.type];x.precision!==null&&(u=n.getMaxPrecision(x.precision),u!==x.precision&&ut("WebGLProgram.getParameters:",x.precision,"not supported, using",u,"instead."));const rt=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,ct=rt!==void 0?rt.length:0;let Yt=0;I.morphAttributes.position!==void 0&&(Yt=1),I.morphAttributes.normal!==void 0&&(Yt=2),I.morphAttributes.color!==void 0&&(Yt=3);let ie,ee,Z,ot;if(at){const Rt=Gn[at];ie=Rt.vertexShader,ee=Rt.fragmentShader}else{ie=x.vertexShader,ee=x.fragmentShader;const Rt=o.getVertexShaderStage(x),Ae=o.getFragmentShaderStage(x);o.update(x,Rt,Ae),Z=Rt.id,ot=Ae.id}const nt=s.getRenderTarget(),Ct=s.state.buffers.depth.getReversed(),Dt=N.isInstancedMesh===!0,wt=N.isBatchedMesh===!0,se=!!x.map,kt=!!x.matcap,tt=!!X,it=!!x.aoMap,st=!!x.lightMap,yt=!!x.bumpMap&&x.wireframe===!1,_t=!!x.normalMap,Vt=!!x.displacementMap,Nt=!!x.emissiveMap,qt=!!x.metalnessMap,Zt=!!x.roughnessMap,U=x.anisotropy>0,me=x.clearcoat>0,re=x.dispersion>0,R=x.iridescence>0,M=x.sheen>0,V=x.transmission>0,W=U&&!!x.anisotropyMap,q=me&&!!x.clearcoatMap,lt=me&&!!x.clearcoatNormalMap,ht=me&&!!x.clearcoatRoughnessMap,$=R&&!!x.iridescenceMap,Q=R&&!!x.iridescenceThicknessMap,ft=M&&!!x.sheenColorMap,Ut=M&&!!x.sheenRoughnessMap,xt=!!x.specularMap,pt=!!x.specularColorMap,Bt=!!x.specularIntensityMap,Ht=V&&!!x.transmissionMap,Kt=V&&!!x.thicknessMap,B=!!x.gradientMap,dt=!!x.alphaMap,K=x.alphaTest>0,mt=!!x.alphaHash,bt=!!x.extensions;let et=Wn;x.toneMapped&&(nt===null||nt.isXRRenderTarget===!0)&&(et=s.toneMapping);const Lt={shaderID:at,shaderType:x.type,shaderName:x.name,vertexShader:ie,fragmentShader:ee,defines:x.defines,customVertexShaderID:Z,customFragmentShaderID:ot,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:u,batching:wt,batchingColor:wt&&N._colorsTexture!==null,instancing:Dt,instancingColor:Dt&&N.instanceColor!==null,instancingMorph:Dt&&N.morphTexture!==null,outputColorSpace:nt===null?s.outputColorSpace:nt.isXRRenderTarget===!0?nt.texture.colorSpace:ae.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:se,matcap:kt,envMap:tt,envMapMode:tt&&X.mapping,envMapCubeUVHeight:j,aoMap:it,lightMap:st,bumpMap:yt,normalMap:_t,displacementMap:Vt,emissiveMap:Nt,normalMapObjectSpace:_t&&x.normalMapType===ip,normalMapTangentSpace:_t&&x.normalMapType===bi,packedNormalMap:_t&&x.normalMapType===bi&&eS(x.normalMap.format),metalnessMap:qt,roughnessMap:Zt,anisotropy:U,anisotropyMap:W,clearcoat:me,clearcoatMap:q,clearcoatNormalMap:lt,clearcoatRoughnessMap:ht,dispersion:re,iridescence:R,iridescenceMap:$,iridescenceThicknessMap:Q,sheen:M,sheenColorMap:ft,sheenRoughnessMap:Ut,specularMap:xt,specularColorMap:pt,specularIntensityMap:Bt,transmission:V,transmissionMap:Ht,thicknessMap:Kt,gradientMap:B,opaque:x.transparent===!1&&x.blending===gs&&x.alphaToCoverage===!1,alphaMap:dt,alphaTest:K,alphaHash:mt,combine:x.combine,mapUv:se&&p(x.map.channel),aoMapUv:it&&p(x.aoMap.channel),lightMapUv:st&&p(x.lightMap.channel),bumpMapUv:yt&&p(x.bumpMap.channel),normalMapUv:_t&&p(x.normalMap.channel),displacementMapUv:Vt&&p(x.displacementMap.channel),emissiveMapUv:Nt&&p(x.emissiveMap.channel),metalnessMapUv:qt&&p(x.metalnessMap.channel),roughnessMapUv:Zt&&p(x.roughnessMap.channel),anisotropyMapUv:W&&p(x.anisotropyMap.channel),clearcoatMapUv:q&&p(x.clearcoatMap.channel),clearcoatNormalMapUv:lt&&p(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ht&&p(x.clearcoatRoughnessMap.channel),iridescenceMapUv:$&&p(x.iridescenceMap.channel),iridescenceThicknessMapUv:Q&&p(x.iridescenceThicknessMap.channel),sheenColorMapUv:ft&&p(x.sheenColorMap.channel),sheenRoughnessMapUv:Ut&&p(x.sheenRoughnessMap.channel),specularMapUv:xt&&p(x.specularMap.channel),specularColorMapUv:pt&&p(x.specularColorMap.channel),specularIntensityMapUv:Bt&&p(x.specularIntensityMap.channel),transmissionMapUv:Ht&&p(x.transmissionMap.channel),thicknessMapUv:Kt&&p(x.thicknessMap.channel),alphaMapUv:dt&&p(x.alphaMap.channel),vertexTangents:!!I.attributes.tangent&&(_t||U),vertexNormals:!!I.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!I.attributes.uv&&(se||dt),fog:!!F,useFog:x.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||I.attributes.normal===void 0&&_t===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Ct,skinning:N.isSkinnedMesh===!0,hasPositionAttribute:I.attributes.position!==void 0,morphTargets:I.morphAttributes.position!==void 0,morphNormals:I.morphAttributes.normal!==void 0,morphColors:I.morphAttributes.color!==void 0,morphTargetsCount:ct,morphTextureStride:Yt,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:P.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:s.shadowMap.enabled&&L.length>0,shadowMapType:s.shadowMap.type,toneMapping:et,decodeVideoTexture:se&&x.map.isVideoTexture===!0&&ae.getTransfer(x.map.colorSpace)===he,decodeVideoTextureEmissive:Nt&&x.emissiveMap.isVideoTexture===!0&&ae.getTransfer(x.emissiveMap.colorSpace)===he,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===en,flipSided:x.side===cn,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:bt&&x.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(bt&&x.extensions.multiDraw===!0||wt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Lt.vertexUv1s=l.has(1),Lt.vertexUv2s=l.has(2),Lt.vertexUv3s=l.has(3),l.clear(),Lt}function m(x){const w=[];if(x.shaderID?w.push(x.shaderID):(w.push(x.customVertexShaderID),w.push(x.customFragmentShaderID)),x.defines!==void 0)for(const L in x.defines)w.push(L),w.push(x.defines[L]);return x.isRawShaderMaterial===!1&&(g(w,x),v(w,x),w.push(s.outputColorSpace)),w.push(x.customProgramCacheKey),w.join()}function g(x,w){x.push(w.precision),x.push(w.outputColorSpace),x.push(w.envMapMode),x.push(w.envMapCubeUVHeight),x.push(w.mapUv),x.push(w.alphaMapUv),x.push(w.lightMapUv),x.push(w.aoMapUv),x.push(w.bumpMapUv),x.push(w.normalMapUv),x.push(w.displacementMapUv),x.push(w.emissiveMapUv),x.push(w.metalnessMapUv),x.push(w.roughnessMapUv),x.push(w.anisotropyMapUv),x.push(w.clearcoatMapUv),x.push(w.clearcoatNormalMapUv),x.push(w.clearcoatRoughnessMapUv),x.push(w.iridescenceMapUv),x.push(w.iridescenceThicknessMapUv),x.push(w.sheenColorMapUv),x.push(w.sheenRoughnessMapUv),x.push(w.specularMapUv),x.push(w.specularColorMapUv),x.push(w.specularIntensityMapUv),x.push(w.transmissionMapUv),x.push(w.thicknessMapUv),x.push(w.combine),x.push(w.fogExp2),x.push(w.sizeAttenuation),x.push(w.morphTargetsCount),x.push(w.morphAttributeCount),x.push(w.numDirLights),x.push(w.numPointLights),x.push(w.numSpotLights),x.push(w.numSpotLightMaps),x.push(w.numHemiLights),x.push(w.numRectAreaLights),x.push(w.numDirLightShadows),x.push(w.numPointLightShadows),x.push(w.numSpotLightShadows),x.push(w.numSpotLightShadowsWithMaps),x.push(w.numLightProbes),x.push(w.shadowMapType),x.push(w.toneMapping),x.push(w.numClippingPlanes),x.push(w.numClipIntersection),x.push(w.depthPacking)}function v(x,w){a.disableAll(),w.instancing&&a.enable(0),w.instancingColor&&a.enable(1),w.instancingMorph&&a.enable(2),w.matcap&&a.enable(3),w.envMap&&a.enable(4),w.normalMapObjectSpace&&a.enable(5),w.normalMapTangentSpace&&a.enable(6),w.clearcoat&&a.enable(7),w.iridescence&&a.enable(8),w.alphaTest&&a.enable(9),w.vertexColors&&a.enable(10),w.vertexAlphas&&a.enable(11),w.vertexUv1s&&a.enable(12),w.vertexUv2s&&a.enable(13),w.vertexUv3s&&a.enable(14),w.vertexTangents&&a.enable(15),w.anisotropy&&a.enable(16),w.alphaHash&&a.enable(17),w.batching&&a.enable(18),w.dispersion&&a.enable(19),w.batchingColor&&a.enable(20),w.gradientMap&&a.enable(21),w.packedNormalMap&&a.enable(22),w.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.reversedDepthBuffer&&a.enable(4),w.skinning&&a.enable(5),w.morphTargets&&a.enable(6),w.morphNormals&&a.enable(7),w.morphColors&&a.enable(8),w.premultipliedAlpha&&a.enable(9),w.shadowMapEnabled&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),w.decodeVideoTextureEmissive&&a.enable(20),w.alphaToCoverage&&a.enable(21),w.numLightProbeGrids>0&&a.enable(22),w.hasPositionAttribute&&a.enable(23),x.push(a.mask)}function b(x){const w=f[x.type];let L;if(w){const D=Gn[w];L=Op.clone(D.uniforms)}else L=x.uniforms;return L}function y(x,w){let L=h.get(w);return L!==void 0?++L.usedTimes:(L=new Kb(s,w,x,i),c.push(L),h.set(w,L)),L}function T(x){if(--x.usedTimes===0){const w=c.indexOf(x);c[w]=c[c.length-1],c.pop(),h.delete(x.cacheKey),x.destroy()}}function S(x){o.remove(x)}function A(){o.dispose()}return{getParameters:_,getProgramCacheKey:m,getUniforms:b,acquireProgram:y,releaseProgram:T,releaseShaderCache:S,programs:c,dispose:A}}function iS(){let s=new WeakMap;function t(a){return s.has(a)}function e(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function sS(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.materialVariant!==t.materialVariant?s.materialVariant-t.materialVariant:s.z!==t.z?s.z-t.z:s.id-t.id}function ff(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function pf(){const s=[];let t=0;const e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function a(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function o(u,f,p,_,m,g){let v=s[t];return v===void 0?(v={id:u.id,object:u,geometry:f,material:p,materialVariant:a(u),groupOrder:_,renderOrder:u.renderOrder,z:m,group:g},s[t]=v):(v.id=u.id,v.object=u,v.geometry=f,v.material=p,v.materialVariant=a(u),v.groupOrder=_,v.renderOrder=u.renderOrder,v.z=m,v.group=g),t++,v}function l(u,f,p,_,m,g){const v=o(u,f,p,_,m,g);p.transmission>0?n.push(v):p.transparent===!0?i.push(v):e.push(v)}function c(u,f,p,_,m,g){const v=o(u,f,p,_,m,g);p.transmission>0?n.unshift(v):p.transparent===!0?i.unshift(v):e.unshift(v)}function h(u,f,p){e.length>1&&e.sort(u||sS),n.length>1&&n.sort(f||ff),i.length>1&&i.sort(f||ff),p&&(e.reverse(),n.reverse(),i.reverse())}function d(){for(let u=t,f=s.length;u<f;u++){const p=s[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:l,unshift:c,finish:d,sort:h}}function rS(){let s=new WeakMap;function t(n,i){const r=s.get(n);let a;return r===void 0?(a=new pf,s.set(n,[a])):i>=r.length?(a=new pf,r.push(a)):a=r[i],a}function e(){s=new WeakMap}return{get:t,dispose:e}}function aS(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new C,color:new St};break;case"SpotLight":e={position:new C,direction:new C,color:new St,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new C,color:new St,distance:0,decay:0};break;case"HemisphereLight":e={direction:new C,skyColor:new St,groundColor:new St};break;case"RectAreaLight":e={color:new St,position:new C,halfWidth:new C,halfHeight:new C};break}return s[t.id]=e,e}}}function oS(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new J};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new J};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new J,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let lS=0;function cS(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function hS(s){const t=new aS,e=oS(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new C);const i=new C,r=new Xt,a=new Xt;function o(c){let h=0,d=0,u=0;for(let w=0;w<9;w++)n.probe[w].set(0,0,0);let f=0,p=0,_=0,m=0,g=0,v=0,b=0,y=0,T=0,S=0,A=0;c.sort(cS);for(let w=0,L=c.length;w<L;w++){const D=c[w],N=D.color,P=D.intensity,F=D.distance;let I=null;if(D.shadow&&D.shadow.map&&(D.shadow.map.texture.format===Wi?I=D.shadow.map.texture:I=D.shadow.map.depthTexture||D.shadow.map.texture),D.isAmbientLight)h+=N.r*P,d+=N.g*P,u+=N.b*P;else if(D.isLightProbe){for(let z=0;z<9;z++)n.probe[z].addScaledVector(D.sh.coefficients[z],P);A++}else if(D.isDirectionalLight){const z=t.get(D);if(z.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const O=D.shadow,X=e.get(D);X.shadowIntensity=O.intensity,X.shadowBias=O.bias,X.shadowNormalBias=O.normalBias,X.shadowRadius=O.radius,X.shadowMapSize=O.mapSize,n.directionalShadow[f]=X,n.directionalShadowMap[f]=I,n.directionalShadowMatrix[f]=D.shadow.matrix,v++}n.directional[f]=z,f++}else if(D.isSpotLight){const z=t.get(D);z.position.setFromMatrixPosition(D.matrixWorld),z.color.copy(N).multiplyScalar(P),z.distance=F,z.coneCos=Math.cos(D.angle),z.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),z.decay=D.decay,n.spot[_]=z;const O=D.shadow;if(D.map&&(n.spotLightMap[T]=D.map,T++,O.updateMatrices(D),D.castShadow&&S++),n.spotLightMatrix[_]=O.matrix,D.castShadow){const X=e.get(D);X.shadowIntensity=O.intensity,X.shadowBias=O.bias,X.shadowNormalBias=O.normalBias,X.shadowRadius=O.radius,X.shadowMapSize=O.mapSize,n.spotShadow[_]=X,n.spotShadowMap[_]=I,y++}_++}else if(D.isRectAreaLight){const z=t.get(D);z.color.copy(N).multiplyScalar(P),z.halfWidth.set(D.width*.5,0,0),z.halfHeight.set(0,D.height*.5,0),n.rectArea[m]=z,m++}else if(D.isPointLight){const z=t.get(D);if(z.color.copy(D.color).multiplyScalar(D.intensity),z.distance=D.distance,z.decay=D.decay,D.castShadow){const O=D.shadow,X=e.get(D);X.shadowIntensity=O.intensity,X.shadowBias=O.bias,X.shadowNormalBias=O.normalBias,X.shadowRadius=O.radius,X.shadowMapSize=O.mapSize,X.shadowCameraNear=O.camera.near,X.shadowCameraFar=O.camera.far,n.pointShadow[p]=X,n.pointShadowMap[p]=I,n.pointShadowMatrix[p]=D.shadow.matrix,b++}n.point[p]=z,p++}else if(D.isHemisphereLight){const z=t.get(D);z.skyColor.copy(D.color).multiplyScalar(P),z.groundColor.copy(D.groundColor).multiplyScalar(P),n.hemi[g]=z,g++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=gt.LTC_FLOAT_1,n.rectAreaLTC2=gt.LTC_FLOAT_2):(n.rectAreaLTC1=gt.LTC_HALF_1,n.rectAreaLTC2=gt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const x=n.hash;(x.directionalLength!==f||x.pointLength!==p||x.spotLength!==_||x.rectAreaLength!==m||x.hemiLength!==g||x.numDirectionalShadows!==v||x.numPointShadows!==b||x.numSpotShadows!==y||x.numSpotMaps!==T||x.numLightProbes!==A)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=p,n.hemi.length=g,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=b,n.pointShadowMap.length=b,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=b,n.spotLightMatrix.length=y+T-S,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=S,n.numLightProbes=A,x.directionalLength=f,x.pointLength=p,x.spotLength=_,x.rectAreaLength=m,x.hemiLength=g,x.numDirectionalShadows=v,x.numPointShadows=b,x.numSpotShadows=y,x.numSpotMaps=T,x.numLightProbes=A,n.version=lS++)}function l(c,h){let d=0,u=0,f=0,p=0,_=0;const m=h.matrixWorldInverse;for(let g=0,v=c.length;g<v;g++){const b=c[g];if(b.isDirectionalLight){const y=n.directional[d];y.direction.setFromMatrixPosition(b.matrixWorld),i.setFromMatrixPosition(b.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(m),d++}else if(b.isSpotLight){const y=n.spot[f];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(b.matrixWorld),i.setFromMatrixPosition(b.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(m),f++}else if(b.isRectAreaLight){const y=n.rectArea[p];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),a.identity(),r.copy(b.matrixWorld),r.premultiply(m),a.extractRotation(r),y.halfWidth.set(b.width*.5,0,0),y.halfHeight.set(0,b.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),p++}else if(b.isPointLight){const y=n.point[u];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),u++}else if(b.isHemisphereLight){const y=n.hemi[_];y.direction.setFromMatrixPosition(b.matrixWorld),y.direction.transformDirection(m),_++}}}return{setup:o,setupView:l,state:n}}function mf(s){const t=new hS(s),e=[],n=[],i=[];function r(u){d.camera=u,e.length=0,n.length=0,i.length=0}function a(u){e.push(u)}function o(u){n.push(u)}function l(u){i.push(u)}function c(){t.setup(e)}function h(u){t.setupView(e,u)}const d={lightsArray:e,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function uS(s){let t=new WeakMap;function e(i,r=0){const a=t.get(i);let o;return a===void 0?(o=new mf(s),t.set(i,[o])):r>=a.length?(o=new mf(s),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const dS=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,fS=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,pS=[new C(1,0,0),new C(-1,0,0),new C(0,1,0),new C(0,-1,0),new C(0,0,1),new C(0,0,-1)],mS=[new C(0,-1,0),new C(0,-1,0),new C(0,0,1),new C(0,0,-1),new C(0,-1,0),new C(0,-1,0)],gf=new Xt,Ur=new C,Zc=new C;function gS(s,t,e){let n=new Ss;const i=new J,r=new J,a=new pe,o=new iu,l=new su,c={},h=e.maxTextureSize,d={[Mi]:cn,[cn]:Mi,[en]:en},u=new On({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new J},radius:{value:4}},vertexShader:dS,fragmentShader:fS}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const p=new Jt;p.setAttribute("position",new xe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Gt(p,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Gr;let g=this.type;this.render=function(S,A,x){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;this.type===If&&(ut("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Gr);const w=s.getRenderTarget(),L=s.getActiveCubeFace(),D=s.getActiveMipmapLevel(),N=s.state;N.setBlending(ii),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const P=g!==this.type;P&&A.traverse(function(F){F.material&&(Array.isArray(F.material)?F.material.forEach(I=>I.needsUpdate=!0):F.material.needsUpdate=!0)});for(let F=0,I=S.length;F<I;F++){const z=S[F],O=z.shadow;if(O===void 0){ut("WebGLShadowMap:",z,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;i.copy(O.mapSize);const X=O.getFrameExtents();i.multiply(X),r.copy(O.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/X.x),i.x=r.x*X.x,O.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/X.y),i.y=r.y*X.y,O.mapSize.y=r.y));const j=s.state.buffers.depth.getReversed();if(O.camera._reversedDepth=j,O.map===null||P===!0){if(O.map!==null&&(O.map.depthTexture!==null&&(O.map.depthTexture.dispose(),O.map.depthTexture=null),O.map.dispose()),this.type===er){if(z.isPointLight){ut("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}O.map=new An(i.x,i.y,{format:Wi,type:ri,minFilter:we,magFilter:we,generateMipmaps:!1}),O.map.texture.name=z.name+".shadowMap",O.map.depthTexture=new ws(i.x,i.y,on),O.map.depthTexture.name=z.name+".shadowMapDepth",O.map.depthTexture.format=ai,O.map.depthTexture.compareFunction=null,O.map.depthTexture.minFilter=De,O.map.depthTexture.magFilter=De}else z.isPointLight?(O.map=new xu(i.x),O.map.depthTexture=new bp(i.x,Un)):(O.map=new An(i.x,i.y),O.map.depthTexture=new ws(i.x,i.y,Un)),O.map.depthTexture.name=z.name+".shadowMap",O.map.depthTexture.format=ai,this.type===Gr?(O.map.depthTexture.compareFunction=j?Al:Tl,O.map.depthTexture.minFilter=we,O.map.depthTexture.magFilter=we):(O.map.depthTexture.compareFunction=null,O.map.depthTexture.minFilter=De,O.map.depthTexture.magFilter=De);O.camera.updateProjectionMatrix()}const at=O.map.isWebGLCubeRenderTarget?6:1;for(let rt=0;rt<at;rt++){if(O.map.isWebGLCubeRenderTarget)s.setRenderTarget(O.map,rt),s.clear();else{rt===0&&(s.setRenderTarget(O.map),s.clear());const ct=O.getViewport(rt);a.set(r.x*ct.x,r.y*ct.y,r.x*ct.z,r.y*ct.w),N.viewport(a)}if(z.isPointLight){const ct=O.camera,Yt=O.matrix,ie=z.distance||ct.far;ie!==ct.far&&(ct.far=ie,ct.updateProjectionMatrix()),Ur.setFromMatrixPosition(z.matrixWorld),ct.position.copy(Ur),Zc.copy(ct.position),Zc.add(pS[rt]),ct.up.copy(mS[rt]),ct.lookAt(Zc),ct.updateMatrixWorld(),Yt.makeTranslation(-Ur.x,-Ur.y,-Ur.z),gf.multiplyMatrices(ct.projectionMatrix,ct.matrixWorldInverse),O._frustum.setFromProjectionMatrix(gf,ct.coordinateSystem,ct.reversedDepth)}else O.updateMatrices(z);n=O.getFrustum(),y(A,x,O.camera,z,this.type)}O.isPointLightShadow!==!0&&this.type===er&&v(O,x),O.needsUpdate=!1}g=this.type,m.needsUpdate=!1,s.setRenderTarget(w,L,D)};function v(S,A){const x=t.update(_);u.defines.VSM_SAMPLES!==S.blurSamples&&(u.defines.VSM_SAMPLES=S.blurSamples,f.defines.VSM_SAMPLES=S.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new An(i.x,i.y,{format:Wi,type:ri})),u.uniforms.shadow_pass.value=S.map.depthTexture,u.uniforms.resolution.value=S.mapSize,u.uniforms.radius.value=S.radius,s.setRenderTarget(S.mapPass),s.clear(),s.renderBufferDirect(A,null,x,u,_,null),f.uniforms.shadow_pass.value=S.mapPass.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,s.setRenderTarget(S.map),s.clear(),s.renderBufferDirect(A,null,x,f,_,null)}function b(S,A,x,w){let L=null;const D=x.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(D!==void 0)L=D;else if(L=x.isPointLight===!0?l:o,s.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const N=L.uuid,P=A.uuid;let F=c[N];F===void 0&&(F={},c[N]=F);let I=F[P];I===void 0&&(I=L.clone(),F[P]=I,A.addEventListener("dispose",T)),L=I}if(L.visible=A.visible,L.wireframe=A.wireframe,w===er?L.side=A.shadowSide!==null?A.shadowSide:A.side:L.side=A.shadowSide!==null?A.shadowSide:d[A.side],L.alphaMap=A.alphaMap,L.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,L.map=A.map,L.clipShadows=A.clipShadows,L.clippingPlanes=A.clippingPlanes,L.clipIntersection=A.clipIntersection,L.displacementMap=A.displacementMap,L.displacementScale=A.displacementScale,L.displacementBias=A.displacementBias,L.wireframeLinewidth=A.wireframeLinewidth,L.linewidth=A.linewidth,x.isPointLight===!0&&L.isMeshDistanceMaterial===!0){const N=s.properties.get(L);N.light=x}return L}function y(S,A,x,w,L){if(S.visible===!1)return;if(S.layers.test(A.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&L===er)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,S.matrixWorld);const P=t.update(S),F=S.material;if(Array.isArray(F)){const I=P.groups;for(let z=0,O=I.length;z<O;z++){const X=I[z],j=F[X.materialIndex];if(j&&j.visible){const at=b(S,j,w,L);S.onBeforeShadow(s,S,A,x,P,at,X),s.renderBufferDirect(x,null,P,at,S,X),S.onAfterShadow(s,S,A,x,P,at,X)}}}else if(F.visible){const I=b(S,F,w,L);S.onBeforeShadow(s,S,A,x,P,I,null),s.renderBufferDirect(x,null,P,I,S,null),S.onAfterShadow(s,S,A,x,P,I,null)}}const N=S.children;for(let P=0,F=N.length;P<F;P++)y(N[P],A,x,w,L)}function T(S){S.target.removeEventListener("dispose",T);for(const x in c){const w=c[x],L=S.target.uuid;L in w&&(w[L].dispose(),delete w[L])}}}function _S(s,t){function e(){let B=!1;const dt=new pe;let K=null;const mt=new pe(0,0,0,0);return{setMask:function(bt){K!==bt&&!B&&(s.colorMask(bt,bt,bt,bt),K=bt)},setLocked:function(bt){B=bt},setClear:function(bt,et,Lt,Rt,Ae){Ae===!0&&(bt*=Rt,et*=Rt,Lt*=Rt),dt.set(bt,et,Lt,Rt),mt.equals(dt)===!1&&(s.clearColor(bt,et,Lt,Rt),mt.copy(dt))},reset:function(){B=!1,K=null,mt.set(-1,0,0,0)}}}function n(){let B=!1,dt=!1,K=null,mt=null,bt=null;return{setReversed:function(et){if(dt!==et){const Lt=t.get("EXT_clip_control");et?Lt.clipControlEXT(Lt.LOWER_LEFT_EXT,Lt.ZERO_TO_ONE_EXT):Lt.clipControlEXT(Lt.LOWER_LEFT_EXT,Lt.NEGATIVE_ONE_TO_ONE_EXT),dt=et;const Rt=bt;bt=null,this.setClear(Rt)}},getReversed:function(){return dt},setTest:function(et){et?nt(s.DEPTH_TEST):Ct(s.DEPTH_TEST)},setMask:function(et){K!==et&&!B&&(s.depthMask(et),K=et)},setFunc:function(et){if(dt&&(et=F0[et]),mt!==et){switch(et){case To:s.depthFunc(s.NEVER);break;case Ao:s.depthFunc(s.ALWAYS);break;case Co:s.depthFunc(s.LESS);break;case vs:s.depthFunc(s.LEQUAL);break;case Ro:s.depthFunc(s.EQUAL);break;case Po:s.depthFunc(s.GEQUAL);break;case Io:s.depthFunc(s.GREATER);break;case Lo:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}mt=et}},setLocked:function(et){B=et},setClear:function(et){bt!==et&&(bt=et,dt&&(et=1-et),s.clearDepth(et))},reset:function(){B=!1,K=null,mt=null,bt=null,dt=!1}}}function i(){let B=!1,dt=null,K=null,mt=null,bt=null,et=null,Lt=null,Rt=null,Ae=null;return{setTest:function(be){B||(be?nt(s.STENCIL_TEST):Ct(s.STENCIL_TEST))},setMask:function(be){dt!==be&&!B&&(s.stencilMask(be),dt=be)},setFunc:function(be,Zn,Jn){(K!==be||mt!==Zn||bt!==Jn)&&(s.stencilFunc(be,Zn,Jn),K=be,mt=Zn,bt=Jn)},setOp:function(be,Zn,Jn){(et!==be||Lt!==Zn||Rt!==Jn)&&(s.stencilOp(be,Zn,Jn),et=be,Lt=Zn,Rt=Jn)},setLocked:function(be){B=be},setClear:function(be){Ae!==be&&(s.clearStencil(be),Ae=be)},reset:function(){B=!1,dt=null,K=null,mt=null,bt=null,et=null,Lt=null,Rt=null,Ae=null}}}const r=new e,a=new n,o=new i,l=new WeakMap,c=new WeakMap;let h={},d={},u={},f=new WeakMap,p=[],_=null,m=!1,g=null,v=null,b=null,y=null,T=null,S=null,A=null,x=new St(0,0,0),w=0,L=!1,D=null,N=null,P=null,F=null,I=null;const z=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let O=!1,X=0;const j=s.getParameter(s.VERSION);j.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(j)[1]),O=X>=1):j.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(j)[1]),O=X>=2);let at=null,rt={};const ct=s.getParameter(s.SCISSOR_BOX),Yt=s.getParameter(s.VIEWPORT),ie=new pe().fromArray(ct),ee=new pe().fromArray(Yt);function Z(B,dt,K,mt){const bt=new Uint8Array(4),et=s.createTexture();s.bindTexture(B,et),s.texParameteri(B,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(B,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Lt=0;Lt<K;Lt++)B===s.TEXTURE_3D||B===s.TEXTURE_2D_ARRAY?s.texImage3D(dt,0,s.RGBA,1,1,mt,0,s.RGBA,s.UNSIGNED_BYTE,bt):s.texImage2D(dt+Lt,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,bt);return et}const ot={};ot[s.TEXTURE_2D]=Z(s.TEXTURE_2D,s.TEXTURE_2D,1),ot[s.TEXTURE_CUBE_MAP]=Z(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),ot[s.TEXTURE_2D_ARRAY]=Z(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),ot[s.TEXTURE_3D]=Z(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),nt(s.DEPTH_TEST),a.setFunc(vs),yt(!1),_t(th),nt(s.CULL_FACE),it(ii);function nt(B){h[B]!==!0&&(s.enable(B),h[B]=!0)}function Ct(B){h[B]!==!1&&(s.disable(B),h[B]=!1)}function Dt(B,dt){return u[B]!==dt?(s.bindFramebuffer(B,dt),u[B]=dt,B===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=dt),B===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=dt),!0):!1}function wt(B,dt){let K=p,mt=!1;if(B){K=f.get(dt),K===void 0&&(K=[],f.set(dt,K));const bt=B.textures;if(K.length!==bt.length||K[0]!==s.COLOR_ATTACHMENT0){for(let et=0,Lt=bt.length;et<Lt;et++)K[et]=s.COLOR_ATTACHMENT0+et;K.length=bt.length,mt=!0}}else K[0]!==s.BACK&&(K[0]=s.BACK,mt=!0);mt&&s.drawBuffers(K)}function se(B){return _!==B?(s.useProgram(B),_=B,!0):!1}const kt={[Oi]:s.FUNC_ADD,[Df]:s.FUNC_SUBTRACT,[Nf]:s.FUNC_REVERSE_SUBTRACT};kt[Uf]=s.MIN,kt[Of]=s.MAX;const tt={[Ff]:s.ZERO,[Bf]:s.ONE,[kf]:s.SRC_COLOR,[wo]:s.SRC_ALPHA,[Xf]:s.SRC_ALPHA_SATURATE,[Hf]:s.DST_COLOR,[Vf]:s.DST_ALPHA,[zf]:s.ONE_MINUS_SRC_COLOR,[Eo]:s.ONE_MINUS_SRC_ALPHA,[Wf]:s.ONE_MINUS_DST_COLOR,[Gf]:s.ONE_MINUS_DST_ALPHA,[Yf]:s.CONSTANT_COLOR,[qf]:s.ONE_MINUS_CONSTANT_COLOR,[$f]:s.CONSTANT_ALPHA,[Zf]:s.ONE_MINUS_CONSTANT_ALPHA};function it(B,dt,K,mt,bt,et,Lt,Rt,Ae,be){if(B===ii){m===!0&&(Ct(s.BLEND),m=!1);return}if(m===!1&&(nt(s.BLEND),m=!0),B!==Lf){if(B!==g||be!==L){if((v!==Oi||T!==Oi)&&(s.blendEquation(s.FUNC_ADD),v=Oi,T=Oi),be)switch(B){case gs:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case eh:s.blendFunc(s.ONE,s.ONE);break;case nh:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case ih:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:It("WebGLState: Invalid blending: ",B);break}else switch(B){case gs:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case eh:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case nh:It("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ih:It("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:It("WebGLState: Invalid blending: ",B);break}b=null,y=null,S=null,A=null,x.set(0,0,0),w=0,g=B,L=be}return}bt=bt||dt,et=et||K,Lt=Lt||mt,(dt!==v||bt!==T)&&(s.blendEquationSeparate(kt[dt],kt[bt]),v=dt,T=bt),(K!==b||mt!==y||et!==S||Lt!==A)&&(s.blendFuncSeparate(tt[K],tt[mt],tt[et],tt[Lt]),b=K,y=mt,S=et,A=Lt),(Rt.equals(x)===!1||Ae!==w)&&(s.blendColor(Rt.r,Rt.g,Rt.b,Ae),x.copy(Rt),w=Ae),g=B,L=!1}function st(B,dt){B.side===en?Ct(s.CULL_FACE):nt(s.CULL_FACE);let K=B.side===cn;dt&&(K=!K),yt(K),B.blending===gs&&B.transparent===!1?it(ii):it(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),a.setFunc(B.depthFunc),a.setTest(B.depthTest),a.setMask(B.depthWrite),r.setMask(B.colorWrite);const mt=B.stencilWrite;o.setTest(mt),mt&&(o.setMask(B.stencilWriteMask),o.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),o.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),Nt(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?nt(s.SAMPLE_ALPHA_TO_COVERAGE):Ct(s.SAMPLE_ALPHA_TO_COVERAGE)}function yt(B){D!==B&&(B?s.frontFace(s.CW):s.frontFace(s.CCW),D=B)}function _t(B){B!==Rf?(nt(s.CULL_FACE),B!==N&&(B===th?s.cullFace(s.BACK):B===Pf?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Ct(s.CULL_FACE),N=B}function Vt(B){B!==P&&(O&&s.lineWidth(B),P=B)}function Nt(B,dt,K){B?(nt(s.POLYGON_OFFSET_FILL),(F!==dt||I!==K)&&(F=dt,I=K,a.getReversed()&&(dt=-dt),s.polygonOffset(dt,K))):Ct(s.POLYGON_OFFSET_FILL)}function qt(B){B?nt(s.SCISSOR_TEST):Ct(s.SCISSOR_TEST)}function Zt(B){B===void 0&&(B=s.TEXTURE0+z-1),at!==B&&(s.activeTexture(B),at=B)}function U(B,dt,K){K===void 0&&(at===null?K=s.TEXTURE0+z-1:K=at);let mt=rt[K];mt===void 0&&(mt={type:void 0,texture:void 0},rt[K]=mt),(mt.type!==B||mt.texture!==dt)&&(at!==K&&(s.activeTexture(K),at=K),s.bindTexture(B,dt||ot[B]),mt.type=B,mt.texture=dt)}function me(){const B=rt[at];B!==void 0&&B.type!==void 0&&(s.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function re(){try{s.compressedTexImage2D(...arguments)}catch(B){It("WebGLState:",B)}}function R(){try{s.compressedTexImage3D(...arguments)}catch(B){It("WebGLState:",B)}}function M(){try{s.texSubImage2D(...arguments)}catch(B){It("WebGLState:",B)}}function V(){try{s.texSubImage3D(...arguments)}catch(B){It("WebGLState:",B)}}function W(){try{s.compressedTexSubImage2D(...arguments)}catch(B){It("WebGLState:",B)}}function q(){try{s.compressedTexSubImage3D(...arguments)}catch(B){It("WebGLState:",B)}}function lt(){try{s.texStorage2D(...arguments)}catch(B){It("WebGLState:",B)}}function ht(){try{s.texStorage3D(...arguments)}catch(B){It("WebGLState:",B)}}function $(){try{s.texImage2D(...arguments)}catch(B){It("WebGLState:",B)}}function Q(){try{s.texImage3D(...arguments)}catch(B){It("WebGLState:",B)}}function ft(B){return d[B]!==void 0?d[B]:s.getParameter(B)}function Ut(B,dt){d[B]!==dt&&(s.pixelStorei(B,dt),d[B]=dt)}function xt(B){ie.equals(B)===!1&&(s.scissor(B.x,B.y,B.z,B.w),ie.copy(B))}function pt(B){ee.equals(B)===!1&&(s.viewport(B.x,B.y,B.z,B.w),ee.copy(B))}function Bt(B,dt){let K=c.get(dt);K===void 0&&(K=new WeakMap,c.set(dt,K));let mt=K.get(B);mt===void 0&&(mt=s.getUniformBlockIndex(dt,B.name),K.set(B,mt))}function Ht(B,dt){const mt=c.get(dt).get(B);l.get(dt)!==mt&&(s.uniformBlockBinding(dt,mt,B.__bindingPointIndex),l.set(dt,mt))}function Kt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),h={},d={},at=null,rt={},u={},f=new WeakMap,p=[],_=null,m=!1,g=null,v=null,b=null,y=null,T=null,S=null,A=null,x=new St(0,0,0),w=0,L=!1,D=null,N=null,P=null,F=null,I=null,ie.set(0,0,s.canvas.width,s.canvas.height),ee.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:nt,disable:Ct,bindFramebuffer:Dt,drawBuffers:wt,useProgram:se,setBlending:it,setMaterial:st,setFlipSided:yt,setCullFace:_t,setLineWidth:Vt,setPolygonOffset:Nt,setScissorTest:qt,activeTexture:Zt,bindTexture:U,unbindTexture:me,compressedTexImage2D:re,compressedTexImage3D:R,texImage2D:$,texImage3D:Q,pixelStorei:Ut,getParameter:ft,updateUBOMapping:Bt,uniformBlockBinding:Ht,texStorage2D:lt,texStorage3D:ht,texSubImage2D:M,texSubImage3D:V,compressedTexSubImage2D:W,compressedTexSubImage3D:q,scissor:xt,viewport:pt,reset:Kt}}function xS(s,t,e,n,i,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new J,h=new WeakMap,d=new Set;let u;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(R,M){return p?new OffscreenCanvas(R,M):oa("canvas")}function m(R,M,V){let W=1;const q=re(R);if((q.width>V||q.height>V)&&(W=V/Math.max(q.width,q.height)),W<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const lt=Math.floor(W*q.width),ht=Math.floor(W*q.height);u===void 0&&(u=_(lt,ht));const $=M?_(lt,ht):u;return $.width=lt,$.height=ht,$.getContext("2d").drawImage(R,0,0,lt,ht),ut("WebGLRenderer: Texture has been resized from ("+q.width+"x"+q.height+") to ("+lt+"x"+ht+")."),$}else return"data"in R&&ut("WebGLRenderer: Image in DataTexture is too big ("+q.width+"x"+q.height+")."),R;return R}function g(R){return R.generateMipmaps}function v(R){s.generateMipmap(R)}function b(R){return R.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?s.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function y(R,M,V,W,q,lt=!1){if(R!==null){if(s[R]!==void 0)return s[R];ut("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let ht;W&&(ht=t.get("EXT_texture_norm16"),ht||ut("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let $=M;if(M===s.RED&&(V===s.FLOAT&&($=s.R32F),V===s.HALF_FLOAT&&($=s.R16F),V===s.UNSIGNED_BYTE&&($=s.R8),V===s.UNSIGNED_SHORT&&ht&&($=ht.R16_EXT),V===s.SHORT&&ht&&($=ht.R16_SNORM_EXT)),M===s.RED_INTEGER&&(V===s.UNSIGNED_BYTE&&($=s.R8UI),V===s.UNSIGNED_SHORT&&($=s.R16UI),V===s.UNSIGNED_INT&&($=s.R32UI),V===s.BYTE&&($=s.R8I),V===s.SHORT&&($=s.R16I),V===s.INT&&($=s.R32I)),M===s.RG&&(V===s.FLOAT&&($=s.RG32F),V===s.HALF_FLOAT&&($=s.RG16F),V===s.UNSIGNED_BYTE&&($=s.RG8),V===s.UNSIGNED_SHORT&&ht&&($=ht.RG16_EXT),V===s.SHORT&&ht&&($=ht.RG16_SNORM_EXT)),M===s.RG_INTEGER&&(V===s.UNSIGNED_BYTE&&($=s.RG8UI),V===s.UNSIGNED_SHORT&&($=s.RG16UI),V===s.UNSIGNED_INT&&($=s.RG32UI),V===s.BYTE&&($=s.RG8I),V===s.SHORT&&($=s.RG16I),V===s.INT&&($=s.RG32I)),M===s.RGB_INTEGER&&(V===s.UNSIGNED_BYTE&&($=s.RGB8UI),V===s.UNSIGNED_SHORT&&($=s.RGB16UI),V===s.UNSIGNED_INT&&($=s.RGB32UI),V===s.BYTE&&($=s.RGB8I),V===s.SHORT&&($=s.RGB16I),V===s.INT&&($=s.RGB32I)),M===s.RGBA_INTEGER&&(V===s.UNSIGNED_BYTE&&($=s.RGBA8UI),V===s.UNSIGNED_SHORT&&($=s.RGBA16UI),V===s.UNSIGNED_INT&&($=s.RGBA32UI),V===s.BYTE&&($=s.RGBA8I),V===s.SHORT&&($=s.RGBA16I),V===s.INT&&($=s.RGBA32I)),M===s.RGB&&(V===s.UNSIGNED_SHORT&&ht&&($=ht.RGB16_EXT),V===s.SHORT&&ht&&($=ht.RGB16_SNORM_EXT),V===s.UNSIGNED_INT_5_9_9_9_REV&&($=s.RGB9_E5),V===s.UNSIGNED_INT_10F_11F_11F_REV&&($=s.R11F_G11F_B10F)),M===s.RGBA){const Q=lt?ra:ae.getTransfer(q);V===s.FLOAT&&($=s.RGBA32F),V===s.HALF_FLOAT&&($=s.RGBA16F),V===s.UNSIGNED_BYTE&&($=Q===he?s.SRGB8_ALPHA8:s.RGBA8),V===s.UNSIGNED_SHORT&&ht&&($=ht.RGBA16_EXT),V===s.SHORT&&ht&&($=ht.RGBA16_SNORM_EXT),V===s.UNSIGNED_SHORT_4_4_4_4&&($=s.RGBA4),V===s.UNSIGNED_SHORT_5_5_5_1&&($=s.RGB5_A1)}return($===s.R16F||$===s.R32F||$===s.RG16F||$===s.RG32F||$===s.RGBA16F||$===s.RGBA32F)&&t.get("EXT_color_buffer_float"),$}function T(R,M){let V;return R?M===null||M===Un||M===cr?V=s.DEPTH24_STENCIL8:M===on?V=s.DEPTH32F_STENCIL8:M===lr&&(V=s.DEPTH24_STENCIL8,ut("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===Un||M===cr?V=s.DEPTH_COMPONENT24:M===on?V=s.DEPTH_COMPONENT32F:M===lr&&(V=s.DEPTH_COMPONENT16),V}function S(R,M){return g(R)===!0||R.isFramebufferTexture&&R.minFilter!==De&&R.minFilter!==we?Math.log2(Math.max(M.width,M.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?M.mipmaps.length:1}function A(R){const M=R.target;M.removeEventListener("dispose",A),w(M),M.isVideoTexture&&h.delete(M),M.isHTMLTexture&&d.delete(M)}function x(R){const M=R.target;M.removeEventListener("dispose",x),D(M)}function w(R){const M=n.get(R);if(M.__webglInit===void 0)return;const V=R.source,W=f.get(V);if(W){const q=W[M.__cacheKey];q.usedTimes--,q.usedTimes===0&&L(R),Object.keys(W).length===0&&f.delete(V)}n.remove(R)}function L(R){const M=n.get(R);s.deleteTexture(M.__webglTexture);const V=R.source,W=f.get(V);delete W[M.__cacheKey],a.memory.textures--}function D(R){const M=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let W=0;W<6;W++){if(Array.isArray(M.__webglFramebuffer[W]))for(let q=0;q<M.__webglFramebuffer[W].length;q++)s.deleteFramebuffer(M.__webglFramebuffer[W][q]);else s.deleteFramebuffer(M.__webglFramebuffer[W]);M.__webglDepthbuffer&&s.deleteRenderbuffer(M.__webglDepthbuffer[W])}else{if(Array.isArray(M.__webglFramebuffer))for(let W=0;W<M.__webglFramebuffer.length;W++)s.deleteFramebuffer(M.__webglFramebuffer[W]);else s.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&s.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&s.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let W=0;W<M.__webglColorRenderbuffer.length;W++)M.__webglColorRenderbuffer[W]&&s.deleteRenderbuffer(M.__webglColorRenderbuffer[W]);M.__webglDepthRenderbuffer&&s.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const V=R.textures;for(let W=0,q=V.length;W<q;W++){const lt=n.get(V[W]);lt.__webglTexture&&(s.deleteTexture(lt.__webglTexture),a.memory.textures--),n.remove(V[W])}n.remove(R)}let N=0;function P(){N=0}function F(){return N}function I(R){N=R}function z(){const R=N;return R>=i.maxTextures&&ut("WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+i.maxTextures),N+=1,R}function O(R){const M=[];return M.push(R.wrapS),M.push(R.wrapT),M.push(R.wrapR||0),M.push(R.magFilter),M.push(R.minFilter),M.push(R.anisotropy),M.push(R.internalFormat),M.push(R.format),M.push(R.type),M.push(R.generateMipmaps),M.push(R.premultiplyAlpha),M.push(R.flipY),M.push(R.unpackAlignment),M.push(R.colorSpace),M.join()}function X(R,M){const V=n.get(R);if(R.isVideoTexture&&U(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&V.__version!==R.version){const W=R.image;if(W===null)ut("WebGLRenderer: Texture marked for update but no image data found.");else if(W.complete===!1)ut("WebGLRenderer: Texture marked for update but image is incomplete");else{Ct(V,R,M);return}}else R.isExternalTexture&&(V.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(s.TEXTURE_2D,V.__webglTexture,s.TEXTURE0+M)}function j(R,M){const V=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&V.__version!==R.version){Ct(V,R,M);return}else R.isExternalTexture&&(V.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(s.TEXTURE_2D_ARRAY,V.__webglTexture,s.TEXTURE0+M)}function at(R,M){const V=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&V.__version!==R.version){Ct(V,R,M);return}e.bindTexture(s.TEXTURE_3D,V.__webglTexture,s.TEXTURE0+M)}function rt(R,M){const V=n.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&V.__version!==R.version){Dt(V,R,M);return}e.bindTexture(s.TEXTURE_CUBE_MAP,V.__webglTexture,s.TEXTURE0+M)}const ct={[or]:s.REPEAT,[_n]:s.CLAMP_TO_EDGE,[Qr]:s.MIRRORED_REPEAT},Yt={[De]:s.NEAREST,[Lh]:s.NEAREST_MIPMAP_NEAREST,[nr]:s.NEAREST_MIPMAP_LINEAR,[we]:s.LINEAR,[Xr]:s.LINEAR_MIPMAP_NEAREST,[ti]:s.LINEAR_MIPMAP_LINEAR},ie={[sp]:s.NEVER,[cp]:s.ALWAYS,[rp]:s.LESS,[Tl]:s.LEQUAL,[ap]:s.EQUAL,[Al]:s.GEQUAL,[op]:s.GREATER,[lp]:s.NOTEQUAL};function ee(R,M){if(M.type===on&&t.has("OES_texture_float_linear")===!1&&(M.magFilter===we||M.magFilter===Xr||M.magFilter===nr||M.magFilter===ti||M.minFilter===we||M.minFilter===Xr||M.minFilter===nr||M.minFilter===ti)&&ut("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(R,s.TEXTURE_WRAP_S,ct[M.wrapS]),s.texParameteri(R,s.TEXTURE_WRAP_T,ct[M.wrapT]),(R===s.TEXTURE_3D||R===s.TEXTURE_2D_ARRAY)&&s.texParameteri(R,s.TEXTURE_WRAP_R,ct[M.wrapR]),s.texParameteri(R,s.TEXTURE_MAG_FILTER,Yt[M.magFilter]),s.texParameteri(R,s.TEXTURE_MIN_FILTER,Yt[M.minFilter]),M.compareFunction&&(s.texParameteri(R,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(R,s.TEXTURE_COMPARE_FUNC,ie[M.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===De||M.minFilter!==nr&&M.minFilter!==ti||M.type===on&&t.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){const V=t.get("EXT_texture_filter_anisotropic");s.texParameterf(R,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,i.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function Z(R,M){let V=!1;R.__webglInit===void 0&&(R.__webglInit=!0,M.addEventListener("dispose",A));const W=M.source;let q=f.get(W);q===void 0&&(q={},f.set(W,q));const lt=O(M);if(lt!==R.__cacheKey){q[lt]===void 0&&(q[lt]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,V=!0),q[lt].usedTimes++;const ht=q[R.__cacheKey];ht!==void 0&&(q[R.__cacheKey].usedTimes--,ht.usedTimes===0&&L(M)),R.__cacheKey=lt,R.__webglTexture=q[lt].texture}return V}function ot(R,M,V){return Math.floor(Math.floor(R/V)/M)}function nt(R,M,V,W){const lt=R.updateRanges;if(lt.length===0)e.texSubImage2D(s.TEXTURE_2D,0,0,0,M.width,M.height,V,W,M.data);else{lt.sort((Ut,xt)=>Ut.start-xt.start);let ht=0;for(let Ut=1;Ut<lt.length;Ut++){const xt=lt[ht],pt=lt[Ut],Bt=xt.start+xt.count,Ht=ot(pt.start,M.width,4),Kt=ot(xt.start,M.width,4);pt.start<=Bt+1&&Ht===Kt&&ot(pt.start+pt.count-1,M.width,4)===Ht?xt.count=Math.max(xt.count,pt.start+pt.count-xt.start):(++ht,lt[ht]=pt)}lt.length=ht+1;const $=e.getParameter(s.UNPACK_ROW_LENGTH),Q=e.getParameter(s.UNPACK_SKIP_PIXELS),ft=e.getParameter(s.UNPACK_SKIP_ROWS);e.pixelStorei(s.UNPACK_ROW_LENGTH,M.width);for(let Ut=0,xt=lt.length;Ut<xt;Ut++){const pt=lt[Ut],Bt=Math.floor(pt.start/4),Ht=Math.ceil(pt.count/4),Kt=Bt%M.width,B=Math.floor(Bt/M.width),dt=Ht,K=1;e.pixelStorei(s.UNPACK_SKIP_PIXELS,Kt),e.pixelStorei(s.UNPACK_SKIP_ROWS,B),e.texSubImage2D(s.TEXTURE_2D,0,Kt,B,dt,K,V,W,M.data)}R.clearUpdateRanges(),e.pixelStorei(s.UNPACK_ROW_LENGTH,$),e.pixelStorei(s.UNPACK_SKIP_PIXELS,Q),e.pixelStorei(s.UNPACK_SKIP_ROWS,ft)}}function Ct(R,M,V){let W=s.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(W=s.TEXTURE_2D_ARRAY),M.isData3DTexture&&(W=s.TEXTURE_3D);const q=Z(R,M),lt=M.source;e.bindTexture(W,R.__webglTexture,s.TEXTURE0+V);const ht=n.get(lt);if(lt.version!==ht.__version||q===!0){if(e.activeTexture(s.TEXTURE0+V),(typeof ImageBitmap<"u"&&M.image instanceof ImageBitmap)===!1){const K=ae.getPrimaries(ae.workingColorSpace),mt=M.colorSpace===xi?null:ae.getPrimaries(M.colorSpace),bt=M.colorSpace===xi||K===mt?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,M.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,bt)}e.pixelStorei(s.UNPACK_ALIGNMENT,M.unpackAlignment);let Q=m(M.image,!1,i.maxTextureSize);Q=me(M,Q);const ft=r.convert(M.format,M.colorSpace),Ut=r.convert(M.type);let xt=y(M.internalFormat,ft,Ut,M.normalized,M.colorSpace,M.isVideoTexture);ee(W,M);let pt;const Bt=M.mipmaps,Ht=M.isVideoTexture!==!0,Kt=ht.__version===void 0||q===!0,B=lt.dataReady,dt=S(M,Q);if(M.isDepthTexture)xt=T(M.format===Fi,M.type),Kt&&(Ht?e.texStorage2D(s.TEXTURE_2D,1,xt,Q.width,Q.height):e.texImage2D(s.TEXTURE_2D,0,xt,Q.width,Q.height,0,ft,Ut,null));else if(M.isDataTexture)if(Bt.length>0){Ht&&Kt&&e.texStorage2D(s.TEXTURE_2D,dt,xt,Bt[0].width,Bt[0].height);for(let K=0,mt=Bt.length;K<mt;K++)pt=Bt[K],Ht?B&&e.texSubImage2D(s.TEXTURE_2D,K,0,0,pt.width,pt.height,ft,Ut,pt.data):e.texImage2D(s.TEXTURE_2D,K,xt,pt.width,pt.height,0,ft,Ut,pt.data);M.generateMipmaps=!1}else Ht?(Kt&&e.texStorage2D(s.TEXTURE_2D,dt,xt,Q.width,Q.height),B&&nt(M,Q,ft,Ut)):e.texImage2D(s.TEXTURE_2D,0,xt,Q.width,Q.height,0,ft,Ut,Q.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Ht&&Kt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,dt,xt,Bt[0].width,Bt[0].height,Q.depth);for(let K=0,mt=Bt.length;K<mt;K++)if(pt=Bt[K],M.format!==ln)if(ft!==null)if(Ht){if(B)if(M.layerUpdates.size>0){const bt=gh(pt.width,pt.height,M.format,M.type);for(const et of M.layerUpdates){const Lt=pt.data.subarray(et*bt/pt.data.BYTES_PER_ELEMENT,(et+1)*bt/pt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,K,0,0,et,pt.width,pt.height,1,ft,Lt)}M.clearLayerUpdates()}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,K,0,0,0,pt.width,pt.height,Q.depth,ft,pt.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,K,xt,pt.width,pt.height,Q.depth,0,pt.data,0,0);else ut("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ht?B&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,K,0,0,0,pt.width,pt.height,Q.depth,ft,Ut,pt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,K,xt,pt.width,pt.height,Q.depth,0,ft,Ut,pt.data)}else{Ht&&Kt&&e.texStorage2D(s.TEXTURE_2D,dt,xt,Bt[0].width,Bt[0].height);for(let K=0,mt=Bt.length;K<mt;K++)pt=Bt[K],M.format!==ln?ft!==null?Ht?B&&e.compressedTexSubImage2D(s.TEXTURE_2D,K,0,0,pt.width,pt.height,ft,pt.data):e.compressedTexImage2D(s.TEXTURE_2D,K,xt,pt.width,pt.height,0,pt.data):ut("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ht?B&&e.texSubImage2D(s.TEXTURE_2D,K,0,0,pt.width,pt.height,ft,Ut,pt.data):e.texImage2D(s.TEXTURE_2D,K,xt,pt.width,pt.height,0,ft,Ut,pt.data)}else if(M.isDataArrayTexture)if(Ht){if(Kt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,dt,xt,Q.width,Q.height,Q.depth),B)if(M.layerUpdates.size>0){const K=gh(Q.width,Q.height,M.format,M.type);for(const mt of M.layerUpdates){const bt=Q.data.subarray(mt*K/Q.data.BYTES_PER_ELEMENT,(mt+1)*K/Q.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,mt,Q.width,Q.height,1,ft,Ut,bt)}M.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,ft,Ut,Q.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,xt,Q.width,Q.height,Q.depth,0,ft,Ut,Q.data);else if(M.isData3DTexture)Ht?(Kt&&e.texStorage3D(s.TEXTURE_3D,dt,xt,Q.width,Q.height,Q.depth),B&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,ft,Ut,Q.data)):e.texImage3D(s.TEXTURE_3D,0,xt,Q.width,Q.height,Q.depth,0,ft,Ut,Q.data);else if(M.isFramebufferTexture){if(Kt)if(Ht)e.texStorage2D(s.TEXTURE_2D,dt,xt,Q.width,Q.height);else{let K=Q.width,mt=Q.height;for(let bt=0;bt<dt;bt++)e.texImage2D(s.TEXTURE_2D,bt,xt,K,mt,0,ft,Ut,null),K>>=1,mt>>=1}}else if(M.isHTMLTexture){if("texElementImage2D"in s){const K=s.canvas;if(K.hasAttribute("layoutsubtree")||K.setAttribute("layoutsubtree","true"),Q.parentNode!==K){K.appendChild(Q),d.add(M),K.onpaint=mt=>{const bt=mt.changedElements;for(const et of d)bt.includes(et.image)&&(et.needsUpdate=!0)},K.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,Q);else{const bt=s.RGBA,et=s.RGBA,Lt=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,bt,et,Lt,Q)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Bt.length>0){if(Ht&&Kt){const K=re(Bt[0]);e.texStorage2D(s.TEXTURE_2D,dt,xt,K.width,K.height)}for(let K=0,mt=Bt.length;K<mt;K++)pt=Bt[K],Ht?B&&e.texSubImage2D(s.TEXTURE_2D,K,0,0,ft,Ut,pt):e.texImage2D(s.TEXTURE_2D,K,xt,ft,Ut,pt);M.generateMipmaps=!1}else if(Ht){if(Kt){const K=re(Q);e.texStorage2D(s.TEXTURE_2D,dt,xt,K.width,K.height)}B&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,ft,Ut,Q)}else e.texImage2D(s.TEXTURE_2D,0,xt,ft,Ut,Q);g(M)&&v(W),ht.__version=lt.version,M.onUpdate&&M.onUpdate(M)}R.__version=M.version}function Dt(R,M,V){if(M.image.length!==6)return;const W=Z(R,M),q=M.source;e.bindTexture(s.TEXTURE_CUBE_MAP,R.__webglTexture,s.TEXTURE0+V);const lt=n.get(q);if(q.version!==lt.__version||W===!0){e.activeTexture(s.TEXTURE0+V);const ht=ae.getPrimaries(ae.workingColorSpace),$=M.colorSpace===xi?null:ae.getPrimaries(M.colorSpace),Q=M.colorSpace===xi||ht===$?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,M.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),e.pixelStorei(s.UNPACK_ALIGNMENT,M.unpackAlignment),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Q);const ft=M.isCompressedTexture||M.image[0].isCompressedTexture,Ut=M.image[0]&&M.image[0].isDataTexture,xt=[];for(let et=0;et<6;et++)!ft&&!Ut?xt[et]=m(M.image[et],!0,i.maxCubemapSize):xt[et]=Ut?M.image[et].image:M.image[et],xt[et]=me(M,xt[et]);const pt=xt[0],Bt=r.convert(M.format,M.colorSpace),Ht=r.convert(M.type),Kt=y(M.internalFormat,Bt,Ht,M.normalized,M.colorSpace),B=M.isVideoTexture!==!0,dt=lt.__version===void 0||W===!0,K=q.dataReady;let mt=S(M,pt);ee(s.TEXTURE_CUBE_MAP,M);let bt;if(ft){B&&dt&&e.texStorage2D(s.TEXTURE_CUBE_MAP,mt,Kt,pt.width,pt.height);for(let et=0;et<6;et++){bt=xt[et].mipmaps;for(let Lt=0;Lt<bt.length;Lt++){const Rt=bt[Lt];M.format!==ln?Bt!==null?B?K&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Lt,0,0,Rt.width,Rt.height,Bt,Rt.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Lt,Kt,Rt.width,Rt.height,0,Rt.data):ut("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):B?K&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Lt,0,0,Rt.width,Rt.height,Bt,Ht,Rt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Lt,Kt,Rt.width,Rt.height,0,Bt,Ht,Rt.data)}}}else{if(bt=M.mipmaps,B&&dt){bt.length>0&&mt++;const et=re(xt[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,mt,Kt,et.width,et.height)}for(let et=0;et<6;et++)if(Ut){B?K&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,xt[et].width,xt[et].height,Bt,Ht,xt[et].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,Kt,xt[et].width,xt[et].height,0,Bt,Ht,xt[et].data);for(let Lt=0;Lt<bt.length;Lt++){const Ae=bt[Lt].image[et].image;B?K&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Lt+1,0,0,Ae.width,Ae.height,Bt,Ht,Ae.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Lt+1,Kt,Ae.width,Ae.height,0,Bt,Ht,Ae.data)}}else{B?K&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,Bt,Ht,xt[et]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,Kt,Bt,Ht,xt[et]);for(let Lt=0;Lt<bt.length;Lt++){const Rt=bt[Lt];B?K&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Lt+1,0,0,Bt,Ht,Rt.image[et]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Lt+1,Kt,Bt,Ht,Rt.image[et])}}}g(M)&&v(s.TEXTURE_CUBE_MAP),lt.__version=q.version,M.onUpdate&&M.onUpdate(M)}R.__version=M.version}function wt(R,M,V,W,q,lt){const ht=r.convert(V.format,V.colorSpace),$=r.convert(V.type),Q=y(V.internalFormat,ht,$,V.normalized,V.colorSpace),ft=n.get(M),Ut=n.get(V);if(Ut.__renderTarget=M,!ft.__hasExternalTextures){const xt=Math.max(1,M.width>>lt),pt=Math.max(1,M.height>>lt);q===s.TEXTURE_3D||q===s.TEXTURE_2D_ARRAY?e.texImage3D(q,lt,Q,xt,pt,M.depth,0,ht,$,null):e.texImage2D(q,lt,Q,xt,pt,0,ht,$,null)}e.bindFramebuffer(s.FRAMEBUFFER,R),Zt(M)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,W,q,Ut.__webglTexture,0,qt(M)):(q===s.TEXTURE_2D||q>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&q<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,W,q,Ut.__webglTexture,lt),e.bindFramebuffer(s.FRAMEBUFFER,null)}function se(R,M,V){if(s.bindRenderbuffer(s.RENDERBUFFER,R),M.depthBuffer){const W=M.depthTexture,q=W&&W.isDepthTexture?W.type:null,lt=T(M.stencilBuffer,q),ht=M.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;Zt(M)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,qt(M),lt,M.width,M.height):V?s.renderbufferStorageMultisample(s.RENDERBUFFER,qt(M),lt,M.width,M.height):s.renderbufferStorage(s.RENDERBUFFER,lt,M.width,M.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,ht,s.RENDERBUFFER,R)}else{const W=M.textures;for(let q=0;q<W.length;q++){const lt=W[q],ht=r.convert(lt.format,lt.colorSpace),$=r.convert(lt.type),Q=y(lt.internalFormat,ht,$,lt.normalized,lt.colorSpace);Zt(M)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,qt(M),Q,M.width,M.height):V?s.renderbufferStorageMultisample(s.RENDERBUFFER,qt(M),Q,M.width,M.height):s.renderbufferStorage(s.RENDERBUFFER,Q,M.width,M.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function kt(R,M,V){const W=M.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(s.FRAMEBUFFER,R),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const q=n.get(M.depthTexture);if(q.__renderTarget=M,(!q.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),W){if(q.__webglInit===void 0&&(q.__webglInit=!0,M.depthTexture.addEventListener("dispose",A)),q.__webglTexture===void 0){q.__webglTexture=s.createTexture(),e.bindTexture(s.TEXTURE_CUBE_MAP,q.__webglTexture),ee(s.TEXTURE_CUBE_MAP,M.depthTexture);const ft=r.convert(M.depthTexture.format),Ut=r.convert(M.depthTexture.type);let xt;M.depthTexture.format===ai?xt=s.DEPTH_COMPONENT24:M.depthTexture.format===Fi&&(xt=s.DEPTH24_STENCIL8);for(let pt=0;pt<6;pt++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0,xt,M.width,M.height,0,ft,Ut,null)}}else X(M.depthTexture,0);const lt=q.__webglTexture,ht=qt(M),$=W?s.TEXTURE_CUBE_MAP_POSITIVE_X+V:s.TEXTURE_2D,Q=M.depthTexture.format===Fi?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(M.depthTexture.format===ai)Zt(M)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Q,$,lt,0,ht):s.framebufferTexture2D(s.FRAMEBUFFER,Q,$,lt,0);else if(M.depthTexture.format===Fi)Zt(M)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Q,$,lt,0,ht):s.framebufferTexture2D(s.FRAMEBUFFER,Q,$,lt,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function tt(R){const M=n.get(R),V=R.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==R.depthTexture){const W=R.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),W){const q=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,W.removeEventListener("dispose",q)};W.addEventListener("dispose",q),M.__depthDisposeCallback=q}M.__boundDepthTexture=W}if(R.depthTexture&&!M.__autoAllocateDepthBuffer)if(V)for(let W=0;W<6;W++)kt(M.__webglFramebuffer[W],R,W);else{const W=R.texture.mipmaps;W&&W.length>0?kt(M.__webglFramebuffer[0],R,0):kt(M.__webglFramebuffer,R,0)}else if(V){M.__webglDepthbuffer=[];for(let W=0;W<6;W++)if(e.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer[W]),M.__webglDepthbuffer[W]===void 0)M.__webglDepthbuffer[W]=s.createRenderbuffer(),se(M.__webglDepthbuffer[W],R,!1);else{const q=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,lt=M.__webglDepthbuffer[W];s.bindRenderbuffer(s.RENDERBUFFER,lt),s.framebufferRenderbuffer(s.FRAMEBUFFER,q,s.RENDERBUFFER,lt)}}else{const W=R.texture.mipmaps;if(W&&W.length>0?e.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer[0]):e.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=s.createRenderbuffer(),se(M.__webglDepthbuffer,R,!1);else{const q=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,lt=M.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,lt),s.framebufferRenderbuffer(s.FRAMEBUFFER,q,s.RENDERBUFFER,lt)}}e.bindFramebuffer(s.FRAMEBUFFER,null)}function it(R,M,V){const W=n.get(R);M!==void 0&&wt(W.__webglFramebuffer,R,R.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),V!==void 0&&tt(R)}function st(R){const M=R.texture,V=n.get(R),W=n.get(M);R.addEventListener("dispose",x);const q=R.textures,lt=R.isWebGLCubeRenderTarget===!0,ht=q.length>1;if(ht||(W.__webglTexture===void 0&&(W.__webglTexture=s.createTexture()),W.__version=M.version,a.memory.textures++),lt){V.__webglFramebuffer=[];for(let $=0;$<6;$++)if(M.mipmaps&&M.mipmaps.length>0){V.__webglFramebuffer[$]=[];for(let Q=0;Q<M.mipmaps.length;Q++)V.__webglFramebuffer[$][Q]=s.createFramebuffer()}else V.__webglFramebuffer[$]=s.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){V.__webglFramebuffer=[];for(let $=0;$<M.mipmaps.length;$++)V.__webglFramebuffer[$]=s.createFramebuffer()}else V.__webglFramebuffer=s.createFramebuffer();if(ht)for(let $=0,Q=q.length;$<Q;$++){const ft=n.get(q[$]);ft.__webglTexture===void 0&&(ft.__webglTexture=s.createTexture(),a.memory.textures++)}if(R.samples>0&&Zt(R)===!1){V.__webglMultisampledFramebuffer=s.createFramebuffer(),V.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let $=0;$<q.length;$++){const Q=q[$];V.__webglColorRenderbuffer[$]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,V.__webglColorRenderbuffer[$]);const ft=r.convert(Q.format,Q.colorSpace),Ut=r.convert(Q.type),xt=y(Q.internalFormat,ft,Ut,Q.normalized,Q.colorSpace,R.isXRRenderTarget===!0),pt=qt(R);s.renderbufferStorageMultisample(s.RENDERBUFFER,pt,xt,R.width,R.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+$,s.RENDERBUFFER,V.__webglColorRenderbuffer[$])}s.bindRenderbuffer(s.RENDERBUFFER,null),R.depthBuffer&&(V.__webglDepthRenderbuffer=s.createRenderbuffer(),se(V.__webglDepthRenderbuffer,R,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(lt){e.bindTexture(s.TEXTURE_CUBE_MAP,W.__webglTexture),ee(s.TEXTURE_CUBE_MAP,M);for(let $=0;$<6;$++)if(M.mipmaps&&M.mipmaps.length>0)for(let Q=0;Q<M.mipmaps.length;Q++)wt(V.__webglFramebuffer[$][Q],R,M,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+$,Q);else wt(V.__webglFramebuffer[$],R,M,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0);g(M)&&v(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ht){for(let $=0,Q=q.length;$<Q;$++){const ft=q[$],Ut=n.get(ft);let xt=s.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(xt=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(xt,Ut.__webglTexture),ee(xt,ft),wt(V.__webglFramebuffer,R,ft,s.COLOR_ATTACHMENT0+$,xt,0),g(ft)&&v(xt)}e.unbindTexture()}else{let $=s.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&($=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture($,W.__webglTexture),ee($,M),M.mipmaps&&M.mipmaps.length>0)for(let Q=0;Q<M.mipmaps.length;Q++)wt(V.__webglFramebuffer[Q],R,M,s.COLOR_ATTACHMENT0,$,Q);else wt(V.__webglFramebuffer,R,M,s.COLOR_ATTACHMENT0,$,0);g(M)&&v($),e.unbindTexture()}R.depthBuffer&&tt(R)}function yt(R){const M=R.textures;for(let V=0,W=M.length;V<W;V++){const q=M[V];if(g(q)){const lt=b(R),ht=n.get(q).__webglTexture;e.bindTexture(lt,ht),v(lt),e.unbindTexture()}}}const _t=[],Vt=[];function Nt(R){if(R.samples>0){if(Zt(R)===!1){const M=R.textures,V=R.width,W=R.height;let q=s.COLOR_BUFFER_BIT;const lt=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ht=n.get(R),$=M.length>1;if($)for(let ft=0;ft<M.length;ft++)e.bindFramebuffer(s.FRAMEBUFFER,ht.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ft,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,ht.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ft,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,ht.__webglMultisampledFramebuffer);const Q=R.texture.mipmaps;Q&&Q.length>0?e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ht.__webglFramebuffer[0]):e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ht.__webglFramebuffer);for(let ft=0;ft<M.length;ft++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(q|=s.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(q|=s.STENCIL_BUFFER_BIT)),$){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,ht.__webglColorRenderbuffer[ft]);const Ut=n.get(M[ft]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Ut,0)}s.blitFramebuffer(0,0,V,W,0,0,V,W,q,s.NEAREST),l===!0&&(_t.length=0,Vt.length=0,_t.push(s.COLOR_ATTACHMENT0+ft),R.depthBuffer&&R.resolveDepthBuffer===!1&&(_t.push(lt),Vt.push(lt),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Vt)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,_t))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),$)for(let ft=0;ft<M.length;ft++){e.bindFramebuffer(s.FRAMEBUFFER,ht.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ft,s.RENDERBUFFER,ht.__webglColorRenderbuffer[ft]);const Ut=n.get(M[ft]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,ht.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ft,s.TEXTURE_2D,Ut,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ht.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const M=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[M])}}}function qt(R){return Math.min(i.maxSamples,R.samples)}function Zt(R){const M=n.get(R);return R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function U(R){const M=a.render.frame;h.get(R)!==M&&(h.set(R,M),R.update())}function me(R,M){const V=R.colorSpace,W=R.format,q=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||V!==sa&&V!==xi&&(ae.getTransfer(V)===he?(W!==ln||q!==mn)&&ut("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):It("WebGLTextures: Unsupported texture color space:",V)),M}function re(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=z,this.resetTextureUnits=P,this.getTextureUnits=F,this.setTextureUnits=I,this.setTexture2D=X,this.setTexture2DArray=j,this.setTexture3D=at,this.setTextureCube=rt,this.rebindTextures=it,this.setupRenderTarget=st,this.updateRenderTargetMipmap=yt,this.updateMultisampleRenderTarget=Nt,this.setupDepthRenderbuffer=tt,this.setupFrameBufferTexture=wt,this.useMultisampledRTT=Zt,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function gm(s,t){function e(n,i=xi){let r;const a=ae.getTransfer(i);if(n===mn)return s.UNSIGNED_BYTE;if(n===vl)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Ml)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Uh)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Oh)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===Dh)return s.BYTE;if(n===Nh)return s.SHORT;if(n===lr)return s.UNSIGNED_SHORT;if(n===yl)return s.INT;if(n===Un)return s.UNSIGNED_INT;if(n===on)return s.FLOAT;if(n===ri)return s.HALF_FLOAT;if(n===Fh)return s.ALPHA;if(n===Bh)return s.RGB;if(n===ln)return s.RGBA;if(n===ai)return s.DEPTH_COMPONENT;if(n===Fi)return s.DEPTH_STENCIL;if(n===bl)return s.RED;if(n===_a)return s.RED_INTEGER;if(n===Wi)return s.RG;if(n===Sl)return s.RG_INTEGER;if(n===wl)return s.RGBA_INTEGER;if(n===Yr||n===qr||n===$r||n===Zr)if(a===he)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Yr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===qr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===$r)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Zr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Yr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===qr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===$r)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Zr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Do||n===No||n===Uo||n===Oo)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Do)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===No)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Uo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Oo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Fo||n===Bo||n===ko||n===zo||n===Vo||n===ta||n===Go)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Fo||n===Bo)return a===he?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ko)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===zo)return r.COMPRESSED_R11_EAC;if(n===Vo)return r.COMPRESSED_SIGNED_R11_EAC;if(n===ta)return r.COMPRESSED_RG11_EAC;if(n===Go)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Ho||n===Wo||n===Xo||n===Yo||n===qo||n===$o||n===Zo||n===Jo||n===Ko||n===jo||n===Qo||n===tl||n===el||n===nl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Ho)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Wo)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Xo)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Yo)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===qo)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===$o)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Zo)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Jo)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ko)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===jo)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Qo)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===tl)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===el)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===nl)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===il||n===sl||n===rl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===il)return a===he?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===sl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===rl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===al||n===ol||n===ea||n===ll)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===al)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ol)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ea)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ll)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===cr?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}const yS=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,vS=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class MS{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Zh(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new On({vertexShader:yS,fragmentShader:vS,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Gt(new li(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class bS extends qn{constructor(t,e){super();const n=this;let i=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,p=null;const _=typeof XRWebGLBinding<"u",m=new MS,g={},v=e.getContextAttributes();let b=null,y=null;const T=[],S=[],A=new J;let x=null;const w=new Ve;w.viewport=new pe;const L=new Ve;L.viewport=new pe;const D=[w,L],N=new nm;let P=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let ot=T[Z];return ot===void 0&&(ot=new Mo,T[Z]=ot),ot.getTargetRaySpace()},this.getControllerGrip=function(Z){let ot=T[Z];return ot===void 0&&(ot=new Mo,T[Z]=ot),ot.getGripSpace()},this.getHand=function(Z){let ot=T[Z];return ot===void 0&&(ot=new Mo,T[Z]=ot),ot.getHandSpace()};function I(Z){const ot=S.indexOf(Z.inputSource);if(ot===-1)return;const nt=T[ot];nt!==void 0&&(nt.update(Z.inputSource,Z.frame,c||a),nt.dispatchEvent({type:Z.type,data:Z.inputSource}))}function z(){i.removeEventListener("select",I),i.removeEventListener("selectstart",I),i.removeEventListener("selectend",I),i.removeEventListener("squeeze",I),i.removeEventListener("squeezestart",I),i.removeEventListener("squeezeend",I),i.removeEventListener("end",z),i.removeEventListener("inputsourceschange",O);for(let Z=0;Z<T.length;Z++){const ot=S[Z];ot!==null&&(S[Z]=null,T[Z].disconnect(ot))}P=null,F=null,m.reset();for(const Z in g)delete g[Z];t.setRenderTarget(b),f=null,u=null,d=null,i=null,y=null,ee.stop(),n.isPresenting=!1,t.setPixelRatio(x),t.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&ut("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,n.isPresenting===!0&&ut("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&_&&(d=new XRWebGLBinding(i,e)),d},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(Z){if(i=Z,i!==null){if(b=t.getRenderTarget(),i.addEventListener("select",I),i.addEventListener("selectstart",I),i.addEventListener("selectend",I),i.addEventListener("squeeze",I),i.addEventListener("squeezestart",I),i.addEventListener("squeezeend",I),i.addEventListener("end",z),i.addEventListener("inputsourceschange",O),v.xrCompatible!==!0&&await e.makeXRCompatible(),x=t.getPixelRatio(),t.getSize(A),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let nt=null,Ct=null,Dt=null;v.depth&&(Dt=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,nt=v.stencil?Fi:ai,Ct=v.stencil?cr:Un);const wt={colorFormat:e.RGBA8,depthFormat:Dt,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(wt),i.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),y=new An(u.textureWidth,u.textureHeight,{format:ln,type:mn,depthTexture:new ws(u.textureWidth,u.textureHeight,Ct,void 0,void 0,void 0,void 0,void 0,void 0,nt),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const nt={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,e,nt),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new An(f.framebufferWidth,f.framebufferHeight,{format:ln,type:mn,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),ee.setContext(i),ee.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function O(Z){for(let ot=0;ot<Z.removed.length;ot++){const nt=Z.removed[ot],Ct=S.indexOf(nt);Ct>=0&&(S[Ct]=null,T[Ct].disconnect(nt))}for(let ot=0;ot<Z.added.length;ot++){const nt=Z.added[ot];let Ct=S.indexOf(nt);if(Ct===-1){for(let wt=0;wt<T.length;wt++)if(wt>=S.length){S.push(nt),Ct=wt;break}else if(S[wt]===null){S[wt]=nt,Ct=wt;break}if(Ct===-1)break}const Dt=T[Ct];Dt&&Dt.connect(nt)}}const X=new C,j=new C;function at(Z,ot,nt){X.setFromMatrixPosition(ot.matrixWorld),j.setFromMatrixPosition(nt.matrixWorld);const Ct=X.distanceTo(j),Dt=ot.projectionMatrix.elements,wt=nt.projectionMatrix.elements,se=Dt[14]/(Dt[10]-1),kt=Dt[14]/(Dt[10]+1),tt=(Dt[9]+1)/Dt[5],it=(Dt[9]-1)/Dt[5],st=(Dt[8]-1)/Dt[0],yt=(wt[8]+1)/wt[0],_t=se*st,Vt=se*yt,Nt=Ct/(-st+yt),qt=Nt*-st;if(ot.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(qt),Z.translateZ(Nt),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),Dt[10]===-1)Z.projectionMatrix.copy(ot.projectionMatrix),Z.projectionMatrixInverse.copy(ot.projectionMatrixInverse);else{const Zt=se+Nt,U=kt+Nt,me=_t-qt,re=Vt+(Ct-qt),R=tt*kt/U*Zt,M=it*kt/U*Zt;Z.projectionMatrix.makePerspective(me,re,R,M,Zt,U),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function rt(Z,ot){ot===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(ot.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(i===null)return;let ot=Z.near,nt=Z.far;m.texture!==null&&(m.depthNear>0&&(ot=m.depthNear),m.depthFar>0&&(nt=m.depthFar)),N.near=L.near=w.near=ot,N.far=L.far=w.far=nt,(P!==N.near||F!==N.far)&&(i.updateRenderState({depthNear:N.near,depthFar:N.far}),P=N.near,F=N.far),N.layers.mask=Z.layers.mask|6,w.layers.mask=N.layers.mask&-5,L.layers.mask=N.layers.mask&-3;const Ct=Z.parent,Dt=N.cameras;rt(N,Ct);for(let wt=0;wt<Dt.length;wt++)rt(Dt[wt],Ct);Dt.length===2?at(N,w,L):N.projectionMatrix.copy(w.projectionMatrix),ct(Z,N,Ct)};function ct(Z,ot,nt){nt===null?Z.matrix.copy(ot.matrixWorld):(Z.matrix.copy(nt.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(ot.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(ot.projectionMatrix),Z.projectionMatrixInverse.copy(ot.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=hr*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(Z){l=Z,u!==null&&(u.fixedFoveation=Z),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Z)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(N)},this.getCameraTexture=function(Z){return g[Z]};let Yt=null;function ie(Z,ot){if(h=ot.getViewerPose(c||a),p=ot,h!==null){const nt=h.views;f!==null&&(t.setRenderTargetFramebuffer(y,f.framebuffer),t.setRenderTarget(y));let Ct=!1;nt.length!==N.cameras.length&&(N.cameras.length=0,Ct=!0);for(let kt=0;kt<nt.length;kt++){const tt=nt[kt];let it=null;if(f!==null)it=f.getViewport(tt);else{const yt=d.getViewSubImage(u,tt);it=yt.viewport,kt===0&&(t.setRenderTargetTextures(y,yt.colorTexture,yt.depthStencilTexture),t.setRenderTarget(y))}let st=D[kt];st===void 0&&(st=new Ve,st.layers.enable(kt),st.viewport=new pe,D[kt]=st),st.matrix.fromArray(tt.transform.matrix),st.matrix.decompose(st.position,st.quaternion,st.scale),st.projectionMatrix.fromArray(tt.projectionMatrix),st.projectionMatrixInverse.copy(st.projectionMatrix).invert(),st.viewport.set(it.x,it.y,it.width,it.height),kt===0&&(N.matrix.copy(st.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),Ct===!0&&N.cameras.push(st)}const Dt=i.enabledFeatures;if(Dt&&Dt.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&_){d=n.getBinding();const kt=d.getDepthInformation(nt[0]);kt&&kt.isValid&&kt.texture&&m.init(kt,i.renderState)}if(Dt&&Dt.includes("camera-access")&&_){t.state.unbindTexture(),d=n.getBinding();for(let kt=0;kt<nt.length;kt++){const tt=nt[kt].camera;if(tt){let it=g[tt];it||(it=new Zh,g[tt]=it);const st=d.getCameraImage(tt);it.sourceTexture=st}}}}for(let nt=0;nt<T.length;nt++){const Ct=S[nt],Dt=T[nt];Ct!==null&&Dt!==void 0&&Dt.update(Ct,ot,c||a)}Yt&&Yt(Z,ot),ot.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ot}),p=null}const ee=new hm;ee.setAnimationLoop(ie),this.setAnimationLoop=function(Z){Yt=Z},this.dispose=function(){}}}const SS=new Xt,_m=new $t;_m.set(-1,0,0,0,1,0,0,0,1);function wS(s,t){function e(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function n(m,g){g.color.getRGB(m.fogColor.value,Up(s)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function i(m,g,v,b,y){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(m,g):g.isMeshLambertMaterial?(r(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(m,g),d(m,g)):g.isMeshPhongMaterial?(r(m,g),h(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(m,g),u(m,g),g.isMeshPhysicalMaterial&&f(m,g,y)):g.isMeshMatcapMaterial?(r(m,g),p(m,g)):g.isMeshDepthMaterial?r(m,g):g.isMeshDistanceMaterial?(r(m,g),_(m,g)):g.isMeshNormalMaterial?r(m,g):g.isLineBasicMaterial?(a(m,g),g.isLineDashedMaterial&&o(m,g)):g.isPointsMaterial?l(m,g,v,b):g.isSpriteMaterial?c(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,e(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===cn&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,e(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===cn&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,e(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,e(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,e(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);const v=t.get(g),b=v.envMap,y=v.envMapRotation;b&&(m.envMap.value=b,m.envMapRotation.value.setFromMatrix4(SS.makeRotationFromEuler(y)).transpose(),b.isCubeTexture&&b.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(_m),m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,e(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,e(g.aoMap,m.aoMapTransform))}function a(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform))}function o(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function l(m,g,v,b){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*v,m.scale.value=b*.5,g.map&&(m.map.value=g.map,e(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function c(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function h(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function d(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function u(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,e(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,e(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function f(m,g,v){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,e(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,e(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,e(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,e(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,e(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===cn&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,e(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,e(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,e(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,e(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,e(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,e(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,e(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function _(m,g){const v=t.get(g).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function ES(s,t,e,n){let i={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,T){const S=T.program;n.uniformBlockBinding(y,S)}function c(y,T){let S=i[y.id];S===void 0&&(m(y),S=h(y),i[y.id]=S,y.addEventListener("dispose",v));const A=T.program;n.updateUBOMapping(y,A);const x=t.render.frame;r[y.id]!==x&&(u(y),r[y.id]=x)}function h(y){const T=d();y.__bindingPointIndex=T;const S=s.createBuffer(),A=y.__size,x=y.usage;return s.bindBuffer(s.UNIFORM_BUFFER,S),s.bufferData(s.UNIFORM_BUFFER,A,x),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,T,S),S}function d(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return It("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(y){const T=i[y.id],S=y.uniforms,A=y.__cache;s.bindBuffer(s.UNIFORM_BUFFER,T);for(let x=0,w=S.length;x<w;x++){const L=S[x];if(Array.isArray(L))for(let D=0,N=L.length;D<N;D++)f(L[D],x,D,A);else f(L,x,0,A)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(y,T,S,A){if(_(y,T,S,A)===!0){const x=y.__offset,w=y.value;if(Array.isArray(w)){let L=0;for(let D=0;D<w.length;D++){const N=w[D],P=g(N);p(N,y.__data,L),typeof N!="number"&&typeof N!="boolean"&&!N.isMatrix3&&!ArrayBuffer.isView(N)&&(L+=P.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(w,y.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,x,y.__data)}}function p(y,T,S){typeof y=="number"||typeof y=="boolean"?T[0]=y:y.isMatrix3?(T[0]=y.elements[0],T[1]=y.elements[1],T[2]=y.elements[2],T[3]=0,T[4]=y.elements[3],T[5]=y.elements[4],T[6]=y.elements[5],T[7]=0,T[8]=y.elements[6],T[9]=y.elements[7],T[10]=y.elements[8],T[11]=0):ArrayBuffer.isView(y)?T.set(new y.constructor(y.buffer,y.byteOffset,T.length)):y.toArray(T,S)}function _(y,T,S,A){const x=y.value,w=T+"_"+S;if(A[w]===void 0)return typeof x=="number"||typeof x=="boolean"?A[w]=x:ArrayBuffer.isView(x)?A[w]=x.slice():A[w]=x.clone(),!0;{const L=A[w];if(typeof x=="number"||typeof x=="boolean"){if(L!==x)return A[w]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(L.equals(x)===!1)return L.copy(x),!0}}return!1}function m(y){const T=y.uniforms;let S=0;const A=16;for(let w=0,L=T.length;w<L;w++){const D=Array.isArray(T[w])?T[w]:[T[w]];for(let N=0,P=D.length;N<P;N++){const F=D[N],I=Array.isArray(F.value)?F.value:[F.value];for(let z=0,O=I.length;z<O;z++){const X=I[z],j=g(X),at=S%A,rt=at%j.boundary,ct=at+rt;S+=rt,ct!==0&&A-ct<j.storage&&(S+=A-ct),F.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=S,S+=j.storage}}}const x=S%A;return x>0&&(S+=A-x),y.__size=S,y.__cache={},this}function g(y){const T={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(T.boundary=4,T.storage=4):y.isVector2?(T.boundary=8,T.storage=8):y.isVector3||y.isColor?(T.boundary=16,T.storage=12):y.isVector4?(T.boundary=16,T.storage=16):y.isMatrix3?(T.boundary=48,T.storage=48):y.isMatrix4?(T.boundary=64,T.storage=64):y.isTexture?ut("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(T.boundary=16,T.storage=y.byteLength):ut("WebGLRenderer: Unsupported uniform value type.",y),T}function v(y){const T=y.target;T.removeEventListener("dispose",v);const S=a.indexOf(T.__bindingPointIndex);a.splice(S,1),s.deleteBuffer(i[T.id]),delete i[T.id],delete r[T.id]}function b(){for(const y in i)s.deleteBuffer(i[y]);a=[],i={},r={}}return{bind:l,update:c,dispose:b}}const TS=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Qn=null;function AS(){return Qn===null&&(Qn=new Dn(TS,16,16,Wi,ri),Qn.name="DFG_LUT",Qn.minFilter=we,Qn.magFilter=we,Qn.wrapS=_n,Qn.wrapT=_n,Qn.generateMipmaps=!1,Qn.needsUpdate=!0),Qn}class xm{constructor(t={}){const{canvas:e=up(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=mn}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const _=f,m=new Set([wl,Sl,_a]),g=new Set([mn,Un,lr,cr,vl,Ml]),v=new Uint32Array(4),b=new Int32Array(4),y=new C;let T=null,S=null;const A=[],x=[];let w=null;this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Wn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const L=this;let D=!1,N=null,P=null,F=null,I=null;this._outputColorSpace=Ge;let z=0,O=0,X=null,j=-1,at=null;const rt=new pe,ct=new pe;let Yt=null;const ie=new St(0);let ee=0,Z=e.width,ot=e.height,nt=1,Ct=null,Dt=null;const wt=new pe(0,0,Z,ot),se=new pe(0,0,Z,ot);let kt=!1;const tt=new Ss;let it=!1,st=!1;const yt=new Xt,_t=new C,Vt=new pe,Nt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let qt=!1;function Zt(){return X===null?nt:1}let U=n;function me(E,k){return e.getContext(E,k)}try{const E={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${gl}`),e.addEventListener("webglcontextlost",Ae,!1),e.addEventListener("webglcontextrestored",be,!1),e.addEventListener("webglcontextcreationerror",Zn,!1),U===null){const k="webgl2";if(U=me(k,E),U===null)throw me(k)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(E){throw It("WebGLRenderer: "+E.message),E}let re,R,M,V,W,q,lt,ht,$,Q,ft,Ut,xt,pt,Bt,Ht,Kt,B,dt,K,mt,bt,et;function Lt(){re=new CM(U),re.init(),mt=new gm(U,re),R=new vM(U,re,t,mt),M=new _S(U,re),R.reversedDepthBuffer&&u&&M.buffers.depth.setReversed(!0),P=U.createFramebuffer(),F=U.createFramebuffer(),I=U.createFramebuffer(),V=new IM(U),W=new iS,q=new xS(U,re,M,W,R,mt,V),lt=new AM(L),ht=new Ux(U),bt=new xM(U,ht),$=new RM(U,ht,V,bt),Q=new DM(U,$,ht,bt,V),B=new LM(U,R,q),Bt=new MM(W),ft=new nS(L,lt,re,R,bt,Bt),Ut=new wS(L,W),xt=new rS,pt=new uS(re),Kt=new _M(L,lt,M,Q,p,l),Ht=new gS(L,Q,R),et=new ES(U,V,R,M),dt=new yM(U,re,V),K=new PM(U,re,V),V.programs=ft.programs,L.capabilities=R,L.extensions=re,L.properties=W,L.renderLists=xt,L.shadowMap=Ht,L.state=M,L.info=V}Lt(),_!==mn&&(w=new UM(_,e.width,e.height,o,i,r));const Rt=new bS(L,U);this.xr=Rt,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const E=re.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=re.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return nt},this.setPixelRatio=function(E){E!==void 0&&(nt=E,this.setSize(Z,ot,!1))},this.getSize=function(E){return E.set(Z,ot)},this.setSize=function(E,k,Y=!0){if(Rt.isPresenting){ut("WebGLRenderer: Can't change size while VR device is presenting.");return}Z=E,ot=k,e.width=Math.floor(E*nt),e.height=Math.floor(k*nt),Y===!0&&(e.style.width=E+"px",e.style.height=k+"px"),w!==null&&w.setSize(e.width,e.height),this.setViewport(0,0,E,k)},this.getDrawingBufferSize=function(E){return E.set(Z*nt,ot*nt).floor()},this.setDrawingBufferSize=function(E,k,Y){Z=E,ot=k,nt=Y,e.width=Math.floor(E*Y),e.height=Math.floor(k*Y),this.setViewport(0,0,E,k)},this.setEffects=function(E){if(_===mn){It("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(E){for(let k=0;k<E.length;k++)if(E[k].isOutputPass===!0){ut("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(E||[])},this.getCurrentViewport=function(E){return E.copy(rt)},this.getViewport=function(E){return E.copy(wt)},this.setViewport=function(E,k,Y,G){E.isVector4?wt.set(E.x,E.y,E.z,E.w):wt.set(E,k,Y,G),M.viewport(rt.copy(wt).multiplyScalar(nt).round())},this.getScissor=function(E){return E.copy(se)},this.setScissor=function(E,k,Y,G){E.isVector4?se.set(E.x,E.y,E.z,E.w):se.set(E,k,Y,G),M.scissor(ct.copy(se).multiplyScalar(nt).round())},this.getScissorTest=function(){return kt},this.setScissorTest=function(E){M.setScissorTest(kt=E)},this.setOpaqueSort=function(E){Ct=E},this.setTransparentSort=function(E){Dt=E},this.getClearColor=function(E){return E.copy(Kt.getClearColor())},this.setClearColor=function(){Kt.setClearColor(...arguments)},this.getClearAlpha=function(){return Kt.getClearAlpha()},this.setClearAlpha=function(){Kt.setClearAlpha(...arguments)},this.clear=function(E=!0,k=!0,Y=!0){let G=0;if(E){let H=!1;if(X!==null){const Mt=X.texture.format;H=m.has(Mt)}if(H){const Mt=X.texture.type,Tt=g.has(Mt),vt=Kt.getClearColor(),Pt=Kt.getClearAlpha(),Ot=vt.r,jt=vt.g,ne=vt.b;Tt?(v[0]=Ot,v[1]=jt,v[2]=ne,v[3]=Pt,U.clearBufferuiv(U.COLOR,0,v)):(b[0]=Ot,b[1]=jt,b[2]=ne,b[3]=Pt,U.clearBufferiv(U.COLOR,0,b))}else G|=U.COLOR_BUFFER_BIT}k&&(G|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Y&&(G|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G!==0&&U.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(E){E.setRenderer(this),N=E},this.dispose=function(){e.removeEventListener("webglcontextlost",Ae,!1),e.removeEventListener("webglcontextrestored",be,!1),e.removeEventListener("webglcontextcreationerror",Zn,!1),Kt.dispose(),xt.dispose(),pt.dispose(),W.dispose(),lt.dispose(),Q.dispose(),bt.dispose(),et.dispose(),ft.dispose(),Rt.dispose(),Rt.removeEventListener("sessionstart",Pu),Rt.removeEventListener("sessionend",Iu),Ji.stop()};function Ae(E){E.preventDefault(),la("WebGLRenderer: Context Lost."),D=!0}function be(){la("WebGLRenderer: Context Restored."),D=!1;const E=V.autoReset,k=Ht.enabled,Y=Ht.autoUpdate,G=Ht.needsUpdate,H=Ht.type;Lt(),V.autoReset=E,Ht.enabled=k,Ht.autoUpdate=Y,Ht.needsUpdate=G,Ht.type=H}function Zn(E){It("WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Jn(E){const k=E.target;k.removeEventListener("dispose",Jn),Um(k)}function Um(E){Om(E),W.remove(E)}function Om(E){const k=W.get(E).programs;k!==void 0&&(k.forEach(function(Y){ft.releaseProgram(Y)}),E.isShaderMaterial&&ft.releaseShaderCache(E))}this.renderBufferDirect=function(E,k,Y,G,H,Mt){k===null&&(k=Nt);const Tt=H.isMesh&&H.matrixWorld.determinantAffine()<0,vt=km(E,k,Y,G,H);M.setMaterial(G,Tt);let Pt=Y.index,Ot=1;if(G.wireframe===!0){if(Pt=$.getWireframeAttribute(Y),Pt===void 0)return;Ot=2}const jt=Y.drawRange,ne=Y.attributes.position;let Ft=jt.start*Ot,ge=(jt.start+jt.count)*Ot;Mt!==null&&(Ft=Math.max(Ft,Mt.start*Ot),ge=Math.min(ge,(Mt.start+Mt.count)*Ot)),Pt!==null?(Ft=Math.max(Ft,0),ge=Math.min(ge,Pt.count)):ne!=null&&(Ft=Math.max(Ft,0),ge=Math.min(ge,ne.count));const Pe=ge-Ft;if(Pe<0||Pe===1/0)return;bt.setup(H,G,vt,Y,Pt);let Ce,ye=dt;if(Pt!==null&&(Ce=ht.get(Pt),ye=K,ye.setIndex(Ce)),H.isMesh)G.wireframe===!0?(M.setLineWidth(G.wireframeLinewidth*Zt()),ye.setMode(U.LINES)):ye.setMode(U.TRIANGLES);else if(H.isLine){let $e=G.linewidth;$e===void 0&&($e=1),M.setLineWidth($e*Zt()),H.isLineSegments?ye.setMode(U.LINES):H.isLineLoop?ye.setMode(U.LINE_LOOP):ye.setMode(U.LINE_STRIP)}else H.isPoints?ye.setMode(U.POINTS):H.isSprite&&ye.setMode(U.TRIANGLES);if(H.isBatchedMesh)if(re.get("WEBGL_multi_draw"))ye.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const $e=H._multiDrawStarts,Et=H._multiDrawCounts,Mn=H._multiDrawCount,le=Pt?ht.get(Pt).bytesPerElement:1,Rn=W.get(G).currentProgram.getUniforms();for(let Kn=0;Kn<Mn;Kn++)Rn.setValue(U,"_gl_DrawID",Kn),ye.render($e[Kn]/le,Et[Kn])}else if(H.isInstancedMesh)ye.renderInstances(Ft,Pe,H.count);else if(Y.isInstancedBufferGeometry){const $e=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,Et=Math.min(Y.instanceCount,$e);ye.renderInstances(Ft,Pe,Et)}else ye.render(Ft,Pe)};function Ru(E,k,Y){E.transparent===!0&&E.side===en&&E.forceSinglePass===!1?(E.side=cn,E.needsUpdate=!0,Ta(E,k,Y),E.side=Mi,E.needsUpdate=!0,Ta(E,k,Y),E.side=en):Ta(E,k,Y)}this.compile=function(E,k,Y=null){Y===null&&(Y=E),S=pt.get(Y),S.init(k),x.push(S),Y.traverseVisible(function(H){H.isLight&&H.layers.test(k.layers)&&(S.pushLight(H),H.castShadow&&S.pushShadow(H))}),E!==Y&&E.traverseVisible(function(H){H.isLight&&H.layers.test(k.layers)&&(S.pushLight(H),H.castShadow&&S.pushShadow(H))}),S.setupLights();const G=new Set;return E.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;const Mt=H.material;if(Mt)if(Array.isArray(Mt))for(let Tt=0;Tt<Mt.length;Tt++){const vt=Mt[Tt];Ru(vt,Y,H),G.add(vt)}else Ru(Mt,Y,H),G.add(Mt)}),S=x.pop(),G},this.compileAsync=function(E,k,Y=null){const G=this.compile(E,k,Y);return new Promise(H=>{function Mt(){if(G.forEach(function(Tt){W.get(Tt).currentProgram.isReady()&&G.delete(Tt)}),G.size===0){H(E);return}setTimeout(Mt,10)}re.get("KHR_parallel_shader_compile")!==null?Mt():setTimeout(Mt,10)})};let sc=null;function Fm(E){sc&&sc(E)}function Pu(){Ji.stop()}function Iu(){Ji.start()}const Ji=new hm;Ji.setAnimationLoop(Fm),typeof self<"u"&&Ji.setContext(self),this.setAnimationLoop=function(E){sc=E,Rt.setAnimationLoop(E),E===null?Ji.stop():Ji.start()},Rt.addEventListener("sessionstart",Pu),Rt.addEventListener("sessionend",Iu),this.render=function(E,k){if(k!==void 0&&k.isCamera!==!0){It("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;N!==null&&N.renderStart(E,k);const Y=Rt.enabled===!0&&Rt.isPresenting===!0,G=w!==null&&(X===null||Y)&&w.begin(L,X);if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),Rt.enabled===!0&&Rt.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Rt.cameraAutoUpdate===!0&&Rt.updateCamera(k),k=Rt.getCamera()),E.isScene===!0&&E.onBeforeRender(L,E,k,X),S=pt.get(E,x.length),S.init(k),S.state.textureUnits=q.getTextureUnits(),x.push(S),yt.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),tt.setFromProjectionMatrix(yt,wn,k.reversedDepth),st=this.localClippingEnabled,it=Bt.init(this.clippingPlanes,st),T=xt.get(E,A.length),T.init(),A.push(T),Rt.enabled===!0&&Rt.isPresenting===!0){const Tt=L.xr.getDepthSensingMesh();Tt!==null&&rc(Tt,k,-1/0,L.sortObjects)}rc(E,k,0,L.sortObjects),T.finish(),L.sortObjects===!0&&T.sort(Ct,Dt,k.reversedDepth),qt=Rt.enabled===!1||Rt.isPresenting===!1||Rt.hasDepthSensing()===!1,qt&&Kt.addToRenderList(T,E),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),it===!0&&Bt.beginShadows();const H=S.state.shadowsArray;if(Ht.render(H,E,k),it===!0&&Bt.endShadows(),(G&&w.hasRenderPass())===!1){const Tt=T.opaque,vt=T.transmissive;if(S.setupLights(),k.isArrayCamera){const Pt=k.cameras;if(vt.length>0)for(let Ot=0,jt=Pt.length;Ot<jt;Ot++){const ne=Pt[Ot];Du(Tt,vt,E,ne)}qt&&Kt.render(E);for(let Ot=0,jt=Pt.length;Ot<jt;Ot++){const ne=Pt[Ot];Lu(T,E,ne,ne.viewport)}}else vt.length>0&&Du(Tt,vt,E,k),qt&&Kt.render(E),Lu(T,E,k)}X!==null&&O===0&&(q.updateMultisampleRenderTarget(X),q.updateRenderTargetMipmap(X)),G&&w.end(L),E.isScene===!0&&E.onAfterRender(L,E,k),bt.resetDefaultState(),j=-1,at=null,x.pop(),x.length>0?(S=x[x.length-1],q.setTextureUnits(S.state.textureUnits),it===!0&&Bt.setGlobalState(L.clippingPlanes,S.state.camera)):S=null,A.pop(),A.length>0?T=A[A.length-1]:T=null,N!==null&&N.renderEnd()};function rc(E,k,Y,G){if(E.visible===!1)return;if(E.layers.test(k.layers)){if(E.isGroup)Y=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(k);else if(E.isLightProbeGrid)S.pushLightProbeGrid(E);else if(E.isLight)S.pushLight(E),E.castShadow&&S.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||tt.intersectsSprite(E)){G&&Vt.setFromMatrixPosition(E.matrixWorld).applyMatrix4(yt);const Tt=Q.update(E),vt=E.material;vt.visible&&T.push(E,Tt,vt,Y,Vt.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||tt.intersectsObject(E))){const Tt=Q.update(E),vt=E.material;if(G&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Vt.copy(E.boundingSphere.center)):(Tt.boundingSphere===null&&Tt.computeBoundingSphere(),Vt.copy(Tt.boundingSphere.center)),Vt.applyMatrix4(E.matrixWorld).applyMatrix4(yt)),Array.isArray(vt)){const Pt=Tt.groups;for(let Ot=0,jt=Pt.length;Ot<jt;Ot++){const ne=Pt[Ot],Ft=vt[ne.materialIndex];Ft&&Ft.visible&&T.push(E,Tt,Ft,Y,Vt.z,ne)}}else vt.visible&&T.push(E,Tt,vt,Y,Vt.z,null)}}const Mt=E.children;for(let Tt=0,vt=Mt.length;Tt<vt;Tt++)rc(Mt[Tt],k,Y,G)}function Lu(E,k,Y,G){const{opaque:H,transmissive:Mt,transparent:Tt}=E;S.setupLightsView(Y),it===!0&&Bt.setGlobalState(L.clippingPlanes,Y),G&&M.viewport(rt.copy(G)),H.length>0&&Ea(H,k,Y),Mt.length>0&&Ea(Mt,k,Y),Tt.length>0&&Ea(Tt,k,Y),M.buffers.depth.setTest(!0),M.buffers.depth.setMask(!0),M.buffers.color.setMask(!0),M.setPolygonOffset(!1)}function Du(E,k,Y,G){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;if(S.state.transmissionRenderTarget[G.id]===void 0){const Ft=re.has("EXT_color_buffer_half_float")||re.has("EXT_color_buffer_float");S.state.transmissionRenderTarget[G.id]=new An(1,1,{generateMipmaps:!0,type:Ft?ri:mn,minFilter:ti,samples:Math.max(4,R.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ae.workingColorSpace})}const Mt=S.state.transmissionRenderTarget[G.id],Tt=G.viewport||rt;Mt.setSize(Tt.z*L.transmissionResolutionScale,Tt.w*L.transmissionResolutionScale);const vt=L.getRenderTarget(),Pt=L.getActiveCubeFace(),Ot=L.getActiveMipmapLevel();L.setRenderTarget(Mt),L.getClearColor(ie),ee=L.getClearAlpha(),ee<1&&L.setClearColor(16777215,.5),L.clear(),qt&&Kt.render(Y);const jt=L.toneMapping;L.toneMapping=Wn;const ne=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),S.setupLightsView(G),it===!0&&Bt.setGlobalState(L.clippingPlanes,G),Ea(E,Y,G),q.updateMultisampleRenderTarget(Mt),q.updateRenderTargetMipmap(Mt),re.has("WEBGL_multisampled_render_to_texture")===!1){let Ft=!1;for(let ge=0,Pe=k.length;ge<Pe;ge++){const Ce=k[ge],{object:ye,geometry:$e,material:Et,group:Mn}=Ce;if(Et.side===en&&ye.layers.test(G.layers)){const le=Et.side;Et.side=cn,Et.needsUpdate=!0,Nu(ye,Y,G,$e,Et,Mn),Et.side=le,Et.needsUpdate=!0,Ft=!0}}Ft===!0&&(q.updateMultisampleRenderTarget(Mt),q.updateRenderTargetMipmap(Mt))}L.setRenderTarget(vt,Pt,Ot),L.setClearColor(ie,ee),ne!==void 0&&(G.viewport=ne),L.toneMapping=jt}function Ea(E,k,Y){const G=k.isScene===!0?k.overrideMaterial:null;for(let H=0,Mt=E.length;H<Mt;H++){const Tt=E[H],{object:vt,geometry:Pt,group:Ot}=Tt;let jt=Tt.material;jt.allowOverride===!0&&G!==null&&(jt=G),vt.layers.test(Y.layers)&&Nu(vt,k,Y,Pt,jt,Ot)}}function Nu(E,k,Y,G,H,Mt){E.onBeforeRender(L,k,Y,G,H,Mt),E.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),H.onBeforeRender(L,k,Y,G,E,Mt),H.transparent===!0&&H.side===en&&H.forceSinglePass===!1?(H.side=cn,H.needsUpdate=!0,L.renderBufferDirect(Y,k,G,H,E,Mt),H.side=Mi,H.needsUpdate=!0,L.renderBufferDirect(Y,k,G,H,E,Mt),H.side=en):L.renderBufferDirect(Y,k,G,H,E,Mt),E.onAfterRender(L,k,Y,G,H,Mt)}function Ta(E,k,Y){k.isScene!==!0&&(k=Nt);const G=W.get(E),H=S.state.lights,Mt=S.state.shadowsArray,Tt=H.state.version,vt=ft.getParameters(E,H.state,Mt,k,Y,S.state.lightProbeGridArray),Pt=ft.getProgramCacheKey(vt);let Ot=G.programs;G.environment=E.isMeshStandardMaterial||E.isMeshLambertMaterial||E.isMeshPhongMaterial?k.environment:null,G.fog=k.fog;const jt=E.isMeshStandardMaterial||E.isMeshLambertMaterial&&!E.envMap||E.isMeshPhongMaterial&&!E.envMap;G.envMap=lt.get(E.envMap||G.environment,jt),G.envMapRotation=G.environment!==null&&E.envMap===null?k.environmentRotation:E.envMapRotation,Ot===void 0&&(E.addEventListener("dispose",Jn),Ot=new Map,G.programs=Ot);let ne=Ot.get(Pt);if(ne!==void 0){if(G.currentProgram===ne&&G.lightsStateVersion===Tt)return Ou(E,vt),ne}else vt.uniforms=ft.getUniforms(E),N!==null&&E.isNodeMaterial&&N.build(E,Y,vt),E.onBeforeCompile(vt,L),ne=ft.acquireProgram(vt,Pt),Ot.set(Pt,ne),G.uniforms=vt.uniforms;const Ft=G.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ft.clippingPlanes=Bt.uniform),Ou(E,vt),G.needsLights=Vm(E),G.lightsStateVersion=Tt,G.needsLights&&(Ft.ambientLightColor.value=H.state.ambient,Ft.lightProbe.value=H.state.probe,Ft.directionalLights.value=H.state.directional,Ft.directionalLightShadows.value=H.state.directionalShadow,Ft.spotLights.value=H.state.spot,Ft.spotLightShadows.value=H.state.spotShadow,Ft.rectAreaLights.value=H.state.rectArea,Ft.ltc_1.value=H.state.rectAreaLTC1,Ft.ltc_2.value=H.state.rectAreaLTC2,Ft.pointLights.value=H.state.point,Ft.pointLightShadows.value=H.state.pointShadow,Ft.hemisphereLights.value=H.state.hemi,Ft.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Ft.spotLightMatrix.value=H.state.spotLightMatrix,Ft.spotLightMap.value=H.state.spotLightMap,Ft.pointShadowMatrix.value=H.state.pointShadowMatrix),G.lightProbeGrid=S.state.lightProbeGridArray.length>0,G.currentProgram=ne,G.uniformsList=null,ne}function Uu(E){if(E.uniformsList===null){const k=E.currentProgram.getUniforms();E.uniformsList=bo.seqWithValue(k.seq,E.uniforms)}return E.uniformsList}function Ou(E,k){const Y=W.get(E);Y.outputColorSpace=k.outputColorSpace,Y.batching=k.batching,Y.batchingColor=k.batchingColor,Y.instancing=k.instancing,Y.instancingColor=k.instancingColor,Y.instancingMorph=k.instancingMorph,Y.skinning=k.skinning,Y.morphTargets=k.morphTargets,Y.morphNormals=k.morphNormals,Y.morphColors=k.morphColors,Y.morphTargetsCount=k.morphTargetsCount,Y.numClippingPlanes=k.numClippingPlanes,Y.numIntersection=k.numClipIntersection,Y.vertexAlphas=k.vertexAlphas,Y.vertexTangents=k.vertexTangents,Y.toneMapping=k.toneMapping}function Bm(E,k){if(E.length===0)return null;if(E.length===1)return E[0].texture!==null?E[0]:null;y.setFromMatrixPosition(k.matrixWorld);for(let Y=0,G=E.length;Y<G;Y++){const H=E[Y];if(H.texture!==null&&H.boundingBox.containsPoint(y))return H}return null}function km(E,k,Y,G,H){k.isScene!==!0&&(k=Nt),q.resetTextureUnits();const Mt=k.fog,Tt=G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial?k.environment:null,vt=X===null?L.outputColorSpace:X.isXRRenderTarget===!0?X.texture.colorSpace:ae.workingColorSpace,Pt=G.isMeshStandardMaterial||G.isMeshLambertMaterial&&!G.envMap||G.isMeshPhongMaterial&&!G.envMap,Ot=lt.get(G.envMap||Tt,Pt),jt=G.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,ne=!!Y.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Ft=!!Y.morphAttributes.position,ge=!!Y.morphAttributes.normal,Pe=!!Y.morphAttributes.color;let Ce=Wn;G.toneMapped&&(X===null||X.isXRRenderTarget===!0)&&(Ce=L.toneMapping);const ye=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,$e=ye!==void 0?ye.length:0,Et=W.get(G),Mn=S.state.lights;if(it===!0&&(st===!0||E!==at)){const Se=E===at&&G.id===j;Bt.setState(G,E,Se)}let le=!1;G.version===Et.__version?(Et.needsLights&&Et.lightsStateVersion!==Mn.state.version||Et.outputColorSpace!==vt||H.isBatchedMesh&&Et.batching===!1||!H.isBatchedMesh&&Et.batching===!0||H.isBatchedMesh&&Et.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&Et.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&Et.instancing===!1||!H.isInstancedMesh&&Et.instancing===!0||H.isSkinnedMesh&&Et.skinning===!1||!H.isSkinnedMesh&&Et.skinning===!0||H.isInstancedMesh&&Et.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Et.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Et.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Et.instancingMorph===!1&&H.morphTexture!==null||Et.envMap!==Ot||G.fog===!0&&Et.fog!==Mt||Et.numClippingPlanes!==void 0&&(Et.numClippingPlanes!==Bt.numPlanes||Et.numIntersection!==Bt.numIntersection)||Et.vertexAlphas!==jt||Et.vertexTangents!==ne||Et.morphTargets!==Ft||Et.morphNormals!==ge||Et.morphColors!==Pe||Et.toneMapping!==Ce||Et.morphTargetsCount!==$e||!!Et.lightProbeGrid!=S.state.lightProbeGridArray.length>0)&&(le=!0):(le=!0,Et.__version=G.version);let Rn=Et.currentProgram;le===!0&&(Rn=Ta(G,k,H),N&&G.isNodeMaterial&&N.onUpdateProgram(G,Rn,Et));let Kn=!1,Ti=!1,Ls=!1;const ve=Rn.getUniforms(),Ie=Et.uniforms;if(M.useProgram(Rn.program)&&(Kn=!0,Ti=!0,Ls=!0),G.id!==j&&(j=G.id,Ti=!0),Et.needsLights){const Se=Bm(S.state.lightProbeGridArray,H);Et.lightProbeGrid!==Se&&(Et.lightProbeGrid=Se,Ti=!0)}if(Kn||at!==E){M.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),ve.setValue(U,"projectionMatrix",E.projectionMatrix),ve.setValue(U,"viewMatrix",E.matrixWorldInverse);const Ci=ve.map.cameraPosition;Ci!==void 0&&Ci.setValue(U,_t.setFromMatrixPosition(E.matrixWorld)),R.logarithmicDepthBuffer&&ve.setValue(U,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&ve.setValue(U,"isOrthographic",E.isOrthographicCamera===!0),at!==E&&(at=E,Ti=!0,Ls=!0)}if(Et.needsLights&&(Mn.state.directionalShadowMap.length>0&&ve.setValue(U,"directionalShadowMap",Mn.state.directionalShadowMap,q),Mn.state.spotShadowMap.length>0&&ve.setValue(U,"spotShadowMap",Mn.state.spotShadowMap,q),Mn.state.pointShadowMap.length>0&&ve.setValue(U,"pointShadowMap",Mn.state.pointShadowMap,q)),H.isSkinnedMesh){ve.setOptional(U,H,"bindMatrix"),ve.setOptional(U,H,"bindMatrixInverse");const Se=H.skeleton;Se&&(Se.boneTexture===null&&Se.computeBoneTexture(),ve.setValue(U,"boneTexture",Se.boneTexture,q))}H.isBatchedMesh&&(ve.setOptional(U,H,"batchingTexture"),ve.setValue(U,"batchingTexture",H._matricesTexture,q),ve.setOptional(U,H,"batchingIdTexture"),ve.setValue(U,"batchingIdTexture",H._indirectTexture,q),ve.setOptional(U,H,"batchingColorTexture"),H._colorsTexture!==null&&ve.setValue(U,"batchingColorTexture",H._colorsTexture,q));const Ai=Y.morphAttributes;if((Ai.position!==void 0||Ai.normal!==void 0||Ai.color!==void 0)&&B.update(H,Y,Rn),(Ti||Et.receiveShadow!==H.receiveShadow)&&(Et.receiveShadow=H.receiveShadow,ve.setValue(U,"receiveShadow",H.receiveShadow)),(G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial)&&G.envMap===null&&k.environment!==null&&(Ie.envMapIntensity.value=k.environmentIntensity),Ie.dfgLUT!==void 0&&(Ie.dfgLUT.value=AS()),Ti){if(ve.setValue(U,"toneMappingExposure",L.toneMappingExposure),Et.needsLights&&zm(Ie,Ls),Mt&&G.fog===!0&&Ut.refreshFogUniforms(Ie,Mt),Ut.refreshMaterialUniforms(Ie,G,nt,ot,S.state.transmissionRenderTarget[E.id]),Et.needsLights&&Et.lightProbeGrid){const Se=Et.lightProbeGrid;Ie.probesSH.value=Se.texture,Ie.probesMin.value.copy(Se.boundingBox.min),Ie.probesMax.value.copy(Se.boundingBox.max),Ie.probesResolution.value.copy(Se.resolution)}bo.upload(U,Uu(Et),Ie,q)}if(G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(bo.upload(U,Uu(Et),Ie,q),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&ve.setValue(U,"center",H.center),ve.setValue(U,"modelViewMatrix",H.modelViewMatrix),ve.setValue(U,"normalMatrix",H.normalMatrix),ve.setValue(U,"modelMatrix",H.matrixWorld),G.uniformsGroups!==void 0){const Se=G.uniformsGroups;for(let Ci=0,Ds=Se.length;Ci<Ds;Ci++){const Fu=Se[Ci];et.update(Fu,Rn),et.bind(Fu,Rn)}}return Rn}function zm(E,k){E.ambientLightColor.needsUpdate=k,E.lightProbe.needsUpdate=k,E.directionalLights.needsUpdate=k,E.directionalLightShadows.needsUpdate=k,E.pointLights.needsUpdate=k,E.pointLightShadows.needsUpdate=k,E.spotLights.needsUpdate=k,E.spotLightShadows.needsUpdate=k,E.rectAreaLights.needsUpdate=k,E.hemisphereLights.needsUpdate=k}function Vm(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return z},this.getActiveMipmapLevel=function(){return O},this.getRenderTarget=function(){return X},this.setRenderTargetTextures=function(E,k,Y){const G=W.get(E);G.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),W.get(E.texture).__webglTexture=k,W.get(E.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:Y,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,k){const Y=W.get(E);Y.__webglFramebuffer=k,Y.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(E,k=0,Y=0){X=E,z=k,O=Y;let G=null,H=!1,Mt=!1;if(E){const vt=W.get(E);if(vt.__useDefaultFramebuffer!==void 0){M.bindFramebuffer(U.FRAMEBUFFER,vt.__webglFramebuffer),rt.copy(E.viewport),ct.copy(E.scissor),Yt=E.scissorTest,M.viewport(rt),M.scissor(ct),M.setScissorTest(Yt),j=-1;return}else if(vt.__webglFramebuffer===void 0)q.setupRenderTarget(E);else if(vt.__hasExternalTextures)q.rebindTextures(E,W.get(E.texture).__webglTexture,W.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const jt=E.depthTexture;if(vt.__boundDepthTexture!==jt){if(jt!==null&&W.has(jt)&&(E.width!==jt.image.width||E.height!==jt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");q.setupDepthRenderbuffer(E)}}const Pt=E.texture;(Pt.isData3DTexture||Pt.isDataArrayTexture||Pt.isCompressedArrayTexture)&&(Mt=!0);const Ot=W.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Ot[k])?G=Ot[k][Y]:G=Ot[k],H=!0):E.samples>0&&q.useMultisampledRTT(E)===!1?G=W.get(E).__webglMultisampledFramebuffer:Array.isArray(Ot)?G=Ot[Y]:G=Ot,rt.copy(E.viewport),ct.copy(E.scissor),Yt=E.scissorTest}else rt.copy(wt).multiplyScalar(nt).floor(),ct.copy(se).multiplyScalar(nt).floor(),Yt=kt;if(Y!==0&&(G=P),M.bindFramebuffer(U.FRAMEBUFFER,G)&&M.drawBuffers(E,G),M.viewport(rt),M.scissor(ct),M.setScissorTest(Yt),H){const vt=W.get(E.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+k,vt.__webglTexture,Y)}else if(Mt){const vt=k;for(let Pt=0;Pt<E.textures.length;Pt++){const Ot=W.get(E.textures[Pt]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+Pt,Ot.__webglTexture,Y,vt)}}else if(E!==null&&Y!==0){const vt=W.get(E.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,vt.__webglTexture,Y)}j=-1},this.readRenderTargetPixels=function(E,k,Y,G,H,Mt,Tt,vt=0){if(!(E&&E.isWebGLRenderTarget)){It("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pt=W.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Tt!==void 0&&(Pt=Pt[Tt]),Pt){M.bindFramebuffer(U.FRAMEBUFFER,Pt);try{const Ot=E.textures[vt],jt=Ot.format,ne=Ot.type;if(E.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+vt),!R.textureFormatReadable(jt)){It("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!R.textureTypeReadable(ne)){It("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=E.width-G&&Y>=0&&Y<=E.height-H&&U.readPixels(k,Y,G,H,mt.convert(jt),mt.convert(ne),Mt)}finally{const Ot=X!==null?W.get(X).__webglFramebuffer:null;M.bindFramebuffer(U.FRAMEBUFFER,Ot)}}},this.readRenderTargetPixelsAsync=async function(E,k,Y,G,H,Mt,Tt,vt=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Pt=W.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Tt!==void 0&&(Pt=Pt[Tt]),Pt)if(k>=0&&k<=E.width-G&&Y>=0&&Y<=E.height-H){M.bindFramebuffer(U.FRAMEBUFFER,Pt);const Ot=E.textures[vt],jt=Ot.format,ne=Ot.type;if(E.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+vt),!R.textureFormatReadable(jt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!R.textureTypeReadable(ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ft=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Ft),U.bufferData(U.PIXEL_PACK_BUFFER,Mt.byteLength,U.STREAM_READ),U.readPixels(k,Y,G,H,mt.convert(jt),mt.convert(ne),0);const ge=X!==null?W.get(X).__webglFramebuffer:null;M.bindFramebuffer(U.FRAMEBUFFER,ge);const Pe=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await O0(U,Pe,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Ft),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,Mt),U.deleteBuffer(Ft),U.deleteSync(Pe),Mt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,k=null,Y=0){const G=Math.pow(2,-Y),H=Math.floor(E.image.width*G),Mt=Math.floor(E.image.height*G),Tt=k!==null?k.x:0,vt=k!==null?k.y:0;q.setTexture2D(E,0),U.copyTexSubImage2D(U.TEXTURE_2D,Y,0,0,Tt,vt,H,Mt),M.unbindTexture()},this.copyTextureToTexture=function(E,k,Y=null,G=null,H=0,Mt=0){let Tt,vt,Pt,Ot,jt,ne,Ft,ge,Pe;const Ce=E.isCompressedTexture?E.mipmaps[Mt]:E.image;if(Y!==null)Tt=Y.max.x-Y.min.x,vt=Y.max.y-Y.min.y,Pt=Y.isBox3?Y.max.z-Y.min.z:1,Ot=Y.min.x,jt=Y.min.y,ne=Y.isBox3?Y.min.z:0;else{const Ie=Math.pow(2,-H);Tt=Math.floor(Ce.width*Ie),vt=Math.floor(Ce.height*Ie),E.isDataArrayTexture?Pt=Ce.depth:E.isData3DTexture?Pt=Math.floor(Ce.depth*Ie):Pt=1,Ot=0,jt=0,ne=0}G!==null?(Ft=G.x,ge=G.y,Pe=G.z):(Ft=0,ge=0,Pe=0);const ye=mt.convert(k.format),$e=mt.convert(k.type);let Et;k.isData3DTexture?(q.setTexture3D(k,0),Et=U.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(q.setTexture2DArray(k,0),Et=U.TEXTURE_2D_ARRAY):(q.setTexture2D(k,0),Et=U.TEXTURE_2D),M.activeTexture(U.TEXTURE0),M.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,k.flipY),M.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),M.pixelStorei(U.UNPACK_ALIGNMENT,k.unpackAlignment);const Mn=M.getParameter(U.UNPACK_ROW_LENGTH),le=M.getParameter(U.UNPACK_IMAGE_HEIGHT),Rn=M.getParameter(U.UNPACK_SKIP_PIXELS),Kn=M.getParameter(U.UNPACK_SKIP_ROWS),Ti=M.getParameter(U.UNPACK_SKIP_IMAGES);M.pixelStorei(U.UNPACK_ROW_LENGTH,Ce.width),M.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Ce.height),M.pixelStorei(U.UNPACK_SKIP_PIXELS,Ot),M.pixelStorei(U.UNPACK_SKIP_ROWS,jt),M.pixelStorei(U.UNPACK_SKIP_IMAGES,ne);const Ls=E.isDataArrayTexture||E.isData3DTexture,ve=k.isDataArrayTexture||k.isData3DTexture;if(E.isDepthTexture){const Ie=W.get(E),Ai=W.get(k),Se=W.get(Ie.__renderTarget),Ci=W.get(Ai.__renderTarget);M.bindFramebuffer(U.READ_FRAMEBUFFER,Se.__webglFramebuffer),M.bindFramebuffer(U.DRAW_FRAMEBUFFER,Ci.__webglFramebuffer);for(let Ds=0;Ds<Pt;Ds++)Ls&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,W.get(E).__webglTexture,H,ne+Ds),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,W.get(k).__webglTexture,Mt,Pe+Ds)),U.blitFramebuffer(Ot,jt,Tt,vt,Ft,ge,Tt,vt,U.DEPTH_BUFFER_BIT,U.NEAREST);M.bindFramebuffer(U.READ_FRAMEBUFFER,null),M.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(H!==0||E.isRenderTargetTexture||W.has(E)){const Ie=W.get(E),Ai=W.get(k);M.bindFramebuffer(U.READ_FRAMEBUFFER,F),M.bindFramebuffer(U.DRAW_FRAMEBUFFER,I);for(let Se=0;Se<Pt;Se++)Ls?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Ie.__webglTexture,H,ne+Se):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Ie.__webglTexture,H),ve?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Ai.__webglTexture,Mt,Pe+Se):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Ai.__webglTexture,Mt),H!==0?U.blitFramebuffer(Ot,jt,Tt,vt,Ft,ge,Tt,vt,U.COLOR_BUFFER_BIT,U.NEAREST):ve?U.copyTexSubImage3D(Et,Mt,Ft,ge,Pe+Se,Ot,jt,Tt,vt):U.copyTexSubImage2D(Et,Mt,Ft,ge,Ot,jt,Tt,vt);M.bindFramebuffer(U.READ_FRAMEBUFFER,null),M.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else ve?E.isDataTexture||E.isData3DTexture?U.texSubImage3D(Et,Mt,Ft,ge,Pe,Tt,vt,Pt,ye,$e,Ce.data):k.isCompressedArrayTexture?U.compressedTexSubImage3D(Et,Mt,Ft,ge,Pe,Tt,vt,Pt,ye,Ce.data):U.texSubImage3D(Et,Mt,Ft,ge,Pe,Tt,vt,Pt,ye,$e,Ce):E.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,Mt,Ft,ge,Tt,vt,ye,$e,Ce.data):E.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,Mt,Ft,ge,Ce.width,Ce.height,ye,Ce.data):U.texSubImage2D(U.TEXTURE_2D,Mt,Ft,ge,Tt,vt,ye,$e,Ce);M.pixelStorei(U.UNPACK_ROW_LENGTH,Mn),M.pixelStorei(U.UNPACK_IMAGE_HEIGHT,le),M.pixelStorei(U.UNPACK_SKIP_PIXELS,Rn),M.pixelStorei(U.UNPACK_SKIP_ROWS,Kn),M.pixelStorei(U.UNPACK_SKIP_IMAGES,Ti),Mt===0&&k.generateMipmaps&&U.generateMipmap(Et),M.unbindTexture()},this.initRenderTarget=function(E){W.get(E).__webglFramebuffer===void 0&&q.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?q.setTextureCube(E,0):E.isData3DTexture?q.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?q.setTexture2DArray(E,0):q.setTexture2D(E,0),M.unbindTexture()},this.resetState=function(){z=0,O=0,X=null,M.reset(),bt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return wn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=ae._getDrawingBufferColorSpace(t),e.unpackColorSpace=ae._getUnpackColorSpace()}}const CS=Object.freeze(Object.defineProperty({__proto__:null,ACESFilmicToneMapping:_l,AddEquation:Oi,AddOperation:Kf,AdditiveAnimationBlendMode:kh,AdditiveBlending:eh,AgXToneMapping:Ph,AlphaFormat:Fh,AlwaysCompare:cp,AlwaysDepth:Ao,AlwaysStencilFunc:ah,AmbientLight:Jp,AnimationAction:am,AnimationClip:fa,AnimationLoader:A_,AnimationMixer:ix,AnimationObjectGroup:ex,AnimationUtils:S_,ArcCurve:wp,ArrayCamera:nm,ArrowHelper:Ax,AttachedBindMode:sh,Audio:sm,AudioAnalyser:X_,AudioContext:pu,AudioListener:G_,AudioLoader:B_,AxesHelper:Cx,BackSide:cn,BasicDepthPacking:np,BasicShadowMap:Hm,BatchedMesh:xp,BezierInterpolant:qp,Bone:Xh,BooleanKeyframeTrack:Rs,Box2:om,Box3:nn,Box3Helper:Ex,BoxGeometry:tn,BoxHelper:wx,BufferAttribute:xe,BufferGeometry:Jt,BufferGeometryLoader:tm,ByteType:Dh,Cache:ei,Camera:Jl,CameraHelper:Sx,CanvasTexture:$h,CapsuleGeometry:xs,CatmullRomCurve3:Ep,CineonToneMapping:Ch,CircleGeometry:va,ClampToEdgeWrapping:_n,Clock:hx,Color:St,ColorKeyframeTrack:au,ColorManagement:ae,Compatibility:I0,CompressedArrayTexture:Vg,CompressedCubeTexture:Gg,CompressedTexture:Bl,CompressedTextureLoader:C_,ConeGeometry:yr,ConstantAlphaFactor:$f,ConstantColorFactor:Yf,Controls:cm,CubeCamera:em,CubeDepthTexture:bp,CubeReflectionMapping:si,CubeRefractionMapping:Hi,CubeTexture:ya,CubeTextureLoader:R_,CubeUVReflectionMapping:xr,CubicBezierCurve:Kh,CubicBezierCurve3:Tp,CubicInterpolant:Xp,CullFaceBack:th,CullFaceFront:Pf,CullFaceFrontBack:Gm,CullFaceNone:Rf,Curve:$n,CurvePath:Cp,CustomBlending:Lf,CustomToneMapping:Rh,CylinderGeometry:oi,Cylindrical:ux,Data3DTexture:Pl,DataArrayTexture:Rl,DataTexture:Dn,DataTextureLoader:P_,DataUtils:fg,DecrementStencilOp:l0,DecrementWrapStencilOp:h0,DefaultLoadingManager:Zp,DepthFormat:ai,DepthStencilFormat:Fi,DepthTexture:ws,DetachedBindMode:jf,DirectionalLight:du,DirectionalLightHelper:bx,DiscreteInterpolant:Yp,DodecahedronGeometry:kl,DoubleSide:en,DstAlphaFactor:Vf,DstColorFactor:Hf,DynamicCopyUsage:E0,DynamicDrawUsage:y0,DynamicReadUsage:b0,EdgesGeometry:Sp,EllipseCurve:zl,EqualCompare:ap,EqualDepth:Ro,EqualStencilFunc:p0,EquirectangularReflectionMapping:Hr,EquirectangularRefractionMapping:Wr,Euler:Xn,EventDispatcher:qn,ExternalTexture:Zh,ExtrudeGeometry:fr,FileLoader:Si,Float16BufferAttribute:vg,Float32BufferAttribute:At,FloatType:on,Fog:xa,FogExp2:Ll,FramebufferTexture:zg,FrontSide:Mi,Frustum:Ss,FrustumArray:Fl,GLBufferAttribute:lx,GLSL1:A0,GLSL3:oh,GreaterCompare:op,GreaterDepth:Io,GreaterEqualCompare:Al,GreaterEqualDepth:Po,GreaterEqualStencilFunc:x0,GreaterStencilFunc:g0,GridHelper:vx,Group:de,HTMLTexture:Hg,HalfFloatType:ri,HemisphereLight:cu,HemisphereLightHelper:yx,IcosahedronGeometry:Vl,ImageBitmapLoader:F_,ImageLoader:pa,ImageUtils:fp,IncrementStencilOp:o0,IncrementWrapStencilOp:c0,InstancedBufferAttribute:ur,InstancedBufferGeometry:Qp,InstancedInterleavedBuffer:ox,InstancedMesh:Yh,Int16BufferAttribute:xg,Int32BufferAttribute:yg,Int8BufferAttribute:mg,IntType:yl,InterleavedBuffer:Dl,InterleavedBufferAttribute:bs,Interpolant:vr,InterpolateBezier:rh,InterpolateDiscrete:na,InterpolateLinear:cl,InterpolateSmooth:vo,InterpolationSamplingMode:P0,InterpolationSamplingType:R0,InvertStencilOp:u0,KeepStencilOp:cs,KeyframeTrack:Fn,LOD:gp,LatheGeometry:Gl,Layers:Il,LessCompare:rp,LessDepth:Co,LessEqualCompare:Tl,LessEqualDepth:vs,LessEqualStencilFunc:m0,LessStencilFunc:f0,Light:Zi,LightProbe:jp,Line:Yi,Line3:px,LineBasicMaterial:un,LineCurve:jh,LineCurve3:Ap,LineDashedMaterial:Gp,LineLoop:yp,LineSegments:ci,LinearFilter:we,LinearInterpolant:ru,LinearMipMapLinearFilter:$m,LinearMipMapNearestFilter:qm,LinearMipmapLinearFilter:ti,LinearMipmapNearestFilter:Xr,LinearSRGBColorSpace:sa,LinearToneMapping:Th,LinearTransfer:ra,Loader:vn,LoaderUtils:dh,LoadingManager:lu,LoopOnce:Qf,LoopPingPong:ep,LoopRepeat:tp,MOUSE:ms,Material:qe,MaterialBlending:Wm,MaterialLoader:jl,MathUtils:Cl,Matrix2:mh,Matrix3:$t,Matrix4:Xt,MaxEquation:Of,Mesh:Gt,MeshBasicMaterial:He,MeshDepthMaterial:iu,MeshDistanceMaterial:su,MeshLambertMaterial:zp,MeshMatcapMaterial:Vp,MeshNormalMaterial:kp,MeshPhongMaterial:Fp,MeshPhysicalMaterial:mr,MeshStandardMaterial:je,MeshToonMaterial:Bp,MinEquation:Uf,MirroredRepeatWrapping:Qr,MixOperation:Jf,MultiplyBlending:ih,MultiplyOperation:ga,NearestFilter:De,NearestMipMapLinearFilter:Ym,NearestMipMapNearestFilter:Xm,NearestMipmapLinearFilter:nr,NearestMipmapNearestFilter:Lh,NeutralToneMapping:Ih,NeverCompare:sp,NeverDepth:To,NeverStencilFunc:d0,NoBlending:ii,NoColorSpace:xi,NoNormalPacking:n0,NoToneMapping:Wn,NormalAnimationBlendMode:El,NormalBlending:gs,NormalGAPacking:s0,NormalRGPacking:i0,NotEqualCompare:lp,NotEqualDepth:Lo,NotEqualStencilFunc:_0,NumberKeyframeTrack:$l,Object3D:oe,ObjectLoader:U_,ObjectSpaceNormalMap:ip,OctahedronGeometry:Ma,OneFactor:Bf,OneMinusConstantAlphaFactor:Zf,OneMinusConstantColorFactor:qf,OneMinusDstAlphaFactor:Gf,OneMinusDstColorFactor:Wf,OneMinusSrcAlphaFactor:Eo,OneMinusSrcColorFactor:zf,OrthographicCamera:ba,PCFShadowMap:Gr,PCFSoftShadowMap:If,PMREMGenerator:_h,Path:ca,PerspectiveCamera:Ve,Plane:_i,PlaneGeometry:li,PlaneHelper:Tx,PointLight:Kl,PointLightHelper:_x,Points:vp,PointsMaterial:qh,PolarGridHelper:Mx,PolyhedronGeometry:$i,PositionalAudio:W_,PropertyBinding:ce,PropertyMixer:rm,QuadraticBezierCurve:Qh,QuadraticBezierCurve3:tu,Quaternion:Xe,QuaternionKeyframeTrack:Zl,QuaternionLinearInterpolant:$p,R11_EAC_Format:zo,RED_GREEN_RGTC2_Format:ea,RED_RGTC1_Format:al,REVISION:gl,RG11_EAC_Format:ta,RGBADepthPacking:Qm,RGBAFormat:ln,RGBAIntegerFormat:wl,RGBA_ASTC_10x10_Format:tl,RGBA_ASTC_10x5_Format:Ko,RGBA_ASTC_10x6_Format:jo,RGBA_ASTC_10x8_Format:Qo,RGBA_ASTC_12x10_Format:el,RGBA_ASTC_12x12_Format:nl,RGBA_ASTC_4x4_Format:Ho,RGBA_ASTC_5x4_Format:Wo,RGBA_ASTC_5x5_Format:Xo,RGBA_ASTC_6x5_Format:Yo,RGBA_ASTC_6x6_Format:qo,RGBA_ASTC_8x5_Format:$o,RGBA_ASTC_8x6_Format:Zo,RGBA_ASTC_8x8_Format:Jo,RGBA_BPTC_Format:il,RGBA_ETC2_EAC_Format:ko,RGBA_PVRTC_2BPPV1_Format:Oo,RGBA_PVRTC_4BPPV1_Format:Uo,RGBA_S3TC_DXT1_Format:qr,RGBA_S3TC_DXT3_Format:$r,RGBA_S3TC_DXT5_Format:Zr,RGBDepthPacking:t0,RGBFormat:Bh,RGBIntegerFormat:Zm,RGB_BPTC_SIGNED_Format:sl,RGB_BPTC_UNSIGNED_Format:rl,RGB_ETC1_Format:Fo,RGB_ETC2_Format:Bo,RGB_PVRTC_2BPPV1_Format:No,RGB_PVRTC_4BPPV1_Format:Do,RGB_S3TC_DXT1_Format:Yr,RGDepthPacking:e0,RGFormat:Wi,RGIntegerFormat:Sl,RawShaderMaterial:nu,Ray:Cs,Raycaster:cx,RectAreaLight:Kp,RedFormat:bl,RedIntegerFormat:_a,ReinhardToneMapping:Ah,RenderTarget:Vh,RenderTarget3D:sx,RepeatWrapping:or,ReplaceStencilOp:a0,ReverseSubtractEquation:Nf,RingGeometry:Hl,SIGNED_R11_EAC_Format:Vo,SIGNED_RED_GREEN_RGTC2_Format:ll,SIGNED_RED_RGTC1_Format:ol,SIGNED_RG11_EAC_Format:Go,SRGBColorSpace:Ge,SRGBTransfer:he,Scene:Gh,ShaderChunk:te,ShaderLib:Gn,ShaderMaterial:On,ShadowMaterial:Np,Shape:Es,ShapeGeometry:Wl,ShapePath:Rx,ShapeUtils:Hn,ShortType:Nh,Skeleton:Ol,SkeletonHelper:gx,SkinnedMesh:_p,Source:Bi,Sphere:Ye,SphereGeometry:xn,Spherical:ph,SphericalHarmonics3:fu,SplineCurve:eu,SpotLight:uu,SpotLightHelper:mx,Sprite:Ul,SpriteMaterial:Nl,SrcAlphaFactor:wo,SrcAlphaSaturateFactor:Xf,SrcColorFactor:kf,StaticCopyUsage:w0,StaticDrawUsage:aa,StaticReadUsage:M0,StereoCamera:k_,StreamCopyUsage:T0,StreamDrawUsage:v0,StreamReadUsage:S0,StringKeyframeTrack:Ps,SubtractEquation:Df,SubtractiveBlending:nh,TOUCH:us,TangentSpaceNormalMap:bi,TetrahedronGeometry:Xl,Texture:Te,TextureLoader:I_,TextureUtils:Nx,Timer:im,TimestampQuery:C0,TorusGeometry:As,TorusKnotGeometry:Yl,Triangle:gn,TriangleFanDrawMode:jm,TriangleStripDrawMode:Km,TrianglesDrawMode:Jm,TubeGeometry:ql,UVMapping:xl,Uint16BufferAttribute:Hh,Uint32BufferAttribute:Wh,Uint8BufferAttribute:gg,Uint8ClampedBufferAttribute:_g,Uniform:_u,UniformsGroup:ax,UniformsLib:gt,UniformsUtils:Op,UnsignedByteType:mn,UnsignedInt101111Type:Oh,UnsignedInt248Type:cr,UnsignedInt5999Type:Uh,UnsignedIntType:Un,UnsignedShort4444Type:vl,UnsignedShort5551Type:Ml,UnsignedShortType:lr,VSMShadowMap:er,Vector2:J,Vector3:C,Vector4:pe,VectorKeyframeTrack:ou,VideoFrameTexture:kg,VideoTexture:Mp,WebGL3DRenderTarget:sg,WebGLArrayRenderTarget:ig,WebGLCoordinateSystem:wn,WebGLCubeRenderTarget:xu,WebGLRenderTarget:An,WebGLRenderer:xm,WebGLUtils:gm,WebGPUCoordinateSystem:Ms,WebXRController:Mo,WireframeGeometry:Dp,WrapAroundEnding:ia,ZeroCurvatureEnding:ds,ZeroFactor:Ff,ZeroSlopeEnding:fs,ZeroStencilOp:r0,createCanvasElement:up,error:It,getConsoleFunction:U0,log:la,setConsoleFunction:N0,warn:ut,warnOnce:Vi},Symbol.toStringTag,{value:"Module"})),_f={type:"change"},yu={type:"start"},ym={type:"end"},yo=new Cs,xf=new _i,RS=Math.cos(70*Cl.DEG2RAD),Ue=new C,fn=2*Math.PI,_e={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Jc=1e-6;class PS extends cm{constructor(t,e=null){super(t,e),this.state=_e.NONE,this.target=new C,this.cursor=new C,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ms.ROTATE,MIDDLE:ms.DOLLY,RIGHT:ms.PAN},this.touches={ONE:us.ROTATE,TWO:us.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new C,this._lastQuaternion=new Xe,this._lastTargetPosition=new C,this._quat=new Xe().setFromUnitVectors(t.up,new C(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new ph,this._sphericalDelta=new ph,this._scale=1,this._panOffset=new C,this._rotateStart=new J,this._rotateEnd=new J,this._rotateDelta=new J,this._panStart=new J,this._panEnd=new J,this._panDelta=new J,this._dollyStart=new J,this._dollyEnd=new J,this._dollyDelta=new J,this._dollyDirection=new C,this._mouse=new J,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=LS.bind(this),this._onPointerDown=IS.bind(this),this._onPointerUp=DS.bind(this),this._onContextMenu=zS.bind(this),this._onMouseWheel=OS.bind(this),this._onKeyDown=FS.bind(this),this._onTouchStart=BS.bind(this),this._onTouchMove=kS.bind(this),this._onMouseDown=NS.bind(this),this._onMouseMove=US.bind(this),this._interceptControlDown=VS.bind(this),this._interceptControlUp=GS.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(t){this._cursorStyle=t,t==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction=""}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(_f),this.update(),this.state=_e.NONE}pan(t,e){this._pan(t,e),this.update()}dollyIn(t){this._dollyIn(t),this.update()}dollyOut(t){this._dollyOut(t),this.update()}rotateLeft(t){this._rotateLeft(t),this.update()}rotateUp(t){this._rotateUp(t),this.update()}update(t=null){const e=this.object.position;Ue.copy(e).sub(this.target),Ue.applyQuaternion(this._quat),this._spherical.setFromVector3(Ue),this.autoRotate&&this.state===_e.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,i=this.maxAzimuthAngle;isFinite(n)&&isFinite(i)&&(n<-Math.PI?n+=fn:n>Math.PI&&(n-=fn),i<-Math.PI?i+=fn:i>Math.PI&&(i-=fn),n<=i?this._spherical.theta=Math.max(n,Math.min(i,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+i)/2?Math.max(n,this._spherical.theta):Math.min(i,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Ue.setFromSpherical(this._spherical),Ue.applyQuaternion(this._quatInverse),e.copy(this.target).add(Ue),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=Ue.length();a=this._clampDistance(o*this._scale);const l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const o=new C(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new C(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=Ue.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(yo.origin.copy(this.object.position),yo.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(yo.direction))<RS?this.object.lookAt(this.target):(xf.setFromNormalAndCoplanarPoint(this.object.up,this.target),yo.intersectPlane(xf,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Jc||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Jc||this._lastTargetPosition.distanceToSquared(this.target)>Jc?(this.dispatchEvent(_f),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?fn/60*this.autoRotateSpeed*t:fn/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){Ue.setFromMatrixColumn(e,0),Ue.multiplyScalar(-t),this._panOffset.add(Ue)}_panUp(t,e){this.screenSpacePanning===!0?Ue.setFromMatrixColumn(e,1):(Ue.setFromMatrixColumn(e,0),Ue.crossVectors(this.object.up,Ue)),Ue.multiplyScalar(t),this._panOffset.add(Ue)}_pan(t,e){const n=this.domElement;if(this.object.isPerspectiveCamera){const i=this.object.position;Ue.copy(i).sub(this.target);let r=Ue.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),i=t-n.left,r=e-n.top,a=n.width,o=n.height;this._mouse.x=i/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(fn*this._rotateDelta.x/e.clientHeight),this._rotateUp(fn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),i=.5*(t.pageY+e.y);this._rotateStart.set(n,i)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),i=.5*(t.pageY+e.y);this._panStart.set(n,i)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,i=t.pageY-e.y,r=Math.sqrt(n*n+i*i);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const n=this._getSecondPointerPosition(t),i=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(i,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(fn*this._rotateDelta.x/e.clientHeight),this._rotateUp(fn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),i=.5*(t.pageY+e.y);this._panEnd.set(n,i)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,i=t.pageY-e.y,r=Math.sqrt(n*n+i*i);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(t.pageX+e.x)*.5,o=(t.pageY+e.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new J,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function IS(s){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(s.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(s)&&(this._addPointer(s),s.pointerType==="touch"?this._onTouchStart(s):this._onMouseDown(s),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function LS(s){this.enabled!==!1&&(s.pointerType==="touch"?this._onTouchMove(s):this._onMouseMove(s))}function DS(s){switch(this._removePointer(s),this._pointers.length){case 0:this.domElement.releasePointerCapture(s.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(ym),this.state=_e.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function NS(s){let t;switch(s.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case ms.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(s),this.state=_e.DOLLY;break;case ms.ROTATE:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=_e.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=_e.ROTATE}break;case ms.PAN:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=_e.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=_e.PAN}break;default:this.state=_e.NONE}this.state!==_e.NONE&&this.dispatchEvent(yu)}function US(s){switch(this.state){case _e.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(s);break;case _e.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(s);break;case _e.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(s);break}}function OS(s){this.enabled===!1||this.enableZoom===!1||this.state!==_e.NONE||(s.preventDefault(),this.dispatchEvent(yu),this._handleMouseWheel(this._customWheelEvent(s)),this.dispatchEvent(ym))}function FS(s){this.enabled!==!1&&this._handleKeyDown(s)}function BS(s){switch(this._trackPointer(s),this._pointers.length){case 1:switch(this.touches.ONE){case us.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(s),this.state=_e.TOUCH_ROTATE;break;case us.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(s),this.state=_e.TOUCH_PAN;break;default:this.state=_e.NONE}break;case 2:switch(this.touches.TWO){case us.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(s),this.state=_e.TOUCH_DOLLY_PAN;break;case us.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(s),this.state=_e.TOUCH_DOLLY_ROTATE;break;default:this.state=_e.NONE}break;default:this.state=_e.NONE}this.state!==_e.NONE&&this.dispatchEvent(yu)}function kS(s){switch(this._trackPointer(s),this.state){case _e.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(s),this.update();break;case _e.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(s),this.update();break;case _e.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(s),this.update();break;case _e.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(s),this.update();break;default:this.state=_e.NONE}}function zS(s){this.enabled!==!1&&s.preventDefault()}function VS(s){s.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function GS(s){s.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const Qe=(s,t,e,n)=>({x0:s,x1:t,z0:e,z1:n}),Ei=[{id:"jack",label:"JACK'S LABORATORY",bounds:Qe(-17,-10.5,-13.1,-7.6),ceiling:3.4,use:"Research, prototypes, monitors"},{id:"control",label:"MAIN CONTROL ROOM",bounds:Qe(-6,6,-13.1,-8.1),ceiling:4,use:"Array observation and control consoles"},{id:"sarah",label:"SARAH'S OFFICE",bounds:Qe(10.5,17,-13.1,-7.6),ceiling:3.4,use:"Research, planning, tablet"},{id:"storage",label:"EQUIPMENT STORAGE",bounds:Qe(-17,-12,-7.6,-3.6),ceiling:3.2,use:"Sensors, tools and field equipment"},{id:"break",label:"BREAK NOOK",bounds:Qe(-17,-12,-3.6,.4),ceiling:3.2,use:"Coffee and small table"},{id:"utility",label:"SERVER / UTILITY",bounds:Qe(12,17,-7.6,-1.6),ceiling:3.6,use:"Server racks and power"},{id:"array",label:"TOMBS ARRAY",bounds:Qe(-9,9,-5.2,5.5),ceiling:7.5,use:"Ring apparatus and central platform"},{id:"vestibule",label:"SECURITY VESTIBULE",bounds:Qe(-3,3,8.5,11.5),ceiling:3.3,use:"Badge reader and access control"}],vm=[{id:"loop-west",bounds:Qe(-12,-9,-7.6,8.5),ceiling:3.4},{id:"loop-east",bounds:Qe(9,12,-7.6,8.5),ceiling:3.4},{id:"loop-south",bounds:Qe(-12,12,5.5,8.5),ceiling:3.4},{id:"jack-connection",bounds:Qe(-10.5,-6,-11.1,-7.6),ceiling:3.4},{id:"sarah-connection",bounds:Qe(6,10.5,-11.1,-7.6),ceiling:3.4},{id:"south-entrance",bounds:Qe(-3,3,8.35,8.6),ceiling:3.3},{id:"north-observation-gallery",bounds:Qe(-9,9,-8.1,-5.2),ceiling:4}],HS=[{id:"jack-door",at:[-10.5,-9.45],along:"z",width:1.3,height:2.35,sliding:!0},{id:"sarah-door",at:[10.5,-9.45],along:"z",width:1.3,height:2.35,sliding:!0},{id:"control-west",at:[-6,-9.5],along:"z",width:1.35,height:2.4,sliding:!0},{id:"control-east",at:[6,-9.5],along:"z",width:1.35,height:2.4,sliding:!0},{id:"storage-door",at:[-12,-5.45],along:"z",width:1.25,height:2.25,sliding:!1},{id:"break-door",at:[-12,-1.8],along:"z",width:1.25,height:2.25,sliding:!1},{id:"utility-door",at:[12,-4.45],along:"z",width:1.25,height:2.4,sliding:!0},{id:"array-service",at:[9,0],along:"z",width:1.35,height:2.7,sliding:!0,locked:!0},{id:"security-inner",at:[0,8.5],along:"x",width:2.4,height:2.6,sliding:!0},{id:"security-outer",at:[0,11.5],along:"x",width:2.4,height:2.6,sliding:!0}],WS=[{id:"array-observation",at:[0,-5.2],along:"x",width:10,sill:.95,height:2.1,kind:"glass"},{id:"control-external",at:[0,-13.1],along:"x",width:4,sill:1.15,height:1.6,kind:"glass"},{id:"control-observation",at:[0,-8.1],along:"x",width:9,sill:.95,height:2.1,kind:"glass"},{id:"jack-external",at:[-14.5,-13.1],along:"x",width:2.2,sill:1.1,height:1.3,kind:"glass"},{id:"sarah-external",at:[14.5,-13.1],along:"x",width:2.2,sill:1.1,height:1.3,kind:"glass"}],Mm=[],En=(s,t,e,n,i=[],r="internal")=>{Mm.push({id:s,from:t,to:e,height:n,openings:i,material:r})},Is=(s,t={},e=[])=>{const{x0:n,x1:i,z0:r,z1:a}=s.bounds,o=s.ceiling,l=s.id;e.includes("n")||En(`${l}-north`,[n,r],[i,r],o,t.n??[],s.id==="array"?"reinforced":"external"),En(`${l}-east`,[i,r],[i,a],o,t.e??[],s.id==="array"?"array":"internal"),En(`${l}-south`,[n,a],[i,a],o,t.s??[],s.id==="array"?"array":"internal"),En(`${l}-west`,[n,r],[n,a],o,t.w??[],s.id==="array"?"array":"internal")};Is(Ei[0],{n:["jack-external"],e:["jack-door"]});Is(Ei[1],{n:["control-external"],s:["control-observation"],e:["control-east"],w:["control-west"]});Is(Ei[2],{n:["sarah-external"],w:["sarah-door"]});Is(Ei[3],{e:["storage-door"]},["n"]);Is(Ei[4],{e:["break-door"]},["n"]);Is(Ei[5],{w:["utility-door"]},["n"]);const bm=[[-6,-5.2],[6,-5.2],[9,-2.2],[9,2.5],[6,5.5],[-6,5.5],[-9,2.5],[-9,-2.2]],yf=bm;for(let s=0;s<8;s++){const t=yf[s],e=yf[(s+1)%8];En(`array-wall-${s}`,t,e,7.5,s===0?["array-observation"]:s===2?["array-service"]:[],"array")}Is(Ei[7],{n:["security-inner"],s:["security-outer"]});En("north-notch-west",[-10.5,-11.1],[-6,-11.1],3.4,[],"external");En("north-notch-east",[6,-11.1],[10.5,-11.1],3.4,[],"external");En("west-outside",[-12,.4],[-12,5.5],3.4,[],"external");En("southwest-outside",[-12,5.5],[-9,8.5],3.4,[],"external");En("south-outside-west",[-9,8.5],[-3,8.5],3.4,[],"external");En("east-outside",[12,-1.6],[12,5.5],3.4,[],"external");En("southeast-outside",[12,5.5],[9,8.5],3.4,[],"external");En("south-outside-east",[3,8.5],[9,8.5],3.4,[],"external");const Sm=[[-17,-13.1],[-10.5,-13.1],[-10.5,-11.1],[-6,-11.1],[-6,-13.1],[6,-13.1],[6,-11.1],[10.5,-11.1],[10.5,-13.1],[17,-13.1],[17,-1.6],[12,-1.6],[12,5.5],[9,8.5],[3,8.5],[3,11.5],[-3,11.5],[-3,8.5],[-9,8.5],[-12,5.5],[-12,.4],[-17,.4]],XS=[...Ei.map(s=>({id:`room:${s.id}`,bounds:s.bounds})),...vm.map(s=>({id:`hall:${s.id}`,bounds:s.bounds})),{id:"outside:forecourt",bounds:Qe(-2.1,2.1,11.5,15)}],YS=[{id:"jackDeskSeat",xyz:[-13,0,-11.55],yaw:Math.PI,label:"Jack at primary workstation"},{id:"jackBenchChair",xyz:[-14,0,-8.85],yaw:0,label:"The bench chair Jack fetches (Ch 1)"},{id:"intercomTarget",xyz:[-12.25,.86,-12.3],yaw:Math.PI,label:"Chapter 1 intercom, on Jack’s desk"},{id:"sarahDeskSeat",xyz:[15.55,0,-10.4],yaw:Math.PI/2,label:"Sarah at desk; desk opposite doorway"},{id:"tabletPickup",xyz:[16.3,.75,-9.75],yaw:Math.PI/2,label:"Sarah tablet"},{id:"sceneHandoffStart",xyz:[-11,1.75,-9.5],yaw:0,label:"Camera departs Jack"},{id:"sceneHandoffEnd",xyz:[13.4,1.65,-9.7],yaw:Math.PI/2,label:"Camera arrives behind Sarah"},{id:"arrayGlassLook",xyz:[0,1.7,-10.6],yaw:0,label:"Array view from the control room, over the consoles"},{id:"emergencyLever",xyz:[-4.6,1.1,-12.6],yaw:Math.PI,label:"Manual Array shutdown"},{id:"securityScanner",xyz:[2.86,1.25,9.05],yaw:-Math.PI/2,label:"Badge access"},{id:"labExit",xyz:[0,0,11.9],yaw:0,label:"Exterior entrance"},{id:"vehicleSpawn",xyz:[0,0,18],yaw:Math.PI,label:"Vehicle staging outside"},{id:"jackSpawn",xyz:[-13,0,-10.6],yaw:Math.PI,label:"Chapter 1 Jack"},{id:"sarahSpawn",xyz:[15,0,-10.4],yaw:Math.PI/2,label:"Chapter 1 Sarah"}],ue={rooms:Ei,halls:vm,doors:HS,portals:WS,walls:Mm,walk:XS,anchors:YS};function qS(s,t){return ue.rooms.find(n=>vh(s,t,n.bounds))?.id??(ue.halls.some(n=>vh(s,t,n.bounds))?"corridor":"outside")}function vh(s,t,e,n=0){return s>=e.x0-n&&s<=e.x1+n&&t>=e.z0-n&&t<=e.z1+n}function sr(s){const t=ue.anchors.find(e=>e.id===s);if(!t)throw new Error(`Unknown TOMBS anchor: ${s}`);return t}function $S(s,t){return ue.walk.some(e=>vh(s,t,e.bounds))}const zt=(s,t,e,n,i,r,a,o,l,c=!0,h={})=>({id:s,room:t,kind:e,x:n,z:i,w:r,d:a,h:o,facing:l,solid:c,...h}),ec=[zt("jack.desk.primary","jack","desk",-13,-12.5,2,.8,.74,"n",!0,{note:"Jack's workstation, under the window"}),zt("jack.desk.secondary","jack","desk",-15.3,-12.5,2,.8,.74,"n",!0,{note:"the other console next to Jack (Ch 1)"}),zt("jack.chair.primary","jack","chair",-13,-11.55,.62,.6,.95,"n",!1),zt("jack.chair.bench","jack","chair",-14,-8.85,.62,.6,.95,"s",!1,{note:"the bench's chair: the one Jack drags back in Ch 1"}),zt("jack.intercom","jack","intercom",-12.25,-12.3,.12,.1,.14,"n",!1,{y0:.74,note:"on his desk at the front right, within reach"}),zt("jack.lamp","jack","desk-lamp",-12.2,-12.78,.16,.16,.62,"n",!1,{y0:.74,note:"his desk lamp, back right"}),zt("jack.bench","jack","bench",-14.5,-8.05,3,.7,.9,"s",!0,{note:"prototype bench along the south wall, behind the chairs"}),zt("jack.bench.shelf","jack","wall-shelf",-14.5,-7.82,2.6,.24,.32,"s",!1,{y0:1.48,note:"bottles over the bench"}),zt("jack.microscope","jack","microscope",-15.6,-8.12,.24,.3,.44,"s",!1,{y0:.9}),zt("jack.tubes","jack","tube-rack",-14.75,-8.2,.26,.1,.12,"s",!1,{y0:.9}),zt("jack.plant","jack","pot-plant",-14.5,-7.86,.2,.2,.42,"s",!1,{y0:1.4925,note:"on the bottle shelf"}),zt("jack.cabinet","jack","glass-cabinet",-10.83,-12.35,.45,1.1,2.1,"e",!0,{note:"glass-fronted, east wall north of the door"}),zt("jack.rack","jack","rack",-16.6,-10.2,.6,1.2,2,"w",!0,{note:"instrument rack on the west wall"}),zt("sarah.desk","sarah","desk",16.48,-10.4,.8,2,.74,"e",!0,{note:"against the east wall, opposite the door"}),zt("sarah.chair","sarah","chair",15.55,-10.4,.6,.62,.95,"e",!1),zt("sarah.tablet","sarah","tablet",16.3,-9.75,.26,.18,.012,"e",!1,{y0:.74,note:"Sarah's tablet, on her desk"}),zt("sarah.credenza","sarah","credenza",14.5,-12.7,2,.45,.75,"n",!0,{note:"low, under the window"}),zt("sarah.bookcase","sarah","bookcase",14.4,-7.92,1.6,.4,2,"s",!0),zt("sarah.armchair","sarah","armchair",11.25,-12.35,.8,.8,.85,"e",!0,{note:"reading corner, clear of the door"}),zt("sarah.plant","sarah","plant",16.55,-12.6,.5,.5,1.2,"w",!0),zt("control.console.west","control","console",-2.4,-9,2.2,.9,.78,"s"),zt("control.console.centre","control","console",0,-9,2.2,.9,.78,"s"),zt("control.console.east","control","console",2.4,-9,2.2,.9,.78,"s"),zt("control.chair.west","control","chair",-2.4,-10,.62,.6,.95,"s",!1),zt("control.chair.centre","control","chair",0,-10,.62,.6,.95,"s",!1),zt("control.chair.east","control","chair",2.4,-10,.62,.6,.95,"s",!1),zt("control.emergency-panel","control","emergency-panel",-4.6,-12.8,.7,.3,1.8,"n",!0,{note:"the physical shutdown lever (Ch 2)"}),zt("control.sensor-cabinet","control","cabinet",4.6,-12.7,.9,.5,1,"n",!0,{note:"the drawer the environmental sensor comes out of (Ch 5)"}),...[-7.05,-6.15,-5.25,-4.35].map((s,t)=>zt(`storage.shelf.${t+1}`,"storage","shelf",-16.6,s,.6,.85,2.2,"w")),zt("storage.workbench","storage","bench",-14.4,-7.2,1.8,.6,.9,"n"),zt("storage.field-case","storage","crate",-14.6,-4.05,1,.6,.5,"s"),zt("break.counter","break","counter",-15.3,-3.19,2.8,.65,.9,"n"),zt("break.coffee","break","coffee-machine",-16.2,-3.22,.32,.38,.42,"n",!1,{y0:.9}),zt("break.fridge","break","fridge",-16.55,-.1,.7,.7,1.8,"w"),zt("break.table","break","round-table",-14.6,-1.1,1.1,1.1,.74,"n"),zt("break.chair.west","break","chair",-15.45,-1.1,.5,.5,.88,"e",!1),zt("break.chair.north","break","chair",-14.6,-1.95,.5,.5,.88,"s",!1),zt("break.chair.south","break","chair",-14.6,-.25,.5,.5,.88,"n",!1),zt("break.plant","break","plant",-12.55,-.1,.45,.45,1.1,"w"),...[-6.9,-6.05,-5.2,-4.35,-3.5].map((s,t)=>zt(`utility.rack.${t+1}`,"utility","rack",16.35,s,1.1,.8,2.2,"e")),zt("utility.ups.1","utility","cabinet",13.3,-7.2,1,.6,1.8,"n"),zt("utility.ups.2","utility","cabinet",14.4,-7.2,1,.6,1.8,"n"),zt("utility.electrical","utility","electrical-panel",14.5,-1.8,.9,.2,1.4,"s",!1,{y0:.8}),zt("array.station.west.1","array","console",-8.3,-1,.9,1.6,.78,"w"),zt("array.station.west.2","array","console",-8.3,1.2,.9,1.6,.78,"w"),zt("array.station.east.1","array","console",8.3,-1.55,.9,1.1,.78,"e"),zt("array.station.east.2","array","console",8.3,1.55,.9,1.1,.78,"e"),zt("vestibule.counter","vestibule","counter",-2.55,10,.6,1.6,1.05,"w"),zt("vestibule.chair","vestibule","chair",-1.9,10,.5,.5,.95,"w",!1),zt("vestibule.reader","vestibule","reader",2.86,9.05,.08,.16,.22,"e",!1,{y0:1.15,note:"badge reader beside the inner door"}),zt("vestibule.plant.west","vestibule","plant",-2.5,11.05,.45,.45,1.1,"e"),zt("vestibule.plant.east","vestibule","plant",2.5,11.05,.45,.45,1.1,"w")];function vu(s,t=ue.portals){const e=s.from[0],n=s.from[1],i=s.to[0],r=s.to[1],a=i-e,o=r-n,l=Math.hypot(a,o),c=a/l,h=o/l,d=s.openings.map(_=>{const m=ue.doors.find(y=>y.id===_),g=t.find(y=>y.id===_);if(!m&&!g)throw new Error(`No such opening ${_}`);const v=(m??g).at,b=(v[0]-e)*c+(v[1]-n)*h;return{id:_,start:Math.max(0,b-(m?.width??g.width)/2),end:Math.min(l,b+(m?.width??g.width)/2),sill:g?.sill??0,height:m?.height??g.height,kind:g?.kind??"door"}}).filter(_=>_.start<_.end).sort((_,m)=>_.start-m.start),u=[],f=(_,m,g,v,b=!1,y=s.id)=>{m-_<.005||v-g<.005||u.push({from:[e+c*_,n+h*_],to:[e+c*m,n+h*m],y0:g,y1:v,glass:b,id:y})};let p=0;for(const _ of d){if(_.start<p-.001)throw new Error(`Overlapping openings in ${s.id}`);f(p,_.start,0,s.height),f(_.start,_.end,0,_.sill,!1,`${_.id}:sill`),f(_.start,_.end,_.sill+_.height,s.height,!1,`${_.id}:lintel`),_.kind==="glass"&&f(_.start,_.end,_.sill,_.sill+_.height,!0,`${_.id}:pane`),p=_.end}return f(p,l,0,s.height),u}function ZS(){const s=[];for(const t of ue.walls)for(const e of vu(t))e.y0<1.8&&e.y1>0&&s.push({id:e.id,x0:e.from[0],z0:e.from[1],x1:e.to[0],z1:e.to[1],height:e.y1,glass:e.glass});for(const t of ec)if(t.solid&&(t.y0??0)<1.2){const e=t.x-t.w/2,n=t.x+t.w/2,i=t.z-t.d/2,r=t.z+t.d/2,a=(t.y0??0)+t.h;s.push({id:`${t.id}:n`,x0:e,z0:i,x1:n,z1:i,height:a},{id:`${t.id}:s`,x0:e,z0:r,x1:n,z1:r,height:a},{id:`${t.id}:w`,x0:e,z0:i,x1:e,z1:r,height:a},{id:`${t.id}:e`,x0:n,z0:i,x1:n,z1:r,height:a})}for(const t of ue.doors){const e=ue.walls.find(h=>h.openings.includes(t.id));if(!e)throw new Error(`Door ${t.id} has no wall`);const n=e.from[0],i=e.from[1],r=e.to[0],a=e.to[1],o=Math.hypot(r-n,a-i),l=(r-n)/o,c=(a-i)/o;s.push({id:`${t.id}:closed`,doorId:t.id,x0:t.at[0]-l*t.width/2,z0:t.at[1]-c*t.width/2,x1:t.at[0]+l*t.width/2,z1:t.at[1]+c*t.width/2,height:t.height})}return s}const JS=ZS();function KS(s,t,e){const n=e.x1-e.x0,i=e.z1-e.z0,r=n*n+i*i,a=r>0?Math.max(0,Math.min(1,((s-e.x0)*n+(t-e.z0)*i)/r)):0,o=e.x0+a*n,l=e.z0+a*i;return(s-o)**2+(t-l)**2}function vf(s,t,e,n){return $S(s,t)?JS.some(i=>(!i.doorId||!n(i.doorId))&&KS(s,t,i)<(e+.12)**2):!0}function jS(s,t,e,n,i,r){const a=Math.max(1,Math.ceil(Math.hypot(e,n)/Math.max(i*.7,.06)));for(let o=0;o<a;o++){const l=s+e/a,c=t+n/a;vf(l,t,i,r)||(s=l),vf(s,c,i,r)||(t=c)}return[s,t]}const Mf=180;class QS{townRoot;metreBridge;localAnchor=new C;seconds=0;duration=3.8;from=1;target=1;factor=1;onProgress;constructor(t,e=1){if(!(e>0))throw new Error("metresToIslandUnits must be positive");this.metreBridge=new de,this.metreBridge.name="TOMBS:metric-to-island",this.metreBridge.scale.setScalar(e),this.townRoot=new de,this.townRoot.name="TOWN:SHRINK-ROOT",this.metreBridge.add(this.townRoot),t.add(this.metreBridge)}get relativeScale(){return this.factor}get phase(){return this.seconds>0&&this.factor!==this.target?"transition":this.factor<=1/Mf+1e-8?"small":"normal"}setWorldAnchor(t,e,n){this.metreBridge.position.set(t,e,n)}setTownPivot(t,e,n){this.localAnchor.set(t,e,n),this.townRoot.position.copy(this.localAnchor).multiplyScalar(1-this.factor)}setScale(t){if(!(t>0&&t<=1))throw new Error("Town relative scale must be (0,1]");this.factor=this.target=this.from=t,this.seconds=0,this.apply()}shrink(t=3.8){this.transitionTo(1/Mf,t)}restore(t=3.8){this.transitionTo(1,t)}transitionTo(t,e){if(e<=0){this.setScale(t);return}this.from=this.factor,this.target=t,this.seconds=0,this.duration=e}update(t){if(this.factor===this.target)return;this.seconds=Math.min(this.duration,this.seconds+Math.max(0,t));const e=this.seconds/this.duration,n=e*e*(3-2*e);this.factor=Math.exp(Math.log(this.from)*(1-n)+Math.log(this.target)*n),this.seconds===this.duration&&(this.factor=this.target),this.apply()}apply(){this.townRoot.scale.setScalar(this.factor),this.townRoot.position.copy(this.localAnchor).multiplyScalar(1-this.factor),this.onProgress?.(this.factor,this.phase)}localToIsland(t,e=new C){return this.townRoot.updateWorldMatrix(!0,!1),e.copy(t).applyMatrix4(this.townRoot.matrixWorld)}islandToLocal(t,e=new C){return this.townRoot.updateWorldMatrix(!0,!1),e.copy(t).applyMatrix4(new Xt().copy(this.townRoot.matrixWorld).invert())}}class t1{mode="night";doors=new Map;flags=new Map;listeners=new Set;constructor(){for(const t of ue.doors)this.doors.set(t.id,!1)}isOpen(t){return this.doors.get(t)??!1}setDoor(t,e){return!this.doors.has(t)||ue.doors.find(i=>i.id===t).locked&&e&&!this.flags.get("arrayAuthorized")?!1:(this.doors.set(t,e),this.changed(),!0)}toggleDoor(t){return this.setDoor(t,!this.isOpen(t))}setMode(t){this.mode=t,t==="emergency"&&this.flags.set("shutdown",!0),this.changed()}setFlag(t,e){this.flags.set(t,e),this.changed()}changed(){for(const t of this.listeners)t()}snapshot(){return{mode:this.mode,doors:Object.fromEntries(this.doors),flags:Object.fromEntries(this.flags)}}restore(t){this.mode=t.mode;for(const e of ue.doors)this.doors.set(e.id,!!t.doors?.[e.id]);this.flags.clear();for(const[e,n]of Object.entries(t.flags??{}))this.flags.set(e,n);this.changed()}}const e1=[{id:"tombs.jack.intercom",label:"Call Sarah on intercom",x:-12.25,y:.86,z:-12.7,range:2.2},{id:"tombs.jack.primary_console",label:"Inspect unauthorized access",x:-13,y:1,z:-12.5,range:2.4},{id:"tombs.sarah.tablet",label:"Pick up Sarah’s tablet",x:16.3,y:.75,z:-9.75,range:2.5},{id:"tombs.control.emergency_lever",label:"Pull emergency shutdown",x:-4.6,y:1.1,z:-12.6,range:2.2},{id:"tombs.security.entry_reader",label:"Access security scanner",x:2.86,y:1.25,z:9.05,range:2.5},{id:"tombs.control.sensor_drawer",label:"Collect field sensor",x:4.6,y:.9,z:-12.4,range:1.8}];function wm(s,t,e=2.6){return[...ue.doors.map(i=>({id:i.id,label:`${i.id.replaceAll("-"," ")} door`,distance:Math.hypot(s-i.at[0],t-i.at[1]),kind:"door"})),...e1.map(i=>({id:i.id,label:i.label,distance:Math.hypot(s-i.x,t-i.z),kind:"object"}))].filter(i=>i.distance<=e).sort((i,r)=>i.distance-r.distance)[0]??null}function n1(s,t){const e=ue.doors.find(n=>n.id===t);if(e)return s.toggleDoor(t)?`${e.id}: ${s.isOpen(e.id)?"OPEN":"CLOSED"}`:"Door locked. Authorization required.";switch(t){case"tombs.jack.intercom":return s.setFlag("calledSarah",!0),"Intercom connected. Sarah is on her way.";case"tombs.jack.primary_console":return s.setFlag("logsInspected",!0),s.setMode("alarm"),"Unauthorized access detected. System logs corrupted.";case"tombs.sarah.tablet":return s.setFlag("tabletCollected",!0),"Sarah’s tablet collected.";case"tombs.control.emergency_lever":return s.setFlag("arrayAuthorized",!0),s.setMode("emergency"),"EMERGENCY SHUTDOWN. Array rings stopping…";case"tombs.security.entry_reader":return s.setFlag("securityScanned",!0),"Badge event logged. Entry camera acknowledged.";case"tombs.control.sensor_drawer":return s.setFlag("sensorCollected",!0),"Environmental sensor equipped.";default:return`No action for ${t}`}}sr("jackDeskSeat"),sr("sceneHandoffEnd"),sr("arrayGlassLook"),sr("labExit");const Or=new Map;function nc(s,t,e,n,i){if(Or.has(s))return Or.get(s);if(typeof document>"u")return Or.set(s,null),null;const r=document.createElement("canvas");r.width=t,r.height=e;const a=r.getContext("2d");if(!a)return Or.set(s,null),null;n(a);const o=new $h(r);return o.colorSpace=Ge,o.anisotropy=4,i&&(o.wrapS=o.wrapT=or,o.repeat.set(i[0],i[1])),Or.set(s,o),o}function Mu(s){let t=s>>>0;return()=>(t=t*1664525+1013904223>>>0)/4294967296}function i1(){return nc("floor",512,512,s=>{const t=Mu(7);s.fillStyle="#5d636a",s.fillRect(0,0,512,512);for(let e=0;e<2;e++)for(let n=0;n<2;n++){const i=88+Math.floor(t()*10);s.fillStyle=`rgb(${i},${i+3},${i+8})`,s.fillRect(e*256+2,n*256+2,252,252);for(let r=0;r<900;r++){const a=i+Math.floor((t()-.5)*18);s.fillStyle=`rgba(${a},${a+2},${a+6},.5)`,s.fillRect(e*256+2+t()*250,n*256+2+t()*250,2,2)}}s.fillStyle="#3f444a",s.fillRect(0,0,512,3),s.fillRect(0,254,512,4),s.fillRect(0,0,3,512),s.fillRect(254,0,4,512)},[1/1.2,1/1.2])}function Em(){return nc("laminate",256,256,s=>{const t=Mu(11);s.fillStyle="#8a9097",s.fillRect(0,0,256,256);for(let e=0;e<256;e++){const n=128+Math.floor((t()-.5)*10);s.fillStyle=`rgba(${n},${n+3},${n+7},.35)`,s.fillRect(0,e,256,1)}},[3,1])}function s1(){return nc("grille",128,128,s=>{s.fillStyle="#b8bec4",s.fillRect(0,0,128,128),s.fillStyle="#2a2f35";for(let t=18;t<82;t+=7)for(let e=18;e<112;e+=7)Math.hypot(e-64,t-48)<40&&(s.beginPath(),s.arc(e,t,2,0,Math.PI*2),s.fill())})}function r1(){return nc("foliage",1024,512,s=>{const t=Mu(23),e=s.createLinearGradient(0,0,0,512);e.addColorStop(0,"#0b1a2b"),e.addColorStop(1,"#102a2a"),s.fillStyle=e,s.fillRect(0,0,1024,512);const n=(i,r,a,o,l)=>{s.save(),s.translate(i,r),s.rotate(o),s.fillStyle=l,s.beginPath(),s.moveTo(0,0),s.quadraticCurveTo(a*.5,-a*.22,a,0),s.quadraticCurveTo(a*.5,a*.22,0,0),s.fill(),s.restore()};for(let i=0;i<3;i++){const r=["#0f2b22","#143a2b","#1b4a35"][i];for(let a=0;a<14;a++){const o=t()*1024,l=140+i*110+t()*120,c=6+Math.floor(t()*6),h=90+t()*120-i*15;for(let d=0;d<c;d++)n(o,l,h,-Math.PI*.95+d/c*Math.PI*.9+(t()-.5)*.2,r)}}for(let i=0;i<60;i++){s.strokeStyle="rgba(120,170,190,.10)",s.lineWidth=2,s.beginPath();const r=t()*1024,a=120+t()*380;s.moveTo(r,a),s.lineTo(r+30+t()*40,a-8-t()*14),s.stroke()}})}const bf={n:[0,-1],s:[0,1],e:[1,0],w:[-1,0]},Kc=s=>Math.atan2(bf[s][0],bf[s][1]);function a1(){const s=new de;s.name="TOMBS:dressing";const t=[],e=[],n=v=>{const b=new je(v);return t.push(b),b},i={chairFabric:n({color:3093563,roughness:.92,metalness:0}),chairShell:n({color:2369582,roughness:.55,metalness:.1}),chrome:n({color:10134186,roughness:.32,metalness:.8}),blackPlastic:n({color:1382428,roughness:.45,metalness:.15}),keyCaps:n({color:2303788,roughness:.6,metalness:.05}),lampMetal:n({color:1908772,roughness:.4,metalness:.6}),white:n({color:15001578,roughness:.6,metalness:.05}),steelTop:n({color:8226189,roughness:.38,metalness:.55,map:Em()}),grey:n({color:11449530,roughness:.5,metalness:.2}),grille:n({color:16777215,roughness:.6,metalness:.1,map:s1()}),ring:new He({color:6160266}),bulb:new He({color:16773584}),glass:new mr({color:13625070,roughness:.08,metalness:0,transparent:!0,opacity:.18,depthWrite:!1,side:en}),bottle:new mr({color:14216948,roughness:.1,metalness:0,transparent:!0,opacity:.45,depthWrite:!1}),capBlue:n({color:2052003,roughness:.5,metalness:0}),leaf:n({color:3902023,roughness:.8,metalness:0,side:en}),pot:n({color:15328215,roughness:.7,metalness:0})};t.push(i.ring,i.bulb,i.glass,i.bottle);const r=n({color:461068,roughness:.18,metalness:.3}),a=v=>(e.push(v),v),o=(v,b,y)=>a(new tn(v,b,y)),l=(v,b,y,T=12)=>a(new oi(v,b,y,T)),c=(v,b,y,T,S,A,x=0,w=0,L=0)=>{const D=new Gt(b,y);return D.position.set(T,S,A),D.rotation.set(w,x,L),D.castShadow=!0,D.receiveShadow=!0,v.add(D),D},h=(v,b,y,T,S)=>{const A=b.distanceTo(y),x=new Gt(l(T,T,A,8),S);return x.position.copy(b).add(y).multiplyScalar(.5),x.quaternion.setFromUnitVectors(new C(0,1,0),y.clone().sub(b).normalize()),x.castShadow=!0,v.add(x),x},d=v=>{const b=new de;return b.name=`tombs:piece:${v.id}`,b.position.set(v.x,v.y0??0,v.z),b.rotation.y=Kc(v.facing),s.add(b),b},u=v=>{const b=v.facing==="n"||v.facing==="s";return{W:b?v.w:v.d,D:b?v.d:v.w}},f=new Map,p=new Map,_=new Map,m=new Map,g=new Map;for(const v of ec){const{W:b,D:y}=u(v),T=v.h;switch(v.kind){case"chair":{const S=new de;S.name=`tombs:chair:${v.id}`,S.position.set(v.x,0,v.z),S.rotation.y=Kc(v.facing),s.add(S);for(let D=0;D<5;D++){const N=D/5*Math.PI*2,P=c(S,o(.035,.03,.3),i.chairShell,Math.sin(N)*.15,.07,Math.cos(N)*.15,N);P.rotation.x=.08,c(S,l(.025,.025,.03,10),i.blackPlastic,Math.sin(N)*.3,.025,Math.cos(N)*.3,0,0,Math.PI/2)}const A=c(S,l(.025,.025,1,10),i.chrome,0,.09,0),x=new de;S.add(x),c(x,o(.5,.075,.47),i.chairFabric,0,-.0375,.01),c(x,o(.46,.03,.42),i.chairShell,0,-.09,.01);const w=new de;w.position.set(0,.08,-.25),w.rotation.x=-.14,x.add(w);for(const[D,N]of[[-.185,.34],[0,0],[.185,-.34]])c(w,o(.19,.64,.07),i.chairFabric,D,.34,Math.abs(D)*.22,N);const L=c(w,a(new oi(.27,.27,.07,20,1,!1,-Math.PI/2,Math.PI)),i.chairFabric,0,.66,.05);L.rotation.set(Math.PI/2,0,0),L.scale.set(1,1,.35),c(x,o(.05,.16,.05),i.chairShell,0,.03,-.27);for(const D of[-1,1])c(x,o(.03,.2,.03),i.chairShell,D*.3,.1,-.02),c(x,o(.075,.035,.25),i.blackPlastic,D*.3,.21,0);S.seatTop=.47,S.setSeat=D=>{S.seatTop=D,x.position.y=D;const N=Math.max(.05,D-.21);A.scale.y=N,A.position.y=.1+N/2},S.setSeat(.47),p.set(v.id,S);break}case"desk":{const S=d(v),A=b>=1.6?2:1,x=.54,w=.31,L=[];for(let P=0;P<A;P++){const F=A===2?P?-.295:.295:0,I=A===2?P?.2:-.2:0,z=y/2-.26,O=new de;O.position.set(F,T,z),O.rotation.y=I,S.add(O),c(O,o(.2,.012,.16),i.blackPlastic,0,.006,.03),c(O,o(.04,.2,.025),i.blackPlastic,0,.11,.035),c(O,o(x+.022,w+.022,.025),i.blackPlastic,0,.36,0);const X=new Gt(a(new li(x,w)),r);X.position.set(0,.36,-.0135),X.rotation.y=Math.PI,X.name=`tombs:screen:${v.id}:${P}`,O.add(X),L.push({mesh:X,width:x,height:w})}_.set(v.id,L);const D=new Kl(5822176,0,2.6,2);D.position.set(0,T+.36,y/2-.45),D.visible=!1,S.add(D),m.set(v.id,D),c(S,o(.44,.022,.14),i.blackPlastic,.05,T+.011,-y/2+.23),c(S,o(.42,.006,.12),i.keyCaps,.05,T+.024,-y/2+.23),c(S,a(new xn(.032,12,8)),i.blackPlastic,-.3,T+.012,-y/2+.23).scale.set(.9,.45,1.5);break}case"desk-lamp":{const S=d(v);c(S,l(.075,.08,.02,20),i.lampMetal,0,.01,0);const A=new C(0,.02,0),x=new C(.02,.4,.06),w=new C(.14,.36,-.2),L=new C(.75,0,-.42);for(const[X,j]of[[A,x],[x,w]])h(S,X,j,.011,i.lampMetal);c(S,a(new xn(.018,10,8)),i.lampMetal,x.x,x.y,x.z);const D=L.clone().sub(w).normalize(),N=c(S,a(new xn(.1,20,10,0,Math.PI*2,0,Math.PI/2)),i.lampMetal,w.x,w.y,w.z);N.quaternion.setFromUnitVectors(new C(0,1,0),D.clone().negate()),N.position.addScaledVector(D,-.02),N.material.side=en;const P=w.clone().addScaledVector(D,.07),F=c(S,a(new xn(.028,12,8)),i.bulb,P.x,P.y,P.z);F.castShadow=!1;const I=new uu(16763274,6,3.2,1,.7,2);I.position.copy(w.clone().addScaledVector(D,.09)),S.add(I);const z=new oe;z.position.copy(L),S.add(z),I.target=z,I.castShadow=!0,I.shadow.mapSize.set(1024,1024),I.shadow.bias=-8e-4,I.shadow.normalBias=.02,I.shadow.camera.near=.05,I.shadow.camera.far=3.2;const O={light:I,bulb:F,get on(){return I.visible},set on(X){I.visible=X,F.visible=X}};g.set(v.id,O);break}case"intercom":{const S=d(v),A=c(S,o(b,T,y),i.grey,0,T/2,0);A.material=[i.grey,i.grey,i.grey,i.grey,i.grey,i.grille];const x=c(S,a(new As(.018,.004,8,24)),i.ring,0,T*.28,-y/2-.002);x.castShadow=!1;break}case"glass-cabinet":{const S=d(v),A=.02;c(S,o(b,T,A),i.white,0,T/2,y/2-A/2);for(const x of[-1,1])c(S,o(A,T,y),i.white,x*(b/2-A/2),T/2,0);c(S,o(b,A,y),i.white,0,A/2,0),c(S,o(b,A,y),i.white,0,T-A/2,0),c(S,o(b,.6,y-.02),i.white,0,.3,.01);for(let x=0;x<3;x++){const w=.75+x*.42;c(S,o(b-2*A,.015,y-.04),i.white,0,w,.01);for(let L=0;L<7;L++){const D=-b/2+.1+L*((b-.2)/6),N=.028+(L+x)%3*.006,P=.14+(L*3+x)%4*.03,F=c(S,l(N,N,P,12),i.bottle,D,w+P/2+.008,.02+(L+x)%2*.06);F.castShadow=!1,c(S,l(N*.6,N*.6,.025,10),i.capBlue,D,w+P+.02,F.position.z)}}for(const x of[-1,1]){const w=c(S,o(b/2-.01,T-.64,.01),i.glass,x*b/4,.62+(T-.64)/2,-y/2+.005);w.castShadow=!1,c(S,o(.012,.18,.02),i.chrome,x*.04,1.2,-y/2-.01)}break}case"wall-shelf":{const S=d(v);c(S,o(b,.025,y),i.white,0,0,0);for(const A of[-1,1])c(S,o(.02,.12,y*.8),i.chrome,A*(b/2-.15),-.06,.02);for(let A=0;A<14;A++){const x=-b/2+.12+A*((b-.24)/13),w=.026+A%3*.005,L=.12+A*5%4*.035;if(A===6||A===7)continue;const D=c(S,l(w,w,L,12),i.bottle,x,.012+L/2,A%2*.05-.02);D.castShadow=!1,c(S,l(w*.6,w*.6,.024,10),i.capBlue,x,.012+L+.012,D.position.z)}break}case"microscope":{const S=d(v);c(S,o(.2,.03,.24),i.white,0,.015,0);const A=c(S,o(.06,.3,.07),i.white,0,.17,.08);A.rotation.x=-.15,c(S,o(.12,.015,.12),i.blackPlastic,0,.13,-.01);const x=c(S,l(.03,.03,.12,14),i.white,0,.32,.03);x.rotation.x=-.5;for(const w of[-1,1]){const L=c(S,l(.012,.014,.08,10),i.blackPlastic,w*.025,.39,-.01);L.rotation.x=-.7}c(S,l(.018,.012,.07,10),i.chrome,0,.21,-.02);break}case"tube-rack":{const S=d(v);c(S,o(b,.01,y),i.white,0,.005,0),c(S,o(b,.01,y),i.white,0,.07,0);for(let A=0;A<6;A++){const x=-b/2+.03+A*((b-.06)/5),w=c(S,l(.008,.008,.1,8),i.bottle,x,.06,0);w.castShadow=!1,c(S,l(.009,.009,.014,8),i.capBlue,x,.115,0)}break}case"pot-plant":{const S=d(v);c(S,l(.07,.055,.12,16),i.pot,0,.06,0);for(let A=0;A<22;A++){const x=A*2.4,w=.04+A%5*.02,L=.12-A%7*.07+(A<8?.06:0),D=c(S,a(new va(.035,6)),i.leaf,Math.cos(x)*w,L,Math.sin(x)*w*.6+.05,x,-.6+A%3*.3,.2);D.castShadow=!1}break}case"tablet":{const S=new de;S.name=`tombs:prop:${v.id}`,S.position.set(v.x,v.y0??0,v.z),S.rotation.y=Kc(v.facing),s.add(S),c(S,o(.25,.008,.175),i.blackPlastic,0,.004,0);const A=new Gt(a(new li(.228,.155)),r);A.rotation.x=-Math.PI/2,A.position.y=.0085,A.name=`tombs:screen:${v.id}`,S.add(A),S.userData.screen=A,f.set(v.id,S);break}}}return{group:s,chairs:p,screens:_,glows:m,lamps:g,props:f,screenOff:r,dispose(){for(const v of e)v.dispose();for(const v of t)v.dispose();s.removeFromParent()}}}const gi={floor:9146518,wall:12765390,external:10134958,arrayWall:3429480,console:1909288,metal:9410463,desk:9080983,chair:3093563,cabinet:14869992};class o1{constructor(t,e){this.root=t,this.mat=e}root;mat;lists=new Map;add(t,e,n,i,r,a,o,l=0){let c=this.lists.get(t);c||(c=[],this.lists.set(t,c)),c.push({x:e,y:n,z:i,sx:r,sy:a,sz:o,ry:l})}build(){const t=new tn(1,1,1),e=new oe;for(const[n,i]of this.lists){const r=new Yh(t,this.mat.get(n),i.length);r.name=`TOMBS:batch:${n}`,i.forEach((a,o)=>{e.position.set(a.x,a.y,a.z),e.rotation.set(0,a.ry,0),e.scale.set(a.sx,a.sy,a.sz),e.updateMatrix(),r.setMatrixAt(o,e.matrix)}),r.instanceMatrix.needsUpdate=!0,r.computeBoundingSphere(),this.root.add(r)}return this.lists.size}}function l1(s,t=3.1){const e=document.createElement("canvas");e.width=512,e.height=96;const n=e.getContext("2d");n.fillStyle="rgba(8,26,41,.78)",n.fillRect(0,0,512,96),n.strokeStyle="#5ad6f5",n.lineWidth=3,n.strokeRect(3,3,506,90),n.textAlign="center",n.textBaseline="middle",n.font="bold 30px system-ui",n.fillStyle="#daf7ff",n.fillText(s,256,49,485);const i=new $h(e);i.colorSpace=Ge;const r=new Ul(new Nl({map:i,transparent:!0,depthTest:!1}));return r.scale.set(t,t*96/512,1),r}function Vn(s,t=0,e=1){return new je({color:s,roughness:.75,metalness:.18,emissive:t,emissiveIntensity:t?.35:0,transparent:e<1,opacity:e})}function c1(s,t){s.castShadow=t,s.receiveShadow=!0}function h1(s){const t=new de;t.name="TOMBS:DRAFT-C:LAB";const e=new de;e.name="TOMBS:static-facility",t.add(e);const n=new de;n.name="TOMBS:removable-roof",t.add(n),n.visible=!1;const i=new de;i.name="TOMBS:room-labels",t.add(i),i.visible=!1;const r=new Map([["floor",new je({color:gi.floor,roughness:.42,metalness:.12,map:i1()})],["wall",new je({color:gi.wall,roughness:.88,metalness:0})],["external",new je({color:gi.external,roughness:.88,metalness:0})],["array",Vn(gi.arrayWall)],["metal",new je({color:gi.metal,roughness:.35,metalness:.7})],["desk",new je({color:gi.desk,roughness:.4,metalness:.35,map:Em()})],["cabinet",new je({color:gi.cabinet,roughness:.6,metalness:.05})],["console",Vn(gi.console)],["chair",Vn(gi.chair)],["light",new He({color:10873343})],["screen",new He({color:2931954})],["red",new He({color:14901089})],["yellow",new He({color:15975292})],["plant",Vn(4160847)],["pot",Vn(7232074)],["fabric",Vn(4612218)],["book",Vn(9072466)]]),a=new o1(e,r),o=(P,F,I,z)=>a.add("floor",(P+F)/2,-.12,(I+z)/2,F-P,.24,z-I);{const P=p1(Sm,.08),F=new Es(P.map(([O,X])=>new J(O,-X))),I=new fr(F,{depth:.24,bevelEnabled:!1});I.rotateX(-Math.PI/2);const z=new Gt(I,r.get("floor"));z.position.y=-.24,z.name="TOMBS:floor-slab",e.add(z)}o(-2.2,2.2,11.5+.08,14);for(const[P,F,I,z]of[[-10.5,-1.5,0,12],[10.5,-1.5,0,12],[0,7,Math.PI/2,18]])a.add("light",P,.012,F,.032,.014,z,I);const l=new mr({color:9557999,transparent:!0,opacity:.32,metalness:.05,roughness:.12,side:en,depthWrite:!1}),c=(P,F)=>ue.walls.some(I=>{if(I===P||![I.from,I.to].some(rt=>Math.abs(rt[0]-F[0])<.001&&Math.abs(rt[1]-F[1])<.001))return!1;const O=P.to[0]-P.from[0],X=P.to[1]-P.from[1],j=I.to[0]-I.from[0],at=I.to[1]-I.from[1];return Math.abs(O*at-X*j)<1e-6*Math.hypot(O,X)*Math.hypot(j,at)});ue.walls.forEach((P,F)=>{for(const I of vu(P)){const z=I.to[0]-I.from[0],O=I.to[1]-I.from[1],X=Math.hypot(z,O),j=I.y1-I.y0,at=Math.atan2(-O,z),rt=(I.from[0]+I.to[0])/2,ct=(I.from[1]+I.to[1])/2,Yt=P.material==="external"?.28:P.material==="array"?.25:.16;if(I.glass){const ie=new Gt(new tn(X-.012,j-.012,.046),l);ie.position.set(rt,I.y0+j/2,ct),ie.rotation.y=at,ie.name=`tombs:glass:${I.id}`,t.add(ie),a.add("metal",rt,I.y0+.036,ct,X+.05,.07,.11,at),a.add("metal",rt,I.y1-.036,ct,X+.05,.07,.11,at)}else{const ie=Yt/2-.004,ee=Math.hypot(P.to[0]-P.from[0],P.to[1]-P.from[1]),Z=z/X,ot=O/X,nt=Math.hypot(I.from[0]-P.from[0],I.from[1]-P.from[1]),Ct=Math.hypot(I.to[0]-P.from[0],I.to[1]-P.from[1]),Dt=nt<.001&&!c(P,P.from)?ie:0,wt=Math.abs(Ct-ee)<.001&&!c(P,P.to)?ie:0,se=I.y1>=P.height-.001?F%7*.0015:0,kt=/:(sill|lintel)$/.test(I.id),tt=X+Dt+wt+(kt?.02:0),it=rt+Z*(wt-Dt)/2,st=ct+ot*(wt-Dt)/2;a.add(P.material==="external"?"external":P.material==="array"?"array":"wall",it,I.y0+(j+se)/2,st,tt,j+se,kt?Yt-.002:Yt,at)}}});const h=new de;h.name="tombs.array",h.scale.setScalar(1.15),t.add(h);const d=new Gt(new oi(1.65,1.9,.62,32),Vn(7045782));d.position.y=.36,h.add(d);const u=new Gt(new As(1.5,.035,8,64),new He({color:6674936}));u.rotation.x=-Math.PI/2,u.position.y=.71,h.add(u);const f=[];for(let P=0;P<5;P++){const F=new Gt(new As(2.65-P*.34,.17-P*.014,9,64),new je({color:P%2?8298159:10339538,metalness:.72,roughness:.26,emissive:474969,emissiveIntensity:.18}));F.rotation.set(.25+P*.3,P*.55,P*.15),F.position.y=3.55,F.name=`tombs.array.ring-${P}`,f.push(F),h.add(F)}for(let P=0;P<8;P++){const F=P*2*Math.PI/8,I=Math.cos(F)*4.4,z=Math.sin(F)*4.4;a.add("metal",I,1,z,.3,2,.3),a.add("light",I,2.05,z,.16,.13,.16)}d1(a,t,r);const p=a1();t.add(p.group);const _=new de;_.name="TOMBS:outside-windows",t.add(_);{const P=r1(),F=new He({color:9083558,map:P});for(const I of ue.portals){if(I.kind!=="glass"||!I.id.endsWith("-external"))continue;const z=I.width+1.8,O=I.height+1.4,X=I.sill+I.height/2,j=new Gt(new li(z,O),F);j.position.set(I.at[0],X,I.at[1]-1.1),j.name=`tombs:outside:${I.id}`,_.add(j)}}for(const P of ue.rooms){const F=(P.bounds.x0+P.bounds.x1)/2,I=(P.bounds.z0+P.bounds.z1)/2;for(let O=-1;O<=1;O++)a.add("light",F+O*1.35,P.ceiling-.12,I,1,.04,.11);const z=l1(P.label,P.id==="control"?4:3);z.position.set(F,Math.min(P.ceiling-.65,3),I),i.add(z)}for(const P of ue.halls){const F=(P.bounds.x0+P.bounds.x1)/2,I=(P.bounds.z0+P.bounds.z1)/2;a.add("light",F,P.ceiling-.12,I,.55,.05,.1)}const m=new je({color:2374216,metalness:.28,roughness:.55,transparent:!0,opacity:.88,side:en});for(const P of ue.rooms){if(P.id==="array")continue;const F=P.bounds,I=new Gt(new tn(F.x1-F.x0,.18,F.z1-F.z0),m);I.position.set((F.x0+F.x1)/2,P.ceiling+.1,(F.z0+F.z1)/2),n.add(I)}{const P=new Es(bm.map(([z,O])=>new J(z,-O))),F=new fr(P,{depth:.18,bevelEnabled:!1});F.rotateX(-Math.PI/2);const I=new Gt(F,m);I.position.y=7.55,n.add(I)}for(const P of ue.halls){const F=P.bounds,I=new Gt(new tn(F.x1-F.x0,.13,F.z1-F.z0),m);I.position.set((F.x0+F.x1)/2,P.ceiling+.1,(F.z0+F.z1)/2),n.add(I)}const g=new Map,v=new Map,b=Vn(9152437),y=new mr({color:7716820,metalness:.12,roughness:.2,transparent:!0,opacity:.72}),T=new He({color:5031915}),S=Vn(6124678);for(const P of ue.doors){const F=new de;F.name=`tombs:door:${P.id}`,F.position.set(P.at[0],0,P.at[1]),t.add(F),g.set(P.id,F);const I=ue.walls.find(Z=>Z.openings.includes(P.id)),z=Math.hypot(I.to[0]-I.from[0],I.to[1]-I.from[1]),O=(I.to[0]-I.from[0])/z,X=(I.to[1]-I.from[1])/z,j=(P.at[0]-I.from[0])*O+(P.at[1]-I.from[1])*X,at=j-P.width/2-.05,rt=z-j-P.width/2-.05,ct=Math.atan2(-X,O),ie=P.width>=2?[[-P.width/4,P.width/2,-1],[P.width/4,P.width/2,1]]:[[0,P.width,rt>=at?1:-1]],ee=[];for(const[Z,ot,nt]of ie){const Ct=nt>0?rt:at,Dt=Math.max(0,Math.min(ot+.08,Ct)),wt=new de;wt.position.set(O*Z,0,X*Z),wt.rotation.y=ct,F.add(wt);const se=ot-.024,kt=P.height-.014,tt=new Gt(new tn(se,kt,.085),P.id.startsWith("security")?y:b);tt.position.y=kt/2,tt.name=`door:panel:${P.id}`,wt.add(tt);const it=new Gt(new tn(se-.012,.06,.08),T);it.position.y=kt-.045,wt.add(it),ee.push({node:wt,slide:[O*nt*Dt,X*nt*Dt]})}v.set(P.id,ee);{const Z=I.material==="external"?.28:I.material==="array"?.25:.16,ot=Z+.03,nt=.07;for(const Dt of[-1,1]){const wt=new Gt(new tn(nt,P.height,ot),S);wt.position.set(O*Dt*P.width/2,P.height/2,X*Dt*P.width/2),wt.rotation.y=ct,F.add(wt)}const Ct=new Gt(new tn(P.width+2*nt,nt,ot+.006),S);Ct.position.set(0,P.height,0),Ct.rotation.y=ct,F.add(Ct)}}const A=new cu(11000831,1712167,1.4);A.name="TOMBS:fill",t.add(A);const x=[];for(const[P,F,I]of[[-13.6,3,-10.2],[0,3,-10],[13.6,3,-10.2],[0,5,0]]){const z=new Kl(10148863,26,16,2);z.position.set(P,F,I),x.push(z),t.add(z)}const w=a.build();e.traverse(P=>{if(P instanceof Gt){const F=P.name;c1(P,/batch:(desk|metal|cabinet|console)$/.test(F))}});const L=new Map;for(const P of ue.doors)L.set(P.id,0);const D=[.35,-.28,.22,-.18,.14];function N(P,F){const I=F.mode,z=I==="alarm"||I==="emergency";for(const[O,X]of x.entries())X.color.setHex(z?O%2?16737109:15576171:I==="dawn"?16767409:11061480),X.intensity=z?12:I==="night"?9:21;A.intensity=I==="night"?.62:z?.55:1.4;for(const O of ue.doors){const X=L.get(O.id)??0,j=F.isOpen(O.id)?1:0,at=P*1.6,rt=X<j?Math.min(j,X+at):Math.max(j,X-at);L.set(O.id,rt);for(const ct of v.get(O.id)){const Yt=ct.node.userData.base??(ct.node.userData.base=ct.node.position.clone());ct.node.position.set(Yt.x+rt*ct.slide[0],0,Yt.z+rt*ct.slide[1])}}I==="activation"&&f.forEach((O,X)=>{O.rotation.y+=D[X]*P,O.rotation.x+=D[X]*P*.42})}return{group:t,roof:n,doors:g,arrayRings:f,stats:{staticDrawGroups:w,roomCount:ue.rooms.length,doorCount:ue.doors.length},dressing:p,outside:_,setRoof:P=>{n.visible=P},setLabels:P=>{i.visible=P},update:N,dispose(){t.traverse(P=>{if(P instanceof Gt){P.geometry.dispose();const F=Array.isArray(P.material)?P.material:[P.material];for(const I of F)I.dispose()}P instanceof Ul&&(P.material.map?.dispose(),P.material.dispose())}),p.dispose();for(const P of r.values())P.dispose();l.dispose(),m.dispose(),b.dispose(),y.dispose(),T.dispose(),S.dispose(),t.removeFromParent()}}}function u1(){const s=new de;s.name="ISLAND:UNSCALED-REFERENCE";const t=new je({color:2582612,side:en,roughness:1});for(let o=0;o<30;o++){const l=o*2.399,c=.095+Math.sqrt(o+1)*.06,h=Math.cos(l)*c,d=.24+Math.sin(l)*c,u=.12+o%7*.06,f=new Gt(new yr(.012,u,3),t);f.position.set(h,u/2,d),f.rotation.z=(o%5-2)*.085,s.add(f)}const e=new de;e.name="ISLAND:ant-placeholder-only",e.position.set(.12,.006,.18);const n=Vn(4203803),i=new Gt(new xn(.0012,8,6),n);i.position.x=-.002,e.add(i);const r=new Gt(new xn(8e-4,8,6),n);e.add(r);const a=new Gt(new xn(.0017,8,6),n);a.position.x=.0025,e.add(a);for(let o=0;o<3;o++)for(const l of[-1,1]){const c=new Gt(new oi(12e-5,1e-4,.004,4),n);c.position.set((o-1)*.0014,6e-4,l*.002),c.rotation.x=l*.78,e.add(c)}return s.add(e),s.visible=!1,s}function d1(s,t,e){const n={n:[0,-1],s:[0,1],e:[1,0],w:[-1,0]};for(const i of ec){const[r,a]=n[i.facing],o=-a,l=r,c=a!==0,h=c?i.w:i.d,d=c?i.d:i.w,u=i.h,f=i.y0??0;f1(i,h,d,u,(_,m,g,v,b,y,T)=>{const S=i.x+m*o+g*r,A=i.z+m*l+g*a;s.add(_,S,f+v,A,c?b:y,T,c?y:b)},t,e,f)}}function f1(s,t,e,n,i,r,a,o){switch(s.kind){case"desk":{i("desk",0,0,n-.025,t,e,.05);for(const l of[-1,1])for(const c of[-1,1])i("metal",l*(t/2-.05),c*(e/2-.05),(n-.05)/2,.05,.05,n-.05);for(const l of[-1,1])i("metal",l*(t/2-.05),0,.06,.04,e-.1,.04);i("metal",0,e/2-.06,n-.12,t-.12,.02,.14);break}case"console":{i("console",0,.02,(n-.04)/2,t,e-.04,n-.04),i("desk",0,0,n-.02,t+.02,e,.04);for(const l of[-.72,0,.72])i("console",l,e/2-.18,n+.3,.62,.05,.4),i("screen",l,e/2-.21,n+.3,.57,.01,.35);i("light",0,-e/2+.004,n-.12,t*.8,.008,.03);break}case"chair":break;case"bench":{i("cabinet",0,.03,(n-.05)/2,t-.04,e-.06,n-.05),i("metal",0,0,n-.025,t,e,.05);for(let l=0;l<5;l++){const c=-t/2+t*(l+.5)/5;for(let h=1;h<4;h++)i("metal",c,-e/2+.024,h*(n-.05)/4,t/5-.12,.008,.012);i("console",c,-e/2+.026,(n-.05)*.9,.12,.01,.025)}i("console",-t/4,e/2-.22,n+.15,.5,.32,.3),i("light",-t/4,-.06+e/2-.22-.16,n+.22,.06,.004,.02);break}case"shelf":{for(const l of[-1,1])i("metal",l*(t/2-.03),0,n/2,.04,e,n);for(let l=0;l<5;l++)i("metal",0,0,.08+l*(n-.12)/4,t-.06,e,.03);for(let l=0;l<4;l++)i("console",l%2?.15:-.12,.02,.1+l*(n-.12)/4+.17,t*.55,e*.75,.3);break}case"rack":{i("console",0,0,n/2,t,e,n);for(let l=0;l<6;l++)i(l%2?"light":"screen",0,-e/2-.006,.3+l*.3,t*.6,.012,.05);break}case"cabinet":{i("console",0,0,n/2,t,e,n);for(let l=1;l<4;l++)i("metal",0,-e/2-.005,l*n/4,t*.9,.01,.012);i("light",t*.3,-e/2-.006,n-.12,.08,.01,.05);break}case"counter":{i("metal",0,.02,(n-.04)/2,t-.02,e-.04,n-.04),i("desk",0,0,n-.02,t,e,.04);break}case"round-table":{const l=new Gt(new oi(t/2,t/2,.04,24),a.get("desk"));l.position.set(s.x,o+n-.02,s.z),r.add(l),i("metal",0,0,(n-.04)/2,.07,.07,n-.04),i("metal",0,0,.015,t*.5,t*.5,.03);break}case"fridge":{i("metal",0,0,n/2,t,e,n),i("console",t*.35,-e/2-.01,n*.6,.03,.02,.5),i("metal",0,-e/2-.004,n*.42,t*.95,.008,.01);break}case"emergency-panel":{i("console",0,0,n/2,t,e,n),i("red",0,-e/2-.006,n-.12,t*.9,.012,.05),i("yellow",0,-e/2-.06,n*.62,.08,.1,.42),i("metal",0,-e/2-.03,n*.62-.24,.18,.06,.06);break}case"reader":{i("console",0,0,n/2,t,e,n),i("light",0,-t/2-.004,n*.65,.012,e*.6,.05);break}case"credenza":{i("desk",0,0,n/2,t,e,n);for(const l of[-t/4,t/4])i("metal",l,-e/2-.004,n*.55,t*.4,.008,.012);break}case"bookcase":{i("desk",0,0,n/2,t,e,n);for(let l=0;l<4;l++)i("book",l%2?.08:-.06,-e/2+.12,.25+l*.45,t*.8,.22,.28);break}case"armchair":{i("fabric",0,0,.22,t,e,.44),i("fabric",0,-e/2+.1,.62,t,.2,.4);for(const l of[-1,1])i("fabric",l*(t/2-.07),.05,.55,.14,e-.1,.26);break}case"plant":{i("pot",0,0,.2,t*.75,e*.75,.4);const l=new Gt(new xn(Math.min(t,e)*.62,10,8),a.get("plant"));l.position.set(s.x,o+.4+(n-.4)/2,s.z),l.scale.y=(n-.4)/(Math.min(t,e)*1.2),r.add(l);break}case"crate":{i("metal",0,0,n/2,t,e,n),i("yellow",0,-e/2-.004,n*.7,t*.5,.008,.04);break}case"intercom":break;case"glass-cabinet":case"wall-shelf":case"microscope":case"tube-rack":case"desk-lamp":case"pot-plant":break;case"tablet":break;case"coffee-machine":{i("console",0,0,n/2,t,e,n),i("red",t*.25,-e/2-.004,n*.75,.03,.008,.03);break}case"electrical-panel":{i("metal",0,0,n/2,t,e,n),i("yellow",0,-e/2-.004,n*.8,t*.3,.008,.06);break}}}function p1(s,t){let e=0;for(let a=0;a<s.length;a++){const o=s[a],l=s[(a+1)%s.length];e+=o[0]*l[1]-l[0]*o[1]}const n=e>0?-1:1,i=s.length,r=[];for(let a=0;a<i;a++){const o=s[(a+i-1)%i],l=s[a],c=s[(a+1)%i],h=Sf(l[0]-o[0],l[1]-o[1]),d=Sf(c[0]-l[0],c[1]-l[1]),u=[n*-h[1],n*h[0]],f=[n*-d[1],n*d[0]],p=u[0]+f[0],_=u[1]+f[1],m=1+u[0]*f[0]+u[1]*f[1];r.push([l[0]+t*p/m,l[1]+t*_/m])}return r}function Sf(s,t){const e=Math.hypot(s,t)||1;return[s/e,t/e]}const Fr=[{at:0,position:[0,19,46],look:[0,1,0],caption:"THE ATLANTIC · MARCH 5, 2110"},{at:3.8,position:[-15,12,31],look:[0,3,4],caption:"THE RESEARCH SETTLEMENT"},{at:7.7,position:[0,5.1,19],look:[0,2.5,8],caption:"TOMBS ARRAY RESEARCH LABORATORY"},{at:10.4,position:[0,2.2,13.6],look:[0,1.8,8],caption:"UNAUTHORIZED ACCESS DETECTED"},{at:13,position:[0,1.7,10.2],look:[0,1.6,6.5],caption:"SECURITY VESTIBULE"},{at:15.1,position:[0,1.7,7],look:[-7.7,1.7,6.5],caption:"FOLLOW THE ALARM"},{at:17.7,position:[-10.5,1.7,6.2],look:[-10.5,1.7,-7.2],caption:"WEST CORRIDOR"},{at:20.8,position:[-9.6,1.7,-9.45],look:[-13.4,1.4,-10.5],caption:"JACK’S LABORATORY"},{at:23.8,position:[-13.1,1.65,-9.9],look:[-13,1.1,-12.4],caption:"CHAPTER ONE · THE ALARM"}];function m1(s,t,e){const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)}function wf(s,t,e,n){return n.set(s[0]+(t[0]-s[0])*e,s[1]+(t[1]-s[1])*e,s[2]+(t[2]-s[2])*e)}class g1{constructor(t,e,n,i={}){this.town=e,this.lab=n,this.hooks=i,this.camera=t}town;lab;hooks;action="idle";t=0;a=new C;b=new C;camera;get isPlaying(){return this.action!=="idle"}startIntro(){this.action="intro",this.t=0,this.town.setScale(1),this.lab.setMode("night")}triggerActivation(){this.action="activation",this.t=0,this.lab.setMode("activation"),this.hooks.onCaption?.("TOMBS ARRAY · ACTIVATION")}stop(){this.action="idle",this.hooks.onEffects?.(0)}update(t){if(this.action!=="idle"){if(this.t+=Math.max(0,t),this.action==="intro"){this.t>=8&&!this.lab.isOpen("security-outer")&&this.lab.setDoor("security-outer",!0),this.t>=11.2&&!this.lab.isOpen("security-inner")&&this.lab.setDoor("security-inner",!0),this.t>=18.1&&!this.lab.isOpen("jack-door")&&this.lab.setDoor("jack-door",!0);const e=Fr[Fr.length-1];if(this.t>=e.at){this.placeKey(e),this.finish("intro");return}for(let n=0;n<Fr.length-1;n++){const i=Fr[n],r=Fr[n+1];if(this.t<i.at||this.t>=r.at)continue;const a=m1(i.at,r.at,this.t);this.camera.position.copy(wf(i.position,r.position,a,this.a)),this.lookAtLocal(wf(i.look,r.look,a,this.b)),this.hooks.onCaption?.(i.caption);break}return}if(this.t<2.4){this.hooks.onCaption?.("TOMBS ARRAY · ACTIVATION"),this.hooks.onEffects?.(.15+.1*Math.sin(this.t*18));return}if(this.t<3.3){this.hooks.onCaption?.("WARNING · ARRAY OUTPUT RISING"),this.hooks.onEffects?.(.5);return}if(this.t<7.9){this.t-t<3.3&&this.town.shrink(4.6),this.hooks.onCaption?.("TOWN SCALE CHANGING"),this.hooks.onEffects?.(.85*Math.sin(Math.PI*(this.t-3.3)/4.6));return}this.town.setScale(1/180),this.lab.setMode("emergency"),this.hooks.onEffects?.(0),this.hooks.onCaption?.("THE TOWN HAS SHRUNK · THE ISLAND HAS NOT"),this.finish("activation")}}lookAtLocal(t){this.town.townRoot.updateWorldMatrix(!0,!1),this.camera.lookAt(this.town.townRoot.localToWorld(t.clone()))}placeKey(t){this.camera.position.set(...t.position),this.lookAtLocal(new C(...t.look)),this.hooks.onCaption?.(t.caption)}finish(t){this.action="idle",this.hooks.onEffects?.(0),this.hooks.onComplete?.(t)}}const Ef=(s,t)=>{const e=new de;e.name=`PLACEHOLDER:${s}:replace-with-Character-Studio-asset`;const n=new je({color:t,roughness:.8,metalness:.05}),i=new Gt(new xn(.105,12,8),n);i.position.y=1.59,e.add(i);const r=new Gt(new xs(.24,.5,5,10),n);r.position.y=1.17,e.add(r);for(const a of[-.12,.12]){const o=new Gt(new xs(.105,.57,4,8),n);o.position.set(a,.41,0),e.add(o);const l=new Gt(new xs(.075,.46,4,8),n);l.position.set(a<0?-.32:.32,1.16,0),e.add(l)}return e};function _1(){const s=new de;s.name="TOMBS:character-mounts";const t=new de,e=new de;for(const[a,o,l]of[["jack",t,"jackDeskSeat"],["sarah",e,"sarahDeskSeat"]]){const c=sr(l);o.name=`TOMBS:${a}:character-anchor`,o.position.set(...c.xyz),o.rotation.y=c.yaw,s.add(o)}const n=Ef("Jack",4353692),i=Ef("Sarah",10250622);t.add(n),e.add(i);const r={jack:t,sarah:e};return{group:s,anchors:r,placeholders:{jack:n,sarah:i},replace(a,o){const l=r[a];l.clear(),l.add(o)},setPlaceholdersVisible(a){n.visible=a,i.visible=a}}}const ar=28,Mh=-19,Tf=19,bh=-15,Af=16.5,Oe=s=>((s-Mh)*ar).toFixed(1),Fe=s=>((s-bh)*ar).toFixed(1),We=s=>(s*ar).toFixed(1),Me={bg:"#0b2545",grid:"#16365e",wall:"#e8f4ff",glass:"#69d7ff",door:"#ffd166",furniture:"#9cc9ef",furnitureFill:"rgba(120,180,230,0.16)",text:"#e8f4ff",dim:"#8fb8de",chair:"#7fa7cc"};function x1(){const s=[];for(const t of ue.walls){const e=t.material==="external"?.28:t.material==="array"?.25:.16;for(const n of vu(t)){if(n.y0>.01)continue;const i=n.to[0]-n.from[0],r=n.to[1]-n.from[1],a=Math.hypot(i,r),o=-r/a*e/2,l=i/a*e/2,c=[[n.from[0]+o,n.from[1]+l],[n.to[0]+o,n.to[1]+l],[n.to[0]-o,n.to[1]-l],[n.from[0]-o,n.from[1]-l]],h=n.glass?Me.glass:Me.wall;n.glass||n.y1>1.2?s.push(`<polygon points="${c.map(d=>`${Oe(d[0])},${Fe(d[1])}`).join(" ")}" fill="${h}" opacity="${n.glass?.75:1}"/>`):s.push(`<polygon points="${c.map(d=>`${Oe(d[0])},${Fe(d[1])}`).join(" ")}" fill="${Me.glass}" opacity=".75"/>`)}}return s.join("")}function y1(){return ue.doors.map(s=>{const t=s.width;return s.along==="z"?`<rect x="${Oe(s.at[0]-.05)}" y="${Fe(s.at[1]-t/2)}" width="${We(.1)}" height="${We(t)}" fill="${Me.door}" opacity=".85"/>`:`<rect x="${Oe(s.at[0]-t/2)}" y="${Fe(s.at[1]-.05)}" width="${We(t)}" height="${We(.1)}" fill="${Me.door}" opacity=".85"/>`}).join("")}function v1(s){const t=s.x-s.w/2,e=s.z-s.d/2,n=s.kind==="chair"?Me.chair:Me.furniture;if(s.kind==="round-table")return`<circle cx="${Oe(s.x)}" cy="${Fe(s.z)}" r="${We(s.w/2)}" fill="${Me.furnitureFill}" stroke="${n}" stroke-width="1.4"/>`;if(s.kind==="plant")return`<circle cx="${Oe(s.x)}" cy="${Fe(s.z)}" r="${We(s.w/2)}" fill="rgba(90,170,110,.35)" stroke="#7fd39a" stroke-width="1.2"/>`;if(s.kind==="chair")return`<rect x="${Oe(t)}" y="${Fe(e)}" width="${We(s.w)}" height="${We(s.d)}" rx="${We(.1)}" fill="none" stroke="${n}" stroke-width="1.2"/>`;const[i,r]={n:[0,-1],s:[0,1],e:[1,0],w:[-1,0]}[s.facing],a=s.x-i*s.w/2,o=s.z-r*s.d/2,l=r!==0?`<line x1="${Oe(t)}" y1="${Fe(o)}" x2="${Oe(t+s.w)}" y2="${Fe(o)}" stroke="${Me.text}" stroke-width="2"/>`:`<line x1="${Oe(a)}" y1="${Fe(e)}" x2="${Oe(a)}" y2="${Fe(e+s.d)}" stroke="${Me.text}" stroke-width="2"/>`;return`<rect x="${Oe(t)}" y="${Fe(e)}" width="${We(s.w)}" height="${We(s.d)}" fill="${Me.furnitureFill}" stroke="${n}" stroke-width="1.4"/>${s.kind==="desk"||s.kind==="console"||s.kind==="counter"||s.kind==="bench",""}${l}`}function M1(){const s=(Tf-Mh)*ar,t=(Af-bh)*ar,e=[];for(let c=Math.ceil(Mh);c<=Tf;c++)e.push(`<line x1="${Oe(c)}" y1="0" x2="${Oe(c)}" y2="${t}" stroke="${Me.grid}" stroke-width="${c%5===0?1:.5}"/>`);for(let c=Math.ceil(bh);c<=Af;c++)e.push(`<line x1="0" y1="${Fe(c)}" x2="${s}" y2="${Fe(c)}" stroke="${Me.grid}" stroke-width="${c%5===0?1:.5}"/>`);const n=Sm,i=ue.rooms.map(c=>{const h=(c.bounds.x0+c.bounds.x1)/2,d=(c.bounds.z0+c.bounds.z1)/2,u=(c.bounds.x1-c.bounds.x0).toFixed(1),f=(c.bounds.z1-c.bounds.z0).toFixed(1),p=c.id==="array"?d+3.4:c.id==="control"?d+.2:d;return`<text x="${Oe(h)}" y="${Fe(p)}" fill="${Me.text}" font-size="12" font-weight="700" text-anchor="middle" letter-spacing=".5">${c.label}</text><text x="${Oe(h)}" y="${Fe(p)}" dy="15" fill="${Me.dim}" font-size="10.5" text-anchor="middle">${u} m × ${f} m</text>`}).join(""),r=[2.65,2.3,1.95].map(c=>c*1.15).map(c=>`<circle cx="${Oe(0)}" cy="${Fe(0)}" r="${We(c)}" fill="none" stroke="${Me.glass}" stroke-width="1.2" opacity=".7"/>`).join("")+`<circle cx="${Oe(0)}" cy="${Fe(0)}" r="${We(1.9*1.15)}" fill="rgba(105,215,255,.12)" stroke="${Me.furniture}" stroke-width="1.2"/>`,a=`<g transform="translate(${s-12*ar-30},${t-34})"><text x="0" y="-8" fill="${Me.text}" font-size="11" font-weight="700">SCALE (METRES)</text>`+[0,2,4,6,8,10].map(c=>`<line x1="${We(c)}" y1="0" x2="${We(c)}" y2="8" stroke="${Me.text}"/><text x="${We(c)}" y="22" fill="${Me.dim}" font-size="10" text-anchor="middle">${c}</text>`).join("")+`<line x1="0" y1="4" x2="${We(10)}" y2="4" stroke="${Me.text}" stroke-width="2"/></g>`,o=`<g transform="translate(40,44)"><circle r="20" fill="none" stroke="${Me.text}"/><path d="M0,-15 L7,8 L0,3 L-7,8 Z" fill="${Me.text}"/><text y="-25" fill="${Me.text}" font-size="12" text-anchor="middle">N</text></g>`,l=`<text x="${s/2}" y="26" fill="${Me.text}" font-size="17" font-weight="700" text-anchor="middle" letter-spacing="1">TOMBS LABORATORY · DRAFT C · PLAN FROM THE MODEL</text><text x="${s/2}" y="44" fill="${Me.dim}" font-size="11" text-anchor="middle">36 m × 28 m envelope · walls, glass (cyan), doors (yellow), furniture (heavy edge = the side you use it from), drawn from spec.ts and furniture.ts</text>`;return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${t}" width="${s}" height="${t}" font-family="system-ui,Segoe UI,Arial"><rect width="${s}" height="${t}" fill="${Me.bg}"/>${e.join("")}<polygon points="${n.map(c=>`${Oe(c[0])},${Fe(c[1])}`).join(" ")}" fill="#123a66"/>`+r+ec.map(v1).join("")+x1()+y1()+i+a+o+l+"</svg>"}const Tm=document.getElementById("app");if(!Tm)throw new Error("Missing #app");Tm.innerHTML=`<div class="view" id="view"></div><div class="ui">
<div class="top"><div class="brand"><b>TOMBS</b><span>LABORATORY · DRAFT C</span></div>
<div class="hud"><span id="location">ISLAND · NORMAL</span><span id="scale">TOWN SCALE 1:1</span><span id="fps">FPS …</span></div></div>
<div class="left"><div class="eyebrow">TOMBS LABORATORY · 2110</div><h1 id="title">THE ALARM</h1>
<div id="caption">Standalone procedural facility · Chapter 1 environment</div><div id="objective">Select TOUR or EXPLORE to begin.</div>
<div class="mini" id="mini"></div></div>
<div class="bottom"><div class="btns"><button data-act="tour">🎬 CINEMATIC TOUR</button><button data-act="explore">🚶 EXPLORE</button><button data-act="top">🗺 TOP VIEW</button><button data-act="plan">📐 PLAN</button><button data-act="roof">ROOF: OFF</button></div>
<div class="btns"><button data-act="activate" class="primary">⚡ ACTIVATE ARRAY</button><button data-act="restore">↩ NORMAL SIZE</button><button data-act="interact">E · INTERACT</button><button data-act="save">SAVE</button><button data-act="load">LOAD</button></div><div class="hint">WASD / arrows move · drag to look · E interact · mobile: joystick to move, swipe view to turn · 1:180 scales the town and people only</div></div>
<div class="joy" id="joy" aria-label="Move"><div class="knob" id="knob"></div></div>
<div class="effects" id="effects"></div><div class="plan" id="plan" hidden><button class="close" data-act="plan">✕ CLOSE PLAN</button><div class="sheet" id="plansheet"></div></div><div class="toast" id="toast"></div></div>`;const b1=document.getElementById("view"),Cn=new xm({antialias:!0,powerPreference:"high-performance"});Cn.setPixelRatio(Math.min(2,devicePixelRatio||1));Cn.setSize(innerWidth,innerHeight);Cn.outputColorSpace=Ge;Cn.toneMapping=_l;Cn.toneMappingExposure=1.12;b1.appendChild(Cn.domElement);const Sa=new Gh;Sa.background=new St(1056045);Sa.fog=new xa(1056045,30,150);const Am=new du(12837887,2);Am.position.set(-18,32,24);Sa.add(Am);const wa=new de;wa.name="ISLAND:unchanged-scale";Sa.add(wa);const bu=new Gt(new li(400,400),new je({color:2048830,roughness:1}));bu.rotation.x=-Math.PI/2;bu.position.y=-.26;wa.add(bu);const qi=u1();qi.visible=!1;wa.add(qi);const hn=new QS(wa,1);hn.setWorldAnchor(0,0,0);const wi=new t1,gr=h1();hn.townRoot.add(gr.group);const S1=_1();hn.townRoot.add(S1.group);window.__tombs={labState:wi,building:gr,controller:hn,get camera(){return fe},THREE:CS};const fe=new Ve(68,innerWidth/innerHeight,.025,1500);hn.townRoot.add(fe);fe.position.set(-13.1,1.65,-9.9);ma(-13,1.1,-12.4);const Nn=new PS(fe,Cn.domElement);Nn.enabled=!1;Nn.enableDamping=!0;Nn.minDistance=.8;Nn.maxDistance=95;let Yn="explore",Vr=!1,ni=0,Gi=0;const In=new Set,zi={x:0,y:0};let Su=!1,Sh=0,wh=0,So=0;const yn=s=>document.getElementById(s);function Eh(s){yn("caption").textContent=s}function Ln(s){yn("toast").textContent=s,yn("toast").classList.add("show"),So=2.7}function fl(){const s=new C;fe.getWorldDirection(s),ni=Math.atan2(s.x,-s.z),Gi=Math.asin(Cl.clamp(s.y,-1,1))}function ma(s,t,e){hn.townRoot.updateWorldMatrix(!0,!1),fe.lookAt(hn.townRoot.localToWorld(new C(s,t,e)))}function Cm(){const s=Math.sin(ni)*Math.cos(Gi),t=Math.sin(Gi),e=-Math.cos(ni)*Math.cos(Gi);ma(fe.position.x+s,fe.position.y+t,fe.position.z+e)}function pl(s){_r.stop(),Yn=s,Nn.enabled=s==="top",gr.setLabels(s==="top"),s==="top"?(gr.setRoof(!1),Vr=!1,fe.position.set(0,52,22),Nn.target.set(0,0,0),Nn.update(),ma(0,0,0),Eh("Authoritative metric blockout: orbit, zoom and inspect the U-shaped loop.")):s==="explore"&&(fe.position.set(-13.1,1.65,-9.9),ma(-13,1.1,-12.4),fl(),Eh("Playable room exploration · Stable interactive object IDs"))}const _r=new g1(fe,hn,wi,{onCaption:Eh,onEffects:s=>{yn("effects").style.opacity=String(s)},onComplete:s=>{s==="intro"?(Yn="explore",fl(),Ln("Explore as Jack · Use E near doors, monitors or intercom.")):(Yn="explore",fl(),qi.visible=!0,Ln("1:180 · town and humans shrunk, insects and island unchanged."))}});function Rm(){const s=wm(fe.position.x,fe.position.z);if(!s){Ln("Nothing to interact with nearby.");return}const t=n1(wi,s.id);Ln(t),yn("objective").textContent=t}function Pm(){Nn.enabled=!1,Yn="tour",_r.triggerActivation(),Ln("Array activating · watch the town scale change.")}function w1(){hn.restore(2.5),qi.visible=!1,wi.setMode("night"),Ln("Restoring 1:1 human and building scale.")}for(const s of Array.from(document.querySelectorAll("button[data-act]")))s.addEventListener("click",()=>{switch(s.dataset.act){case"tour":Nn.enabled=!1,Yn="tour",qi.visible=!1,_r.startIntro(),Ln("Cinematic opening · ending in Jack’s laboratory");break;case"explore":pl("explore");break;case"top":pl("top");break;case"plan":{const t=yn("plan");t.hidden?(yn("plansheet").innerHTML=M1(),t.hidden=!1):t.hidden=!0;break}case"roof":Vr=!Vr,gr.setRoof(Vr),s.textContent=`ROOF: ${Vr?"ON":"OFF"}`;break;case"activate":Pm();break;case"restore":w1();break;case"interact":Rm();break;case"save":{const t={schema:1,state:wi.snapshot(),townScale:hn.relativeScale,pose:[fe.position.x,fe.position.y,fe.position.z,ni,Gi]};localStorage.setItem("tombs-draft-c-preview",JSON.stringify(t)),Ln("Standalone preview state saved locally.");break}case"load":{const t=localStorage.getItem("tombs-draft-c-preview");if(!t){Ln("No saved preview.");break}try{const e=JSON.parse(t);_r.stop(),wi.restore(e.state),hn.setScale(e.townScale),qi.visible=e.townScale<.5;const n=e.pose;fe.position.set(n[0],n[1],n[2]),ni=n[3],Gi=n[4],Cm(),Yn="explore",Nn.enabled=!1,Ln("Standalone preview state loaded.")}catch{Ln("Incompatible save.")}break}}});window.addEventListener("keydown",s=>{s.repeat||(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(s.key)&&s.preventDefault(),In.add(s.key.toLowerCase()),s.key.toLowerCase()==="e"&&Rm(),s.key==="1"&&pl("explore"),s.key==="2"&&pl("top"),s.key==="3"&&Pm())});window.addEventListener("keyup",s=>In.delete(s.key.toLowerCase()));window.addEventListener("blur",()=>{In.clear(),Dm()});Cn.domElement.addEventListener("pointerdown",s=>{Yn==="explore"&&(Su=!0,Sh=s.clientX,wh=s.clientY,Cn.domElement.setPointerCapture(s.pointerId))});Cn.domElement.addEventListener("pointerup",()=>{Su=!1});Cn.domElement.addEventListener("pointermove",s=>{if(Yn!=="explore"||!Su)return;const t=s.clientX-Sh,e=s.clientY-wh;Sh=s.clientX,wh=s.clientY,ni+=t*.004,Gi=Cl.clamp(Gi-e*.004,-1.35,1.35),Cm()});const ys=yn("joy"),Im=yn("knob");let ic=null;function Lm(s){const t=ys.getBoundingClientRect(),e=t.width/2;let n=(s.clientX-(t.left+e))/e,i=(s.clientY-(t.top+e))/e;const r=Math.hypot(n,i);r>1&&(n/=r,i/=r),zi.x=n,zi.y=i,Im.style.transform=`translate(${n*e*.62}px,${i*e*.62}px)`}function Dm(){ic=null,zi.x=0,zi.y=0,Im.style.transform="",ys.classList.remove("active")}ys.addEventListener("pointerdown",s=>{s.preventDefault(),s.stopPropagation(),ic=s.pointerId,ys.setPointerCapture(s.pointerId),ys.classList.add("active"),Lm(s)});ys.addEventListener("pointermove",s=>{s.pointerId===ic&&Lm(s)});for(const s of["pointerup","pointercancel","lostpointercapture"])ys.addEventListener(s,t=>{t.pointerId===ic&&Dm()});function E1(s){if(Yn!=="explore"||_r.isPlaying||Nn.enabled)return;const t=Math.hypot(zi.x,zi.y)<.12,e=(In.has("w")||In.has("arrowup")?1:0)-(In.has("s")||In.has("arrowdown")?1:0)+(t?0:-zi.y),n=(In.has("d")||In.has("arrowright")?1:0)-(In.has("a")||In.has("arrowleft")?1:0)+(t?0:zi.x),i=Math.hypot(e,n);if(i<.01)return;const r=(In.has("shift")?3.5:2.2)*Math.min(s,.05)*Math.min(1,i)/i,a=(Math.sin(ni)*e+Math.cos(ni)*n)*r,o=(-Math.cos(ni)*e+Math.sin(ni)*n)*r,[l,c]=jS(fe.position.x,fe.position.z,a,o,.24,h=>wi.isOpen(h));fe.position.set(l,1.65,c)}function T1(s){const t=hn.relativeScale;yn("scale").textContent=t>.999?"TOWN SCALE 1:1":`TOWN SCALE 1:${(1/t).toFixed(t<.01?0:1)}`,yn("location").textContent=`${qS(fe.position.x,fe.position.z).toUpperCase()} · ${wi.mode.toUpperCase()}`,yn("fps").textContent=`FPS ${s.toFixed(0)}`;const e=wm(fe.position.x,fe.position.z);yn("mini").textContent=e&&Yn==="explore"?`E · ${e.label} (${e.distance.toFixed(1)}m)`:"8 ROOMS · 10 DOORS · U-LOOP · 5 ARRAY RINGS",hn.phase==="small"&&(qi.visible=!0),hn.phase==="normal"&&(qi.visible=!1)}function A1(){const s=innerWidth,t=innerHeight;Cn.setSize(s,t),fe.aspect=s/t,fe.updateProjectionMatrix()}window.addEventListener("resize",A1);let Cf=performance.now(),jc=60,Qc=0;function Nm(s){const t=Math.min(.065,(s-Cf)/1e3);Cf=s,hn.update(t),_r.update(t),E1(t),gr.update(t,wi),Yn==="top"&&Nn.update(),jc=jc*.93+(t>0?1/t:60)*.07,Qc+=t,Qc>.25&&(Qc=0,T1(jc)),So>0&&(So-=t,So<=0&&yn("toast").classList.remove("show")),Cn.render(Sa,fe),requestAnimationFrame(Nm)}const C1=sr("jackSpawn");fe.position.set(...C1.xyz);fe.position.y=1.65;ma(-13,1.1,-12.4);fl();Ln("TOMBS Draft C standalone · all geometry is procedural.");requestAnimationFrame(Nm);
