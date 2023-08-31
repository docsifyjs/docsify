// 创建一个按钮元素
var btn = document.createElement("button");
btn.setAttribute("id","scrollToTopBtn")

// 设置按钮的文本
btn.innerText = "👆";
// 将按钮添加到网页中
document.body.appendChild(btn);

// 添加滚动事件监听
window.addEventListener("scroll", function() {
  // 当滚动超过一定高度时显示按钮，否则隐藏按钮
  if (window.pageYOffset > 300) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
});

// 添加按钮点击事件
btn.addEventListener("click", function() {
  // 平滑滚动回到顶部
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
