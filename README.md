
# fs-force-mkdir

## Requirements

 * Node >= 6.0.0

## Usage

```javascript
var mkdir = require('fs-force-mkdir');
mkdir('./a/b/c', (error, info) => {
    if (error) {
        console.error('Failed');
    } else {
        console.log('Succeed');
    }
});
```

The code above would check for existence of `'./a'`, `'./a/b'` and `'./a/b/c'`,
 * If one is a directory, `mkdir` skip this directory and check the next
 * If one doesn't exist, `mkdir` would creates it as a empty directory
 * If one is a file, `mkdir` would deletes that file and creates a directory with the same name

## License

[MIT](https://github.com/ksxnodemodules/my-licenses/blob/master/MIT.md) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
