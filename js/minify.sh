#!/bin/bash
cd tools && php ./compile_js.php && cd ../ && php loader.php > combined.js
