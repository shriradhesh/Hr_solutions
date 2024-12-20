const mongoose = require('mongoose')
const express = require('express')
const bcrypt = require('bcrypt')
const path = require('path')
const send_EmployeeEmail = require('../utils/employeeEmail')
const Admin_and_staffsModel = require('../model/Admin_and_staffs')
const employeeModel = require('../model/employeeModel')
const jobModel = require('../model/jobModel')
const send_adminEmail = require('../utils/adminEmail')
const sendstaffEmail = require('../utils/staffEmail')
const appliedjobModel = require('../model/appliedJobModel')
const send_candidateEmail = require('../utils/candidateEmail')
const empNotificationModel = require('../model/employeeNotification')
const privacy_policyModel = require('../model/privacy_policy')
const term_condition = require('../model/term_condition')
const services = require('../model/servicePage')
const cms_testimonialModel = require('../model/cms_testimonial')
const stringSimilarity = require('string-similarity');
const cms_job_posting_sectionModel = require('../model/cms_job_posting_section1')
const cms_need_any_job_section_Model = require('../model/cms_need_any_job_section') 
const cms_postjobModel = require('../model/cms_post_your_job')
const cms_jobMarketData = require('../model/cms_job_market_data')
const cms_Blogsection1Model = require('../model/cmsBlogsection1')
const cmsBlogsection2Model = require('../model/cmsBlogSecion2')
const cmsHeadquarte_model = require('../model/cmsHeadquarter')
const otpModel = require('../model/otpModel')
const sendEmails = require('../utils/sendEmails')
const adminNotificationModel = require('../model/adminNotification')
const { notify } = require('../router/userRouter')
const cms_hr_consultancy_Model = require('../model/cms_Hr_consultancy')
const cms_t_d_Model = require('../model/cms_t_d')
const cms_recruitment_selection_Model = require('../model/cms_recruitment_selection')
const cms_employee_outsourcing_Model = require('../model/cms_outsourcing')
const cms_Hr_teleconsultation_model = require('../model/cms_hr_teleconsultation')
const faqModel = require('../model/Faq')
const contactUsModel = require('../model/contact_us')
const cms_our_mission_Model = require('../model/cms_our_mission')
const cms_our_vission_Model = require('../model/cms_our_vission')
const cms_aboutUs_Model = require('../model/cms_aboutUs')
const cms_our_commitment_Model = require('../model/cms_our_commitment')
const cms_get_started_today_Model = require('../model/cms_get_started_today')
const cms_why_choose_us_Model = require('../model/cms_why_choose_us')
const cms_elite_talent_pool_Model = require('../model/cms_elite_female_tooll')
const cms_footer_contentModel = require('../model/cms_footer_content')
const cms_acadmic_credentials_verifier_Model = require('../model/cms_acadmic_credentials_verifiers')
const cms_newsletter_Model = require('../model/newsletter')
const ResumeModel = require('../model/uploadResume')
const carrer_advice_model = require('../model/carrer_advice')
const fixit_finder_model = require('../model/fixit_finder_model')
const ExcelJs = require("exceljs");
const jobSkills_Model = require('../model/jobSkills')
const cms_labour_tool_Model = require('../model/cms_basic_labout_tool')
const cms_online_courses_Model = require('../model/cms_online_cources')
const cms_home_Model = require("../model/cms_Home")
const job_status_Email = require("../utils/job_email")

const candidate_cv_rating_Model = require('../model/candidateprofileRating')

const online_course_quiz_Model = require('../model/online_courses_quiz')
const courses_user_enroll_Model = require('../model/courses_enroll_user')
const user_enrolled_course_toic_quiz_manage_Model = require('../model/topic_quiz_manage')
const user_enrolled_course_toic_manage_Model = require('../model/user_enrolled_topic_manage')


const fs = require('fs')
const pdfParse = require('pdf-parse');
const natural = require('natural');

const mammoth = require('mammoth');
const { execSync } = require('child_process')
const course_transaction_model = require('../model/transaction')
const emailTemplateModel = require('../model/emailTemplateModel')

const clientPackageModel = require('../model/clientPackage')





                                                 /* Admin and staff Section */
           

    // Api for login admin and staffs

    const login = async (req, res) => {
        try {

            const { email, password } = req.body;
            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: "Email is Required",
                });
            }
            if (!password) {
                return res.status(400).json({
                    success: false,
                    message: "Password is Required",
                });
            }
            // Find Admin by email
            const admin_and_staffs = await Admin_and_staffsModel.findOne({ email: email  });
    
            if (!admin_and_staffs) {
                return res.status(400).json({
                    success: false,
                    message: "email incorrect"
                });
            }
    
            // Check if the stored password is in plain text
            if (admin_and_staffs.password && admin_and_staffs.password.startsWith("$2b$")) {
                // Password is already bcrypt hashed
                const passwordMatch = await bcrypt.compare(password, admin_and_staffs.password);
    
                if (!passwordMatch) {
                    return res.status(400).json({
                        success: false,
                        message: "Password incorrect"
                    });
                }

                   const status = admin_and_staffs.status
                if(status === 0)
                {
                    return res.status(400).json({
                         success : false ,
                         message : 'Your account is suspended. Please contact the super admin for further details'
                    })
                }
            } else {
                // Convert plain text password to bcrypt hash
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);
    
                // Update the stored password in the database
                admin_and_staffs.password = hashedPassword;               
                await admin_and_staffs.save();
            }         

    
            return res.status(200).json({
                success: true,
                message: `${admin_and_staffs.role} login Successfully`,
                data: admin_and_staffs,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "server error",
            });
        }
    };

    // Api for get Admin Details

         const getAdmin = async( req , res)=>{
               
                try {
                      const adminId = req.params.adminId
                    // check for adminId
                    if(!adminId)
                    {
                        return res.status(400).json({
                             success : false ,
                             message : 'admin Id required'
                        })
                    }

                    // check for admin
                const admin = await Admin_and_staffsModel.findOne({ _id : adminId })
                if(!admin)
                {
                    return res.status(400).json({
                           success : false ,
                           message : 'admin not found'
                    })
                }
                return res.status(200).json({
                        success : true ,
                        message : 'admin Details',
                        Details : admin
                })
                
                 }
                    
                catch (error) {
                      return res.status(500).json({
                               success : 'server error',
                               error_message : error.message
                      })
                }
                
         }

    // Api for update Admin Panel
            const updateAdmin = async( req , res)=>{
                 try {
                        const adminId = req.params.adminId
                    const { name , email , phone_no} = req.body
                    // check for adminId 
                    if(!adminId)
                    {
                        return res.status(400).json({
                             success : false,
                             message : 'admin Id required'
                        })
                    }
                       // check for existing admin

                       const exist_Admin = await Admin_and_staffsModel.findOne({ _id : adminId })
                       if(!exist_Admin)
                       {
                        return res.status(400).json({
                             success : false ,
                             message : 'Admin not found'
                        })
                       }

                          // update profile Image of the admin
                        let profileImage 
                        if(req.file)                       
                         // Update profileImage if a new file is provided
                         if (req.file && req.file.filename) {
                            // Get the file extension
                            const fileExtension = path.extname(req.file.filename).toLowerCase();

                            // List of allowed extensions
                            const allowedExtensions = ['.jpg', '.jpeg', '.png'];

                            // Check if the file extension is in the allowed list
                            if (allowedExtensions.includes(fileExtension)) {
                                // If valid, update the profile image
                                profileImage = req.file.filename;
                            } else {
                                // If not valid, throw an error
                                return res.status(400).json({
                                    success : false ,
                                    message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                            });
                            }
                          }

                        exist_Admin.name = name
                        exist_Admin.email = email
                        exist_Admin.phone_no = phone_no

                        if(profileImage)
                        {
                        exist_Admin.profileImage = profileImage
                        }
                        await exist_Admin.save()

                        return res.status(200).json({
                              success : true ,
                              message : 'Admin Details updated successfully '
                        })
                 } catch (error) {
                    return res.status(500).json({
                          success : false ,
                          message : 'server error',
                          error_message : error.message
                    })
                 }
            }

        // Api for changePassword
                  const admin_ChangePassword = async( req ,res)=>{
                       try {
                                const adminId = req.params.adminId
                             const { oldPassword , password , confirmPassword } = req.body
                                // check for admin Id

                                if(!adminId)
                                {
                                    return res.status(400).json({
                                           success : false,
                                           message : 'missing adminId'
                                    })
                                }
                             // check for required fields
                             const requiredFields = [ "oldPassword", "password", "confirmPassword"];

                            for (const field of requiredFields) {
                            if (!req.body[field]) {
                                return res
                                .status(400)
                                .json({
                                    message: `Missing ${field.replace("_", " ")} `,
                                    success: false,
                                });
                            }
                            }

                                // check for admin
                            const admin = await Admin_and_staffsModel.findOne({ _id : adminId })
                              
                                 if(!admin)
                                 {
                                    return res.status(400).json({
                                         success : false ,
                                         message : 'admin Details not found'
                                    })
                                 }
                                    const email = admin.email
                            // check for confirm password 

                              if(password !== confirmPassword)
                              {
                                return res.status(400).json({
                                     success : false ,
                                     message : 'confirmPassword incorrect'
                                })
                              }
                                
                              //  check for old password is matched with storedPassword
                              const isOldPasswordValid = await bcrypt.compare(
                                oldPassword,
                                admin.password
                              );

                              if(!isOldPasswordValid)
                              {
                                return res.status(400).json({
                                     success : false ,
                                     message : 'old Password incorrect '
                                })
                              }

                               // encrypt the newPassword

                        const hashedNewPassword = await bcrypt.hash(password, 10);
                        // update the admin password with new encrypted password
                        admin.password = hashedNewPassword;
                        // Prepare email content for the staff
                const adminEmailContent = `
                <p>Congratulations! Your Password Has been Changed .</p>
                <p>Here are your account details:</p>
                <table style="border-collapse: collapse; width: 50%; margin: auto; border: 1px solid #4CAF50; border-radius: 10px;">
                <tr>
                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; font-weight: bold;"><strong>Email:</strong></td>
                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">${email}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; font-weight: bold;"><strong>Password:</strong></td>
                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">${password}</td>
                </tr>
               
            </table>
            `;
            // Send email to the staff
            await send_adminEmail (admin.email, `Password Changed successfully ..!`, adminEmailContent);
                        await admin.save();
                        // send notification to admin
              try {
                const adminNotification =  adminNotificationModel.create({
                    title : 'password changed',
                    message: `your account password changed successfully`,
                    date: new Date(),
                    status: 1,
                });
                adminNotification.save();
            } catch (notificationError) {
                console.error('Error creating notification:', notificationError);
            }
                        return res.status(200).json({
                            success: true,
                            message: "Password changed Successfully",
                           
                        });
                        
                       } catch (error) {
                           return res.status(500).json({
                              success : false ,
                              message : 'server error',
                              error_message : error.message
                           })
                       }
                  } 
                                  
                  
                                                                 // Forget password of the client
             // Api for forget password (Genrate OTP)

                  
    const AdminforgetPassOTP = async (req, res) => {
        try {
            const { email } = req.body;
    
            if (!email || !isValidEmail(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Valid email is required"
                });
            }
    
            const admin = await Admin_and_staffsModel.findOne({ email 
            });
    
            if (!admin) {
                return res.status(400).json({ success: false, message: 'admin not found' });
            }
    
            const otp = generateOTP();
    
            // Save the OTP in the otpModel
            const otpData = {
                AdminId: admin._id,
                otp: otp
            };
            await otpModel.create(otpData);
                const emailContent = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Forgot Password - Reset Your Password</title>
                </head>
                <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
                    <div class="container" style="width: 80%; margin: 20px auto; padding: 20px; background: #ffffff; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
                        <section style="margin-top: 20px;">
                            <h2 style="color: #333; font-size: 24px; text-align: center; margin-bottom: 20px;">Dear ${admin.name} </h2>
                            <p style="color: #666; font-size: 16px; text-align: center; margin-bottom: 30px;">We received a request to reset your password. To proceed, please use the following One-Time Password (OTP):</p>
                            <div class="otp-box" style="background-color: #f3fcfd; text-align: center; padding: 20px; border-radius: 10px; margin: 0 auto 30px; max-width: 200px; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
                                <div class="otp-code" style="font-size: 36px; font-weight: bold; color: #333;">${otp}</div>
                            </div>
                            <p class="message" style="color: #666; font-size: 14px; text-align: center; margin-bottom: 20px;">This OTP will expire in 2 minutes.</p>
                            <p style="color: #666; font-size: 16px; text-align: center; margin-bottom: 20px;">If you didn't request a password reset, you can ignore this email.</p>
                            <p style="color: #666; font-size: 16px; text-align: center; margin-bottom: 20px;">Thank you!</p>
                            <div class="footer" style="text-align: center; margin-top: 40px; color: #666; font-size: 14px;">&copy;  Smart Start Ltd. All rights reserved.</div>
                        </section>
                    </div>
                </body>
                </html>
                `
           
            await sendEmails(admin.email, "Password reset", emailContent);
    
            res.status(200).json({ success: true, 
                                     message: "An OTP has been sent to your email",
                                     email: admin.email , 
                                     
                                     });
        } catch (error) {
            console.error('error', error);
            res.status(500).json({ success: false, message: "server error", error_message: error.message });
        }
    
        function isValidEmail(email) {
            // email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
    
        function generateOTP() {
            const otp = Math.floor(1000 + Math.random() * 9000).toString();
            return otp.slice(0, 4);
        }
    };


    // APi for verify OTP
    const AdminverifyOTP = async(req,res)=>{
        try {
          const { otp } = req.body
          if(!otp)
          {
            return res.status(400).json({ success : false , message : ' otp is required' })
          }
          const adminOTP = await otpModel.findOne ({ otp })
          if(!adminOTP)
          {
            return res.status(400).json({ success : false , message : ' Invalid OTP or expired' })
          }
          res.status(200).json({ success : true , message : 'otp verified successfully' , AdminId : adminOTP.AdminId})
        } catch (error) {
          return res.status(500).json({
                      success : false ,
                      message : 'server error',
                      error_message : error.message
          })
        }
       }

       // APi for otp verify and reset password for forget password 
                
       const adminResetPass = async (req, res) => {
        try {
            const { password , confirmPassword } = req.body;
            const adminId = req.params.adminId
            if (!password) {
                return res.status(400).json({ success: false, message: 'Password is required' });
            }
            if (!confirmPassword) {
                return res.status(400).json({ success: false, message: 'confirm password is required' });
            }
            if (!adminId) {
                return res.status(400).json({ success: false, message: 'adminId is required' });
            }                       
        
            const admin = await Admin_and_staffsModel.findById(adminId);

            if (!admin) {
                return res.status(400).json({ success: false, message: 'Invalid admin' });
            }

            // checlk if password and confirmpassword matched 
            if(password !== confirmPassword)
            {
                return res.status(400).json({
                        success : false ,
                        message : 'confirm password not matched'
                })
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            admin.password = hashedPassword;
            await admin.save();

            // Delete the used OTP
            await otpModel.deleteOne({ AdminId : adminId });

            // send notification to admin
            try {
                const adminNotification =  adminNotificationModel.create({
                    title : 'password reset',
                    message: `Your account password reset successfully`,
                    date: new Date(),
                    status: 1,
                });
                adminNotification.save();
            } catch (notificationError) {
                console.error('Error creating notification:', notificationError);
            }

            res.status(200).json({ success: true, message: 'Password reset successfully' });
        } catch (error) {
            console.error('error', error);
            res.status(500).json({ success: false, message: 'server error', error_message : error.message });
        }
    };
// APi for send notification to client
                 const send_notification_to_client = async ( req , res)=>{
                         try {
                               const { empId , title , message}= req.body

                            // validate input field
                            const requiredFields = ['title' , 'message']

                            for ( const field of requiredFields)
                            {
                                if(!req.body[field])
                                {
                                    return res.status(400).json({
                                           success : false ,
                                           message : `Missing ${field.replace('_', ' ')} field`
                                    })
                                }
                            }

                            if(!empId)
                            {
                                return res.status(400).json({
                                     success : false ,
                                     message : 'Client Id required'
                                })
                            }

                            // check for client
                            const checkEmp = await employeeModel.findOne({
                                  _id : empId
                            })

                            if(!checkEmp)
                            {
                                return res.status(400).json({
                                     success : false ,
                                     message : 'client not found'
                                })
                            }



                        // Prepare email content for client
                        let messageContent = ` <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>${title}</title>
                        </head>
                        <body style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px;">
                        
                            <div style="background-color: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                                <h2 style="color: #333; text-align: center; margin-bottom: 20px;">${title}</h2>
                                <p style="color: #555; font-size: 16px; line-height: 1.6;">Dear ${checkEmp.name},</p>
                                <p style="color: #555; font-size: 16px; line-height: 1.6;">Greetings of the Day,</p>
                                <p style="color: #555; font-size: 16px; line-height: 1.6;"><strong>Title:</strong> <span style="color: #FF5733;">${title}</span></p>
                                <p style="color: #555; font-size: 16px; line-height: 1.6;"><strong>Message:</strong> <span style="color: #3366FF;">${message}</span></p>
                                <p style="color: #555; font-size: 16px; line-height: 1.6;">If you have any questions, feel free to contact us.</p>
                            </div>
                        
                        </body>
                        </html>
                        `
                        send_EmployeeEmail (checkEmp.email , 'Notification from Admin', messageContent)

                        try {
                            var newNotification = await empNotificationModel.create({
                                empId: empId,
                                message: message,
                                date: new Date(),
                                status: 1,
                            });
                        
                            await newNotification.save();
                        } catch (notificationError) {
                            // Handle notification creation error
                            console.error('Error creating notification:', notificationError);
                            // Optionally, you can choose to return an error response here or handle it in another way
                        }

                        return res.status(200).json({
                             success : true ,
                             message : 'notification send'
                        })

                         } catch (error) {
                               return res.status(500).json({
                                  success : false ,
                                  message : 'server Error',
                                  error_message : error.message
                               })
                         }
                 }
                
        // Api for send Notification to all client
        const sendNotification_to_allClient = async (req, res) => {
            try {
                const { title, message } = req.body;
                const requiredFields = ['title', 'message'];
                
                for (const field of requiredFields) {
                    if (!req.body[field]) {
                        return res.status(400).json({
                            success: false,
                            message: `Missing ${field.replace('_', ' ')} field`
                        });
                    }
                }
        
                // Get all clients
                const allClients = await employeeModel.find({});
        
                if (allClients.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'No clients found'
                    });
                }
        
                // Prepare email content
                const messageContent = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>${title}</title>
                    </head>
                    <body style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px;">
                        <div style="background-color: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                            <h2 style="color: #333; text-align: center; margin-bottom: 20px;">${title}</h2>
                            <p style="color: #555; font-size: 16px; line-height: 1.6;">Greetings of the Day,</p>
                            <p style="color: #555; font-size: 16px; line-height: 1.6;"><strong>Title:</strong> <span style="color: #FF5733;">${title}</span></p>
                            <p style="color: #555; font-size: 16px; line-height: 1.6;"><strong>Message:</strong> <span style="color: #3366FF;">${message}</span></p>
                            <p style="color: #555; font-size: 16px; line-height: 1.6;">If you have any questions, feel free to contact us.</p>
                        </div>
                    </body>
                    </html>
                `;
        
                const notifications = [];
        
                // Send the same notification to all clients
                for (const client of allClients) {
                    // Send email to client
                    send_EmployeeEmail(client.email, 'Notification', messageContent);
        
                    // Save notification record for the client
                    const savedNotification = await empNotificationModel.create({
                        title,
                        message,
                        date: new Date(),
                        empIds: client._id
                    });
                    
                    notifications.push(savedNotification);
                }
        
                // Respond with success message
                return res.status(200).json({
                    success: true,
                    message: 'Notification sent successfully to all clients',
                    
                });
        
            } catch (error) {
                // Handle server error
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            }
        };
        

        // APi for send Notification to all client nd particular client
             const send_notification = async( req , res)=>{
                   try {
                          const superAdmin_Id = req.params.superAdmin_Id
                        if(!superAdmin_Id)
                        {
                            return res.status(400).json({
                                 message : 'superAdmin Id requried'
                            })
                        }
                    
                 // check for superAdmin
                 const superAdmin = await Admin_and_staffsModel.findOne({
                       _id : superAdmin_Id,
                       role : 'Super Admin'
                 })

                 if(!superAdmin)
                 {
                    return res.status(400).json({
                          success : false ,
                          message : 'super admin not found'
                    })
                 }

            const super_adminChoice = req.body.super_adminChoice
             let notificationFunction 
             if(super_adminChoice === 1)
             {
                notificationFunction = send_notification_to_client
             }
             else if (super_adminChoice === 2)
             {
                notificationFunction = sendNotification_to_allClient
             }
             else
             {
                return res.status(400).json({
                     success : false ,
                     message : 'please select one Option'
                })
             }

             // call the selected notification function
             await notificationFunction( req ,res)

             // only send success response if the notification function didn't send a response

             if(!res.headersSent)
             {
                return res.status(200).json({
                     success : true ,
                     message : 'notification send'
                })
             }   
                   } catch (error) {
                     return res.status(500).json({
                           success : false ,
                           message : 'server Error',
                           error_message : error.message
                     })
                   }
             }
        
              

                                                      /* Staff Section */
    // Api for add staff 
            const addStaff = async( req , res)=>{
                try {
                      const adminId = req.params.adminId
                      const {name , email , password , phone_no ,role  } = req.body
                    
                    // check for adminId
                    if(!adminId){
                        return res.status(400).json({
                               success : false,
                               message : 'admin Id required'
                        })
                    }

                     // check for required fields
                     const requiredFields = [ "name", "email", "password" ,"phone_no", "role" ]; 

                     for (const field of requiredFields) {
                     if (!req.body[field]) {
                         return res
                         .status(400)
                         .json({
                             message: `Missing ${field.replace("_", " ")} `,
                             success: false,
                         });
                     }
                     }

                     // check if the staff member already exist

                     const existStaff_member = await Admin_and_staffsModel.findOne({ email : email })
                     if(existStaff_member)
                     {
                    return res.status(400).json({
                          success : false ,
                          message : ` other ${role} with the same email allready exist`
                    })
                     }

                      // bcrypt the password

                      const hashedPassword = await bcrypt.hash(password , 10)

                     let profileImage = ''
                      // Update profileImage if a new file is provided
                      if (req.file && req.file.filename) {
                        // Get the file extension
                        const fileExtension = path.extname(req.file.filename).toLowerCase();

                        // List of allowed extensions
                        const allowedExtensions = ['.jpg', '.jpeg', '.png'];

                        // Check if the file extension is in the allowed list
                        if (allowedExtensions.includes(fileExtension)) {
                            // If valid, update the profile image
                            profileImage = req.file.filename;
                        } else {
                            // If not valid, throw an error
                            return res.status(400).json({
                                success : false ,
                                message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                        });
                        }
                      }
                     const newstaff = new Admin_and_staffsModel({
                         
                          name,
                          email,
                          password : hashedPassword,
                          profileImage : profileImage,
                          phone_no,
                          role,
                          status : 1

                     }) 

                     await newstaff.save()
                     // Prepare email content for the staff
                const staffEmailContent = `
                <p>Congratulations! You have been added as a ${role} by Admin .</p>
                <p>Here are your account details:</p>
                <table style="border-collapse: collapse; width: 50%; margin: auto; border: 1px solid #4CAF50; border-radius: 10px;">
                <tr>
                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; font-weight: bold;"><strong>Email:</strong></td>
                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">${email}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; font-weight: bold;"><strong>Password:</strong></td>
                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">${password}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; font-weight: bold;"><strong>phone No:</strong></td>
                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">${phone_no}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; font-weight: bold;"><strong> ID :</strong></td>
                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">${newstaff._id}</td>
                </tr>
            </table>
            `;
            // Send email to the staff
            await sendstaffEmail (newstaff.email, `Congratulations! You are added as ${role}`, staffEmailContent);
               
                        
                     return res.status(200).json({
                          success : true ,
                          message : `new ${role} addedd successfully`,
                          Data : newstaff
                     })
                       
                } catch (error) {
                    return res.status(500).json({
                           success : false ,
                           message : 'server error',
                           error_message : error.message
                    })
                }
            }


            // Api for get all staffs members Details
      
             const getAll_Staffs = async( req ,res)=>{
                try {
                       // check for all Staffs 
                       const allStaffs = await Admin_and_staffsModel.find({
                           role : { $ne : "Super Admin"}
                       })
                       if(!allStaffs)
                       {
                        return res.status(400).json({
                              success : false ,
                              message : 'Staffs not found'
                        })
                       }

                       return res.status(200).json({
                         success : true ,
                         message : 'All Staffs',
                         allStaffs : allStaffs
                       })
                } catch (error) {
                    return res.status(500).json({
                          success : false ,
                          message :'server error',
                          error_message : error.message
                    })
                }
             }
             
     // Api for active inactive particular staff member

         const active_inactive_Hr = async( req ,res)=>{
               try {
                          const hr_id = req.params.hr_id
                    // check for hr_id
                    if(!hr_id)
                    {
                        return res.status(400).json({
                               success : false ,
                               message : 'Hr Id Required'
                        })
                    }

                    // check for HR Admin

                    const checkHR = await Admin_and_staffsModel.findOne({ _id : hr_id })
                    if(!checkHR)
                    {
                        return res.status(400).json({
                             success : false ,
                             message : 'HR Admin not found'
                        })
                    }

                     // Toggle HR Admin status
                     let newStatus = checkHR.status === 1 ? 0 : 1;
                                        
                     checkHR.status = newStatus                
                   
                               // Save the updated HR Admin status
                       await checkHR.save();

                       return res.status(200).json({
                           success: true,
                           message: `${newStatus ? 'activated' : 'inactivated'} successfully`
                       });    


               } catch (error) {
                return res.status(500).json({
                     success : false ,
                     message : 'server error',
                     error_message : error.message
                })
               }
         }
                                            /* staff section & portel  */

    // Get particular staff Details
                  const getStaff_Details = async ( req ,res)=>{
                         try {
                                const staff_id = req.params.staff_id
                          // check for staff_id
                          if(!staff_id)
                          {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'staff Id required'
                            })
                          }

                          // check for staff Details
                          const checkStaff = await Admin_and_staffsModel.findOne({
                                _id : staff_id
                          })

                          if(!checkStaff)
                          {
                            return res.status(400).json({
                                  success : false ,
                                  message : 'Details not found'
                            })
                          }

                          return res.status(200).json({
                             success : true ,
                             message : 'staff Details',
                             Details : checkStaff
                          })
                         } catch (error) {
                            return res.status(500).json({
                                 success : false ,
                                 message : 'server error',
                                 error_message : error.message
                            })
                         }
                  }

                    // Api for update staff Panel
            const updatestaff = async( req , res)=>{
                try {
                       const staff_id = req.params.staff_id
                   const { name , email , phone_no ,} = req.body
                   // check for staff_id 
                   if(!staff_id)
                   {
                       return res.status(400).json({
                            success : false,
                            message : 'staff_id required'
                       })
                   }
                      // check for existing staff

                      const exist_staff = await Admin_and_staffsModel.findOne({ _id : staff_id })
                      if(!exist_staff)
                      {
                       return res.status(400).json({
                            success : false ,
                            message : 'staff not found'
                       })
                      }

                         // update profile Image of the staff
                       let profileImage 
                        // Update profileImage if a new file is provided
                        if (req.file && req.file.filename) {
                            // Get the file extension
                            const fileExtension = path.extname(req.file.filename).toLowerCase();

                            // List of allowed extensions
                            const allowedExtensions = ['.jpg', '.jpeg', '.png'];

                            // Check if the file extension is in the allowed list
                            if (allowedExtensions.includes(fileExtension)) {
                                // If valid, update the profile image
                                profileImage = req.file.filename;
                            } else {
                                // If not valid, throw an error
                                return res.status(400).json({
                                    success : false ,
                                    message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                            });
                            }
                          }

                       exist_staff.name = name
                       exist_staff.email = email
                       exist_staff.phone_no = phone_no

                       if(profileImage)
                       {
                        exist_staff.profileImage = profileImage
                       }
                       await exist_staff.save()

                       return res.status(200).json({
                             success : true ,
                             message : 'Details updated successfully '
                       })
                } catch (error) {
                   return res.status(500).json({
                         success : false ,
                         message : 'server error',
                         error_message : error.message
                   })
                }
           }


             // Api for changePassword
             const staff_ChangePassword = async( req ,res)=>{
                try {
                         const staff_id = req.params.staff_id
                      const { oldPassword , password , confirmPassword } = req.body
                         // check for staff_id

                         if(!staff_id)
                         {
                             return res.status(400).json({
                                    success : false,
                                    message : 'missing staff_id'
                             })
                         }
                      // check for required fields
                      const requiredFields = [ "oldPassword", "password", "confirmPassword"];

                     for (const field of requiredFields) {
                     if (!req.body[field]) {
                         return res
                         .status(400)
                         .json({
                             message: `Missing ${field.replace("_", " ")} `,
                             success: false,
                         });
                     }
                     }

                         // check for staff
                     const staff = await Admin_and_staffsModel.findOne({ _id : staff_id })
                       
                          if(!staff)
                          {
                             return res.status(400).json({
                                  success : false ,
                                  message : 'staff Details not found'
                             })
                          }
                                const email = staff.email
                     // check for confirm password 

                       if(password !== confirmPassword)
                       {
                         return res.status(400).json({
                              success : false ,
                              message : 'confirmPassword incorrect'
                         })
                       }
                         
                       //  check for old password is matched with storedPassword
                       const isOldPasswordValid = await bcrypt.compare(
                         oldPassword,
                         staff.password
                       );

                       if(!isOldPasswordValid)
                       {
                         return res.status(400).json({
                              success : false ,
                              message : 'old Password incorrect '
                         })
                       }

                        // encrypt the newPassword

                 const hashedNewPassword = await bcrypt.hash(password, 10);
                 // update the staff password with new encrypted password
                 staff.password = hashedNewPassword;
                      // Prepare email content for the staff
                const staffEmailContent = `
                <p>Congratulations! Your Password Has been Changed .</p>
                <p>Here are your account details:</p>
                <table style="border-collapse: collapse; width: 50%; margin: auto; border: 1px solid #4CAF50; border-radius: 10px;">
                <tr>
                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; font-weight: bold;"><strong>Email:</strong></td>
                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">${email}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; font-weight: bold;"><strong>Password:</strong></td>
                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">${password}</td>
                </tr>
               
            </table>
            `;
            // Send email to the staff
            await sendstaffEmail (staff.email, `Password Changed successfully ..!`, staffEmailContent);
               
                 await staff.save();
                 return res.status(200).json({
                     success: true,
                     message: "Password changed Successfully",
                    
                 });
                 
                } catch (error) {
                    return res.status(500).json({
                       success : false ,
                       message : 'server error',
                       error_message : error.message
                    })
                }
           } 

    // Api for requirement process
    const candidate_recruitment_process = async (req, res) => {
        try {
            const candidateId = req.params.candidateId;
            const { seeker_status , emailSubject, emailContent } = req.body;


                
                
                 
    
             // Check for candidateId
             if (!candidateId) {
                return res.status(400).json({
                    success: false,
                    message: 'Candidate ID required'
                });
            }
            
    
            // Validate seeker_status
            const validStatuses = [               
                'Shortlisted',
                'longlisted',
                'Assessment_Scheduled',
                'Schedule_Interview',
                'complete',
                'reject',
            ];
            
            if (!validStatuses.includes(seeker_status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid seeker status'
                });
            }
    
            // Check for candidate
            const candidate = await appliedjobModel.findOne({ _id: candidateId });
            if (!candidate) {
                return res.status(400).json({
                    success: false,
                    message: 'Candidate not found'
                });
            }
    
            // Check for jobId and job
            const jobId = candidate.jobId;
            const checkJob = await jobModel.findOne({ jobId: jobId });
            if (!checkJob) {
                return res.status(400).json({
                    success: false,
                    message: 'Job not found'
                });
            }

            // Access job details
            const empId = checkJob.emp_Id;
    
            let candidate_status;
            let cStatus;
            let emailSubjectText;
            let emailContentText;
    
            switch (seeker_status) {
                case 'Shortlisted':
                    candidate_status = 2 ;
                    cStatus = 2;
                    emailSubjectText =  emailSubject 
                    emailContentText = emailContent
                    emailRecipient = checkJob.hr_email 
                    break;

                case 'longlisted':
                    candidate_status = 3;
                    cStatus = 2;
                    emailSubjectText =  emailSubject
                    emailContentText = emailContent 
                    emailRecipient = checkJob.hiring_manager_email
                    break;

                case 'Assessment_Scheduled':
                candidate_status = 4
                cStatus = 2;
                emailSubjectText =  emailSubject 
                emailContentText = emailContent 
                emailRecipient = candidate.user_Email ;
                break;
    

                case 'Schedule_Interview':
                    candidate_status = 5;
                    cStatus = 2;
                    emailSubjectText = emailSubject 
                    emailContentText = emailContent 
                    emailRecipient = candidate.user_Email
                    break;  
    
                case 'complete':
                    candidate_status = 6;
                    cStatus = 3;
                    emailSubjectText = emailSubject
                    emailContentText = emailContent
                    emailRecipient = candidate.user_Email
                    break;   
    
                case 'reject':
                    candidate_status = 7;
                    cStatus = 0;
                    emailSubjectText = emailSubject
                    emailContentText = emailContent 
                    emailRecipient = candidate.user_Email
                    break;
    
                default:
                    return res.status(400).json({ success: false, message: "Invalid seeker status" });
            }
    
            // Send email
            const emailOptions = {
                to: emailRecipient ,
                subject: emailSubjectText,
                html: emailContentText
            };
    
            await send_candidateEmail(emailOptions);
    
            // Update candidate status
            candidate.jobSeeker_status = candidate_status;
            candidate.candidateStatus = cStatus;
            const updatedCandidate = await candidate.save();
    
            return res.status(200).json({
                success: true,
                message: 'Jobseeker status updated',
             
            });
        } catch (error) {
            console.error('Error in candidate_recruitment_process:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message
            });
        }
    };
    

     // APi for get all candidates
     const getAll_candidates = async (req, res) => {
        try {
            const { gender, job_Heading, company_name, relevant_experience, Total_experience , candidate_location , Highest_Education} = req.query;
            let filter = {};
            let filter1 = {};
    
            // Apply gender filter if provided
            if (gender) {
                filter.gender = gender;
            }
    
            // Apply other filters
            if (job_Heading) {
                filter1.job_Heading = job_Heading;
            }
            if (company_name) {
                filter1.company_name = company_name;
            }
            if (relevant_experience) {
                filter1.job_experience = relevant_experience;
            }
            if (Total_experience) {
                filter1.Total_experience = Total_experience;
            }
            if (candidate_location) {
                filter1.city = candidate_location;
            }
            if (Highest_Education) {
                filter1.Highest_Education = Highest_Education;
            }
    
            // Retrieve all candidates based on the filters
            const all_candidates = await appliedjobModel.find({ ...filter, ...filter1 });
    
            // Check if candidates were found
            if (!all_candidates || all_candidates.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No candidates details found'
                });
            }
    
            // Access each candidate's job ID
            const candidateJobIds = all_candidates.map(candidate => candidate.jobId);
    
            // Retrieve jobs related to the candidateJobIds
            const checkJobs = await jobModel.find({ jobId: { $in: candidateJobIds } });
    
            // Check if jobs were found
            if (!checkJobs || checkJobs.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No jobs found'
                });
            }
    
            // Create a map of job IDs to company names
            const jobCompanyMap = {};
            checkJobs.forEach(job => {
                jobCompanyMap[job.jobId.toString()] = job.company_name;
            });
    
            // Create response data with candidate details and company names
            const responseData = all_candidates.map(candidate => ({
                _id: candidate._id,
                first_Name: candidate.first_Name,
                last_Name: candidate.last_Name,
                candidate_email: candidate.user_Email,
                gender: candidate.gender,
                phone_no: candidate.phone_no,
                jobId: candidate.jobId,
                job_Heading: candidate.job_Heading,
                company_name: jobCompanyMap[candidate.jobId.toString()], 
                jobSeeker_status: candidate.jobSeeker_status,
                candidate_resume: candidate.uploadResume,
                relevant_experience: candidate.job_experience,
                Total_experience: candidate.Total_experience,
                Highest_Education : candidate.Highest_Education,
                candidateStatus : candidate.candidateStatus,
                HomeAddress : candidate.city + candidate.state,
                
            }));
                    // sort the response
                  const sortResponse = responseData.sort(( a , b ) => b.createdAt - a.createdAt)

            // Respond with the list of candidates details
            return res.status(200).json({
                success: true,
                message: 'Candidate Details',
                candidates: sortResponse
            })             
    
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message
            });
        }
    };
    

                                                            /* Employee Section */
        // Api for get All Employees
              const getAllEmp = async( req , res)=>{
                  try {
                         // check for all employee
                        const allEmp = await employeeModel.find({
                                 
                        })

                        if(!allEmp)
                        {
                            return res.status(400).json({
                                  success : false ,
                                  message : 'No employee Found'
                            })
                        }
                        const sortclient = allEmp.sort(( a , b )=> b.createdAt - a.createdAt)
                        return res.status(200).json({
                               success : true ,
                               message : 'All Employees',
                               Details : sortclient
                        })
                  } catch (error) {
                    return res.status(500).json({
                            success : false ,
                            message : 'server error',
                            error_message : error.message
                    })
                  }
              }

       // Active inactive particular employee

                 const active_inactive_emp = async ( req , res)=>{
                    try {
                           const empId = req.params.empId
                        // check for empId
                        if(!empId)
                        {
                            return res.status(400).json({
                                  success : false ,
                                  message : 'Employee ID Required'
                            })
                        }

                       // check for employee existance

                       const emp = await employeeModel.findOne({
                                _id : empId
                       })
                       if(!emp)
                       {
                        return res.status(400).json({
                             success : false ,
                             message : 'employee not exist'
                        })
                       }
                        // Toggle employee status
                        let newStatus = emp.status === 1 ? 0 : 1;
                            
                        emp.status = newStatus                
                
                                    // Save the updated emp status
                            await emp.save();
                             // Create and save a notification for the employee
                             try {
                                var newNotification = new empNotificationModel({
                                    empId : empId,
                                    message: `Your account ${newStatus ? 'activated' : 'inactivated'} By super admin`,
                                    date: new Date(),
                                    status: 1,                    
                                });
                            
                                await newNotification.save();
                            } catch (notificationError) {
                                // Handle notification creation error
                                console.error('Error creating notification:', notificationError);
                                // Optionally, you can choose to return an error response here or handle it in another way
                            }    
                            return res.status(200).json({
                                success: true,
                                message: `${newStatus ? 'activated' : 'inactivated'} successfully`
                            });                    
        
                    } catch (error) {
                        return res.status(500).json({
                             success : false ,
                             message : 'server error',
                             error_message : error.message
                        })
                    }
                 }
                                                
                                                         /*Job Section */
