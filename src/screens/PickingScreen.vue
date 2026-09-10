<script setup lang="ts">
/* Figma: 피킹(720*1440) — 8:7519 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import FieldList, { type Field } from '../components/FieldList.vue'
import Stepper from '../components/Stepper.vue'
import ActionButton from '../components/ActionButton.vue'

const router = useRouter()

const fields: Field[] = [
  { key: 'amrId', label: 'AMR ID', value: 'AMR_001' },
  { key: 'location', label: '상품위치', value: 'A01-02-02' },
  { key: 'name', label: '상품명', value: '에코 리플렉티브 클로그' },
  { key: 'barcode', label: '상품 바코드', value: '상품 바코드를 스캔하세요' },
  { key: 'total', label: '총 수량', value: '6', accent: true },
  { key: 'pickQty', label: '피킹수량' },
  { key: 'total2', label: '총 수량', value: '6', accent: true, disabled: true },
]

const pickQty = ref(6)
</script>

<template>
  <div class="screen">
    <AppHeader title="피킹" />

    <FieldList :fields="fields">
      <template #pickQty>
        <Stepper v-model="pickQty" :max="6" />
      </template>
    </FieldList>

    <ActionButton label="피킹 완료" @click="router.push('/product-input')" />
  </div>
</template>

<style scoped>
.screen {
  width: 100%;
  height: 100%;
  background: var(--cj-color1);
}
</style>
