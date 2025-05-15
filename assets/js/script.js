'use strict';

// Language translations
const translations = {
  en: {
    title: "Mehdi Anvari | Personal Website",
    MyName: "Mehdi Anvari",
    position: "Web Developer",
    email: "email",
    phone: "phone",
    age: "age",
    location: "location",
    address: "Iran, Tehran",
    aboutMe_1: "I am Mehdi Anvari, a passionate and experienced backend developer with approximately 5 years of professional experience. My journey in software development began with frontend technologies, including HTML, CSS, JavaScript, Tailwind and Bootstrap. These experiences laid a solid foundation for my technical skills and allowed me to build visually appealing and user-friendly interfaces.",
    aboutMe_2: "However, my interest naturally shifted towards backend development, where I found my true calling. Over the past few years, I have dedicated myself to mastering backend technologies and have been actively working with PHP, Laravel, and MySQL. My expertise includes designing efficient database architectures, developing scalable and secure web applications, and integrating complex systems to ensure seamless functionality. I am highly committed to staying updated with the latest trends and advancements in backend development and am always eager to take on challenging projects that push the boundaries of my technical knowledge. My goal is to deliver clean, efficient, and maintainable code while collaborating effectively with cross-functional teams to bring ideas to life.",
    about: "About",
    resume: "Resume",
    portfolio: "Portfolio",
    blog: "Blog",
    contact: "Contact",
    aboutMe: "About me",
    whatImDoing: "What i'm doing",
    webDesign: "Web design",
    webDevelopment: "Web development",
    mobileApps: "Mobile apps",
    photography: "Photography",
    education: "Education",
    experience: "Experience",
    mySkills: "My skills",
    contactForm: "Contact Form",
    fullName: "Full name",
    emailAddress: "Email address",
    yourMessage: "Your Message",
    sendMessage: "Send Message",
    // Add more translations as needed
  },
  fa: {
    title: "سایت شخصی مهدی انوری",
    MyName: "مهدی انوری",
    position: "توسعه دهنده وب",
    email: "ایمیل",
    phone: "تلفن",
    age: "سن",
    location: "مکان",
    address: "ایران، تهران",
    aboutMe_1: "من مهدی انوری هستم، یک توسعه‌دهنده بک‌اند با‌انگیزه و با‌تجربه، با حدود ۵ سال سابقه حرفه‌ای در این حوزه. مسیر برنامه‌نویسی من با تکنولوژی‌های فرانت‌اند مثل HTML، CSS، JavaScript، Tailwind و Bootstrap شروع شد. این تجربه‌ها پایه‌ای قوی برای مهارت‌های فنی من ساختند و بهم کمک کردند تا رابط‌های کاربری زیبا و کاربرپسندی طراحی کنم.",
    aboutMe_2: "با این حال، علاقه‌م کم‌کم به سمت توسعه‌ی بک‌اند کشیده شد، جایی که واقعاً احساس کردم جای من همونه. توی چند سال گذشته تمرکزم رو گذاشتم روی یادگیری عمیق‌تر تکنولوژی‌های بک‌اند و به‌صورت جدی با PHP، Laravel و MySQL کار کردم. تخصصم شامل طراحی ساختارهای پایگاه داده بهینه، توسعه اپلیکیشن‌های تحت وب مقیاس‌پذیر و امن، و یکپارچه‌سازی سیستم‌های پیچیده برای اجرای بی‌نقص و روان اون‌هاست. همیشه سعی می‌کنم خودم رو با جدیدترین روندها و پیشرفت‌های حوزه‌ی بک‌اند به‌روز نگه دارم و به انجام پروژه‌های چالش‌برانگیز که مرزهای دانش فنی‌م رو جابه‌جا می‌کنن، علاقه‌مندم. هدفم اینه که کدی تمیز، کارآمد و قابل نگهداری بنویسم و در کنار تیم‌های چند‌تخصصی، ایده‌ها رو به واقعیت تبدیل کنم.",
    about: "درباره من",
    resume: "رزومه",
    portfolio: "نمونه کارها",
    blog: "وبلاگ",
    contact: "تماس",
    aboutMe: "درباره من",
    whatImDoing: "چه کاری انجام می‌دهم",
    webDesign: "طراحی وب",
    webDevelopment: "توسعه وب",
    mobileApps: "برنامه‌های موبایل",
    photography: "عکاسی",
    education: "تحصیلات",
    experience: "تجربیات",
    mySkills: "مهارت‌های من",
    contactForm: "فرم تماس",
    fullName: "نام و نام خانوادگی",
    emailAddress: "آدرس ایمیل",
    yourMessage: "پیام شما",
    sendMessage: "ارسال پیام",
    // Add more translations as needed
  }
};

// Language switcher functionality
const langSwitch = document.querySelector("[data-lang-switch]");
let currentLang = 'en';

function switchLanguage() {
  currentLang = currentLang === 'en' ? 'fa' : 'en';
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'fa' ? 'rtl' : 'ltr';
  
  // Update all translatable elements
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    if (translations[currentLang][key]) {
      element.textContent = translations[currentLang][key];
    }
  });
  
  // Update placeholders
  document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
    const key = element.getAttribute('data-translate-placeholder');
    if (translations[currentLang][key]) {
      element.placeholder = translations[currentLang][key];
    }
  });
}

langSwitch.addEventListener('click', switchLanguage);

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// // modal variable
// const modalImg = document.querySelector("[data-modal-img]");
// const modalTitle = document.querySelector("[data-modal-title]");
// const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const targetPage = this.getAttribute('data-nav-target');
    
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].getAttribute('data-page') === targetPage) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  });
}