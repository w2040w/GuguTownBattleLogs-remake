#!/bin/bash
cat head.js > battlelog.user.js
cat dist/bundle.js >> battlelog.user.js
echo "})()" >> battlelog.user.js
