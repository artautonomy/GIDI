import{x as H,A as b,a6 as K,E as M,ae as z,af as V,a5 as X,a4 as q,ag as B,y as T,ah as g,B as Z,U as J,ai as Q,O as W,b as O,Z as k,S as y,H as m,aj as ee,ak as re,al as ae,am as se,g as E,v as ne,an as te,ao as ie,X as C,ap as fe,N as ue,aq as le,ar as ce,as as G,f as F,at as oe,au as P,I as U,av as _e,aw as pe}from"./utils.CQdqtoc_.js";import{p as de}from"./index-client.DzFwc65J.js";import{f as ve}from"./disclose-version.CyJLuhDn.js";function Ie(e,r,s=!1){b&&K();var a=e,n=null,t=null,l=J,I=s?M:0,o=!1;const c=(u,f=!0)=>{o=!0,S(f,u)},S=(u,f)=>{if(l===(l=u))return;let _=!1;if(b){const v=a.data===z;!!l===v&&(a=V(),X(a),q(!1),_=!0)}l?(n?B(n):f&&(n=T(()=>f(a))),t&&g(t,()=>{t=null})):(t?B(t):f&&(t=T(()=>f(a))),n&&g(n,()=>{n=null})),_&&q(!0)};H(()=>{o=!1,r(c),o||S(null,null)},I),b&&(a=Z)}function Re(e,r,s){b&&K();var a=e,n,t;H(()=>{n!==(n=r())&&(t&&(g(t),t=null),n&&(t=T(()=>s(a,n))))},M),b&&(a=Z)}function Y(e,r){return e===r||(e==null?void 0:e[y])===r}function we(e={},r,s,a){return Q(()=>{var n,t;return W(()=>{n=t,t=[],O(()=>{e!==s(...t)&&(r(e,...t),n&&Y(s(...n),e)&&r(null,...n))})}),()=>{k(()=>{t&&Y(s(...t),e)&&r(null,...t)})}}),e}const he={get(e,r){if(!e.exclude.includes(r))return e.props[r]},set(e,r){return!1},getOwnPropertyDescriptor(e,r){if(!e.exclude.includes(r)&&r in e.props)return{enumerable:!0,configurable:!0,value:e.props[r]}},has(e,r){return e.exclude.includes(r)?!1:r in e.props},ownKeys(e){return Reflect.ownKeys(e.props).filter(r=>!e.exclude.includes(r))}};function Ae(e,r,s){return new Proxy({props:e,exclude:r},he)}const Ee={get(e,r){let s=e.props.length;for(;s--;){let a=e.props[s];if(P(a)&&(a=a()),typeof a=="object"&&a!==null&&r in a)return a[r]}},set(e,r,s){let a=e.props.length;for(;a--;){let n=e.props[a];P(n)&&(n=n());const t=m(n,r);if(t&&t.set)return t.set(s),!0}return!1},getOwnPropertyDescriptor(e,r){let s=e.props.length;for(;s--;){let a=e.props[s];if(P(a)&&(a=a()),typeof a=="object"&&a!==null&&r in a){const n=m(a,r);return n&&!n.configurable&&(n.configurable=!0),n}}},has(e,r){if(r===y||r===G)return!1;for(let s of e.props)if(P(s)&&(s=s()),s!=null&&r in s)return!0;return!1},ownKeys(e){const r=[];for(let s of e.props){P(s)&&(s=s());for(const a in s)r.includes(a)||r.push(a)}return r}};function Te(...e){return new Proxy({props:e},Ee)}function j(e){for(var r=U,s=U;r!==null&&!(r.f&(te|ie));)r=r.parent;try{return C(r),e()}finally{C(s)}}function ge(e,r,s,a){var L;var n=(s&fe)!==0,t=!ue||(s&le)!==0,l=(s&ce)!==0,I=(s&_e)!==0,o=!1,c;l?[c,o]=ve(()=>e[r]):c=e[r];var S=y in e||G in e,u=((L=m(e,r))==null?void 0:L.set)??(S&&l&&r in e?i=>e[r]=i:void 0),f=a,_=!0,v=!1,x=()=>(v=!0,_&&(_=!1,I?f=O(a):f=a),f);c===void 0&&a!==void 0&&(u&&t&&ee(),c=x(),u&&u(c));var p;if(t)p=()=>{var i=e[r];return i===void 0?x():(_=!0,v=!1,i)};else{var N=j(()=>(n?F:oe)(()=>e[r]));N.f|=re,p=()=>{var i=E(N);return i!==void 0&&(f=void 0),i===void 0?f:i}}if(!(s&ae))return p;if(u){var $=e.$$legacy;return function(i,d){return arguments.length>0?((!t||!d||$||o)&&u(d?p():i),i):p()}}var R=!1,D=!1,w=pe(c),h=j(()=>F(()=>{var i=p(),d=E(w);return R?(R=!1,D=!0,d):(D=!1,w.v=i)}));return n||(h.equals=se),function(i,d){if(arguments.length>0){const A=d?E(h):t&&l?de(i):i;return h.equals(A)||(R=!0,ne(w,A),v&&f!==void 0&&(f=A),O(()=>E(h))),i}return E(h)}}export{we as b,Re as c,Ie as i,ge as p,Ae as r,Te as s};
