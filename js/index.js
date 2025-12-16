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
const sections = document.querySelectorAll(".section");

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

  const targetSection = sections[targetIndex];
  targetSection.scrollTop = 0;

  navLinks.forEach((link, i) => {
    if (i === targetIndex) {
      link.classList.add("current");
    } else {
      link.classList.remove("current");
    }

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

window.addEventListener("DOMContentLoaded", () => {
  goToSection(0);
});

navLinks.forEach((link, index) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    goToSection(index, 300);
  });
});

let isScrolling = false;
let scrollBuffer = false;

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
      return;
    }

    if (!scrollBuffer) {
      scrollBuffer = true;
      return;
    }

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
  scrollBuffer = false;
  setTimeout(() => {
    isScrolling = false;
  }, 1000);
});

window.addEventListener("resize", () => {
  goToSection(currentIndex, 300);
});

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
const popupSubtitle = document.querySelector(".project_popup-subtitle span");
const popupTitle = document.querySelector(".project_popup-title");
const popupDescription = document.querySelector(".details_description");
const popupInfoList = document.querySelector(".details_info");

// 슬라이드 관련 변수
let currentSlideIndex = 0;
let slideImages = [];

function checkThumbnail(project) {
  let result = "";
  if (project.videoUrl) {
    if (project.tag === "App") {
      result = `<a href=${project.videoUrl} target="_blank" class='project_pop_a'><img src=${project.image} alt="" class="project_pop-img"></a>`;
    } else if (project.tag === "게임") {
      result = `<iframe src="${project.videoUrl}?autoplay=1" frameborder="0"  allowfullscreen allow="autoplay;" style="width: 100%; aspect-ratio: 16 / 9; border: none;"></iframe>`;
    } else {
      result = `<video src=${project.videoUrl} controls autoplay width= "100%" height= "100%"></video>`;
    }
  } else if (project.tag === "Cardnews") {
    // 카드뉴스인 경우 슬라이드 생성
    slideImages = Array.isArray(project.image)
      ? project.image
      : [project.image];
    currentSlideIndex = 0;

    result = `
      <div class="cardnews-slider">
        <button class="slide-btn prev-btn" onclick="changeSlide(-1)">&#10094;</button>
        <div class="slide-container">
          ${slideImages
            .map(
              (img, idx) => `
            <img src="${img}" alt="카드뉴스 ${idx + 1}" class="slide-image ${
                idx === 0 ? "active" : ""
              }" data-index="${idx}">
          `
            )
            .join("")}
        </div>
        <button class="slide-btn next-btn" onclick="changeSlide(1)">&#10095;</button>
        <div class="slide-indicators">
          ${slideImages
            .map(
              (_, idx) => `
            <span class="indicator ${
              idx === 0 ? "active" : ""
            }" onclick="goToSlide(${idx})"></span>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  } else {
    result = `<img src=${project.image} alt="" class="project_pop-img"></img>`;
  }

  return result;
}

// 슬라이드 변경 함수를 전역으로 설정
window.changeSlide = function (direction) {
  const slides = document.querySelectorAll(".slide-image");
  const indicators = document.querySelectorAll(".indicator");

  if (slides.length === 0) return;

  slides[currentSlideIndex].classList.remove("active");
  indicators[currentSlideIndex].classList.remove("active");

  currentSlideIndex =
    (currentSlideIndex + direction + slides.length) % slides.length;

  slides[currentSlideIndex].classList.add("active");
  indicators[currentSlideIndex].classList.add("active");
};

window.goToSlide = function (index) {
  const slides = document.querySelectorAll(".slide-image");
  const indicators = document.querySelectorAll(".indicator");

  if (slides.length === 0) return;

  slides[currentSlideIndex].classList.remove("active");
  indicators[currentSlideIndex].classList.remove("active");

  currentSlideIndex = index;

  slides[currentSlideIndex].classList.add("active");
  indicators[currentSlideIndex].classList.add("active");
};

// 팝업 열기 함수
function openProjectPopup(project) {
  popupSubtitle.textContent = project.tag;
  popupTitle.textContent = project.title;
  popupDescription.textContent = project.description;

  projectThumbnail.innerHTML = checkThumbnail(project);

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

  projectPopup.classList.add("open");
  isScrolling = true;
}

// 팝업 닫기 함수
function closeProjectPopup() {
  projectThumbnail.innerHTML = "";
  slideImages = [];
  currentSlideIndex = 0;

  projectPopup.classList.remove("open");
  setTimeout(() => {
    isScrolling = false;
  }, 1000);
}

popupClose.addEventListener("click", closeProjectPopup);

projectPopup.addEventListener("click", (e) => {
  if (e.target === projectPopup) {
    closeProjectPopup();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && projectPopup.classList.contains("open")) {
    closeProjectPopup();
  }

  // 팝업이 열려있고 카드뉴스인 경우 좌우 화살표로 슬라이드 이동
  if (projectPopup.classList.contains("open") && slideImages.length > 0) {
    if (e.key === "ArrowLeft") {
      changeSlide(-1);
    } else if (e.key === "ArrowRight") {
      changeSlide(1);
    }
  }
});

// 프로젝트 필터링 기능
const filterButtons = document.querySelectorAll(".project_item");
let allProjectCards = [];

function filterProjects(filterValue) {
  const container = document.querySelector(".project_container");

  allProjectCards.forEach((card) => {
    const shouldShow =
      filterValue === "all" || card.classList.contains(filterValue);

    if (shouldShow) {
      card.style.display = "flex";
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

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (projectPopup.classList.contains("open")) {
      return;
    }

    filterButtons.forEach((btn) => btn.classList.remove("active-project"));
    button.classList.add("active-project");

    const filterValue = button.dataset.filter;
    filterProjects(filterValue);
  });
});

// 프로젝트 카드리스트 불러오기
const container = document.querySelector(".project_container");

if (container) {
  projectList.forEach((project, index) => {
    const card = document.createElement("div");
    // 카드뉴스인 경우 첫 번째 이미지를 썸네일로 사용
    const thumbnailImage = Array.isArray(project.image)
      ? project.image[0]
      : project.image;

    card.className = `project_card mix ${project.filterTag}`;

    card.innerHTML = `
      <img src="${thumbnailImage}" alt="" class="project_img">
      <p class="project_subtitle">${project.tag}</p>
      <h3 class="project_title">${project.title}</h3>
      <span class="project_button" data-project-index="${index}">더보기</span>
    `;

    container.appendChild(card);
    allProjectCards.push(card);

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
  emailjs.init("SeFE31-v2N_bNsly2");
})();

window.onload = function () {
  document
    .getElementById("contact-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const inputs = this.querySelectorAll("input, textarea");
      for (let input of inputs) {
        const isHidden =
          input.type === "hidden" ||
          input.disabled ||
          input.offsetParent === null;
        if (!isHidden && input.value.trim() === "") {
          alert("모든 항목을 입력해주세요.");
          input.focus();
          return;
        }
      }

      this.contact_number.value = (Math.random() * 100000) | 0;
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
