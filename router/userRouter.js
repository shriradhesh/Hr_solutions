const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = require('../upload')
const userController = require('../controller/userController')

                                      /* Employee Section */
        // APi for employee SignUp

               router.post('/employeeSignup', upload.single('profileImage'), userController.employeeSignup )
        // APi for login employee
               router.post('/Emp_login', userController.Emp_login)
        // APi for getEmployeeDetails
                router.get('/getEmployeeDetails/:empId', userController.getEmployeeDetails)
        // APi for updateEmp
                router.put('/updateEmp/:empId', upload.single('profileImage'), userController.updateEmp)
        // APi for emp_ChangePassword
                router.post('/emp_ChangePassword/:empId', userController.emp_ChangePassword)

                                       /* POST job section */
        // Api for postJob
                router.post('/postJob/:empId', upload.single('job_photo'), userController.postJob)
        // Api for getJobs_posted_by_employee
                router.get('/getJobs_posted_by_employee/:empId' , userController.getJobs_posted_by_employee)
        
                                      /* JOb Seeker section */
        // Api for allJobs
                router.get('/getAll_Jobs', userController.getAll_Jobs)
        // Api for searchJob
                router.post('/searchJob', userController.searchJob)






module.exports = router