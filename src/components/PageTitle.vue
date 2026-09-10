<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <!-- Figma: 예약조회 및 컨텐츠 타이틀 영역 (6:6763) -->
  <div class="page-title" data-node-id="6:6763">
    <div class="inner" data-node-id="I6:6763;1528:34628">
      <p class="text" data-node-id="I6:6763;1528:34629">{{ title }}</p>
    </div>
  </div>
</template>

<style scoped>
.page-title {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding-bottom: 80px;
}

.inner {
  display: flex;
  align-items: center;
  width: 1200px;
  height: 52px;
  padding-bottom: 10px;
}

/* Pretendard/H3 — Bold 28 / 42 */
.text {
  margin: 0;
  font-weight: 700;
  font-size: 28px;
  line-height: 42px;
  color: var(--parata-navy);
  white-space: nowrap;
}
</style>
