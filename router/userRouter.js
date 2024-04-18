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

                                                 /*job title section */
        // Api for add jobTitle
                         router.post('/addJobTitle', userController.addJobTitle)
        // Api for alljobTitle
                        router.get('/alljobTitle', userController.alljobTitle)
        // Api for deletejobTitle
                         router.delete('/deletejobTitle/:jobtitle_id', userController.deletejobTitle)

                                           /* Phyciomatric testing */
        // Api for add psychometric_questions
                        router.post('/psychometric_questions', userController.psychometric_questions)
         // Api for getAll_psychometric_questions
                        router.post('/getAll_psychometric_questions', userController.getAll_psychometric_questions)

                                       /* POST job section */
        // Api for postJob
                router.post('/postJob/:empId', userController.postJob)
        // Api for getJobs_posted_by_employee
                router.get('/getJobs_posted_by_employee/:empId' , userController.getJobs_posted_by_employee)
        // Api for get_Female_jobseeker_profile
                router.get('/get_Female_jobseeker_profile/:jobId', userController.get_Female_jobseeker_profile)
        // Api for get_jobseeker_profile
                router.get('/get_jobseeker_profile/:jobId', userController.get_jobseeker_profile)
         // Api for deleteJob
                router.delete('/deleteJob/:jobId', userController.deleteJob)
         // Api for deleteCandidate
                router.delete('/deleteCandidate/:candidateId', userController.deleteCandidate)
        // Api for export_candidate
                router.get('/export_candidate/:gender', userController.export_candidate)

        
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

                                         /* Privacy Policy Section */

        // Api for getAllEmp_privacy_policy
        router.get('/get_privacy_policy', userController.get_privacy_policy)


                                       /*  Term & condition Section */
       // Api for get_emp_term_condition
       router.get('/get__admin_term_condition', userController.get__admin_term_condition)

                                      /* Services Page */
         // Api for getServices page Details
                 router.get('/getServices_of_smart_start', userController.getServices_of_smart_start)

                                        /* CMS */
        // Api for dashboard_counts
                 router.get('/dashboard_counts', userController.dashboard_counts)
        // Api for cms_getJobs_posted_procedure_section1
                 router.get('/cms_getJobs_posted_procedure_section1', userController.cms_getJobs_posted_procedure_section1)
        // APi for cms_get_need_any_job_section2
                 router.get('/cms_get_need_any_job_section', userController.cms_get_need_any_job_section)
        // Api for get_cms_post_your_job
                 router.get('/get_cms_post_your_job', userController.get_cms_post_your_job)
        // Api for cms_getjob_market_data
                router.get('/cms_getjob_market_data', userController.cms_getjob_market_data)


        




module.exports = router