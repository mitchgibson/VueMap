import{B as x,o as s,c as l,r as v,m as w,s as $,d as _,u as I,a as V,b as A,e,F as G,f as B,g as u,h as i,w as f,i as j,t as b,j as m,k as h,l as C}from"./index-zROEe3zJ.js";var N=function(o){var n=o.dt;return`
.p-inputgroup,
.p-inputgroup .p-floatlabel,
.p-inputgroup .p-iftalabel {
    display: flex;
    align-items: stretch;
    width: 100%;
}

.p-inputgroup .p-inputtext,
.p-inputgroup .p-inputwrapper {
    flex: 1 1 auto;
    width: 1%;
}

.p-inputgroupaddon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: `.concat(n("inputgroup.addon.padding"),`;
    background: `).concat(n("inputgroup.addon.background"),`;
    color: `).concat(n("inputgroup.addon.color"),`;
    border-block-start: 1px solid `).concat(n("inputgroup.addon.border.color"),`;
    border-block-end: 1px solid `).concat(n("inputgroup.addon.border.color"),`;
    min-width: `).concat(n("inputgroup.addon.min.width"),`;
}

.p-inputgroupaddon:first-child,
.p-inputgroupaddon + .p-inputgroupaddon {
    border-inline-start: 1px solid `).concat(n("inputgroup.addon.border.color"),`;
}

.p-inputgroupaddon:last-child {
    border-inline-end: 1px solid `).concat(n("inputgroup.addon.border.color"),`;
}

.p-inputgroupaddon:has(.p-button) {
    padding: 0;
    overflow: hidden;
}

.p-inputgroupaddon .p-button {
    border-radius: 0;
}

.p-inputgroup > .p-component,
.p-inputgroup > .p-inputwrapper > .p-component,
.p-inputgroup > .p-floatlabel > .p-component,
.p-inputgroup > .p-floatlabel > .p-inputwrapper > .p-component,
.p-inputgroup > .p-iftalabel > .p-component,
.p-inputgroup > .p-iftalabel > .p-inputwrapper > .p-component {
    border-radius: 0;
    margin: 0;
}

.p-inputgroupaddon:first-child,
.p-inputgroup > .p-component:first-child,
.p-inputgroup > .p-inputwrapper:first-child > .p-component,
.p-inputgroup > .p-floatlabel:first-child > .p-component,
.p-inputgroup > .p-floatlabel:first-child > .p-inputwrapper > .p-component,
.p-inputgroup > .p-iftalabel:first-child > .p-component,
.p-inputgroup > .p-iftalabel:first-child > .p-inputwrapper > .p-component {
    border-start-start-radius: `).concat(n("inputgroup.addon.border.radius"),`;
    border-end-start-radius: `).concat(n("inputgroup.addon.border.radius"),`;
}

.p-inputgroupaddon:last-child,
.p-inputgroup > .p-component:last-child,
.p-inputgroup > .p-inputwrapper:last-child > .p-component,
.p-inputgroup > .p-floatlabel:last-child > .p-component,
.p-inputgroup > .p-floatlabel:last-child > .p-inputwrapper > .p-component,
.p-inputgroup > .p-iftalabel:last-child > .p-component,
.p-inputgroup > .p-iftalabel:last-child > .p-inputwrapper > .p-component {
    border-start-end-radius: `).concat(n("inputgroup.addon.border.radius"),`;
    border-end-end-radius: `).concat(n("inputgroup.addon.border.radius"),`;
}

.p-inputgroup .p-component:focus,
.p-inputgroup .p-component.p-focus,
.p-inputgroup .p-inputwrapper-focus,
.p-inputgroup .p-component:focus ~ label,
.p-inputgroup .p-component.p-focus ~ label,
.p-inputgroup .p-inputwrapper-focus ~ label {
    z-index: 1;
}

.p-inputgroup > .p-button:not(.p-button-icon-only) {
    width: auto;
}
`)},q={root:"p-inputgroup"},z=x.extend({name:"inputgroup",theme:N,classes:q}),F={name:"BaseInputGroup",extends:$,style:z,provide:function(){return{$pcInputGroup:this,$parentInstance:this}}},y={name:"InputGroup",extends:F,inheritAttrs:!1};function U(p,o,n,r,d,c){return s(),l("div",w({class:p.cx("root")},p.ptmi("root")),[v(p.$slots,"default")],16)}y.render=U;var D={root:"p-inputgroupaddon"},E=x.extend({name:"inputgroupaddon",classes:D}),L={name:"BaseInputGroupAddon",extends:$,style:E,provide:function(){return{$pcInputGroupAddon:this,$parentInstance:this}}},S={name:"InputGroupAddon",extends:L,inheritAttrs:!1};function P(p,o,n,r,d,c){return s(),l("div",w({class:p.cx("root")},p.ptmi("root")),[v(p.$slots,"default")],16)}S.render=P;const R={class:"flex flex-col items-center justify-start w-full h-full p-4"},T={class:"flex flex-col w-full md:w-1/2"},H={class:"flex flex-col w-full gap-y-4 py-4"},J={class:"flex flex-row items-center justify-between p-4 border border-surface-600 rounded"},K={class:"text-sm text-surface-400"},M={class:"flex flex-row items-center justify-end"},O={class:"flex flex-row items-center justify-end"},X=_({__name:"Settings",setup(p){const o=I(),n=V(!1),r=A({name:"",value:""});function d(g){o.updateSettings({scopes:o.$settings.scopes.filter(t=>t.name!==g.name)})}function c(){n.value=!0}function k(){o.updateSettings({scopes:[...o.$settings.scopes,{...r}]}),n.value=!1,r.name="",r.value=""}return(g,t)=>(s(),l("div",R,[e("div",T,[t[4]||(t[4]=e("h2",{class:"text-xl"},"Scopes",-1)),t[5]||(t[5]=e("p",{class:"text-sm text-surface-400"},"Scopes are the directories available to crawl from components.",-1)),e("div",H,[(s(!0),l(G,null,B(u(o).$settings.scopes,a=>(s(),l("div",J,[e("div",null,[e("p",null,b(a.name),1),e("p",K,b(a.value),1)]),e("div",M,[i(u(m),{icon:"pi pi-trash",severity:"danger",class:"p-button-text p-button-sm",onClick:Q=>d(a)},null,8,["onClick"])])]))),256)),n.value?(s(),l("form",{key:0,onSubmit:k,class:"flex flex-row items-center w-full gap-x-2"},[i(u(h),{autofocus:"",modelValue:r.name,"onUpdate:modelValue":t[0]||(t[0]=a=>r.name=a),required:"",placeholder:"Name"},null,8,["modelValue"]),i(u(y),null,{default:f(()=>[i(u(S),null,{default:f(()=>t[2]||(t[2]=[e("i",{class:"pi pi-folder-open"},null,-1)])),_:1}),i(u(h),{modelValue:r.value,"onUpdate:modelValue":t[1]||(t[1]=a=>r.value=a),required:"",placeholder:"/path/to/scope"},null,8,["modelValue"])]),_:1}),i(u(m),{type:"submit",icon:"pi pi-check",class:"p-button-text p-button-sm"})],32)):j("",!0)]),e("div",O,[i(u(m),{onClick:c,size:"small",outlined:"",severity:"secondary"},{default:f(()=>t[3]||(t[3]=[e("i",{class:"pi pi-plus"},null,-1),C("Add Scope")])),_:1})])])]))}});export{X as default};
