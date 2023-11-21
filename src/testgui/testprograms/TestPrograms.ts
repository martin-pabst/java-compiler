export var testPrograms = {
hanoi:`
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

}`,
simpleClass:`
Test m = new Test();
int i = m.doIt("Hier!");

println(i);

class Test {
   int i = 12;
   int j = i + 7;
   public int doIt(String s){
      println(s);
      return j;
   }
}
`,
simpleWhileLoops: `
int i = 0;
while(i < 10000){
    int j = 0;
    while(j < 10000){
        j++;
    }
    i++;
    if(i % 1000 == 0){
    print(i + "; ");
    }
}
`,
arrayIndices: `
int[] test = new int[10];
test[5] = 2;
println(test[5]);
`,
forLoop:`
for(int i = 0; i < 10; i++){
    print(i + ", ");
}
`,
primzahlzwillinge:`int max = 100000;
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
println(k + " Primzahlzwillinge gefunden!");`
}