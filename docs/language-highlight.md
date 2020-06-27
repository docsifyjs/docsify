# language highlight

**docsify** uses [Prism](https://github.com/PrismJS/prism) to highlight code blocks in your pages. By default it only supports CSS, JavaScript and HTML. You can make **Prism** load additional languages:

```html
<script src="//cdn.jsdelivr.net/npm/docsify/lib/docsify.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/prismjs/components/prism-bash.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/prismjs/components/prism-php.min.js"></script>
```

To use the new languages, make sure the code block label matches the part after `prism-` in the file name. FOr example, for `prism-bash.js` write a code block labeled with `bash` like this:

````
```bash
echo "hello"
```
````

?> Note that with GitHub-flavored markdown, `sh` and `bash` are effectively aliases of each other, but this is not the case with Prism. So using `sh` will not enable `bash` syntax in this case.

For `prism-php.js`, it would be:

````
```php
function getAdder(int $x): int 
{
    return 123;
}
```
````

?> Check the [component files](https://github.com/PrismJS/prism/tree/gh-pages/components) list for more options.
