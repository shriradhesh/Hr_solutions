const express = require('express')
const router = express.Router()
const Admin_and_staffController = require('../controller/AdminController')
const multer = require('multer')
const upload = require('../upload')
const Admin = require('../model/Admin_and_staffs')


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
        // Api for active_inactive_Hr
                     router.post('/active_inactive_Hr/:hr_id', Admin_and_staffController.active_inactive_Hr)
                              
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
        // Api for send_notification_to_client
                     router.post('/send_notification_to_client', Admin_and_staffController.send_notification_to_client)
        // Api for sendNotification_to_allClient
                     router.post('/sendNotification_to_allClient', Admin_and_staffController.sendNotification_to_allClient)
        // Api for send notification
                     router.post('/send_notification/:superAdmin_Id', Admin_and_staffController.send_notification)


                                              /* JOb Section */
        // Api for active_inactive_job
                     router.post('/active_inactive_job/:jobId', Admin_and_staffController.active_inactive_job)
                
        // Api for getAllFemale_Candidate
                     router.get('/getAllFemale_Candidate', Admin_and_staffController.getAllFemale_Candidate)
        // APi for candidate_recruitment_process
                     router.post('/candidate_recruitment_process/:candidateId', Admin_and_staffController.candidate_recruitment_process)

                                             /* ATS Section */
        // Api for get All_candidates
                     router.get('/getAll_candidates', Admin_and_staffController.getAll_candidates)  

                                             /* Privacy & policy Section */
       
     // Api for create_privacy_policy for particular client

                   router.post('/create_privacy_policy/:adminId', Admin_and_staffController.create_privacy_policy)
     // Api for get_emp_privacy_policy
                          router.get('/get_admin_privacy_policy/:adminId', Admin_and_staffController.get_admin_privacy_policy)
                       
                                              /* Term & Condition Section */
     // Api for create_term_condition
                 router.post('/create_term_condition/:adminId', Admin_and_staffController.create_term_condition)
      // Api for get_emp_term_condition
                          router.get('/get_admin_term_condition/:adminId', Admin_and_staffController.get_admin_term_condition)
        

                                               /* Service Page */
        // Api for create_services
                        router.post('/create_services/:adminId',upload.single('image'), Admin_and_staffController.create_services)
        // Api for getService
                        router.get('/getService/:adminId',Admin_and_staffController.getService )

                        
                                                   /* CMS Page */
            /* Testimonial Section */

   // Api for create Testimonial for cms
                router.post('/create_testimonial', upload.single('user_image'), Admin_and_staffController.create_testimonial)
     // Api for getAll_testimonial
                router.get('/getAll_testimonial', Admin_and_staffController.getAll_testimonial)   
    // Api for get_testimonial
                router.get('/get_testimonial/:testimonial_id', Admin_and_staffController.get_testimonial)     
    // Api for update_testimonial
                router.put('/update_testimonial/:testimonial_id', upload.single('user_image'), Admin_and_staffController.update_testimonial)
    // Api for delete_testimonial
                router.delete('/delete_testimonial/:testimonial_id', Admin_and_staffController.delete_testimonial)   
    // Api for cms_job_posting_section1
                router.post('/cms_job_posting_section1/:adminId', Admin_and_staffController.cms_job_posting_section1 )
    // Api for getJobs_posted_procedure_section1
                router.get('/getJobs_posted_procedure_section1/:adminId', Admin_and_staffController.getJobs_posted_procedure_section1)
    // Api for cms_need_any_job_section
                 router.post('/cms_need_any_job_section/:adminId', upload.single('logo'), Admin_and_staffController.cms_need_any_job_section)
    // Api for get_cms_need_any_job_section
                router.get('/get_cms_need_any_job_section/:adminId', Admin_and_staffController.get_cms_need_any_job_section)
    // Api for cms_post_your_job_section
                router.post('/cms_post_your_job_section/:adminId', upload.single('logo'), Admin_and_staffController.cms_post_your_job_section)
    // Api for get_cms_post_your_job
               router.get('/get_cms_post_your_job/:adminId', Admin_and_staffController.get_cms_post_your_job)
    // Api for cms_job_market_data_section
               router.post('/cms_job_market_data_section/:adminId', upload.single('logo'), Admin_and_staffController.cms_job_market_data_section)
    // Api for get_cms_job_market_data
               router.get('/get_cms_job_market_data/:adminId', Admin_and_staffController.get_cms_job_market_data)
    // Api for cms_blog_section1
               router.post('/cms_blog_section1/:adminId', Admin_and_staffController.cms_blog_section1)
    // Api for getcmsBlog_section1
               router.get('/getcmsBlog_section1', Admin_and_staffController.getcmsBlog_section1)
    // Api for cmsBlog_section2
               router.post('/cmsBlog_section2',upload.single('photo'), Admin_and_staffController.cmsBlog_section2)
    // Api for  getBlogDetails
               router.get('/getBlogDetails', Admin_and_staffController.getBlogDetails) 
    // Api for update_cms_blog
                router.put('/update_cms_blog/:blogId', upload.single('photo'),  Admin_and_staffController.update_cms_blog)
    // Api for deleteBlog
                router.delete('/deleteBlog/:blogId', Admin_and_staffController.deleteBlog)
     
             


module.exports = router


