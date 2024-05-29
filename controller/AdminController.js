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
                message:   `${admin_and_staffs.role} login Successfully`,
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
                        {
                            profileImage = req.file.filename
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
                       role : 'super Admin'
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

                     const profileImage = req.file.filename
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
                           role : { $ne : "super Admin"}
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
                       if(req.file)
                       {
                           profileImage = req.file.filename
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
            const { seeker_status } = req.body;
    
            // Check for candidateId
            if (!candidateId) {
                return res.status(400).json({
                    success: false,
                    message: 'candidate Id Required'
                });
            }
    
            // Check for candidate
            const candidate = await appliedjobModel.findOne({
                _id: candidateId
            });
    
            if (!candidate) {
                return res.status(400).json({
                    success: false,
                    message: 'candidate not found'
                });
            }
                
                   // access candidate details
                   const first_Name = candidate.first_Name
                   const last_Name = candidate.last_Name
                   const job_Heading = candidate.job_Heading
                   
                   const jobId =  candidate.jobId

              // check for jobId
                    const checkJob = await jobModel.findOne({
                        jobId : jobId
                    })

                    if(!checkJob)
                    {
                        return res.status(400).json({
                            success : false ,
                            message : 'job not found'
                        })
                    }
                  
                     // access job details
                     const company_name = checkJob.company_name
                     const startDate = checkJob.startDate
                     const endDate = checkJob.endDate
                     const company_address = checkJob.company_address
                     const empId = checkJob.emp_Id

                     // check for nextDate
                     const nextDate = new Date(startDate);
                     nextDate.setDate(startDate.getDate() + 1)                  
                    
                     const nextDateFormatted = nextDate.toISOString().slice(0, 23);

                // check for employee
                const checkemp = await employeeModel.findOne({ _id : empId})

                   const emp_name = checkemp.name

                  

                    // Email content for  job scheduling
           const  emailcontent2 = `<!DOCTYPE html>
           <html lang="en">
           <head>
           <meta charset="UTF-8">
           <meta name="viewport" content="width=device-width, initial-scale=1.0">
           <title>Interview Invitation</title>
           </head>
           <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
           
             <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
               <h2 style="text-align: center; color: #333; margin-bottom: 20px;">Interview Invitation</h2>
               <div style="padding: 20px;">
                 <p>Dear <strong>${first_Name} ${last_Name}</strong>,</p>
                 <p>We are impressed with your application for the <strong>${job_Heading}</strong> position at <strong>${company_name}</strong>. We would like to invite you for an interview on <strong>${startDate}</strong> at <strong>10 am</strong>. The interview will be held at <strong>${company_address}</strong>.</p>
                 <p>Please confirm your availability, and let us know if this works for you. We are eager to meet you and discuss your fit for the role.</p>
                 <p>Best regards,</p>
                 <p><strong>${emp_name}</strong> <br>
                 <strong>${company_name}</strong></p>
               </div>
             </div>
           </body>
           </html>
           `


                // Email content for assesment

              const emailcontent3 = `<!DOCTYPE html>
              <html lang="en">
              <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Second Round Assessment Invitation</title>
              </head>
              <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
              
                <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                  <h2 style="text-align: center; color: #333; margin-bottom: 20px;"> Assessment Invitation</h2>
                  <div style="padding: 20px;">
                    <p>Hello <strong style="color: #000;">${first_Name} ${last_Name}</strong>,</p>
                    <p>Hope you're doing well!</p>
                    <p>Congratulations on making it to the next round for the <strong style="color: #000;">${job_Heading}</strong> position at <strong style="color: #000;">${company_name}</strong>. We were impressed by your performance in the initial stage and would like to invite you to the second round assessment.</p>
                    <p>Details:</p>
                    <p>Date: <strong style="color: #000;">${nextDateFormatted}</strong></p>
                    <p>Time: <strong style="color: #000;">10 AM</strong></p>
                    <p>Location: <strong style="color: #000;">${company_address}</strong></p>
                    <p>Please confirm your availability for this session. If the proposed date and time don't work for you, just let us know, and we'll find an alternative.</p>
                    <p>Looking forward to continuing our discussions.</p>
                    <p>Best regards,</p>
                    <p><strong style="color: #000;">${emp_name}</strong> <br>
                    <strong style="color: #000;">${company_name}</strong></p>
                  </div>
                </div>
              </body>
              </html>
              `
              

                // Email content for HR Discussion
               const emailcontent4 = `<!DOCTYPE html>
               <html lang="en">
               <head>
               <meta charset="UTF-8">
               <meta name="viewport" content="width=device-width, initial-scale=1.0">
               <title>HR Discussion Invitation</title>
               </head>
               <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
               
                 <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                   <h2 style="text-align: center; color: #333; margin-bottom: 20px;">HR Discussion Invitation</h2>
                   <div style="padding: 20px;">
                     <p>Hello <strong style="color: #000;">${first_Name} ${last_Name}</strong>,</p>
                     <p>I hope you're doing well!</p>
                     <p>Congratulations on progressing to the next stage of our hiring process for the <strong style="color: #000;">${job_Heading}</strong> position at <strong style="color: #000;">${company_name}</strong>. We're excited to invite you to an <strong style="color: #000;">HR Discussion session</strong>.</p>
                     <p>Details:</p>
                     <p>Date: <strong style="color: #000;">${endDate}</strong></p>
                     <p>Time: <strong style="color: #000;">10 AM</strong></p>
                     <p>Location: <strong style="color: #000;">${company_address}</strong></p>
                     <p>Please let us know if this time works for you. If not, we can find an alternative that suits your schedule.</p>
                     <p>Looking forward to chatting with you soon!</p>
                     <p>Best regards,</p>
                     <p><strong style="color: #000;">${emp_name}</strong> <br>
                     <strong style="color: #000;">${company_name}</strong></p>
                   </div>
                 </div>
               </body>
               </html>
               `
           
               // Email content for shortlist

               const emailcontent6 = `<!DOCTYPE html>
               <html lang="en">
               <head>
               <meta charset="UTF-8">
               <meta name="viewport" content="width=device-width, initial-scale=1.0">
               <title>Offer Letter Notification</title>
               </head>
               <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
               
                 <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                   <h2 style="text-align: center; color: #333; margin-bottom: 20px;">Offer Letter Notification</h2>
                   <div style="padding: 20px;">
                     <p>Dear <strong style="color: #000;">${first_Name} ${last_Name}</strong>,</p>
                     <p>I hope this email finds you well.</p>
                     <p>I am pleased to inform you that <strong style="color: #000;">you have been selected as one of the shortlisted candidates</strong> for the <strong style="color: #000;">${job_Heading}</strong> position at <strong style="color: #000;">${company_name}</strong>. Your qualifications and experiences have impressed us, and we believe you would be a valuable addition to our team.</p>
                     <p>We are in the process of finalizing the details of your offer letter, which will include information about your compensation, benefits, and other pertinent details. Rest assured, we are working diligently to ensure a smooth and timely release of the offer letter to you.</p>
                     <p>Once the offer letter is ready, we will send it to you via email for your review and consideration. If you have any questions or require further information in the meantime, please feel free to reach out to us.</p>
                     <p>We are excited about the possibility of welcoming you to our team and look forward to working together.</p>
                     <p>Congratulations once again, and thank you for your interest in joining <strong style="color: #000;">${company_name}</strong>.</p>
                     <p>Best regards,</p>
                     <p><strong style="color: #000;">${emp_name}</strong> <br>
                     <strong style="color: #000;">${company_name}</strong></p>
                   </div>
                 </div>
               </body>
               </html>
               `

               //Email Content for Reject 

               const emailcontent7 = `<!DOCTYPE html>
               <html lang="en">
               <head>
               <meta charset="UTF-8">
               <meta name="viewport" content="width=device-width, initial-scale=1.0">
               <title>Application Status Update</title>
               </head>
               <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
               
                 <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                   <h2 style="text-align: center; color: #333; margin-bottom: 20px;">Application Status Update</h2>
                   <div style="padding: 20px;">
                     <p>Hello <strong style="color: #000;">${first_Name} ${last_Name}</strong>,</p>
                     <p>I hope you're doing well.</p>
                     <p>Thank you for applying for the <strong style="color: #000;">${job_Heading}</strong> position at <strong style="color: #000;">${company_name}</strong>. We appreciated the opportunity to consider you for the role.</p>
                     <p>After careful review, we've decided to move forward with other candidates whose qualifications better match our current needs. We want to thank you for your interest and time spent with us.</p>
                     <p>We wish you all the best in your job search and future endeavors. If you have any questions or need further assistance, feel free to reach out.</p>
                     <p>Best regards,</p>
                     <p><strong style="color: #000;">${emp_name}</strong></p>
                     <p><strong style="color: #000;">${company_name}</strong></p>
                   </div>
                 </div>
               </body>
               </html>
               `
             

            let cStatus ;
            let candidate_status;
            switch (seeker_status) {
                case 'schedule_Interview':
                    candidate_status = 2;
                    cStatus = 2;
                    send_candidateEmail (candidate.user_Email, `Your Interview Has been Scheduled ..!`, emailcontent2)

                    break;
    
                case 'assessment':
                    candidate_status = 3;
                    cStatus = 2;
                    send_candidateEmail (candidate.user_Email, `Assesment Round..!`, emailcontent3)
                    break;

                case 'HR_Discussion':
                        candidate_status = 4;
                        cStatus = 2;
                        send_candidateEmail (candidate.user_Email, `HR Discussion Round..!`, emailcontent4)
                        break;
    
                case 'complete':
                    candidate_status = 5;
                    cStatus = 2;
                    break;
    
                case 'shortlist':
                    candidate_status = 6;
                    cStatus = 2;
                     send_candidateEmail (candidate.user_Email, `Congratulation You have been Shortlisted..!`, emailcontent6)
                    break;
    
                case 'reject':
                    candidate_status = 7;
                    cStatus = 0;
                    send_candidateEmail (candidate.user_Email, `For Better Luck Next Time..!`, emailcontent7)
                    break;
    
                default:
                    return res.status(400).json({ status: false, message: "Invalid seeker status" });
            }
    
            // Update jobSeeker_status of the candidate
            const updatedCandidate = await appliedjobModel.findOneAndUpdate({ _id: candidateId }, { jobSeeker_status: candidate_status , candidateStatus : cStatus } , { new: true });
    
            if (!updatedCandidate) {
                return res.status(400).json({ status : false , message: "Applied job not found" });
            }
               
              
                res.status(200).json({
                     success : true ,
                     message : 'jobseeker status updated',
                     updated_Candidate : updatedCandidate
                })
            
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'server error',
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
        const job = await jobModel.findOne({
            jobId: jobId
        });

        if (!job) {
            return res.status(400).json({
                success: false,
                message: 'Job not exist'
            });
        }

        // Validate new status
        if (![0, 1, 2 , 3 ].includes(newStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        // Update job status
        job.status = newStatus;

        // Save the updated job status
        await job.save();

        let message = '';
        switch (newStatus) {
            case 1:
                message = 'scheduled';
                break;
            case 0:
                message = 'pending';
                break;
            case 2:
                message = 'Job requirement fulfilled';
                break;
            case 3:
                 message = 'Inactive'
                 break;
            default:
                message = 'Unknown Status';
        }

        return res.status(200).json({
            success: true,
            message: `${message}`,
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
                                        candidateStatus : candidate.candidateStatus
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

                                                   
                                                     
            const create_privacy_policy = async( req ,res)=>{
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

        // Api for get All client Term & Condition

                  
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
                const { Heading, Description } = req.body;
        
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
                    role: 'super Admin'
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
                    if (req.file) {
                        image = req.file.filename;
                    }
        
                    // Create new service
                    const newService = new services({
                        Heading : Heading,
                        Description : Description,
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
                // check for user_image
                if (req.file) {
                    user_image = req.file.filename;
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
        
                // Check if there's an uploaded file
                if (req.file) {
                    exist_testimonial.user_image = req.file.filename;
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
                    if (req.file) {
                        logo = req.file.filename;
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
                        const logo = req.file ? req.file.filename : null;
            
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
                    const logo = req.file ? req.file.filename : null;
                         
        
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
                     if(req.body)
                     {
                        photo = req.file.filename
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
        
                if (req.file) {
                    existB.photo = req.file.filename;
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
                
                const { Heading, Description } = req.body;
        
                // Check for exist hr consultancy
                const exist_hr_consultancy = await cms_hr_consultancy_Model.findOne({ });
        
                if (exist_hr_consultancy) {
                    // Update existing section
                    exist_hr_consultancy.Heading = Heading;
                    exist_hr_consultancy.Description = Description;
        
                    if (req.file) {
                        exist_hr_consultancy.image = req.file.filename;
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
        
                    // Add image 
                    const image = req.file ? req.file.filename : null;
                         
        
                    // Add new Data
                    const newData = new cms_hr_consultancy_Model({
                       
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
        
                const { Heading, Description } = req.body;
        
                // Check for exist hr consultancy
                const exist_t_d = await cms_t_d_Model.findOne({ });
        
                if (exist_t_d) {
                    // Update existing section
                    exist_t_d.Heading = Heading;
                    exist_t_d.Description = Description;
        
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
        
                    // Add image 
                    const image = req.file ? req.file.filename : null;
                         
        
                    // Add new Data
                    const newData = new cms_t_d_Model ({
                       
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
    
                if (req.file) {
                    exist_r_s.image = req.file.filename;
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
                const image = req.file ? req.file.filename : null;
                     
    
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
    
                if (req.file) {
                    exist_eO.image = req.file.filename;
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
                const image = req.file ? req.file.filename : null;
                     
    
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
    
            const { Heading, Description } = req.body;
    
            // Check for exist cms_Hr_teleconsultation
            const exist_HT = await cms_Hr_teleconsultation_model.findOne({ });
    
            if (exist_HT) {
                // Update existing section
                exist_HT.Heading = Heading;
                exist_HT.Description = Description;
    
                if (req.file) {
                    exist_HT.image = req.file.filename;
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
    
                // Add image 
                const image = req.file ? req.file.filename : null;
                     
    
                // Add new Data
                const newData = new cms_Hr_teleconsultation_model ({
                   
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
             
     const get_hr_teleconsultation_Details = async( req , res)=>{
        try {
                const allDetails = await cms_Hr_teleconsultation_model.find({
                          
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
              message : 'contact Details Deleted'
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
            let { Basic_pay, OT_Hours_weekday = 0 , OT_Hours_weekend = 0 } = req.body;
    
            // Check for required fields
            if (!Basic_pay) {
                return res.status(400).json({
                    success: false,
                    message: 'Basic pay required'
                });
            }
            if (OT_Hours_weekday) {
                OT_Hours_weekday = OT_Hours_weekday
            }
            if (OT_Hours_weekend) {
                OT_Hours_weekend = OT_Hours_weekend
            }
    
            // Calculate Basic Pay per Day
            const Basic_pay_per_day = Math.round(Basic_pay / 22);
    
            // Calculate Pay per Hour
            const Basic_pay_per_Hour = Math.round(Basic_pay_per_day / 8);
    
            // Calculate overtime computation on weekdays
            const OT_computation_on_weekday = Basic_pay_per_Hour * OT_Hours_weekday * 1.5;
    
            // Calculate overtime computation on weekends
            const OT_computation_on_weekend = Basic_pay_per_Hour * OT_Hours_weekend * 2;
    
            // Calculate total overtime
            const total_overTime = Math.round(OT_computation_on_weekday + OT_computation_on_weekend);
    
            // Return the calculated values
            return res.status(200).json({
                success: true,
                message: 'Calculation successful',
                data: {
                    Basic_pay : `SLE ${Basic_pay}`, 
                    OT_Hours_weekday : OT_Hours_weekday, 
                    OT_Hours_weekend  : OT_Hours_weekend ,
                    Basic_pay_per_day: `SLE ${Basic_pay_per_day}`,  
                    Basic_pay_per_Hour: `SLE ${Basic_pay_per_Hour}`,
                    OT_computation_on_weekday: `SLE ${OT_computation_on_weekday}`,
                    OT_computation_on_weekend: `SLE ${OT_computation_on_weekend}`,
                    total_overTime: `SLE ${total_overTime}`
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
                      
            // Return the calculated values
            return res.status(200).json({
                success: true,
                message: 'Calculation successful',
                data: {
                    Basic_pay : `SLE ${Basic_pay}`, 
                    leave_allowence_percentage : leave_allowence_percentage ,
                    annual_Basic : `SLE ${annual_Basic}` ,
                    leave_allowence : `SLE ${leave_allowence}` ,
                    income_tax : `SLE ${income_tax}`  ,
                    net_leave_allow :  `SLE ${net_leave_allow}`
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

       // Api for EOSB

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
    
            // Calculate EOSB
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
    
            // Return the calculated values
            return res.status(200).json({
                success: true,
                message: 'Calculation successful',
                data: {
                    Basic_pay: `SLE ${Basic_pay}`,
                    year_served: rounded_year_served,
                    EOSB: `SLE ${EOSB}`,
                    payment_for_unutilized_leave_days: `SLE ${payment_for_unutilized_leave_days}`,
                    gross_salary: `SLE ${gross_salary}`,
                    tax_on_EOSB: `SLE ${tax_on_EOSB}`,
                    net_EOSB: `SLE ${net_EOSB}`,
                    contract_start_Date : contract_start_Date,
                     Employment_end_Date : Employment_end_Date, 
                     EOSB_days_per_year :`SLE ${EOSB_days_per_year}` , 
                     untilized_leave_days : untilized_leave_days
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
    
    
// Api for calculate Net salary
const net_salary = async (req, res) => {
    try {
      let { Basic_pay, transport_allowance = 0, rent_allowance = 0, Hazard_and_other_allowance = 0 } = req.body;
  
        if(!Basic_pay)
            {
                return res.status(400).json({
                     success : false ,
                     message : ' basic salary Requried'
                })
            }
        if(transport_allowance)
            {
                transport_allowance = transport_allowance
            }
        
        if(rent_allowance)
            {
                rent_allowance = rent_allowance
            }
        
        if(Hazard_and_other_allowance)
            {
                Hazard_and_other_allowance = Hazard_and_other_allowance
            }
        
  
      // Calculate Total Allowance
      const total_Allowance = Math.round(transport_allowance + rent_allowance + Hazard_and_other_allowance);
  
      // Calculate Gross Salary
      const gross_salary = Math.round(Basic_pay + total_Allowance);
  
      // Calculate Non-taxable Pay
      const non_taxable_pay = total_Allowance < 500 ? total_Allowance : 500;
  
      // Calculate NASSIT Percentage
      const nassit_5_percent = Math.round(Basic_pay * 0.05);
  
      // Calculate Taxable Pay
      const taxable_pay = Math.round((Basic_pay - nassit_5_percent + total_Allowance) - non_taxable_pay);
  
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
      const total_deduction = Math.round(Deducation_pay + nassit_5_percent);
  
      // Calculate Net Salary
      const net_Salary = gross_salary - total_deduction;
  
      // Return the calculated values
      return res.status(200).json({
        success: true,
        message: 'Calculation successful',
        data: {
            Basic_pay :   `SLE ${Basic_pay}` ,
            transport_allowance:  `SLE ${transport_allowance}` ,
            rent_allowance :  `SLE ${rent_allowance}` ,
            Hazard_and_other_allowance :  `SLE ${Hazard_and_other_allowance}` ,
            total_Allowance : `SLE ${total_Allowance}` ,
            gross_salary :  `SLE ${gross_salary}`  ,
            non_taxable_pay :  `SLE ${non_taxable_pay}`   ,
            taxable_pay : `SLE ${taxable_pay}`  ,
            nassit_5_percent,
          PAYE : `SLE ${Deducation_pay}`,
          total_deduction :  `SLE ${total_deduction}`,
          net_Salary : `SLE ${net_Salary}`,
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
      
                  
      const { parse, format, eachDayOfInterval } = require('date-fns');
      const e = require('cors')
      
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
          const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
          if (currentYear) {
            const all_talent_poolByMonth = [];
      
            for (let i = 0; i < 12; i++) {
              // Construct start and end dates for each month
              const startDate = new Date(currentYear, i, 1);
              const endDate = new Date(currentYear, i + 1, 0);
      
              // Query the database for applied talent pool created within the current month
              const all_talent_pool = await appliedjobModel.find({
                createdAt: { $gte: startDate, $lte: endDate }
              });
      
              // Count talent pool for the current month
              const talentPoolCount = all_talent_pool.length;
      
              // Add month count to the array
              all_talent_poolByMonth.push({
                month: month[i],
                talentPool_count: talentPoolCount
              });
            }
      
            return res.status(200).json({
              success: true,
              message: 'talentPool Details',
              details: all_talent_poolByMonth
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
    
      
      
                  
                                    
                
module.exports = {
    login , getAdmin, updateAdmin , admin_ChangePassword , addStaff , getAll_Staffs , getAllEmp , active_inactive_emp ,
    active_inactive_job , getStaff_Details , updatestaff , staff_ChangePassword , getAllFemale_Candidate ,
    candidate_recruitment_process , active_inactive_Hr , send_notification_to_client , sendNotification_to_allClient,
    send_notification ,  create_services , getService ,  create_privacy_policy , get_admin_privacy_policy,
    create_term_condition , get_admin_term_condition , getAll_candidates , AdminforgetPassOTP , AdminverifyOTP , adminResetPass ,
    getAdminNotification , unseen_admin_notification_count ,seen_notification , get_FAQdetails , createFAQ , DeleteFAQ , get_contactUS, DeleteContactUS ,
    Overtime , leave_allowence , calculate_EOSB , net_salary , 
            
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
     cms_get_started_today , get_started_todayDetails
     
     
}