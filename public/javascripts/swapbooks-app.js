import '../sass/style.scss';

const trade_requests_button = document.querySelector('#trade_requests');
const trade_offers_button = document.querySelector('#trade_offers');

trade_requests_button.onclick = function() {
  const request_list = document.querySelector('.trade_requests');
  if (request_list.style.display === 'none') {
    request_list.style.display = 'block';
  } else {
    request_list.style.display = 'none';
  }
};

trade_offers_button.onclick = function() {
  const request_list = document.querySelector('.trade_offers');
  if (request_list.style.display === 'none') {
    request_list.style.display = 'block';
  } else {
    request_list.style.display = 'none';
  }
};
