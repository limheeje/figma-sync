<script setup lang="ts">
/* Figma: 상품투입(720*1440) — 8:7612 (red) / 8:7684 (blue) 피킹면 케이스 */
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import FieldList, { type Field } from '../components/FieldList.vue'
import ActionButton from '../components/ActionButton.vue'

const route = useRoute()
const router = useRouter()

const face = computed(() => (route.query.face === 'blue' ? 'blue' : 'red'))

const fields: Field[] = [
  { key: 'amrId', label: 'AMR ID', value: 'AMR_001' },
  { key: 'location', label: '상품위치', value: 'A01-02-02' },
  { key: 'face', label: '피킹면', height: 108, bare: true },
  { key: 'boxList', label: '박스 목록', height: 562, bare: true },
  { key: 'productBarcode', label: '상품 바코드', value: '상품 바코드를 스캔하세요' },
  { key: 'boxId', label: '박스 ID', value: '박스 바코드를 스캔하세요' },
]

type Cell = { v: string; tone?: 'accent' | 'muted' }
const rows: Cell[][] = [
  [{ v: '1', tone: 'accent' }, { v: '3', tone: 'accent' }, { v: '0' }],
  [{ v: '0' }, { v: '3' }, { v: '0' }],
  [{ v: '0' }, { v: '3', tone: 'muted' }, { v: '0' }],
  [{ v: '3' }, { v: '0' }, { v: '3' }],
  [{ v: '0' }, { v: '0' }, { v: '0' }],
]
</script>

<template>
  <div class="screen" :class="`face-${face}`">
    <AppHeader title="상품투입" />

    <FieldList :fields="fields">
      <template #face>
        <div class="face-box">1면</div>
      </template>

      <template #boxList>
        <div class="box-grid">
          <div class="cell head">박스<br />NO</div>
          <div class="cell head">투입<br />수량</div>
          <div class="cell head">지시<br />수량</div>
          <template v-for="(r, ri) in rows" :key="ri">
            <div
              v-for="(c, ci) in r"
              :key="ci"
              class="cell"
              :class="c.tone"
            >
              {{ c.v }}
            </div>
          </template>
        </div>
      </template>
    </FieldList>

    <ActionButton label="투입완료" @click="router.push('/complete')" />
  </div>
</template>

<style scoped>
.screen {
  width: 100%;
  height: 100%;
  background: var(--cj-color1);
  --face-color: #ea1622; /* 기본칼라1 — 강조 숫자 */
  --face-box-bg: var(--cj-near-black); /* 피킹면 박스 8:7628 */
}
.screen.face-blue {
  --face-color: var(--cj-primary);
  --face-box-bg: var(--cj-primary);
}

.face-box {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--cj-gray6);
  border-radius: var(--radius);
  background: var(--face-box-bg);
  color: var(--cj-white);
  font-size: 33px;
  letter-spacing: -0.99px;
}

.box-grid {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  border: 1px solid var(--cj-gray6);
  border-radius: var(--radius);
  background: var(--cj-white);
  overflow: hidden;
}

.cell {
  width: calc(100% / 3);
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-bottom: 1px solid var(--cj-gray6);
  border-right: 1px solid var(--cj-gray6);
  font-size: 33px;
  letter-spacing: -0.66px;
  color: var(--cj-font1);
  text-align: center;
  line-height: 1.1;
}
.cell:nth-child(3n) {
  border-right: none;
}
.cell.head {
  height: 112px;
  font-family: var(--font-cj);
}
.cell.accent {
  color: var(--face-color);
}
.cell.muted {
  background: var(--cj-gray4);
  color: var(--cj-gray7);
}
</style>
