<script setup lang="ts">
/* Figma: 상단 Top 영역 (6:6761) */
import logo from '../assets/logo-parata-air.svg'
import iconUser from '../assets/icon-user.svg'
import iconEvent from '../assets/icon-event.svg'
import iconSupport from '../assets/icon-support.svg'
import iconGlobe from '../assets/icon-globe.svg'
import iconExpand12 from '../assets/icon-expand-12.svg'
import iconExpand24 from '../assets/icon-expand-24.svg'

const utility = [
  { label: '회원가입', icon: iconUser, size: 14 },
  { label: '이벤트', icon: iconEvent, size: 13 },
  { label: '고객센터', icon: iconSupport, size: 15 },
]
const mainMenu = ['예약', '여행준비', '서비스 안내']
const subMenu = ['예약', '운임안내']
</script>

<template>
  <header class="site-header" data-node-id="6:6761">
    <div class="gradient" aria-hidden="true" />

    <div class="gnb" data-node-id="I6:6761;1528:26931">
      <div class="gnb-inner">
        <!-- Utility -->
        <div class="utility">
          <button v-for="u in utility" :key="u.label" type="button" class="util-item">
            <img :src="u.icon" alt="" :style="{ width: u.size + 'px', height: u.size + 'px' }" />
            <span>{{ u.label }}</span>
          </button>
          <button type="button" class="util-item util-item--lang">
            <img :src="iconGlobe" alt="" style="width: 15px; height: 15px" />
            <span>한국어</span>
            <img :src="iconExpand12" alt="" style="width: 12px; height: 12px" />
          </button>
        </div>

        <!-- Header row -->
        <div class="header-row">
          <div class="header-left">
            <img :src="logo" alt="PARATA AIR" class="logo" />
            <nav class="main-menu">
              <a v-for="m in mainMenu" :key="m" href="#" class="menu-item">{{ m }}</a>
            </nav>
          </div>
          <button type="button" class="login-btn">로그인</button>
        </div>
      </div>
    </div>

    <!-- Blue sub navigation -->
    <div class="subnav" data-node-id="I6:6761;1528:26932">
      <button v-for="s in subMenu" :key="s" type="button" class="subnav-item">
        <span>{{ s }}</span>
        <img :src="iconExpand24" alt="" style="width: 24px; height: 24px" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  padding-bottom: 40px;
  width: 100%;
}

.gradient {
  position: absolute;
  left: 0;
  top: 106px;
  width: 100%;
  height: 106px;
  background: linear-gradient(
    to bottom,
    var(--parata-blue-900) 0%,
    var(--parata-blue-100) 85%
  );
}

/* GNB (white) */
.gnb {
  width: 100%;
  background: var(--parata-white);
}

.gnb-inner {
  width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.utility {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  padding: 5px 0;
}

.util-item {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 24px;
  padding: 10px 12px;
  background: none;
  border: none;
  cursor: pointer;
  /* Pretendard/14 21 */
  font-size: 14px;
  line-height: 21px;
  color: var(--parata-navy);
  white-space: nowrap;
}

.util-item--lang {
  padding-right: 0;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 49px;
}

.logo {
  width: 248px;
  height: 36px;
}

.main-menu {
  display: flex;
  align-items: center;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 72px;
  padding: 10px 36px;
  /* Pretendard/20 30 */
  font-size: 20px;
  line-height: 30px;
  color: var(--parata-navy);
  text-decoration: none;
  white-space: nowrap;
}

.login-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
  height: 36px;
  padding: 7px var(--space-16);
  border: 1px solid var(--parata-blue-100);
  border-radius: var(--radius-6);
  background: var(--parata-white);
  /* Pretendard/15 22 */
  font-size: 15px;
  line-height: 22px;
  color: var(--parata-blue-100);
  cursor: pointer;
  white-space: nowrap;
}

/* Blue sub navigation */
.subnav {
  position: relative;
  display: flex;
  align-items: center;
  gap: 40px;
  width: 1200px;
  margin: 0 auto;
  padding-left: 10px;
}

.subnav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 300px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  /* Pretendard/18 26 B */
  font-weight: 700;
  font-size: 18px;
  line-height: 26px;
  color: var(--parata-white);
  white-space: nowrap;
}

.subnav-item span {
  width: 250px;
  text-align: left;
}
</style>
