<script setup lang="ts">
/* Figma: 투입완료(720*1440) — 8:7560
   피킹 화면과 동일한 본문 + 확인 다이얼로그(예/아니오) 오버레이 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import FieldList, { type Field } from '../components/FieldList.vue'
import Stepper from '../components/Stepper.vue'
import ActionButton from '../components/ActionButton.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const router = useRouter()

const fields: Field[] = [
  { key: 'amrId', label: 'AMR ID', value: 'AMR_001' },
  { key: 'location', label: '상품위치', value: 'A01-02-02' },
  { key: 'name', label: '상품명', value: '에코 리플렉티브 클로그' },
  { key: 'barcode', label: '상품 바코드', value: '상품 바코드를 스캔하세요' },
  { key: 'total', label: '총 수량', value: '6', accent: true },
  { key: 'pickQty', label: '피킹수량' },
]

const pickQty = ref(6)
const showDialog = ref(true)
</script>

<template>
  <div class="screen">
    <AppHeader title="투입완료" />

    <FieldList :fields="fields">
      <template #pickQty>
        <Stepper v-model="pickQty" :max="6" />
      </template>
    </FieldList>

    <ActionButton label="피킹 완료" @click="showDialog = true" />

    <ConfirmDialog
      v-if="showDialog"
      :lines="['1번 박스 / 206990-1JL-C8', '1개를 피킹처리 하시겠습니까?']"
      @no="showDialog = false"
      @yes="router.push('/login')"
    />
  </div>
</template>

<style scoped>
.screen {
  width: 100%;
  height: 100%;
  background: var(--cj-color1);
}
</style>
