document.addEventListener("DOMContentLoaded", () => {
  let tabs = document.querySelectorAll(".tabs h3");
  let tabContents = document.querySelectorAll(" .tab-content .hidden");
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", (e) => {
      tabs.forEach((tab) => {
        tab.classList.remove("active");
      });
      tab.classList.add("active");
      let line = document.querySelector(".tabs .line");
      line.style.width = e.target.offsetWidth + "px";
      line.style.left = e.target.offsetLeft + "px";

      tabContents.forEach((content, index) => {
        content.classList.remove("active");
      })
      tabContents[index].classList.add('active');
    });
  });
});