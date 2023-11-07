export var testPrograms = {
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
`
}