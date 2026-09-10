<script setup lang="ts">
defineProps<{ heading: string; note?: string }>()
</script>

<template>
  <!-- Figma: 중간타이틀 (6:6768) -->
  <div class="section-title" data-node-id="6:6768">
    <p class="heading" data-node-id="6:6769">{{ heading }}</p>
    <p v-if="note" class="note" data-node-id="6:6770">{{ note }}</p>
  </div>
</template>

<style scoped>
.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  padding: 28px 10px 20px 0;
  white-space: nowrap;
}

/* Pretendard/H5 — Bold 23 / 32 */
.heading {
  margin: 0;
  font-weight: 700;
  font-size: 23px;
  line-height: 32px;
  color: var(--parata-navy);
}

/* Pretendard/15 22 — Regular */
.note {
  margin: 0;
  font-weight: 400;
  font-size: 15px;
  line-height: 22px;
  color: var(--parata-gray50-500);
}
</style>
