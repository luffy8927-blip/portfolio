/* ------------------------------------------------------------------
   황재환 포트폴리오 — 최소 동작 스크립트
   외부 라이브러리 없음 / script.js 가 없거나 실패해도 페이지는 그대로 보입니다.
   ------------------------------------------------------------------ */
(function () {
  "use strict";

  var root = document.documentElement;

  /* CSS 의 .js 규칙은 이 클래스가 있을 때만 적용됩니다. */
  root.classList.add("js");

  function init() {
    try {
      setupReveal();
      setupNavHighlight();
    } catch (err) {
      /* 예외가 나면 JS 전용 스타일을 걷어내고 원래 화면으로 되돌립니다. */
      root.classList.remove("js");
      if (window.console && console.warn) console.warn("[script.js]", err);
    }
  }

  /* 1) 스크롤 시점에 섹션 등장 ------------------------------------- */
  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      for (var i = 0; i < items.length; i++) items[i].classList.add("is-in");
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    for (var j = 0; j < items.length; j++) observer.observe(items[j]);
  }

  /* 2) 현재 섹션을 내비게이션에 표시 --------------------------------- */
  function setupNavHighlight() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll('.nav a[href^="#"]')
    );
    if (!links.length || !("IntersectionObserver" in window)) return;

    var byId = {};
    var sections = [];

    links.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var el = document.getElementById(id);
      if (!el) return;
      byId[id] = link;
      sections.push(el);
    });

    if (!sections.length) return;

    function activate(id) {
      links.forEach(function (link) {
        link.classList.toggle("is-active", link === byId[id]);
      });
    }

    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) activate(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      spy.observe(section);
    });

    /* 페이지 맨 위에서는 첫 항목을 해제해 과한 표시를 막습니다. */
    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY < 120) activate("");
      },
      { passive: true }
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
