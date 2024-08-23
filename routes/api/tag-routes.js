const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// GET all tags, including associated Product data
router.get('/', (req, res) => {
  Tag.findAll({
    include: [{ model: Product, through: ProductTag }],
  })
    .then(tags => res.json(tags))
    .catch(err => res.status(500).json(err));
});

// GET a single tag by its `id`, including associated Product data
router.get('/:id', (req, res) => {
  Tag.findByPk(req.params.id, {
    include: [{ model: Product, through: ProductTag }],
  })
    .then(tag => {
      if (!tag) {
        res.status(404).json({ message: 'Tag not found' });
        return;
      }
      res.json(tag);
    })
    .catch(err => res.status(500).json(err));
});

// POST a new tag
router.post('/', (req, res) => {
  Tag.create(req.body)
    .then(tag => res.status(201).json(tag))
    .catch(err => res.status(400).json(err));
});

// PUT update a tag's name by its `id` value
router.put('/:id', (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then(([updated]) => {
      if (updated) {
        return Tag.findByPk(req.params.id);
      } else {
        res.status(404).json({ message: 'Tag not found' });
      }
    })
    .then(updatedTag => res.json(updatedTag))
    .catch(err => res.status(400).json(err));
});

// DELETE a tag by its `id` value
router.delete('/:id', (req, res) => {
  Tag.destroy({
    where: { id: req.params.id }
  })
    .then(deleted => {
      if (deleted) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: 'Tag not found' });
      }
    })
    .catch(err => res.status(500).json(err));
});

module.exports = router;
