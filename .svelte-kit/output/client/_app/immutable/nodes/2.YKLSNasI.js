var Ge=o=>{throw TypeError(o)};var xe=(o,r,e)=>r.has(o)||Ge("Cannot "+e);var n=(o,r,e)=>(xe(o,r,"read from private field"),e?e.call(o):r.get(o)),x=(o,r,e)=>r.has(o)?Ge("Cannot add the same private member more than once"):r instanceof WeakSet?r.add(o):r.set(o,e),I=(o,r,e,t)=>(xe(o,r,"write to private field"),t?t.call(o,e):r.set(o,e),e),Oe=(o,r,e)=>(xe(o,r,"access private method"),e);import{s as Qe,c as he,a as m,t as z,b as Ue,d as Ie}from"../chunks/disclose-version.CbQWKql7.js";import"../chunks/legacy.wwEz_KsH.js";import{r as Ve,l as et,j as Fe,u as tt,C as rt,i as nt,T as fe,c as se,a as ot,b as l,O as st,B as ge,d as W,e as it,I as at,f as lt,g as dt,M as ct,k as ut,h as ht}from"../chunks/Mirror.BKsKmo7Y.js";import{F as ie,O as ft,v as B,P as gt,n as pt,g as a,p as mt,q as pe,b as O,j as v,k as vt,o as i,t as wt,w as je,f as ee}from"../chunks/utils.F7Ud3tqr.js";import{s as _t}from"../chunks/render.ncXMd3g5.js";import{c as d,i as ke}from"../chunks/props.BLHG7mnz.js";import{p as ae,o as $t}from"../chunks/index-client.DDb0GLON.js";import{E as yt,A as Mt}from"../chunks/Align.RZa5lcC7.js";import{M as bt,S as le}from"../chunks/store.rOjKrHxV.js";import{g as xt}from"../chunks/entry.CrEA1HG7.js";function Pe(o,r,e,t){if(typeof e=="number"||Fe(e)){const w=t-e,c=(e-r)/(o.dt||1/60),ne=o.opts.stiffness*w,q=o.opts.damping*c,oe=(ne-q)*o.inv_mass,J=(c+oe)*o.dt;return Math.abs(J)<o.opts.precision&&Math.abs(w)<o.opts.precision?t:(o.settled=!1,Fe(e)?new Date(e.getTime()+J):e+J)}else{if(Array.isArray(e))return e.map((w,c)=>Pe(o,r[c],e[c],t[c]));if(typeof e=="object"){const w={};for(const c in e)w[c]=Pe(o,r[c],e[c],t[c]);return w}else throw new Error(`Cannot spring ${typeof e} values`)}}var L,N,R,S,F,Y,te,Z,de,H,re,ve,Ee;const Ce=class Ce{constructor(r,e={}){x(this,ve);x(this,L,ie(.15));x(this,N,ie(.8));x(this,R,ie(.01));x(this,S,ie(void 0));x(this,F,ie(void 0));x(this,Y);x(this,te,0);x(this,Z,1);x(this,de,0);x(this,H,null);x(this,re,null);n(this,S).v=n(this,F).v=r,typeof e.stiffness=="number"&&(n(this,L).v=me(e.stiffness,0,1)),typeof e.damping=="number"&&(n(this,N).v=me(e.damping,0,1)),typeof e.precision=="number"&&(n(this,R).v=e.precision)}static of(r,e){const t=new Ce(r(),e);return ft(()=>{t.set(r())}),t}set(r,e){var w,c;if((w=n(this,re))==null||w.reject(new Error("Aborted")),e!=null&&e.instant||n(this,S).v===void 0)return(c=n(this,H))==null||c.abort(),I(this,H,null),B(n(this,S),B(n(this,F),r)),I(this,Y,r),Promise.resolve();e!=null&&e.preserveMomentum&&(I(this,Z,0),I(this,de,e.preserveMomentum));var t=I(this,re,gt());return t.promise.catch(pt),Oe(this,ve,Ee).call(this,r).then(()=>{t===n(this,re)&&t.resolve(void 0)}),t.promise}get current(){return a(n(this,S))}get damping(){return a(n(this,N))}set damping(r){B(n(this,N),me(r,0,1))}get precision(){return a(n(this,R))}set precision(r){B(n(this,R),r)}get stiffness(){return a(n(this,L))}set stiffness(r){B(n(this,L),me(r,0,1))}get target(){return a(n(this,F))}set target(r){this.set(r)}};L=new WeakMap,N=new WeakMap,R=new WeakMap,S=new WeakMap,F=new WeakMap,Y=new WeakMap,te=new WeakMap,Z=new WeakMap,de=new WeakMap,H=new WeakMap,re=new WeakMap,ve=new WeakSet,Ee=function(r){var t;if(B(n(this,F),r),(t=n(this,S)).v??(t.v=r),n(this,Y)??I(this,Y,n(this,S).v),!n(this,H)){I(this,te,Ve.now());var e=1e3/(n(this,de)*60);n(this,H)??I(this,H,et(w=>{I(this,Z,Math.min(n(this,Z)+e,1));const c={inv_mass:n(this,Z),opts:{stiffness:n(this,L).v,damping:n(this,N).v,precision:n(this,R).v},settled:!0,dt:(w-n(this,te))*60/1e3};var ne=Pe(c,n(this,Y),n(this,S).v,n(this,F).v);return I(this,Y,n(this,S).v),I(this,te,w),B(n(this,S),ne),c.settled&&I(this,H,null),!c.settled}))}return n(this,H).promise};let De=Ce;function me(o,r,e){return Math.max(r,Math.min(e,o))}var It=z("<!> <!> <!>",1),kt=z("<!> <!> <!> <!> <!> <!>",1),Pt=z(" <!> <!>",1),Dt=z("<!> <!> <!>",1),Ct=z("<!> <!> <!>",1),At=z("<!> <!>",1),St=z("<!> <!>",1),Bt=z("<!> <!>",1),zt=z("<!> <!>",1),Tt=z("<!> <!>",1),Wt=z("<!> <!> <!> <!>",1),Ht=z("<!> <!> <!> <!> <!>",1);function Xt(o,r){mt(r,!0);const e=Qe(),t=()=>Ue(le,"$Settings",e),w=tt(),c=ae(w.scene);c.background=new rt(`rgb(${t().colours.background.r},${t().colours.background.g},${t().colours.background.b})`),nt();let ne=ae([5,3,4]),q=ae([]),oe=pe(!1),J=pe("Swipe to rotate the scene");const ce=new fe(0),we=new De(6),_e=new fe(1,{duration:1e3,easing:se}),Ae=new fe(0,{duration:1e3,easing:se}),$e=new fe(0,{duration:1e3,easing:se}),Le=["Cube","Mirror"];let j=pe(0);const Se="Welcome to GIDI",Be=`GIDI is a free, open source web application for musicians using MIDI devices

By reading MIDI messages it can visualise a performance on a web browser`,{onPointerEnter:ye,onPointerLeave:Me}=ot();let K=pe(ae([{}]));if(window.innerWidth>window.innerHeight){ce.set(50,{delay:200,duration:1e3,easing:se});const u=bt.subscribe(s=>{B(K,ae(s))});$t(u)}else{ce.set(35,{delay:200,duration:1e3,easing:se}),B(oe,!0);let u;he(le,O(t).attack=75,O(t)),he(le,O(t).release=1e3,O(t));for(let s=0;s<5;s++)q.push({note:s,velocity:0});setInterval(()=>{let s=Math.floor(Math.random()*5);for(;s==u;)s=Math.floor(Math.random()*5);q[s].velocity=50,setTimeout(()=>{q[s].velocity=0},Math.floor(Math.random()*1e3)),u=s},Math.floor((Math.random()+.5)*500))}function Ne(){setTimeout(()=>{ce.set(0,{duration:750,easing:ut}),setTimeout(()=>{xt("./style")},750)},2e3)}var ze=Ht(),Te=v(ze);d(Te,()=>l.OrthographicCamera,(u,s)=>{s(u,{makeDefault:!0,get position(){return ne},near:.001,far:5e3,get zoom(){return ce.current},children:(E,Q)=>{var U=ee(()=>!a(oe));st(E,{get enabled(){return a(oe)},get autoRotate(){return a(U)},enableDamping:!0,enablePan:!1,enableZoom:!1,onstart:V=>{Ae.target=.75,B(J,"To shuffle colours tap here")}})},$$slots:{default:!0}})});var We=i(Te,2);{var Re=u=>{var s=Pt(),E=v(s);wt(()=>_t(E,`${(a(K).length>0?Ne():null)??""} `));var Q=i(E);ge(Q,{"position.y":7,children:(V,ue)=>{var _=Ie(),X=v(_);d(X,()=>l.Mesh,(y,M)=>{M(y,{children:(k,P)=>{var p=It(),$=v(p);W($,{text:Se,color:"orange",get font(){return t().font},fontSize:window.innerWidth/4e3,textAlign:"center",anchorX:"center","position.y":window.innerWidth/1250,outlineBlur:.1});var b=i($,2);W(b,{text:Be+`



To start using GIDI follow the steps below:`,get font(){return t().font},fontSize:window.innerWidth/7e3,textAlign:"center",smooth:1,anchorX:"center",outlineBlur:.1});var h=i(b,2);W(h,{text:`1. Connect a MIDI instrument to your device

2. Play a note

3. If the box turns green you are connected`,get font(){return t().font},fontSize:window.innerWidth/6250,color:"orange",textAlign:"left",smooth:1,anchorX:"center","position.y":-window.innerWidth/500,outlineBlur:.1}),m(k,p)},$$slots:{default:!0}})}),m(V,_)},$$slots:{default:!0}});var U=i(Q,2);d(U,()=>l.Mesh,(V,ue)=>{ue(V,{position:[0,-window.innerWidth/300,0],interactive:!0,onpointerenter:()=>we.set(8),onpointerleave:()=>we.set(6),children:(_,X)=>{var y=kt(),M=v(y),k=ee(()=>a(K).length===0?"Connect A MIDI Device":"MIDI Connected");W(M,{get text(){return a(k)},get font(){return t().font},fontSize:.5,textAlign:"center",smooth:1,anchorX:"center",anchorY:"middle",position:[0,.8,0],rotation:[-1.553343,0,0],outlineBlur:.06});var P=i(M,2),p=ee(()=>a(K).length===0?"No MIDI Device Found":"Initialising");W(P,{get text(){return a(p)},get font(){return t().font},fontSize:.5,textAlign:"center",smooth:1,anchorX:"center",anchorY:"middle",position:[0,0,1.02],outlineBlur:.06});var $=i(P,2),b=ee(()=>a(K).length===0?"No MIDI Device Found":"Initialising");W($,{get text(){return a(b)},get font(){return t().font},fontSize:.5,textAlign:"center",smooth:1,anchorX:"center",anchorY:"middle",position:[0,0,-1.02],"rotation.y":3.14,outlineBlur:.06});var h=i($,2);d(h,()=>l.MeshStandardMaterial,(A,G)=>{G(A,{shadow:!0,color:"#FD3F00",toneMapped:!1,metalness:1,roughness:.1})});var f=i(h,2),D=ee(()=>[we.current,1.5,2]);d(f,()=>l.BoxGeometry,(A,G)=>{G(A,{get args(){return a(D)}})});var C=i(f,2),g=ee(()=>a(K).length===0?"darkred":"green");d(C,()=>l.MeshStandardMaterial,(A,G)=>{G(A,{get color(){return a(g)}})}),m(_,y)},$$slots:{default:!0}})}),m(u,s)},Ye=u=>{var s=Wt(),E=v(s);ge(E,{children:(_,X)=>{var y=Ie(),M=v(y);d(M,()=>l.Mesh,(k,P)=>{P(k,{position:[0,8,0],children:(p,$)=>{var b=Dt(),h=v(b);W(h,{text:Se,color:"orange",get font(){return t().font},fontSize:window.innerWidth/600,textAlign:"center",anchorX:"center","position.y":window.innerHeight/350});var f=i(h,2);W(f,{text:Be,get font(){return t().font},fontSize:window.innerWidth/1500,textAlign:"center",smooth:1,anchorX:"center","position.y":window.innerHeight/750});var D=i(f,2);W(D,{text:"Try the demo below or revisit this site on a computer",get font(){return t().font},fontSize:window.innerWidth/1250,textAlign:"center",color:"orange",smooth:1,anchorX:"center","position.y":-window.innerHeight/1250}),m(p,b)},$$slots:{default:!0}})}),m(_,y)},$$slots:{default:!0}});var Q=i(E,2);d(Q,()=>l.Group,(_,X)=>{X(_,{position:[0,-window.innerHeight/140,0],onpointerenter:ye,onpointerleave:Me,onclick:()=>{_e.target=0,$e.target=.75,he(le,O(t).colours.key=yt().toRgb(),O(t)),he(le,O(t).colours.expression={r:255-t().colours.key.r,g:255-t().colours.key.g,b:255-t().colours.key.b},O(t))},children:(y,M)=>{Mt(y,{children:(k,P)=>{var p=Ie(),$=v(p);it($,17,()=>q,lt,(b,h,f)=>{at(b,{children:(D,C)=>{var g=Ct(),A=v(g);d(A,()=>l.BoxGeometry,(T,be)=>{be(T,{})});var G=i(A,2);d(G,()=>l.MeshStandardMaterial,(T,be)=>{be(T,{shadow:!0})});var qe=i(G,2);{var Je=T=>{dt(T,{x:f-2,get velocity(){return a(h).velocity},get attack(){return t().attack},get release(){return t().release},get keyColour(){return t().colours.key},get expressionColour(){return t().colours.expression}})},Ke=T=>{ct(T,{x:f-2,get velocity(){return a(h).velocity},get attack(){return t().attack},get release(){return t().release},get keyColour(){return t().colours.key},get expressionColour(){return t().colours.expression}})};ke(qe,T=>{Le[a(j)]=="Cube"?T(Je):T(Ke,!1)})}m(D,g)},$$slots:{default:!0}})}),m(k,p)},$$slots:{default:!0}})},$$slots:{default:!0}})});var U=i(Q,2);{var V=_=>{ge(_,{"position.y":-window.innerHeight/80,children:(X,y)=>{var M=St(),k=v(M);d(k,()=>l.Mesh,(p,$)=>{$(p,{get scale(){return Ae.current},"position.y":window.innerHeight/550,children:(b,h)=>{var f=At(),D=v(f);d(D,()=>l.ConeGeometry,(g,A)=>{A(g,{})});var C=i(D,2);d(C,()=>l.MeshBasicMaterial,(g,A)=>{A(g,{color:"orange",transparent:!0,get opacity(){return _e.current}})}),m(b,f)},$$slots:{default:!0}})});var P=i(k,2);W(P,{get fillOpacity(){return _e.current},get text(){return a(J)},color:"orange",get font(){return t().font},fontSize:window.innerWidth/1250,textAlign:"center",anchorX:"center","position.y":window.innerHeight/1250}),m(X,M)},$$slots:{default:!0}})};ke(U,_=>{_(V)})}var ue=i(U,2);ge(ue,{"position.y":-window.innerHeight/85,children:(_,X)=>{var y=Tt(),M=v(y);d(M,()=>l.Mesh,(P,p)=>{p(P,{get scale(){return $e.current},"position.x":3,"rotation.z":-Math.PI/2,onpointerenter:ye,onpointerleave:Me,onclick:()=>a(j)===0?je(j):B(j,0),children:($,b)=>{var h=Bt(),f=v(h);d(f,()=>l.ConeGeometry,(C,g)=>{g(C,{})});var D=i(f,2);d(D,()=>l.MeshBasicMaterial,(C,g)=>{g(C,{color:"orange",shadow:!0})}),m($,h)},$$slots:{default:!0}})});var k=i(M,2);d(k,()=>l.Mesh,(P,p)=>{p(P,{get scale(){return $e.current},"position.x":-3,"rotation.z":Math.PI/2,onpointerenter:ye,onpointerleave:Me,onclick:()=>a(j)===1?je(j,-1):B(j,1),children:($,b)=>{var h=zt(),f=v(h);d(f,()=>l.ConeGeometry,(C,g)=>{g(C,{})});var D=i(f,2);d(D,()=>l.MeshBasicMaterial,(C,g)=>{g(C,{color:"orange",shadow:!0})}),m($,h)},$$slots:{default:!0}})}),m(_,y)},$$slots:{default:!0}}),m(u,s)};ke(We,u=>{window.innerWidth>window.innerHeight?u(Re):u(Ye,!1)})}var He=i(We,2);d(He,()=>l.DirectionalLight,(u,s)=>{s(u,{intensity:1,position:[5,0,11]})});var Xe=i(He,2);d(Xe,()=>l.DirectionalLight,(u,s)=>{s(u,{intensity:1,position:[-5,0,-11]})});var Ze=i(Xe,2);d(Ze,()=>l.AmbientLight,(u,s)=>{s(u,{intensity:.3,position:[0,50,0]})}),m(o,ze),vt()}function Jt(o){ht(o,{children:(r,e)=>{Xt(r,{})},$$slots:{default:!0}})}export{Jt as component};
