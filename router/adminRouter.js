const express = require('express')
const router = express.Router()
const Admin_and_staffController = require('../controller/AdminController')
const multer = require('multer')
const upload = require('../upload')


                                       /*  Admin Section */
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
                              
                                          /*staff section */
        // Api for particular staff Details
                     router.get('/getStaff_Details/:staff_id',  Admin_and_staffController.getStaff_Details)
        // Api for updatestaff
                     router.put('/updatestaff/:staff_id', upload.single('profileImage'),  Admin_and_staffController.updatestaff)
        // APi for astaff_ChangePassword
                      router.post('/staff_ChangePassword/:staff_id',  Admin_and_staffController.staff_ChangePassword)

                                             /* Employee Section */
        // Api for getAllEmp
                     router.get('/getAllEmp', Admin_and_staffController.getAllEmp)
        // Api for active_inactive_emp
                     router.post('/active_inactive_emp/:empId', Admin_and_staffController.active_inactive_emp)


                                              /* JOb Section */
        // Api for active_inactive_job
                     router.post('/active_inactive_job/:jobId', Admin_and_staffController.active_inactive_job)
        // Api for getAllFemale_Candidate
                     router.get('/getAllFemale_Candidate', Admin_and_staffController.getAllFemale_Candidate)
        // APi for candidate_recruitment_process
                     router.post('/candidate_recruitment_process/:candidateId', Admin_and_staffController.candidate_recruitment_process)








module.exports = router


