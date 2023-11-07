/**
 * Native calling convention:
 * public test(s: string): boolean { return true; }
 * Consequence: 
 *   * Method can't call java methods
 *   * Method has to be final
 * 
 * Java  calling convention:
 * public test(t: Thread, s: string) {
 *  t.stack.push(b);
 * }
 */


type CallingConvention = "native" | "java";