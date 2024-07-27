export var testProgramsList = [
   ['', ``],
   ['JSonParser', `HttpClient client = new HttpClient();
HttpRequest request = new HttpRequest();
request.uri("https://ostrich-api.datausa.io/api/data?measure=Average%20Wage,Average%20Wage%20Appx%20MOE,Record%20Count&drilldowns=Major Occupation%20Group&Workforce%20Status=true&Record%20Count>=5");

HttpResponse response = client.send(request);

JsonElement rootElement = JsonParser.parse(response.body());
JsonElement data = rootElement.getAttributeValue("data");

for (JsonElement row : data.getArrayValues()) {
   print(row.getAsString("Major Occupation Group"), Color.lightsteelblue);
   print(" -> ", Color.red);
   println(Math.round(row.getAsDouble("Average Wage")) + " $", Color.lightgreen);
}`],
   ['HttpClient', `HttpClient client = new HttpClient();
HttpRequest request = new HttpRequest();
request.uri("https://ostrich-api.datausa.io/api/data?measure=Average%20Wage,Average%20Wage%20Appx%20MOE,Record%20Count&drilldowns=Major%20Occupation%20Group&Workforce%20Status=true&Record%20Count>=5");

HttpResponse response = client.send(request);
println(response.body());

println("\\nResponse-Status: " + response.statusCode(), Color.green);
// Ausgabe der Response-Header:
println("\\nHeader:");
for (HttpHeader header : response.headers()) {
   print(header.key + ": ", Color.lightblue);
   println(header.value, Color.lightcoral);
}`],
   ['TextfieldTest', `Textfield tf = new Textfield(100, 100, 300, 20, "Test");

   while (true) {
      
   }`],
   ['RadiobuttonTest', `Radiobutton rb1 = new Radiobutton(100, 100, 10, 20, "Test1", 1);
   Radiobutton rb2 = new Radiobutton(100, 200, 10, 20, "Test1", 2);
   Radiobutton rb3 = new Radiobutton(100, 300, 10, 20, "Test3", 3);
         
   rb1.connectTo(new Radiobutton[] { rb2, rb3 });
   
   rb1.addChangeListener((obj, newValue) -> {
      println(newValue);
      });
      
   while (true) {
            
   }`],
   ['CheckboxTest', `Checkbox cb = new Checkbox(100, 100, 16, 20, "Test");

   cb.addChangeListener((object, value) -> {
         println(value);
      });
   
   while (true) {
      
   }`],
   ['ButtonTest', `Button b = new Button(100, 100, 20, "Test");

b.addChangeListener((object, value) -> {
   println(value);
   });

while (true) {
   
}
`],
   ['GNGFlowerTest', `Blumenwelt b = new Blumenwelt();
Console.log(b.blume1);
Console.log(b.blume2);
println();
   // Florian f = new Florian();
   //f.WinkelSetzen(270);
   // f.LinksDrehen();
   //f.NachNordenGehen();    
   
   /**
    * Legt die Blumenwelt an und die nicht beweglichen Objekte. 
    * 
    * @author Peter Brichzin
    * @version 12.12.19
    */
class Blumenwelt
{
    
   Blume blume1;
   Blume blume2;
       /**
        * Baut das Szenario auf.
        */
   Blumenwelt()
   {
           // Diesen Abschnitt ignorieren, es werden die 10x10 Zellen der Welt erzeugt und positioniert
      for (int zellenNummerX = 0; zellenNummerX < 10; zellenNummerX = zellenNummerX + 1)
      {
         for (int zellenNummerY = 0; zellenNummerY < 10; zellenNummerY += 1)
         {
     
            new Zelle(50 * zellenNummerX + 2, 50 * zellenNummerY + 2, "grün");
         }
      }
           // Abschnittsende
   
      blume1 = new Blume(6, 4);
      blume2 = new Blume(5, 4);
           
   }
} 

   
   class Zelle extends Rechteck 
   {
   
       /**
        * Platziert eine Zelle
        */
      Zelle(int xLinksOben, int yLinksOben, String farbeNeu)
      {
         // super();
         PositionSetzen(xLinksOben, yLinksOben);
         GrößeSetzen(46, 46);
         FarbeSetzen(farbeNeu);
      }
       
   }
   
   
   /**
    *  Blume, die darauf wartet gesammelt zu werden
    * 
    * @author Peter Brichzin
    * @version 1.0
    */
   public class Blume extends Figur
   {
      /**
      * Der Konstruktor1 erzeugt eine Blume an der Pixel-Position (225/125). 
       */
      Blume() 
      {
         super();
         this.FigurteilFestlegenEllipse(0, 0, 25, 25, "gelb");
         this.FigurteilFestlegenEllipse(0, -20, 20, 20, "blau");
         this.FigurteilFestlegenEllipse(20, -10, 20, 20, "blau");
         this.FigurteilFestlegenEllipse(20, 10, 20, 20, "blau");
         this.FigurteilFestlegenEllipse(0, 20, 20, 20, "blau");
         this.FigurteilFestlegenEllipse(-20, -10, 20, 20, "blau");
         this.FigurteilFestlegenEllipse(-20, 10, 20, 20, "blau");
         this.PositionSetzen(225, 125);
         this.GanzNachVornBringen();
      }
       
      /**
      * Der Konstruktor2 erzeugt eine Blume in einem Spielfeld mit 10x10 Zellen.
      * 
      * @param xNeu  x-Position der Blume
      * @param yNeu  y-Position der Blume
      * 
      */
      Blume(int xNeu, int yNeu)
      {
         super();
         this.FigurteilFestlegenEllipse(0, 0, 25, 25, "gelb");
         this.FigurteilFestlegenEllipse(0, -20, 20, 20, "blau");
         this.FigurteilFestlegenEllipse(20, -10, 20, 20, "blau");
         this.FigurteilFestlegenEllipse(20, 10, 20, 20, "blau");
         this.FigurteilFestlegenEllipse(0, 20, 20, 20, "blau");
         this.FigurteilFestlegenEllipse(-20, -10, 20, 20, "blau");
         this.FigurteilFestlegenEllipse(-20, 10, 20, 20, "blau");
         this.GanzNachVornBringen();
          
         if(xNeu < 10 && xNeu >= 0 && yNeu < 10 && yNeu >= 0)
         {
            this.PositionSetzen(xNeu * 50 + 25, yNeu * 50 + 25);
         }
      }
       
   }
   
   
   `],
   ['GNGFigurTest', `var m = new Männchen();
   m.nachLinksSchauen();
   
   
   class Männchen extends Figur {
   
      void nachLinksSchauen() {
         EigeneFigurLöschen();
         FigurteilFestlegenRechteck(-20, -20, 40, 80, "blau");
         FigurteilFestlegenEllipse(-40, -40, 80, 80, "gelb");
         FigurteilFestlegenDreieck(0, -80, 30, -30, -30, -30, "rot");
         FigurteilFestlegenEllipse(-20, -15, 7, 7, "schwarz");
      }
   
      void nachRechtsSchauen() {
         EigeneFigurLöschen();
         FigurteilFestlegenRechteck(-20, -20, 40, 80, "blau");
         FigurteilFestlegenEllipse(-40, -40, 80, 80, "gelb");
         FigurteilFestlegenDreieck(0, -80, 30, -30, -30, -30, "rot");
         FigurteilFestlegenEllipse(20, -15, 7, 7, "schwarz");
      }
   
      void verschieben(int dx, int dy) {
         PositionSetzen(XPositionGeben() + dx, YPositionGeben() + dy);
      }
   
      @Override void SonderTasteGedrückt(int taste)
      {
         if(taste == 37)
         {
            nachLinksSchauen();
            verschieben(-10, 0);
         }
         else
         {
            if(taste == 38)
            {
               verschieben(0, -10);
            }
            else
            {
               if(taste == 39)
               {
                  nachRechtsSchauen();
                  verschieben(10, 0);
               }
               else
               {
                  if(taste == 40)
                  {
                     verschieben(0, 10);
                  }
               }
            }
         }
      }
   }`],
   ['InputTest', `String s = Input.readString("Name: ");
   println(s);
   `],
   ['Timer-Test', `Timer t = new Timer();

   t.repeat(() -> {
         println("Hello!");
      }, 500); 
   
   t.repeat(() -> {
         println("now!");
      }, 1000); 
   
   Timer.executeLater(() -> {
      t.pause();
      }, 2000);
   
   while (true) {
      
   }`],
   ['JavaHamster', `new World(1000, 1000);
JavaHamsterWorld jhw = new JavaHamsterWorld(10, 4);
jhw.scale(2);
jhw.init("""
mmmmmmmmmm
m 1 2 3 4m
m        m
mmmmmmmmmm
""");

Hamster h = new Hamster(jhw, 1, 1, Hamster.OST, 0);
while (h.vornFrei()) {
   h.vor();
   while (h.kornDa()) {
      h.nimm();
   }
}
h.linksUm(); h.linksUm(); h.linksUm();
h.vor();
while (!h.maulLeer()) {
   h.gib();
}

h.linksUm(); h.linksUm(); h.linksUm();
h.vor();`],
   ['JavaKara', `JavaKaraWorld jkw = new JavaKaraWorld(10, 5);
println(jkw.WEST);
jkw.init("""
tttttttttt
t l  l  lt
tttttttttt
 m m m m 
""");
Kara kara = new Kara(jkw, 1, 1, jkw.EAST);

if(kara.onLeaf()) { kara.removeLeaf(); }
else { kara.putLeaf(); }

while (!kara.treeFront()) {
   kara.move();
   if(kara.onLeaf()) {
      kara.removeLeaf();
   } else {
      kara.putLeaf();
   }
}`],
   ['Processing', `
   new Test();

class Test extends PApplet {
   int i = 0;
   public void draw() {
      clear();
      background(30);
      rect(50 + i++, 50, 100, 100); 
   }
}`],
   ['TurtleTest', `Turtle t = new Turtle();
   t.forward(200);
   t.turn(45);
   t.forward(200);
   t.setBorderColor(0xff0000);
   t.turn(-45);
   t.forward(50);
   `],
   ['TextTest', `Text t = new Text(100, 100, 20, "Hello World!");
   t.setBorderColor(Color.wheat);
   t.setBorderWidth(3);`],
   ['OperatorTest', `int auflösung = 150;

   double left = -2.2;
   double right = 1;
   
   int x = 0;
   
   double r = left + right / auflösung * x;
   
   println(r);`],
   ['Mandelbrot', `// Beispiel: Mandelbrotmenge
// Am besten mit voller Geschwindigkeit starten!
new World(1000, 1000);
int auflösung = 150;
Bitmap bm = new Bitmap(auflösung, auflösung, 0, 0, 1000, 1000);

double left = -2.2;
double right = 1;
double top = 1.6;
double bottom = -1.6;

for (int x = 0; x < auflösung; x++) {
   double r = left + (right - left) / auflösung * x;
   for (int y = 0; y < auflösung; y++) {
      double i = bottom + (top - bottom) / auflösung * y;
      int n = 0;
      double r1 = r; double i1 = i;
      double c;
      double d;
      double l = 0; 
      while (l <= 4.0 && n <= 254) { 
         c = r1;
         d = i1;
         r1 = c * c - d * d + r;
         i1 = 2 * c * d + i;
         l = r1 * r1 + i1 * i1;
         n++;
      }
      int color = n / 16 * 0x80 + n % 16 * 0x10;
      if(n == 255) {
         color = 0;
      }
      bm.setColor(x, y, color, 1.0);
   } 
}

bm.setColor(1, 1, 0xffffff, 1.0);
`],
   ['BitmapTest', `Bitmap bm = new Bitmap(100, 100, 50, 50, 300, 300);

bm.setColor(50, 50, 0x0000ff, 0.5);`],
   ['TransformationTest', `
Circle c = new Circle();

c.move(100, 200);

println(c.getCenterX());
`],
   ['DebuggerTest', `
A a = new A();
a.doIt();

class A extends B {
   String fieldA = "field A";
   void doIt(){
      println(fieldA);
   }
}

class B {
   String fieldB = "field B";
}
`],
   ['ExceptionTest', `
Test t = new Test();

t.t1();

class Test {
   void t1() {
      t2();
   }

   void t2() {
      try {
         t3();
         println("This statement must not be reached.");
      } catch(Exception ex){
         println("Correct!");
      }
      println("After exception handling");
   }

   void t3() {
      throw new Exception("Hello!");
      println("This statement must not be reached.");
   }

}`],
   ['MouseTest', `
new MyRectangle();


class MyRectangle extends Rectangle {
   
   public void onMouseDown(double x, double y, int button) {
      println(x + ", " + y);
   }

   public void onMouseEnter(double x, double y) {
      println("Enter!");
   }

   public void onMouseLeave(double x, double y) {
      println("Leave!");
   }

   public void act() {
      
   }

}
`],
   ['SpriteTest', `

Sprite s = new Sprite(300, 300, SpriteLibrary.Bird, 0);
s.scale(10);
s.setImageIndex(2);

s.playAnimation(new int[]{ 0, 1, 2 }, RepeatType.backAndForth,
   2); 

println();
`],
   ['Particles', `
println("Verändern Sie die Erzeugungsrate der Rechtecke mit dem Geschwindigkeitsregler!");
World g = new World(800, 900);

for(int i = 1; i <= 6000; i++) {
   Particle p = new Particle();
   if(i % 10 == 0) {
      println(i + " Rechtecke sichtbar.");
   }
}

 
class Particle extends Rectangle {

   double vx = Math.random() * 8 - 4;
   double vy = (-1)*Math.random() * 15 - 4;
   double x = 400;
   double y = 850;
   double width = 30;
   double height = 50;
   double vw = Math.random() * 20 - 10;

   public Particle() {
      super(x - width / 2, y - height / 2, width, height);
      setFillColor(Math.floor(Math.random() * 256 * 256 * 256 - 1), Math.random());
      // setBorderColor(null);
   }

   public void act(double time) {
      move(vx, vy);
      rotate(vw);
      scale(1.001);
      vy += 0.04;
       if(isOutsideView()) {
          destroy();
          Particle p = new Particle();
       }
   }


}
`],
   ['GroupTest', `

Rectangle r = new Rectangle(200, 100, 100, 200);
r.move(100, 200);
Rectangle r2 = new Rectangle();
r2.move(100, 200);

Group g = new Group();
g.add(r);
g.add(r2);

g.rotate(30);


Group g2 = new Group();
g2.move(100, 100);
g2.add(g);

g2.scale(2);


g.remove(r);

r.move(10, 10);
`],
   ['synchronizedTest', `
new A().test();


class A {
   synchronized void test(){
      println("Hier");
      synchronized(this){
         for(int i = 0; i < 10; i++){
            println(i);
            if(i == 5) return;
         }
      }
      println("Hallo!");
   }
}`],
   ['switchCaseWithConstant', `
public class A {
   public static final String a = "ABC";
   public static final int x = 5;
 }

 String b = "DEF";
 int y = 4;
 
 switch(b) {
     case A.a: fail("Case A.a must not be reached."); break;
     
     default: switch(y) {
       case 4:
       case 5: assertCodeReached("Didn't reache case 5."); break;
       default: fail("Default case must not be reached."); break;
     }
 }
 assertCodeReached("Code after switch...case-block not reached.");

 print("Here!");

`],
   ['threadTest', `
for(int n = 0; n < 10; n++){
   Thread t = new Thread(new Runnable(){
      void run(){
         for(int i = 0; i < 1000000; i++){
            if(i % 100000 == 0){
               print("T " + n + ": " + i/100000 + ", ");
            }
         }
      }
   });

   t.start();
}


for(int i = 0; i < 1000000; i++){
   if(i % 100000 == 0){
      print("M: " + i/100000 + ", ");
   }
}
`],
   ['sortTest', `
ArrayList<String> list = new ArrayList<>();

list.add("c");
list.add("b");
list.add("a");
list.add("f");
list.add("d");

class StringComparator implements Comparator<String> {
   int compare(String s1, String s2){
      return s1.compareTo(s2);
   }
}

list.sort(new StringComparator());

list.forEach((s) -> {println(s);})`],
   ['ellipsisTest', `
new A().test(12, "Nick", "Emma");



class A {
   void test(int x, String... names){
      println(x);
      for(int i = 0; i < names.length; i++){
         println(names[i]);
      }
   }
}`],
   ['consumerTestWithLambda', `
var list = new ArrayList<String>();

list.add("first");
list.add("second");
list.add("third");


list.forEach((e) -> {println(e);});

println("Fertig!");
`],
   ['consumerTest', `
var list = new ArrayList<String>();

list.add("first");
list.add("second");
list.add("third");

var consumer = new Consumer<String>(){
   void accept(String s){
      println(s);
   }
};


list.forEach(consumer);
`],
   ['iteratorTest', `
class A implements Iterable<String> {
   Iterator<String> iterator(){
      return new Iterator<String>() {
         int counter = 200;
         boolean hasNext(){
            return counter < 210;
         }

         String next(){
            return counter++;
         }
      }
   }
}

for(var n: new A()){
   println(n);
}
`],
   ['forLoopWithIterator', `
var list = new ArrayList<Integer>();

list.add(12);
list.add(13);
list.add(14);

for (Iterator<Integer> i = list.iterator(); i.hasNext(); ) {
    println(i.next());
}`],
   ['enhancedForLoopTest', `
int[] array = {1, 2, 3, 4};

for(var n: array){
   println(n);
}

var list = new ArrayList<Integer>();

list.add(12);
list.add(13);
list.add(14);

for(var n: list){
   println(n);
}`],
   ['dynamicCallingConvention', `
ArrayList<String> arrayList = new ArrayList<String>();
arrayList.add("First");

List<String> list = arrayList;

list.add("Second");


class A<E> extends ArrayList<E> {

   boolean add(E e){
      return super.add(e);
   }


}`],
   ['charAtError', `
String s3 = "Das ist ein Test und noch ein Test";
println(s3.charAt(2));

//assertEquals(s3.charAt(2), 's', "String object charAt not working.");
`],
   ['callingConventions', `
ArrayList<String> arrayList = new ArrayList<String>();
arrayList.add("First");

List<String> list = arrayList;
list.add("Second");


class A<E> extends ArrayList<E> {
   boolean add(E e){
      super.add(e);
   }
}
`],
   ['superconstructorCall', `
new A();

class A {
   A(){
      super();
      println("A's constructor called.");
   }
}

class B {
   B(){
      println("B's constructor called.");
   }
}
`],
   ['super', `
new C().test();


class A {
   void printName(){
      println("Test A");
   }
}

class B extends A {
   void printName(){
      println("Test B");
   }
}

class C extends B {
   void printName(){
      println("Test C");
   }

   void test(){
      printName();
      super.printName();
      super.super.printName();
   }

}`],

   ['arrayLiteral', `
new A().test();

class A {
   int[] a = {1, 2, 7 + 4};

   void test(){
      println(a[2]);
   }

}
`],
   ['cast', `
interface A {}

class B implements A { }

class C extends B { }

C c = new C();

B b = c;

C c1 = (C)b;

A a = c;

C c2 = (C)a;

println("Fertig");`],
   ['switch_case_with_enums', `
enum Test {
   eins, zwei, drei
}

Test t = Test.drei;

switch(t){
   case Test.eins: println("eins!");
   case Test.zwei: println("zwei!");
}

println("Fertig");`],
   ['switch_case', `
class A {
   static final int x = 5;
   static final String y= "XYZ";
}
String s = "XYZ";
switch(s) {
   case A.y: 
   case "PQR": println("A"); break;
   default: println("B"); break;
}
int t = 2;
switch(t) {
   case A.x: break;
   default: println("C");
}
`],
   ['arrayListTest', `
ArrayList<String> list = new ArrayList<String>();

list.add("one");
list.add("two");
list.add("three");

println(list.get(1));

String[] list2 = new String[1];

String[] list3 = list.toArray(list2);

println(list3[2]);


ArrayList<String> [] z = { list, list };
println(z);

int[][] zweiDimensional = {
   { 1, 2, 3 },
   { 4, 5, 6 },
   { 7, 8, 9 }
};

println(zweiDimensional);
`],
   ['genericParameterTest', `
interface I1<T> {
   void doIt(T t);
}

class C1 implements I1<String> {
   void doIt(String x){
      println("Hier");
   }
}

C1 x = new C1();
I1 y = x;

y.doIt("Test");`],
   ['genericMethodTest1', `
Test te = new Test();
Integer i = Integer.valueOf(10);

te.test(i);

class Test <T super Integer> {
   <S extends Integer> void test(S y){
      
      y.toString();
   }
} `],
   ['lambdaTest2', `
interface TestInterface {
   int foo(int n);
}


TestClass tc = new TestClass();
tc.bar(x -> x * 2);


class TestClass {
   void bar(TestInterface t){
      println(t.foo(10));
   }
}
`],
   ['lambdaTest', `
interface TestInterface {
   int foo(int n);
}

TestInterface t = (x) -> { return x * 2; };

println(t.foo(3));
 `],
   ['anonymousInnerClassTest', `
A a = new A();
Test t = a.test();
t.doIt();

class A {
   int i = 10;

   Test test(){

      int j = 20;

      return new Test(){
         void doIt(){
            println("Hier!");
            println(i);
            println(j);
         }
      };

   }

}

interface Test {
   void doIt();
}
    `],
   ['innerClassesTest', `
   A a = new A();
   A.B b = a.getB();
   println(b.getOuterI());
   a.i = 20;
   println(b.getOuterI());
   
   A.B.C c = new A.B.C();
   println(c.getOuterI());
   println(c.getOuterJ());
   
   
   class A {
      int i = 10;
   
      class B {
         
         int j = 100;
   
         int getOuterI(){
            return i;
         }
   
         class C {
           int getOuterJ(){
               return j;
           }
   
           int getOuterI(){
               return i;
           }
         }
   
      }
   
      B getB(){
         return new B();
      }
   
   
   }
`],
   ['simpleGenericsTest', `
A<String> a = new A<String>();
a.set("Test");
println(a.get());

class A<T> {
   T obj;
   
   T get(){
      return obj;
   }

   void set(T t){
      obj = t;
   }
}

`],
   ['staticFieldsTest', `
A a = new A();
a.test();

class A {
   static int x;
   int y;

   void test(){
      println("x: " + x + ", y: " + y);
   }
}
`],
   ['interfaceTest', `
T t = new T();
t.def();

S s = new S();
s.def();

interface Test {
   int doIt(String s);

   default void def(){
      println("Hier!" + doIt("Test"));
   }
}

class T implements Test {
   int doIt(String s){
      return 10;
   }
} 


class S implements Test {
   int doIt(String s){
      return 20;
   }
}`],
   ['enumTest', `
println(Test.eins.x);

enum Test {
   eins(5), zwei(10), drei(20);
   int x;
   private Test(int wert){
      x = wert;
   }
}
`],
   ['singleStepTest', `
println("A");
println("B");
println("C");
println("D");
println("E");
println("F");
println("G");
println("H");
println("I");
`],
   ['fieldTest', `

A a = new A();
a.privateA = 12;
a.protectedA = 12;
a.publicA = 14;

class A extends B {
   private int privateA;
   protected int protectedA;
   int publicA;

   void doIt(){
      privateA = 10;
      protectedA = 12;
      publicA = 14;
   }
}

class B {
   private int privateB;
   protected int protectedB;
   int publicB;

   void doIt(){
      publicA = 10;
   }
}
`],
   ['tryCatchTest', `
A a = new A();
a.testA();
println("Main program continues...");

class A {
   void testA(){
      println("Before try");
      try {
         println("before Exception");
         testB();
         println("after Exception");
      } catch(Exception ex){
         println("catch " + ex.getMessage());
      } finally{
         println("finally...");
      }
      println("After try-block");
   }

   void testB(){
      println("Method B begins");
      try {
         throw new Exception("TestException");
         println("After Exception b");
      } catch(MyException ex1){
         println("catch-Block b:" + ex1.getMessage());
      } finally {
         println("finally b...");
      }
   }
}


class MyException extends Exception {

}

`],
   ['stringTest', `
String s = "A";

new StringTest().test(s);

println("z" + s);



class StringTest {
   void test(String s1){
      println("x" + s1);
      s1 = "B";
      println("y" + s1);
   }
} 
`],
   ['hanoi', `
Hanoi h = new Hanoi();
h.erkläreLösung(1, 3, 4);    // Erkläre, wie man 4 Scheiben von Turm 1 zu Turm 3 bringt.

class Hanoi {

   void erkläreLösung(int startTurmNummer, int zielTurmNummer, int n) {
      if(n == 0) {
         return;
      }

      int übrigerTurmNummer = 6 - startTurmNummer - zielTurmNummer;
      
      erkläreLösung(startTurmNummer, übrigerTurmNummer, n - 1);
      println("Bewege eine Scheibe von Turm " + startTurmNummer + " zu Turm " + zielTurmNummer); 
      erkläreLösung(übrigerTurmNummer, zielTurmNummer, n - 1);
   }

}`],
   ['simpleClass', `
Test m = new Test();
int i = m.doIt("Hier!");

println(i);

class Test {
   int i = 12;
   int j = i + 7;
   public int doIt(String s){
      for(int k = 0; k < 10; k++){
         print(k + ", ");
      }
      println(s);
      return j;
   }
}
`],
   ['simpleWhileLoops', `
int i = 0;
while(i < 100){
    int j = 0;
    while(j < 100){
        j++;
    }
    i++;
    if(i % 10 == 0){
    print(i + "; ");
    }
}
`],
   ['arrayIndices', `
int[] test = new int[10];
test[5] = 2;
println(test[5]);
`],
   ['forLoop', `
for(int i = 0; i < 10; i++){
    print(i + ", ");
}
`],
   ['primzahlzwillinge', `int max = 100000;
boolean[] isPrime = new boolean[max];
for(int i = 0; i < max; i++) {
   isPrime[i] = true;
}

int i = 2;
while(i < max) {
   // Vielfache von i streichen
   int j = 2 * i;
   while(j < max) {
      isPrime[j] = false;
      j += i;
   }

   i++;
   while(i < max && !isPrime[i]) {
      i++;
   }
}

int k = 0;
for(int i = 0; i < max - 2; i++) {
   if(isPrime[i] && isPrime[i + 2]) { 
      print(i + "/" + (i + 2) + "; ");
      k++;
      if(k % 10 == 0) {
         println();
      } 
   }
}

println();
println(k + " Primzahlzwillinge gefunden!");`],

   ['testFuerListe', `class Test {
      @Test
      void leereListe() {
         MyList l = new MyList();
         assertEquals(0,l.size(), "Leere Liste hat Länge 0.");
      }
   
      @Test
      void zweiElemente() {
         MyList l = new MyList();
         l.push("ABC");
         l.push("DEF");
         assertEquals(2,l.size(), "Liste hat Länge 2.");
      }
   
      @Test
      void firstInFirstOut() {
         MyList l = new MyList();
         l.push("A");
         l.push("B");
         l.push("C");
         assertEquals("A",l.poll().orElse(""), "A wurde zuerst eingefügt.");
         assertEquals("B",l.poll().orElse(""), "Nach A wurde B eingefügt.");
         assertEquals("C",l.poll().orElse(""), "Nach B wurde C eingefügt.");
      }
   
      @Test
      void pushPollSizeTest() {
         MyList l = new MyList();
         for(int i=0; i<20;i++) {
            l.push("A");
         }
         for(int i=0; i<15;i++) {
            l.poll();
         }
         assertEquals(5,l.size(),"20-15=5");
      }
   
   }`],
   ['listeVorlage',
      `// Ergänze die folgende Vorlage, so dass die Klasse eine Liste nach dem FIFO - Prinzip implmentiert.
class MyList {
   int size;
   // Ergänze weitere Attribute

   MyList() {
      // Hier soll eine leere Liste erzeugt werden.
   }

   // Diese Methode fügt der Liste "hinten" ein Element an.
   void push (String e) {

   }

   // Diese Methode entnimmt der Liste "vorne" ein Element.
   Optional<String> poll () {
      return Optional.empty();
   }

   // Gibt die Länge der Liste zurück.
   int size() {
      return 0; // TODO: Füge korrekte Implementierung ein. 
   }
} 
`]];
