import { expect, test, vi } from 'vitest'
import { File } from '../compiler/common/module/File';
import { ActionManager } from '../testgui/ActionManager';
import { JavaLibraryModuleManager } from '../compiler/java/module/libraries/JavaLibraryModuleManager';
import { JavaCompiler } from '../compiler/java/JavaCompiler';
import { Interpreter } from '../compiler/common/interpreter/Interpreter';
import { TestPrintManager } from '../testgui/TestPrintManager';



test('test if simple program with for-loop compiles and runs as expected', () => {
    let file = new File();
    let code =`
    int sum = 0;
    for(int i = 1; i <= 100; i++){
        sum += i;
    }
    print(sum);
    `;
    
    file.setText(code);

    
    // Mock TestPrintManager
    // Method calls have no effect
    // but can be spied on
    vi.mock('../testgui/TestPrintManager', () => {
      const TestPrintManager = vi.fn(() => ({
        clear: vi.fn(),
        print: vi.fn()
      }))
      return { TestPrintManager }
    });
    
    let testPrintManager = new TestPrintManager();
    let clearSpy = vi.spyOn(testPrintManager, 'clear');
    let printSpy = vi.spyOn(testPrintManager, 'print');
    
    let compiler = new JavaCompiler();
    compiler.files = [file];
    let executable = compiler.compileIfDirty();
    
    let interpreter = new Interpreter(testPrintManager);
    interpreter.setExecutable(executable);

    interpreter.runMainProgramSynchronously();

    expect(clearSpy).toHaveBeenCalled();
    expect(printSpy).toHaveBeenCalledWith("5050", false, undefined);
});


test('test if program with simple if-else block compiles and runs as expected', () => {
    let file = new File();
    let code =`
    int x = 7;
    if (x > 8) {
        print("A");
    }
    else {
        print("B");
    }
    `;
    
    file.setText(code);

    
    // Mock TestPrintManager
    // Method calls have no effect
    // but can be spied on
    vi.mock('../testgui/TestPrintManager', () => {
      const TestPrintManager = vi.fn(() => ({
        clear: vi.fn(),
        print: vi.fn()
      }))
      return { TestPrintManager }
    })
    
    
    let tpm = new TestPrintManager();
    let clearSpy = vi.spyOn(tpm, 'clear');
    let printSpy = vi.spyOn(tpm, 'print');  
    
    let compiler = new JavaCompiler();
    compiler.files = [file];
    let executable = compiler.compileIfDirty();

    let interpreter = new Interpreter(tpm);
    interpreter.setExecutable(executable);

    interpreter.runMainProgramSynchronously();

    expect(clearSpy).toHaveBeenCalled();
    expect(printSpy).toHaveBeenCalledWith("B", false, undefined);
});