const previews = Object.freeze({
  home: {
    src: './assets/pcl-launch-home.png',
    alt: 'PCL Re 启动主页：玩家名已遮挡，展示启动游戏、当前游戏版本、公告和版本设置',
    caption: '每一场冒险，从一次启动开始。',
  },
  versions: {
    src: './assets/pcl-launch-versions.png',
    alt: 'PCL Re 游戏下载页面：加载后展示 Minecraft 最新正式版 26.3 和预览版 26.4-snapshot-6',
    caption: '游戏版本与社区资源，加载就绪。',
  },
  online: {
    src: './assets/pcl-launch-online.png',
    alt: 'PCL Re 联机页面：创建房间，或输入邀请码加入房间',
    caption: '输入邀请码，和朋友一起出发。',
  },
});

const previewImage = document.querySelector('#preview-image');
const previewPanel = document.querySelector('#launcher-preview');
const previewCaption = document.querySelector('#preview-caption');
const previewTabs = [...document.querySelectorAll('[data-preview]')];

function selectPreview(name) {
  const preview = previews[name];
  if (!preview) return;
  previewImage.src = preview.src;
  previewImage.alt = preview.alt;
  previewCaption.textContent = preview.caption;
  previewPanel.setAttribute('aria-labelledby', `preview-tab-${name}`);
  previewTabs.forEach((tab) => {
    const active = tab.dataset.preview === name;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
}

previewTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectPreview(tab.dataset.preview));
  tab.addEventListener('keydown', (event) => {
    let nextIndex;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % previewTabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + previewTabs.length) % previewTabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = previewTabs.length - 1;
    else return;
    event.preventDefault();
    selectPreview(previewTabs[nextIndex].dataset.preview);
    previewTabs[nextIndex].focus();
  });
});

document.querySelectorAll('[data-show-preview]').forEach((link) => {
  link.addEventListener('click', () => selectPreview(link.dataset.showPreview));
});

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', '展开导航菜单');
  mobileNav.hidden = true;
}

menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  menuButton.setAttribute('aria-label', expanded ? '展开导航菜单' : '收起导航菜单');
  mobileNav.hidden = expanded;
});

mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('click', (event) => {
  if (event.target instanceof Element && !event.target.closest('.site-header')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia('(min-width: 681px)').addEventListener('change', (event) => {
  if (event.matches) closeMenu();
});

document.querySelector('#copyright-year').textContent = String(new Date().getFullYear());

const navLinks = [...document.querySelectorAll('.desktop-nav .nav-link')];
const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href')));
let navUpdatePending = false;

function updateActiveNav() {
  const activeSection = [...sections].reverse().find((section) => section.getBoundingClientRect().top <= 160) ?? sections[0];
  navLinks.forEach((link) => {
    const active = link.getAttribute('href') === `#${activeSection.id}`;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  navUpdatePending = false;
}

window.addEventListener('scroll', () => {
  if (navUpdatePending) return;
  navUpdatePending = true;
  window.requestAnimationFrame(updateActiveNav);
}, { passive: true });
updateActiveNav();