// Active inactive particular job
const active_inactive_job = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const newStatus = req.body.newStatus; 
        
        // Check for jobId
        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: 'jobId Required'
            });
        }

        // Check for Job existence
        const job = await jobModel.findOne({ jobId: jobId });

        if (!job) {
            return res.status(400).json({
                success: false,
                message: 'Job not exist'
            });
        }

        // Access emp id from the job
        const emp_Id = job.emp_Id;

        // Check for the employer's details
        
        const employer = await employeeModel.findOne({ _id: emp_Id });

        // Validate new status
        if (![0, 1, 2, 3].includes(newStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        let statusMessage = '';
        switch (newStatus) {
            case 1:
                statusMessage = 'active';
                break;
            case 2:
                statusMessage = 'Job requirement fulfilled';
                break;
            case 3:
                statusMessage = 'Inactive';
                break;
            default:
                statusMessage = 'Unknown Status';
        }

        // Create email content
        const emailContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 20px;">
            <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); max-width: 600px; margin: auto; border: 1px solid #dddddd;">
                <div style="font-size: 20px; font-weight: bold; color: #333333; margin-bottom: 20px; text-align: center;">
                    Update on Your Job Posting Status
                </div>
                <div style="font-size: 16px; line-height: 1.6; color: #555555;">
                    <p>Dear ${employer.name},</p>
                    <p>We hope this message finds you well. We are writing to inform you that the status of your job posting has been updated.</p>
                    <p><strong>Job Title:</strong> ${job.job_title}</p>
                    <p><strong>Current Status:</strong> ${statusMessage}</p>
                    <p>If you have any questions or need assistance, please contact our admin at <a href="mailto:info@smartstart.sl" style="color: #007BFF;">Smart Start</a>.</p>
                </div>
                <div style="font-size: 14px; color: #999999; margin-top: 20px; text-align: center;">
                    <p>Thank you for choosing <strong>Smart Start</strong>. We value your partnership and are here to support you.</p>
                    <p>Smart Start</p>
                    <p>+23272065065, +23288353535</p>
                    <p>Head Office: 1 Jangah Close, Main Peninsular Road, Baw Baw</p>
                </div>
            </div>
        </body>
        </html>`;

        // Send email (Assuming a sendEmail function exists)
        await job_status_Email(employer.email, 'Update on Your Job Posting Status', emailContent);

        // Update job status
        job.status = newStatus;

        // Save the updated job status
        await job.save();

        return res.status(200).json({
            success: true,
            message: `${statusMessage}`,
            status: newStatus
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};




        // APi for get all female Candidate Resume
                            const getAllFemale_Candidate = async ( req , res)=>{
                                try {
                                       const { jobSeeker_status } = req.query
                                       const filter = {}

                                    if(jobSeeker_status)
                                    {
                                        filter.jobSeeker_status = jobSeeker_status;
                                    }
                                    // check for all Female candidates
                                    const allFemale_Candidate = await appliedjobModel.find({
                                            gender : "Female",
                                            ...filter
                                    })
                                    if(!allFemale_Candidate)
                                    {
                                        return res.status(400).json({
                                            success : false,
                                            message : 'No Female Candidates profile Found'
                                        })
                                    }
                                    const sortedallFemale_Candidate = allFemale_Candidate.sort(( a , b) => b.createdAt - a.createdAt )
                                    return res.status(200).json({
                                        success : true ,
                                        message : 'Female candidate Profile',
                                        allFemale_CandidateCount : sortedallFemale_Candidate.length,
                                        Details: sortedallFemale_Candidate.map((candidate) => ({
                                        _id : candidate._id,
                                        first_Name: candidate.first_Name,
                                        last_Name: candidate.last_Name,
                                        user_Email: candidate.user_Email,
                                        city: candidate.city,
                                        state: candidate.state,
                                        phone_no: candidate.phone_no,
                                        gender: candidate.gender,
                                        resume: candidate.uploadResume,
                                        Highest_Education: candidate.Highest_Education,
                                        relevant_Experience: candidate.job_experience, 
                                        Total_experience: candidate.Total_experience,
                                        jobId : candidate.jobId,
                                        candidateStatus : candidate.candidateStatus,
                                        saved_status : candidate.saved_status,
                                       candidate_rating : candidate.candidate_rating

                                    }))
                                });
                                } catch (error) {
                                    return res.status(500).json({
                                            success : false ,
                                            message : 'server error',
                                            error_message : error.message
                                    })
                                }
                            }

                                                   /* Privacy & Policy Section */

                                                   
                                                     
            const create_privacy_policy = async( req , res)=>{
                try {
                           const adminId = req.params.adminId
                           const { Heading , Description} = req.body
                     // check for empId
                     if(!adminId)
                     {
                         return res.status(400).json({
                               success : false ,
                               message : 'AdminId required'
                         })
                     }
                         // check for Admin
                     const adminExist = await Admin_and_staffsModel.findOne({
                            _id : adminId
                     })
                     if(!adminExist)
                     {
                         return res.status(400).json({
                                success : false ,
                                message : 'Admin Details not exist'
                         })
                     }                   

                     // check for privacy policy existance

                     const exist_privacy_policy = await privacy_policyModel.findOne({
                              AdminId : adminId,                               
                     })

                     if(exist_privacy_policy)
                     {
                                  exist_privacy_policy.Heading = Heading
                                  exist_privacy_policy.Description = Description

                                  await exist_privacy_policy.save()

                                  return res.status(200).json({
                                       success : true ,
                                       message : 'privacy policy updated successfully'
                                  })
                     }
                     else
                     {
                            // check for required fields

                            if(!Heading)
                            {
                             return res.status(400).json({
                                  success : false ,
                                  message : 'Heading Required'
                             })
                            }

                            if(!Description)
                            {
                             return res.status(400).json({
                                  success : false ,
                                  message : 'Description Required'
                             })
                            }

                            // create new Data

                            const newData = new privacy_policyModel({
                                    AdminId : adminId,
                                    Heading : Heading,
                                    Description : Description,                                    
                            })

                              await newData.save()

                              return res.status(200).json({
                                     success : true ,
                                     message : 'Privacy policy created successfully'
                              })
                     }                     

                      
                } catch (error) {
                   return res.json({
                            success : false ,
                            message : 'server error',
                            error_message : error.message
                   })
                }
         }

         // Api for get particular Client privacy & policy
                const get_admin_privacy_policy = async( req ,res)=>{
                    try {
                       
                         const adminId = req.params.adminId
                     // check for adminId
                 if(!adminId)
                 {
                     return res.status(400).json({
                          success : false ,
                          message : 'adminId Required'
                     })
                 }

                    // check Admin privacy policy
                 const Admin_privacy_policy = await privacy_policyModel.findOne({
                          AdminId : adminId
                 })
                     if(!Admin_privacy_policy)
                    {
                             return res.status(400).json({
                                  success : false ,
                                  message : 'no privacy policy found '
                             })
                     }
                    return res.status(200).json({
                          success : true ,
                          message : 'Admin Privacy & Policy',
                          Details : {
                               _id : Admin_privacy_policy._id,    
                               admin_id : Admin_privacy_policy.AdminId,
                               Heading : Admin_privacy_policy.Heading,
                              Description : Admin_privacy_policy.Description
                          }
                    })

                    } catch (error) {
                        return res.status(500).json({
                            success : false ,
                            message : 'server error',
                            error_message : error.message
                        })
                    }
                }


            

                                                         /* Term & Conditions Section */

                    // Api for create and update term and condition details

                  
                    const create_term_condition = async( req ,res)=>{

                        try {
                                const adminId  = req.params.adminId
                                const { Heading , Description} = req.body
                                // check for empId
                            if(!adminId)
                            {
                                return res.status(400).json({
                                     success : false ,
                                     message : 'adminId required'
                                })
                            }
    
                               // check for Admin Details
                               const checkAdmin = await Admin_and_staffsModel.findOne({ _id : adminId })
    
                               if(!checkAdmin)
                               {
                                return res.status(400).json({
                                     success : false ,
                                     message : 'admin Details not found'
                                })
                               }    
                                 
                        
                            // check for already exist term _ condition 
                        
                               const exist_t_c = await term_condition.findOne({
                                        AdminId : adminId
                               })
                                  if(exist_t_c)
                                  {
                                        exist_t_c.Heading = Heading
                                        exist_t_c.Description = Description
    
                                          await exist_t_c.save()
                                         return res.status(200).json({
                                             success : true,
                                             message : 'term & condition updated successfully'
                                      })
                                  }
                                  else
                                  {
                                         // check for required fields
    
                                      if(!Heading)
                                      {
                                        return res.status(400).json({
                                             success : false ,
                                             message : 'Heading Required'
                                        })
                                      }
    
                                      if(!Description)
                                      {
                                        return res.status(400).json({
                                              success : false ,
                                              message : 'Description Required'
                                        })
                                      }
    
                                          // create new Data
    
                                          const newData = new term_condition({
                                                 AdminId : adminId,
                                                 Heading : Heading,
                                                 Description : Description,
                                                
                                          })
                                               await newData.save()
    
                                                return res.status(200).json({
                                                     success : true ,
                                                     message : 'term & condition created successfully'
                                                })
                                  }                                
    
                                
                        } catch (error) {
                            return res.status(500).json({
                                   success : false ,
                                   message : 'server error',
                                   error_message : error.message
                            })
                        }
                }
         // Api for get All client Term & Condition
                const get_admin_term_condition = async( req , res)=>{
    
                    try {
                               const adminId = req.params.adminId
                          // check for adminId
                          if(!adminId)
                          {
                              return res.status(400).json({
                                       success : false ,
                                       message : 'adminId required'
                              })
                          }
                          // check for client term & condition
                      const emp_t_c = await term_condition.findOne({
                                    AdminId : adminId
                      })
                          if(!emp_t_c)
                          {
                              return res.status(400).json({
                                   success : false ,
                                   message : 'Term & conditions not found'
                              })
                          }
                
                          return res.status(200).json({
                                success : true,
                                message : 'term & Conditions',
                                Details : {
                                       _id : emp_t_c._id,
                                        Admin_id : emp_t_c.AdminId,
                                       Heading :  emp_t_c.Heading,
                                        Description : emp_t_c.Description
                                }
                          })
                    } catch (error) {
                         return res.status(500).json({
                                    success : false ,
                                    message : 'server error',
                                    error_message : error.message
                         })
                    }
                }
                           
                
          
                                                            /*  Service Page */
        
           // Api for create Services
           
           const create_services = async (req, res) => {
            try {
                const adminId = req.params.adminId;
                const { Heading, Description , Description1  } = req.body;
        
                // Check if adminId is provided
                if (!adminId) {
                    return res.status(400).json({
                        success: false,
                        message: 'adminId required'
                    });
                }
        
                // Check if admin exists and is a super admin
                const checkAdmin = await Admin_and_staffsModel.findOne({
                    _id: adminId,
                    role: 'Super Admin'
                });
                if (!checkAdmin) {
                    return res.status(400).json({
                        success: false,
                        message: 'Admin not found or not authorized'
                    });
                }
        
                // Check if service already exists for adminId
                let existingService = await services.findOne({ AdminId : adminId });
        
                // If service exists, update it; otherwise, create a new service
                if (existingService) {
                    existingService.Heading = Heading;
                    existingService.Description = Description;
                    existingService.Description1 = Description1;
                    
              
                    if (req.file) {
                        existingService.image = req.file.filename;
                    }
                    existingService.save();
        
                    return res.status(200).json({
                        success: true,
                        message: 'Service updated successfully'
                    });
                } else {
                       // check for required fields
                       if(!Heading)
                       {
                           return res.status(400).json({
                                   success : false ,
                                   message : 'Heading Required'
                           })
                       }

                          if(!Description)
                          {
                            return res.status(400).json({
                                   success : false ,
                                   message : 'Description Required'
                            })
                          }        
                         
                    let image = null;
                    // Update profileImage if a new file is provided
                    if (req.file && req.file.filename) {
                        // Get the file extension
                        const fileExtension = path.extname(req.file.filename).toLowerCase();

                        // List of allowed extensions
                        const allowedExtensions = ['.jpg', '.jpeg', '.png'];

                        // Check if the file extension is in the allowed list
                        if (allowedExtensions.includes(fileExtension)) {
                            // If valid, update the profile image
                            image = req.file.filename;
                        } else {
                            // If not valid, throw an error
                            return res.status(400).json({
                                success : false ,
                                message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                        });
                        }
                      }
        
                    // Create new service
                    const newService = new services({
                        Heading : Heading,
                        Description : Description,                     
                        Description1 : Description1,                     
                    
                        AdminId : adminId ,
                        image
                    });
        
                    await newService.save();
        
                    return res.status(200).json({
                        success: true,
                        message: 'New service created successfully'
                    });
                }
            } catch (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: 'Server error'
                });
            }
        };
        

           // APi for get services details
               const getService = async ( req , res)=>{
                   try {
                          const adminId = req.params.adminId
                        // check for admin Id
                        if(!adminId)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'adminId required'
                            })
                        }
                        // check for admin services

                        const checkService = await services.findOne({
                                 AdminId : adminId
                        })

                           if(!checkService)
                           {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'no services Found'
                            })
                           }

                           return res.status(200).json({
                             success : true ,
                             message : 'services',
                             Details : {
                                   _id : checkService._id,
                                   AdminId : checkService.AdminId,
                                   Heading :  checkService.Heading,
                                   Description : checkService.Description,                                 
                                   Description1 : checkService.Description1,                                 
                                   image : checkService.image
                             }
                           })
                   } catch (error) {
                    return res.status(500).json({
                            success : false ,
                            message : 'server error',
                            error_message : error.message
                    })
                   }
               }
                                        
                                                 /* CMS Page */
            /* Testimonial Section */
        
        // Api for create Testimonial Page
        const create_testimonial = async (req, res) => {
            try {
                const { username, title, Description } = req.body;
        
                // check for required fields
                if (!username) {
                    return res.status(400).json({
                        success: false,
                        message: 'username required'
                    });
                }
        
                if (!title) { // Corrected condition to check for the existence of the title field
                    return res.status(400).json({
                        success: false,
                        message: 'title required'
                    });
                }
        
                if (!Description) {
                    return res.status(400).json({
                        success: false,
                        message: 'Description required'
                    });
                }
        
                let user_image = null;
                  // Update profileImage if a new file is provided
                  if (req.file && req.file.filename) {
                    // Get the file extension
                    const fileExtension = path.extname(req.file.filename).toLowerCase();

                    // List of allowed extensions
                    const allowedExtensions = ['.jpg', '.jpeg', '.png'];

                    // Check if the file extension is in the allowed list
                    if (allowedExtensions.includes(fileExtension)) {
                        // If valid, update the profile image
                        user_image = req.file.filename;
                    } else {
                        // If not valid, throw an error
                        return res.status(400).json({
                            success : false ,
                            message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                    });
                    }
                  }
        
                // Create new Data
                const newData = new cms_testimonialModel({
                    username : username,
                    title : title,
                    Description : Description,
                    user_image : user_image
                });
        
                // Save the new testimonial to the database
                await newData.save();
        
                return res.status(200).json({
                    success: true,
                    message: 'Testimonial created successfully',
                });
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Server Error',
                    error_message: error.message
                });
            }
        };
        
        // Api for get All testimonial 
            const getAll_testimonial = async( req ,res)=>{
                   try {
                           // check for all testimonial 
                        const all_testimonial = await cms_testimonialModel.find({
                              
                        })
                        if(!all_testimonial)
                        {
                            return res.status(400).json({
                                  success : false ,
                                  message : 'no testimonial Details found'
                            })
                        }
                        const sortedall_testimonial = all_testimonial.sort(( a , b ) => b.createdAt - a.createdAt )
                        return res.status(200).json({
                               success : true ,
                               message : 'all testimonial',
                               Details : sortedall_testimonial
                        })
                    
                   } catch (error) {
                    return res.status(500).json({
                          success : false,
                          message : 'server error',
                          error_message : error.message
                    })
                   }
            }

            // get particular testimonial Detail
              
               const get_testimonial = async( req , res)=>{
                       try {
                             const testimonial_id = req.params.testimonial_id
                        // check for testimonial_id
                        if(!testimonial_id)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'testimonial Id required'
                            })
                        }

                        // check for testimonial Detail
                         const t_detail = await cms_testimonialModel.findOne({
                                _id : testimonial_id
                         })

                           if(!t_detail)
                           {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'no Details found'
                            })
                           }
                            return res.status(200).json({
                                 success : true ,
                                 message : 'testimonial Detail',
                                 Details : t_detail
                            })
                        
                       } catch (error) {
                           return res.status(500).json({
                                  success : false ,
                                  message : 'server error',
                                  error_message : error.message
                           })
                       }
               }
        // Api for update  testimonial Details
        const update_testimonial = async (req, res) => {
            try {
                const testimonial_id = req.params.testimonial_id;
                const { username, title, Description } = req.body;
        
                // Check for required fields
                if (!testimonial_id) {
                    return res.status(400).json({
                        success: false,
                        message: 'testimonial_id required'
                    });
                }
        
                // Check for testimonial 
                const exist_testimonial = await cms_testimonialModel.findById(testimonial_id);
        
                if (!exist_testimonial) {
                    return res.status(400).json({
                        success: false,
                        message: 'No testimonial found'
                    });
                }
        
                // Update testimonial fields
                exist_testimonial.username = username;
                exist_testimonial.title = title;
                exist_testimonial.Description = Description;
        
                 // Update profileImage if a new file is provided
                 if (req.file && req.file.filename) {
                    // Get the file extension
                    const fileExtension = path.extname(req.file.filename).toLowerCase();

                    // List of allowed extensions
                    const allowedExtensions = ['.jpg', '.jpeg', '.png'];

                    // Check if the file extension is in the allowed list
                    if (allowedExtensions.includes(fileExtension)) {
                        // If valid, update the profile image
                        exist_testimonial.user_image = req.file.filename;
                    } else {
                        // If not valid, throw an error
                        return res.status(400).json({
                            success : false ,
                            message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                    });
                    }
                  }
        
                // Save the updated testimonial
                await exist_testimonial.save();
        
                return res.status(200).json({
                    success: true,
                    message: 'Testimonial updated successfully'
                });
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            }
        };
        
    // Api for delete testimonial 
          const delete_testimonial = async ( req , res)=>{
                   try {
                        const testimonial_id = req.params.testimonial_id
                    // check for ID
                    if(!testimonial_id)
                    {
                        return res.status(400).json({
                               success : false ,
                               message : 'testimonial Id required'
                        })
                    }

                    // check for testimonial details
                        const check_t = await cms_testimonialModel.findOne({
                             _id : testimonial_id
                        })
                        if(!check_t)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'no testimonial Detail found'
                            })
                        }
                           await check_t.deleteOne()

                           return res.status(200).json({
                               success : true ,
                               message : 'testimonial Delete successfully'
                           })
                   } catch (error) {
                    return res.status(500).json({
                         success : false ,
                         message : 'server error',
                         error_message : error.message
                    })
                   }
          }

            /* job posting procedure section */


        
         // Api for cms_job_posting_section_1

         const cms_job_posting_section1 = async (req, res) => {
            try {
                const adminId = req.params.adminId;
                const { Heading, Description } = req.body;
        
                // Check for adminId
                if (!adminId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Admin Id required'
                    });
                }
        
                // Check for existing section
                let exist_section1 = await cms_job_posting_sectionModel.findOne({ AdminId: adminId });
        
                if (exist_section1) {
                    // Update existing section
                    exist_section1.Heading = Heading;
                    exist_section1.Description = Description;
                    await exist_section1.save();
                    return res.status(200).json({
                        success: true,
                        message: 'cms_job_posting_section1 updated'
                    });
                } else {
                    // Check for required fields
                    if (!Heading) {
                        return res.status(400).json({
                            success: false,
                            message: 'Heading Required'
                        });
                    }
        
                    if (!Description) {
                        return res.status(400).json({
                            success: false,
                            message: 'Description Required'
                        });
                    }
        
                    // Create new Data 
                    const newData = new cms_job_posting_sectionModel({
                        AdminId: adminId,
                        Heading: Heading,
                        Description: Description
                    });
        
                    await newData.save();
                    return res.status(200).json({
                        success: true,
                        message: 'New cms_job_posting_section1 created'
                    });
                }
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            }
        };
                                   
            
          // Api for get job_postuing _procesudre 1

          const getJobs_posted_procedure_section1 = async( req ,res)=>{
                   try {
                            const adminId = req.params.adminId
                        // check for adminId
                        if(!adminId)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'admin Id required'
                            })
                        }

                        // check for details
                    const gjpps1 = await cms_job_posting_sectionModel.findOne({
                              AdminId : adminId
                    })
                    if(!gjpps1)
                    {
                        return res.status(400).json({
                             success : false ,
                             message : 'no Details found'
                        })
                    }
                      return res.status(200).json({
                         success : true ,
                         message : 'Details',
                         Details : gjpps1
                      })
                   } catch (error) {
                    return res.status(500).json({
                          success : false ,
                          message : 'server error',
                          error_message : error.message
                    })
                   }
          }



           /* job posting procedure section 2 ---- need any job ?? */

           const cms_need_any_job_section = async (req, res) => {
            try {
                const adminId = req.params.adminId;
                const { Heading, Description } = req.body;
        
                // Check for adminId
                if (!adminId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Admin Id required'
                    });
                }
        
                // Check for existing section
                let exist_cms_need_any_job_section = await cms_need_any_job_section_Model.findOne({ AdminId: adminId });
        
                if (exist_cms_need_any_job_section) {
                    // Update existing section
                    exist_cms_need_any_job_section.Heading = Heading;
                    exist_cms_need_any_job_section.Description = Description;
        
                    if (req.file) {
                        exist_cms_need_any_job_section.logo = req.file.filename;
                    }
        
                    await exist_cms_need_any_job_section.save();
        
                    return res.status(200).json({
                        success: true,
                        message: 'Details updated successfully'
                    });
                } else {
                    // Check for required fields
                    if (!Heading) {
                        return res.status(400).json({
                            success: false,
                            message: 'Heading Required'
                        });
                    }
        
                    if (!Description) {
                        return res.status(400).json({
                            success: false,
                            message: 'Description Required'
                        });
                    }
        
                    // Check for logo
                    let logo = null;
                    // Update profileImage if a new file is provided
                 if (req.file && req.file.filename) {
                    // Get the file extension
                    const fileExtension = path.extname(req.file.filename).toLowerCase();

                    // List of allowed extensions
                    const allowedExtensions = ['.jpg', '.jpeg', '.png'];

                    // Check if the file extension is in the allowed list
                    if (allowedExtensions.includes(fileExtension)) {
                        // If valid, update the profile image
                        logo = req.file.filename;
                    } else {
                        // If not valid, throw an error
                        return res.status(400).json({
                            success : false ,
                            message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                    });
                    }
                  }
        
        
                    // Create new Data
                    const newData = new cms_need_any_job_section_Model({
                        AdminId: adminId,
                        Heading: Heading,
                        Description: Description,
                        logo: logo
                    });
        
                    await newData.save();
        
                    return res.status(200).json({
                        success: true,
                        message: 'New Details created successfully'
                    });
                }
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            }
        };
         
        // APi for get cms_need_any_job_section
           const get_cms_need_any_job_section = async( req ,res)=>{
                    try {
                                const adminId = req.params.adminId
                                // check for adminId
                        if(!adminId)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'adminId Required'
                            })
                        }

                        // check for details
                        const checkDetails = await cms_need_any_job_section_Model.findOne({
                             AdminId : adminId
                        })

                        if(!checkDetails)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'Details not found'
                            })
                        }

                        return res.status(200).json({
                             success : false ,
                             message : 'Details',
                             Details : checkDetails
                        })
                    } catch (error) {
                        return res.status(500).json({
                              success : false ,
                              message : 'server error',
                              error_message : error.message
                        })
                    }
           }
        
              /* job posting procedure section  ----post your job ?? */

              const cms_post_your_job_section = async (req, res) => {
                try {
                    const adminId = req.params.adminId;
            
                    // Check for adminId
                    if (!adminId) {
                        return res.status(400).json({
                            success: false,
                            message: 'Admin Id required'
                        });
                    }
            
                    const { Heading, Description } = req.body;
            
                    // Check for exist cms_post
                    const exist_post_job = await cms_postjobModel.findOne({ AdminId: adminId });
            
                    if (exist_post_job) {
                        // Update existing section
                        exist_post_job.Heading = Heading;
                        exist_post_job.Description = Description;
            
                        if (req.file) {
                            exist_post_job.logo = req.file.filename;
                        }
            
                        await exist_post_job.save();
            
                        return res.status(200).json({
                            success: true,
                            message: 'Details updated successfully'
                        });
                    } else {
                        // Check for Heading
                        if (!Heading) {
                            return res.status(400).json({
                                success: false,
                                message: 'Heading is required'
                            });
                        }
            
                        // Check for Description
                        if (!Description) {
                            return res.status(400).json({
                                success: false,
                                message: 'Description is required'
                            });
                        }
            
                        // Add logo 
                    let logo = ''
                     // Update profileImage if a new file is provided
                 if (req.file && req.file.filename) {
                    // Get the file extension
                    const fileExtension = path.extname(req.file.filename).toLowerCase();

                    // List of allowed extensions
                    const allowedExtensions = ['.jpg', '.jpeg', '.png'];

                    // Check if the file extension is in the allowed list
                    if (allowedExtensions.includes(fileExtension)) {
                        // If valid, update the profile image
                        logo = req.file.filename;
                    } else {
                        // If not valid, throw an error
                        return res.status(400).json({
                            success : false ,
                            message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                    });
                    }
                  }
            
                        // Add new Data
                        const newData = new cms_postjobModel({
                            AdminId: adminId,
                            logo: logo,
                            Heading: Heading,
                            Description: Description
                        });
            
                        await newData.save();
            
                        return res.status(200).json({
                            success: true,
                            message: 'New Details created successfully'
                        });
                    }
                } catch (error) {
                    return res.status(500).json({
                        success: false,
                        message: 'Server error',
                        error_message: error.message
                    });
                }
            };

    // Api for get cms_post_your_job Details
               const get_cms_post_your_job = async (req , res) => {
                   try {
                            const adminId = req.params.adminId

                            // check for adminId
                    if(!adminId)
                    {
                        return res.status(400).json({
                               success : false , message : 'adminId required'
                        })
                    }

                    // check for details
                    const getDetails = await cms_postjobModel.findOne({
                           AdminId : adminId
                    })

                    if(!getDetails)
                    {
                        return res.status(400).json({
                             success : false ,
                             message : 'Details not found'
                        })
                    }

                    return res.status(200).json({
                              success : true ,
                              message : 'Details',
                              Details : getDetails
                    })


                   } catch (error) {
                      return res.status(500).json({
                            success : false,
                            message : 'server Error',
                            error_message : error.message
                              
                      })
                   }
               }
                    
               
           /* job posting procedure section  ---- job market data ?? */

           const cms_job_market_data_section = async (req, res) => {
            try {
                const adminId = req.params.adminId;
        
                // Check for adminId
                if (!adminId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Admin Id required'
                    });
                }
        
                const { Heading, Description } = req.body;
        
                // Check for exist cms_post
                const exist_post_job = await cms_jobMarketData.findOne({ AdminId: adminId });
        
                if (exist_post_job) {
                    // Update existing section
                    exist_post_job.Heading = Heading;
                    exist_post_job.Description = Description;
                    // Update profileImage if a new file is provided
                    if (req.file && req.file.filename) {
                        // Get the file extension
                        const fileExtension = path.extname(req.file.filename).toLowerCase();

                        // List of allowed extensions
                        const allowedExtensions = ['.jpg', '.jpeg', '.png'];

                        // Check if the file extension is in the allowed list
                        if (allowedExtensions.includes(fileExtension)) {
                            // If valid, update the profile image
                            exist_post_job.logo = req.file.filename;
                        } else {
                            // If not valid, throw an error
                            return res.status(400).json({
                                success : false ,
                                message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                        });
                        }
                    }
        
                    await exist_post_job.save();
        
                    return res.status(200).json({
                        success: true,
                        message: 'Details updated successfully'
                    });
                } else {
                    // Check for Heading
                    if (!Heading) {
                        return res.status(400).json({
                            success: false,
                            message: 'Heading is required'
                        });
                    }
        
                    // Check for Description
                    if (!Description) {
                        return res.status(400).json({
                            success: false,
                            message: 'Description is required'
                        });
                    }
        
                    // Add logo 
                    let logo = ''

                 // Update profileImage if a new file is provided
                 if (req.file && req.file.filename) {
                    // Get the file extension
                    const fileExtension = path.extname(req.file.filename).toLowerCase();

                    // List of allowed extensions
                    const allowedExtensions = ['.jpg', '.jpeg', '.png'];

                    // Check if the file extension is in the allowed list
                    if (allowedExtensions.includes(fileExtension)) {
                        // If valid, update the profile image
                      logo = req.file.filename;
                    } else {
                        // If not valid, throw an error
                        return res.status(400).json({
                            success : false ,
                            message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                    });
                    }
                }
                         
        
                    // Add new Data
                    const newData = new cms_jobMarketData({
                        AdminId: adminId,
                        logo: logo,
                        Heading: Heading,
                        Description: Description
                    });
        
                    await newData.save();
        
                    return res.status(200).json({
                        success: true,
                        message: 'New Details created successfully'
                    });
                }
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            }
        };


         // Api for get job market data Details
         const get_cms_job_market_data = async (req , res) => {
            try {
                     const adminId = req.params.adminId

                     // check for adminId
             if(!adminId)
             {
                 return res.status(400).json({
                        success : false , message : 'adminId required'
                 })
             }

             // check for details
             const getDetails = await cms_jobMarketData.findOne({
                    AdminId : adminId
             })

             if(!getDetails)
             {
                 return res.status(400).json({
                      success : false ,
                      message : 'Details not found'
                 })
             }

             return res.status(200).json({
                       success : true ,
                       message : 'Details',
                       Details : getDetails
             })


            } catch (error) {
               return res.status(500).json({
                     success : false,
                     message : 'server Error',
                     error_message : error.message
                       
               })
            }
        }

           /* Cms Blog section */

        //    section1

    // Api for section1
                   const cms_blog_section1 = async( req , res)=>{
                           try {
                                  const adminId = req.params.adminId
                            const { Heading , Description } = req.body
                                // check for adminId
                            if(!adminId)
                            {
                                return res.status(400).json({
                                     success : false,
                                     message : 'admin ID required'
                                })
                            }

                            // check for exist blog
                        const existB = await cms_Blogsection1Model.findOne({
                                  AdminId : adminId
                        })
                           if(existB)
                           {
                                   existB.Heading = Heading
                                   existB.Description = Description

                                   existB.save()
                                   return res.status(200).json({
                                          success : true ,
                                          message :'Details Updated successfully'
                                   })
                           }
                              else
                              {
                                   // check for required filelds
                                if(!Heading)
                                {
                                    return res.status(400).json({
                                         success : false ,
                                         message : 'Heading required'
                                    })
                                }
                                 if(!Description)
                                 {
                                    return res.status(400).json({
                                          success : false,
                                          message : 'Description Required'
                                    })
                                 }

                                 // check for newData

                                 const newData = new cms_Blogsection1Model({
                                     AdminId : adminId,
                                     Heading : Heading,
                                     Description : Description
                                 })

                                   await newData.save()
                                   return res.status(200).json({
                                          success : true ,
                                          message : 'new Details created successfully'
                                   })
                              }
                           } catch (error) {
                            return res.status(500).json({
                                  success : false ,
                                  message : 'server error',
                                  error_message : error.message
                            })
                           }
                   }

            // Api for get Details 
                   const getcmsBlog_section1 = async(req ,res )=>{
                             try {
                                    // check for details
                                 const B1 = await cms_Blogsection1Model.find({
                                     
                                 })
                                 if(!B1)
                                 {
                                    return res.status(400).json({
                                           success : false,
                                           message : 'no Details found'
                                    })
                                 }
                                    return res.status(200).json({
                                           success : true ,
                                           message : 'Details',
                                           Details : B1
                                    })
                             } catch (error) {
                                  return res.status(500).json({
                                         success : false ,
                                         message : 'server error',
                                         error_message : error.message
                                  })
                             }
                   }

            //    section2

            // Api for cms Blog section2

            const cmsBlog_section2 = async( req ,res)=>{
                  try {
                         const { name , Heading , Description  } = req.body
                        
                        // check for required fields
                    if(!name)
                    {
                        return res.status(400).json({
                             success : false ,
                             message : 'name Required'
                        })
                    }
                    if(!Heading)
                    {
                        return res.status(400).json({
                             success : false ,
                             message : 'Heading Required'
                        })
                    }

                    if(!Description)
                    {
                        return res.status(400).json({
                             success : false ,
                             message : 'Description required'
                        })
                    }

                  // check for photo

                     let photo = null;
                     // Update profileImage if a new file is provided
                     if (req.file && req.file.filename) {
                        // Get the file extension
                        const fileExtension = path.extname(req.file.filename).toLowerCase();

                        // List of allowed extensions
                        const allowedExtensions = ['.jpg', '.jpeg', '.png'];

                        // Check if the file extension is in the allowed list
                        if (allowedExtensions.includes(fileExtension)) {
                            // If valid, update the profile image
                            photo = req.file.filename;
                        } else {
                            // If not valid, throw an error
                            return res.status(400).json({
                                success : false ,
                                message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                        });
                        }
                    }
                     // check for new record
                    const newData = new cmsBlogsection2Model({
                          name  : name ,
                          Heading : Heading,
                          Description : Description,
                          photo : photo,
                          comment : 12
                    })

                         newData.save()
                     return res.status(200).json({
                          success : true ,
                          message : 'new Blog created successfully'
                     })
                  } catch (error) {
                      return res.status(500).json({
                          success : false ,
                          message : 'server error',
                          error_message : error.message
                      })
                  }
            }

                // Api for get Blog Details
            
           const getBlogDetails = async( req , res)=>{
                  try {
                          const allBlogs = await cmsBlogsection2Model.find({
                                    
                          })
                          if(!allBlogs)
                          {
                            return res.status(400).json({
                                   success : false ,
                                   message : 'no Blogs Details found'
                            })
                          }

                            return res.status(200).json({
                                 success : true ,
                                 message : 'all Blogs Details',
                                 Blogs : allBlogs
                            })
                  } catch (error) {
                     return res.status(500).json({
                           success : false ,
                           message : 'server error',
                           error_message : error.message
                     })
                  }
           }

        // update particular Blog details
        const update_cms_blog = async (req, res) => {
            try {
                const blogId = req.params.blogId;
                const { Heading, Description, comment } = req.body;
        
                // Check for blogId
                if (!blogId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Blog Id required'
                    });
                }
        
                // Check for existing Blog
                const existB = await cmsBlogsection2Model.findOne({
                    _id: blogId
                });
        
                if (!existB) {
                    return res.status(400).json({
                        success: false,
                        message: 'No details found for the provided blog ID'
                    });
                }
        
                // Update the fields
                existB.Heading = Heading;
                existB.Description = Description;
                existB.comment = parseInt(comment);
                    // Update profileImage if a new file is provided
                    if (req.file && req.file.filename) {
                        // Get the file extension
                        const fileExtension = path.extname(req.file.filename).toLowerCase();

                        // List of allowed extensions
                        const allowedExtensions = ['.jpg', '.jpeg', '.png'];

                        // Check if the file extension is in the allowed list
                        if (allowedExtensions.includes(fileExtension)) {
                            // If valid, update the profile image
                            existB.photo = req.file.filename;
                        } else {
                            // If not valid, throw an error
                            return res.status(400).json({
                                success : false ,
                                message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                        });
                        }
                    }
        
                await existB.save();
        
                return res.status(200).json({
                    success: true,
                    message: 'Details updated successfully'
                });
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            }
        };
        
      // Api for delete particular cms Blog 
      const deleteBlog = async (req, res) => {
        try {
            const blogId = req.params.blogId;
    
            // Check for blogId
            if (!blogId) {
                return res.status(400).json({
                    success: false,
                    message: 'Blog Id required'
                });
            }
    
            // Check for blog
            const checkB = await cmsBlogsection2Model.findOne({
                _id: blogId
            });
    
            if (!checkB) {
                return res.status(400).json({
                    success: false,
                    message: 'No details found for the provided blog ID'
                });
            }
    
            await checkB.deleteOne();
    
            return res.status(200).json({
                success: true,
                message: 'CMS Blog Deleted successfully'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message
            });
        }
    };
    

                                                                    /* cms Headquarter section */

                                                                    
         // Api for cms Headquarter
         const cmsHeadquarter = async (req, res) => {
            try {
                const adminId = req.params.adminId;
                const { company_address, location } = req.body;
        
                // Check if adminId is provided
                if (!adminId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Admin Id required'
                    });
                }
        
                // Check if data already exists
                let existingData = await cmsHeadquarte_model.findOne({ AdminId: adminId });
        
                if (existingData) {
                    // Update existing data
                    existingData.company_address = company_address;
                    existingData.location = location;
                    await existingData.save();
        
                    return res.status(200).json({
                        success: true,
                        message: 'Details updated successfully'
                    });
                } else {
                    // Check if required fields are provided
                    if (!company_address) {
                        return res.status(400).json({
                            success: false,
                            message: 'Company address required'
                        });
                    }
        
                    if (!location) {
                        return res.status(400).json({
                            success: false,
                            message: 'Location required'
                        });
                    }
        
                    // Create new data
                    const newData = new cmsHeadquarte_model({
                        AdminId: adminId,
                        company_address,
                        location
                    });
        
                    await newData.save();
                    return res.status(200).json({
                        success: true,
                        message: 'New details created'
                    });
                }
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            }
        };
        
            
        
    // Api for get cms Headquarter details
        const getcms_headquarter = async( req , res)=>{
                     try {
                             const adminId = req.params.adminId
                        // check for adminId
                        if(!adminId)
                        {
                            return res.status(400).json({ 
                               success : false ,
                               message : 'adminId required'
                            })
                        }

                           // check for details

                           const checkDetails = await cmsHeadquarte_model.findOne({
                                  AdminId : adminId
                           })
                             if(!checkDetails)
                             {
                                return res.status(400).json({
                                      success : false ,
                                      message : 'Details not found'
                                })
                             }

                             return res.status(200).json({
                                 success : true ,
                                 message : 'Details',
                                 Details : checkDetails
                             })
                     } catch (error) {
                        return res.status(500).json({
                             success : false ,
                             message : 'server error',
                             error_message : error.message
                        })
                     }
        }
    

                               /* Admin notitification */
        // Api for get admin notification

        const getAdminNotification = async (req, res) => {
            try {
                // Check for admin notifications
                const adminNotifications = await adminNotificationModel.find ({ status: 1 });
         
                if (adminNotifications.length === 0) {
                    return res.status(200).json({
                        success: false,
                        message: 'No notifications received yet.'
                    });
                }
        
                return res.status(200).json({
                    success: true,
                    message: 'Admin notifications',
                    notifications: adminNotifications.map((notify) => ({
                        title : notify.title || null,
                        message: notify.message,
                        notification_status: notify.status,
                        notitication_id : notify._id
                    }))
                });
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            }
        };
        


          // Api for get unseen notification

        const unseen_admin_notification_count = async ( req , res) => {
               try {
                        // check for unseen notification of the admin

                        const unseenNotification = await adminNotificationModel.find({
                             status : 1
                        })

                        if(!unseenNotification)
                        {
                            return res.status(400).json({
                                  success : false ,
                                  message : 'no notification found'
                            })
                        }

                        return res.status(200).json({
                               success : true,
                               message : 'unseen notification',
                               unseenNotificationCount : unseenNotification.length
                        })
               } catch (error) {
                return res.status(500).json({
                     success : false ,
                     message : 'server error',
                     error_message : error.message
                })
               }
        }


           // Api for seen notification
           const seen_notification = async (req, res) => {
            try {
                const notification_id = req.params.notification_id;
        
                // Check if notification ID is provided
                if (!notification_id) {
                    return res.status(400).json({
                        success: false,
                        message: 'Notification ID is required'
                    });
                }
        
                // Find the notification by ID
                const notification = await adminNotificationModel.findById(notification_id);
        
                // Check if notification exists
                if (!notification) {
                    return res.status(404).json({
                        success: false,
                        message: 'Notification not found'
                    });
                }
        
                // Check if notification has already been seen
                if (notification.status === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Notification has already been seen'
                    });
                }
        
                // Update notification status to 'seen'
                notification.status = 0;
                await notification.save();
        
                return res.status(200).json({
                    success: true,
                    message: 'Notification marked as seen successfully'
                });
        
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error: error.message
                });
            }
        };

    // Api for cms_hr_consultancy
            
           const cms_Hr_consultancy = async (req, res) => {
            try {       
                
                const { Heading, Description ,Description1} = req.body;
        
                // Check for exist hr consultancy
                const exist_hr_consultancy = await cms_hr_consultancy_Model.findOne({ });
        
                if (exist_hr_consultancy) {
                    // Update existing section
                    exist_hr_consultancy.Heading = Heading;
                    exist_hr_consultancy.Description = Description;               
                    exist_hr_consultancy.Description1 = Description1;               

                   


                    if (req.file && req.file.filename) {
                        // Get the file extension
                        const fileExtension = path.extname(req.file.filename).toLowerCase();

                        // List of allowed extensions
                        const allowedExtensions = ['.jpg', '.jpeg', '.png'];

                        // Check if the file extension is in the allowed list
                        if (allowedExtensions.includes(fileExtension)) {
                            // If valid, update the profile image
                            exist_hr_consultancy.image = req.file.filename;
                        } else {
                            // If not valid, throw an error
                            return res.status(400).json({
                                success : false ,
                                message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                        });
                        }
                    }

                   
        
                    await exist_hr_consultancy.save();
        
                    return res.status(200).json({
                        success: true,
                        message: 'Details updated successfully'
                    });
                } else {
                    // Check for Heading
                    if (!Heading) {
                        return res.status(400).json({
                            success: false,
                            message: 'Heading is required'
                        });
                    }
        
                    // Check for Description
                    if (!Description) {
                        return res.status(400).json({
                            success: false,
                            message: 'Description is required'
                        });
                    }

                    // Check for Description1
                    if (!Description1) {
                        return res.status(400).json({
                            success: false,
                            message: 'Description1 is required'
                        });
                    }
                   
                   
                    // Add image 
                    let  image = null
                    if (req.file && req.file.filename) {
                        // Get the file extension
                        const fileExtension = path.extname(req.file.filename).toLowerCase();

                        // List of allowed extensions
                        const allowedExtensions = ['.jpg', '.jpeg', '.png'];

                        // Check if the file extension is in the allowed list
                        if (allowedExtensions.includes(fileExtension)) {
                            // If valid, update the profile image
                          image = req.file.filename;
                        } else {
                            // If not valid, throw an error
                            return res.status(400).json({
                                success : false ,
                                message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                        });
                        }
                    }
                         
        
                    // Add new Data
                    const newData = new cms_hr_consultancy_Model({
                       
                        image: image ,
                        Heading: Heading,
                        Description: Description,
                        Description1 : Description1
                       
                    });
        
                    await newData.save();
        
                    return res.status(200).json({
                        success: true,
                        message: 'New Details created successfully'
                    });
                }
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            }
        };


        // Api for get cms hr consultancy details
        const getHr_consultancy_Details = async( req , res)=>{
            try {
                    const allDetails = await cms_hr_consultancy_Model.find({
                              
                    })
                    if(!allDetails)
                    {
                      return res.status(400).json({
                             success : false ,
                             message : 'no Details found'
                      })
                    }

                      return res.status(200).json({
                           success : true ,
                           message : 'allDetails ',
                           Details : allDetails
                      })
            } catch (error) {
               return res.status(500).json({
                     success : false ,
                     message : 'server error',
                     error_message : error.message
               })
            }
     }

        // Api for training and development

            
        const cms_training_developement = async (req, res) => {
            try {             
                        const { Heading, Description , Description1 } = req.body;
        
                // Check for exist hr consultancy
                const exist_t_d = await cms_t_d_Model.findOne({ });
        
                if (exist_t_d) {
                    // Update existing section
                    exist_t_d.Heading = Heading;
                    exist_t_d.Description = Description;                    
                    exist_t_d.Description1 = Description1;                    

                    if (req.file) {
                        exist_t_d.image = req.file.filename;
                    }        
                    await exist_t_d.save();
        
                    return res.status(200).json({
                        success: true,
                        message: 'Details updated successfully'
                    });
                } else {
                    // Check for Heading
                    if (!Heading) {
                        return res.status(400).json({
                            success: false,
                            message: 'Heading is required'
                        });
                    }
                            // Check for Description
                    if (!Description) {
                        return res.status(400).json({
                            success: false,
                            message: 'Description is required'
                        });
                    }

                    // Check for Description1
                    if (!Description1) {
                        return res.status(400).json({
                            success: false,
                            message: 'Description1 is required'
                        });
                    }
                                     // Add image 
                    const image =  null;
                    if (req.file && req.file.filename) {
                        // Get the file extension
                        const fileExtension = path.extname(req.file.filename).toLowerCase();

                        // List of allowed extensions
                        const allowedExtensions = ['.jpg', '.jpeg', '.png'];

                        // Check if the file extension is in the allowed list
                        if (allowedExtensions.includes(fileExtension)) {
                            // If valid, update the profile image
                            image = req.file.filename;
                        } else {
                            // If not valid, throw an error
                            return res.status(400).json({
                                success : false ,
                                message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                        });
                        }
                    }
                            // Add new Data
                    const newData = new cms_t_d_Model ({
                       
                        image: image ,
                        Heading: Heading,
                        Description: Description,
                        Description1 : Description1                       
                    });
        
                    await newData.save();
        
                    return res.status(200).json({
                        success: true,
                        message: 'New Details created successfully'
                    });
                }
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            }
        };

   // Api for get training and Development Details
             
        const get_training_development_Details = async( req , res)=>{
            try {
                    const allDetails = await cms_t_d_Model.find({
                              
                    })
                    if(!allDetails)
                    {
                      return res.status(400).json({
                             success : false ,
                             message : 'no Details found'
                      })
                    }

                      return res.status(200).json({
                           success : true ,
                           message : 'allDetails ',
                           Details : allDetails
                      })
            } catch (error) {
               return res.status(500).json({
                     success : false ,
                     message : 'server error',
                     error_message : error.message
               })
            }
     }


     // Api for recruitment and selection
            
     const cms_recruitment_selection = async (req, res) => {
        try {                 
    
            const { Heading, Description } = req.body;
    
            // Check for exist hr consultancy
            const exist_r_s = await cms_recruitment_selection_Model.findOne({ });
    
            if (exist_r_s) {
                // Update existing section
                exist_r_s.Heading = Heading;
                exist_r_s.Description = Description;
                if (req.file && req.file.filename) {
                    // Get the file extension
                    const fileExtension = path.extname(req.file.filename).toLowerCase();

                    // List of allowed extensions
                    const allowedExtensions = ['.jpg', '.jpeg', '.png'];

                    // Check if the file extension is in the allowed list
                    if (allowedExtensions.includes(fileExtension)) {
                        // If valid, update the profile image
                        exist_r_s.image = req.file.filename;
                    } else {
                        // If not valid, throw an error
                        return res.status(400).json({
                            success : false ,
                            message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                    });
                    }
                }
    
                await exist_r_s.save();
    
                return res.status(200).json({
                    success: true,
                    message: 'Details updated successfully'
                });
            } else {
                // Check for Heading
                if (!Heading) {
                    return res.status(400).json({
                        success: false,
                        message: 'Heading is required'
                    });
                }
    
                // Check for Description
                if (!Description) {
                    return res.status(400).json({
                        success: false,
                        message: 'Description is required'
                    });
                }
    
                // Add image 
                const image =  null;
                if (req.file && req.file.filename) {
                    // Get the file extension
                    const fileExtension = path.extname(req.file.filename).toLowerCase();

                    // List of allowed extensions
                    const allowedExtensions = ['.jpg', '.jpeg', '.png'];

                    // Check if the file extension is in the allowed list
                    if (allowedExtensions.includes(fileExtension)) {
                        // If valid, update the profile image
                        image = req.file.filename;
                    } else {
                        // If not valid, throw an error
                        return res.status(400).json({
                            success : false ,
                            message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                    });
                    }
                }
    
                // Add new Data
                const newData = new cms_recruitment_selection_Model ({
                   
                    image: image ,
                    Heading: Heading,
                    Description: Description
                });
   
                await newData.save();
    
                return res.status(200).json({
                    success: true,
                    message: 'New Details created successfully'
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message
            });
        }
    };

     // Api for get recruitment selection Details
             
     const get_recruitment_selection_Details = async( req , res)=>{
        try {
                const allDetails = await cms_recruitment_selection_Model.find({
                          
                })
                if(!allDetails)
                {
                  return res.status(400).json({
                         success : false ,
                         message : 'no Details found'
                  })
                }

                  return res.status(200).json({
                       success : true ,
                       message : 'allDetails ',
                       Details : allDetails
                  })
        } catch (error) {
           return res.status(500).json({
                 success : false ,
                 message : 'server error',
                 error_message : error.message
           })
        }
 }
        

 // Api for cms employee outsourcing

    
            
     const cms_employee_outsourcing = async (req, res) => {
        try {                 
    
            const { Heading, Description } = req.body;
    
            // Check for exist hr consultancy
            const exist_eO = await cms_employee_outsourcing_Model.findOne({ });
    
            if (exist_eO) {
                // Update existing section
                exist_eO.Heading = Heading;
                exist_eO.Description = Description;
                 
    
                if (req.file && req.file.filename) {
                    // Get the file extension
                    const fileExtension = path.extname(req.file.filename).toLowerCase();

                    // List of allowed extensions
                    const allowedExtensions = ['.jpg', '.jpeg', '.png'];

                    // Check if the file extension is in the allowed list
                    if (allowedExtensions.includes(fileExtension)) {
                        // If valid, update the profile image
                        exist_eO.image = req.file.filename;
                    } else {
                        // If not valid, throw an error
                        return res.status(400).json({
                            success : false ,
                            message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                    });
                    }
                }
    
                await exist_eO.save();
    
                return res.status(200).json({
                    success: true,
                    message: 'Details updated successfully'
                });
            } else {
                // Check for Heading
                if (!Heading) {
                    return res.status(400).json({
                        success: false,
                        message: 'Heading is required'
                    });
                }
    
                // Check for Description
                if (!Description) {
                    return res.status(400).json({
                        success: false,
                        message: 'Description is required'
                    });
                }
    
                // Add image 
                const image = null;
                     
                if (req.file && req.file.filename) {
                    // Get the file extension
                    const fileExtension = path.extname(req.file.filename).toLowerCase();

                    // List of allowed extensions
                    const allowedExtensions = ['.jpg', '.jpeg', '.png'];

                    // Check if the file extension is in the allowed list
                    if (allowedExtensions.includes(fileExtension)) {
                        // If valid, update the profile image
                        image = req.file.filename;
                    } else {
                        // If not valid, throw an error
                        return res.status(400).json({
                            success : false ,
                            message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                    });
                    }
                }
    
                // Add new Data
                const newData = new cms_employee_outsourcing_Model ({
                   
                    image: image ,
                    Heading: Heading,
                    Description: Description
                });
    
                await newData.save();
    
                return res.status(200).json({
                    success: true,
                    message: 'New Details created successfully'
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message
            });
        }
    };


     // Api for get employee outsourcing Details
             
     const get_outsourcing_Details = async( req , res)=>{
        try {
                const allDetails = await cms_employee_outsourcing_Model.find({
                          
                })
                if(!allDetails)
                {
                  return res.status(400).json({
                         success : false ,
                         message : 'no Details found'
                  })
                }

                  return res.status(200).json({
                       success : true ,
                       message : 'allDetails ',
                       Details : allDetails
                  })
        } catch (error) {
           return res.status(500).json({
                 success : false ,
                 message : 'server error',
                 error_message : error.message
           })
        }
 }
     
 
// Api for HR Teleconsultation
       
    
            
     const cms_Hr_teleconsultation = async (req, res) => {
        try {                
    
            const { Heading, Description , Description1 } = req.body;
    
            // Check for exist cms_Hr_teleconsultation
            const exist_HT = await cms_Hr_teleconsultation_model.findOne({ });
    
            if (exist_HT) {
                // Update existing section
                exist_HT.Heading = Heading;
                exist_HT.Description = Description;
                exist_HT.Description1 = Description1;
               
    
              
                if (req.file && req.file.filename) {
                    // Get the file extension
                    const fileExtension = path.extname(req.file.filename).toLowerCase();

                    // List of allowed extensions
                    const allowedExtensions = ['.jpg', '.jpeg', '.png'];

                    // Check if the file extension is in the allowed list
                    if (allowedExtensions.includes(fileExtension)) {
                        // If valid, update the profile image
                        exist_HT.image = req.file.filename;
                    } else {
                        // If not valid, throw an error
                        return res.status(400).json({
                            success : false ,
                            message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                    });
                    }
                }
    
                await exist_HT.save();
    
                return res.status(200).json({
                    success: true,
                    message: 'Details updated successfully'
                });
            } else {
                // Check for Heading
                if (!Heading) {
                    return res.status(400).json({
                        success: false,
                        message: 'Heading is required'
                    });
                }
    
                // Check for Description
                if (!Description) {
                    return res.status(400).json({
                        success: false,
                        message: 'Description is required'
                    });
                }

                // Check for Description1
                if (!Description1) {
                    return res.status(400).json({
                        success: false,
                        message: 'Description1 is required'
                    });
                }
                
    
                // Add image 
                const image = null;
                     
                         
                if (req.file && req.file.filename) {
                    // Get the file extension
                    const fileExtension = path.extname(req.file.filename).toLowerCase();

                    // List of allowed extensions
                    const allowedExtensions = ['.jpg', '.jpeg', '.png'];

                    // Check if the file extension is in the allowed list
                    if (allowedExtensions.includes(fileExtension)) {
                        // If valid, update the profile image
                        image = req.file.filename;
                    } else {
                        // If not valid, throw an error
                        return res.status(400).json({
                            success : false ,
                            message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                    });
                    }
                }

                // Add new Data
                const newData = new cms_Hr_teleconsultation_model ({
                   
                    image: image ,
                    Heading: Heading,
                    Description: Description,        
                    Description1 : Description1,                  
          
                   
                });
    
                await newData.save();
    
                return res.status(200).json({
                    success: true,
                    message: 'New Details created successfully'
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message
            });
        }
    };



       // Api for get employee outsourcing Details
             
     const get_hr_teleconsultation_Details = async( req , res)=>{
        try {
                const allDetails = await cms_Hr_teleconsultation_model.findOne({
                          
                })
                if(!allDetails)
                {
                  return res.status(400).json({
                         success : false ,
                         message : 'no Details found'
                  })
                }

                  return res.status(200).json({
                       success : true ,
                       message : 'allDetails ',
                       Details : allDetails
                  })
        } catch (error) {
           return res.status(500).json({
                 success : false ,
                 message : 'server error',
                 error_message : error.message
           })
        }
 }


 // Api for our mission
 const cms_our_mission = async (req, res) => {
    try {
        const { Heading, Description } = req.body;       

        // Check if our mission data exists
        let exist_our_mission = await cms_our_mission_Model.findOne();

        if (exist_our_mission) {
            // Update existing data
            exist_our_mission.Heading = Heading;
            exist_our_mission.Description = Description;
            await exist_our_mission.save();

            return res.status(200).json({
                success: true,
                message: 'Details updated successfully'
            });
        } else {
             // Check if Heading is missing
        if (!Heading) {
            return res.status(400).json({
                success: false,
                message: 'Heading is required'
            });
        }

        // Check if Description is missing
        if (!Description) {
            return res.status(400).json({
                success: false,
                message: 'Description is required'
            });
        }
            // Create new data
            const newData = new cms_our_mission_Model({
                Heading,
                Description
            });

            await newData.save();

            return res.status(200).json({
                success: true,
                message: 'New details saved successfully'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};


// Api for get cms our mission Details

const get_ourMission_details = async( req , res)=>{
        try {
             // check for details
             const checkDetails = await cms_our_mission_Model.find({
                 
             })

             if(!checkDetails)
                {
                    return res.status(400).json({
                         success : false ,
                         message : 'no Details found'
                    })
                }

                return res.status(200).json({
                     success : true ,
                     message : 'our mission',
                     Details : checkDetails
                })
        } catch (error) {
            return res.status(500).json({
                 success : false ,
                 message : 'server error',
                 error_message : error.message
            })
        }
}


                

// Api for our vission
const cms_our_vission = async (req, res) => {
    try {
        const { Heading, Description } = req.body;       

        // Check if our mission data exists
        let exist_our_vission = await cms_our_vission_Model.findOne();

        if (exist_our_vission) {
            // Update existing data
            exist_our_vission.Heading = Heading;
            exist_our_vission.Description = Description;
            await exist_our_vission.save();

            return res.status(200).json({
                success: true,
                message: 'Details updated successfully'
            });
        } else {
             // Check if Heading is missing
        if (!Heading) {
            return res.status(400).json({
                success: false,
                message: 'Heading is required'
            });
        }

        // Check if Description is missing
        if (!Description) {
            return res.status(400).json({
                success: false,
                message: 'Description is required'
            });
        }
            // Create new data
            const newData = new cms_our_vission_Model({
                Heading,
                Description
            });

            await newData.save();

            return res.status(200).json({
                success: true,
                message: 'New details saved successfully'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};


// Api for get cms our vission Details

const get_ourVission_details = async( req , res)=>{
        try {
             // check for details
             const checkDetails = await cms_our_vission_Model.find({
                 
             })

             if(!checkDetails)
                {
                    return res.status(400).json({
                         success : false ,
                         message : 'no Details found'
                    })
                }

                return res.status(200).json({
                     success : true ,
                     message : 'our vission',
                     Details : checkDetails
                })
        } catch (error) {
            return res.status(500).json({
                 success : false ,
                 message : 'server error',
                 error_message : error.message
            })
        }
}

 // Why choose us ??
 const cms_why_choose_us = async (req, res) => {
    try {
        const { Heading, Description } = req.body;       

        // Check for data exists
        let exist_data = await cms_why_choose_us_Model.findOne();

        if (exist_data) {
            // Update existing data
            exist_data.Heading = Heading;
            exist_data.Description = Description;
            await exist_data.save();

            return res.status(200).json({
                success: true,
                message: 'Details updated successfully'
            });
        } else {
             // Check if Heading is missing
        if (!Heading) {
            return res.status(400).json({
                success: false,
                message: 'Heading is required'
            });
        }

        // Check if Description is missing
        if (!Description) {
            return res.status(400).json({
                success: false,
                message: 'Description is required'
            });
        }
            // Create new data
            const newData = new cms_why_choose_us_Model({
                Heading,
                Description
            });

            await newData.save();

            return res.status(200).json({
                success: true,
                message: 'New details saved successfully'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};

   // Api for get why choose us ??

           const getDetails_why_choose_us = async ( req , res)=>{
               try {
                      const getDetails = await cms_why_choose_us_Model.findOne({})
                      if(!getDetails)
                        {
                             return res.status(400).json({
                                 success : false ,
                                 message : 'no details found'
                             })
                        }

                        return res.status(200).json({
                             success : true ,
                             message : 'Details found',
                             Details : getDetails
                        })
               } catch (error) {
                  return res.status(500).json({
                     success : false ,
                     message : 'server error',
                     error_message : error.message
                  })
               }
           }


  // about us
            const cms_aboutUs = async( req , res ) =>{
                   try {
                           const { Heading , Description } = req.body
                           // check for exist about us

                           const exist_aboutUs = await cms_aboutUs_Model.findOne({
                                
                           })

                           if(exist_aboutUs)
                            {
                                exist_aboutUs.Heading = Heading
                                exist_aboutUs.Description = Description

                                await exist_aboutUs.save()
                                return res.status(200).json({
                                     success : true ,
                                     message : 'Details update successfully'
                                })
                            }

                            else
                            {
                                   // check for required fields

                                   if(!Heading)
                                    {
                                        return res.status(400).json({
                                             success : false ,
                                             message : 'Heading Required'
                                        })
                                    }

                                    if(!Description)
                                        {
                                            return res.status(400).json({
                                                 success : false ,
                                                 message : 'Description Required'
                                            })
                                        }

                                    // create new Data

                                    const newData = new cms_aboutUs_Model({
                                          Heading ,
                                          Description 
                                    })

                                    await newData.save()

                                    return res.status(200).json({
                                         success : true ,
                                         message : 'New Details created successfully'
                                    })
                            }
                   } catch (error) {
                    return res.status(500).json({
                         success : false ,
                         message : 'server error',
                         error_message : error.message
                    })
                   }
            }
            // Api for get cms about us Details

const get_aboutUS_details = async( req , res)=>{
    try {
         // check for details
         const checkDetails = await cms_aboutUs_Model.find({
             
         })

         if(!checkDetails)
            {
                return res.status(400).json({
                     success : false ,
                     message : 'no Details found'
                })
            }

            return res.status(200).json({
                 success : true ,
                 message : 'our mission',
                 Details : checkDetails
            })
    } catch (error) {
        return res.status(500).json({
             success : false ,
             message : 'server error',
             error_message : error.message
        })
    }
}




// our commitment
const cms_our_commitment = async( req , res ) =>{
    try {
            const { Heading , Description } = req.body
            // check for exist commitment

            const exist_our_commitment = await cms_our_commitment_Model.findOne({
                 
            })

            if(exist_our_commitment)
             {
                exist_our_commitment.Heading = Heading
                exist_our_commitment.Description = Description

                 await exist_our_commitment.save()
                 return res.status(200).json({
                      success : true ,
                      message : 'Details update successfully'
                 })
             }

             else
             {
                    // check for required fields

                    if(!Heading)
                     {
                         return res.status(400).json({
                              success : false ,
                              message : 'Heading Required'
                         })
                     }

                     if(!Description)
                         {
                             return res.status(400).json({
                                  success : false ,
                                  message : 'Description Required'
                             })
                         }

                     // create new Data

                     const newData = new cms_our_commitment_Model({
                           Heading ,
                           Description 
                     })

                     await newData.save()

                     return res.status(200).json({
                          success : true ,
                          message : 'New Details created successfully'
                     })
             }
    } catch (error) {
     return res.status(500).json({
          success : false ,
          message : 'server error',
          error_message : error.message
     })
    }
}
// Api for get cms our commitment Details

const get_ourCommitment_details = async( req , res)=>{
try {
// check for details
const checkDetails = await cms_our_commitment_Model.find({

})

if(!checkDetails)
{
 return res.status(400).json({
      success : false ,
      message : 'no Details found'
 })
}

return res.status(200).json({
  success : true ,
  message : 'our commitment',
  Details : checkDetails
})
} catch (error) {
return res.status(500).json({
success : false ,
message : 'server error',
error_message : error.message
})
}
}




// our get_started_today
const cms_get_started_today = async( req , res ) =>{
    try {
            const { Heading , Description } = req.body
            // check for exist commitment

            const exist_gst = await cms_get_started_today_Model.findOne({
                 
            })

            if(exist_gst)
             {
                exist_gst.Heading = Heading
                exist_gst.Description = Description

                 await exist_gst.save()
                 return res.status(200).json({
                      success : true ,
                      message : 'Details update successfully'
                 })
             }

             else
             {
                    // check for required fields

                    if(!Heading)
                     {
                         return res.status(400).json({
                              success : false ,
                              message : 'Heading Required'
                         })
                     }

                     if(!Description)
                         {
                             return res.status(400).json({
                                  success : false ,
                                  message : 'Description Required'
                             })
                         }

                     // create new Data

                     const newData = new cms_get_started_today_Model({
                           Heading ,
                           Description 
                     })

                     await newData.save()

                     return res.status(200).json({
                          success : true ,
                          message : 'New Details created successfully'
                     })
             }
    } catch (error) {
     return res.status(500).json({
          success : false ,
          message : 'server error',
          error_message : error.message
     })
    }
}
// Api for get cms our commitment Details

const get_started_todayDetails = async( req , res)=>{
try {
// check for details
const checkDetails = await cms_get_started_today_Model.find({

})

if(!checkDetails)
{
 return res.status(400).json({
      success : false ,
      message : 'no Details found'
 })
}

return res.status(200).json({
  success : true ,
  message : 'get_started_today',
  Details : checkDetails
})
} catch (error) {
return res.status(500).json({
success : false ,
message : 'server error',
error_message : error.message
})
}
}


                                              /* FAQ Page */

            const createFAQ = async ( req , res )=>{
                                                try {
                                                          const { Question , answer } = req.body
                                                     // check for required fields
                                                 const requiredfields = ['Question' , 'answer' ]
                                                 for ( const field of requiredfields)
                                                    
                                                         {
                                                            if (!req.body[field])
                                                             {
                                                                return res.status(400).json({
                                                                    success: false,
                                                                    message: `Missing ${field.replace('_', ' ')} field`,
                                                                });
                                                             }
                                                        }
                                                         // create new Data
                                                     const newData = await new faqModel({
                                                         Question , answer
                                                     })
                                                        await newData.save()
                     
                                                        return res.status(200).json({
                                                             success : true ,
                                                             message : 'Question created successfully',
                                                        })
                                                   
                                                } catch (error) {
                                                 return res.status(500).json({
                                                         success : false ,
                                                         message : 'server error',
                                                         error_message : error.message
                                                 })
                                                }
                                      }
    // Api for get Faq Details
             const get_FAQdetails = async ( req , res)=>{
                      try {
                           // check for FAQ Details
                        const getDetails = await faqModel.find({

                        })
                          if(!getDetails)
                            {
                                return res.status(400).json({
                                      success : false ,
                                      message : 'No FAQ Details found'
                                })
                            }

                            return res.status(200).json({
                                  success : true ,
                                  message : 'FAQ Details',
                                  Details : getDetails
                            })
                      } catch (error) {
                          return res.status(400).json({
                              success : false ,
                              message : 'server error',
                              error_message : error.message
                          })
                      }
             }
     
        // API FOR DELETE particular faq Details

                 const DeleteFAQ = async ( req ,res )=>{
                           try {
                                     const faq_id = req.params.faq_id
                            // check for faq_id
                            if(!faq_id)
                                {
                                    return res.status(400).json({
                                         success : false ,
                                         message : 'faq Id required'
                                    })
                                }

                            // check for FAQ Details 

                            const FAQ = await faqModel.findOne({
                                     _id : faq_id
                            })

                            if(!FAQ)
                                {
                                    return res.status(400).json({
                                         success : false ,
                                         message : 'FAQ Details not found'
                                    })
                                }
                                await FAQ.deleteOne()

                                return res.status(200).json({
                                     success : true ,
                                     message : 'FAQ Details Deleted'
                                })
                           } catch (error) {
                            return res.status(500).json({
                                     success : false ,
                                     message : 'server error',
                                     error_message : error.message
                            })
                           }
                 }


                                                 /* Contact us Page */
      // Api for get Contact us page details
                const get_contactUS = async( req , res)=>{
                         try {
                                 // check for details
                            const checkDetails = await contactUsModel.find({
                                 
                            })

                         if(!checkDetails)
                            {
                                  return res.status(400).json({
                                       success : false ,
                                       message : 'Details not found'
                                  })
                            }

                            return res.status(200).json({
                                 success : true ,
                                 message : 'Details',
                                 Details : checkDetails
                            })
                         } catch (error) {
                             return res.status(500).json({
                                   success : false ,
                                   message : 'server error',
                                   error_message : error.message
                             })
                         }
                }

// API FOR DELETE particular contactUS Details

const DeleteContactUS = async ( req ,res )=>{
    try {
              const contact_id = req.params.contact_id
     // check for faq_id
     if(!contact_id)
         {
             return res.status(400).json({
                  success : false ,
                  message : 'contact_id required'
             })
         }

     // check for contact Details 

     const contact = await contactUsModel.findOne({
              _id : contact_id
     })

     if(!contact)
         {
             return res.status(400).json({
                  success : false ,
                  message : 'contact Details not found'
             })
         }
         await contact.deleteOne()

         return res.status(200).json({
              success : true ,
              message : 'Contact Details Deleted'
         })
    } catch (error) {
     return res.status(500).json({
              success : false ,
              message : 'server error',
              error_message : error.message
     })
    }
}

                                               /* Labour law  */
    // Api for Overtime
    const Overtime = async (req, res) => {
        try {
            let { Basic_pay, OT_Hours_weekday = 0, OT_Hours_weekend = 0 } = req.body;
    
            // Check for required fields
            if (!Basic_pay) {
                return res.status(400).json({
                    success: false,
                    message: 'Basic pay is required'
                });
            }
    
            // Calculate Basic Pay per Day
            const Basic_pay_per_day = Math.round(Basic_pay / 22);
            const basic_pay_per_day_without_rounded = Basic_pay / 22;
    
            // Calculate Pay per Hour
            const Basic_pay_per_Hour = Basic_pay_per_day / 8;
            const Basic_pay_per_Hour_rounded = Math.round(Basic_pay_per_Hour);
    
            // Calculate overtime computation on weekdays using the provided formula
            let OT_computation_on_weekday;
            let OT_computation_on_weekday_rounded;
            let message = 'Overtime calculated successfully';
    
            if (OT_Hours_weekday > 4) {
                // Compute only for the first 4 hours
                OT_computation_on_weekday = 4 * Basic_pay_per_Hour * 1.5;
                OT_computation_on_weekday_rounded = Math.round(OT_computation_on_weekday);
    
                // Notify that only 4 hours are computed
                message = `Attention :
                Please note that our overtime computation guide limits the maximum allowable overtime to 4 hours per month (Monday to Friday) for weekdays. 
                However, overtime on weekends and holidays is not subject to this limit and can be recorded without restriction. 
                Any attempts to record more than the allowable amount for weekdays will not be processed.
                 For further details or to ensure compliance, please refer to the guidelines in this overtime guide or consult the Employment Act of 2023.`;
         } else {
                OT_computation_on_weekday = OT_Hours_weekday * Basic_pay_per_Hour * 1.5;
                OT_computation_on_weekday_rounded = Math.round(OT_computation_on_weekday);
            }
    
            // Calculate Pay per Hour for weekends
            const Basic_pay_per_Hour_for_weekend = basic_pay_per_day_without_rounded / 8;
    
            // Calculate overtime computation on weekends
            const OT_computation_on_weekend = Basic_pay_per_Hour_for_weekend * OT_Hours_weekend * 2;
    
            // Calculate total overtime
            const total_overtime = Math.round(OT_computation_on_weekday_rounded + OT_computation_on_weekend);
    
            // Function to add thousand separators
            const formatNumber = num => new Intl.NumberFormat('en-US').format(num);
    
            // Return the calculated values
            return res.status(200).json({
                success: true,
                message,
                data: {
                    Basic_pay: `SLE ${formatNumber(Basic_pay)}`,
                    OT_Hours_weekday: OT_Hours_weekday,
                    OT_Hours_weekend: OT_Hours_weekend,
                    Basic_pay_per_day: `SLE ${formatNumber(Basic_pay_per_day)}`,
                    Basic_pay_per_Hour: `SLE ${formatNumber(Basic_pay_per_Hour_rounded)}`,
                    OT_computation_on_weekday: `SLE ${formatNumber(OT_computation_on_weekday_rounded)}`,
                    OT_computation_on_weekend: `SLE ${formatNumber(OT_computation_on_weekend)}`,
                    total_overTime: `SLE ${formatNumber(total_overtime)}`
                }
            });
    
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message
            });
        }
    };
           
    

    // Api for Leave allowence
      
    const leave_allowence = async (req, res) => {
        try {
            let { Basic_pay, leave_allowence_percentage } = req.body;
    
            // Check for required fields
            if (!Basic_pay) {
                return res.status(400).json({
                    success: false,
                    message: 'Basic pay required'
                });
            }
            if (!leave_allowence_percentage) {
                return res.status(400).json({
                    success: false,
                    message: 'leave_allowence_percentage required'
                });
            }
           
    
            // Calculate Annual Basic
            let annual_Basic = Math.round(Basic_pay * 12);
    
            // Calculate leave allowence
          let  leave_allowence_percentage1 = leave_allowence_percentage / 100
            let leave_allowence = Math.round(annual_Basic * leave_allowence_percentage1)
                let income_tax = 0
               // calculate Income Tax 
               if(leave_allowence > Basic_pay )
                {
                  income_tax =   Math.round (leave_allowence - Basic_pay) * 0.3
                }
                else
                {
                    income_tax = 0
                }
                    
                
                // calculate net leave allow
                  let net_leave_allow = leave_allowence - income_tax

                  // Function to add thousand separators
        const formatNumber = num => new Intl.NumberFormat('en-US').format(num);

                      
            // Return the calculated values
            return res.status(200).json({
                success: true,
                message: 'Calculation successful',
                data: {
                    Basic_pay : `SLE ${formatNumber(Basic_pay)}`, 
                    leave_allowence_percentage : leave_allowence_percentage ,
                    annual_Basic : `SLE ${formatNumber(annual_Basic)}` ,
                    leave_allowence : `SLE ${formatNumber(leave_allowence)}` ,
                    income_tax : `SLE ${formatNumber(income_tax)}`  ,
                    net_leave_allow :  `SLE ${formatNumber(net_leave_allow)}`
                }
            });
    
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message
            });
        }
    };

       // Api for calculating  EOSB

       const calculate_EOSB = async (req, res) => {
          try {
            let { contract_start_Date, Employment_end_Date, EOSB_days_per_year = 0, untilized_leave_days = 0, Basic_pay } = req.body;

               // Check for required fields
               if (!contract_start_Date) {
                return res.status(400).json({
                    success: false,
                    message: 'contract_start_Date required'
                });
            }
            if (!Employment_end_Date) {
                return res.status(400).json({
                    success: false,
                    message: 'Employment_end_Date required'
                });
            }

            if (!Basic_pay) {
                return res.status(400).json({
                    success: false,
                    message: 'Basic_pay required'
                });
            }

                // convert contract startdate and end date to date object format

                const startDate = new Date(contract_start_Date)
                const endDate = new Date(Employment_end_Date)

                // calculate the number of month between the dates

                const totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth())

                // calculate the number of full year
                    const fullyears = Math.floor(totalMonths / 12)

                    // calculate the number of additional months beyoond the years

                    const additionalMonths = totalMonths % 12

                    // apply for the custome logic for partial years

                    let partialYears = 0
                    if(additionalMonths >= 6)
                    {
                        partialYears = 1
                    }
                    else if( additionalMonths >= 3)
                    {
                        partialYears = 0.6
                    }


                      // calculate the total years served

                      const totalYearsServed = fullyears + partialYears

                      // Round up the value of the year nearest two decimal places

                      const rounded_year_served = Math.round(totalYearsServed * 100 ) / 100

                      // check for year served eligibility

                      if( rounded_year_served < 1)
                      {
                            return res.status(400).json({
                                 success : false ,
                                 message :  'you are not eligile for end of service benefit pay'
                            })
                      }

                      // calculate gross EOSB
                        const EOSB = Math.round(( Basic_pay * EOSB_days_per_year * rounded_year_served) / 22)

                                  // Calculate gross salary
        const gross_salary = EOSB + untilized_leave_days;

        // Calculate tax on EOSB
        let tax_on_EOSB = 0;
        if (gross_salary > 50000) {
            tax_on_EOSB = Math.round((gross_salary - 50000) * 0.05);
        }

        // Calculate net EOSB
        const net_EOSB = gross_salary - tax_on_EOSB;

        // Function to add thousand separators
        const formatNumber = num => new Intl.NumberFormat('en-US').format(num);

        // Return the calculated values
        return res.status(200).json({
            success: true,
            message: 'Calculation successful',
            data: {
                contract_start_Date,
                Employment_end_Date,
                year_served: rounded_year_served,
                EOSB_days_per_year,
                Basic_salary: `SLE ${formatNumber(Basic_pay)}`,
                Gross_EOSB: `SLE ${formatNumber(EOSB)}`
                // tax_on_EOSB: `SLE ${formatNumber(tax_on_EOSB)}`,
                // net_EOSB: `SLE ${formatNumber(net_EOSB)}`
            }
        });


          } catch (error) {
                return res.status(500).json({
                     success : false ,
                     message : 'server error',
                     error_message : error.message
                })
          }
       }

/*

       const calculate_EOSB = async (req, res) => {
        try {
            let { contract_start_Date, Employment_end_Date, EOSB_days_per_year = 0, untilized_leave_days = 0, Basic_pay } = req.body;
    
            // Check for required fields
            if (!contract_start_Date) {
                return res.status(400).json({
                    success: false,
                    message: 'contract_start_Date required'
                });
            }
            if (!Employment_end_Date) {
                return res.status(400).json({
                    success: false,
                    message: 'Employment_end_Date required'
                });
            }
            if (EOSB_days_per_year) {
                EOSB_days_per_year = EOSB_days_per_year
            }
                  
            if (untilized_leave_days) {
                untilized_leave_days = untilized_leave_days
            }
            if (!Basic_pay) {
                return res.status(400).json({
                    success: false,
                    message: 'Basic_pay required'
                });
            }
    
            // Convert contract_start_Date and Employment_end_Date to Date objects
            const startDate = new Date(contract_start_Date);
            const endDate = new Date(Employment_end_Date);
    
            // Calculate years served
            const year_served = (endDate - startDate) / (365.25 * 24 * 60 * 60 * 1000);
    
            // Round up years served to the nearest two decimal places
            const rounded_year_served = Math.round(year_served * 100) / 100; 

            // check for year served

            if (rounded_year_served <= 1) {
                return res.status(400).json({
                    success: false,
                    message: 'You are not eligible for end of service benefit pay.'
                });
            }
            
                
            // Calculate gross EOSB
            const EOSB = Math.round((Basic_pay * EOSB_days_per_year * rounded_year_served) / 22); 
    
            // Calculate payment for unutilized leave days
            const payment_for_unutilized_leave_days = Math.round((Basic_pay / 22) * untilized_leave_days);
    
            // Calculate gross salary
            const gross_salary = EOSB + payment_for_unutilized_leave_days;
    
            // Calculate tax on EOSB
            let tax_on_EOSB = 0;
            if (gross_salary > 50000) {
                tax_on_EOSB = Math.round((gross_salary - 50000) * 0.05);
            }
    
            // Calculate net EOSB
            const net_EOSB = gross_salary - tax_on_EOSB;

             // Function to add thousand separators
        const formatNumber = num => new Intl.NumberFormat('en-US').format(num);

    
            // Return the calculated values
            return res.status(200).json({
                success: true,
                message: 'Calculation successful',
                data: {
                    contract_start_Date : contract_start_Date,
                    Employment_end_Date : Employment_end_Date, 
                    year_served: rounded_year_served,
                    EOSB_days_per_year : EOSB_days_per_year , 
                    Basic_salary: `SLE ${formatNumber(Basic_pay)}`,                   
                    Gross_EOSB: `SLE ${formatNumber(EOSB)}`,             
                    tax_on_EOSB: `SLE ${formatNumber(tax_on_EOSB)}`,
                    net_EOSB: `SLE ${formatNumber(net_EOSB)}`,      
                    
                    
                }
            });
    
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message
            });
        }
    };
    
  */
 
    
// Api for calculate Net salary
const net_salary = async (req, res) => {
    try {
      let { Basic_pay, total_Allowance } = req.body;
  
        if(!Basic_pay)
            {
                return res.status(400).json({
                     success : false ,
                     message : ' basic salary Requried'
                })
            }
        // if(transport_allowance)
        //     {
        //         transport_allowance = transport_allowance
        //     }
        
        // if(rent_allowance)
        //     {
        //         rent_allowance = rent_allowance
        //     }
        
        // if(Hazard_and_other_allowance)
        //     {
        //         Hazard_and_other_allowance = Hazard_and_other_allowance
        //     }
        
  
    //   // Calculate Total Allowance
    //     total_Allowance = Math.round(transport_allowance + rent_allowance + Hazard_and_other_allowance);
  
      // Calculate Gross Salary
      const gross_salary = Math.round(Basic_pay + total_Allowance);
  
      // Calculate Non-taxable Pay
      const non_taxable_pay = total_Allowance < 500 ? total_Allowance : 500;
  
      // Calculate NASSIT Percentage
      const nassit_percentage = Math.round(Basic_pay * 5 )/100 ;
  
      // Calculate Taxable Pay
      const taxable_pay = Math.round((Basic_pay - nassit_percentage + total_Allowance) - non_taxable_pay);
  
      // Calculate Deduction PAYE
      let Deducation_pay = 0;
      if (taxable_pay >= 2400) {
        Deducation_pay = Math.round((taxable_pay - 2400) * 0.3 + 360);
      } else if (taxable_pay >= 1800) {
        Deducation_pay = Math.round((taxable_pay - 1800) * 0.25 + 210);
      } else if (taxable_pay >= 1200) {
        Deducation_pay = Math.round((taxable_pay - 1200) * 0.2 + 90);
      } else if (taxable_pay >= 600) {
        Deducation_pay = Math.round((taxable_pay - 600) * 0.15);
      }
  
      // Calculate Total Deductions
      const total_deduction = Math.round(Deducation_pay + nassit_percentage);
  
      // Calculate Net Salary
      const net_Salary = gross_salary - total_deduction;
       // Function to add thousand separators
       const formatNumber = num => new Intl.NumberFormat('en-US').format(num);

  
      // Return the calculated values
      return res.status(200).json({
        success: true,
        message: 'Calculation successful',
        data: {
            Basic_pay :   `SLE ${formatNumber(Basic_pay)}` ,
            // transport_allowance:  `SLE ${formatNumber(transport_allowance)}` ,
            // rent_allowance :  `SLE ${formatNumber(rent_allowance)}` ,
            // Hazard_and_other_allowance :  `SLE ${formatNumber(Hazard_and_other_allowance)}` ,
            total_Allowance : `SLE ${formatNumber(total_Allowance)}` ,
            gross_salary :  `SLE ${formatNumber(gross_salary)}`  ,
            non_taxable_pay :  `SLE${formatNumber(non_taxable_pay)}`   ,
            taxable_pay : `SLE ${formatNumber(taxable_pay)}`  ,
            nassit: `SLE ${formatNumber(nassit_percentage)}`,
          PAYE : `SLE ${formatNumber(Deducation_pay)}`,
          total_deduction :  `SLE ${formatNumber(total_deduction)}`,
          net_Salary : `SLE ${formatNumber(net_Salary)}`,
        },
      });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error_message: error.message,
      });
    }
  };
  

                                       /* Reports and Analytics */
                
    // Api for get count of candidate with there current status
    const jobseeker_count = async (req, res) => {
        try {
          const check_all_jobseeker = await appliedjobModel.find({});
          
          if (check_all_jobseeker.length === 0) {
            return res.status(400).json({
              success: false,
              message: 'No profile found'
            });
          }


        
          // Count job seekers by status
          const pending_count = check_all_jobseeker.filter(job => job.jobSeeker_status === 1).length;
          const Shortlisted_count = check_all_jobseeker.filter(job => job.jobSeeker_status === 2).length;
          const longlisted_count = check_all_jobseeker.filter(job => job.jobSeeker_status === 3).length;
          const Assessment_Scheduled_count = check_all_jobseeker.filter(job => job.jobSeeker_status === 4).length;
          const Schedule_Interview_count = check_all_jobseeker.filter(job => job.jobSeeker_status === 5).length;
          const complete_count = check_all_jobseeker.filter(job => job.jobSeeker_status === 6).length;
          const rejected_count = check_all_jobseeker.filter(job => job.jobSeeker_status === 7).length;
      
          return res.status(200).json({
            success: true,
            message: 'Details',
            pending_count,
            shortlisted_count : Shortlisted_count,
            longlisted_count : longlisted_count,
            assessment_count : Assessment_Scheduled_count,           
            schedule_count : Schedule_Interview_count,           
            complete_count,          
            rejected_count
          });
      
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message : error.message
          });
        }
      }
      
                  
      const { parse, format, eachDayOfInterval } = require('date-fns');
      const e = require('cors')
const jobDescription_model = require('../model/jobDescription')
      
      // Api for get all clients counts

      const getclient_count = async (req, res) => {
        try {
          const currentYear = new Date().getFullYear();
          const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
          if (currentYear) {
            const allClientsByMonth = [];
      
            for (let i = 0; i < 12; i++) {
              // Construct start and end dates for each month
              const startDate = new Date(currentYear, i, 1);
              const endDate = new Date(currentYear, i + 1, 0);
      
              // Query the database for clients created within the current month
              const all_clients = await employeeModel.find({
                createdAt: { $gte: startDate, $lte: endDate }
              });
      
              // Count clients for the current month
              const clientsCount = all_clients.length;
      
              // Add month count to the array
              allClientsByMonth.push({
                month: month[i],
                client_count: clientsCount
              });
            }
      
            return res.status(200).json({
              success: true,
              message: 'Client Details',
              details: allClientsByMonth
            });
          } else {
            return res.status(200).json({
              success: false,
              date_required: 'Date or month and year are required'
            });
          }
        } catch (error) {
          console.error(error);
          return res.status(500).json({
            success: false,
            message: 'Server error'
          });
        }
      };


       // Api for get all talent pool counts
      
       const get_talent_pool_count = async (req, res) => {
        try {
            const currentYear = new Date().getFullYear();
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const details = [];
    
            if (currentYear) {
                for (let i = 0; i < 12; i++) {
                    const startDate = new Date(currentYear, i, 1);
                    const endDate = new Date(currentYear, i + 1, 0);
    
                    const all_talent_pool = await appliedjobModel.find({
                        createdAt: { $gte: startDate, $lte: endDate }
                    });
    
                    const female_screened = await appliedjobModel.find({
                        gender: 'Female',
                        createdAt: { $gte: startDate, $lte: endDate }
                    });
    
                    const talentPoolCount = all_talent_pool.length;
                    const femaleScreenedCount = female_screened.length;
    
                    details.push({
                        month: monthNames[i],
                        talentPool_count: talentPoolCount,
                        Female_screened_count: femaleScreenedCount
                    });
                }
    
                return res.status(200).json({
                    success: true,
                    message: 'Talent Pool Details',
                    details: details
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Date or month and year are required'
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    };
    


      // Api for get all Female Screen candidate counts
      
      const get_female_screened_count = async (req, res) => {
        try {
          const currentYear = new Date().getFullYear();
          const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
          if (currentYear) {
            const all_female_screened = [];
      
            for (let i = 0; i < 12; i++) {
              // Construct start and end dates for each month
              const startDate = new Date(currentYear, i, 1);
              const endDate = new Date(currentYear, i + 1, 0);
      
              // Query the database for applied female_screened created within the current month
              const female_screened = await appliedjobModel.find({
                gender : 'Female',
                createdAt: { $gte: startDate, $lte: endDate }
              });
      
              // Count talent pool for the current month
              const Female_screened_count = female_screened.length;
      
              // Add month count to the array
              all_female_screened.push({
                month: month[i],
                Female_screened_count : Female_screened_count
              });
            }
      
            return res.status(200).json({
              success: true,
              message: 'female_screened_ Details',
              details: all_female_screened
            });
          } else {
            return res.status(200).json({
              success: false,
              date_required: 'Date or month and year are required'
            });
          }
        } catch (error) {
          console.error(error);
          return res.status(500).json({
            success: false,
            message: 'Server error'
          });
        }
      };
      
      
      // Api for get count of candidate city wise
      const jobseeker_count_city_wise = async (req, res) => {
        try {
            const check_all_jobseeker = await appliedjobModel.find({});
            
            if (check_all_jobseeker.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No profiles found'
                });
            }
            
            // Initialize jobseekersByCity object with all cities and count 0
            const cities = [
                "Western_Area_Urban",
                "Western_Area_Rural",
                "Bombali",
                "Bonthe",
                "Kailahun",
                "Kambia",
                "Kenema",
                "Koinadugu",
                "Kono",
                "Moyamba",
                "Port_Loko",
                "Pujehun",
                "Tonkolili",
                "Bo",
                "Karene",
                "Falaba"
            ];
    
            const jobseekersByCity = {};
            cities.forEach(city => {
                jobseekersByCity[city] = 0;
            });
    
            // Count job seekers by city
            check_all_jobseeker.forEach(job => {
                const city = job.city;
                if (jobseekersByCity.hasOwnProperty(city)) {
                    jobseekersByCity[city]++;
                }
            });
    
            return res.status(200).json({
                success: true,
                message: 'Details',
                details : jobseekersByCity
            });
    
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message
            });
        }
    }
    
      


                                                  /* Elite talent pool --- cms page */
      
                 const cms_elite_talent_pool = async (req, res) => {
            try {       
                
                const { Heading, Description , Description1 } = req.body;
        
                // Check for exist cms_elite_talent_pool
                const exist_cms_elite_talent_pool = await cms_elite_talent_pool_Model.findOne({ });
        
                if (exist_cms_elite_talent_pool) {
                    // Update existing section
                    exist_cms_elite_talent_pool.Heading = Heading;
                    exist_cms_elite_talent_pool.Description = Description;
                    exist_cms_elite_talent_pool.Description1 = Description1;

        
                    
                if (req.file && req.file.filename) {
                    // Get the file extension
                    const fileExtension = path.extname(req.file.filename).toLowerCase();

                    // List of allowed extensions
                    const allowedExtensions = ['.jpg', '.jpeg', '.png'];

                    // Check if the file extension is in the allowed list
                    if (allowedExtensions.includes(fileExtension)) {
                        // If valid, update the profile image
                        exist_cms_elite_talent_pool.image = req.file.filename;
                    } else {
                        // If not valid, throw an error
                        return res.status(400).json({
                            success : false ,
                            message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                    });
                    }
                }
        
                    await exist_cms_elite_talent_pool.save();
        
                    return res.status(200).json({
                        success: true,
                        message: 'Details updated successfully'
                    });
                } else {
                    // Check for Heading
                    if (!Heading) {
                        return res.status(400).json({
                            success: false,
                            message: 'Heading is required'
                        });
                    }
        
                    // Check for Description
                    if (!Description) {
                        return res.status(400).json({
                            success: false,
                            message: 'Description is required'
                        });
                    }

                    // Check for Description1
                    if (!Description1) {
                        return res.status(400).json({
                            success: false,
                            message: 'Description1 is required'
                        });
                    }
                   
                   
                    // Add image 
                    let image =  null;
                    if (req.file && req.file.filename) {
                        // Get the file extension
                        const fileExtension = path.extname(req.file.filename).toLowerCase();
    
                        // List of allowed extensions
                        const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    
                        // Check if the file extension is in the allowed list
                        if (allowedExtensions.includes(fileExtension)) {
                            // If valid, update the profile image
                            image = req.file.filename;
                        } else {
                            // If not valid, throw an error
                            return res.status(400).json({
                                success : false ,
                                message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                        });
                        }
                    }
        
                    // Add new Data
                    const newData = new cms_elite_talent_pool_Model({
                       
                        image: image ,
                        Heading: Heading,
                        Description: Description,
                        Description1 : Description1
                       
                    });
        
                    await newData.save();
        
                    return res.status(200).json({
                        success: true,
                        message: 'New Details created successfully'
                    });
                }
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            }
        };
     

        // Api for get elite talent pool for female cms

         const get_cms_elite_talent_pool = async( req , res)=>{
            try {
                    const allDetails = await cms_elite_talent_pool_Model.find({
                              
                    })
                    if(!allDetails)
                    {
                      return res.status(400).json({
                             success : false ,
                             message : 'no Details found'
                      })
                    }

                      return res.status(200).json({
                           success : true ,
                           message : 'allDetails ',
                           Details : allDetails
                      })
            } catch (error) {
               return res.status(500).json({
                     success : false ,
                     message : 'server error',
                     error_message : error.message
               })
            }
     }



            // Api for make job favourate

                 const fav_job = async ( req , res )=> {
                     try {
                            const jobId = req.params.jobId
                    // check for jobID

                      if(!jobId)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'jobId required'
                            })
                        }

                        // check for job

                        const job = await jobModel.findOne({ jobId : jobId })
                        if(!job)
                            {
                                return res.status(400).json({
                                     success : false,
                                     message : 'job not found' 
                                })
                            }

                              // check for job fav status

                              if(job.fav_status === 0)
                                {
                                    job.fav_status = 1
                                    job.save()
                                    return res.status(200).json({
                                        success : true ,
                                        message : 'job saved as Favourite'
                                   })
                                }
                                else
                                {
                                    job.fav_status = 0
                                    job.save()
                                    return res.status(200).json({
                                        success : true ,
                                        message : 'job saved as unfavourite'
                                   })
                                }

                                
                     } catch (error) {
                          return res.status(500).json({
                               success : false ,
                               message : 'server error',
                               error_message : error.message
                          })
                     }
                 }
                       
    // Api for get all the favourite jobs

         const get_All_favourite_jobs = async( req , res )=> {
              try {
                
                    // check for all fav jobs

                    const all_fav = await jobModel.find({
                         fav_status : 1,
                         status : 1
                    })

                    if(!all_fav)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'no favourite jobs found'
                            })
                        }

                        const sortedfavJOb = await all_fav.sort(( a , b ) => b.updatedAt - a.updatedAt )

                        return res.status(200).json({
                             success : true ,
                             message : 'all Favourite jobs',
                             all_fav : sortedfavJOb
                        })
              } catch (error) {
                  return res.status(500).json({
                     success : false ,
                     message : 'server error',
                     error_message : error.message
                  })
              }
         }


         // Api for footer cms

         const cms_footer_content = async (req, res) => {
            try {       
                
                const {  Description } = req.body;
        
                // Check for exist cms_footer_content
                const exist_cms_footer_content = await cms_footer_contentModel.findOne({ });
        
                if (exist_cms_footer_content) {
                    // Update existing section
                   
                    exist_cms_footer_content.Description = Description;
                   
        
                  
                    await exist_cms_footer_content.save();
        
                    return res.status(200).json({
                        success: true,
                        message: 'Details updated successfully'
                    });
                } else {
                    
                    // Check for Description
                    if (!Description) {
                        return res.status(400).json({
                            success: false,
                            message: 'Description is required'
                        });
                    }                 
                   
                   
                    // Add new Data
                    const newData = new cms_footer_contentModel({
                       
                       
                        Description: Description
                       
                    });
        
                    await newData.save();
        
                    return res.status(200).json({
                        success: true,
                        message: 'New Details created successfully'
                    });
                }
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            }
        };
     

        // Api for get cms footer content

        const get_cms_footer_content = async( req , res)=>{
            try {
                    const allDetails = await cms_footer_contentModel.find({
                              
                    })
                    if(!allDetails)
                    {
                      return res.status(400).json({
                             success : false ,
                             message : 'no Details found'
                      })
                    }

                      return res.status(200).json({
                           success : true ,
                           message : 'allDetails ',
                           Details : allDetails
                      })
            } catch (error) {
               return res.status(500).json({
                     success : false ,
                     message : 'server error',
                     error_message : error.message
               })
            }
     }



     // Api for cms Acadmic credentials verifiers
      
               
     const cms_acadmic_credentials_verifier = async (req, res) => {
        try {       
            
            const { Heading, Description , Description1 } = req.body;
    
            // Check for exist cms_elite_talent_pool
            const exist_cms_acadmic_credentials_verifier = await cms_acadmic_credentials_verifier_Model.findOne({ });
    
            if (exist_cms_acadmic_credentials_verifier) {
                // Update existing section
                exist_cms_acadmic_credentials_verifier.Heading = Heading;
                exist_cms_acadmic_credentials_verifier.Description = Description;
                exist_cms_acadmic_credentials_verifier.Description1 = Description1;

    
                 if (req.file && req.file.filename) {
                    // Get the file extension
                    const fileExtension = path.extname(req.file.filename).toLowerCase();

                    // List of allowed extensions
                    const allowedExtensions = ['.jpg', '.jpeg', '.png'];

                    // Check if the file extension is in the allowed list
                    if (allowedExtensions.includes(fileExtension)) {
                        // If valid, update the profile image
                        exist_cms_acadmic_credentials_verifier.image = req.file.filename;
                    } else {
                        // If not valid, throw an error
                        return res.status(400).json({
                            success : false ,
                            message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                    });
                    }
                }
    
                await exist_cms_acadmic_credentials_verifier.save();
    
                return res.status(200).json({
                    success: true,
                    message: 'Details updated successfully'
                });
            } else {
                // Check for Heading
                if (!Heading) {
                    return res.status(400).json({
                        success: false,
                        message: 'Heading is required'
                    });
                }
    
                // Check for Description
                if (!Description) {
                    return res.status(400).json({
                        success: false,
                        message: 'Description is required'
                    });
                }

                // Check for Description1
                if (!Description1) {
                    return res.status(400).json({
                        success: false,
                        message: 'Description1 is required'
                    });
                }
               
               
                // Add image 
                let image = null;

             
                if (req.file && req.file.filename) {
                    // Get the file extension
                    const fileExtension = path.extname(req.file.filename).toLowerCase();

                    // List of allowed extensions
                    const allowedExtensions = ['.jpg', '.jpeg', '.png'];

                    // Check if the file extension is in the allowed list
                    if (allowedExtensions.includes(fileExtension)) {
                        // If valid, update the profile image
                       image = req.file.filename;
                    } else {
                        // If not valid, throw an error
                        return res.status(400).json({
                            success : false ,
                            message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                    });
                    }
                }
    
    
                // Add new Data
                const newData = new cms_acadmic_credentials_verifier_Model({
                   
                    image: image ,
                    Heading: Heading,
                    Description: Description,
                    Description1: Description1
                   
                });
    
                await newData.save();
    
                return res.status(200).json({
                    success: true,
                    message: 'New Details created successfully'
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message
            });
        }
    };
 


       // Api for get Acadmic credentials verifier details
         
       const get_acadmic_credentials_verifier = async( req , res)=>{
        try {
                const allDetails = await cms_acadmic_credentials_verifier_Model.findOne({
                          
                })
                if(!allDetails)
                {
                  return res.status(400).json({
                         success : false ,
                         message : 'no Details found'
                  })
                }

                  return res.status(200).json({
                       success : true ,
                       message : 'allDetails ',
                       Details : allDetails
                  })
        } catch (error) {
           return res.status(500).json({
                 success : false ,
                 message : 'server error',
                 error_message : error.message
           })
        }
 }


                                               /* news letter */
            // Api for newsletter 

            const newsLetter = async ( req , res )=> {
                try {
                     const { email } = req.body

                     // check for email 

                     if(!email)
                         {
                             return res.status(400).json({
                                  success : false ,
                                  message : 'email required'
                             })
                         }
                     
                         // check for email exist

                         const existEmail = await cms_newsletter_Model.findOne({
                               email : email
                         })

                         if(existEmail)
                             {
                                 return res.status(400).json({
                                      success : false ,
                                      message : 'you subscribed already with these email'
                                 })
                             }

                                 // save the record

                         const save_data = new cms_newsletter_Model({
                              email
                         })

                         await save_data.save()

                         return res.status(200).json({
                              success : true ,
                              message : 'subscribed successfully'
                         })
                } catch (error) {
                    return res.status(500).json({
                             success : false ,
                             message : 'server error',
                             error_message  : error.message
                    })
                }
         }

 // Api for get all news letter details 

               const getAll_newsLetter = async ( req , res )=>{
                  try {
                            const all_details = await cms_newsletter_Model.find({})

                            if(!all_details)
                             {
                                 return res.status(400).json({
                                     success : false ,
                                     message : 'no details found'
                                 })
                             }
                                const sortedData = await all_details.sort(( a , b ) => b.createdAt - a.createdAt )
                             return res.status(200).json({
                                  success : true ,
                                  message : 'all newsLetter Details',
                                  all_details : sortedData
                             })
                  } catch (error) {
                       return res.status(500).json({
                          success : false ,
                          message : 'server error',
                          error_message : error.message
                       })
                  }
               }


// APi for carrer advice 
              const new_carrer_advice = async ( req , res)=> {
                 try {
                        const { Heading , Description } = req.body
                    // check for required fields

                    if(!Heading)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'Heading Required'
                            })
                        }
                    if(!Description)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'Description Required'
                            })
                        }
                    
                        let image = null

                        if (req.file && req.file.filename) {
                            // Get the file extension
                            const fileExtension = path.extname(req.file.filename).toLowerCase();
        
                            // List of allowed extensions
                            const allowedExtensions = ['.jpg', '.jpeg', '.png'];
        
                            // Check if the file extension is in the allowed list
                            if (allowedExtensions.includes(fileExtension)) {
                                // If valid, update the profile image
                               image = req.file.filename;
                            } else {
                                // If not valid, throw an error
                                return res.status(400).json({
                                    success : false ,
                                    message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                            });
                            }
                        }

                        // create new Data 

                         const newData = new carrer_advice_model({
                             Heading ,
                             Description,
                             image
                         })

                         await newData.save()

                         return res.status(200).json({
                             success : true ,
                             message : 'new Data added successfully',
                             Data : newData
                         })
            
                 } catch (error) {
                     return res.status(500).json({
                         success : false ,
                         message : 'server error',
                         error_message : error.message
                     })
                 }
              }
        
        // Api for get all carrer advice Details

         const all_carrer_details = async ( req , res)=> {
              try {
                     const all_details = await carrer_advice_model.find()
                     if(!all_details)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'No Career Details found'

                            })
                        }

                    return res.status(200).json({
                         success : true ,
                         message  : 'carrer Details',
                         Details : all_details
                    })
              } catch (error) {
                  return res.status(500).json({
                     success : false ,
                     message : 'server error',
                     error_message : error.message
                  })
              }
         }

    // Api for delete particular carrer Advice Detail

              const delete_carrer_advice = async ( req , res )=> {
                 try { 
                       const carrer_advice_Id = req.params.carrer_advice_Id

                    // check for carrer advicve ID
                       if(!carrer_advice_Id)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'carrer advive Id required'
                            })
                        }
                    // check for carrer_advice

                     const carrer_advice = await carrer_advice_model.findOne({ _id : carrer_advice_Id })

                     if(!carrer_advice)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'no details found'
                            })
                        }
                         await carrer_advice.deleteOne()

                         return res.status(200).json({
                             success : true ,
                             message : 'Details Deleted successfully'
                         })
                 } catch (error) {
                      return res.status(500).json({
                         success : false ,
                         message : 'server error',
                         error_message : error.message
                      })
                 }
              }


              // Api for  generate sample file

              const generate_sampleFile = async (req, res) => {
                try {
                  const workbook = new ExcelJs.Workbook();
                  const worksheet = workbook.addWorksheet("fixit_finder");
              
                  worksheet.addRow([
                    "Timestamp",
                    "FullName",
                    "phone_no",
                    "Gender",
                    "nationality_or_voter_id",
                    "attach_your_certificate",
                    "workscope_address",
                    "Business_name",
                    "Home_address",
                    "location",
                    "skills",
                    "year_of_experience",
                  ]);
              
                  // Add sample data
                  worksheet.addRow([
                    "5-10-2024 12:38:25",
                    "SAMUEL SESAY",
                     "088314766" ,
                     "Male",
                    "Voter's ID",
                    "https://drive.google.com/open?id=13ma9b3ibCjoKd3IdewtY8iivxt-A9AZl",
                    "Rokel Village, Check Point",
                    "No",
                    "Waterloo banga farm sesay street",
                    "Freetown- West",
                    "Plumbing",
                    "0",
                  ]);
              
                  // Set response headers for Excel download with the filename
                  res.setHeader(
                    "Content-Type",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  );
                  res.setHeader(
                    "Content-Disposition",
                    "attachment; filename=sample_sheet.xlsx"
                  );
              
                  // Send the Excel file as a response
                  await workbook.xlsx.write(res);
                  res.end();
                  console.log("Excel file sent");
                } catch (error) {
                  console.error("Error sending Excel file:", error);
                  res.status(500).send("Internal Server Error");
                }
              };

              
              // Api for import fixit_finder data

              const import_file = async (req, res) => {
                try {
                  const workbook = new ExcelJs.Workbook();
                  await workbook.xlsx.readFile(req.file.path);
              
                  const worksheet = workbook.getWorksheet(1);
                  const requiredHeaders = [
                    "Timestamp",
                    "FullName",
                    "phone_no",
                    "Gender",
                    "nationality_or_voter_id",
                    "attach_your_certificate",
                    "workscope_address",
                    "Business_name",
                    "Home_address",
                    "location",
                    "skills",
                    "year_of_experience",
                  ];
              
                  // Validate headers
                  const actualHeaders = [];
                  worksheet.getRow(1).eachCell((cell, colNumber) => {
                    actualHeaders.push(cell.value);
                  });
              
                  const isValidHeaders = requiredHeaders.every(
                    (header, index) => header === actualHeaders[index]
                  );
              
                  if (!isValidHeaders) {
                    return res.status(400).json({
                      success: false,
                      error: "use sample file format to import the data",
                    });
                  }
              
                  const fileData = [];
                  const phoneNumbers = new Set();
              
                  worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber !== 1) {
                      // Skip the header row
                      const rowData = {
                        timeStamp: row.getCell(1).value,
                        FullName: row.getCell(2).value,
                        phone_no: row.getCell(3).value,
                        Gender: row.getCell(4).value,
                        nationality_or_voter_id: row.getCell(5).value,
                        attach_your_certificate: row.getCell(6).value?.text || row.getCell(6).value?.hyperlink || '', 
                        workscope_address: row.getCell(7).value,
                        Business_name: row.getCell(8).value,
                        Home_address: row.getCell(9).value,
                        location: row.getCell(10).value,
                        skills: row.getCell(11).value,
                        year_of_experience: row.getCell(12).value,
                      };
              
                      if (!phoneNumbers.has(rowData.phone_no)) {
                        phoneNumbers.add(rowData.phone_no);
                        fileData.push(rowData);
                      }
                    }
                  });
              
                  const uniqueData = [];
                  for (const data of fileData) {
                    const existingRecord = await fixit_finder_model.findOne({ phone_no: data.phone_no });
                    if (!existingRecord) {
                      uniqueData.push(data);
                    }
                  }
              
                  if (uniqueData.length > 0) {
                    // Insert the unique data into the database
                    const insertedData = await fixit_finder_model.insertMany(uniqueData);
              
                    res.status(200).json({
                      success: true,
                      message: "Data imported successfully",
                      insertedData: insertedData,
                    });
                  } else {
                    res.status(200).json({
                      success: true,
                      message: "No new data to import",
                    });
                  }
                } catch (error) {
                  console.error(error);
                  res.status(500).json({
                    success: false,
                    error: "There was an error while importing data",
                  });
                }
              };
              

                                        /* job Title  skills section */
              
           // Api for add job Description

    const addJob_skills = async (req, res) => { 
    
            const { jobTitle , skill_Name } = req.body;
          
            try {
              const requiredFields = ["jobTitle" , "skill_Name"];
          
              for (const field of requiredFields) {
                if (!req.body[field]) {
                  return res
                    .status(400)
                    .json({
                      message: `Missing ${field.replace("_", " ")} field`,
                      success: false,
                    });
                }
              }
          
              // Check for skill_Name
              const existskill_Name = await jobSkills_Model.findOne({ jobTitle : jobTitle , skill_Name : skill_Name });
          
              if (existskill_Name) {
                return res
                  .status(400)
                  .json({ message: "skill_Name already exist ", success: false });
              }
          
              const newskill_Name = new jobSkills_Model({
                jobTitle: jobTitle,
                skill_Name : skill_Name

              });
              const savedskill_Name = await newskill_Name.save();
          
              return res
                .status(200)
                .json({
                  success: true,
                  message: ` ${skill_Name} , added successfully`,
                  
                });
            } catch (error) {
              console.error(error);
              return res
                .status(500)
                .json({
                  success: false,
                  message: `server error`,
                  error_message: error,
                });
            }
          };
         


    // Api for get all job skills

         

  const alljobSkills = async (req, res) => {
    try {
        // Fetch all jobSkills from the database
        const jobSkilss = await jobSkills_Model.find({});
        
        // Check if jobSkilss array is empty
        if (jobSkilss.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No jobSkilss found",
            });
        } else {
            // Map jobSkilss to required format
            const formattedjobSkilss = jobSkilss.map(jobT => ({
                jobTitle: jobT.jobTitle,
                jobSkilss: jobT.skill_Name,
                _id: jobT._id
            }));
            
            // Send formatted jobTitles as response
            res.status(200).json({
                success: true,
                message: "All jobSkilss",
                details: formattedjobSkilss
            });
        }
    } catch (error) {
        // Handle server error
        res.status(500).json({ success: false, message: "Server error", error_message: error.message });
    }
};


// Api for delete particular job skills
    

const deletejobskill = async (req, res) => {
    try {
      const jobskill_id = req.params.jobskill_id;
  
      // Check for jobskill existence
      const existingjobskill = await jobSkills_Model.findOne({ _id: jobskill_id });
      if (!existingjobskill) {
        return res.status(400).json({ success: false, error: `job skill not found` });
      }
  
      // Delete the job skill from the database
      await existingjobskill.deleteOne();
  
      res
        .status(200)
        .json({ success: true, message: "job skill deleted successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "server error", error_message : error.message });
    }
  };
           
 

  // Api for get skills
  

   const getJs = async( req , res )=>{
    try {
          const { jobTitle } = req.body
          // check for job Title
        if(!jobTitle)
            {
                return res.status(400).json({
                     success : false ,
                     message : 'job Title Required'
                })
            }

     // check for job Descreption for jobTItle
              const JS = await jobSkills_Model.find({
                      jobTitle : jobTitle
              })

              if(!JS)
                {
                    return res.status(400).json({
                         success : false ,
                         message :  `JOb Skills not found for the given jobTitle : ${jobTitle}`
                    })
                }


                return res.status(200).json({
                     success : true ,
                     message : 'JOB Skills',
                     Details : JS
                })

                    } catch (error) {
        return res.status(500).json({
             success : false ,
             message : 'server error',
             error_message : error.message
        })
    }
}



// Api for create and update basic labour tool for cms

const cms_labour_tool = async ( req , res )=> {

    try {
            
        const { Heading, Description } = req.body;
        
        // Check for exist cms labour tool
        const exist_cms_labour_tool = await cms_labour_tool_Model.findOne({ });

        if (exist_cms_labour_tool) {
            // Update existing section
            exist_cms_labour_tool.Heading = Heading;
            exist_cms_labour_tool.Description = Description;            
      
            await exist_cms_labour_tool.save();

            return res.status(200).json({
                success: true,
                message: 'Details updated successfully'
            });
        } else {
            // Check for Heading
            if (!Heading) {
                return res.status(400).json({
                    success: false,
                    message: 'Heading is required'
                });
            }

            // Check for Description
            if (!Description) {
                return res.status(400).json({
                    success: false,
                    message: 'Description is required'
                });
            }       
           

            // Add new Data
            const newData = new cms_labour_tool_Model({
              
                Heading: Heading,
                Description: Description,
               
            });

            await newData.save();

            return res.status(200).json({
                success: true,
                message: 'New Details created successfully'
            });
        }

    } catch (error) {
           return res.status(500).json({
             success : false ,
             message : 'server error',
             error_message :  error.message
           })
    }
        
}


// Api for get cms labour tool details

     const get_cms_labour_tool_details = async ( req , res) => {
           try {
                  const getDetails = await cms_labour_tool_Model.findOne({})

                  if(!getDetails)
                  {
                    return res.status(400).json({
                         success : false ,
                         message : 'Details not found'
                    })
                  }

                  return res.status(200).json({
                     success : true ,
                     message : 'cms Labour tool Details',
                     Details : getDetails
                  })
           } catch (error) {
              return res.status(500).json({
                 success : false ,
                 message : 'server error',
                 error_message : error.message
              })
           }
     }


     // Api for create and update cms online courses

           const cms_online_cources = async( req , res )=> {
            try {
                const { Heading, Description, Detailed_description, price } = req.body;
        
                // Check if a course with the same heading exists
                const exist_cms_online_courses = await cms_online_courses_Model.findOne({ Heading });
                if (exist_cms_online_courses) {
                    return res.status(400).json({
                        success: false,
                        message: 'Course already exists',
                    });
                }
        
                // Check for Detailed_description
                if (!Detailed_description) {
                    return res.status(400).json({
                        success: false,
                        message: 'Detailed description is required',
                    });
                }
        
                // Check for price
                if (!price) {
                    return res.status(400).json({
                        success: false,
                        message: 'Price is required',
                    });
                }
        
                // Initialize variables for image and presentation
                let image = req.file.filename
              
        
              
                // Add new data
                const newData = new cms_online_courses_Model({
                    Heading,
                    Description,
                    Detailed_description,
                    price,
                    image,
                    topic : []
                  
                });
        
                await newData.save();
        
                return res.status(200).json({
                    success: true,
                    message: 'New course added successfully',
                });
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message,
                });
            }
           }
              

    // Api for get cms online courses details
    const get_cms_online_courses_details = async ( req , res) => {
        try {
            // Fetch all courses
            const getDetails = await cms_online_courses_Model.find({});
    
            if (!getDetails || getDetails.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Details not found'
                });
            }
    
            // Use Promise.all to fetch enrolled users count for each course in parallel
            const courseDetailsWithEnrollment = await Promise.all(getDetails.map(async (course) => {
                const usersEnrolled = await courses_user_enroll_Model.find({
                    'courses.course_id': course._id
                });
    
                // Return course details with enrolled users count
                return {
                    _id: course._id,
                    Heading : course.Heading, 
                    Description: course.Description,
                    Detailed_description : course.Description,
                    Detailed_description : course.Description,
                    price : course.price,
                    image : course.image,
                    topic : course.topic,
                    status : course.status,
                    enrolled_users_count: usersEnrolled.length,
                    enrolled_users: usersEnrolled.map(user => ({
                        user_id :user._id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        phone_no: user.phone_no,
                        gender : user.gender
                    }))
                };
            }));
    
            return res.status(200).json({
                success: true,
                message: 'CMS online courses details with enrollment info',
                courses: courseDetailsWithEnrollment
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message
            });
        }
  }
   // Api for update particular online course details

   const update_online_course = async ( req , res )=> {
    try {
        const course_id = req.params.course_id;
        const { Heading, Description, Detailed_description, price } = req.body;

        // Check for course_id
        if (!course_id) {
            return res.status(400).json({
                success: false,
                message: 'Course ID required',
            });
        }

        // Check for course existence
        const course = await cms_online_courses_Model.findOne({ _id: course_id });
        if (!course) {
            return res.status(400).json({
                success: false,
                message: 'Course not found',
            });
        }

        // Update fields if provided in the request
        if (Heading) course.Heading = Heading;
        if (Description) course.Description = Description;
        if (Detailed_description) course.Detailed_description = Detailed_description;
        if (price) course.price = price;
    

        
        if(req.file)
            {
             course.image = req.file.filename
            }

        // Save the updated course
        await course.save();

        return res.status(200).json({
            success: true,
            message: 'Course details updated successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message,
        });
    }
}
   
       // Api to add topics and there details in the course
       const add_topics = async (req, res) => {
        try {
            const course_id = req.params.course_id;
            const { topic_name, topic_description } = req.body;
    
            // Validate course_id
            if (!course_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Course ID is required',
                });
            }
    
            // Find the course by ID
            const course = await cms_online_courses_Model.findOne({ _id: course_id });
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found',
                });
            }
    
            // Check for required fields
            const requiredFields = ['topic_name', 'topic_description'];
            for (let field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({
                        success: false,
                        message: `${field.replace('_', ' ')} is required`,
                    });
                }
            }

                                // Check if the topic already exists in the course
                    const existingTopic = course.topic.find(topic => topic.topic_name === topic_name);
                    if (existingTopic) {
                        return res.status(400).json({
                            success: false,
                            message: 'Topic with the same name already exists',
                        });
                    }
                
            // Handle file uploads
            const filePaths = [];
            const allowedFileTypes = [
                // Images
                'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'webp',
            
                // Documents
                'ppt', 'pdf', 'doc', 'docx', 'xlsx', 'odt', 'rtf', 'txt', 'csv', 'epub',
            
                // Videos
                'mp4', 'avi', 'mov', 'wmv', 'mkv', 'flv', '3gp',
            
                // Audio
                'mp3', 'wav', 'aac', 'ogg',
            
                // Compressed Files
                'zip', 'rar', '7z', 'tar.gz',
            
                // Others
                'json', 'xml', 'html', 'sql'
            ];
            
    
            // Function to get the file extension
            const getFileExtension = (filename) => {
                return filename.split('.').pop().toLowerCase();
            };
    
            // Check if files are provided
            if (req.files && req.files.length > 0) {
                for (let file of req.files) {
                    const extension = getFileExtension(file.originalname);
                    if (allowedFileTypes.includes(extension)) {
                        filePaths.push(file.filename); // Store the filename or path
                    } else {
                        return res.status(400).json({
                            success: false,
                            message: `Invalid file type: ${extension}. Allowed types are: ${allowedFileTypes.join(', ')}`
                        });
                    }
                }
            }
    
            // Create new topic object
            const newTopic = {
                topic_name,
                topic_description,               
                files: filePaths 
            };
    
            // Add new topic to the course
            course.topic.push(newTopic);
    
            // Save the updated course
            await course.save();
    
            return res.status(200).json({
                success: true,
                message: 'Topic added successfully in Course'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message,
            });
        }
    };
      

  // Api for update particular topic 
  const edit_topic = async (req, res) => {
    try {
        const course_id = req.params.course_id;
        const topic_id = req.params.topic_id;
        const { topic_name , topic_description } = req.body;

        // Validate course_id and topic_id
        if (!course_id) {
            return res.status(400).json({
                success: false,
                message: 'Course id Required',
            });
        }

        if (!topic_id) {
            return res.status(400).json({
                success: false,
                message: 'Topic id Required',
            });
        }

        // Find the course by ID
        const course = await cms_online_courses_Model.findOne({ _id: course_id });
        if (!course) {
            return res.status(400).json({
                success: false,
                message: 'Course not found',
            });
        }

        // Find the topic by ID
        const topic = course.topic.id(topic_id);
        if (!topic) {
            return res.status(400).json({
                success: false,
                message: 'Topic not found',
            });
        }

        // Check for required fields
        const requiredFields = ['topic_name', 'topic_description'];
        for (let field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({
                    success: false,
                    message: `${field.replace('_', ' ')} is required`,
                });
            }
        }   
       
        // Handle new file uploads
        const filePaths = [];
        const allowedFileTypes = [
            // Images
            'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'webp',
        
            // Documents
            'ppt', 'pdf', 'doc', 'docx', 'xlsx', 'odt', 'rtf', 'txt', 'csv', 'epub',
        
            // Videos
            'mp4', 'avi', 'mov', 'wmv', 'mkv', 'flv', '3gp',
        
            // Audio
            'mp3', 'wav', 'aac', 'ogg',
        
            // Compressed Files
            'zip', 'rar', '7z', 'tar.gz',
        
            // Others
            'json', 'xml', 'html', 'sql'
        ];
        

        // Function to get the file extension
        const getFileExtension = (filename) => {
            return filename.split('.').pop().toLowerCase();
        };

        // Check if new files are provided
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const extension = getFileExtension(file.originalname);
                if (allowedFileTypes.includes(extension)) {
                    filePaths.push(file.filename); 
                } else {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid file type: ${extension}. Allowed types are: ${allowedFileTypes.join(', ')}`
                    });
                }
            }
        }

        // Update the topic fields
        topic.topic_name = topic_name;
        topic.topic_description = topic_description;       
        topic.files.push(...filePaths); 

        // Save the updated course
        await course.save();

        // Update the same topic in user_enrolled_course_toic_quiz_manage_Model
        const updateResult = await user_enrolled_course_toic_manage_Model.updateMany(
            {
                course_id: course_id,
                'topic._id': topic_id  
            },
            {
                $set: {
                    'topic.$.topic_name': topic_name,
                    'topic.$.topic_description': topic_description,
                    ...(filePaths.length > 0 && { 'topic.$.files': filePaths })
                }
            }
        );
        
           

        return res.status(200).json({
            success: true,
            message: 'Topic updated successfully',
          
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message,
        });
    }
};


       // Api for get all topics of course
       const all_topics_of_course = async (req, res) => {
        try {
            const course_id = req.params.course_id;
            if (!course_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Course Id Required'
                });
            }
    
            // Check for the course
            const course = await cms_online_courses_Model.findOne({ _id: course_id });
            if (!course) {
                return res.status(400).json({
                    success: false,
                    message: 'Course not found'
                });
            }
    
            // Extract topics from the course
            const topics = course.topic;
            const topicsWithQuizzes = [];
    
            // Check for quizzes for each topic
            for (const topic of topics) {
                const quiz = await online_course_quiz_Model.findOne({ topic_id: topic._id });
                // Create a new object for the topic with quizExists key
                const topicWithQuiz = {
                    ...topic.toObject(), // Convert Mongoose document to plain object
                    quizExists: quiz ? 1 : 0 // Add quiz existence status
                };
                topicsWithQuizzes.push(topicWithQuiz);
            }
    
            return res.status(200).json({
                success: true,
                message: 'All Topics of the Course',
                all_topics: topicsWithQuizzes // Array of topics with quiz existence status
            });
    
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message
            });
        }
    } 
      // Api for update particular question
      const update_question_of_quiz = async (req, res) => {
        const { test_id, questionId } = req.params;
        const { question, options, correct_answer } = req.body;
    
        try {
            // Check for test_id
            if (!test_id) {
                return res.status(400).json({
                    success: false,
                    message: 'test_id is required',
                });
            }
    
            // Check for questionId
            if (!questionId) {
                return res.status(400).json({
                    success: false,
                    message: 'questionId is required',
                });
            }
    
            // Check for test existence
            const exist_test = await online_course_quiz_Model.findById(test_id);
            if (!exist_test) {
                return res.status(400).json({
                    success: false,
                    message: 'Test does not exist',
                });
            }
    
            // Find the question by ID in the test
            const questionIndex = exist_test.questions_Bank.findIndex(
                (q) => q._id.toString() === questionId
            );
    
            if (questionIndex === -1) {
                return res.status(400).json({
                    success: false,
                    message: 'Question not found',
                });
            }
    
           
    
            // Check if options array has at least 2 options
            if (!Array.isArray(options) || options.length < 2) {
                return res.status(400).json({
                    success: false,
                    message: 'Options must be an array with at least 2 options',
                });
            }
    
            // Check for duplicate option names (case insensitive)
            const optionNames = options.map(option => option.option_name.toLowerCase());
            const hasDuplicates = optionNames.some((item, index) => optionNames.indexOf(item) !== index);
            if (hasDuplicates) {
                return res.status(400).json({
                    success: false,
                    message: 'Options must not contain duplicate names',
                });
            }
    
            // Check if the correct answer matches one of the options
            const validCorrectAnswer = options.find(option => option.option_name === correct_answer);
            if (!validCorrectAnswer) {
                return res.status(400).json({
                    success: false,
                    message: 'Correct answer must be one of the provided options',
                });
            }
    
            // Check for duplicate question in the test (excluding the current question being updated)
            const duplicate_question = exist_test.questions_Bank.find(
                (q, index) => q.question === question && index !== questionIndex
            );
            if (duplicate_question) {
                return res.status(400).json({
                    success: false,
                    message: 'A similar question already exists in the test',
                });
            }
    
            // Update the question in the questions_Bank array
            exist_test.questions_Bank[questionIndex] = {
                question,
                options,
                correct_answer,
            };
    
            // Save the updated test
            await exist_test.save();
    
            // Update question in the user_enrolled_course_topic_quiz_manage_Model as well
            await user_enrolled_course_toic_quiz_manage_Model.updateMany(
                { topic_id: exist_test.topic_id, "questions_Bank._id": questionId },
                {
                    $set: {
                        "questions_Bank.$.question": question,
                        "questions_Bank.$.options": options,
                        "questions_Bank.$.correct_answer": correct_answer,
                    },
                }
            );
    
            return res.status(200).json({
                success: true,
                message: 'Question updated successfully',
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message,
            });
        }
    };
    // Api for delete particlar topic from the course

               const delete_course_topic = async ( req , res)=> {
                  try {
                         const {course_id  , topic_id } = req.params
                         // check for course_id
                         if(!course_id)
                         {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'Course Id Required'
                            })
                         }

                         // check for topic_id
                         if(!topic_id)
                         {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'Topic Id Required'
                            })
                         }

                         // check for course
                         const course = await cms_online_courses_Model.findOne({ _id : course_id })
                         if(!course)
                         {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'Course not found'
                            })
                         }

                         // check for topic

                         const topics = course.topic.findIndex(topic => topic._id.toString() === topic_id)
                          if(!topics)
                          {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'Topic not found'
                            })
                          }

                          course.topic.splice(topics, 1);
                          await course.save()
                          await user_enrolled_course_toic_manage_Model.updateMany(
                            {
                                course_id: course_id,
                                'topic._id': topic_id
                            },
                            {
                                $pull: {
                                    topic: { _id: topic_id }
                                }
                            }
                        );
                        
                          return res.status(200).json({
                             success : true ,
                             message : 'Topic Deleted successfully'
                          })

                        } catch (error) {
                      return res.status(500).json({
                         success : false ,
                         message : 'Server error',
                         error_message : error.message
                      })
                  }
               }


 // Api for delete particular online course
 const delete_course = async ( req , res)=> {
    try {
            const course_id  = req.params.course_id
               // check for course_id
    if(!course_id)
        {
              return res.status(400).json({
                 success : false ,
                 message : 'course Id required'
              })
        }

        // check for course
        const course = await cms_online_courses_Model.findOne({ _id : course_id })
        if(!course)
        {
             return res.status(400).json
             ({
                 success : false ,
                 message : 'Course not found'
             })
        }

        await course.deleteOne()

        return res.status(200).json({
               success : true ,
               message : 'course deleted successfully'
        })
            
    } catch (error) {
         return res.status(500).json({
             success : false 
         })
    }
}
  // Api for create and update Cms Home section

         const cms_Home = async( req , res )=> {
            try {
            
                const { Heading, Description } = req.body;
                
                // Check for exist cms Home
                const exist_cms_Home = await cms_home_Model.findOne({ });
        
                if (exist_cms_Home) {
                    // Update existing section
                   
                    exist_cms_Home.Description = Description;            
              
                    await exist_cms_Home.save();
        
                    return res.status(200).json({
                        success: true,
                        message: 'Details updated successfully'
                    });
                } else { 
                   
                    // Check for Description
                    if (!Description) {
                        return res.status(400).json({
                            success: false,
                            message: 'Description is required'
                        });
                    }       
                   
        
                    // Add new Data
                    const newData = new cms_home_Model({                      
                       
                        Heading: Heading,
                        Description: Description,
                    });
        
                    await newData.save();
        
                    return res.status(200).json({
                        success: true,
                        message: 'New Details created successfully'
                    });
                }
        
            } catch (error) {
                   return res.status(500).json({
                     success : false ,
                     message : 'server error',
                     error_message :  error.message
                   })
            }
         }
              

          // Api for get cms home
            
          const get_cms_Home = async ( req , res) => {
            try {
                   const getDetails = await cms_home_Model.findOne({})
    
                   if(!getDetails)
                   {
                     return res.status(400).json({
                          success : false ,
                          message : 'Details not found'
                     })
                   }
    
                   return res.status(200).json({
                      success : true ,
                      message : 'cms Home details',
                      Details : getDetails
                   })
            } catch (error) {
               return res.status(500).json({
                  success : false ,
                  message : 'server error',
                  error_message : error.message
               })
            }
      }
    

