import { JavaScriptExecutor } from '../handler/JavaScriptExecutionHandler';

const helloWorldTestCode = `console.log("Hello World!")`;

const codeThatWillThrowAnError = `throw new Error("This is an error")`;

const fiveSecondCountingTestCode = `
function delay(x) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, x);
    });
}

let i = 0;
while (i <= 5) {
    await delay(1000);
    console.log(\`\${i}\`);
    i++;
}
`;

(async () => {
    // Executing a test with a hello world code
    console.log('Executing test with a hello world code...');
    // Since this test code runs synchronously, no callback is needed
    let firstResult = await new JavaScriptExecutor(helloWorldTestCode, require).executes()

    // Log the state of the first result
    console.log(firstResult.getState());

    // Executing a test with a code that will throw an error
    console.log('Executing test with a code that will throw an error...');
    let secondResult = await new JavaScriptExecutor(codeThatWillThrowAnError, require).executes();
    
    // Log the state of the second result
    console.log(secondResult.getState());

    // Executing a test with a two-second counting code
    console.log('Executing test with a five-second counting code...');
    let thirdResult = await new JavaScriptExecutor(fiveSecondCountingTestCode, require).executes(async (executor: JavaScriptExecutor, logger: Function) => {
        // Log the state of the executor
        if (executor.getState().consoleOutput !== "") {
            let LastLog = executor.getState().consoleOutput.split('\n')[executor.getState().consoleOutput.split('\n').length - 1];
            logger(LastLog);
        };
    });    
    
    // Log the state of the third result
    console.log(thirdResult.getState());

    console.log('instances: ', JavaScriptExecutor.Instances);
})();