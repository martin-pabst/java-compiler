class Test {


    async toString():Promise<string>  {

        let s: string = "begin";

        s += await this.method2();


        return "";

    }


    method2(): Promise<string> {

        let p = new Promise<string>((resolve: (value: string) => void, reject: (reason: any) => void) => {

        });

        return p;

    }



}




document.onload = () => {

    console.log("Hello world!");


}