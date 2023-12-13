import { expect, test, vi } from 'vitest'
import { File } from '../compiler/common/module/File';
import { JavaCompiler } from '../compiler/java/JavaCompiler';
import { Interpreter } from '../compiler/common/interpreter/Interpreter';
import { TestPrintManager } from '../testgui/TestPrintManager';

test('test switch case with int', () => {
    let file = new File();
    let code =`
    int x = 1;
    switch(x) {
        case 0: println("A"); break;
        case 1: println("B");
        case 2: println("C"); break;
        default: println("D"); break;
    }
    println("E");
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
    let printSpy = vi.spyOn(tpm, 'print');  
    
    let compiler = new JavaCompiler();
    let executable = compiler.compile(file);

    let interpreter = new Interpreter(tpm);
    interpreter.setExecutable(executable);

    interpreter.runMainProgramSynchronously();

    expect(printSpy).toHaveBeenCalledWith("B", true, undefined);
    expect(printSpy).toHaveBeenCalledWith("C", true, undefined);
    expect(printSpy).toHaveBeenCalledWith("E", true, undefined);

});

test('test switch case with String', () => {
    let file = new File();
    let code =`
    String x = "Test";
    switch(x) {
        case "Baum": println("A"); break;
        case "Test": println("B");
        case "Wind": println("C"); break;
        default: println("D"); break;
    }
    println("E");
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
    let printSpy = vi.spyOn(tpm, 'print');  
    
    let compiler = new JavaCompiler();
    let executable = compiler.compile(file);

    let interpreter = new Interpreter(tpm);
    interpreter.setExecutable(executable);

    interpreter.runMainProgramSynchronously();

    expect(printSpy).toHaveBeenCalledWith("B", true, undefined);
    expect(printSpy).toHaveBeenCalledWith("C", true, undefined);
    expect(printSpy).toHaveBeenCalledWith("E", true, undefined);

});

test('test switch case with constant', () => {
  let file = new File();
  let code =`
  public class A {
    public static final String a = "ABC";
    public static final int x = 5;
  }
  String b = "DEF";
  int y = 4;
  switch(b) {
      case A.a: println("A"); break;
      
      default: switch(y) {
        case 4:
        case 5: println("B"); break;
        default: println("C"); break;
      }
  }
  println("D");
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
  let printSpy = vi.spyOn(tpm, 'print');  
  
  let compiler = new JavaCompiler();
  let executable = compiler.compile(file);

  let interpreter = new Interpreter(tpm);
  interpreter.setExecutable(executable);

  interpreter.runMainProgramSynchronously();

  expect(printSpy).toHaveBeenCalledWith("B", true, undefined);
  expect(printSpy).toHaveBeenCalledWith("D", true, undefined);

});