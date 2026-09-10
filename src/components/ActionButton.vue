<script setup lang="ts">
/* Figma: 하단 버튼 (8:7528 "피킹 완료" 등) — 화면 하단 고정 */
defineProps<{ label: string }>()
defineEmits<{ (e: 'click'): void }>()
</script>

<template>
  <button class="action-button" type="button" @click="$emit('click')">
    {{ label }}
  </button>
</template>

<style scoped>
.action-button {
  position: absolute;
  left: var(--pad-x);
  right: var(--pad-x);
  bottom: 13px;
  height: var(--row-h);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--cj-primary-dark);
  border-radius: var(--radius);
  background: var(--cj-primary);
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
  font-family: var(--font-cj-bold);
  font-size: 33px;
  color: var(--cj-white);
  white-space: nowrap;
  cursor: pointer;
}
</style>
