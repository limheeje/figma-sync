<script setup lang="ts">
/* Figma: 8:7601–8:7610 — 오버레이 + 아이콘 + 메시지 + [아니오 | 예] 2버튼 */
import dialogIcon from '../assets/ic-dialog.svg'

defineProps<{
  lines: string[]
  noLabel?: string
  yesLabel?: string
}>()
defineEmits<{ (e: 'no'): void; (e: 'yes'): void }>()
</script>

<template>
  <div class="overlay" data-node-id="8:7601">
    <div class="dialog" data-node-id="8:7602">
      <div class="body" data-node-id="8:7603">
        <img :src="dialogIcon" alt="" class="icon" />
        <p class="msg">
          <template v-for="(line, i) in lines" :key="i">
            {{ line }}<br v-if="i < lines.length - 1" />
          </template>
        </p>
      </div>
      <div class="buttons">
        <button type="button" class="btn no" @click="$emit('no')">
          {{ noLabel ?? '아니오' }}
        </button>
        <button type="button" class="btn yes" @click="$emit('yes')">
          {{ yesLabel ?? '예' }}
        </button>
      </div>
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

.dialog {
  width: 696px;
  margin: 0 12px;
}

.body {
  position: relative;
  height: 341px;
  border-radius: var(--radius) var(--radius) 0 0;
  background: var(--cj-white);
  overflow: hidden;
}

.icon {
  position: absolute;
  left: 50%;
  top: 66.5px;
  transform: translateX(-50%);
  width: 80px;
  height: 81px;
}

.msg {
  position: absolute;
  left: 50%;
  top: calc(50% + 27px);
  transform: translateX(-50%);
  font-size: 33px;
  color: var(--cj-font1);
  text-align: center;
  white-space: nowrap;
}

.buttons {
  display: flex;
}

.btn {
  width: 348px;
  height: var(--row-h);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--cj-gray6);
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
  font-family: var(--font-cj-bold);
  font-size: 33px;
  color: var(--cj-white);
  cursor: pointer;
}

.btn.no {
  background: var(--cj-gray6);
  border-radius: 0 0 0 var(--radius);
}

.btn.yes {
  background: var(--cj-primary);
  border-color: var(--cj-primary-dark);
  border-radius: 0 0 var(--radius) 0;
}
</style>