// Function to improve spacing and readability in text
const improveTextFormatting = (text) => {
    text = text.replace(/([.,!?;:])(?=\S)/g, '$1 ');
    text = text.replace(/(\S)([.,!?;:])(\S)/g, '$1$2 $3');
    text = text.replace(/([a-zA-Z])\.(?=\S)/g, '$1. ');
    text = text.replace(/\s{2,}/g, ' ');
    text = text.replace(/([A-Z][A-Z\s]+)(\n|$)/g, '\n\n$1\n');
    return text.trim();
};

// Function to parse PDF CV
const parsePDF = async (filePath) => {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    
    let parsedText = data.text;

    parsedText = parsedText.replace(/(\.)(\s)/g, '$1\n\n');
    parsedText = parsedText.replace(/(\.)(\n)/g, '$1\n\n');
    parsedText = improveTextFormatting(parsedText);

    return parsedText;
};

// Function to calculate the match percentage
const calculateMatchPercentage = (cvText, jdText) => {
    const tokenizer = new natural.WordTokenizer();
    const cvTokens = tokenizer.tokenize(cvText.toLowerCase());
    const jdTokens = tokenizer.tokenize(jdText.toLowerCase());

    const cvWordFreq = new natural.TfIdf();
    cvWordFreq.addDocument(cvTokens);

    const jdWordFreq = new natural.TfIdf();
    jdWordFreq.addDocument(jdTokens);

    let matchCount = 0;

    jdTokens.forEach((word) => {
        if (cvWordFreq.tfidf(word, 0) > 0) {
            matchCount++;
        }
    });

    let matchPercentage = (matchCount / jdTokens.length) * 100;

    if (matchPercentage < 35) {
        matchPercentage += 10;
    } else if (matchPercentage >= 35 && matchPercentage < 50) {
        matchPercentage += 5;
    }

    return matchPercentage.toFixed(2);
};

