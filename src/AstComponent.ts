import { TokenType } from './compiler/java/TokenType';
import { ASTGlobalNode, ASTNode } from './compiler/java/parser/AST';
import { DOM } from './tools/DOM';
import { Treeview } from './tools/components/treeview/Treeview';
import '/include/css/astcomponent.css';

type NodePropertyInfo = {
    isChildNode: boolean,
    key: string,
    value: any,
    childNodes: ASTNode[] | undefined
}

interface ASTMultiNode extends ASTNode {
    role: string,
    childNodes: ASTNode[]
}


export class AstComponent {

    treeviewDiv: HTMLDivElement;
    detailsDiv: HTMLDivElement;

    astTreeview: Treeview<ASTNode>;

    constructor(parentDiv: HTMLDivElement) {

        parentDiv.classList.add('jo_ast_main');
        this.treeviewDiv = DOM.makeDiv(parentDiv, 'jo_ast_treeview');
        this.detailsDiv = DOM.makeDiv(parentDiv, 'jo_ast_details');

        this.astTreeview = new Treeview<ASTNode>(this.treeviewDiv, {
            captionLine: {
                enabled: false
            },
            withDeleteButtons: false,
            withDragAndDrop: false,
            withFolders: true
        })

        this.astTreeview.onNodeClickedHandler = (node: ASTNode) => {
            this.showDetails(node);
        }
    }


    buildTreeView(ast: ASTGlobalNode | undefined) {
        this.astTreeview.clear();
        if(!ast) return;
        this.addNode(undefined, ast);
        this.astTreeview.initialRenderAll();        
    }

    addNode(parent: ASTNode | undefined, node: ASTNode){

        let childNodeInfo = this.getChildNodeInfo(node).filter(cni => cni.isChildNode);
        
        this.astTreeview.addNode(childNodeInfo.length > 0,
            TokenType[node.type], undefined, node, node, parent);

        for(let cni of childNodeInfo){

            if(cni.childNodes!.length == 1){
                this.addNode(node, cni.childNodes![0]);
            } else {
                let firstChild = cni.childNodes![0];
                let lastChild = cni.childNodes![cni.childNodes!.length - 1];

                let multiNode: ASTMultiNode = {
                    range: {startLineNumber: firstChild.range.startLineNumber,
                            startColumn: firstChild.range.startColumn,
                            endLineNumber: lastChild.range.endLineNumber,
                            endColumn: lastChild.range.endColumn},
                    type: TokenType.multiNode,
                    childNodes: cni.childNodes!,
                    role: cni.key
                }
                this.astTreeview.addNode(true, cni.key, undefined,
                    multiNode, multiNode, node);
                cni.childNodes!.forEach( cn => {
                    this.addNode(multiNode, cn);
                })
            }

        }


    }

    getChildNodeInfo(node: ASTNode): NodePropertyInfo[]{
        let childNodes: NodePropertyInfo[] = [];

        for(const [field, value] of Object.entries(node)){

            if(value['type'] != null && value['range'] != null){
                childNodes.push({
                    isChildNode: true,
                    key: field,
                    value: value,
                    childNodes: [value]
                });
            } else if (Array.isArray(value) && value.length > 0){
                let firstElement = value[0];
                if(firstElement['type'] != null && firstElement['range'] != null){
                    childNodes.push({
                        isChildNode: true,
                        key: field,
                        value: value,
                        childNodes: value
                    });
                }       
            } else {
                childNodes.push({
                    isChildNode: false,
                    key: field,
                    value: value,
                    childNodes: undefined
                })
            }

        }

        return childNodes;
    }

    showDetails(node: ASTNode){
        DOM.clear(this.detailsDiv);
        DOM.makeDiv(this.detailsDiv, 'jo_ast_details_heading').textContent = "Type: " + TokenType[node.type];
        
        let childNodeInfoList = this.getChildNodeInfo(node);
        for(let cni of childNodeInfoList){
            if(cni.key == 'type') continue;
            if(cni.key == 'range'){

                continue;
            } 
            let line = DOM.makeDiv(this.detailsDiv, 'jo_ast_details_line');
            
            DOM.makeSpan(line, '.jo_st_details_key').textContent = cni.key + ": ";
            if(cni.isChildNode){
                
                let value: string = "";
                if(Array.isArray(cni.childNodes)){
                    let type: string = "";
                    if(cni.childNodes.length > 0) type = TokenType[cni.childNodes[0].type];
                    value = type + "[" + cni.childNodes.length + "]";
                } else {
                    let type1: string = "";
                    //@ts-ignore
                    if(value != null) type1 = TokenType[value.type];
                    value = type1;
                }
                
                DOM.makeSpan(line, '.jo_st_details_value').textContent =  value;
            } else {
                let value: string = "" + cni.value;
                if(Array.isArray(cni.value)) value = "[" + value.length + "]";
                DOM.makeSpan(line, '.jo_st_details_value').textContent =  value;
            }

        }
        
    }


}