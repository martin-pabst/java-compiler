export var testPrograms = {
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