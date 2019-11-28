const express = require('express');
const router = express.Router();

const CTRComments = require('../apps/controller/CTRComments');

router.post('/', CTRComments.create);
router.delete('/', CTRComments.delete);
router.get('/more', CTRComments.more);

module.exports = router