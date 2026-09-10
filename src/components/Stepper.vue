<script setup lang="ts">
/* Figma: 8:7541 — − [값] + (값 필드 안, 좌우 아이콘 120px) */
import minusIcon from '../assets/ic-minus.svg'
import plusIcon from '../assets/ic-plus.svg'

const model = defineModel<number>({ default: 0 })
const props = withDefaults(defineProps<{ min?: number; max?: number }>(), {
  min: 0,
  max: Infinity,
})

function dec() {
  if (model.value > props.min) model.value--
}
function inc() {
  if (model.value < props.max) model.value++
}
</script>

<template>
  <div class="stepper">
    <button type="button" class="btn" aria-label="감소" @click="dec">
      <img :src="minusIcon" alt="" />
    </button>
    <span class="value">{{ model }}</span>
    <button type="button" class="btn" aria-label="증가" @click="inc">
      <img :src="plusIcon" alt="" />
    </button>
  </div>
</template>

<style scoped>
.stepper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  overflow: hidden;
}

.btn {
  width: 120px;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.btn img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.value {
  flex: 1;
  text-align: center;
  font-size: 33px;
  letter-spacing: -0.66px;
  color: var(--cj-primary);
}
</style>
