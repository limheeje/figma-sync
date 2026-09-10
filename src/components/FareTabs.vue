<script setup lang="ts">
import { ref } from 'vue'

const tabs = ['항공운임', '개인할인', '수수료 및 위약금']
const active = ref(0)
</script>

<template>
  <!-- Figma: 텝 / TAP_Serise (6:6764 / 6:6766) -->
  <div class="tabs-area" data-node-id="6:6764">
    <div class="tabs" data-node-id="6:6766" role="tablist">
      <button
        v-for="(label, i) in tabs"
        :key="label"
        type="button"
        role="tab"
        class="tab"
        :class="{ 'tab--active': i === active }"
        :aria-selected="i === active"
        @click="active = i"
      >
        {{ label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.tabs-area {
  height: 100px; /* TAP_Serise 60 + 40 below */
}

.tabs {
  display: flex;
  align-items: center;
  width: 1200px;
}

.tab {
  flex: 1 0 0;
  min-width: 80px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;
  background: var(--parata-white);
  border: 1px solid var(--parata-gray50-500);
  border-left: none;
  /* Pretendard/18 26 B */
  font-weight: 700;
  font-size: 18px;
  line-height: 26px;
  color: var(--parata-black-40);
  white-space: nowrap;
  cursor: pointer;
}

.tab:first-child {
  border-left: 1px solid var(--parata-gray50-500);
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

.tab:last-child {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

.tab--active {
  position: relative;
  z-index: 1;
  padding: 10px 25px;
  border: 1px solid var(--parata-navy);
  color: var(--parata-navy);
}

/* 첫 번째 탭이 활성일 때 왼쪽 테두리도 navy (.tab:first-child 보다 우선) */
.tab--active:first-child {
  border-left: 1px solid var(--parata-navy);
}
</style>
