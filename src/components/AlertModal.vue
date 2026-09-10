<script setup lang="ts">
/* Figma: 8:7513–8:7518 — 어두운 오버레이 + 흰 박스 + 파란 확인 버튼 (단일 버튼) */
defineProps<{ message: string; confirmLabel?: string }>()
defineEmits<{ (e: 'confirm'): void }>()
</script>

<template>
  <div class="overlay" data-node-id="8:7513">
    <div class="modal" data-node-id="8:7514">
      <div class="body" data-node-id="8:7515">
        <p>{{ message }}</p>
      </div>
      <button class="confirm" type="button" data-node-id="8:7517" @click="$emit('confirm')">
        {{ confirmLabel ?? '확인' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
}

.modal {
  width: 696px;
  margin: 0 12px;
}

.body {
  height: 341px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  border-radius: var(--radius) var(--radius) 0 0;
  background: var(--cj-white);
  font-size: 33px;
  color: var(--cj-font1);
  text-align: center;
}

.confirm {
  width: 100%;
  height: var(--row-h);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--cj-primary-dark);
  border-radius: 0 0 var(--radius) var(--radius);
  background: var(--cj-primary);
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
  font-family: var(--font-cj-bold);
  font-size: 33px;
  color: var(--cj-white);
  cursor: pointer;
}
</style>
