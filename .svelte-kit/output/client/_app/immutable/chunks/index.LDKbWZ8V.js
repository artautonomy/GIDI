import{A as R,Q as L,R as P,K as E,T as O}from"./utils.CQdqtoc_.js";import{a as T}from"./misc.B9QI8j-U.js";function C(t){if(R){var r=!1,n=()=>{if(!r){if(r=!0,t.hasAttribute("value")){var s=t.value;_(t,"value",null),t.value=s}if(t.hasAttribute("checked")){var e=t.checked;_(t,"checked",null),t.checked=e}}};t.__on_r=n,L(n),T()}}function J(t,r){var n=t.__attributes??(t.__attributes={});n.value===(n.value=r??void 0)||t.value===r&&(r!==0||t.nodeName!=="PROGRESS")||(t.value=r)}function U(t,r){var n=t.__attributes??(t.__attributes={});n.checked!==(n.checked=r??void 0)&&(t.checked=r)}function _(t,r,n,s){var e=t.__attributes??(t.__attributes={});R&&(e[r]=t.getAttribute(r),r==="src"||r==="srcset"||r==="href"&&t.nodeName==="LINK")||e[r]!==(e[r]=n)&&(r==="style"&&"__styles"in t&&(t.__styles={}),r==="loading"&&(t[P]=n),n==null?t.removeAttribute(r):typeof n!="string"&&q(t).includes(r)?t[r]=n:t.setAttribute(r,n))}var N=new Map;function q(t){var r=N.get(t.nodeName);if(r)return r;N.set(t.nodeName,r=[]);for(var n,s=t,e=Element.prototype;e!==s;){n=O(s);for(var a in n)n[a].set&&r.push(a);s=E(s)}return r}function W(t,r,n,s){var e=t.__styles??(t.__styles={});e[r]!==n&&(e[r]=n,n==null?t.style.removeProperty(r):t.style.setProperty(r,n,""))}var D={grad:.9,turn:360,rad:360/(2*Math.PI)},h=function(t){return typeof t=="string"?t.length>0:typeof t=="number"},o=function(t,r,n){return r===void 0&&(r=0),n===void 0&&(n=Math.pow(10,r)),Math.round(n*t)/n+0},f=function(t,r,n){return r===void 0&&(r=0),n===void 0&&(n=1),t>n?n:t>r?t:r},S=function(t){return(t=isFinite(t)?t%360:0)>0?t:t+360},x=function(t){return{r:f(t.r,0,255),g:f(t.g,0,255),b:f(t.b,0,255),a:f(t.a)}},p=function(t){return{r:o(t.r),g:o(t.g),b:o(t.b),a:o(t.a,3)}},G=/^#([0-9a-f]{3,8})$/i,g=function(t){var r=t.toString(16);return r.length<2?"0"+r:r},$=function(t){var r=t.r,n=t.g,s=t.b,e=t.a,a=Math.max(r,n,s),u=a-Math.min(r,n,s),i=u?a===r?(n-s)/u:a===n?2+(s-r)/u:4+(r-n)/u:0;return{h:60*(i<0?i+6:i),s:a?u/a*100:0,v:a/255*100,a:e}},j=function(t){var r=t.h,n=t.s,s=t.v,e=t.a;r=r/360*6,n/=100,s/=100;var a=Math.floor(r),u=s*(1-n),i=s*(1-(r-a)*n),b=s*(1-(1-r+a)*n),v=a%6;return{r:255*[s,i,u,u,b,s][v],g:255*[b,s,s,i,u,u][v],b:255*[u,u,b,s,s,i][v],a:e}},m=function(t){return{h:S(t.h),s:f(t.s,0,100),l:f(t.l,0,100),a:f(t.a)}},I=function(t){return{h:o(t.h),s:o(t.s),l:o(t.l),a:o(t.a,3)}},M=function(t){return j((n=(r=t).s,{h:r.h,s:(n*=((s=r.l)<50?s:100-s)/100)>0?2*n/(s+n)*100:0,v:s+n,a:r.a}));var r,n,s},d=function(t){return{h:(r=$(t)).h,s:(e=(200-(n=r.s))*(s=r.v)/100)>0&&e<200?n*s/100/(e<=100?e:200-e)*100:0,l:e/2,a:r.a};var r,n,s,e},K=/^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,B=/^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,F=/^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,Q=/^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,A={string:[[function(t){var r=G.exec(t);return r?(t=r[1]).length<=4?{r:parseInt(t[0]+t[0],16),g:parseInt(t[1]+t[1],16),b:parseInt(t[2]+t[2],16),a:t.length===4?o(parseInt(t[3]+t[3],16)/255,2):1}:t.length===6||t.length===8?{r:parseInt(t.substr(0,2),16),g:parseInt(t.substr(2,2),16),b:parseInt(t.substr(4,2),16),a:t.length===8?o(parseInt(t.substr(6,2),16)/255,2):1}:null:null},"hex"],[function(t){var r=F.exec(t)||Q.exec(t);return r?r[2]!==r[4]||r[4]!==r[6]?null:x({r:Number(r[1])/(r[2]?100/255:1),g:Number(r[3])/(r[4]?100/255:1),b:Number(r[5])/(r[6]?100/255:1),a:r[7]===void 0?1:Number(r[7])/(r[8]?100:1)}):null},"rgb"],[function(t){var r=K.exec(t)||B.exec(t);if(!r)return null;var n,s,e=m({h:(n=r[1],s=r[2],s===void 0&&(s="deg"),Number(n)*(D[s]||1)),s:Number(r[3]),l:Number(r[4]),a:r[5]===void 0?1:Number(r[5])/(r[6]?100:1)});return M(e)},"hsl"]],object:[[function(t){var r=t.r,n=t.g,s=t.b,e=t.a,a=e===void 0?1:e;return h(r)&&h(n)&&h(s)?x({r:Number(r),g:Number(n),b:Number(s),a:Number(a)}):null},"rgb"],[function(t){var r=t.h,n=t.s,s=t.l,e=t.a,a=e===void 0?1:e;if(!h(r)||!h(n)||!h(s))return null;var u=m({h:Number(r),s:Number(n),l:Number(s),a:Number(a)});return M(u)},"hsl"],[function(t){var r=t.h,n=t.s,s=t.v,e=t.a,a=e===void 0?1:e;if(!h(r)||!h(n)||!h(s))return null;var u=function(i){return{h:S(i.h),s:f(i.s,0,100),v:f(i.v,0,100),a:f(i.a)}}({h:Number(r),s:Number(n),v:Number(s),a:Number(a)});return j(u)},"hsv"]]},k=function(t,r){for(var n=0;n<r.length;n++){var s=r[n][0](t);if(s)return[s,r[n][1]]}return[null,void 0]},V=function(t){return typeof t=="string"?k(t.trim(),A.string):typeof t=="object"&&t!==null?k(t,A.object):[null,void 0]},l=function(t,r){var n=d(t);return{h:n.h,s:f(n.s+100*r,0,100),l:n.l,a:n.a}},y=function(t){return(299*t.r+587*t.g+114*t.b)/1e3/255},H=function(t,r){var n=d(t);return{h:n.h,s:n.s,l:f(n.l+100*r,0,100),a:n.a}},w=function(){function t(r){this.parsed=V(r)[0],this.rgba=this.parsed||{r:0,g:0,b:0,a:1}}return t.prototype.isValid=function(){return this.parsed!==null},t.prototype.brightness=function(){return o(y(this.rgba),2)},t.prototype.isDark=function(){return y(this.rgba)<.5},t.prototype.isLight=function(){return y(this.rgba)>=.5},t.prototype.toHex=function(){return r=p(this.rgba),n=r.r,s=r.g,e=r.b,u=(a=r.a)<1?g(o(255*a)):"","#"+g(n)+g(s)+g(e)+u;var r,n,s,e,a,u},t.prototype.toRgb=function(){return p(this.rgba)},t.prototype.toRgbString=function(){return r=p(this.rgba),n=r.r,s=r.g,e=r.b,(a=r.a)<1?"rgba("+n+", "+s+", "+e+", "+a+")":"rgb("+n+", "+s+", "+e+")";var r,n,s,e,a},t.prototype.toHsl=function(){return I(d(this.rgba))},t.prototype.toHslString=function(){return r=I(d(this.rgba)),n=r.h,s=r.s,e=r.l,(a=r.a)<1?"hsla("+n+", "+s+"%, "+e+"%, "+a+")":"hsl("+n+", "+s+"%, "+e+"%)";var r,n,s,e,a},t.prototype.toHsv=function(){return r=$(this.rgba),{h:o(r.h),s:o(r.s),v:o(r.v),a:o(r.a,3)};var r},t.prototype.invert=function(){return c({r:255-(r=this.rgba).r,g:255-r.g,b:255-r.b,a:r.a});var r},t.prototype.saturate=function(r){return r===void 0&&(r=.1),c(l(this.rgba,r))},t.prototype.desaturate=function(r){return r===void 0&&(r=.1),c(l(this.rgba,-r))},t.prototype.grayscale=function(){return c(l(this.rgba,-1))},t.prototype.lighten=function(r){return r===void 0&&(r=.1),c(H(this.rgba,r))},t.prototype.darken=function(r){return r===void 0&&(r=.1),c(H(this.rgba,-r))},t.prototype.rotate=function(r){return r===void 0&&(r=15),this.hue(this.hue()+r)},t.prototype.alpha=function(r){return typeof r=="number"?c({r:(n=this.rgba).r,g:n.g,b:n.b,a:r}):o(this.rgba.a,3);var n},t.prototype.hue=function(r){var n=d(this.rgba);return typeof r=="number"?c({h:r,s:n.s,l:n.l,a:n.a}):o(n.h)},t.prototype.isEqual=function(r){return this.toHex()===c(r).toHex()},t}(),c=function(t){return t instanceof w?t:new w(t)};export{_ as a,J as b,U as c,C as r,W as s,c as w};
