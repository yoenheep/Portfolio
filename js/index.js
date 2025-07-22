/* ===== typing animation ===== */
let typed = new Typed(".typing", {
  strings: ["", "Programmer", "Publisher", "Front-end"],
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

  // ✅ 현재 보여줄 섹션의 스크롤을 0으로 초기화
  const targetSection = sections[targetIndex];
  targetSection.scrollTop = 0;

  // ✅ nav 상태 먼저 업데이트: 클릭하자마자 바뀌게
  navLinks.forEach((link, i) => {
    if (i === targetIndex) {
      link.classList.add("current");
    } else {
      link.classList.remove("current");
    }

    // connect 처리도 함께
    if (sections[i].classList.contains("connect")) {
      link.classList.add("connect");
    } else {
      link.classList.remove("connect");
    }
  });

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

    // 섹션 전환
    next.classList.add("active", "current");
    if (direction === "down") {
      current.classList.remove("current");
    } else {
      current.classList.add("exit");
      setTimeout(() => {
        current.classList.remove("current");
      }, time);
    }

    setTimeout(() => {
      if (direction === "up") {
        current.classList.remove("active", "exit");
      }
      index = nextIndex;
      animateStep();
    }, time);
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
let scrollBuffer = false; // 추가된 플래그

window.addEventListener("wheel", (e) => {
  if (isScrolling) return;

  const direction = e.deltaY > 0 ? "down" : "up";
  const currentSection = sections[currentIndex];

  const scrollTop = currentSection.scrollTop;
  const scrollHeight = currentSection.scrollHeight;
  const clientHeight = currentSection.clientHeight;

  const atTop = scrollTop === 0;
  const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

  if (direction === "down") {
    if (!atBottom) {
      // 내부 스크롤 중이면 무시
      return;
    }

    if (!scrollBuffer) {
      // 맨 아래지만 아직 버퍼 안 쓴 경우 → 버퍼만 설정
      scrollBuffer = true;
      return;
    }

    // 버퍼 썼으면 이동 허용
    goToSection(currentIndex + 1, 700);
  } else {
    if (!atTop) {
      return;
    }

    if (!scrollBuffer) {
      scrollBuffer = true;
      return;
    }

    goToSection(currentIndex - 1, 700);
  }

  isScrolling = true;
  scrollBuffer = false; // 이동 후에는 다시 초기화
  setTimeout(() => {
    isScrolling = false;
  }, 800);
});

// 창 크기 변경 시 위치 다시 설정
window.addEventListener("resize", () => {
  goToSection(currentIndex, 300);
});

// 어바웃의 연락하기 버튼 연결
const hireMeBtn = document.querySelector(".hire-me");

hireMeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const sectionIndex = parseInt(e.target.dataset.sectionIndex, 10);
  goToSection(sectionIndex, 300);
});

// // Email JS
// (function () {
//   // https://dashboard.emailjs.com/admin/account
//   emailjs.init("1LsCcPyoJuh3rVgNc");
// })();

// window.onload = function () {
//   document
//     .getElementById("contact-form")
//     .addEventListener("submit", function (event) {
//       event.preventDefault();
//       // generate a five digit number for the contact_number variable
//       this.contact_number.value = (Math.random() * 100000) | 0;
//       // these IDs from the previous steps
//       emailjs.sendForm("service_p9u31ze", "template_ajad98f", this).then(
//         function () {
//           console.log("SUCCESS!");
//           alert("전송이 완료되었습니다");
//           location.reload();
//         },
//         function (error) {
//           console.log("FAILED...", error);
//         }
//       );
//     });
// };
