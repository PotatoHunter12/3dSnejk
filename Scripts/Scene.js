import { Node } from '../Engine/Node.js';

export class Scene {

    constructor(options = {}) {
        this.nodes = [...(options.nodes ?? [])];
       
    }

    addNode(node) {
        this.nodes.push(node);
    }
    removeNode(node){
        const i = this.nodes.indexOf(node);
        if (i >= 0) {
            this.nodes.splice(i,1);
        }
    }

    traverse(before, after) {
        for (const node of this.nodes) {
            this.traverseNode(node, before, after);
        }
    }

    traverseNode(node, before, after) {
        if (before) {
            before(node);
        }
        for (const child of node.children) {
            this.traverseNode(child, before, after);
        }
        if (after) {
            after(node);
        }
    }
}
