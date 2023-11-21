
import { Program } from '../compiler/common/interpreter/Program';
import { EmptyRange } from '../compiler/common/range/Range';
import { TokenType } from '../compiler/java/TokenType';
import { JavaCompiledModule } from '../compiler/java/module/JavaCompiledModule.ts';
import { JavaModuleManager } from '../compiler/java/module/JavaModuleManager.ts';
import { ASTNode, ASTGlobalNode, ASTDebugProgram } from '../compiler/java/parser/AST';
import { IJavaClass, JavaClass } from '../compiler/java/types/JavaClass.ts';
import { JavaEnum } from '../compiler/java/types/JavaEnum.ts';
import { IJavaInterface, JavaInterface } from '../compiler/java/types/JavaInterface.ts';
import { DOM } from '../tools/DOM';
import { Treeview } from '../tools/components/treeview/Treeview';
import '/include/css/astcomponent.css';

type ProgramViewerNode = {
    program?: string,
    info?: string,
    iconClass?: IconClass
}

type IconClass = "img_classdeclaration-dark" | "img_enumdeclaration-dark" | "img_interfacedeclaration-dark" | "img_methoddeclaration-dark" | "img_attributedeclaration-dark";

export class ProgramViewerComponent {

    treeviewDiv: HTMLDivElement;
    detailsDiv: HTMLDivElement;

    editor: monaco.editor.IStandaloneCodeEditor;

    treeview: Treeview<ProgramViewerNode>;

    constructor(parentDiv: HTMLDivElement) {

        parentDiv.classList.add('jo_ast_main');
        this.treeviewDiv = DOM.makeDiv(parentDiv, 'jo_ast_treeview');
        this.detailsDiv = DOM.makeDiv(parentDiv, 'jo_ast_details');

        this.editor = monaco.editor.create(this.detailsDiv, {
            value: "/** Awaiting compilation... */",
            language: "javascript",
            automaticLayout: true,
        });

        this.treeview = new Treeview<ProgramViewerNode>(this.treeviewDiv, {
            captionLine: {
                enabled: false
            },
            withDeleteButtons: false,
            withDragAndDrop: false,
            withFolders: true
        })

        this.treeview.onNodeClickedHandler = (node: ProgramViewerNode) => {
            this.showDetails(node);
        }
    }


    buildTreeView(moduleManager: JavaModuleManager | undefined) {
        this.treeview.clear();
        if (!moduleManager) return;

        let modulesElement: ProgramViewerNode = {};
        this.treeview.addNode(true, "Modules", undefined, modulesElement, modulesElement, null);
        
        let classesElement: ProgramViewerNode = {};
        this.treeview.addNode(true, "Classes", undefined, classesElement, classesElement, null);
        

        for (let module of moduleManager.modules) {
            this.addModuleNode(module, modulesElement);
            for(let type of module.types){
                if(type instanceof JavaClass){
                    this.addClassNode(type, classesElement);
                } else if(type instanceof JavaEnum){
                    
                } else if(type instanceof JavaInterface){

                }
            }
        }

        this.treeview.initialRenderAll();
    }

    addClassNode(type: JavaClass, classesElement: ProgramViewerNode) {
        let classNode: ProgramViewerNode = {
            iconClass: "img_classdeclaration-dark",
            program: this.dontIndent(`class ${type.identifier}
            \n/*Fields:*/\n${type.fields.map(field => field.type + " " + field.identifier).join("\n")}
            `)
        }

        this.treeview.addNode(true, type.identifier, classNode.iconClass, classNode, classNode, classesElement);

        for(let method of type.methods){
            let methodNode: ProgramViewerNode = {
                iconClass: "img_methoddeclaration-dark",
                program: 
                `/* Method ${method.identifier}*/\n` + 
                `/* Program stub: */\n` + method.programStub + "\n\n" +
                `/* Program: */\n` + method.program?.getSourcecode() + "\n" 
            }

            this.treeview.addNode(false, method.identifier, methodNode.iconClass, methodNode, methodNode, classNode);

        }


    }

    addModuleNode(module: JavaCompiledModule, parent: ProgramViewerNode) {
        let node: ProgramViewerNode = {
            program: 
                `/**\n * Module ${module.file.filename}\n */\n\n` + 
                 `/* classes: ${module.types.filter(type => type instanceof IJavaClass).map(klass => klass.identifier).join(", ")} */\n` +
                 `/* enums: ${module.types.filter(type => type instanceof JavaEnum).map(klass => klass.identifier).join(", ")} */\n` +
                 `/* interfaces: ${module.types.filter(type => type instanceof IJavaInterface).map(klass => klass.identifier).join(", ")} /*\n` +
                 "\n/* Main Program: */\n" + module.mainProgram?.getSourcecode()
        }

        this.treeview.addNode(false, module.file.filename, undefined, node, node, parent);
    }

    dontIndent(str: string){
        return ('' + str).replace(/(\n)\s+/g, '$1');
      }

    showDetails(node: ProgramViewerNode) {

        if (node.info) {
            let model = monaco.editor.createModel(node.info, "text");
            this.editor.setModel(model);

        } else if (node.program) {
            let model = monaco.editor.createModel(node.program, "javascript");

            this.editor.setModel(model);

        }

    }


}