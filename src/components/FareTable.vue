<script setup lang="ts">
/* Figma: Frame 592 (6:6771) — 국내선 여객운임 표 */

interface FareRow {
  route: string
  airfare: string
  fuel: string
  airport: string
  total: string
}

const divisions = ['주중 (월 - 목)', '주말 (금 – 일)', '성수기']

// 디자인상 전 노선 동일 금액
const rows: FareRow[] = [
  '김포 - 광주',
  '광주 - 김포',
  '광주 - 제주',
  '제주 - 광주',
  '김포 - 제주',
  '제주 - 김포',
].map((route) => ({
  route,
  airfare: '97,000',
  fuel: '6,600',
  airport: '4,000',
  total: '107,600',
}))
</script>

<template>
  <table class="fare-table" data-node-id="6:6771">
    <colgroup>
      <col style="width: 270px" />
      <col style="width: 186px" />
      <col style="width: 186px" />
      <col style="width: 186px" />
      <col style="width: 186px" />
      <col style="width: 186px" />
    </colgroup>
    <thead>
      <tr>
        <th scope="col">노선</th>
        <th scope="col">구분</th>
        <th scope="col">항공운임</th>
        <th scope="col">유류할증료</th>
        <th scope="col">공항이용료</th>
        <th scope="col" class="col-last">총액운임</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(row, r) in rows" :key="row.route">
        <tr
          v-for="(division, d) in divisions"
          :key="division"
          :class="{ 'row--route-end': d === divisions.length - 1 }"
        >
          <td v-if="d === 0" class="cell--route" rowspan="3">{{ row.route }}</td>
          <td class="cell--division">{{ division }}</td>
          <td v-if="d === 0" rowspan="3">{{ row.airfare }}</td>
          <td v-if="d === 0" rowspan="3">{{ row.fuel }}</td>
          <td v-if="d === 0" rowspan="3">{{ row.airport }}</td>
          <td v-if="d === 0" rowspan="3" class="col-last">{{ row.total }}</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<style scoped>
.fare-table {
  width: 1200px;
  border-collapse: collapse;
  table-layout: fixed;
  /* Frame 592 — border-t-2 #00145A */
  border-top: 2px solid var(--parata-navy);
}

.fare-table th,
.fare-table td {
  padding: 8px 24px;
  text-align: center;
  vertical-align: middle;
  border-right: 1px solid var(--parata-gray50-300);
  white-space: nowrap;
  overflow: hidden;
}

/* 표 오른쪽 끝(총액운임 열)은 테두리 없음 */
.fare-table .col-last {
  border-right: none;
}

/* Table_th2 — 헤더 셀 */
.fare-table th {
  height: 60px;
  background: var(--parata-gray30-300);
  border-bottom: 1px solid var(--parata-gray50-500);
  /* Pretendard/15 22 B */
  font-weight: 700;
  font-size: 15px;
  line-height: 22px;
  color: var(--parata-navy);
}

/* Table_td1 — 데이터 셀 */
.fare-table td {
  background: var(--parata-white);
  border-bottom: 1px solid var(--parata-gray30-500);
  /* Pretendard/15 22 — Regular */
  font-weight: 400;
  font-size: 15px;
  line-height: 22px;
  color: var(--parata-navy);
}

.cell--division {
  height: 60px;
}

.cell--route,
.fare-table td[rowspan] {
  height: 180px;
}

/* 노선 블록의 마지막 서브행 — 진한 하단 보더 */
.row--route-end td {
  border-bottom: 1px solid var(--parata-gray50-500);
}
</style>
