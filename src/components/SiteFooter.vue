<script setup lang="ts">
/* Figma: Copyright (6:6840) */
import logoFooter from '../assets/logo-parata-footer.svg'
import iconExternal from '../assets/icon-external-link.svg'
import iconChevronRight from '../assets/icon-chevron-right.svg'
import iconArrowDown from '../assets/icon-arrow-down-24.svg'
import sns1 from '../assets/sns-1.svg'
import sns2 from '../assets/sns-2.svg'
import sns3 from '../assets/sns-3.svg'
import sns4 from '../assets/sns-4.svg'

interface Link {
  label: string
  external?: boolean
}

const linkColumns: { title: string; links: Link[] }[] = [
  {
    title: '파라타항공',
    links: [
      { label: '회사소개', external: true },
      { label: '공지사항' },
      { label: '보도자료' },
      { label: '채용안내', external: true },
    ],
  },
  {
    title: '약관 및 규정',
    links: [
      { label: '개인정보처리방침' },
      { label: '홈페이지이용약관' },
      { label: '여객운송약관' },
      { label: '국제화물운송약관' },
    ],
  },
  {
    title: '기타안내',
    links: [
      { label: '항공교통이용자 서비스계획' },
      { label: '항공교통이용자 피해구제' },
      { label: '자주하는 질문' },
    ],
  },
]

const bizInfo = [
  ['주식회사 파라타항공', '대표이사 윤철민', '본사 강원특별자치도 양양군 양양읍 일출로 166-20', '서울지사 서울특별시 강서구 공항대로 165 C동 3층'],
  ['사업자 등록번호 710-81-00367', '통신판매업신고 제2019-강원양양-0063호'],
]

const snsIcons = [sns1, sns2, sns3, sns4]
</script>

<template>
  <footer class="site-footer" data-node-id="6:6840">
    <div class="footer-inner">
      <!-- Link columns + reservation center -->
      <div class="footer-top">
        <div class="link-groups">
          <div v-for="col in linkColumns" :key="col.title" class="link-col">
            <p class="col-title">{{ col.title }}</p>
            <ul class="col-links">
              <li v-for="l in col.links" :key="l.label">
                <a href="#">{{ l.label }}</a>
                <img v-if="l.external" :src="iconExternal" alt="" class="ext-icon" />
              </li>
            </ul>
          </div>
        </div>

        <div class="reservation">
          <div class="res-head">
            <p class="res-title">예약센터</p>
            <span class="res-country">
              국가별 안내
              <img :src="iconChevronRight" alt="" />
            </span>
          </div>
          <p class="res-phone">0000-0000</p>
          <div class="res-hours">
            <div><span>평일</span><span>07:00 AM - 06:00 PM</span></div>
            <div><span>주말</span><span>09:00 AM - 06:00 PM</span></div>
          </div>
          <button type="button" class="res-mail">이메일 문의</button>
        </div>
      </div>

      <!-- Logo + Family Site -->
      <div class="footer-mid">
        <img :src="logoFooter" alt="PARATA AIR" class="footer-logo" />
        <button type="button" class="family-site">
          <span>Family Site</span>
          <img :src="iconArrowDown" alt="" />
        </button>
      </div>

      <!-- Legal -->
      <div class="footer-bottom">
        <div class="biz-info">
          <p v-for="(line, i) in bizInfo" :key="i" class="biz-line">
            <span v-for="(seg, j) in line" :key="j" class="biz-seg">{{ seg }}</span>
          </p>
          <p class="copyright">ⓒ 2025 PARATA AIR. All rights reserved.</p>
        </div>
        <div class="sns">
          <img v-for="(icon, i) in snsIcons" :key="i" :src="icon" alt="" />
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  width: 100%;
  background: var(--parata-gray30-500);
}

.footer-inner {
  width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 40px 0 60px;
}

/* Top */
.footer-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  padding: 20px 0 40px 12px;
  border-bottom: 1px solid var(--parata-gray-500);
}

.link-groups {
  display: flex;
  align-items: flex-start;
}

.link-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 250px;
  padding-right: 8px;
}

.col-title {
  font-weight: 700;
  font-size: 15px;
  line-height: 22px;
  color: var(--parata-navy);
}

.col-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.col-links li {
  display: flex;
  align-items: center;
  gap: 5px;
}

.col-links a {
  font-size: 15px;
  line-height: 22px;
  color: var(--parata-navy);
  text-decoration: none;
}

.ext-icon {
  width: 14px;
  height: 14px;
}

/* Reservation center */
.reservation {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 250px;
}

.res-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.res-title {
  font-weight: 700;
  font-size: 14px;
  line-height: 21px;
  color: var(--parata-navy);
}

.res-country {
  display: flex;
  align-items: center;
  font-size: 13px;
  line-height: 18px;
  color: var(--parata-navy);
}

.res-country img {
  width: 15px;
  height: 15px;
}

.res-phone {
  font-weight: 700;
  font-size: 28px;
  line-height: 42px;
  color: var(--parata-navy);
}

.res-hours {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  line-height: 21px;
  color: var(--parata-navy);
}

.res-hours div {
  display: flex;
  gap: 10px;
}

.res-mail {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 160px;
  width: 100%;
  height: 50px;
  padding: var(--space-10) var(--space-20);
  border: 1px solid var(--parata-gray50-500);
  border-radius: var(--radius-6);
  background: var(--parata-white);
  font-size: 16px;
  line-height: 24px;
  color: var(--parata-black-60);
  cursor: pointer;
}

/* Mid */
.footer-mid {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-top: 30px;
}

.footer-logo {
  width: 160px;
  height: 32px;
}

.family-site {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 189px;
  min-width: 80px;
  padding: 10px 25px;
  border: 1px solid var(--parata-gray50-500);
  border-radius: 24px;
  background: var(--parata-gray30-100);
  cursor: pointer;
}

.family-site span {
  font-size: 15px;
  line-height: 22px;
  color: var(--parata-black-40);
}

.family-site img {
  width: 24px;
  height: 24px;
}

/* Bottom */
.footer-bottom {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  padding: 20px 0 20px 12px;
}

.biz-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.biz-line {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.biz-seg {
  padding: 0 8px;
  font-size: 14px;
  line-height: 21px;
  color: var(--parata-navy);
  border-right: 1px solid var(--parata-gray50-300);
}

.biz-seg:first-child {
  padding-left: 0;
}

.biz-seg:last-child {
  border-right: none;
}

.copyright {
  font-size: 13px;
  line-height: 18px;
  color: var(--parata-black-60);
}

.sns {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sns img {
  width: 30px;
  height: 30px;
}
</style>
