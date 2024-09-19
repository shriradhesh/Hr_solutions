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
              // forget password Api -- 
                          //otp send  to admin email account  

 router.post('/AdminforgetPassOTP', Admin_and_staffController.AdminforgetPassOTP)

 // verify OTP
router.post('/AdminverifyOTP', Admin_and_staffController.AdminverifyOTP) 

// reset password and token verify

router.post('/adminResetPass/:adminId', Admin_and_staffController.adminResetPass)
                              
                                          /*staff section */
        // Api for particular staff Details
                     router.get('/getStaff_Details/:staff_id',  Admin_and_staffController.getStaff_Details)
        // Api for updatestaff
                     router.put('/updatestaff/:staff_id', upload.single('profileImage'),  Admin_and_staffController.updatestaff)
        // APi for astaff_ChangePassword
                      router.post('/staff_ChangePassword/:staff_id',  Admin_and_staffController.staff_ChangePassword)

                                             /* Employer Section */
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
        // Api for fav_job
                     router.post('/fav_job/:jobId', Admin_and_staffController.fav_job)
        // Api for get_All_favourite_jobs
                     router.get('/get_All_favourite_jobs', Admin_and_staffController.get_All_favourite_jobs)
        // 
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

                                 /*admin notification */
        // Api for getAdminNotification
                        router.get('/getAdminNotification', Admin_and_staffController.getAdminNotification)
        // Api for unseen_admin_notification_count
                        router.get('/unseen_admin_notification_count', Admin_and_staffController.unseen_admin_notification_count)
        // Api for seen_notification
                        router.post('/seen_notification/:notification_id', Admin_and_staffController.seen_notification )

                                                      /* FAQ Page */
          // Api for createFAQ
              router.post('/createFAQ', Admin_and_staffController.createFAQ)
       // Api for get_FAQdetails
                        router.get('/get_FAQdetails', Admin_and_staffController.get_FAQdetails)
       // Api for DeleteFAQ
                        router.delete('/DeleteFAQ/:faq_id', Admin_and_staffController.DeleteFAQ)

                                                    /* Contact us Page */
        // Api for get_contactUS
                       router.get('/get_contactUS', Admin_and_staffController.get_contactUS)
        // Api for DeleteContactUS
                        router.delete('/DeleteContactUS/:contact_id' , Admin_and_staffController.DeleteContactUS)

                        
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
    // Api for cmsHeadquarter
                router.post('/cmsHeadquarter/:adminId', Admin_and_staffController.cmsHeadquarter)
    // Api for getcms_headquarter
                router.get('/getcms_headquarter/:adminId', Admin_and_staffController.getcms_headquarter)
    // Api for cms_Hr_consultancy
                router.post('/cms_Hr_consultancy', upload.single('image'), Admin_and_staffController.cms_Hr_consultancy)
    // Api for  getHr_consultancy_Details
                 router.get('/getHr_consultancy_Details', Admin_and_staffController.getHr_consultancy_Details)
   // Api for cms_Training_development
                router.post('/cms_training_developement', upload.single('image'), Admin_and_staffController.cms_training_developement)
    // Api for get_training_development_Details
                router.get('/get_training_development_Details', Admin_and_staffController.get_training_development_Details) 
   // Api for cms_recruitment_selection
               router.post('/cms_recruitment_selection', upload.single('image'), Admin_and_staffController.cms_recruitment_selection)
   // Api for get_recruitment_selection_Details
               router.get('/get_recruitment_selection_Details', Admin_and_staffController.get_recruitment_selection_Details)
   // Api for cms_employee_outsourcing
              router.post('/cms_employee_outsourcing', upload.single('image'), Admin_and_staffController.cms_employee_outsourcing)
    // Api for get_outsourcing_Details
               router.get('/get_outsourcing_Details', Admin_and_staffController.get_outsourcing_Details)      
    // Api for cms_Hr_teleconsultation
               router.post('/cms_Hr_teleconsultation', upload.single('image'), Admin_and_staffController.cms_Hr_teleconsultation) 
     // Api for get_hr_teleconsultation_Details
               router.get('/get_hr_teleconsultation_Details', Admin_and_staffController.get_hr_teleconsultation_Details)
     // Api for cms_our_mission
               router.post('/cms_our_mission', Admin_and_staffController.cms_our_mission)
     // Api for get_ourMission_details
               router.get('/get_ourMission_details', Admin_and_staffController.get_ourMission_details)
     // Api for cms_aboutUs
                router.post('/cms_aboutUs', Admin_and_staffController.cms_aboutUs)
     // Api for get_aboutUS_details
                 router.get('/get_aboutUS_details', Admin_and_staffController.get_aboutUS_details)
      // Api for cms_our vission 
                router.post('/cms_our_vission', Admin_and_staffController.cms_our_vission)
                // Api for get_aboutUS_details
                            router.get('/get_ourVission_details', Admin_and_staffController.get_ourVission_details)
      // Api for cms_our commitment
                router.post('/cms_our_commitment', Admin_and_staffController.cms_our_commitment)
                // Api for get_ourCommitment_details
                            router.get('/get_ourCommitment_details', Admin_and_staffController.get_ourCommitment_details)
      // Api for get started today
                router.post('/cms_get_started_today', Admin_and_staffController.cms_get_started_today)
                // Api for get_ourCommitment_details
                            router.get('/get_started_todayDetails', Admin_and_staffController.get_started_todayDetails)
                // Api for cms_why_choose_us
           router.post('/cms_why_choose_us', Admin_and_staffController.cms_why_choose_us)
           // Api for getDetails_why_choose_us
               router.get('/getDetails_why_choose_us', Admin_and_staffController.getDetails_why_choose_us)
        // APi for cms_elite_talent_pool
                router.post('/cms_elite_talent_pool', upload.single('image') , Admin_and_staffController.cms_elite_talent_pool)
        // Api for get_cms_elite_talent_pool
                 router.get('/get_cms_elite_talent_pool', Admin_and_staffController.get_cms_elite_talent_pool)
         // Api for cms_footer_content
                  router.post('/cms_footer_content', Admin_and_staffController.cms_footer_content)
        // Api for get_cms_footer_content
                  router.get('/get_cms_footer_content', Admin_and_staffController.get_cms_footer_content)
        // Api for cms_acadmic_credentials_verifier
                   router.post('/cms_acadmic_credentials_verifier', upload.single('image') , Admin_and_staffController.cms_acadmic_credentials_verifier)
        // Api for get_acadmic_credentials_verifier
                   router.get('/get_acadmic_credentials_verifier', Admin_and_staffController.get_acadmic_credentials_verifier)

        // Api for create and update cms labour tool

                    router.post("/cms_labour_tool", Admin_and_staffController.cms_labour_tool)
        // Api for get_cms_labour_tool_details
                    router.get("/get_cms_labour_tool_details", Admin_and_staffController.get_cms_labour_tool_details)

        // Api for create and update cms_online_cources
                router.post("/cms_online_courses", upload.any(), Admin_and_staffController.cms_online_cources)
        // Api for get_cms_online_courses_details
                 router.get("/get_cms_online_courses_details", Admin_and_staffController.get_cms_online_courses_details)
        
        // Api for create and update cms_Home
                 router.post("/cms_Home", Admin_and_staffController.cms_Home)
        // Api for get_cms_Home
                 router.get("/get_cms_Home", Admin_and_staffController.get_cms_Home)
   

                                     /* labour LAW  */
       // Api for Overtime
               router.post('/Overtime', Admin_and_staffController.Overtime)
       // Api for leave_allowence
               router.post('/leave_allowence', Admin_and_staffController.leave_allowence)
       // Api for calculate_EOSB
               router.post('/calculate_EOSB', Admin_and_staffController.calculate_EOSB)
        // calculate new salary
               router.post('/net_salary', Admin_and_staffController.net_salary)

                                    /* Report & Analysis */
        // Api for jobseeker_count
                router.post('/jobseeker_count',Admin_and_staffController.jobseeker_count)
        // Api for getclient_count
                router.post('/getclient_count',Admin_and_staffController.getclient_count)
        // Api for get_talent_pool_count
                router.post('/get_talent_pool_count', Admin_and_staffController.get_talent_pool_count)
        // Api for get_female_screened_count
                router.post('/get_female_screened_count', Admin_and_staffController.get_female_screened_count)
        // Api for jobseeker_count_city_wise
                router.post('/jobseeker_count_city_wise', Admin_and_staffController.jobseeker_count_city_wise)


      // Api for news letter

               router.post('/newsLetter', Admin_and_staffController.newsLetter)
      // Api for getAll_newsLetter
               router.get('/getAll_newsLetter', Admin_and_staffController.getAll_newsLetter)

        // Api for carrer advice

                router.post('/new_carrer_advice', upload.single('image') , Admin_and_staffController.new_carrer_advice)
        // Api for all_carrer_details
                router.get('/all_carrer_details', Admin_and_staffController.all_carrer_details)
        // APi for delete_carrer_advice
                router.delete('/delete_carrer_advice/:carrer_advice_Id', Admin_and_staffController.delete_carrer_advice)
        // Api for generate sample file
                router.get("/generate_sampleFile", Admin_and_staffController.generate_sampleFile)
        // Api for import data for fixit finder
                router.post("/import_file", upload.single('file'), Admin_and_staffController.import_file)

                       /*job Skills */

         // Api for  addJob_skills
                router.post("/addJob_skills", Admin_and_staffController.addJob_skills)
        // Api for get alljobSkills
                router.get("/alljobSkills", Admin_and_staffController.alljobSkills)
        // Api for  deletejobskill
                router.delete("/deletejobskill/:jobskill_id", Admin_and_staffController.deletejobskill)  
        // Api for getJs
                router.post("/getJs", Admin_and_staffController.getJs)

        

        // Api for update_online_course
      
        router.put(
                '/update_online_course/:course_id',upload.any(),Admin_and_staffController.update_online_course
            );
            
        // Api for delete_course
          router.delete('/delete_course/:course_id', Admin_and_staffController.delete_course)

          // Api for get all_enq_of_courses
          router.get('/all_enq_of_courses', Admin_and_staffController.all_enq_of_courses)

                                               /* Online course Quiz */
         router.post('/course_quiz_test', Admin_and_staffController.course_quiz_test)
         // Api for get_quiz_test_of_course
         router.get('/get_quiz_test_of_course/:test_id', Admin_and_staffController.get_quiz_test_of_course)
         //Api for all_quiz_test
         router.get('/all_quiz_test', Admin_and_staffController.all_quiz_test)
         // Api for addQuestion_in_test
         router.post('/addQuestion_in_test/:test_id', Admin_and_staffController.addQuestion_in_test)
         // Api for delete_question_in_test
         router.delete('/delete_question_in_test/:test_id/:questionId', Admin_and_staffController.delete_question_in_test)
         // Api for delete
         router.delete('/delete_test/:test_id', Admin_and_staffController.delete_test)
         
module.exports = router