const candidate_cv_rating = async (req, res) => {
    try {
        const candidate_id = req.params.candidate_id;

        if (!candidate_id) {
            return res.status(400).json({ success: false, message: 'Candidate ID required' });
        }

        const candidate = await appliedjobModel.findOne({ _id: candidate_id });
        if (!candidate) {
            return res.status(400).json({ success: false, message: 'Candidate not found' });
        }

        const candidate_cv = candidate.uploadResume;

        if (!candidate_cv) {
            return res.status(400).json({ success: false, message: 'Candidate CV not found' });
        }

        const check_Jd = await jobDescription_model.findOne({ jobTitle: candidate.job_Heading });
        if (!check_Jd) {
            return res.status(400).json({ success: false, message: 'No Job Description found' });
        }

        const job_description = check_Jd.job_Description || '';
        const job_responsibility = check_Jd.Responsibilities || '';
        let combine_jd = `${job_description} \n\n ${job_responsibility}`;
        combine_jd = improveTextFormatting(combine_jd);

        const candidateCvPath = path.join(__dirname, '..', 'uploads', candidate_cv);
        if (!fs.existsSync(candidateCvPath)) {
            return res.status(400).json({ success: false, message: 'Candidate CV file not found on server' });
        }

        // Parse the PDF CV
        let cvText = await parsePDF(candidateCvPath);
        cvText = improveTextFormatting(cvText);

        // Calculate the match percentage
        const matchPercentage = calculateMatchPercentage(cvText, combine_jd);

        return res.status(200).json({
            success: true,
            matchPercentage: matchPercentage,
            message: 'CV rating calculated successfully',
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message,
        });
    }
};


   // Api for get all enq of courses
       
   const all_enq_of_courses = async( req , res )=> {
    try {
             // check for all enq
             const all_enq = await online_courses_enq_model.find({ }).sort({ createdAt : -1}).lean()
             if(!all_enq)
             {
                  return res.status(400).json({
                       success : false ,
                       message : 'No Enquiry Generated Yet'
                  })
             }

             return res.status(200).json({
                 success : true ,
                 message : 'All Enquiry courses',
                 all_enq : all_enq
             })
    } catch (error) {
          return res.status(500).json({
             success : false ,
             message : 'Server error',
             error_message : error.message
          })
    }
}


    
                                                           /* Online Courses Quiz section */

   
    // Api for create quiz test for course
    const course_quiz_test = async (req, res) => {
        try {
            const { course_id } = req.params;
            const { topic_id, question, options, correct_answer } = req.body;
        
            // Validate course_id
            if (!course_id) {
              return res.status(400).json({
                success: false,
                message: "Course ID is required",
              });
            }
        
            // Fetch the course by course_id
            const course = await cms_online_courses_Model.findById(course_id);
            if (!course) {
              return res.status(404).json({
                success: false,
                message: "Course not found",
              });
            }
        
            // Find the course topic
            const course_topic = course.topic.find((top) => top._id.toString() === topic_id);
            if (!course_topic) {
              return res.status(404).json({
                success: false,
                message: "Topic not found",
              });
            }
        
            // Check if the test already exists
            const exist_test = await online_course_quiz_Model.findOne({ course_id, topic_id });
            if (exist_test) {
              return res.status(400).json({
                success: false,
                message: "Test already exists",
              });
            }
        
            // Validate question
            if (!question || typeof question !== "string" || question.trim() === "") {
              return res.status(400).json({
                success: false,
                message: "Question is required and must be a non-empty string",
              });
            }
        
            // Validate options array
            if (!Array.isArray(options) || options.length < 2) {
              return res.status(400).json({
                success: false,
                message: "Options array is required and must contain at least 2 options",
              });
            }
        
            // Ensure each option is an object with option_name
            for (const option of options) {
              if (!option.option_name || typeof option.option_name !== 'string' || option.option_name.trim() === "") {
                return res.status(400).json({
                  success: false,
                  message: "Each option must have a valid option_name",
                });
              }
            }
        
            // Validate correct_answer by comparing it with option_name (case-insensitive and trimmed)
            const isCorrectAnswerValid = options.some(option => 
              option.option_name.trim().toLowerCase() === correct_answer.trim().toLowerCase()
            );
        
            if (!isCorrectAnswerValid) {
              return res.status(400).json({
                success: false,
                message: "Correct answer must be one of the options",
              });
            }
        
            // Create a new quiz test for the course
            const new_quiz_test = new online_course_quiz_Model({
              course_id,
              topic_id,
              course_name: course.Heading,
              topic_name: course_topic.topic_name,
              questions_Bank: [{ question, options, correct_answer }],
            });
        
            // Save the new quiz test
            await new_quiz_test.save();
        
            return res.status(200).json({
              success: true,
              message: "New Quiz Test created successfully",
              test_id: new_quiz_test._id,
            });
          } catch (error) {
            // Catch and respond with server error
            return res.status(500).json({
              success: false,
              message: "Server Error",
              error_message: error.message,
            });
          }
      };
      


      // Api for get test of course

      const get_quiz_test_of_course = async (req, res) => {
        try {
          const { test_id } = req.params;
          
          // Check if test_id is provided
          if (!test_id) {
            return res.status(400).json({
              success: false,
              message: 'Test ID is required',
            });
          }
      
          // Fetch quiz test from the database
          const quiz_test = await online_course_quiz_Model.findById(test_id);
      
          // Check if quiz test exists
          if (!quiz_test) {
            return res.status(400).json({
              success: false,
              message: 'Quiz test not found',
            });
          }


      
          // Destructure required fields from the quiz_test object
          const { _id, course_id, questions_Bank , topic_id , course_name , topic_name} = quiz_test;
      
          return res.status(200).json({
            success: true,
            message: 'Quiz Test Details',
            quiz_test: {
              test_id: _id,
              course_id: course_id,
              topic_id : topic_id ,
              course_name : course_name,
              topic_name : topic_name,
              questions_Bank: questions_Bank,
            },
          });
        } catch (error) {
          console.error('Error fetching quiz test:', error);
          return res.status(500).json({
            success: false,
            message: 'Server error',
          });
        }
      };
      

   

      // Api for get particular course Quiz

           const course_quiz = async( req , res)=> {
               try {
                        const course_id  = req.params.course_id
                     // check for course_id
                     if(!course_id)
                     {
                        return res.status(400).json({
                             success : false ,
                             message : 'Course ID Reqired'
                        })
                     }
                     // check for course
                        const course = await cms_online_courses_Model.findOne({ _id : course_id })
                        if(!course)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'Course Not Found'
                            })
                        }

                        // check for all quiz test of course
                        const all_quiz_test = await online_course_quiz_Model.find({ course_id }).sort({ createdAt : -1 }).lean()
                        if(!all_quiz_test)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'No Quiz Test Found for the course'
                            })
                        }

                        return res.status(200).json({
                             success : true ,
                             message : 'All Quiz Test of Course',
                             detail : all_quiz_test
                        })
               } catch (error) {
                   return res.status(500).json({
                        success : false ,
                        message : 'Server error',
                        error_message : error.message
                   })
               }
           }


  // Api for add Question in particular test
      const addQuestion_in_Quiz_test = async ( req , res )=> {
        try {
            const test_id = req.params.test_id;
            const { question, options, correct_answer } = req.body;
    
            // Check for test_id
            if (!test_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Test Id is required',
                });
            }
    
            // Find the test by ID
            const test = await online_course_quiz_Model.findOne({ _id: test_id });
            if (!test) {
                return res.status(400).json({
                    success: false,
                    message: 'Test not found',
                });
            }
    
            // Validate question input
            if (!question || !options || !correct_answer) {
                return res.status(400).json({
                    success: false,
                    message: 'Question, options, and correct answer are required',
                });
            }
    
            // Check if options array has at least 2 options
            if (!Array.isArray(options) || options.length < 2) {
                return res.status(400).json({
                    success: false,
                    message: 'Options must be an array and should have at least 2 options',
                });
            }
                
            // Check for duplicate option_names (case insensitive)
            const optionNames = options.map(option => option.option_name.toLowerCase());
            const hasDuplicates = optionNames.some((item, index) => optionNames.indexOf(item) !== index);
    
            if (hasDuplicates) {
                return res.status(400).json({
                    success: false,
                    message: 'Options must not contain duplicate names',
                });
            }
            // Check if the correct answer matches one of the options
            const validCorrectAnswer = options.find(
                (option) => option.option_name === correct_answer
            );
    
            if (!validCorrectAnswer) {
                return res.status(400).json({
                    success: false,
                    message: 'Correct answer must be one of the provided options',
                });
            }
    
            // Check for duplicate question
            const duplicate_question = test.questions_Bank.find(
                (questionObj) => questionObj.question === question
            );
    
            if (duplicate_question) {
                return res.status(400).json({
                    success: false,
                    message: 'Question already exists in the test',
                });
            }
    
            // Add new question to questions_Bank
            test.questions_Bank.push({
                question,
                options,
                correct_answer,
            });
    
    
            // Save the updated test with new question
            await test.save();
    
            // Update user_enrolled_course_toic_quiz_manage_Model
            await user_enrolled_course_toic_quiz_manage_Model.updateMany(
                { topic_id: test.topic_id },
                { $push: { questions_Bank: { question, options, correct_answer } } }
            );
    
            
    
            return res.status(200).json({
                success: true,
                message: 'Question added successfully',
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message,
            });
        }
      }
  
    // Api for delete Question in test
    const delete_question_in_test = async (req, res) => {
        const { test_id, questionId } = req.params;
    
        try {
            // Check for test_id
            if (!test_id) {
                return res.status(400).json({
                    success: false,
                    message: 'test_id Required'
                });
            }
            
            // Check for questionId
            if (!questionId) {
                return res.status(400).json({
                    success: false,
                    message: 'questionId Required'
                });
            }
    
            // Check for test existence
            const exist_test = await online_course_quiz_Model.findById(test_id);
            if (!exist_test) {
                return res.status(400).json({
                    success: false,
                    message: 'Test does not exist',
                });
            }
    
            // Check for question existence in the test
            const questionIndex = exist_test.questions_Bank.findIndex(
                (question) => question._id.toString() === questionId
            );
    
            if (questionIndex === -1) {
                return res.status(400).json({
                    success: false,
                    message: 'Question not found',
                });
            }
    
            // Remove question from the question bank
            exist_test.questions_Bank.splice(questionIndex, 1);
    
            // Save updated test data
            await exist_test.save();

             // Remove the question from user_enrolled_course_toic_quiz_manage_Model
        await user_enrolled_course_toic_quiz_manage_Model.updateMany(
            { topic_id: exist_test.topic_id },
            { $pull: { questions_Bank: { _id: questionId } } }
        );
    
            return res.status(200).json({
                success: true,
                message: 'Question deleted successfully',
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message,
            });
        }
    };
    

      // Api for Delete test

      const delete_test = async ( req , res)=> {
           try {
                   const test_id = req.params.test_id
                   // check for test_id
                   if(!test_id)
                   {
                    return res.status(400).json({
                         success : false ,
                         message : 'Test Id Required'
                    })
                   }

                   // check for test
                   const test = await online_course_quiz_Model.findOne({ _id : test_id })
                   if(!test)
                   {
                    return res.status(400).json({
                         success : false ,
                         message : 'Test Not Found'
                    })
                   }

                      await test.deleteOne()
                      return res.status(200).json({
                         success : true ,
                         message : 'Test Deleted successfully'
                      })
           } catch (error) {
               return res.status(500).json({
                      success : false ,
                      message : 'Server error',
                      error_message : error.message
               })
           }
      }
      

                                                             /* Transaction section */

        // Api for get all courses Transaction

           const get_transaction = async ( req , res )=> {
                 try {
                        
                         // check for all transaction 
                         const all_transaction = await course_transaction_model.find({ }).sort({ createdAt :  -1 }).lean()
                         if(!all_transaction)
                         {
                            return res.status(400).json({
                                  success : false ,
                                  message : 'No Transaction Done yet ..!'
                            })
                         }

                         return res.status(200).json({
                               success : true ,
                               message : 'ALL transaction',
                               all_transaction : all_transaction
                         })

                         
                 } catch (error) {
                      return res.status(500).json({
                            success : false ,
                            message : 'Server error',
                            error_message : error.message
                      })
                 }
           }
            

