

```javascript
// ohne else
if(!condition){
    jump l1;


}
// statements if true
// ----
L1: ...


```

```javascript
// mit else
if(!condition){
    jump l1;

}
    // statements if true

    jump l2:
// ----
L1: ...
    // statements if false


L2: ...
```