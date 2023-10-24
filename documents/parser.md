# Parser



Term

## Method invocation:
Term starts with /identifier/ "(" 

## casting
"("Type")" term => casting^
  * Problem: "(" /identifier/ ")" may be a valid term
  * Solution: look for "(" /any combination of identifier, ., < and >/ ")" /No binary operator/
  * We have to scan forward until we find ")" and the following token...


## Lambda function
"(" /comma separated List of Parameter declarations, maybe without types/ ")" "=>"
  * Solution: scan to find ")" and next token