// Api for get all courses
const get_all_courses_details = async (req, res) => {
    try {
        // Fetch all courses
        const getDetails = await cms_online_courses_Model.find({});

        if (!getDetails || getDetails.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Details not found'
            });
        }

        const user_id = req.query.user_id; 
        // Use Promise.all to fetch enrolled users count for each course in parallel
        const courseDetailsWithEnrollment = await Promise.all(getDetails.map(async (course) => {
            const usersEnrolled = await courses_user_enroll_Model.find({
                'courses.course_id': course._id
            });

            const course_quiz = await online_course_quiz_Model.find({
                course_id : course._id
   
            })
        
            // Check if the given user is enrolled in this course
            const isUserEnrolled = usersEnrolled.some(user => user._id.toString() === user_id);

            // Return course details with enrolled users count and user enrollment status
            return {
                _id: course._id,
                Heading: course.Heading,
                Description: course.Description,
                Detailed_description: course.Detailed_description,
                price: course.price,
                image: course.image,
                topic: course.topic,
                status: course.status,
              //  enrolled_users_count: usersEnrolled.length,
                is_user_enroll: isUserEnrolled ? 1 : 0 ,
                number_of_quiz : course_quiz.length
            };
        }));

        return res.status(200).json({
            success: true,
            message: 'CMS online courses details with enrollment info',
            courses: courseDetailsWithEnrollment
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};


// Api for job seeker count of client jobs
const jobseeker_count_of_client_job = async (req, res) => {
    try {
        const clientId = req.params.clientId
        //check for client Id
        if(!clientId)
        {
            return res.status(400).json({
                   success : false ,
                   message : 'Client Id required'
            })
        }

        // check for client
        const client = await employeeModel.findOne({ _id : clientId })
        if(!client)
        {
            return res.status(400).json({
                   success : false ,
                   message : 'Client Not Found'
            })
        }

           // check for all jobs of client 
           const all_jobs = await jobModel.find({ emp_Id : clientId
            })
            if(!all_jobs)
            {
                return res.status(400).json({
                      success : false ,
                      message : 'No job Found for the client'
                })
            }
                  const jobIds = all_jobs.map(job => job.jobId)
                      
                        
            
      const check_all_jobseeker = await appliedjobModel.find({ jobId : { $in: jobIds }} );
       
         
      
      if (check_all_jobseeker.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No profile found'
        });
      }
  
      // Count job seekers by status
      const pending_count = check_all_jobseeker.filter(job => job.jobSeeker_status === 1).length;
      const schedule_count = check_all_jobseeker.filter(job => job.jobSeeker_status === 2).length;
      const assessment_count = check_all_jobseeker.filter(job => job.jobSeeker_status === 3).length;
      const HR_Discussion_count = check_all_jobseeker.filter(job => job.jobSeeker_status === 4).length;
      const complete_count = check_all_jobseeker.filter(job => job.jobSeeker_status === 5).length;
      const shortlisted_count = check_all_jobseeker.filter(job => job.jobSeeker_status === 6).length;
      const rejected_count = check_all_jobseeker.filter(job => job.jobSeeker_status === 7).length;
  
      return res.status(200).json({
        success: true,
        message: 'Details',
        pending_count,
        schedule_count,
        assessment_count,
        HR_Discussion_count,
        complete_count,
        shortlisted_count,
        rejected_count
      });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error_message: error.message
      });
    }
  }


  // Api for create email template
           const create_email_template = async( req , res)=> {
               try {
                      const { email_title , email_subject , email_body } = req.body
                      // check for email template
                        const existTitleContent = await emailTemplateModel.findOne({ email_title : email_title })
                        if(existTitleContent)
                        {
                            existTitleContent.email_title = email_title
                            existTitleContent.email_subject = email_subject
                            existTitleContent.email_body = email_body
                             await existTitleContent.save()

                             return res.status(200).json({
                                   success : true ,
                                   message : `Email Template Update for ${email_title} `
                             })
                        }
                        else
                        {
                                if(!email_title)

                                    {
                                        return res.status(400).json({
                                              success : false ,
                                              message : 'email title Required'
                                        })
                                    }
                                if(!email_subject)

                                    {
                                        return res.status(400).json({
                                              success : false ,
                                              message : 'email Subject Required'
                                        })
                                    }
                                if(!email_body)

                                    {
                                        return res.status(400).json({
                                              success : false ,
                                              message : 'email Body Required'
                                        })
                                    }

                                    // add new email template

                                    const new_email_template = new emailTemplateModel({
                                            email_title,
                                            email_subject,
                                            email_body
                                    })

                                    await new_email_template.save()

                                    return res.status(200).json({
                                          success : true ,
                                          message : `Email Template Created for ${email_title}`
                                    })
                        }


                      
               } catch (error) {
                   return res.status(500).json({
                       success : false ,
                       message : 'Server error',
                       error_message : error.message
                   })
               }
           }

           // check for get all email contents
           const getall_emailContent = async( req , res)=> {
                try {
                        // check for email contents
                        const emailContents = await emailTemplateModel.find({ }).sort({ createdAt  : -1}).lean()
                        if(!emailContents)
                        {
                            return res.status(400).json({
                                  success : false ,
                                  message : 'Email Contents not Found'
                            })
                        }

                        return res.status(200).json({
                              success : true ,
                              message : 'Email Contents',
                              emailContents : emailContents.map((e)=>({
                                       email_title : e.email_title,
                                       email_subject : e.email_subject,
                                       email_body : e.email_body
                              }))
                        })
                } catch (error) {
                      return res.status(500).json({
                          success : false ,
                          message : 'Server error',
                          error_message : error.message
                      })
                }
           }
              
    // check for email content of email title
    const emailContent_of_title = async( req , res)=> {
            try {
                     const email_title = req.params.email_title
                     if(!email_title)
                     {
                        return res.status(400).json({
                              success : false ,
                              message : 'email Title Required'
                        })
                     }

                     // check for email content 
                     const emailContent = await emailTemplateModel.findOne({ email_title })
                     if(!emailContent)
                     {
                        return res.status(400).json({
                               success : false ,
                               message : `No email Template Found for  ${email_title}`
                        })
                     }

                     return res.status(200).json({
                           sucess : true ,
                           message : 'Email template',
                           template : {
                                   email_title : emailContent.email_title,
                                   email_subject : emailContent.email_subject,
                                   email_body : emailContent.email_body
                           }
                     })
            } catch (error) {
                  return res.status(500).json({
                      success : false ,
                      message : 'Server error',
                      error_message : error.message
                  })
            }
    }
                

     // Api for create client package         

     const add_clientPackage = async (req, res) => {
        try {
            const { package_name, features, duration , price , package_type , price_with_gst } = req.body;
    
            // Validate required fields
            const requiredFields = ['package_name', 'features' , 'price' , 'duration'];
            for (let field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({
                        success: false,
                        message: `Required ${field.replace('_', ' ')}`,
                    });
                }
            }                        
    
            // Check if package already exists (case-insensitive)
            const existPackage = await clientPackageModel.findOne({
                package_name: { $regex: `^${package_name}$`, $options: 'i' },
                package_type : package_type
            });
    
            if (existPackage) {
                return res.status(400).json({
                    success: false,
                    message: `Package '${package_name}' already exists`,
                });
            }
                   let newPackage

                        if(package_type === 'Yearly')
                        {
                                        // Create and save new package with package_type
                                       
                         newPackage = new clientPackageModel({
                            package_name,
                            features,
                            price,
                            duration,
                            package_type: package_type
                        });
    
                                  
                        }
                        else
                        {
                               // Create and save new package with package_type
                               newPackage  = new clientPackageModel({
                                    package_name,
                                    duration,
                                    features,
                                    price,
                                    price_with_gst,
                                    package_type: package_type,

                                });
                        
                               
                        }
    
                        await newPackage.save();
    
            return res.status(200).json({
                success: true,
                message: 'New package added successfully',
              
            });
        } catch (error) {
            console.error("Error in add_clientPackage:", error);
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message,
            });
        }
    };
    

  // Api for get all packages
          const get_allPackages = async( req , res)=> {
                try {
                      
                     

                         const getYearlyPackages = await clientPackageModel.find({  package_type : 'Yearly'}).sort({ createdAt : -1}).lean()
                         const getWeeklyPackages = await clientPackageModel.find({  package_type : 'Weekly'}).sort({ createdAt : -1}).lean()

                         return res.status(200).json({
                               success : true ,
                               message : 'All packages',
                               yearly_packages : getYearlyPackages.map((e)=> ({
                                        package_id : e._id,
                                        package_name : e.package_name ,
                                        features : e.features,                                       
                                        package_type : e.package_type,
                                        price : `${e.price}/${e.duration}`,                                       
                                        status : e.status
                               })),
                               weekly_packages : getWeeklyPackages.map((e)=> ({
                                        package_id : e._id,
                                        package_name : e.package_name ,
                                        features : e.features,                                    
                                        package_type : e.package_type,
                                        price : `${e.price} -- (${e.duration})`,
                                        price_with_gst : `${e.price_with_gst} -- (${e.duration})`,
                                        status : e.status
                               }))
                         })

                } catch (error) {
                      return res.status(500).json({
                          success : false ,
                          message : 'Server error',
                          error_message : error.message
                      })
                }
          }

          // Api for active inactive package

             const active_inactive_Package = async( req , res)=> {
                    try {
                           const { package_id } = req.params
                           // check for packageId
                           if(!package_id)
                           {
                              return res.status(400).json({
                                   success : false ,
                                   message : 'Package Id Required'
                              })
                           }

                           // check for package
                           const package = await clientPackageModel.findOne({ _id : package_id })
                           if(!package)
                           {
                            return res.status(400).json({
                                  success :false ,
                                  message : 'Package Not Found'
                            })
                           }

                           let message = ''
                           if(package.status === 1)
                           {
                                package.status = 0,
                                message =  'Package Inactive Successfully'
                           }
                           else
                           {
                               package.status = 1,
                               message = 'Package Active Successfully'
                           }

                           await package.save()

                             return res.status(200).json({
                                   success : true ,
                                   message : message 
                             })
                    } catch (error) {
                          return res.status(500).json({
                               success : false ,
                               message : 'Server error',
                               error_message : error.message
                          })
                    }
             }


             // Api for update package
                  const updatepackage = async( req , res)=> {
                        try {
                              const { package_id } = req.params
                              const { package_name , features  , price , price_with_gst } = req.body
                                 // check for packageId
                           if(!package_id)
                            {
                               return res.status(400).json({
                                    success : false ,
                                    message : 'Package Id Required'
                               })
                            }
 
                            // check for package
                            const package = await clientPackageModel.findOne({ _id : package_id })
                            if(!package)
                            {
                             return res.status(400).json({
                                   success :false ,
                                   message : 'Package Not Found'
                             })
                            }

                              if(package_name)
                              {
                                   package.package_name = package_name
                              }
                              if(features)
                              {
                                   package.features = features
                              }
                              if(price)
                              {
                                   package.price = price       
                               }
                              if(price_with_gst)
                              {
                                   package.price_with_gst = price_with_gst       
                               }

                                        await package.save()

                                        return res.status(200).json({
                                              success : true ,
                                              message : 'Package Details Updated'
                                        })
                              
                        } catch (error) {
                             return res.status(500).json({
                                  success : false ,
                                  message : 'Server error',
                                  error_message : error_message
                             })
                        }
                  }

                  // Api for get all active packages
                    const getActivePackages = async( req , res)=> {
                        try {
                            const getYearlyPackages = await clientPackageModel.find({  package_type : 'Yearly'}).sort({ createdAt : -1}).lean()
                            const getWeeklyPackages = await clientPackageModel.find({  package_type : 'Weekly'}).sort({ createdAt : -1}).lean()
   
                          
                                        
                            return res.status(200).json({
                                  success : true ,
                                  message : 'All packages',
                                  yearly_packages : getYearlyPackages.map((e)=> ({
                                    package_id : e._id,
                                    package_name : e.package_name ,
                                    features : e.features,                                       
                                    package_type : e.package_type,
                                    price : `${e.price}/${e.duration}`,                                       
                                    status : e.status
                           })),
                           weekly_packages : getWeeklyPackages.map((e)=> ({
                                    package_id : e._id,
                                    package_name : e.package_name ,
                                    features : e.features,                                    
                                    package_type : e.package_type,
                                    price : `${e.price} -- (${e.duration})`,
                                    price_with_gst : `${e.price_with_gst} -- (${e.duration})`,
                                    status : e.status
                               }))
                            })

                   } catch (error) {
                         return res.status(500).json({
                             success : false ,
                             message : 'Server error',
                             error_message : error.message
                         })
                   }   

                    }
                    
