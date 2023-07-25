#!/bin/bash
for file in ./src/*.js; do
    echo ${file}
    awk -v RS= '/^import/' ${file}
    awk -v RS= '/^export/' ${file}
    printf "\n"
done
