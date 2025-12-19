<script setup lang="ts"></script>

<template>
  <v-layout class="fill-height overflow-hidden">
    <AppHeader/>

    <v-main class="fill-height">
      <CanvasBoard/>
      <Toolbar/>
    </v-main>

    <RightPanel/>
  </v-layout>
</template>

<script setup>
;
</script>

<style>
  body, #app {
    height: 100vh;
    width: 100vw;
  }
</style>
