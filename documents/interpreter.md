## Interpreter
  * states (stopped, running, paused)
  * scheduler to facilitate concurrent threads
  * threads have states: ready, running, suspended, finished
  * clock is based on OpenGL-clock
  * exceptions: 
    * exception-stack for each thread on which exception-objects get pushed on entering a try-block and popped on leaving a try-block
    * exception-object contains of string[] with identifiers of handled exceptions and links to catch- and finally-sections
    * if a exception gets thrown:
      * a) pull exception-object from exception-stack
      * b) if thrown exception is handled by this exception-object: execute it's catch-block, then it's finally-block and then go on excecuting after this try-catch-statement (exception-handling finished) 
      * b) if not: execute it's finally-method and continue with a)
  * synchronized methods, semaphors
    * each java object can act as semaphor, so it has 
      * maxPermits: int   (max number of concurrent threads inside synchronized code-block)
      * permitsIssued: int (number of concurrent threads currently running inside synchronized code block)
      * suspendedThreadList: Thread[] (list of threads currently waiting to enter synchronized code block)
    * on entering a synchronized section of code: 
      * check if permitsIssued < maxPermits
        * if true: permitsIssued++, enter code block
        * if false: add thread to list of suspended threads and suspend it.
    * on leaving a synchronized section of code:
      * permitsIssued--
      * if !suspendedThreadList.isEmpty(): take longest waiting thread from list and resume it
  * act-methods: ensure that each act-method is not running simultaneously in several threads:
    * global list of objects with active act-methods
    * global set of currently running act-methods
    * each 1/30 s: 
      * foreach object with active act-method: if not currently running start thread for it and add it to list of currently running act-methods
      * each thread has a list of events which get called after thread is finished. Use this to ensure that act-method is deleted from set of currently running act-methods if finished.    