module.exports = {
    login , getAdmin, updateAdmin , admin_ChangePassword , addStaff , getAll_Staffs , getAllEmp , active_inactive_emp ,
    active_inactive_job , getStaff_Details , updatestaff , staff_ChangePassword , getAllFemale_Candidate ,
    candidate_recruitment_process , active_inactive_Hr , send_notification_to_client , sendNotification_to_allClient,
    send_notification ,  create_services , getService ,  create_privacy_policy , get_admin_privacy_policy,
    create_term_condition , get_admin_term_condition , getAll_candidates , AdminforgetPassOTP , AdminverifyOTP , adminResetPass ,
    getAdminNotification , unseen_admin_notification_count ,seen_notification , get_FAQdetails , createFAQ , DeleteFAQ , get_contactUS, DeleteContactUS ,
    Overtime , leave_allowence , calculate_EOSB , net_salary , fav_job, get_All_favourite_jobs , addJob_skills , alljobSkills , deletejobskill ,
    getJs ,
            
                /* Report ad Aalysis */
    jobseeker_count , getclient_count , get_talent_pool_count , get_female_screened_count , jobseeker_count_city_wise ,
    
              /*  CMS PAGE */

     create_testimonial , getAll_testimonial , get_testimonial , update_testimonial , delete_testimonial,
     cms_job_posting_section1 , getJobs_posted_procedure_section1 , cms_need_any_job_section,
     get_cms_need_any_job_section , cms_post_your_job_section , get_cms_post_your_job , cms_job_market_data_section,
     get_cms_job_market_data , cms_blog_section1 , getcmsBlog_section1 ,cmsBlog_section2 , getBlogDetails ,
     update_cms_blog , deleteBlog , cmsHeadquarter , getcms_headquarter , cms_Hr_consultancy , getHr_consultancy_Details,
     cms_training_developement , get_training_development_Details , cms_recruitment_selection , get_recruitment_selection_Details,
     cms_employee_outsourcing , get_outsourcing_Details , cms_Hr_teleconsultation , get_hr_teleconsultation_Details , cms_our_mission ,
     get_ourMission_details , cms_aboutUs , get_aboutUS_details , cms_our_vission , get_ourVission_details , cms_our_commitment , get_ourCommitment_details ,
     cms_get_started_today , get_started_todayDetails , cms_why_choose_us , getDetails_why_choose_us , cms_elite_talent_pool , get_cms_elite_talent_pool,
     cms_footer_content , get_cms_footer_content , cms_acadmic_credentials_verifier , get_acadmic_credentials_verifier , newsLetter , getAll_newsLetter,
     new_carrer_advice , all_carrer_details , delete_carrer_advice , generate_sampleFile , import_file , cms_labour_tool , get_cms_labour_tool_details,
     cms_online_cources , get_cms_online_courses_details , cms_Home , get_cms_Home  , candidate_cv_rating ,
     update_online_course , delete_course , all_enq_of_courses ,

       
     course_quiz_test , get_quiz_test_of_course, course_quiz ,
      delete_question_in_test , delete_test, addQuestion_in_Quiz_test ,
     add_topics , delete_course_topic , all_topics_of_course , edit_topic , update_question_of_quiz,
     get_transaction , get_all_courses_details ,  jobseeker_count_of_client_job,

     create_email_template , getall_emailContent , emailContent_of_title ,
     add_clientPackage , get_allPackages , active_inactive_Package , updatepackage , getActivePackages

     
}