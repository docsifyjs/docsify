#!/bin/bash
mv ./docs/index.html index.html 
sed -i 's|docsify.min.js|docsify.js|g' index.html
sed -i 's#//cdn.jsdelivr.net/npm/docsify@4##g' index.html
sed -i "s|\(name: 'docsify',\)|\1 basePath: '\/docs\/',|g" index.html
cat index.html