const express = require('express');
const axios = require('axios');
const router = express.Router();

function limitOffset(array, limit, offset) {
    if (!array) return [];

    const length = array.length;

    if (!length) {
        return [];
    }
    if (offset > length - 1) {
        return [];
    }

    const start = Math.min(length - 1, offset);
    const end = Math.min(length, offset + limit);

    return array.slice(start, end);
}

/**
 * @swagger
 * /api/pokemon/types:
 *   get:
 *     summary: Obtiene listado de tipos.
 *     description: Obtiene listado de tipos.
 *     tags:
 *       - GET Pokemon 
 *     responses:
 *       200:
 *         description: Listado de tipos.
 *         content:
 *           application/json:
 *             example:
 *               results:
 *                 - name: "normal"
 *                   id: "1"
 *                 - name: "fighting"
 *                   url: "2"
 *                 - ...
 */
router.get('/types', async (req, res) => {
    try {

        const response = await axios.get(`${process.env.API_POKE}type`);
        const data = response?.data;
        const results = data.results.map((result)=>{
            return {
                name: result.name,
                id: result.url.match(/(\d+)/g)[1],
            }
        })
        
        res.json({
            count: data.count,
            results
        });
    }
    catch (error) {
        res.status(404).send(`Error al listar. ${error}`);
    }
});

/**
 * @swagger
 * /api/pokemon/types/{id}:
 *   get:
 *     summary: Obtiene una listado de Pokémon filtrado por tipo.
 *     description: Obtiene una listado de Pokémon. Hasta 20 unidades, indicando el numero a omitir.
 *     tags:
 *       - GET Pokemon 
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Número a omitir en el listado a devolver.
 *     responses:
 *       200:
 *         description: Listado de Pokémon.
 *         content:
 *           application/json:
 *             example:
 *               count: 102
 *               results:
 *                 - id: 317
 *                   name: "swalot"
 *                 - ...
 */
router.get('/types/:id', async (req, res) => {
    const id = req?.params?.id;
    const { offset } = req.query;
    try {

        const response = await axios.get(`${process.env.API_POKE}type/${id}`);
        const data = response?.data;
        const promiseArray = limitOffset(data.pokemon,20,Number(offset)||0).map((pokemon)=>{
            return axios.get(pokemon.pokemon.url);
        })
        const detailResponse = await Promise.all(promiseArray)
        const results = detailResponse.map(({data:detail})=>{
            return {
                id: detail.id,
                name: detail.name,
                stats: detail.stats,
                types: detail.types,
                sprites: {front_default:detail.sprites.front_default},
            }
        })
        
        res.json({
            count: data.pokemon.length,
            results
        });
    }
    catch (error) {
        res.status(404).send(`Error al listar. ${error}`);
    }
});

/**
 * @swagger
 * /api/pokemon/{search}:
 *   get:
 *     summary: Obtiene un Pokémon por busqueda.
 *     description: Obtiene un Pokémon por busqueda.
 *     tags:
 *       - GET Pokemon 
 *     responses:
 *       200:
 *         description: Listado de Pokémon.
 *         content:
 *           application/json:
 *             example:
 *               id: 102
 *               name: "swalot"
 */
router.get('/:search', async (req, res) => {
    const search = req?.params?.search.trim().toLowerCase();
    try {
        const response = await axios.get(`${process.env.API_POKE}pokemon/${search}`);
        const data = response?.data;
        const info = {
            id: data.id,
            name: data.name,
            stats: data.stats,
            types: data.types,
            abilities: data.abilities,
            moves: data.moves,
            weight: data.weight,
            sprites: {front_default:data.sprites.front_default},
        };
        res.json(info);
    }
    catch (error) {
        res.status(404).send(`No se encuentra el Pokémon ${search}`);
    }
});


/**
 * @swagger
 * /api/pokemon:
 *   get:
 *     summary: Obtiene una listado de Pokémon.
 *     description: Obtiene una listado de Pokémon. Hasta 20 unidades, indicando el numero a omitir.
 *     tags:
 *       - GET Pokemon 
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Número a omitir en el listado a devolver.
 *     responses:
 *       200:
 *         description: Listado de Pokémon.
 *         content:
 *           application/json:
 *             example:
 *               count: 102
 *               results:
 *                 - id: 317
 *                   name: "swalot"
 *                 - ...
 */
router.get('/', async (req, res) => {
    try {
        const { offset } = req.query;

        const response = await axios.get(`${process.env.API_POKE}pokemon?offset=${offset}&limit=20`);
        const data = response?.data;
        const promiseArray = data.results.map((pokemon)=>{
            return axios.get(pokemon.url);
            
        })
        const detailResponse = await Promise.all(promiseArray)
        const results = detailResponse.map(({data:detail})=>{
            return {
                id: detail.id,
                name: detail.name,
                stats: detail.stats,
                types: detail.types,
                sprites: {front_default:detail.sprites.front_default},
            }
        })
        
        res.json({
            count: data.count,
            results
        });
    }
    catch (error) {
        res.status(404).send(`Error al listar. ${error}`);
    }
});


module.exports = router;