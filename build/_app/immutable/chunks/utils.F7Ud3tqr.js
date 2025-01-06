var jn=Array.isArray,Hn=Array.from,Bn=Object.defineProperty,yt=Object.getOwnPropertyDescriptor,rn=Object.getOwnPropertyDescriptors,Un=Object.prototype,Vn=Array.prototype,en=Object.getPrototypeOf;function Gn(t){return typeof t=="function"}const sn=()=>{};function Kn(t){return t()}function gt(t){for(var n=0;n<t.length;n++)t[n]()}function $n(){var t,n,r=new Promise((e,s)=>{t=e,n=s});return{promise:r,resolve:t,reject:n}}const E=2,xt=4,B=8,ut=16,g=32,Q=64,nt=128,S=256,K=512,h=1024,k=2048,P=4096,N=8192,q=16384,ln=32768,At=65536,Zn=1<<17,an=1<<19,kt=1<<20,Et=Symbol("$state"),zn=Symbol("legacy props"),Jn=Symbol("");function Rt(t){return t===this.v}function un(t,n){return t!=t?n==n:t!==n||t!==null&&typeof t=="object"||typeof t=="function"}function bt(t){return!un(t,this.v)}function on(t){throw new Error("https://svelte.dev/e/effect_in_teardown")}function fn(){throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function _n(t){throw new Error("https://svelte.dev/e/effect_orphan")}function cn(){throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function Qn(){throw new Error("https://svelte.dev/e/hydration_failed")}function Wn(t){throw new Error("https://svelte.dev/e/props_invalid_value")}function Xn(){throw new Error("https://svelte.dev/e/state_descriptors_fixed")}function tr(){throw new Error("https://svelte.dev/e/state_prototype_fixed")}function vn(){throw new Error("https://svelte.dev/e/state_unsafe_local_read")}function pn(){throw new Error("https://svelte.dev/e/state_unsafe_mutation")}let W=!1;function nr(){W=!0}const rr=1,er=2,sr=16,lr=1,ar=2,ur=4,or=8,ir=16,fr=1,_r=2,hn="[",dn="[!",yn="]",It={},cr=Symbol();function ot(t,n){var r={f:0,v:t,reactions:null,equals:Rt,version:0};return r}function vr(t){return St(ot(t))}function En(t,n=!1){var e;const r=ot(t);return n||(r.equals=bt),W&&o!==null&&o.l!==null&&((e=o.l).s??(e.s=[])).push(r),r}function pr(t,n=!1){return St(En(t,n))}function St(t){return i!==null&&i.f&E&&(T===null?On([t]):T.push(t)),t}function hr(t,n){return it(t,ht(()=>pt(t))),n}function it(t,n){return i!==null&&vt()&&i.f&(E|ut)&&(T===null||!T.includes(t))&&pn(),wn(t,n)}function wn(t,n){return t.equals(n)||(t.v=n,t.version=zt(),Dt(t,k),vt()&&u!==null&&u.f&h&&!(u.f&g)&&(v!==null&&v.includes(t)?(m(u,k),tt(u)):A===null?Cn([t]):A.push(t))),n}function Dt(t,n){var r=t.reactions;if(r!==null)for(var e=vt(),s=r.length,l=0;l<s;l++){var a=r[l],f=a.f;f&k||!e&&a===u||(m(a,n),f&(h|S)&&(f&E?Dt(a,P):tt(a)))}}function Ot(t){console.warn("https://svelte.dev/e/hydration_mismatch")}let b=!1;function dr(t){b=t}let w;function L(t){if(t===null)throw Ot(),It;return w=t}function yr(){return L(D(w))}function Er(t){if(b){if(D(w)!==null)throw Ot(),It;w=t}}function wr(t=1){if(b){for(var n=t,r=w;n--;)r=D(r);w=r}}function mr(){for(var t=0,n=w;;){if(n.nodeType===8){var r=n.data;if(r===yn){if(t===0)return n;t-=1}else(r===hn||r===dn)&&(t+=1)}var e=D(n);n.remove(),n=e}}var wt,Ct,Nt;function Tr(){if(wt===void 0){wt=window;var t=Element.prototype,n=Node.prototype;Ct=yt(n,"firstChild").get,Nt=yt(n,"nextSibling").get,t.__click=void 0,t.__className="",t.__attributes=null,t.__styles=null,t.__e=void 0,Text.prototype.__t=void 0}}function rt(t=""){return document.createTextNode(t)}function et(t){return Ct.call(t)}function D(t){return Nt.call(t)}function gr(t,n){if(!b)return et(t);var r=et(w);if(r===null)r=w.appendChild(rt());else if(n&&r.nodeType!==3){var e=rt();return r==null||r.before(e),L(e),e}return L(r),r}function xr(t,n){if(!b){var r=et(t);return r instanceof Comment&&r.data===""?D(r):r}return w}function Ar(t,n=1,r=!1){let e=b?w:t;for(var s;n--;)s=e,e=D(e);if(!b)return e;var l=e==null?void 0:e.nodeType;if(r&&l!==3){var a=rt();return e===null?s==null||s.after(a):e.before(a),L(a),a}return L(e),e}function kr(t){t.textContent=""}function mn(t){var n=E|k;u===null?n|=S:u.f|=kt;var r=i!==null&&i.f&E?i:null;const e={children:null,ctx:o,deps:null,equals:Rt,f:n,fn:t,reactions:null,v:null,version:0,parent:r??u};return r!==null&&(r.children??(r.children=[])).push(e),e}function Rr(t){const n=mn(t);return n.equals=bt,n}function Pt(t){var n=t.children;if(n!==null){t.children=null;for(var r=0;r<n.length;r+=1){var e=n[r];e.f&E?ft(e):I(e)}}}function Tn(t){for(var n=t.parent;n!==null;){if(!(n.f&E))return n;n=n.parent}return null}function qt(t){var n,r=u;J(Tn(t));try{Pt(t),n=Jt(t)}finally{J(r)}return n}function Ft(t){var n=qt(t),r=(x||t.f&S)&&t.deps!==null?P:h;m(t,r),t.equals(n)||(t.v=n,t.version=zt())}function ft(t){Pt(t),H(t,0),m(t,q),t.v=t.children=t.deps=t.ctx=t.reactions=null}function Mt(t){u===null&&i===null&&_n(),i!==null&&i.f&S&&fn(),ct&&on()}function gn(t,n){var r=n.last;r===null?n.last=n.first=t:(r.next=t,t.prev=r,n.last=t)}function F(t,n,r,e=!0){var s=(t&Q)!==0,l=u,a={ctx:o,deps:null,deriveds:null,nodes_start:null,nodes_end:null,f:t|k,first:null,fn:n,last:null,next:null,parent:s?null:l,prev:null,teardown:null,transitions:null,version:0};if(r){var f=O;try{mt(!0),U(a),a.f|=ln}catch(_){throw I(a),_}finally{mt(f)}}else n!==null&&tt(a);var p=r&&a.deps===null&&a.first===null&&a.nodes_start===null&&a.teardown===null&&(a.f&kt)===0;if(!p&&!s&&e&&(l!==null&&gn(a,l),i!==null&&i.f&E)){var d=i;(d.children??(d.children=[])).push(a)}return a}function br(){return i===null?!1:!x}function Ir(t){const n=F(B,null,!1);return m(n,h),n.teardown=t,n}function Sr(t){Mt();var n=u!==null&&(u.f&g)!==0&&o!==null&&!o.m;if(n){var r=o;(r.e??(r.e=[])).push({fn:t,effect:u,reaction:i})}else{var e=Lt(t);return e}}function Dr(t){return Mt(),_t(t)}function Or(t){const n=F(Q,t,!0);return(r={})=>new Promise(e=>{r.outro?kn(n,()=>{I(n),e(void 0)}):(I(n),e(void 0))})}function Lt(t){return F(xt,t,!1)}function Cr(t,n){var r=o,e={effect:null,ran:!1};r.l.r1.push(e),e.effect=_t(()=>{t(),!e.ran&&(e.ran=!0,it(r.l.r2,!0),ht(n))})}function Nr(){var t=o;_t(()=>{if(pt(t.l.r2)){for(var n of t.l.r1){var r=n.effect;r.f&h&&m(r,P),M(r)&&U(r),n.ran=!1}t.l.r2.v=!1}})}function _t(t){return F(B,t,!0)}function Pr(t){return xn(t)}function xn(t,n=0){return F(B|ut|n,t,!0)}function qr(t,n=!0){return F(B|g,t,!0,n)}function Yt(t){var n=t.teardown;if(n!==null){const r=ct,e=i;Tt(!0),z(null);try{n.call(null)}finally{Tt(r),z(e)}}}function jt(t){var n=t.deriveds;if(n!==null){t.deriveds=null;for(var r=0;r<n.length;r+=1)ft(n[r])}}function Ht(t,n=!1){var r=t.first;for(t.first=t.last=null;r!==null;){var e=r.next;I(r,n),r=e}}function An(t){for(var n=t.first;n!==null;){var r=n.next;n.f&g||I(n),n=r}}function I(t,n=!0){var r=!1;if((n||t.f&an)&&t.nodes_start!==null){for(var e=t.nodes_start,s=t.nodes_end;e!==null;){var l=e===s?null:D(e);e.remove(),e=l}r=!0}Ht(t,n&&!r),jt(t),H(t,0),m(t,q);var a=t.transitions;if(a!==null)for(const p of a)p.stop();Yt(t);var f=t.parent;f!==null&&f.first!==null&&Bt(t),t.next=t.prev=t.teardown=t.ctx=t.deps=t.fn=t.nodes_start=t.nodes_end=null}function Bt(t){var n=t.parent,r=t.prev,e=t.next;r!==null&&(r.next=e),e!==null&&(e.prev=r),n!==null&&(n.first===t&&(n.first=e),n.last===t&&(n.last=r))}function kn(t,n){var r=[];Ut(t,r,!0),Rn(r,()=>{I(t),n&&n()})}function Rn(t,n){var r=t.length;if(r>0){var e=()=>--r||n();for(var s of t)s.out(e)}else n()}function Ut(t,n,r){if(!(t.f&N)){if(t.f^=N,t.transitions!==null)for(const a of t.transitions)(a.is_global||r)&&n.push(a);for(var e=t.first;e!==null;){var s=e.next,l=(e.f&At)!==0||(e.f&g)!==0;Ut(e,n,l?r:!1),e=s}}}function Fr(t){Vt(t,!0)}function Vt(t,n){if(t.f&N){M(t)&&U(t),t.f^=N;for(var r=t.first;r!==null;){var e=r.next,s=(r.f&At)!==0||(r.f&g)!==0;Vt(r,s?n:!1),r=e}if(t.transitions!==null)for(const l of t.transitions)(l.is_global||n)&&l.in()}}const bn=typeof requestIdleCallback>"u"?t=>setTimeout(t,1):requestIdleCallback;let $=!1,Z=!1,st=[],lt=[];function Gt(){$=!1;const t=st.slice();st=[],gt(t)}function Kt(){Z=!1;const t=lt.slice();lt=[],gt(t)}function Mr(t){$||($=!0,queueMicrotask(Gt)),st.push(t)}function Lr(t){Z||(Z=!0,bn(Kt)),lt.push(t)}function In(){$&&Gt(),Z&&Kt()}function Sn(t){throw new Error("https://svelte.dev/e/lifecycle_outside_component")}const $t=0,Dn=1;let V=!1,G=$t,Y=!1,j=null,O=!1,ct=!1;function mt(t){O=t}function Tt(t){ct=t}let R=[],C=0;let i=null;function z(t){i=t}let u=null;function J(t){u=t}let T=null;function On(t){T=t}let v=null,y=0,A=null;function Cn(t){A=t}let Zt=1,x=!1,o=null;function zt(){return++Zt}function vt(){return!W||o!==null&&o.l===null}function M(t){var a,f;var n=t.f;if(n&k)return!0;if(n&P){var r=t.deps,e=(n&S)!==0;if(r!==null){var s;if(n&K){for(s=0;s<r.length;s++)((a=r[s]).reactions??(a.reactions=[])).push(t);t.f^=K}for(s=0;s<r.length;s++){var l=r[s];if(M(l)&&Ft(l),e&&u!==null&&!x&&!((f=l==null?void 0:l.reactions)!=null&&f.includes(t))&&(l.reactions??(l.reactions=[])).push(t),l.version>t.version)return!0}}(!e||u!==null&&!x)&&m(t,h)}return!1}function Nn(t,n){for(var r=n;r!==null;){if(r.f&nt)try{r.fn(t);return}catch{r.f^=nt}r=r.parent}throw V=!1,t}function Pn(t){return(t.f&q)===0&&(t.parent===null||(t.parent.f&nt)===0)}function X(t,n,r,e){if(V){if(r===null&&(V=!1),Pn(n))throw t;return}r!==null&&(V=!0);{Nn(t,n);return}}function Jt(t){var dt;var n=v,r=y,e=A,s=i,l=x,a=T,f=o,p=t.f;v=null,y=0,A=null,i=p&(g|Q)?null:t,x=!O&&(p&S)!==0,T=null,o=t.ctx;try{var d=(0,t.fn)(),_=t.deps;if(v!==null){var c;if(H(t,y),_!==null&&y>0)for(_.length=y+v.length,c=0;c<v.length;c++)_[y+c]=v[c];else t.deps=_=v;if(!x)for(c=y;c<_.length;c++)((dt=_[c]).reactions??(dt.reactions=[])).push(t)}else _!==null&&y<_.length&&(H(t,y),_.length=y);return d}finally{v=n,y=r,A=e,i=s,x=l,T=a,o=f}}function qn(t,n){let r=n.reactions;if(r!==null){var e=r.indexOf(t);if(e!==-1){var s=r.length-1;s===0?r=n.reactions=null:(r[e]=r[s],r.pop())}}r===null&&n.f&E&&(v===null||!v.includes(n))&&(m(n,P),n.f&(S|K)||(n.f^=K),H(n,0))}function H(t,n){var r=t.deps;if(r!==null)for(var e=n;e<r.length;e++)qn(t,r[e])}function U(t){var n=t.f;if(!(n&q)){m(t,h);var r=u,e=o;u=t;try{n&ut?An(t):Ht(t),jt(t),Yt(t);var s=Jt(t);t.teardown=typeof s=="function"?s:null,t.version=Zt}catch(l){X(l,t,r,e||t.ctx)}finally{u=r}}}function Qt(){if(C>1e3){C=0;try{cn()}catch(t){if(j!==null)X(t,j,null);else throw t}}C++}function Wt(t){var n=t.length;if(n!==0){Qt();var r=O;O=!0;try{for(var e=0;e<n;e++){var s=t[e];s.f&h||(s.f^=h);var l=[];Xt(s,l),Fn(l)}}finally{O=r}}}function Fn(t){var n=t.length;if(n!==0)for(var r=0;r<n;r++){var e=t[r];if(!(e.f&(q|N)))try{M(e)&&(U(e),e.deps===null&&e.first===null&&e.nodes_start===null&&(e.teardown===null?Bt(e):e.fn=null))}catch(s){X(s,e,null,e.ctx)}}}function Mn(){if(Y=!1,C>1001)return;const t=R;R=[],Wt(t),Y||(C=0,j=null)}function tt(t){G===$t&&(Y||(Y=!0,queueMicrotask(Mn))),j=t;for(var n=t;n.parent!==null;){n=n.parent;var r=n.f;if(r&(Q|g)){if(!(r&h))return;n.f^=h}}R.push(n)}function Xt(t,n){var r=t.first,e=[];t:for(;r!==null;){var s=r.f,l=(s&g)!==0,a=l&&(s&h)!==0,f=r.next;if(!a&&!(s&N))if(s&B){if(l)r.f^=h;else try{M(r)&&U(r)}catch(c){X(c,r,null,r.ctx)}var p=r.first;if(p!==null){r=p;continue}}else s&xt&&e.push(r);if(f===null){let c=r.parent;for(;c!==null;){if(t===c)break t;var d=c.next;if(d!==null){r=d;continue t}c=c.parent}}r=f}for(var _=0;_<e.length;_++)p=e[_],n.push(p),Xt(p,n)}function tn(t){var n=G,r=R;try{Qt();const s=[];G=Dn,R=s,Y=!1,Wt(r);var e=t==null?void 0:t();return In(),(R.length>0||s.length>0)&&tn(),C=0,j=null,e}finally{G=n,R=r}}async function Yr(){await Promise.resolve(),tn()}function pt(t){var _;var n=t.f,r=(n&E)!==0;if(r&&n&q){var e=qt(t);return ft(t),e}if(i!==null){T!==null&&T.includes(t)&&vn();var s=i.deps;v===null&&s!==null&&s[y]===t?y++:v===null?v=[t]:v.push(t),A!==null&&u!==null&&u.f&h&&!(u.f&g)&&A.includes(t)&&(m(u,k),tt(u))}else if(r&&t.deps===null)for(var l=t,a=l.parent,f=l;a!==null;)if(a.f&E){var p=a;f=p,a=p.parent}else{var d=a;(_=d.deriveds)!=null&&_.includes(f)||(d.deriveds??(d.deriveds=[])).push(f);break}return r&&(l=t,M(l)&&Ft(l)),t.v}function ht(t){const n=i;try{return i=null,t()}finally{i=n}}const Ln=~(k|P|h);function m(t,n){t.f=t.f&Ln|n}function jr(t){return nn().get(t)}function Hr(t,n){return nn().set(t,n),n}function nn(t){return o===null&&Sn(),o.c??(o.c=new Map(Yn(o)||void 0))}function Yn(t){let n=t.p;for(;n!==null;){const r=n.c;if(r!==null)return r;n=n.p}return null}function Br(t,n=1){var r=pt(t),e=n===1?r++:r--;return it(t,r),e}function Ur(t,n=!1,r){o={p:o,c:null,e:null,m:!1,s:t,x:null,l:null},W&&!n&&(o.l={s:null,u:null,r1:[],r2:ot(!1)})}function Vr(t){const n=o;if(n!==null){t!==void 0&&(n.x=t);const a=n.e;if(a!==null){var r=u,e=i;n.e=null;try{for(var s=0;s<a.length;s++){var l=a[s];J(l.effect),z(l.reaction),Lt(l.fn)}}finally{J(r),z(e)}}o=n.p,n.m=!0}return t||{}}function Gr(t){if(!(typeof t!="object"||!t||t instanceof EventTarget)){if(Et in t)at(t);else if(!Array.isArray(t))for(let n in t){const r=t[n];typeof r=="object"&&r&&Et in r&&at(r)}}}function at(t,n=new Set){if(typeof t=="object"&&t!==null&&!(t instanceof EventTarget)&&!n.has(t)){n.add(t),t instanceof Date&&t.getTime();for(let e in t)try{at(t[e],n)}catch{}const r=en(t);if(r!==Object.prototype&&r!==Array.prototype&&r!==Map.prototype&&r!==Set.prototype&&r!==Date.prototype){const e=rn(r);for(let s in e){const l=e[s].get;if(l)try{l.call(t)}catch{}}}}}function Kr(t,n,r){if(t==null)return n(void 0),r&&r(void 0),sn;const e=ht(()=>t.subscribe(n,r));return e.unsubscribe?()=>e.unsubscribe():e}export{Mr as $,b as A,w as B,Un as C,Vn as D,At as E,ot as F,Xn as G,yt as H,u as I,tr as J,en as K,jn as L,Sn as M,W as N,_t as O,$n as P,wr as Q,yr as R,Et as S,dn as T,cr as U,mr as V,L as W,dr as X,Fr as Y,kn as Z,Lt as _,Sr as a,Wn as a0,Zn as a1,ur as a2,bt as a3,g as a4,Q as a5,J as a6,lr as a7,ar as a8,or as a9,Jn as aA,rn as aB,vt as aC,Cr as aD,Nr as aE,wt as aF,pr as aG,hr as aH,N as aI,wn as aJ,Ut as aK,Rn as aL,er as aM,rr as aN,sr as aO,br as aP,Hr as aQ,jr as aR,zn as aa,Rr as ab,Gn as ac,ir as ad,En as ae,Ir as af,z as ag,i as ah,Bn as ai,Tr as aj,et as ak,hn as al,D as am,It as an,yn as ao,Ot as ap,Qn as aq,kr as ar,Hn as as,Or as at,rt as au,fr as av,_r as aw,tn as ax,Yr as ay,Lr as az,ht as b,o as c,Kn as d,Gr as e,mn as f,pt as g,nr as h,un as i,xr as j,Vr as k,gr as l,Er as m,sn as n,Ar as o,Ur as p,vr as q,gt as r,Kr as s,Pr as t,Dr as u,it as v,Br as w,xn as x,qr as y,I as z};
