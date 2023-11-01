#Templating-System, Snippets
```javascript
  a + (b + 1) * C.d(E, B)
      'b' -> false
          '1' -> false
     '(b + 1)' -> false

                C -> true
                    E -> true
                    B -> true             
                emit(B), emit(E), emit(C), emit(pop().d(pop(), pop())) -> true
                <NextStep>
      combine((b+1) * pop())
combine(a + (b+1) * pop())

```