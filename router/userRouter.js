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
                router.post('/postJob/:empId', userController.postJob)
        // Api for getJobs_posted_by_employee
                router.get('/getJobs_posted_by_employee/:empId' , userController.getJobs_posted_by_employee)
        // Api for get_Female_jobseeker_profile
                router.get('/get_Female_jobseeker_profile/:jobId', userController.get_Female_jobseeker_profile)
        // Api for get_jobseeker_profile
                router.get('/get_jobseeker_profile/:jobId', userController.get_jobseeker_profile)
        
                                      /* JOb Seeker section */
        // Api for allJobs
                router.get('/getAll_Jobs', userController.getAll_Jobs)
        // Api for searchJob
                router.post('/searchJob', userController.searchJob)
        // Api for apply_on_job
                router.post('/apply_on_job/:jobId', upload.single('uploadResume'), userController.apply_on_job)

                                   /*Notification section */

        // Api for getNotification_emp
                router.get('/getNotification_emp/:empId', userController.getNotification_emp)
        // Api for seenNotification
                router.post('/seenNotification/:notification_id', userController.seenNotification)
        // Api for get unseenNotificationCount
                router.get('/unseenNotificationCount/:empId', userController.unseenNotificationCount)




module.exports = router