$(document).ready(function() {
  $(".side-nav__item").on("click", function() {
    $(".side-nav__item").removeClass("side-nav__item--active");
    $(this).addClass("side-nav__item--active");
  });
});

// var autoExpand = function(field) {
//   // Reset field height
//   field.style.height = "inherit";

//   // Get the computed styles for the element
//   var computed = window.getComputedStyle(field);

//   // Calculate the height
//   var height =
//     parseInt(computed.getPropertyValue("border-top-width"), 10) +
//     parseInt(computed.getPropertyValue("padding-top"), 10) +
//     field.scrollHeight +
//     parseInt(computed.getPropertyValue("padding-bottom"), 10) +
//     parseInt(computed.getPropertyValue("border-bottom-width"), 10);

//   field.style.height = height + "px";
//   // $(".postForm-container").css("height", height + "px");
// };

// document.addEventListener(
//   "textarea",
//   function(event) {
//     if (event.target.tagName.toLowerCase() !== "textarea") return;
//     autoExpand(event.target);
//   },
//   false
// );
