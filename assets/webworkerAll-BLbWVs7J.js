import{E as p,k as S,c as ce,s as w,F as y,a2 as X,R as N,M as T,w as G,z as he,$ as R,a0 as fe,b as U,B as v,Y as C,a9 as L,x as D,aa as Ye,ab as j,J as H,ac as B,q,t as Xe,G as Ne,ad as I,m as pe,p as me,a4 as ge,a7 as xe,n as je,o as qe,a5 as Qe,a6 as Ke,a8 as Je,ae as Ze,af as et,ag as tt,ah as $,ai as rt,aj as at,D as _e,l as be,ak as V,e as b,al as st}from"./index-BxR8MtGA.js";import{S as A,c as k,a as nt,b as it,B as ye}from"./colorToUniform-DmtBy-2V.js";class ve{constructor(e){this._renderer=e}push(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"filter",canBundle:!1,action:"pushFilter",container:t,filterEffect:e})}pop(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"filter",action:"popFilter",canBundle:!1})}execute(e){e.action==="pushFilter"?this._renderer.filter.push(e):e.action==="popFilter"&&this._renderer.filter.pop()}destroy(){this._renderer=null}}ve.extension={type:[p.WebGLPipes,p.WebGPUPipes,p.CanvasPipes],name:"filter"};function ot(s,e){e.clear();const t=e.matrix;for(let r=0;r<s.length;r++){const a=s[r];a.globalDisplayStatus<7||(e.matrix=a.worldTransform,e.addBounds(a.bounds))}return e.matrix=t,e}const ut=new X({attributes:{aPosition:{buffer:new Float32Array([0,0,1,0,1,1,0,1]),format:"float32x2",stride:2*4,offset:0}},indexBuffer:new Uint32Array([0,1,2,0,2,3])});class lt{constructor(){this.skip=!1,this.inputTexture=null,this.backTexture=null,this.filters=null,this.bounds=new he,this.container=null,this.blendRequired=!1,this.outputRenderSurface=null,this.outputOffset={x:0,y:0},this.globalFrame={x:0,y:0,width:0,height:0}}}class Te{constructor(e){this._filterStackIndex=0,this._filterStack=[],this._filterGlobalUniforms=new S({uInputSize:{value:new Float32Array(4),type:"vec4<f32>"},uInputPixel:{value:new Float32Array(4),type:"vec4<f32>"},uInputClamp:{value:new Float32Array(4),type:"vec4<f32>"},uOutputFrame:{value:new Float32Array(4),type:"vec4<f32>"},uGlobalFrame:{value:new Float32Array(4),type:"vec4<f32>"},uOutputTexture:{value:new Float32Array(4),type:"vec4<f32>"}}),this._globalFilterBindGroup=new ce({}),this.renderer=e}get activeBackTexture(){var e;return(e=this._activeFilterData)==null?void 0:e.backTexture}push(e){const t=this.renderer,r=e.filterEffect.filters,a=this._pushFilterData();a.skip=!1,a.filters=r,a.container=e.container,a.outputRenderSurface=t.renderTarget.renderSurface;const n=t.renderTarget.renderTarget.colorTexture.source,i=n.resolution,o=n.antialias;if(r.length===0){a.skip=!0;return}const u=a.bounds;if(e.renderables?ot(e.renderables,u):e.filterEffect.filterArea?(u.clear(),u.addRect(e.filterEffect.filterArea),u.applyMatrix(e.container.worldTransform)):e.container.getFastGlobalBounds(!0,u),e.container){const m=(e.container.renderGroup||e.container.parentRenderGroup).cacheToLocalTransform;m&&u.applyMatrix(m)}if(this._calculateFilterBounds(a,t.renderTarget.rootViewPort,o,i,1),a.skip)return;const d=this._getPreviousFilterData();let h=i,l=0,c=0;d&&(l=d.bounds.minX,c=d.bounds.minY,h=d.inputTexture.source._resolution),a.outputOffset.x=u.minX-l,a.outputOffset.y=u.minY-c;const f=a.globalFrame;if(f.x=l*h,f.y=c*h,f.width=n.width*h,f.height=n.height*h,a.backTexture=w.EMPTY,a.blendRequired){t.renderTarget.finishRenderPass();const x=t.renderTarget.getRenderTarget(a.outputRenderSurface);a.backTexture=this.getBackTexture(x,u,d==null?void 0:d.bounds)}a.inputTexture=y.getOptimalTexture(u.width,u.height,a.resolution,a.antialias),t.renderTarget.bind(a.inputTexture,!0),t.globalUniforms.push({offset:u})}generateFilteredTexture({texture:e,filters:t}){const r=this._pushFilterData();this._activeFilterData=r,r.skip=!1,r.filters=t;const a=e.source,n=a.resolution,i=a.antialias;if(t.length===0)return r.skip=!0,e;const o=r.bounds;if(o.addRect(e.frame),this._calculateFilterBounds(r,o.rectangle,i,n,0),r.skip)return e;const u=n,d=0,h=0;r.outputOffset.x=-o.minX,r.outputOffset.y=-o.minY;const l=r.globalFrame;l.x=d*u,l.y=h*u,l.width=a.width*u,l.height=a.height*u,r.outputRenderSurface=y.getOptimalTexture(o.width,o.height,r.resolution,r.antialias),r.backTexture=w.EMPTY,r.inputTexture=e,this.renderer.renderTarget.finishRenderPass(),this._applyFiltersToTexture(r,!0);const f=r.outputRenderSurface;return f.source.alphaMode="premultiplied-alpha",f}pop(){const e=this.renderer,t=this._popFilterData();t.skip||(e.globalUniforms.pop(),e.renderTarget.finishRenderPass(),this._activeFilterData=t,this._applyFiltersToTexture(t,!1),t.blendRequired&&y.returnTexture(t.backTexture),y.returnTexture(t.inputTexture))}getBackTexture(e,t,r){const a=e.colorTexture.source._resolution,n=y.getOptimalTexture(t.width,t.height,a,!1);let i=t.minX,o=t.minY;r&&(i-=r.minX,o-=r.minY),i=Math.floor(i*a),o=Math.floor(o*a);const u=Math.ceil(t.width*a),d=Math.ceil(t.height*a);return this.renderer.renderTarget.copyToTexture(e,n,{x:i,y:o},{width:u,height:d},{x:0,y:0}),n}applyFilter(e,t,r,a){const n=this.renderer,i=this._activeFilterData,o=i.outputRenderSurface,u=this._filterGlobalUniforms,d=u.uniforms,h=d.uOutputFrame,l=d.uInputSize,c=d.uInputPixel,f=d.uInputClamp,x=d.uGlobalFrame,m=d.uOutputTexture;o===r?(h[0]=i.outputOffset.x,h[1]=i.outputOffset.y):(h[0]=0,h[1]=0),h[2]=t.frame.width,h[3]=t.frame.height,l[0]=t.source.width,l[1]=t.source.height,l[2]=1/l[0],l[3]=1/l[1],c[0]=t.source.pixelWidth,c[1]=t.source.pixelHeight,c[2]=1/c[0],c[3]=1/c[1],f[0]=.5*c[2],f[1]=.5*c[3],f[2]=t.frame.width*l[2]-.5*c[2],f[3]=t.frame.height*l[3]-.5*c[3],x[0]=i.globalFrame.x,x[1]=i.globalFrame.y,x[2]=i.globalFrame.width,x[3]=i.globalFrame.height,r instanceof w&&(r.source.resource=null);const g=this.renderer.renderTarget.getRenderTarget(r);if(n.renderTarget.bind(r,!!a),r instanceof w?(m[0]=r.frame.width,m[1]=r.frame.height):(m[0]=g.width,m[1]=g.height),m[2]=g.isRoot?-1:1,u.update(),n.renderPipes.uniformBatch){const _=n.renderPipes.uniformBatch.getUboResource(u);this._globalFilterBindGroup.setResource(_,0)}else this._globalFilterBindGroup.setResource(u,0);this._globalFilterBindGroup.setResource(t.source,1),this._globalFilterBindGroup.setResource(t.source.style,2),e.groups[0]=this._globalFilterBindGroup,n.encoder.draw({geometry:ut,shader:e,state:e._state,topology:"triangle-list"}),n.type===N.WEBGL&&n.renderTarget.finishRenderPass()}calculateSpriteMatrix(e,t){const r=this._activeFilterData,a=e.set(r.inputTexture._source.width,0,0,r.inputTexture._source.height,r.bounds.minX,r.bounds.minY),n=t.worldTransform.copyTo(T.shared),i=t.renderGroup||t.parentRenderGroup;return i&&i.cacheToLocalTransform&&n.prepend(i.cacheToLocalTransform),n.invert(),a.prepend(n),a.scale(1/t.texture.frame.width,1/t.texture.frame.height),a.translate(t.anchor.x,t.anchor.y),a}destroy(){}_applyFiltersToTexture(e,t){const r=e.inputTexture,a=e.bounds,n=e.filters;if(this._globalFilterBindGroup.setResource(r.source.style,2),this._globalFilterBindGroup.setResource(e.backTexture.source,3),n.length===1)n[0].apply(this,r,e.outputRenderSurface,t);else{let i=e.inputTexture;const o=y.getOptimalTexture(a.width,a.height,i.source._resolution,!1);let u=o,d=0;for(d=0;d<n.length-1;++d){n[d].apply(this,i,u,!0);const l=i;i=u,u=l}n[d].apply(this,i,e.outputRenderSurface,t),y.returnTexture(o)}}_calculateFilterBounds(e,t,r,a,n){var m;const i=this.renderer,o=e.bounds,u=e.filters;let d=1/0,h=0,l=!0,c=!1,f=!1,x=!0;for(let g=0;g<u.length;g++){const _=u[g];if(d=Math.min(d,_.resolution==="inherit"?a:_.resolution),h+=_.padding,_.antialias==="off"?l=!1:_.antialias==="inherit"&&l&&(l=r),_.clipToViewport||(x=!1),!!!(_.compatibleRenderers&i.type)){f=!1;break}if(_.blendRequired&&!(((m=i.backBuffer)==null?void 0:m.useBackBuffer)??!0)){G("Blend filter requires backBuffer on WebGL renderer to be enabled. Set `useBackBuffer: true` in the renderer options."),f=!1;break}f=_.enabled||f,c||(c=_.blendRequired)}if(!f){e.skip=!0;return}if(x&&o.fitBounds(0,t.width/a,0,t.height/a),o.scale(d).ceil().scale(1/d).pad((h|0)*n),!o.isPositive){e.skip=!0;return}e.antialias=l,e.resolution=d,e.blendRequired=c}_popFilterData(){return this._filterStackIndex--,this._filterStack[this._filterStackIndex]}_getPreviousFilterData(){let e,t=this._filterStackIndex-1;for(;t>1&&(t--,e=this._filterStack[t],!!e.skip););return e}_pushFilterData(){let e=this._filterStack[this._filterStackIndex];return e||(e=this._filterStack[this._filterStackIndex]=new lt),this._filterStackIndex++,e}}Te.extension={type:[p.WebGLSystem,p.WebGPUSystem],name:"filter"};const we=class Pe extends X{constructor(...e){let t=e[0]??{};t instanceof Float32Array&&(R(fe,"use new MeshGeometry({ positions, uvs, indices }) instead"),t={positions:t,uvs:e[1],indices:e[2]}),t={...Pe.defaultOptions,...t};const r=t.positions||new Float32Array([0,0,1,0,1,1,0,1]);let a=t.uvs;a||(t.positions?a=new Float32Array(r.length):a=new Float32Array([0,0,1,0,1,1,0,1]));const n=t.indices||new Uint32Array([0,1,2,0,2,3]),i=t.shrinkBuffersToFit,o=new U({data:r,label:"attribute-mesh-positions",shrinkToFit:i,usage:v.VERTEX|v.COPY_DST}),u=new U({data:a,label:"attribute-mesh-uvs",shrinkToFit:i,usage:v.VERTEX|v.COPY_DST}),d=new U({data:n,label:"index-mesh-buffer",shrinkToFit:i,usage:v.INDEX|v.COPY_DST});super({attributes:{aPosition:{buffer:o,format:"float32x2",stride:2*4,offset:0},aUV:{buffer:u,format:"float32x2",stride:2*4,offset:0}},indexBuffer:d,topology:t.topology}),this.batchMode="auto"}get positions(){return this.attributes.aPosition.buffer.data}set positions(e){this.attributes.aPosition.buffer.data=e}get uvs(){return this.attributes.aUV.buffer.data}set uvs(e){this.attributes.aUV.buffer.data=e}get indices(){return this.indexBuffer.data}set indices(e){this.indexBuffer.data=e}};we.defaultOptions={topology:"triangle-list",shrinkBuffersToFit:!1};let Q=we;function dt(s){const e=s._stroke,t=s._fill,a=[`div { ${[`color: ${C.shared.setValue(t.color).toHex()}`,`font-size: ${s.fontSize}px`,`font-family: ${s.fontFamily}`,`font-weight: ${s.fontWeight}`,`font-style: ${s.fontStyle}`,`font-variant: ${s.fontVariant}`,`letter-spacing: ${s.letterSpacing}px`,`text-align: ${s.align}`,`padding: ${s.padding}px`,`white-space: ${s.whiteSpace==="pre"&&s.wordWrap?"pre-wrap":s.whiteSpace}`,...s.lineHeight?[`line-height: ${s.lineHeight}px`]:[],...s.wordWrap?[`word-wrap: ${s.breakWords?"break-all":"break-word"}`,`max-width: ${s.wordWrapWidth}px`]:[],...e?[Ce(e)]:[],...s.dropShadow?[Se(s.dropShadow)]:[],...s.cssOverrides].join(";")} }`];return ct(s.tagStyles,a),a.join(" ")}function Se(s){const e=C.shared.setValue(s.color).setAlpha(s.alpha).toHexa(),t=Math.round(Math.cos(s.angle)*s.distance),r=Math.round(Math.sin(s.angle)*s.distance),a=`${t}px ${r}px`;return s.blur>0?`text-shadow: ${a} ${s.blur}px ${e}`:`text-shadow: ${a} ${e}`}function Ce(s){return[`-webkit-text-stroke-width: ${s.width}px`,`-webkit-text-stroke-color: ${C.shared.setValue(s.color).toHex()}`,`text-stroke-width: ${s.width}px`,`text-stroke-color: ${C.shared.setValue(s.color).toHex()}`,"paint-order: stroke"].join(";")}const ee={fontSize:"font-size: {{VALUE}}px",fontFamily:"font-family: {{VALUE}}",fontWeight:"font-weight: {{VALUE}}",fontStyle:"font-style: {{VALUE}}",fontVariant:"font-variant: {{VALUE}}",letterSpacing:"letter-spacing: {{VALUE}}px",align:"text-align: {{VALUE}}",padding:"padding: {{VALUE}}px",whiteSpace:"white-space: {{VALUE}}",lineHeight:"line-height: {{VALUE}}px",wordWrapWidth:"max-width: {{VALUE}}px"},te={fill:s=>`color: ${C.shared.setValue(s).toHex()}`,breakWords:s=>`word-wrap: ${s?"break-all":"break-word"}`,stroke:Ce,dropShadow:Se};function ct(s,e){for(const t in s){const r=s[t],a=[];for(const n in r)te[n]?a.push(te[n](r[n])):ee[n]&&a.push(ee[n].replace("{{VALUE}}",r[n]));e.push(`${t} { ${a.join(";")} }`)}}class K extends L{constructor(e={}){super(e),this._cssOverrides=[],this.cssOverrides=e.cssOverrides??[],this.tagStyles=e.tagStyles??{}}set cssOverrides(e){this._cssOverrides=e instanceof Array?e:[e],this.update()}get cssOverrides(){return this._cssOverrides}update(){this._cssStyle=null,super.update()}clone(){return new K({align:this.align,breakWords:this.breakWords,dropShadow:this.dropShadow?{...this.dropShadow}:null,fill:this._fill,fontFamily:this.fontFamily,fontSize:this.fontSize,fontStyle:this.fontStyle,fontVariant:this.fontVariant,fontWeight:this.fontWeight,letterSpacing:this.letterSpacing,lineHeight:this.lineHeight,padding:this.padding,stroke:this._stroke,whiteSpace:this.whiteSpace,wordWrap:this.wordWrap,wordWrapWidth:this.wordWrapWidth,cssOverrides:this.cssOverrides,tagStyles:{...this.tagStyles}})}get cssStyle(){return this._cssStyle||(this._cssStyle=dt(this)),this._cssStyle}addOverride(...e){const t=e.filter(r=>!this.cssOverrides.includes(r));t.length>0&&(this.cssOverrides.push(...t),this.update())}removeOverride(...e){const t=e.filter(r=>this.cssOverrides.includes(r));t.length>0&&(this.cssOverrides=this.cssOverrides.filter(r=>!t.includes(r)),this.update())}set fill(e){typeof e!="string"&&typeof e!="number"&&G("[HTMLTextStyle] only color fill is not supported by HTMLText"),super.fill=e}set stroke(e){e&&typeof e!="string"&&typeof e!="number"&&G("[HTMLTextStyle] only color stroke is not supported by HTMLText"),super.stroke=e}}const re="http://www.w3.org/2000/svg",ae="http://www.w3.org/1999/xhtml";class Ue{constructor(){this.svgRoot=document.createElementNS(re,"svg"),this.foreignObject=document.createElementNS(re,"foreignObject"),this.domElement=document.createElementNS(ae,"div"),this.styleElement=document.createElementNS(ae,"style"),this.image=new Image;const{foreignObject:e,svgRoot:t,styleElement:r,domElement:a}=this;e.setAttribute("width","10000"),e.setAttribute("height","10000"),e.style.overflow="hidden",t.appendChild(e),e.appendChild(r),e.appendChild(a)}}let se;function ht(s,e,t,r){r||(r=se||(se=new Ue));const{domElement:a,styleElement:n,svgRoot:i}=r;a.innerHTML=`<style>${e.cssStyle};</style><div style='padding:0'>${s}</div>`,a.setAttribute("style","transform-origin: top left; display: inline-block"),t&&(n.textContent=t),document.body.appendChild(i);const o=a.getBoundingClientRect();i.remove();const u=e.padding*2;return{width:o.width-u,height:o.height-u}}class ft{constructor(){this.batches=[],this.batched=!1}destroy(){this.batches.forEach(e=>{D.return(e)}),this.batches.length=0}}class Be{constructor(e,t){this.state=A.for2d(),this.renderer=e,this._adaptor=t,this.renderer.runners.contextChange.add(this)}contextChange(){this._adaptor.contextChange(this.renderer)}validateRenderable(e){const t=e.context,r=!!e._gpuData,a=this.renderer.graphicsContext.updateGpuContext(t);return!!(a.isBatchable||r!==a.isBatchable)}addRenderable(e,t){const r=this.renderer.graphicsContext.updateGpuContext(e.context);e.didViewUpdate&&this._rebuild(e),r.isBatchable?this._addToBatcher(e,t):(this.renderer.renderPipes.batch.break(t),t.add(e))}updateRenderable(e){const r=this._getGpuDataForRenderable(e).batches;for(let a=0;a<r.length;a++){const n=r[a];n._batcher.updateElement(n)}}execute(e){if(!e.isRenderable)return;const t=this.renderer,r=e.context;if(!t.graphicsContext.getGpuContext(r).batches.length)return;const n=r.customShader||this._adaptor.shader;this.state.blendMode=e.groupBlendMode;const i=n.resources.localUniforms.uniforms;i.uTransformMatrix=e.groupTransform,i.uRound=t._roundPixels|e._roundPixels,k(e.groupColorAlpha,i.uColor,0),this._adaptor.execute(this,e)}_rebuild(e){const t=this._getGpuDataForRenderable(e),r=this.renderer.graphicsContext.updateGpuContext(e.context);t.destroy(),r.isBatchable&&this._updateBatchesForRenderable(e,t)}_addToBatcher(e,t){const r=this.renderer.renderPipes.batch,a=this._getGpuDataForRenderable(e).batches;for(let n=0;n<a.length;n++){const i=a[n];r.addToBatch(i,t)}}_getGpuDataForRenderable(e){return e._gpuData[this.renderer.uid]||this._initGpuDataForRenderable(e)}_initGpuDataForRenderable(e){const t=new ft;return e._gpuData[this.renderer.uid]=t,t}_updateBatchesForRenderable(e,t){const r=e.context,a=this.renderer.graphicsContext.getGpuContext(r),n=this.renderer._roundPixels|e._roundPixels;t.batches=a.batches.map(i=>{const o=D.get(Ye);return i.copyTo(o),o.renderable=e,o.roundPixels=n,o})}destroy(){this.renderer=null,this._adaptor.destroy(),this._adaptor=null,this.state=null}}Be.extension={type:[p.WebGLPipes,p.WebGPUPipes,p.CanvasPipes],name:"graphics"};const Me=class Fe extends Q{constructor(...e){super({});let t=e[0]??{};typeof t=="number"&&(R(fe,"PlaneGeometry constructor changed please use { width, height, verticesX, verticesY } instead"),t={width:t,height:e[1],verticesX:e[2],verticesY:e[3]}),this.build(t)}build(e){e={...Fe.defaultOptions,...e},this.verticesX=this.verticesX??e.verticesX,this.verticesY=this.verticesY??e.verticesY,this.width=this.width??e.width,this.height=this.height??e.height;const t=this.verticesX*this.verticesY,r=[],a=[],n=[],i=this.verticesX-1,o=this.verticesY-1,u=this.width/i,d=this.height/o;for(let l=0;l<t;l++){const c=l%this.verticesX,f=l/this.verticesX|0;r.push(c*u,f*d),a.push(c/i,f/o)}const h=i*o;for(let l=0;l<h;l++){const c=l%i,f=l/i|0,x=f*this.verticesX+c,m=f*this.verticesX+c+1,g=(f+1)*this.verticesX+c,_=(f+1)*this.verticesX+c+1;n.push(x,m,g,m,_,g)}this.buffers[0].data=new Float32Array(r),this.buffers[1].data=new Float32Array(a),this.indexBuffer.data=new Uint32Array(n),this.buffers[0].update(),this.buffers[1].update(),this.indexBuffer.update()}};Me.defaultOptions={width:100,height:100,verticesX:10,verticesY:10};let pt=Me;class J{constructor(){this.batcherName="default",this.packAsQuad=!1,this.indexOffset=0,this.attributeOffset=0,this.roundPixels=0,this._batcher=null,this._batch=null,this._textureMatrixUpdateId=-1,this._uvUpdateId=-1}get blendMode(){return this.renderable.groupBlendMode}get topology(){return this._topology||this.geometry.topology}set topology(e){this._topology=e}reset(){this.renderable=null,this.texture=null,this._batcher=null,this._batch=null,this.geometry=null,this._uvUpdateId=-1,this._textureMatrixUpdateId=-1}setTexture(e){this.texture!==e&&(this.texture=e,this._textureMatrixUpdateId=-1)}get uvs(){const t=this.geometry.getBuffer("aUV"),r=t.data;let a=r;const n=this.texture.textureMatrix;return n.isSimple||(a=this._transformedUvs,(this._textureMatrixUpdateId!==n._updateID||this._uvUpdateId!==t._updateID)&&((!a||a.length<r.length)&&(a=this._transformedUvs=new Float32Array(r.length)),this._textureMatrixUpdateId=n._updateID,this._uvUpdateId=t._updateID,n.multiplyUvs(r,a))),a}get positions(){return this.geometry.positions}get indices(){return this.geometry.indices}get color(){return this.renderable.groupColorAlpha}get groupTransform(){return this.renderable.groupTransform}get attributeSize(){return this.geometry.positions.length/2}get indexSize(){return this.geometry.indices.length}}class ne{destroy(){}}class Ge{constructor(e,t){this.localUniforms=new S({uTransformMatrix:{value:new T,type:"mat3x3<f32>"},uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uRound:{value:0,type:"f32"}}),this.localUniformsBindGroup=new ce({0:this.localUniforms}),this.renderer=e,this._adaptor=t,this._adaptor.init()}validateRenderable(e){const t=this._getMeshData(e),r=t.batched,a=e.batched;if(t.batched=a,r!==a)return!0;if(a){const n=e._geometry;if(n.indices.length!==t.indexSize||n.positions.length!==t.vertexSize)return t.indexSize=n.indices.length,t.vertexSize=n.positions.length,!0;const i=this._getBatchableMesh(e);return i.texture.uid!==e._texture.uid&&(i._textureMatrixUpdateId=-1),!i._batcher.checkAndUpdateTexture(i,e._texture)}return!1}addRenderable(e,t){const r=this.renderer.renderPipes.batch,{batched:a}=this._getMeshData(e);if(a){const n=this._getBatchableMesh(e);n.setTexture(e._texture),n.geometry=e._geometry,r.addToBatch(n,t)}else r.break(t),t.add(e)}updateRenderable(e){if(e.batched){const t=this._getBatchableMesh(e);t.setTexture(e._texture),t.geometry=e._geometry,t._batcher.updateElement(t)}}execute(e){if(!e.isRenderable)return;e.state.blendMode=j(e.groupBlendMode,e.texture._source);const t=this.localUniforms;t.uniforms.uTransformMatrix=e.groupTransform,t.uniforms.uRound=this.renderer._roundPixels|e._roundPixels,t.update(),k(e.groupColorAlpha,t.uniforms.uColor,0),this._adaptor.execute(this,e)}_getMeshData(e){var t,r;return(t=e._gpuData)[r=this.renderer.uid]||(t[r]=new ne),e._gpuData[this.renderer.uid].meshData||this._initMeshData(e)}_initMeshData(e){var t,r;return e._gpuData[this.renderer.uid].meshData={batched:e.batched,indexSize:(t=e._geometry.indices)==null?void 0:t.length,vertexSize:(r=e._geometry.positions)==null?void 0:r.length},e._gpuData[this.renderer.uid].meshData}_getBatchableMesh(e){var t,r;return(t=e._gpuData)[r=this.renderer.uid]||(t[r]=new ne),e._gpuData[this.renderer.uid].batchableMesh||this._initBatchableMesh(e)}_initBatchableMesh(e){const t=new J;return t.renderable=e,t.setTexture(e._texture),t.transform=e.groupTransform,t.roundPixels=this.renderer._roundPixels|e._roundPixels,e._gpuData[this.renderer.uid].batchableMesh=t,t}destroy(){this.localUniforms=null,this.localUniformsBindGroup=null,this._adaptor.destroy(),this._adaptor=null,this.renderer=null}}Ge.extension={type:[p.WebGLPipes,p.WebGPUPipes,p.CanvasPipes],name:"mesh"};class mt{execute(e,t){const r=e.state,a=e.renderer,n=t.shader||e.defaultShader;n.resources.uTexture=t.texture._source,n.resources.uniforms=e.localUniforms;const i=a.gl,o=e.getBuffers(t);a.shader.bind(n),a.state.set(r),a.geometry.bind(o.geometry,n.glProgram);const d=o.geometry.indexBuffer.data.BYTES_PER_ELEMENT===2?i.UNSIGNED_SHORT:i.UNSIGNED_INT;i.drawElements(i.TRIANGLES,t.particleChildren.length*6,d,0)}}class gt{execute(e,t){const r=e.renderer,a=t.shader||e.defaultShader;a.groups[0]=r.renderPipes.uniformBatch.getUniformBindGroup(e.localUniforms,!0),a.groups[1]=r.texture.getTextureBindGroup(t.texture);const n=e.state,i=e.getBuffers(t);r.encoder.draw({geometry:i.geometry,shader:t.shader||e.defaultShader,state:n,size:t.particleChildren.length*6})}}function ie(s,e=null){const t=s*6;if(t>65535?e||(e=new Uint32Array(t)):e||(e=new Uint16Array(t)),e.length!==t)throw new Error(`Out buffer length is incorrect, got ${e.length} and expected ${t}`);for(let r=0,a=0;r<t;r+=6,a+=4)e[r+0]=a+0,e[r+1]=a+1,e[r+2]=a+2,e[r+3]=a+0,e[r+4]=a+2,e[r+5]=a+3;return e}function xt(s){return{dynamicUpdate:oe(s,!0),staticUpdate:oe(s,!1)}}function oe(s,e){const t=[];t.push(`

        var index = 0;

        for (let i = 0; i < ps.length; ++i)
        {
            const p = ps[i];

            `);let r=0;for(const n in s){const i=s[n];if(e!==i.dynamic)continue;t.push(`offset = index + ${r}`),t.push(i.code);const o=H(i.format);r+=o.stride/4}t.push(`
            index += stride * 4;
        }
    `),t.unshift(`
        var stride = ${r};
    `);const a=t.join(`
`);return new Function("ps","f32v","u32v",a)}class _t{constructor(e){this._size=0,this._generateParticleUpdateCache={};const t=this._size=e.size??1e3,r=e.properties;let a=0,n=0;for(const h in r){const l=r[h],c=H(l.format);l.dynamic?n+=c.stride:a+=c.stride}this._dynamicStride=n/4,this._staticStride=a/4,this.staticAttributeBuffer=new B(t*4*a),this.dynamicAttributeBuffer=new B(t*4*n),this.indexBuffer=ie(t);const i=new X;let o=0,u=0;this._staticBuffer=new U({data:new Float32Array(1),label:"static-particle-buffer",shrinkToFit:!1,usage:v.VERTEX|v.COPY_DST}),this._dynamicBuffer=new U({data:new Float32Array(1),label:"dynamic-particle-buffer",shrinkToFit:!1,usage:v.VERTEX|v.COPY_DST});for(const h in r){const l=r[h],c=H(l.format);l.dynamic?(i.addAttribute(l.attributeName,{buffer:this._dynamicBuffer,stride:this._dynamicStride*4,offset:o*4,format:l.format}),o+=c.size):(i.addAttribute(l.attributeName,{buffer:this._staticBuffer,stride:this._staticStride*4,offset:u*4,format:l.format}),u+=c.size)}i.addIndex(this.indexBuffer);const d=this.getParticleUpdate(r);this._dynamicUpload=d.dynamicUpdate,this._staticUpload=d.staticUpdate,this.geometry=i}getParticleUpdate(e){const t=bt(e);return this._generateParticleUpdateCache[t]?this._generateParticleUpdateCache[t]:(this._generateParticleUpdateCache[t]=this.generateParticleUpdate(e),this._generateParticleUpdateCache[t])}generateParticleUpdate(e){return xt(e)}update(e,t){e.length>this._size&&(t=!0,this._size=Math.max(e.length,this._size*1.5|0),this.staticAttributeBuffer=new B(this._size*this._staticStride*4*4),this.dynamicAttributeBuffer=new B(this._size*this._dynamicStride*4*4),this.indexBuffer=ie(this._size),this.geometry.indexBuffer.setDataWithSize(this.indexBuffer,this.indexBuffer.byteLength,!0));const r=this.dynamicAttributeBuffer;if(this._dynamicUpload(e,r.float32View,r.uint32View),this._dynamicBuffer.setDataWithSize(this.dynamicAttributeBuffer.float32View,e.length*this._dynamicStride*4,!0),t){const a=this.staticAttributeBuffer;this._staticUpload(e,a.float32View,a.uint32View),this._staticBuffer.setDataWithSize(a.float32View,e.length*this._staticStride*4,!0)}}destroy(){this._staticBuffer.destroy(),this._dynamicBuffer.destroy(),this.geometry.destroy()}}function bt(s){const e=[];for(const t in s){const r=s[t];e.push(t,r.code,r.dynamic?"d":"s")}return e.join("_")}var yt=`varying vec2 vUV;
varying vec4 vColor;

uniform sampler2D uTexture;

void main(void){
    vec4 color = texture2D(uTexture, vUV) * vColor;
    gl_FragColor = color;
}`,vt=`attribute vec2 aVertex;
attribute vec2 aUV;
attribute vec4 aColor;

attribute vec2 aPosition;
attribute float aRotation;

uniform mat3 uTranslationMatrix;
uniform float uRound;
uniform vec2 uResolution;
uniform vec4 uColor;

varying vec2 vUV;
varying vec4 vColor;

vec2 roundPixels(vec2 position, vec2 targetSize)
{       
    return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
}

void main(void){
    float cosRotation = cos(aRotation);
    float sinRotation = sin(aRotation);
    float x = aVertex.x * cosRotation - aVertex.y * sinRotation;
    float y = aVertex.x * sinRotation + aVertex.y * cosRotation;

    vec2 v = vec2(x, y);
    v = v + aPosition;

    gl_Position = vec4((uTranslationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

    if(uRound == 1.0)
    {
        gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
    }

    vUV = aUV;
    vColor = vec4(aColor.rgb * aColor.a, aColor.a) * uColor;
}
`,ue=`
struct ParticleUniforms {
  uProjectionMatrix:mat3x3<f32>,
  uColor:vec4<f32>,
  uResolution:vec2<f32>,
  uRoundPixels:f32,
};

@group(0) @binding(0) var<uniform> uniforms: ParticleUniforms;

@group(1) @binding(0) var uTexture: texture_2d<f32>;
@group(1) @binding(1) var uSampler : sampler;

struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>,
    @location(1) color : vec4<f32>,
  };
@vertex
fn mainVertex(
  @location(0) aVertex: vec2<f32>,
  @location(1) aPosition: vec2<f32>,
  @location(2) aUV: vec2<f32>,
  @location(3) aColor: vec4<f32>,
  @location(4) aRotation: f32,
) -> VSOutput {
  
   let v = vec2(
       aVertex.x * cos(aRotation) - aVertex.y * sin(aRotation),
       aVertex.x * sin(aRotation) + aVertex.y * cos(aRotation)
   ) + aPosition;

   let position = vec4((uniforms.uProjectionMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

    let vColor = vec4(aColor.rgb * aColor.a, aColor.a) * uniforms.uColor;

  return VSOutput(
   position,
   aUV,
   vColor,
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
  @location(1) color: vec4<f32>,
  @builtin(position) position: vec4<f32>,
) -> @location(0) vec4<f32> {

    var sample = textureSample(uTexture, uSampler, uv) * color;
   
    return sample;
}`;class Tt extends q{constructor(){const e=Xe.from({vertex:vt,fragment:yt}),t=Ne.from({fragment:{source:ue,entryPoint:"mainFragment"},vertex:{source:ue,entryPoint:"mainVertex"}});super({glProgram:e,gpuProgram:t,resources:{uTexture:w.WHITE.source,uSampler:new I({}),uniforms:{uTranslationMatrix:{value:new T,type:"mat3x3<f32>"},uColor:{value:new C(16777215),type:"vec4<f32>"},uRound:{value:1,type:"f32"},uResolution:{value:[0,0],type:"vec2<f32>"}}}})}}class Re{constructor(e,t){this.state=A.for2d(),this.localUniforms=new S({uTranslationMatrix:{value:new T,type:"mat3x3<f32>"},uColor:{value:new Float32Array(4),type:"vec4<f32>"},uRound:{value:1,type:"f32"},uResolution:{value:[0,0],type:"vec2<f32>"}}),this.renderer=e,this.adaptor=t,this.defaultShader=new Tt,this.state=A.for2d()}validateRenderable(e){return!1}addRenderable(e,t){this.renderer.renderPipes.batch.break(t),t.add(e)}getBuffers(e){return e._gpuData[this.renderer.uid]||this._initBuffer(e)}_initBuffer(e){return e._gpuData[this.renderer.uid]=new _t({size:e.particleChildren.length,properties:e._properties}),e._gpuData[this.renderer.uid]}updateRenderable(e){}execute(e){const t=e.particleChildren;if(t.length===0)return;const r=this.renderer,a=this.getBuffers(e);e.texture||(e.texture=t[0].texture);const n=this.state;a.update(t,e._childrenDirty),e._childrenDirty=!1,n.blendMode=j(e.blendMode,e.texture._source);const i=this.localUniforms.uniforms,o=i.uTranslationMatrix;e.worldTransform.copyTo(o),o.prepend(r.globalUniforms.globalUniformData.projectionMatrix),i.uResolution=r.globalUniforms.globalUniformData.resolution,i.uRound=r._roundPixels|e._roundPixels,k(e.groupColorAlpha,i.uColor,0),this.adaptor.execute(this,e)}destroy(){this.defaultShader&&(this.defaultShader.destroy(),this.defaultShader=null)}}class De extends Re{constructor(e){super(e,new mt)}}De.extension={type:[p.WebGLPipes],name:"particle"};class Ae extends Re{constructor(e){super(e,new gt)}}Ae.extension={type:[p.WebGPUPipes],name:"particle"};const ke=class Ve extends pt{constructor(e={}){e={...Ve.defaultOptions,...e},super({width:e.width,height:e.height,verticesX:4,verticesY:4}),this.update(e)}update(e){var t,r;this.width=e.width??this.width,this.height=e.height??this.height,this._originalWidth=e.originalWidth??this._originalWidth,this._originalHeight=e.originalHeight??this._originalHeight,this._leftWidth=e.leftWidth??this._leftWidth,this._rightWidth=e.rightWidth??this._rightWidth,this._topHeight=e.topHeight??this._topHeight,this._bottomHeight=e.bottomHeight??this._bottomHeight,this._anchorX=(t=e.anchor)==null?void 0:t.x,this._anchorY=(r=e.anchor)==null?void 0:r.y,this.updateUvs(),this.updatePositions()}updatePositions(){const e=this.positions,{width:t,height:r,_leftWidth:a,_rightWidth:n,_topHeight:i,_bottomHeight:o,_anchorX:u,_anchorY:d}=this,h=a+n,l=t>h?1:t/h,c=i+o,f=r>c?1:r/c,x=Math.min(l,f),m=u*t,g=d*r;e[0]=e[8]=e[16]=e[24]=-m,e[2]=e[10]=e[18]=e[26]=a*x-m,e[4]=e[12]=e[20]=e[28]=t-n*x-m,e[6]=e[14]=e[22]=e[30]=t-m,e[1]=e[3]=e[5]=e[7]=-g,e[9]=e[11]=e[13]=e[15]=i*x-g,e[17]=e[19]=e[21]=e[23]=r-o*x-g,e[25]=e[27]=e[29]=e[31]=r-g,this.getBuffer("aPosition").update()}updateUvs(){const e=this.uvs;e[0]=e[8]=e[16]=e[24]=0,e[1]=e[3]=e[5]=e[7]=0,e[6]=e[14]=e[22]=e[30]=1,e[25]=e[27]=e[29]=e[31]=1;const t=1/this._originalWidth,r=1/this._originalHeight;e[2]=e[10]=e[18]=e[26]=t*this._leftWidth,e[9]=e[11]=e[13]=e[15]=r*this._topHeight,e[4]=e[12]=e[20]=e[28]=1-t*this._rightWidth,e[17]=e[19]=e[21]=e[23]=1-r*this._bottomHeight,this.getBuffer("aUV").update()}};ke.defaultOptions={width:100,height:100,leftWidth:10,topHeight:10,rightWidth:10,bottomHeight:10,originalWidth:100,originalHeight:100};let wt=ke;class Pt extends J{constructor(){super(),this.geometry=new wt}destroy(){this.geometry.destroy()}}class We{constructor(e){this._renderer=e}addRenderable(e,t){const r=this._getGpuSprite(e);e.didViewUpdate&&this._updateBatchableSprite(e,r),this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuSprite(e);e.didViewUpdate&&this._updateBatchableSprite(e,t),t._batcher.updateElement(t)}validateRenderable(e){const t=this._getGpuSprite(e);return!t._batcher.checkAndUpdateTexture(t,e._texture)}_updateBatchableSprite(e,t){t.geometry.update(e),t.setTexture(e._texture)}_getGpuSprite(e){return e._gpuData[this._renderer.uid]||this._initGPUSprite(e)}_initGPUSprite(e){const t=e._gpuData[this._renderer.uid]=new Pt,r=t;return r.renderable=e,r.transform=e.groupTransform,r.texture=e._texture,r.roundPixels=this._renderer._roundPixels|e._roundPixels,e.didViewUpdate||this._updateBatchableSprite(e,r),t}destroy(){this._renderer=null}}We.extension={type:[p.WebGLPipes,p.WebGPUPipes,p.CanvasPipes],name:"nineSliceSprite"};const St={name:"tiling-bit",vertex:{header:`
            struct TilingUniforms {
                uMapCoord:mat3x3<f32>,
                uClampFrame:vec4<f32>,
                uClampOffset:vec2<f32>,
                uTextureTransform:mat3x3<f32>,
                uSizeAnchor:vec4<f32>
            };

            @group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
            @group(2) @binding(1) var uTexture: texture_2d<f32>;
            @group(2) @binding(2) var uSampler: sampler;
        `,main:`
            uv = (tilingUniforms.uTextureTransform * vec3(uv, 1.0)).xy;

            position = (position - tilingUniforms.uSizeAnchor.zw) * tilingUniforms.uSizeAnchor.xy;
        `},fragment:{header:`
            struct TilingUniforms {
                uMapCoord:mat3x3<f32>,
                uClampFrame:vec4<f32>,
                uClampOffset:vec2<f32>,
                uTextureTransform:mat3x3<f32>,
                uSizeAnchor:vec4<f32>
            };

            @group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
            @group(2) @binding(1) var uTexture: texture_2d<f32>;
            @group(2) @binding(2) var uSampler: sampler;
        `,main:`

            var coord = vUV + ceil(tilingUniforms.uClampOffset - vUV);
            coord = (tilingUniforms.uMapCoord * vec3(coord, 1.0)).xy;
            var unclamped = coord;
            coord = clamp(coord, tilingUniforms.uClampFrame.xy, tilingUniforms.uClampFrame.zw);

            var bias = 0.;

            if(unclamped.x == coord.x && unclamped.y == coord.y)
            {
                bias = -32.;
            }

            outColor = textureSampleBias(uTexture, uSampler, coord, bias);
        `}},Ct={name:"tiling-bit",vertex:{header:`
            uniform mat3 uTextureTransform;
            uniform vec4 uSizeAnchor;

        `,main:`
            uv = (uTextureTransform * vec3(aUV, 1.0)).xy;

            position = (position - uSizeAnchor.zw) * uSizeAnchor.xy;
        `},fragment:{header:`
            uniform sampler2D uTexture;
            uniform mat3 uMapCoord;
            uniform vec4 uClampFrame;
            uniform vec2 uClampOffset;
        `,main:`

        vec2 coord = vUV + ceil(uClampOffset - vUV);
        coord = (uMapCoord * vec3(coord, 1.0)).xy;
        vec2 unclamped = coord;
        coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);

        outColor = texture(uTexture, coord, unclamped == coord ? 0.0 : -32.0);// lod-bias very negative to force lod 0

        `}};let W,O;class Ut extends q{constructor(){W??(W=pe({name:"tiling-sprite-shader",bits:[nt,St,me]})),O??(O=ge({name:"tiling-sprite-shader",bits:[it,Ct,xe]}));const e=new S({uMapCoord:{value:new T,type:"mat3x3<f32>"},uClampFrame:{value:new Float32Array([0,0,1,1]),type:"vec4<f32>"},uClampOffset:{value:new Float32Array([0,0]),type:"vec2<f32>"},uTextureTransform:{value:new T,type:"mat3x3<f32>"},uSizeAnchor:{value:new Float32Array([100,100,.5,.5]),type:"vec4<f32>"}});super({glProgram:O,gpuProgram:W,resources:{localUniforms:new S({uTransformMatrix:{value:new T,type:"mat3x3<f32>"},uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uRound:{value:0,type:"f32"}}),tilingUniforms:e,uTexture:w.EMPTY.source,uSampler:w.EMPTY.source.style}})}updateUniforms(e,t,r,a,n,i){const o=this.resources.tilingUniforms,u=i.width,d=i.height,h=i.textureMatrix,l=o.uniforms.uTextureTransform;l.set(r.a*u/e,r.b*u/t,r.c*d/e,r.d*d/t,r.tx/e,r.ty/t),l.invert(),o.uniforms.uMapCoord=h.mapCoord,o.uniforms.uClampFrame=h.uClampFrame,o.uniforms.uClampOffset=h.uClampOffset,o.uniforms.uTextureTransform=l,o.uniforms.uSizeAnchor[0]=e,o.uniforms.uSizeAnchor[1]=t,o.uniforms.uSizeAnchor[2]=a,o.uniforms.uSizeAnchor[3]=n,i&&(this.resources.uTexture=i.source,this.resources.uSampler=i.source.style)}}class Bt extends Q{constructor(){super({positions:new Float32Array([0,0,1,0,1,1,0,1]),uvs:new Float32Array([0,0,1,0,1,1,0,1]),indices:new Uint32Array([0,1,2,0,2,3])})}}function Mt(s,e){const t=s.anchor.x,r=s.anchor.y;e[0]=-t*s.width,e[1]=-r*s.height,e[2]=(1-t)*s.width,e[3]=-r*s.height,e[4]=(1-t)*s.width,e[5]=(1-r)*s.height,e[6]=-t*s.width,e[7]=(1-r)*s.height}function Ft(s,e,t,r){let a=0;const n=s.length/e,i=r.a,o=r.b,u=r.c,d=r.d,h=r.tx,l=r.ty;for(t*=e;a<n;){const c=s[t],f=s[t+1];s[t]=i*c+u*f+h,s[t+1]=o*c+d*f+l,t+=e,a++}}function Gt(s,e){const t=s.texture,r=t.frame.width,a=t.frame.height;let n=0,i=0;s.applyAnchorToTexture&&(n=s.anchor.x,i=s.anchor.y),e[0]=e[6]=-n,e[2]=e[4]=1-n,e[1]=e[3]=-i,e[5]=e[7]=1-i;const o=T.shared;o.copyFrom(s._tileTransform.matrix),o.tx/=s.width,o.ty/=s.height,o.invert(),o.scale(s.width/r,s.height/a),Ft(e,2,0,o)}const F=new Bt;class Rt{constructor(){this.canBatch=!0,this.geometry=new Q({indices:F.indices.slice(),positions:F.positions.slice(),uvs:F.uvs.slice()})}destroy(){var e;this.geometry.destroy(),(e=this.shader)==null||e.destroy()}}class Oe{constructor(e){this._state=A.default2d,this._renderer=e}validateRenderable(e){const t=this._getTilingSpriteData(e),r=t.canBatch;this._updateCanBatch(e);const a=t.canBatch;if(a&&a===r){const{batchableMesh:n}=t;return!n._batcher.checkAndUpdateTexture(n,e.texture)}return r!==a}addRenderable(e,t){const r=this._renderer.renderPipes.batch;this._updateCanBatch(e);const a=this._getTilingSpriteData(e),{geometry:n,canBatch:i}=a;if(i){a.batchableMesh||(a.batchableMesh=new J);const o=a.batchableMesh;e.didViewUpdate&&(this._updateBatchableMesh(e),o.geometry=n,o.renderable=e,o.transform=e.groupTransform,o.setTexture(e._texture)),o.roundPixels=this._renderer._roundPixels|e._roundPixels,r.addToBatch(o,t)}else r.break(t),a.shader||(a.shader=new Ut),this.updateRenderable(e),t.add(e)}execute(e){const{shader:t}=this._getTilingSpriteData(e);t.groups[0]=this._renderer.globalUniforms.bindGroup;const r=t.resources.localUniforms.uniforms;r.uTransformMatrix=e.groupTransform,r.uRound=this._renderer._roundPixels|e._roundPixels,k(e.groupColorAlpha,r.uColor,0),this._state.blendMode=j(e.groupBlendMode,e.texture._source),this._renderer.encoder.draw({geometry:F,shader:t,state:this._state})}updateRenderable(e){const t=this._getTilingSpriteData(e),{canBatch:r}=t;if(r){const{batchableMesh:a}=t;e.didViewUpdate&&this._updateBatchableMesh(e),a._batcher.updateElement(a)}else if(e.didViewUpdate){const{shader:a}=t;a.updateUniforms(e.width,e.height,e._tileTransform.matrix,e.anchor.x,e.anchor.y,e.texture)}}_getTilingSpriteData(e){return e._gpuData[this._renderer.uid]||this._initTilingSpriteData(e)}_initTilingSpriteData(e){const t=new Rt;return t.renderable=e,e._gpuData[this._renderer.uid]=t,t}_updateBatchableMesh(e){const t=this._getTilingSpriteData(e),{geometry:r}=t,a=e.texture.source.style;a.addressMode!=="repeat"&&(a.addressMode="repeat",a.update()),Gt(e,r.uvs),Mt(e,r.positions)}destroy(){this._renderer=null}_updateCanBatch(e){const t=this._getTilingSpriteData(e),r=e.texture;let a=!0;return this._renderer.type===N.WEBGL&&(a=this._renderer.context.supports.nonPowOf2wrapping),t.canBatch=r.textureMatrix.isSimple&&(a||r.source.isPowerOfTwo),t.canBatch}}Oe.extension={type:[p.WebGLPipes,p.WebGPUPipes,p.CanvasPipes],name:"tilingSprite"};const Dt={name:"local-uniform-msdf-bit",vertex:{header:`
            struct LocalUniforms {
                uColor:vec4<f32>,
                uTransformMatrix:mat3x3<f32>,
                uDistance: f32,
                uRound:f32,
            }

            @group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
        `,main:`
            vColor *= localUniforms.uColor;
            modelMatrix *= localUniforms.uTransformMatrix;
        `,end:`
            if(localUniforms.uRound == 1)
            {
                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
            }
        `},fragment:{header:`
            struct LocalUniforms {
                uColor:vec4<f32>,
                uTransformMatrix:mat3x3<f32>,
                uDistance: f32
            }

            @group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
         `,main:`
            outColor = vec4<f32>(calculateMSDFAlpha(outColor, localUniforms.uColor, localUniforms.uDistance));
        `}},At={name:"local-uniform-msdf-bit",vertex:{header:`
            uniform mat3 uTransformMatrix;
            uniform vec4 uColor;
            uniform float uRound;
        `,main:`
            vColor *= uColor;
            modelMatrix *= uTransformMatrix;
        `,end:`
            if(uRound == 1.)
            {
                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
            }
        `},fragment:{header:`
            uniform float uDistance;
         `,main:`
            outColor = vec4(calculateMSDFAlpha(outColor, vColor, uDistance));
        `}},kt={name:"msdf-bit",fragment:{header:`
            fn calculateMSDFAlpha(msdfColor:vec4<f32>, shapeColor:vec4<f32>, distance:f32) -> f32 {

                // MSDF
                var median = msdfColor.r + msdfColor.g + msdfColor.b -
                    min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
                    max(msdfColor.r, max(msdfColor.g, msdfColor.b));

                // SDF
                median = min(median, msdfColor.a);

                var screenPxDistance = distance * (median - 0.5);
                var alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);
                if (median < 0.01) {
                    alpha = 0.0;
                } else if (median > 0.99) {
                    alpha = 1.0;
                }

                // Gamma correction for coverage-like alpha
                var luma: f32 = dot(shapeColor.rgb, vec3<f32>(0.299, 0.587, 0.114));
                var gamma: f32 = mix(1.0, 1.0 / 2.2, luma);
                var coverage: f32 = pow(shapeColor.a * alpha, gamma);

                return coverage;

            }
        `}},Vt={name:"msdf-bit",fragment:{header:`
            float calculateMSDFAlpha(vec4 msdfColor, vec4 shapeColor, float distance) {

                // MSDF
                float median = msdfColor.r + msdfColor.g + msdfColor.b -
                                min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
                                max(msdfColor.r, max(msdfColor.g, msdfColor.b));

                // SDF
                median = min(median, msdfColor.a);

                float screenPxDistance = distance * (median - 0.5);
                float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);

                if (median < 0.01) {
                    alpha = 0.0;
                } else if (median > 0.99) {
                    alpha = 1.0;
                }

                // Gamma correction for coverage-like alpha
                float luma = dot(shapeColor.rgb, vec3(0.299, 0.587, 0.114));
                float gamma = mix(1.0, 1.0 / 2.2, luma);
                float coverage = pow(shapeColor.a * alpha, gamma);

                return coverage;
            }
        `}};let z,E;class Wt extends q{constructor(e){const t=new S({uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uTransformMatrix:{value:new T,type:"mat3x3<f32>"},uDistance:{value:4,type:"f32"},uRound:{value:0,type:"f32"}});z??(z=pe({name:"sdf-shader",bits:[je,qe(e),Dt,kt,me]})),E??(E=ge({name:"sdf-shader",bits:[Qe,Ke(e),At,Vt,xe]})),super({glProgram:E,gpuProgram:z,resources:{localUniforms:t,batchSamplers:Je(e)}})}}class Ot extends rt{destroy(){this.context.customShader&&this.context.customShader.destroy(),super.destroy()}}class ze{constructor(e){this._renderer=e,this._renderer.renderableGC.addManagedHash(this,"_gpuBitmapText")}validateRenderable(e){const t=this._getGpuBitmapText(e);return e._didTextUpdate&&(e._didTextUpdate=!1,this._updateContext(e,t)),this._renderer.renderPipes.graphics.validateRenderable(t)}addRenderable(e,t){const r=this._getGpuBitmapText(e);le(e,r),e._didTextUpdate&&(e._didTextUpdate=!1,this._updateContext(e,r)),this._renderer.renderPipes.graphics.addRenderable(r,t),r.context.customShader&&this._updateDistanceField(e)}updateRenderable(e){const t=this._getGpuBitmapText(e);le(e,t),this._renderer.renderPipes.graphics.updateRenderable(t),t.context.customShader&&this._updateDistanceField(e)}_updateContext(e,t){const{context:r}=t,a=Ze.getFont(e.text,e._style);r.clear(),a.distanceField.type!=="none"&&(r.customShader||(r.customShader=new Wt(this._renderer.limits.maxBatchableTextures)));const n=et.graphemeSegmenter(e.text),i=e._style;let o=a.baseLineOffset;const u=tt(n,i,a,!0);let d=0;const h=i.padding,l=u.scale;let c=u.width,f=u.height+u.offsetY;i._stroke&&(c+=i._stroke.width/l,f+=i._stroke.width/l),r.translate(-e._anchor._x*c-h,-e._anchor._y*f-h).scale(l,l);const x=a.applyFillAsTint?i._fill.color:16777215;for(let m=0;m<u.lines.length;m++){const g=u.lines[m];for(let _=0;_<g.charPositions.length;_++){const Z=n[d++],P=a.chars[Z];P!=null&&P.texture&&r.texture(P.texture,x||"black",Math.round(g.charPositions[_]+P.xOffset),Math.round(o+P.yOffset))}o+=a.lineHeight}}_getGpuBitmapText(e){return e._gpuData[this._renderer.uid]||this.initGpuText(e)}initGpuText(e){const t=new Ot;return e._gpuData[this._renderer.uid]=t,this._updateContext(e,t),t}_updateDistanceField(e){const t=this._getGpuBitmapText(e).context,r=e._style.fontFamily,a=$.get(`${r}-bitmap`),{a:n,b:i,c:o,d:u}=e.groupTransform,d=Math.sqrt(n*n+i*i),h=Math.sqrt(o*o+u*u),l=(Math.abs(d)+Math.abs(h))/2,c=a.baseRenderedFontSize/e._style.fontSize,f=l*a.distanceField.range*(1/c);t.customShader.resources.localUniforms.uniforms.uDistance=f}destroy(){this._renderer=null}}ze.extension={type:[p.WebGLPipes,p.WebGPUPipes,p.CanvasPipes],name:"bitmapText"};function le(s,e){e.groupTransform=s.groupTransform,e.groupColorAlpha=s.groupColorAlpha,e.groupColor=s.groupColor,e.groupBlendMode=s.groupBlendMode,e.globalDisplayStatus=s.globalDisplayStatus,e.groupTransform=s.groupTransform,e.localDisplayStatus=s.localDisplayStatus,e.groupAlpha=s.groupAlpha,e._roundPixels=s._roundPixels}class zt extends ye{constructor(e){super(),this.generatingTexture=!1,this._renderer=e,e.runners.resolutionChange.add(this)}resolutionChange(){const e=this.renderable;e._autoResolution&&e.onViewUpdate()}destroy(){this._renderer.htmlText.returnTexturePromise(this.texturePromise),this.texturePromise=null,this._renderer=null}}function Y(s,e){const{texture:t,bounds:r}=s;at(r,e._anchor,t);const a=e._style._getFinalPadding();r.minX-=a,r.minY-=a,r.maxX-=a,r.maxY-=a}class Ee{constructor(e){this._renderer=e}validateRenderable(e){return e._didTextUpdate}addRenderable(e,t){const r=this._getGpuText(e);e._didTextUpdate&&(this._updateGpuText(e).catch(a=>{console.error(a)}),e._didTextUpdate=!1,Y(r,e)),this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuText(e);t._batcher.updateElement(t)}async _updateGpuText(e){e._didTextUpdate=!1;const t=this._getGpuText(e);if(t.generatingTexture)return;t.texturePromise&&(this._renderer.htmlText.returnTexturePromise(t.texturePromise),t.texturePromise=null),t.generatingTexture=!0,e._resolution=e._autoResolution?this._renderer.resolution:e.resolution;const r=this._renderer.htmlText.getTexturePromise(e);t.texturePromise=r,t.texture=await r;const a=e.renderGroup||e.parentRenderGroup;a&&(a.structureDidChange=!0),t.generatingTexture=!1,Y(t,e)}_getGpuText(e){return e._gpuData[this._renderer.uid]||this.initGpuText(e)}initGpuText(e){const t=new zt(this._renderer);return t.renderable=e,t.transform=e.groupTransform,t.texture=w.EMPTY,t.bounds={minX:0,maxX:1,minY:0,maxY:0},t.roundPixels=this._renderer._roundPixels|e._roundPixels,e._resolution=e._autoResolution?this._renderer.resolution:e.resolution,e._gpuData[this._renderer.uid]=t,t}destroy(){this._renderer=null}}Ee.extension={type:[p.WebGLPipes,p.WebGPUPipes,p.CanvasPipes],name:"htmlText"};function Et(){const{userAgent:s}=_e.get().getNavigator();return/^((?!chrome|android).)*safari/i.test(s)}const Lt=new he;function Le(s,e,t,r){const a=Lt;a.minX=0,a.minY=0,a.maxX=s.width/r|0,a.maxY=s.height/r|0;const n=y.getOptimalTexture(a.width,a.height,r,!1);return n.source.uploadMethodId="image",n.source.resource=s,n.source.alphaMode="premultiply-alpha-on-upload",n.frame.width=e/r,n.frame.height=t/r,n.source.emit("update",n.source),n.updateUvs(),n}function Ht(s,e){const t=e.fontFamily,r=[],a={},n=/font-family:([^;"\s]+)/g,i=s.match(n);function o(u){a[u]||(r.push(u),a[u]=!0)}if(Array.isArray(t))for(let u=0;u<t.length;u++)o(t[u]);else o(t);i&&i.forEach(u=>{const d=u.split(":")[1].trim();o(d)});for(const u in e.tagStyles){const d=e.tagStyles[u].fontFamily;o(d)}return r}async function It(s){const t=await(await _e.get().fetch(s)).blob(),r=new FileReader;return await new Promise((n,i)=>{r.onloadend=()=>n(r.result),r.onerror=i,r.readAsDataURL(t)})}async function de(s,e){const t=await It(e);return`@font-face {
        font-family: "${s.fontFamily}";
        src: url('${t}');
        font-weight: ${s.fontWeight};
        font-style: ${s.fontStyle};
    }`}const M=new Map;async function $t(s,e,t){const r=s.filter(a=>$.has(`${a}-and-url`)).map((a,n)=>{if(!M.has(a)){const{url:i}=$.get(`${a}-and-url`);n===0?M.set(a,de({fontWeight:e.fontWeight,fontStyle:e.fontStyle,fontFamily:a},i)):M.set(a,de({fontWeight:t.fontWeight,fontStyle:t.fontStyle,fontFamily:a},i))}return M.get(a)});return(await Promise.all(r)).join(`
`)}function Yt(s,e,t,r,a){const{domElement:n,styleElement:i,svgRoot:o}=a;n.innerHTML=`<style>${e.cssStyle}</style><div style='padding:0;'>${s}</div>`,n.setAttribute("style",`transform: scale(${t});transform-origin: top left; display: inline-block`),i.textContent=r;const{width:u,height:d}=a.image;return o.setAttribute("width",u.toString()),o.setAttribute("height",d.toString()),new XMLSerializer().serializeToString(o)}function Xt(s,e){const t=be.getOptimalCanvasAndContext(s.width,s.height,e),{context:r}=t;return r.clearRect(0,0,s.width,s.height),r.drawImage(s,0,0),t}function Nt(s,e,t){return new Promise(async r=>{t&&await new Promise(a=>setTimeout(a,100)),s.onload=()=>{r()},s.src=`data:image/svg+xml;charset=utf8,${encodeURIComponent(e)}`,s.crossOrigin="anonymous"})}class He{constructor(e){this._renderer=e,this._createCanvas=e.type===N.WEBGPU}getTexture(e){return this.getTexturePromise(e)}getTexturePromise(e){return this._buildTexturePromise(e)}async _buildTexturePromise(e){const{text:t,style:r,resolution:a,textureStyle:n}=e,i=D.get(Ue),o=Ht(t,r),u=await $t(o,r,K.defaultTextStyle),d=ht(t,r,u,i),h=Math.ceil(Math.ceil(Math.max(1,d.width)+r.padding*2)*a),l=Math.ceil(Math.ceil(Math.max(1,d.height)+r.padding*2)*a),c=i.image,f=2;c.width=(h|0)+f,c.height=(l|0)+f;const x=Yt(t,r,a,u,i);await Nt(c,x,Et()&&o.length>0);const m=c;let g;this._createCanvas&&(g=Xt(c,a));const _=Le(g?g.canvas:m,c.width-f,c.height-f,a);return n&&(_.source.style=n),this._createCanvas&&(this._renderer.texture.initSource(_.source),be.returnCanvasAndContext(g)),D.return(i),_}returnTexturePromise(e){e.then(t=>{this._cleanUp(t)}).catch(()=>{G("HTMLTextSystem: Failed to clean texture")})}_cleanUp(e){y.returnTexture(e,!0),e.source.resource=null,e.source.uploadMethodId="unknown"}destroy(){this._renderer=null}}He.extension={type:[p.WebGLSystem,p.WebGPUSystem,p.CanvasSystem],name:"htmlText"};class jt extends ye{constructor(e){super(),this._renderer=e,e.runners.resolutionChange.add(this)}resolutionChange(){const e=this.renderable;e._autoResolution&&e.onViewUpdate()}destroy(){this._renderer.canvasText.returnTexture(this.texture),this._renderer=null}}class Ie{constructor(e){this._renderer=e}validateRenderable(e){return e._didTextUpdate}addRenderable(e,t){const r=this._getGpuText(e);e._didTextUpdate&&(this._updateGpuText(e),e._didTextUpdate=!1),this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuText(e);t._batcher.updateElement(t)}_updateGpuText(e){const t=this._getGpuText(e);t.texture&&this._renderer.canvasText.returnTexture(t.texture),e._resolution=e._autoResolution?this._renderer.resolution:e.resolution,t.texture=t.texture=this._renderer.canvasText.getTexture(e),Y(t,e)}_getGpuText(e){return e._gpuData[this._renderer.uid]||this.initGpuText(e)}initGpuText(e){const t=new jt(this._renderer);return t.renderable=e,t.transform=e.groupTransform,t.bounds={minX:0,maxX:1,minY:0,maxY:0},t.roundPixels=this._renderer._roundPixels|e._roundPixels,e._gpuData[this._renderer.uid]=t,t}destroy(){this._renderer=null}}Ie.extension={type:[p.WebGLPipes,p.WebGPUPipes,p.CanvasPipes],name:"text"};class $e{constructor(e){this._renderer=e}getTexture(e,t,r,a){typeof e=="string"&&(R("8.0.0","CanvasTextSystem.getTexture: Use object TextOptions instead of separate arguments"),e={text:e,style:r,resolution:t}),e.style instanceof L||(e.style=new L(e.style)),e.textureStyle instanceof I||(e.textureStyle=new I(e.textureStyle)),typeof e.text!="string"&&(e.text=e.text.toString());const{text:n,style:i,textureStyle:o}=e,u=e.resolution??this._renderer.resolution,{frame:d,canvasAndContext:h}=V.getCanvasAndContext({text:n,style:i,resolution:u}),l=Le(h.canvas,d.width,d.height,u);if(o&&(l.source.style=o),i.trim&&(d.pad(i.padding),l.frame.copyFrom(d),l.updateUvs()),i.filters){const c=this._applyFilters(l,i.filters);return this.returnTexture(l),V.returnCanvasAndContext(h),c}return this._renderer.texture.initSource(l._source),V.returnCanvasAndContext(h),l}returnTexture(e){const t=e.source;t.resource=null,t.uploadMethodId="unknown",t.alphaMode="no-premultiply-alpha",y.returnTexture(e,!0)}renderTextToCanvas(){R("8.10.0","CanvasTextSystem.renderTextToCanvas: no longer supported, use CanvasTextSystem.getTexture instead")}_applyFilters(e,t){const r=this._renderer.renderTarget.renderTarget,a=this._renderer.filter.generateFilteredTexture({texture:e,filters:t});return this._renderer.renderTarget.bind(r,!1),a}destroy(){this._renderer=null}}$e.extension={type:[p.WebGLSystem,p.WebGPUSystem,p.CanvasSystem],name:"canvasText"};b.add(Be);b.add(st);b.add(Ge);b.add(De);b.add(Ae);b.add($e);b.add(Ie);b.add(ze);b.add(He);b.add(Ee);b.add(Oe);b.add(We);b.add(Te);b.add(ve);
