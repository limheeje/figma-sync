<script setup lang="ts">
/* Figma: Frame 27 + Frame 28 (8:7530 / 8:7547) — 라벨 열 + 값 열
   각 행 = [라벨 알약 168px] [값 필드 flex] */
export interface Field {
  key: string
  label: string
  value?: string
  accent?: boolean // 값을 파란색으로 (예: 총 수량)
  disabled?: boolean // 라벨을 흐리게 (opacity 23%) — 비활성 행
  height?: number // 행 높이 override (기본 108)
  bare?: boolean // 값 셀의 기본 배경/보더/패딩 제거 (커스텀 슬롯용)
}

defineProps<{
  fields: Field[]
  /** 본문 시작 y (기본 132 = 헤더 90 + 42) */
  top?: number
}>()
</script>

<template>
  <div class="field-list" :style="{ top: (top ?? 132) + 'px' }">
    <div
      v-for="f in fields"
      :key="f.key"
      class="row"
      :style="{ height: (f.height ?? 108) + 'px' }"
    >
      <div class="label" :class="{ disabled: f.disabled }">{{ f.label }}</div>
      <div class="value" :class="{ accent: f.accent, bare: f.bare }">
        <slot :name="f.key" :field="f">{{ f.value }}</slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.field-list {
  position: absolute;
  left: var(--pad-x);
  right: var(--pad-x);
  display: flex;
  flex-direction: column;
  gap: var(--row-gap);
}

.row {
  display: flex;
  gap: var(--row-gap);
}

.label {
  width: var(--label-col-w);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: var(--radius);
  background: var(--cj-gray2);
  font-size: 33px;
  letter-spacing: -0.66px;
  color: var(--cj-font1);
  text-align: center;
}

.label.disabled {
  /* Figma 9:58 — 텍스트만 23% (배경 알약은 유지) */
  color: color-mix(in srgb, var(--cj-font1) 23%, transparent);
}

.value {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  padding: 0 var(--pad-x);
  border: 1px solid var(--cj-gray6);
  border-radius: var(--radius);
  background: var(--cj-white);
  font-size: 33px;
  letter-spacing: -0.99px;
  color: var(--cj-font1);
  white-space: nowrap;
  overflow: hidden;
}

.value.accent {
  color: var(--cj-primary);
  letter-spacing: -0.66px;
}

.value.bare {
  padding: 0;
  border: none;
  background: none;
  overflow: visible;
}

/* 스텝퍼 같은 커스텀 값은 패딩 없이 꽉 채움 */
.value :deep(.stepper) {
  margin: 0 calc(-1 * var(--pad-x));
  width: calc(100% + 2 * var(--pad-x));
}
</style>
