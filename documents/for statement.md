```javascript
for(int i = 10; i < 100; i++){
    block;
}

// translates to
int i = 20;
Label1:
if(!i < 100){
    jump Label2;
}
block;
i++;
jump Label1

Label2:
continue...




```