import { projectList } from "./projectList.js";

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
const sections = document.querySelectorAll(".section"); // ✅ sections 변수 정의 추가

const mainContent = document.querySelector(".main-content");

let currentIndex = 0;

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
  }, 1000);
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

// 프로젝트 팝업 요소들
const projectPopup = document.querySelector(".project_popup");
const projectThumbnail = document.querySelector(".pp_thumbnail");
const popupClose = document.querySelector(".project_popup-close");
// const popupImg = document.querySelector(".project_pop-img");
const popupSubtitle = document.querySelector(".project_popup-subtitle span");
const popupTitle = document.querySelector(".project_popup-title");
const popupDescription = document.querySelector(".details_description");
const popupInfoList = document.querySelector(".details_info");

function checkThumbnail(project) {
  let result = "";
  if (project.videoUrl) {
    if (project.etc === "walkee") {
      result = `<a href=${project.videoUrl} target="_blank" class='project_pop_a'><img src=${project.image} alt="" class="project_pop-img"></a>`;
    } else if (project.tag === "게임") {
      result = `<iframe src=${project.videoUrl} frameborder="0"  allowfullscreen allow="autoplay;" style="width: 100%; aspect-ratio: 16 / 9; border: none;"></iframe>`;
    } else {
      result = `<video src=${project.videoUrl} controls autoplay width= "100%" height= "100%"></video>`;
    }
  } else {
    result = `<img src=${project.image} alt="" class="project_pop-img"></img>`;
  }

  return result;
}

// 팝업 열기 함수
function openProjectPopup(project) {
  // 팝업 내용 업데이트
  // popupImg.src = project.image;
  // popupImg.alt = project.title;
  popupSubtitle.textContent = project.tag; // 한국어 태그 표시
  popupTitle.textContent = project.title;
  popupDescription.textContent = project.description;

  projectThumbnail.innerHTML = checkThumbnail(project);

  // 상세 정보 업데이트
  popupInfoList.innerHTML = `
    <li>제작 - <span>${project.period}</span></li>
    <li>사용 - <span>${project.use.join(", ")}</span></li>
    ${
      project.Team
        ? `<li>구분 - <span>팀 프로젝트</span></li>`
        : `<li>구분 - <span>개인 프로젝트</span></li>`
    }
    ${
      project.Team && project.rule
        ? `<li>역할 - <span>${project.rule.join(", ")}</span></li>`
        : ""
    }
    ${
      project.pptUrl
        ? `<li>기획보고서 - <span><a href="${project.pptUrl}" target="_blank">PPT/PDF 보기</a></span></li>`
        : ""
    }
    ${
      project.gitUrl
        ? `<li>GitHub - <span><a href="${project.gitUrl}" target="_blank">Github 보기</a></span></li>`
        : ""
    }
    ${
      project.siteUrl
        ? `<li>배포주소 - <span><a href="${project.siteUrl}" target="_blank">${
            project.tag === "App" ? "apk 파일 다운로드하기" : "사이트 보기"
          }</a></span></li>`
        : ""
    }
  `;

  // 팝업 열기
  projectPopup.classList.add("open");
  // ✅ body와 main-content 모두 스크롤 방지
  isScrolling = true;
}

// 팝업 닫기 함수
function closeProjectPopup() {
  projectPopup.classList.remove("open");
  setTimeout(() => {
    isScrolling = false;
  }, 1000);
}

// 팝업 닫기 이벤트
popupClose.addEventListener("click", closeProjectPopup);

// 팝업 배경 클릭시 닫기
projectPopup.addEventListener("click", (e) => {
  if (e.target === projectPopup) {
    closeProjectPopup();
  }
});

// ESC 키로 팝업 닫기
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && projectPopup.classList.contains("open")) {
    closeProjectPopup();
  }
});

// 프로젝트 필터링 기능
const filterButtons = document.querySelectorAll(".project_item");
let allProjectCards = []; // 모든 프로젝트 카드를 저장할 배열

function filterProjects(filterValue) {
  const container = document.querySelector(".project_container");

  allProjectCards.forEach((card) => {
    const shouldShow =
      filterValue === "all" || card.classList.contains(filterValue);

    if (shouldShow) {
      card.style.display = "flex";
      // 브라우저 리플로우 강제 실행
      card.offsetHeight;
      card.style.opacity = "1";
      card.style.transform = "scale(1)";
    } else {
      card.style.opacity = "0";
      card.style.transform = "scale(0.8)";

      setTimeout(() => {
        card.style.display = "none";
      }, 300);
    }
  });
}

// 필터 버튼 이벤트 리스너
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // 팝업이 열려있으면 필터링 방지
    if (projectPopup.classList.contains("open")) {
      return;
    }

    // 활성 클래스 업데이트
    filterButtons.forEach((btn) => btn.classList.remove("active-project"));
    button.classList.add("active-project");

    // 필터 값 가져오기
    const filterValue = button.dataset.filter;
    filterProjects(filterValue);
  });
});

// 프로젝트 카드리스트 불러오기 - filterTag 기반으로 수정
const container = document.querySelector(".project_container");

if (container) {
  projectList.forEach((project, index) => {
    const card = document.createElement("div");
    // filterTag를 클래스로 사용하여 필터링 가능하게 함
    card.className = `project_card mix ${project.filterTag}`;

    card.innerHTML = `
      <img src="${project.image}" alt="" class="project_img">
      <p class="project_subtitle">${project.tag}</p>
      <h3 class="project_title">${project.title}</h3>
      <span class="project_button" data-project-index="${index}">더보기</span>
    `;

    container.appendChild(card);

    // allProjectCards 배열에 추가
    allProjectCards.push(card);

    // "더보기" 버튼에 클릭 이벤트 추가
    const moreButton = card.querySelector(".project_button");
    moreButton.addEventListener("click", () => {
      openProjectPopup(project);
    });
  });
} else {
  console.error("project_container를 찾을 수 없습니다.");
}

// Email JS
(function () {
  // https://dashboard.emailjs.com/admin/account
  emailjs.init("SeFE31-v2N_bNsly2");
})();

window.onload = function () {
  document
    .getElementById("contact-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // 사용자 입력용 input, textarea만 필터링 (hidden, disabled 제외)
      const inputs = this.querySelectorAll("input, textarea");
      for (let input of inputs) {
        const isHidden =
          input.type === "hidden" ||
          input.disabled ||
          input.offsetParent === null;
        if (!isHidden && input.value.trim() === "") {
          alert("모든 항목을 입력해주세요.");
          input.focus();
          return; // 제출 중단
        }
      }

      // generate a five digit number for the contact_number variable
      this.contact_number.value = (Math.random() * 100000) | 0;
      // these IDs from the previous steps
      emailjs.sendForm("service_mjfiprq", "template_358wlch", this).then(
        function () {
          console.log("SUCCESS!");
          alert("전송이 완료되었습니다");
          location.reload();
        },
        function (error) {
          console.log("FAILED...", error);
        }
      );
    });
};
