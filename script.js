// Мобильное меню
const $menuButton = $(".menu-button");
const $mobileMenuOverlay = $(".mobile-menu-overlay");
const $mobileMenuClose = $(".mobile-menu-close");
const $mobileMenuDropdowns = $(".mobile-menu-dropdown");
const $mobileSubmenuDropdowns = $(".mobile-submenu-dropdown");

$menuButton.on("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  $mobileMenuOverlay.addClass("active");
  $("body").css("overflow", "hidden"); 
});

function closeMobileMenu() {
  $mobileMenuOverlay.removeClass("active");
  $("body").css("overflow", ""); 
  $mobileMenuDropdowns.removeClass("active");
  $mobileSubmenuDropdowns.removeClass("active");
}

$mobileMenuClose.on("click", function (e) {
  e.preventDefault();
  closeMobileMenu();
});

$mobileMenuOverlay.on("click", function (e) {
  if (e.target === this) {
    closeMobileMenu();
  }
});

$(document).on("click", function(e) {
  if (!$(e.target).closest('.mobile-menu-overlay').length && 
      !$(e.target).closest('.menu-button').length && 
      $mobileMenuOverlay.hasClass('active')) {
    closeMobileMenu();
  }
});

$(document).on("keydown", function (e) {
  if (e.key === "Escape" && $mobileMenuOverlay.hasClass("active")) {
    closeMobileMenu();
  }
});

// Обработчик для кнопок мобильного меню
$(".mobile-menu-toggle").on("click", function(e) {
  e.preventDefault();
  e.stopPropagation();
  
  const $dropdown = $(this).closest(".mobile-menu-dropdown");
  const $submenu = $dropdown.find(".mobile-submenu");
  
  // Закрываем все другие dropdowns
  $mobileMenuDropdowns.not($dropdown).removeClass("active");
  $mobileSubmenuDropdowns.removeClass("active");
  
  // Переключаем текущий dropdown
  $dropdown.toggleClass("active");
  $submenu.slideToggle();
  
  // Поворачиваем стрелку
  $(this).find(".mobile-menu-arrow").toggleClass("rotated");
});

// Обработчик для подменю
$(".mobile-submenu-toggle").on("click", function(e) {
  e.preventDefault();
  e.stopPropagation();
  
  const $dropdown = $(this).closest(".mobile-submenu-dropdown");
  const $submenu = $dropdown.find(".mobile-sub-submenu");
  
  // Закрываем другие подменю в этом же dropdown
  const $parent = $dropdown.closest(".mobile-submenu");
  if ($parent.length) {
    $parent.find(".mobile-submenu-dropdown").not($dropdown).removeClass("active");
    $parent.find(".mobile-sub-submenu").not($submenu).slideUp();
  }
  
  // Переключаем текущее подменю
  $dropdown.toggleClass("active");
  $submenu.slideToggle();
  
  // Поворачиваем стрелку
  $(this).find(".mobile-submenu-arrow").toggleClass("rotated");
});

// Добавляем стили для новых элементов
const style = document.createElement('style');
style.textContent = `
  .mobile-menu-toggle-wrapper {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
  
  .mobile-menu-toggle {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }
  .mobile-submenu-dropdown{
  margin-bottom: 8px;
  justify-content: space-between;
}
  .mobile-submenu-toggle-wrapper {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
  
  .mobile-submenu-toggle {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }
  
  .mobile-submenu-link {
    flex: 1;
    height: 32px;
   
    display: flex;
    align-items: center;
    color: var(--black);
    text-decoration: none;
    font-family: var(--primary-font);
    font-size: 16px;
    font-weight: 400;
    text-transform: uppercase;
  }
  

`;
document.head.appendChild(style);

// Закрытие меню при клике на ссылку (кроме тех, что рядом со стрелками)
$(".mobile-menu-link:not(.mobile-menu-toggle-wrapper .mobile-menu-link), .mobile-sub-link").on("click", function() {
  setTimeout(() => {
    closeMobileMenu();
  }, 100);
});