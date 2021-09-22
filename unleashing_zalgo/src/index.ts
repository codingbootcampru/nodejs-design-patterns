import ErrnoException = NodeJS.ErrnoException;
import * as fs from "fs";
import * as path from "path";

console.log("hi from index.ts");

const cache: Record<string, string> = {};

type TCallback = (s: string) => void;

function inconsistentRead(filename: string, callback: TCallback) {
    if (cache[filename]) {
        //invoked synchronously
        callback(cache[filename]);
    } else {
        //asynchronous function
        fs.readFile(filename, "utf8", (err: ErrnoException, data: string) => {
            if (err) {
                console.error(err);
                return;
            }
            cache[filename] = data;
            callback(data);
        });
    }
}

const fileToRead = path.join(process.cwd(), "files", "file1.txt");

console.log(1001);
inconsistentRead(fileToRead, (str: string) => {
    console.log("RESULT:");
    console.log(str);
    console.log(1003);
    inconsistentRead(fileToRead, (str: string) => {
        console.log("RESULT2:");
        console.log(str);
    })
    console.log(1004);
})
console.log(1002);

// function createFileReader(filename: string) {
//     const listeners: any[] = [];
//     inconsistentRead(filename, value => {
//         listeners.forEach(listener => listener(value));
//     });
//
//     return {
//         onDataReady: listener => listeners.push(listener)
//     };
// }

// inconsistentRead()
