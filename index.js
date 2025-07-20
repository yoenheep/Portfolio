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

function goToSection(newIndex, direction) {
  if (
    newIndex < 0 ||
    newIndex >= sections.length ||
    newIndex === currentIndex ||
    isTransitioning
  )
    return;

  isTransitioning = true;

  const current = sections[currentIndex];
  const next = sections[newIndex];

  sections.forEach((s, i) => {
    if (i !== currentIndex && i !== newIndex) {
      s.classList.remove("exit", "current");
    }
  });

  current.classList.remove("current");

  if (direction === "down") {
    next.classList.add("active", "current");
    current.classList.remove("exit");
  } else {
    current.classList.add("exit");
    next.classList.add("active", "current");
  }

  currentIndex = newIndex;

  setTimeout(() => {
    if (direction === "up") {
      current.classList.remove("active", "exit");
    }
    isTransitioning = false;
  }, 800);
}

// 초기 위치 설정
window.addEventListener("DOMContentLoaded", () => {
  goToSection(0);
});

// 네비게이션 클릭 시 이동
navLinks.forEach((link, index) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    goToSection(index);
  });
});

// 마우스 휠로 섹션 이동
let isScrolling = false;
window.addEventListener("wheel", (e) => {
  if (isScrolling) return;
  isScrolling = true;

  const direction = e.deltaY > 0 ? "down" : "up";
  goToSection(currentIndex + (direction === "down" ? 1 : -1), direction);

  setTimeout(() => {
    isScrolling = false;
  }, 800); // transition 시간만큼
});

// 창 크기 변경 시 위치 다시 설정
window.addEventListener("resize", () => {
  goToSection(currentIndex);
});
