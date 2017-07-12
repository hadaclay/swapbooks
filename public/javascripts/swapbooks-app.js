import '../sass/style.scss';

const trade_requests_button = document.querySelector('#trade_requests');
const trade_offers_button = document.querySelector('#trade_offers');
const navbar_toggle = document.querySelector('.navbar-burger');
const navbar_menu = document.querySelector('#navMenu');

if (trade_requests_button) {
  trade_requests_button.onclick = function() {
    const request_list = document.querySelector('.trade_requests');
    if (request_list.style.display === 'none') {
      request_list.style.display = 'block';
    } else {
      request_list.style.display = 'none';
    }
  };
}

if (trade_offers_button) {
  trade_offers_button.onclick = function() {
    const request_list = document.querySelector('.trade_offers');
    if (request_list.style.display === 'none') {
      request_list.style.display = 'block';
    } else {
      request_list.style.display = 'none';
    }
  };
}

navbar_toggle.onclick = function() {
  if (!navbar_toggle.classList.contains('is-active')) {
    this.classList.add('is-active');
    navbar_menu.classList.add('is-active');
  } else {
    this.classList.remove('is-active');
    navbar_menu.classList.remove('is-active');
  }
};
