<script setup lang="ts">
/* Figma: 로그인(720*1440) — 8:7448 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import bg from '../assets/screen-bg.png'
import chevron from '../assets/ic-chevron.svg'
import logo1 from '../assets/logo-cj-1.svg'
import logo2 from '../assets/logo-cj-2.svg'

const router = useRouter()

// TODO: 옵션 목록은 디자이너/API 스펙 확정 후 교체
const jobs = ['입고', '출고', '재고조사']
const centers = ['양양센터', '서울센터', '부산센터']
const zones = ['A구역', 'B구역', 'C구역']

const job = ref('')
const center = ref('')
const zone = ref('')
const workerId = ref('')
const workerPw = ref('')

</script>

<template>
  <div class="screen">
    <img class="bg" :src="bg" alt="" aria-hidden="true" />

    <div class="field select-field row0" data-node-id="9:63">
      <select v-model="job" :class="{ placeholder: !job }">
        <option value="" disabled>선택하세요.</option>
        <option v-for="j in jobs" :key="j" :value="j">{{ j }}</option>
      </select>
      <img :src="chevron" alt="" class="chevron" />
    </div>

    <div class="field select-field row1" data-node-id="8:7471">
      <select v-model="center" :class="{ placeholder: !center }">
        <option value="" disabled>선택하세요.</option>
        <option v-for="c in centers" :key="c" :value="c">{{ c }}</option>
      </select>
      <img :src="chevron" alt="" class="chevron" />
    </div>

    <div class="field select-field row2" data-node-id="8:7467">
      <select v-model="zone" :class="{ placeholder: !zone }">
        <option value="" disabled>선택하세요.</option>
        <option v-for="z in zones" :key="z" :value="z">{{ z }}</option>
      </select>
      <img :src="chevron" alt="" class="chevron" />
    </div>

    <input
      v-model="workerId"
      class="field input row3"
      type="text"
      placeholder="작업자 ID를 입력하세요."
      data-node-id="8:7465"
    />

    <input
      v-model="workerPw"
      class="field input row4"
      type="password"
      placeholder="작업자 PW를 입력하세요."
      data-node-id="8:7463"
    />

    <button type="button" class="login-btn" data-node-id="8:7461" @click="router.push('/scan')">
      로그인
    </button>

    <div class="logo" data-node-id="8:7449">
      <img :src="logo1" alt="CJ" class="logo-mark" />
      <img :src="logo2" alt="대한통운" class="logo-text" />
    </div>
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

.field {
  position: absolute;
  left: 12px;
  width: 696px;
  height: 108px;
  display: flex;
  align-items: center;
  padding: 21px 36px;
  border: 1px solid var(--cj-gray6);
  border-radius: var(--radius);
  background: var(--cj-white);
  font-family: var(--font-cj);
  font-size: 33px;
  letter-spacing: -0.99px;
  color: var(--cj-font1);
}

.select-field {
  padding: 0;
}

.select-field select {
  flex: 1;
  height: 100%;
  padding: 21px 36px;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  letter-spacing: inherit;
  color: var(--cj-font1);
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
}

.select-field select:focus {
  outline: none;
}

.select-field select.placeholder {
  color: var(--cj-gray7);
}

.select-field select option {
  color: var(--cj-font1);
}

.select-field .chevron {
  width: 52px;
  height: 52px;
  margin-right: 30px;
  transform: rotate(180deg);
  pointer-events: none;
}

.row0 {
  top: 339px;
}
.row1 {
  top: 461px;
}
.row2 {
  top: 583px;
}

.input {
  text-align: left;
}
.input::placeholder {
  color: var(--cj-gray7);
}
.row3 {
  top: 705px;
}
.row4 {
  top: 827px;
}

.login-btn {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 373px;
  height: 108px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--cj-primary-dark);
  border-radius: var(--radius);
  background: var(--cj-btn-red);
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
  font-family: var(--font-cj-bold);
  font-size: 33px;
  color: var(--cj-white);
  cursor: pointer;
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
