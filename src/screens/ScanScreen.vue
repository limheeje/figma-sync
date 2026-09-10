<script setup lang="ts">
/* Figma: 스캔(720*1440) — 8:7475 (+ 완료 모달 상태 8:7498) */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import bg from '../assets/screen-bg.png'
import logoutIcon from '../assets/ic-logout.svg'
import logo1 from '../assets/logo-cj-1.svg'
import logo2 from '../assets/logo-cj-2.svg'
import AlertModal from '../components/AlertModal.vue'

const router = useRouter()
const done = ref(false)

const zoneValue =
  'A01, A02, A03, A02, A03, A02, A03, A02, A03, A02, A03, A02, A03, A02, A03, A02, A03, A02, A03, A02, A03'

/* Figma 8:7475 — 작업 구역 박스 2개 (8:7490 top:686, 11:67 top:890) */
const zoneBoxes = [
  { node: '8:7490', value: zoneValue },
  { node: '11:67', value: zoneValue },
]
</script>

<template>
  <div class="screen">
    <img class="bg" :src="bg" alt="" aria-hidden="true" />

    <button class="logout" type="button" aria-label="로그아웃" @click="router.push('/login')">
      <img :src="logoutIcon" alt="" />
    </button>

    <button class="scan-box" type="button" data-node-id="8:7488" @click="done = true">
      AMR ID를 스캔하세요.
    </button>

    <div
      v-for="(box, i) in zoneBoxes"
      :key="box.node"
      class="zone-box"
      :class="`zone-box-${i}`"
      :data-node-id="box.node"
    >
      <span class="zone-label">작업 구역 :</span>
      <span class="zone-value">{{ box.value }}</span>
    </div>

    <div class="logo" data-node-id="8:7476">
      <img :src="logo1" alt="CJ" class="logo-mark" />
      <img :src="logo2" alt="대한통운" class="logo-text" />
    </div>

    <AlertModal
      v-if="done"
      message="상품 입고가 완료 되었습니다."
      @confirm="router.push('/picking')"
    />
  </div>
</template>

<style scoped>
.screen {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f2f2f2;
  overflow: hidden;
}

.bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.logout {
  position: absolute;
  left: 640px;
  top: 47px;
  width: 48px;
  height: 48px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}
.logout img {
  width: 100%;
  height: 100%;
}

.scan-box {
  position: absolute;
  left: 12px;
  top: 564px;
  width: 696px;
  height: 108px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 21px 12px;
  border: 1px solid var(--cj-gray6);
  border-radius: var(--radius);
  background: var(--cj-white);
  font-family: var(--font-cj);
  font-size: 33px;
  letter-spacing: -0.99px;
  color: var(--cj-font1);
  cursor: pointer;
}

.zone-box {
  position: absolute;
  left: 12px;
  width: 696px;
  height: 190px;
  display: flex;
  gap: 10px;
  justify-content: center;
  padding: 24px;
  border-radius: var(--radius);
  background: #f2f2f2;
  font-family: var(--font-cj);
  font-size: 32px;
  letter-spacing: -0.96px;
  color: var(--cj-font1);
}
.zone-box-0 {
  top: 686px;
}
.zone-box-1 {
  top: 890px;
}
.zone-label {
  flex-shrink: 0;
}
.zone-value {
  line-height: 48px;
}

.logo {
  position: absolute;
  left: 50%;
  top: 1288px;
  transform: translateX(-50%);
  width: 205px;
  height: 79px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.logo-mark {
  height: 79px;
}
.logo-text {
  height: 33px;
}
</style>
