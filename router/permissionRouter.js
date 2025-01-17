const express = require('express')
const router = express.Router()
const permissionController = require('../controller/permissionController')


                                 /* Permission Section */


router.post('/add_endPoints' , permissionController.add_endPoints)
// Api for update permission

router.post('/updatePermission', permissionController.updatePermission)

// Api for get_permissions_data
router.get('/get_permissions_data', permissionController.get_permissions_data)



module.exports = router