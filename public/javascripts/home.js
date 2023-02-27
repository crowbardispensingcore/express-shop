const baseUrl = `${location.protocol}//${location.host}`;

let page = 1;
let brandIds = [];
let typeIds = [];

const updateFilter = async () => {
    let url = `${baseUrl}/products?page=${page}`;
    if (brandIds.length > 0) {
        url += `&brand=${brandIds.join(';')}`;
    }
    if (typeIds.length > 0) {
        url += `&type=${typeIds.join(';')}`;
    }
    console.log(url);
    await generateProductPanel(url);
}

const generatePageControlPanel = async (currentPage, pageCount) => {
    const pageControlPanel = document.querySelector('#page-control-panel');
    pageControlPanel.innerHTML = '';
    page = currentPage;
    if (currentPage > 1) {
        const previousPageButton = document.createElement('button');
        previousPageButton.textContent = 'Previous Page';
        previousPageButton.addEventListener('click', async (event) => {
            page--;
            await updateFilter();
        });
        pageControlPanel.appendChild(previousPageButton);
    }
    const infoDiv = document.createElement('div');
    infoDiv.textContent = `${currentPage} / ${pageCount}`;
    pageControlPanel.appendChild(infoDiv);
    if (currentPage < pageCount) {
        const nextPageButton = document.createElement('button');
        nextPageButton.textContent = 'Next Page';
        nextPageButton.addEventListener('click', async (event) => {
            page++;
            await updateFilter();
        });
        pageControlPanel.appendChild(nextPageButton);
    }
}

const generateFilterPanel = async () => {
    const brandFilter = document.querySelector('#brand-filter');
    const typeFilter = document.querySelector('#type-filter');
    brandFilter.innerHTML = '';
    typeFilter.innerHTML = '';

    const response = await fetch(baseUrl + '/products/filters', {
        method: 'GET'
    });
    const data = await response.json();
    const brands = data.brands;
    const types = data.types;
    for (const brand of brands) {
        const div = document.createElement('div');
        const brandCheckbox = document.createElement('input');
        brandCheckbox.setAttribute('type', 'checkbox');
        brandCheckbox.setAttribute('data-product-id', brand._id);
        brandCheckbox.addEventListener('change', async (event) => {
            const id = event.target.getAttribute('data-product-id');
            if (event.target.checked) {
                brandIds.push(id);
            } else {
                brandIds = brandIds.filter(brandId => brandId !== id);
            }
            await updateFilter();
        });
        div.appendChild(brandCheckbox);
        const brandName = document.createElement('label');
        brandName.innerText = brand.name;
        div.appendChild(brandName);
        brandFilter.appendChild(div);
    }
    for (const type of types) {
        const div = document.createElement('div');
        const typeCheckbox = document.createElement('input');
        typeCheckbox.setAttribute('type', 'checkbox');
        typeCheckbox.setAttribute('data-product-id', type._id);
        typeCheckbox.addEventListener('change', async (event) => {
            const id = event.target.getAttribute('data-product-id');
            if (event.target.checked) {
                typeIds.push(id);
            } else {
                typeIds = typeIds.filter(typeId => typeId !== id);
            }
            await updateFilter();
        });
        div.appendChild(typeCheckbox);
        const typeName = document.createElement('label');
        typeName.setAttribute('for', type._id);
        typeName.innerText = type.name;
        div.appendChild(typeName);
        typeFilter.appendChild(div);
    }
    updateFavoriteButtonStates();
}

const generateFavoritePanel = async () => {
    const favoritePanel = document.querySelector('#favorite-panel');
    favoritePanel.innerHTML = '';

    const response = await fetch(baseUrl + '/user/favorites', {
        method: 'GET'
    });
    try {
        const data = await response.json();
        const favorites = data.favorites;
        for (const product of favorites) {
            const div = document.createElement('div');
            div.className = 'favorite-row';
            const productName = document.createElement('label');
            productName.innerText = product.name;
            div.appendChild(productName);
            const removeButton = document.createElement('button');
            removeButton.setAttribute('data-product-id', product._id);
            removeButton.innerText = 'Remove';
            removeButton.addEventListener('click', async () => {
                const productId = removeButton.getAttribute('data-product-id');
                const response = await fetch(baseUrl + '/user/favorites', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productId
                    })
                });
                const data = await response.json();
                favoritePanel.innerHTML = '';
                generateFavoritePanel();
            });
            div.appendChild(removeButton);
            favoritePanel.appendChild(div);
        }
        updateFavoriteButtonStates();
    } catch (error) {
        favoritePanel.textContent = 'Please log in.'
    }
}

const generateProductPanel = async (url) => {
    const productTable = document.querySelector('#product-table');
    productTable.innerHTML = '';

    const response = await fetch(url, {
        method: 'GET'
    });
    const data = await response.json();
    const products = data.products;
    const currentPage = data.currentPage;
    const pageCount = data.pageCount;

    for (const product of products) {
        const tr = document.createElement('tr');

        const nameTd = document.createElement('td');
        nameTd.innerText = product.name;
        tr.appendChild(nameTd);

        const brandTd = document.createElement('td');
        brandTd.innerText = product.brand.name;
        tr.appendChild(brandTd);

        const typeTd = document.createElement('td');
        typeTd.innerText = product.type.name;
        tr.appendChild(typeTd);

        const favoriteTd = document.createElement('td');
        const favoriteButton = document.createElement('button');
        favoriteButton.setAttribute('data-product-id', product._id);
        favoriteButton.className = 'favorite-button';
        favoriteButton.innerText = 'Favorite';
        favoriteButton.addEventListener('click', async (event) => {
            const productId = event.target.getAttribute('data-product-id');
            await fetch(baseUrl + '/user/favorites', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId
                })
            });
            generateFavoritePanel();

        });
        favoriteTd.appendChild(favoriteButton);
        tr.appendChild(favoriteTd);

        productTable.appendChild(tr);
    }

    await generatePageControlPanel(currentPage, pageCount);
    updateFavoriteButtonStates();
}

const updateFavoriteButtonStates = () => {
    const favoriteIds = [...document.querySelectorAll('.favorite-row button[data-product-id]')]
        .map(button => button.getAttribute('data-product-id'));

    const productButtons = document.querySelectorAll('#product-table button[data-product-id]');
    for (const button of productButtons) {
        const productId = button.getAttribute('data-product-id');
        if (favoriteIds.includes(productId)) {
            button.setAttribute('disabled', true);
        } else {
            button.removeAttribute('disabled');
        }
    }
};

(async () => {
    await generateFilterPanel();
    await generateFavoritePanel();
    await updateFilter();
})();