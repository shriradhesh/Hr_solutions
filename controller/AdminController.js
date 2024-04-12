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





                                                 /* Admin and staff Section */
           

    // Api for login admin and staffs

    const login = async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: "email is Required",
                });
            }
            if (!password) {
                return res.status(400).json({
                    success: false,
                    message: "password is Required",
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
                } catch (error) {
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
                        _id : jobId
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
              


            let candidate_status;
            switch (seeker_status) {
                case 'schedule_Interview':
                    candidate_status = 2;
                    send_candidateEmail (candidate.user_Email, `Your Interview Has been Scheduled ..!`, emailcontent2)

                    break;
    
                case 'assessment':
                    candidate_status = 3;
                    send_candidateEmail (candidate.user_Email, `Assesment Round..!`, emailcontent3)
                    break;

                case 'HR_Discussion':
                        candidate_status = 4;
                        send_candidateEmail (candidate.user_Email, `HR Discussion Round..!`, emailcontent4)
                        break;
    
                case 'complete':
                    candidate_status = 5;
                    break;
    
                case 'shortlist':
                    candidate_status = 6;
                     send_candidateEmail (candidate.user_Email, `Congratulation You have been Shortlisted..!`, emailcontent6)
                    break;
    
                case 'reject':
                    candidate_status = 7;
                    send_candidateEmail (candidate.user_Email, `For Better Luck Next Time..!`, emailcontent7)
                    break;
    
                default:
                    return res.status(400).json({ status: false, message: "Invalid seeker_status" });
            }
    
            // Update jobSeeker_status of the candidate
            const updatedCandidate = await appliedjobModel.findOneAndUpdate({ _id: candidateId }, { jobSeeker_status: candidate_status }, { new: true });
    
            if (!updatedCandidate) {
                return res.status(400).json({ status : false , message: "Applied job not found" });
            }
               
              
                res.status(200).json({
                     success : true ,
                     message : 'jobseeker_status updated',
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
                        return res.status(200).json({
                               success : true ,
                               message : 'All Employees',
                               Details : allEmp
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

        // Check for jobId
        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: 'jobId Required'
            });
        }

        // Check for Job existence
        const job = await jobModel.findOne({
            _id: jobId
        });

        if (!job) {
            return res.status(400).json({
                success: false,
                message: 'Job not exist'
            });
        }

        // Toggle job status
        job.status = job.status === 1 ? 0 : 1;

        // Save the updated job status
        await job.save();

        return res.status(200).json({
            success: true,
            message: `${job.status ? 'Activated' : 'Inactivated'} successfully`
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
                                    return res.status(200).json({
                                        success : true ,
                                        message : 'Female candidate Profile',
                                        allFemale_CandidateCount : allFemale_Candidate.length,
                                        Details: allFemale_Candidate.map((candidate) => ({
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
                                        jobId : candidate.jobId
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
                                   message : 'Term & conditons not found'
                              })
                          }
                
                          return res.status(200).json({
                                success : true,
                                message : 'term & Condtions',
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

                        return res.status(200).json({
                               success : true ,
                               message : 'all testimonial',
                               Details : all_testimonial
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
                                                        
module.exports = {
    login , getAdmin, updateAdmin , admin_ChangePassword , addStaff , getAll_Staffs , getAllEmp , active_inactive_emp ,
    active_inactive_job , getStaff_Details , updatestaff , staff_ChangePassword , getAllFemale_Candidate ,
    candidate_recruitment_process , active_inactive_Hr , send_notification_to_client , sendNotification_to_allClient,
    send_notification ,  create_services , getService ,  create_privacy_policy , get_admin_privacy_policy,
    create_term_condition , get_admin_term_condition ,
    
              /*  CMS PAGE */
     create_testimonial , getAll_testimonial , get_testimonial , update_testimonial , delete_testimonial
}