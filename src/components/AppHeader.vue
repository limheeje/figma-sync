<script setup lang="ts">
/* Figma: Frame 1 헤더 (8:7520 등) — 전 화면 공통 */
import { useRouter } from 'vue-router'
import homeIcon from '../assets/ic-home.svg'
import kebabIcon from '../assets/ic-kebab.svg'

defineProps<{ title: string }>()
const router = useRouter()
</script>

<template>
  <header class="app-header">
    <p class="title">{{ title }}</p>
    <button class="home" type="button" aria-label="홈" @click="router.push('/login')">
      <img :src="homeIcon" alt="" />
    </button>
    <button class="kebab" type="button" aria-label="메뉴">
      <img :src="kebabIcon" alt="" />
    </button>
  </header>
</template>

<style scoped>
.app-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--header-h);
  background: var(--cj-color3);
  overflow: hidden;
}

.title {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-cj-bold);
  font-size: 33px;
  color: var(--cj-white);
  white-space: nowrap;
}

.home,
.kebab {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.home {
  right: 42px;
  width: 60px;
  height: 60px;
}

.kebab {
  right: 12px;
  width: 8px;
  height: 40px;
}

.home img,
.kebab img {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
