const express = require('express')
const router = express.Router()
const permissionController = require('../controller/permissionController')


                                 /* Permission Section */


router.post('/add_endPoints' , permissionController.add_endPoints)



module.exports = router