# HTMLSmuggler
Automatically generate HTML or SVG smuggles payloads

## Usage
Just run
`node autosmuggler.cjs -i karl.webp -o html` or `node autosmuggler.cjs -i karl.webp -o svg`

## TODO
I want to add some better obfuscation to the base64 and some more obfuscation. My idea would be to utilize browser tools like localstorage and websql to move some of the blob out of the DOM, which will help lessen detection by analysts reviweing the code. 
After download of file the code should auto remove itself to evade analysis better.
- [ ] Better evasion - auto del code after download 
- [ ] harder detection - move some code to localstorage + websql 
