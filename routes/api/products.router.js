import { Router } from 'express';
import Product from '../../models/Product.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;
    limit = parseInt(limit) || 10;
    page  = parseInt(page)  || 1;

    const filter = {};
    if (query) {
      if (query === 'true' || query === 'false') {
        filter.status = query === 'true';
      } else {
        filter.category = query;
      }
    }

    let sortOption = {};
    if (sort === 'asc')  sortOption = { price: 1 };
    if (sort === 'desc') sortOption = { price: -1 };

    const options = { page, limit, sort: sortOption, lean: true };
    const result = await Product.paginate(filter, options);

    const baseURL = `/api/products?limit=${limit}`
                  + (sort ? `&sort=${sort}` : '')
                  + (query ? `&query=${query}` : '');

    res.json({
      status:     'success',
      payload:    result.docs,
      totalPages: result.totalPages,
      prevPage:   result.prevPage,
      nextPage:   result.nextPage,
      page:       result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink:   result.hasPrevPage ? `${baseURL}&page=${result.prevPage}` : null,
      nextLink:   result.hasNextPage ? `${baseURL}&page=${result.nextPage}` : null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Error al obtener productos' });
  }
});

export default router;