# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

# Собрать dev
docker build -t frontend-dev -f Dockerfile.dev .

# Запустить dev
docker run -p 8080:5173 `
>>   -v ${PWD}:/app `
>>   -v /app/node_modules `
>>   -e CHOKIDAR_USEPOLLING=true `
>>   frontend-dev