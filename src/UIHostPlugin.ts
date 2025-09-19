import { IChannel, IConduit, IPlugin } from "@sourceacademy/conductor";
import { UiMessage, UiNode, UiCapabilitiesMessage, UiEventMessage } from "../../echo-slang/src/types";
import { ConductorError, RunnerStatus, Chunk } from "@sourceacademy/conductor";

/**
 * Component registry entry
 */
export interface UiComponent {
    /** React component or render function */
    render: (props: any, children: any[]) => any;
    /** JSON Schema for props validation */
    propsSchema?: any;
}

export class UiHostPlugin implements IPlugin {
    name = "ui-host";
    static readonly channelAttach = ["ui"];
    
    private readonly uiChannel: IChannel<UiMessage>;
    private readonly componentRegistry = new Map<string, UiComponent>();
    private readonly activeViews = new Map<string, UiNode>();
    
    constructor(conduit: IConduit, [uiChannel]: IChannel<any>[]) {
        this.uiChannel = uiChannel;
        
        // Subscribe to UI messages from evaluator
        this.uiChannel.subscribe((message: UiMessage) => {
            this.handleUiMessage(message);
        });
        
        // Register default components
        this.registerDefaultComponents();
    }
    
    /**
     * Register a UI component
     */
    registerComponent(name: string, component: UiComponent): void {
        this.componentRegistry.set(name, component);
    }
    
    /**
     * Get supported component types
     */
    getSupportedComponents(): string[] {
        return Array.from(this.componentRegistry.keys());
    }
    
    /**
     * Render a UI tree to string (for CLI/demo purposes)
     */
    renderToString(tree: UiNode, depth: number = 0): string {
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
                const level = (tree.props?.level as number) || 1;
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
                const columns = (tree.props?.columns as string[]) || [];
                const rows = (tree.props?.rows as any[][]) || [];
                result = `${indent}Table: ${columns.join(' | ')}\\n`;
                rows.forEach((row: any[]) => {
                    result += `${indent}       ${row.join(' | ')}\\n`;
                });
                break;
            case 'Plot':
                const series = (tree.props?.series as any[]) || [];
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
            result += `${indent}└${'─'.repeat(((tree.props?.title as string)?.length || 4) + 4)}┘\\n`;
        }
        
        return result;
    }
    
    /**
     * Send an event back to the evaluator
     */
    sendEvent(viewId: string, targetId: string, event: string, payload?: any): void {
        const message: UiEventMessage = {
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
    getView(viewId: string): UiNode | undefined {
        return this.activeViews.get(viewId);
    }
    
    /**
     * Get all active view IDs
     */
    getActiveViews(): string[] {
        return Array.from(this.activeViews.keys());
    }
    
    private handleUiMessage(message: UiMessage): void {
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
    
    private handleHello(message: any): void {
        const capabilities: UiCapabilitiesMessage = {
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
    
    private handleRender(message: any): void {
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
    
    private handleDispose(message: any): void {
        this.activeViews.delete(message.viewId);
        console.log(`[UI] Disposed view '${message.viewId}'`);
        
        this.onDispose?.(message.viewId);
    }
    
    private validateTree(tree: UiNode): boolean {
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
    
    private registerDefaultComponents(): void {
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
    
    /**
     * Override point for custom rendering (e.g., React, DOM manipulation)
     */
    onRender?(viewId: string, tree: UiNode): void;
    
    /**
     * Override point for view disposal
     */
    onDispose?(viewId: string): void;
    
    // IPlugin interface requirement
    destroy?(): void;
}