const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const app = express();
const axios = require('axios');
const ejs = require('ejs');

app.listen(3000, () => {});

app.use(express.static('public'));
app.use(express.json());
app.use(favicon(path.join(__dirname, './public/images/favicon.ico')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/items', async(req, res) => {
    try {
        const query = req.query.search;
        const response = await axios.get(`https://api.mercadolibre.com/sites/MLA/search?q=${query}&limit=4`);
        const data = response.data;

        const result = {
            author: {
                name: 'Valentino',
                lastname: 'Buratto'
            },
            items: data.results.map(item => ({
                id: item.id,
                title: item.title,
                sold_quantity: item.sold_quantity,
                text_search: query,
                price: {
                    currency: item.currency_id,
                    amount: item.price.toLocaleString(),
                    decimals: 0
                },
                picture: item.thumbnail,
                free_shipping: item.shipping.free_shipping,
                address: {
                    state_name: item.address.state_name,
                    city_name: item.address.city_name
                },
                attributes: {
                    brand: item.attributes.name,
                    group_name: item.attributes.attribute_group_name,
                    condition: item.attributes.value_name
                }
            }))
        };

        res.render('product-list', { result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en la búsqueda de productos, intente nuevamente.' });
    }
});

app.get('/items/:id', async(req, res) => {
    try {
        const query = req.params.id;
        const response = await axios.get(`https://api.mercadolibre.com/items/${query}`);
        const response_description = await axios.get(`https://api.mercadolibre.com/items/${query}/description`);
        const data = response.data;
        const data_description = response_description.data;
        const condition_product = data.attributes.find(filter => filter.id === 'ITEM_CONDITION').values.map(value => value.name);

        const result = {
            author: {
                name: 'Valentino',
                lastname: 'Buratto'
            },
            items: {
                id: data.id,
                title: data.title,
                sold_quantity: data.sold_quantity,
                price: {
                    currency: data.currency_id,
                    amount: data.price.toLocaleString(),
                    decimals: 0
                },
                picture: data.thumbnail,
                free_shipping: data.shipping.free_shipping,
                attributes: {
                    brand: data.attributes.name,
                    group_name: data.attributes.attribute_group_name,
                    condition: condition_product
                },
                description: {
                    items: {
                        text: data_description.plain_text,
                    }
                }
            }
        };

        res.render('product-detail', { result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al ver el detalle del producto, intente nuevamente.' });
    }
});