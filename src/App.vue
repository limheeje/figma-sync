<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <!-- 720×1440 고정 디바이스 프레임 -->
  <div class="device">
    <RouterView :key="route.path" />
  </div>
</template>

<style scoped>
.device {
  width: var(--screen-w);
  height: var(--screen-h);
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  background: var(--cj-color1);
}
</style>
