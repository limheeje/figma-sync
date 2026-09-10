<script setup lang="ts">
/* Figma: 사이드메뉴 (6:6847) — floating right-side quick menu */
import iconTicket from '../assets/side-ticket.svg'
import iconBooking from '../assets/side-booking.svg'
import iconCheckin from '../assets/side-checkin.svg'
import iconSchedule from '../assets/side-schedule.svg'
import iconArrow from '../assets/side-arrow.svg'

const items = [
  { icon: iconTicket, w: 19, h: 13, lines: ['항공권', '예매'] },
  { icon: iconBooking, w: 12, h: 19, lines: ['예매 조회'] },
  { icon: iconCheckin, w: 14, h: 19, lines: ['체크인'] },
  { icon: iconSchedule, w: 17, h: 12, lines: ['출도착', '스케쥴'] },
]

function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="side-menu" data-node-id="6:6847">
    <div class="stack">
      <button v-for="(it, i) in items" :key="i" type="button" class="cell">
        <img :src="it.icon" alt="" :style="{ width: it.w + 'px', height: it.h + 'px' }" />
        <span class="label">
          <template v-for="(line, j) in it.lines" :key="j">{{ line }}<br v-if="j < it.lines.length - 1" /></template>
        </span>
      </button>
    </div>
    <button type="button" class="to-top" aria-label="맨 위로" @click="toTop">
      <img :src="iconArrow" alt="" />
    </button>
  </div>
</template>

<style scoped>
.side-menu {
  position: fixed;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 100;
}

.stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 65px;
  filter: drop-shadow(0 4px 15px rgba(0, 0, 0, 0.1));
}

.cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 65px;
  height: 65px;
  padding: 14px 24px;
  border: 1px solid var(--parata-gray30-500);
  border-radius: 65px;
  background: var(--parata-gray30-100);
  overflow: hidden;
  cursor: pointer;
}

.label {
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  color: var(--parata-navy);
  white-space: nowrap;
}

.to-top {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 65px;
  height: 65px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.to-top img {
  width: 45px;
  height: 45px;
  transform: rotate(-90deg);
}
</style>
