
let index;
const getIndex = async () => {
  if (!index) {
    index = new Promise((resolve) => {
      fetch('/turtles-index.json')
        .then((response) => response.json())
        .then((json) => {
          resolve(json.data);
        });
    });
  }
  return index;
}

const displayResults = (container, items) => {
  container.innerHTML = '';
  if (!items.length) { 
    const div = document.createElement('div');
    div.className = 'no-results';
    div.textContent = 'No results found';
    container.append(div);
  } else {
    items.forEach((item) => {
      const { path, id, date, image } = item;
      const result = document.createElement('div');
      result.classList.add('result');
      result.innerHTML = `
        <a href="${path}">
          <img src="${image}" alt="${id}">
          <div class="id">${id}</div>
          <div class="date">${date}</div>
        </a>
      `;
      container.append(result);
    });
  }
}

export default function decorate(block) {
  const search = document.createElement('input');
  search.type = 'search';
  search.id = 'search';
  search.placeholder = 'Search your turtles';
  search.setAttribute('aria-label', 'Search your turtles');
  search.setAttribute('autocomplete', 'off');
  search.setAttribute('spellcheck', 'false');
  
  block.append(search);

  const results = document.createElement('div');
  results.classList.add('results');
  block.append(results);

  search.addEventListener('input', async () => {
    const index = await getIndex();
    const query = search.value.toLowerCase();
    console.log(index);
    const items = index.filter((item) => {
      const { id, date, 'capture-method': captureMethod } = item;
      if (id.toLowerCase().includes(query)) return true;
      if (date.toLowerCase().includes(query)) return true;
      if (captureMethod.toLowerCase().includes(query)) return true;
      return false;
    });
    console.log(items);
    displayResults(results, items);
  });
  getIndex();
}