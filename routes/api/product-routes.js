const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// GET all products, including associated Category and Tag data
router.get('/', (req, res) => {
  Product.findAll({
    include: [
      { model: Category },
      { model: Tag, through: ProductTag }
    ],
  })
    .then(products => res.json(products))
    .catch(err => res.status(500).json(err));
});

// GET a single product by its `id`, including associated Category and Tag data
router.get('/:id', (req, res) => {
  Product.findByPk(req.params.id, {
    include: [
      { model: Category },
      { model: Tag, through: ProductTag }
    ],
  })
    .then(product => {
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      res.json(product);
    })
    .catch(err => res.status(500).json(err));
});

// POST a new product
router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// PUT update a product by its `id` value
router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);

          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        }).then(() => {
          return Product.findByPk(req.params.id, {
            include: [
              { model: Category },
              { model: Tag, through: ProductTag }
            ],
          });
        }).then((updatedProduct) => res.json(updatedProduct));
      } else {
        res.json(product);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// DELETE a product by its `id` value
router.delete('/:id', (req, res) => {
  Product.destroy({
    where: { id: req.params.id }
  })
    .then(deleted => {
      if (deleted) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    })
    .catch(err => res.status(500).json(err));
});

module.exports = router;
