(function () {
    'use strict';

    let r$3 = class r extends Error{name="ConductorError";errorType="__unknown";constructor(r){super(r);}};

    let o$1 = class o extends r$3{name="ConductorInternalError";errorType="__internal";constructor(r){super(r);}};

    let t$3 = class t{name;t;i=new Set;h=true;o=[];send(s,t){this.l(),this.t.postMessage(s,t??[]);}subscribe(s){if(this.l(),this.i.add(s),this.o){for(const t of this.o)s(t);delete this.o;}}unsubscribe(s){this.l(),this.i.delete(s);}close(){this.l(),this.h=false,this.t?.close();}l(){if(!this.h)throw new o$1(`Channel ${this.name} has been closed`)}_(s){if(this.l(),this.o){if(this.o.length>=10)return console.warn("Channel buffer full; message dropped (no subscribers on channel)",s);this.o.push(s);}else for(const t of this.i)t(s);}listenToPort(s){s.addEventListener("message",s=>this._(s.data)),s.start();}replacePort(s){this.l(),this.t?.close(),this.t=s,this.listenToPort(s);}constructor(s,t){this.name=s,this.replacePort(t);}};class i{u=true;p;m;C=new Map;P=new Map;v=[];M(s){const{port1:i,port2:e}=new MessageChannel,h=new t$3(s,i);this.p.postMessage([s,e],[e]),this.C.set(s,h);}l(){if(!this.u)throw new o$1("Conduit already terminated")}registerPlugin(t,...i){this.l();const e=[];for(const s of t.channelAttach)this.C.has(s)||this.M(s),e.push(this.C.get(s));const h=new t(this,e,...i);if(void 0!==h.name){if(this.P.has(h.name))throw new o$1(`Plugin ${h.name} already registered`);this.P.set(h.name,h);}return this.v.push(h),h}unregisterPlugin(s){this.l();let t=0;for(let i=0;i<this.v.length;++i)this.v[t]===s&&++t,this.v[i]=this.v[i+t];for(let s=this.v.length-1,i=this.v.length-t;s>=i;--s)delete this.v[s];s.name&&this.P.delete(s.name),s.destroy?.();}lookupPlugin(t){if(this.l(),!this.P.has(t))throw new o$1(`Plugin ${t} not registered`);return this.P.get(t)}terminate(){this.l();for(const s of this.v)s.destroy?.();this.p.terminate?.(),this.u=false;}j(s){const[i,e]=s;if(this.C.has(i)){const s=this.C.get(i);this.m?s.listenToPort(e):s.replacePort(e);}else {const s=new t$3(i,e);this.C.set(i,s);}}constructor(s,t=false){this.p=s,s.addEventListener("message",s=>this.j(s.data)),this.m=t;}}

    async function t$2(t){return (await import(/* webpackIgnore: true */t)).plugin}

    let t$1 = class t{type=0;data;constructor(t,s,r){this.data={fn:t,args:s,invokeId:r};}};let s$1 = class s{type=2;data;constructor(t,s){this.data={invokeId:t,err:s};}};let r$2 = class r{type=1;data;constructor(t,s){this.data={invokeId:t,res:s};}};

    function r$1(r,s){const c=[];let o=0;return r.subscribe(async n=>{switch(n.type){case 0:{const{fn:c,args:o,invokeId:a}=n.data;try{const t=await s[c](...o);a>0&&r.send(new r$2(a,t));}catch(e){a>0&&r.send(new s$1(a,e));}break}case 1:{const{invokeId:e,res:t}=n.data;c[e]?.[0]?.(t),delete c[e];break}case 2:{const{invokeId:e,err:t}=n.data;c[e]?.[1]?.(t),delete c[e];break}}}),new Proxy({},{get(e,t,s){const a=Reflect.get(e,t,s);if(a)return a;const i="string"==typeof t&&"$"===t.charAt(0)?(...e)=>{r.send(new t$1(t,e,0));}:(...e)=>{const s=++o;return r.send(new t$1(t,e,s)),new Promise((e,t)=>{c[s]=[e,t];})};return Reflect.set(e,t,i,s),i}})}

    var O;!function(O){O[O.VOID=0]="VOID",O[O.BOOLEAN=1]="BOOLEAN",O[O.NUMBER=2]="NUMBER",O[O.CONST_STRING=3]="CONST_STRING",O[O.EMPTY_LIST=4]="EMPTY_LIST",O[O.PAIR=5]="PAIR",O[O.ARRAY=6]="ARRAY",O[O.CLOSURE=7]="CLOSURE",O[O.OPAQUE=8]="OPAQUE",O[O.LIST=9]="LIST";}(O||(O={}));

    class s{type=1;data;constructor(s){this.data={minVersion:s};}}class a{type=0;data={version:0}}

    class t{type=2;data;constructor(t){this.data=t;}}

    class r{name="__host_main";t;i;o;h;u=0;_=new Map([[0,function(t){t.data.version<0?(this.o.send(new s(0)),console.error(`Runner's protocol version (${t.data.version}) must be at least 0`)):console.log(`Runner is using protocol version ${t.data.version}`);}],[1,function(t){console.error(`Runner expects at least protocol version ${t.data.minVersion}, but we are on version 0`),this.t.terminate();}],[3,function(t){const s=t.data;this.requestLoadPlugin(s);}]]);startEvaluator(t$1){this.o.send(new t(t$1));}sendChunk(t){this.i.send({id:this.u++,chunk:t});}sendInput(t){this.h.send({message:t});}registerPlugin(t,...s){return this.t.registerPlugin(t,...s)}unregisterPlugin(t){this.t.unregisterPlugin(t);}async importAndRegisterExternalPlugin(s,...e){const i=await t$2(s);return this.registerPlugin(i,...e)}static channelAttach=["__file_rpc","__chunk","__service","__stdio","__error","__status"];constructor(t,[e,n,r,o,c,a$1]){this.t=t,r$1(e,{requestFile:this.requestFile.bind(this)}),this.i=n,this.o=r,this.h=o,o.subscribe(t=>this.receiveOutput?.(t.message)),c.subscribe(t=>this.receiveError?.(t.error)),a$1.subscribe(t=>{const{status:s,isActive:e}=t;this.receiveStatusUpdate?.(s,e);}),this.o.send(new a),this.o.subscribe(t=>{this._.get(t.type)?.call(this,t);});}}

    ({[O.VOID]:false,[O.BOOLEAN]:false,[O.NUMBER]:false,[O.CONST_STRING]:false,[O.EMPTY_LIST]:true,[O.PAIR]:true,[O.ARRAY]:true,[O.CLOSURE]:true,[O.OPAQUE]:true,[O.LIST]:true});

    class UiHostPlugin {
        constructor(conduit, [uiChannel]) {
            this.name = "ui-host";
            this.componentRegistry = new Map();
            this.activeViews = new Map();
            this.uiChannel = uiChannel;
            // Subscribe to UI messages from evaluator
            this.uiChannel.subscribe((message) => {
                this.handleUiMessage(message);
            });
            // Register default components
            this.registerDefaultComponents();
        }
        /**
         * Register a UI component
         */
        registerComponent(name, component) {
            this.componentRegistry.set(name, component);
        }
        /**
         * Get supported component types
         */
        getSupportedComponents() {
            return Array.from(this.componentRegistry.keys());
        }
        /**
         * Render a UI tree to string (for CLI/demo purposes)
         */
        renderToString(tree, depth = 0) {
            const indent = '  '.repeat(depth);
            const component = this.componentRegistry.get(tree.component);
            if (!component) {
                return `${indent}[Unknown component: ${tree.component}]\\n`;
            }
            let result = '';
            // Simple string-based rendering for demo
            switch (tree.component) {
                case 'Text':
                    result = `${indent}${tree.props?.content || ''}\\n`;
                    break;
                case 'Heading':
                    const level = tree.props?.level || 1;
                    const prefix = '#'.repeat(level);
                    result = `${indent}${prefix} ${tree.props?.text || ''}\\n`;
                    break;
                case 'Button':
                    result = `${indent}[${tree.props?.text || 'Button'}]${tree.id ? ` (id: ${tree.id})` : ''}\\n`;
                    break;
                case 'VStack':
                case 'HStack':
                    result = `${indent}${tree.component}:\\n`;
                    break;
                case 'Card':
                    result = `${indent}┌─ ${tree.props?.title || 'Card'} ─┐\\n`;
                    break;
                case 'Table':
                    const columns = tree.props?.columns || [];
                    const rows = tree.props?.rows || [];
                    result = `${indent}Table: ${columns.join(' | ')}\\n`;
                    rows.forEach((row) => {
                        result += `${indent}       ${row.join(' | ')}\\n`;
                    });
                    break;
                case 'Plot':
                    const series = tree.props?.series || [];
                    result = `${indent}Plot: ${series.length} series\\n`;
                    break;
                default:
                    result = `${indent}${tree.component}: ${JSON.stringify(tree.props)}\\n`;
            }
            // Render children
            if (tree.children) {
                for (const child of tree.children) {
                    result += this.renderToString(child, depth + 1);
                }
            }
            if (tree.component === 'Card') {
                result += `${indent}└${'─'.repeat((tree.props?.title?.length || 4) + 4)}┘\\n`;
            }
            return result;
        }
        /**
         * Send an event back to the evaluator
         */
        sendEvent(viewId, targetId, event, payload) {
            const message = {
                type: 'ui.event',
                version: '1.0',
                viewId,
                targetId,
                event,
                payload
            };
            this.uiChannel.send(message);
        }
        /**
         * Get the current UI for a view (for debugging/inspection)
         */
        getView(viewId) {
            return this.activeViews.get(viewId);
        }
        /**
         * Get all active view IDs
         */
        getActiveViews() {
            return Array.from(this.activeViews.keys());
        }
        handleUiMessage(message) {
            switch (message.type) {
                case 'ui.hello':
                    this.handleHello(message);
                    break;
                case 'ui.render':
                    this.handleRender(message);
                    break;
                case 'ui.dispose':
                    this.handleDispose(message);
                    break;
            }
        }
        handleHello(message) {
            const capabilities = {
                type: 'ui.capabilities',
                version: '1.0',
                supported: this.getSupportedComponents(),
                constraints: {
                    maxNodes: 1000,
                    maxDepth: 20,
                    maxPayloadSize: 1024 * 1024 // 1MB
                }
            };
            this.uiChannel.send(capabilities);
            console.log(`[UI] Capabilities requested for view '${message.viewId}'`);
        }
        handleRender(message) {
            if (!this.validateTree(message.tree)) {
                console.error(`[UI] Invalid tree for view '${message.viewId}'`);
                return;
            }
            this.activeViews.set(message.viewId, message.tree);
            // For demo purposes, render to console
            console.log(`[UI] Rendering view '${message.viewId}':`);
            console.log(this.renderToString(message.tree));
            // Call the render callback if provided
            this.onRender?.(message.viewId, message.tree);
        }
        handleDispose(message) {
            this.activeViews.delete(message.viewId);
            console.log(`[UI] Disposed view '${message.viewId}'`);
            this.onDispose?.(message.viewId);
        }
        validateTree(tree) {
            if (!tree.component || !this.componentRegistry.has(tree.component)) {
                return false;
            }
            // TODO: Validate props against schema
            if (tree.children) {
                for (const child of tree.children) {
                    if (!this.validateTree(child)) {
                        return false;
                    }
                }
            }
            return true;
        }
        registerDefaultComponents() {
            this.registerComponent('Text', {
                render: (props) => props.content
            });
            this.registerComponent('Heading', {
                render: (props) => props.text
            });
            this.registerComponent('Button', {
                render: (props) => `[${props.text}]`
            });
            this.registerComponent('VStack', {
                render: (props, children) => children
            });
            this.registerComponent('HStack', {
                render: (props, children) => children
            });
            this.registerComponent('Card', {
                render: (props, children) => children
            });
            this.registerComponent('Table', {
                render: (props) => props
            });
            this.registerComponent('Plot', {
                render: (props) => props
            });
        }
    }
    UiHostPlugin.channelAttach = ["ui"];

    /**
     * Demo Host that integrates BrowserHostPlugin and UiHostPlugin functionality
     */
    class DemoHost extends r {
        constructor(conduit, channels) {
            super(conduit, channels);
            // Register the UI host plugin as a sub-plugin
            this.uiHost = conduit.registerPlugin(UiHostPlugin);
            // Set up UI rendering
            this.setupUIRendering();
        }
        async requestFile(fileName) {
            return "blank";
        }
        requestLoadPlugin(pluginName) {
            console.log("Host requested to load plugin:", pluginName);
        }
        setupUIRendering() {
            // Get DOM elements
            const output = document.getElementById("output");
            const ui = document.getElementById("ui");
            // Capture console logs for output
            const originalLog = console.log;
            console.log = (...args) => {
                originalLog(...args);
                const line = args.map(String).join(" ");
                if (output) {
                    output.textContent += (output.textContent ? "\n" : "") + line;
                }
            };
            // Set up UI rendering callback
            this.uiHost.onRender = (_, tree) => {
                if (ui) {
                    ui.textContent = this.uiHost.renderToString(tree);
                }
            };
        }
        // Override to handle output display
        receiveOutput(message) {
            super.receiveOutput?.(message);
            const output = document.getElementById("output");
            if (output) {
                output.textContent += (output.textContent ? "\n" : "") + message;
            }
        }
    }

    // Create a worker that runs the evaluator bundle
    const worker = new Worker("/echo-slang/dist/index.js", { type: "module" });
    // Create a host conduit that communicates with the worker
    const conduit = new i(worker, true);
    // Register our demo host (which includes BrowserHost + UiHost functionality)
    const demoHost = conduit.registerPlugin(DemoHost);
    // Set up DOM interaction
    const input = document.getElementById("chunk-input");
    const button = document.getElementById("send-btn");
    const output = document.getElementById("output");
    button.addEventListener("click", () => {
        const text = input.value.trim();
        if (!text)
            return;
        // Clear UI output
        const ui = document.getElementById("ui");
        if (ui)
            ui.textContent = "";
        if (output) {
            output.textContent += (output.textContent ? "\n" : "") + `> ${text}`;
        }
        // Send chunk to evaluator
        demoHost.sendChunk(text);
    });
    // Start the evaluator with the entry point
    demoHost.startEvaluator("index.js");

})();
//# sourceMappingURL=main.js.map
