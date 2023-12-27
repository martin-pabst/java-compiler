import { createLogger } from 'vite';
import { UserConsoleLog } from 'vitest';
import { defineConfig } from 'vitest/config'
import { DefaultReporter, VerboseReporter } from 'vitest/reporters'

class MyDefaultReporter extends VerboseReporter {
    constructor(){
        super();
    }

    onCollected() {
        const files = this.ctx.state.getFiles(this.watchFilters)
        // const errors = this.ctx.state.getUnhandledErrors()
        // this.reportTestSummary(files, errors)
        
        // this.ctx.logger.log(files)
        super.onCollected()
      }

      async onFinished(files?, errors?: unknown[]): Promise<void> {
        super.onFinished(files, errors);
      }

      onUserConsoleLog(log: UserConsoleLog): void {
        super.onUserConsoleLog(log);
      }
      
    
}

export default defineConfig({
    test: {
        reporters: [new MyDefaultReporter()]
        // reporters: ["default"]
      }
    
    
})