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
`
}