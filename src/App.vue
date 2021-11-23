<script setup lang="ts">
import { reactive, toRefs } from 'vue';
import Index from './components/index.vue';
import { serverList } from './config';

const data: { servers: server[] } = reactive({
  servers: serverList
});

const { servers } = toRefs(data);

if (import.meta.env.VITE_SERVERS) {
  servers.value = JSON.parse(import.meta.env.VITE_SERVERS.toString());
}
console.log();
</script>

<template>
  <Index v-for="i in servers" :serverName="i.name" :api="i.api" />
</template>

<style lang="stylus">
html,body,#app
  height: 100%
  padding: 0
  margin: 0

#app
  font-family: 'Noto Sans', sans-serif;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  >div
    margin 0 10px

div
  margin 0
  padding 0

.icon
  font-size: 26px
</style>
