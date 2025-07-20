/* ===== typing animation ===== */
let typed = new Typed(".typing", {
  strings: [
    "",
    "Product Manager",
    "Designer",
    "Programmer",
    "Publisher",
    "Marketer ",
  ],
  typeSpeed: 100,
  BackSpeed: 60,
  loop: true,
});

/* ===== 슬라이드 이동 기반 섹션 전환 ===== */

// 네비게이션 요소들
const nav = document.querySelector(".nav");
const navLinks = nav.querySelectorAll("a");
const sections = document.querySelectorAll(".section");
const mainContent = document.querySelector(".main-content");

let currentIndex = 0;
const totalSections = sections.length;

// 섹션 이동 함수
let isTransitioning = false;

function goToSection(targetIndex, time) {
  if (
    targetIndex < 0 ||
    targetIndex >= sections.length ||
    targetIndex === currentIndex ||
    isTransitioning
  )
    return;

  isTransitioning = true;

  const direction = targetIndex > currentIndex ? "down" : "up";
  const step = direction === "down" ? 1 : -1;
  let index = currentIndex;

  function animateStep() {
    if (index === targetIndex) {
      isTransitioning = false;
      currentIndex = targetIndex;
      return;
    }

    const nextIndex = index + step;
    const current = sections[index];
    const next = sections[nextIndex];

    if (direction === "down") {
      // 현재 섹션 exit 안붙이고 그냥 next가 오른쪽에서 들어오도록
      next.classList.add("active", "current");
      next.classList.remove("exit");
      current.classList.remove("current");
    } else {
      // 위로 갈 땐 current가 exit 붙고 오른쪽으로 나감
      current.classList.add("exit");
      next.classList.add("active", "current");
      current.classList.remove("current");
    }

    // 애니메이션 재생: CSS에서 .active, .exit 클래스에 트랜지션 있음
    // setTimeout으로 다음 단계 호출
    setTimeout(() => {
      // exit 클래스는 일정시간 후 제거
      if (direction === "up") {
        current.classList.remove("active", "exit");
      }
      index = nextIndex;
      animateStep();
    }, time); // 800ms는 CSS transition 시간과 맞춰주세요
  }

  animateStep();
}

// 초기 위치 설정
window.addEventListener("DOMContentLoaded", () => {
  goToSection(0);
});

// 네비게이션 클릭 시 이동
navLinks.forEach((link, index) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    goToSection(index, 300);
  });
});

// 마우스 휠로 섹션 이동
let isScrolling = false;
window.addEventListener("wheel", (e) => {
  if (isScrolling) return;
  isScrolling = true;

  const direction = e.deltaY > 0 ? "down" : "up";
  goToSection(currentIndex + (direction === "down" ? 1 : -1), 700);

  setTimeout(() => {
    isScrolling = false;
  }, 800); // transition 시간만큼
});

// 창 크기 변경 시 위치 다시 설정
window.addEventListener("resize", () => {
  goToSection(currentIndex);
});
