const express = require('express')
const router = express.Router()
const Admin_and_staffController = require('../controller/AdminController')
const multer = require('multer')
const upload = require('../upload')

                                       /*  Admin and staff Section */
        // Api for  login

                     router.post('/login', Admin_and_staffController.login)
        // Api for getAdmin
                     router.get('/getAdmin/:adminId', Admin_and_staffController.getAdmin)
        // Api for updateAdmin
                    router.put('/updateAdmin/:adminId', upload.single('profileImage'), Admin_and_staffController.updateAdmin)
        // APi for admin_ChangePassword
                    router.post('/admin_ChangePassword/:adminId', Admin_and_staffController.admin_ChangePassword)
        // Api for addStaff
                     router.post('/addStaff/:adminId', upload.single('profileImage'), Admin_and_staffController.addStaff)
        // Api for getAll_Staffs
                     router.get('/getAll_Staffs', Admin_and_staffController.getAll_Staffs)

                                             /* Employee Section */
        // Api for getAllEmp
                     router.get('/getAllEmp', Admin_and_staffController.getAllEmp)
        // Api for active_inactive_emp
                     router.post('/active_inactive_emp/:empId', Admin_and_staffController.active_inactive_emp)


                                              /* JOb Section */
        // Api for active_inactive_job
                     router.post('/active_inactive_job/:jobId', Admin_and_staffController.active_inactive_job)
                          








module.exports = router


