/**::
 * Test methods outside class definition
 * @ExpectOutput: "Success!\n"
 */
test();

void test(){
   test1("Success!");
}


void test1(String s){
   println(s);
}
