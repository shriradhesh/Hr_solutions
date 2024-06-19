const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = require('../upload')
const userController = require('../controller/userController')

                                      /* Employer Section */
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
        // Api for get activejobs_by_client
                router.get('/activejobs_by_client/:client_id', userController.activejobs_by_client)
        // Api for get Inactivejobs_by_client
                router.get('/Inactivejobs_by_client/:client_id', userController.Inactivejobs_by_client)

                

                 // forget password Api -- 
                          //otp send  to client email account  

 router.post('/forgetPassOTP', userController.forgetPassOTP)

 // verify OTP
router.post('/verifyOTP', userController.verifyOTP) 

// reset password and token verify

router.post('/clientResetPass/:clientId', userController.clientResetPass)
        

                                                 /*job title section */
        // Api for add jobTitle
                         router.post('/addJobTitle', userController.addJobTitle)
        // Api for alljobTitle
                        router.get('/alljobTitle', userController.alljobTitle)
        // Api for deletejobTitle
                         router.delete('/deletejobTitle/:jobtitle_id', userController.deletejobTitle)

                                                /* job Description */
        // Api for add jD
                         router.post('/addJob_Description', userController.addJob_Description)
        // Api for alljobDescription
                        router.get('/alljobDescription', userController.alljobDescription)
        // Api for getJd
                        router.post('/getJd' , userController.getJd)
        // Api for deleteJob_Description
                        router.delete('/deleteJob_Description/:Jd_id', userController.deleteJob_Description)

                                           /* psychomatric testing section */
        // Api for add psychometric_questions
                        router.post('/psychometric_questions', userController.psychometric_questions)
        // Api for getquestions
                        router.get('/getquestions/:psychometric_questions_Id', userController.getquestions)
        // Api for addQuestion
                        router.post('/addQuestion/:psychometric_questions_Id', userController.addQuestion)
         // Api for getAll_psychometric_questions
                        router.post('/getAll_psychometric_questions', userController.getAll_psychometric_questions)
        // Api for getAllTest
                        router.get('/getAllTest', userController.getAllTest)
        // Api for deletepsychometrcTest
                        router.delete('/deletepsychometrcTest/:psychometric_id',userController.deletepsychometrcTest )
        // Api for deletequestion_in_Test
                        router.delete('/deletequestion_in_Test/:testId/:questionId', userController.deletequestion_in_Test)
        // Api for get particlar Test
                         router.get('/getTest/:test_id', userController.getTest)  

                                       /* POST job section */
        // Api for postJob
                router.post('/postJob/:empId', userController.postJob)
        // Api for getJobs_posted_by_employee
                router.get('/getJobs_posted_by_employee/:empId' , userController.getJobs_posted_by_employee)
        // Api for get particular job'
                router.get('/getJob/:jobId', userController.getJob)
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
        // Api for filter job
                router.post('/filterJob', userController.filterJob)
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
        // Api for fixit_finder
                router.post('/fixit_finder', userController.fixit_finder)

                                            /* Dashboard */
         //Api for client_dashboardCount
                router.get('/client_dashboardCount/:client_id', userController.client_dashboardCount)

                              
                                         

                                          /* Contact US page */
         // Api for create_contactUS
                router.post('/create_contactUS', userController.create_contactUS)

                                        /* upload Resume */

         // Api for uploadResume
                 router.post('/uploadResume', upload.single('uploadResume') , userController.uploadResume)
        // Api for get_upload_section_candidates
                 router.get('/get_upload_section_candidates', userController.get_upload_section_candidates)
        // Api for candidate_recruitment_process_for_uploaded_candidate
                 router.post('/candidate_recruitment_process_for_uploaded_candidate/:candidateId' , userController.candidate_recruitment_process_for_uploaded_candidate)
        // Api for get_successfull_candidate
                 router.get('/get_successfull_candidate', userController.get_successfull_candidate)




module.exports = router