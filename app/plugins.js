const router = require ('express').Router ();
const express = require ('express');

router.use ('/bootstrap', express.static ('./node_modules/bootstrap/'));
router.use ('/bootstrap-icons', express.static ('./node_modules/bootstrap-icons/'));
router.use ('/jquery', express.static ('./node_modules/jquery'));
router.use ('/jqueryui', express.static ('./node_modules/jquery-ui-bundle'));
module.exports = router;