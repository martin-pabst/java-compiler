export var testPrograms = {
simpleWhileLoops: `
int i = 0;
while(i < 100){
    int j = 0;
    while(j < 10000){
        j++;
    }
    i++;
    print(i + "; ");
}
`
}