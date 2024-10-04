const employeeModel = require('../model/employeeModel')
const bcrypt = require('bcrypt')
const jobModel = require('../model/jobModel')
const appliedjobModel = require('../model/appliedJobModel')
const sendjobEmail  = require('../utils/jobAppliedEmail')
const moment = require("moment");
const cron = require("node-cron");
const send_EmployeeEmail = require('../utils/employeeEmail')
const empNotificationModel = require('../model/employeeNotification')
const privacy_policyModel = require('../model/privacy_policy')
const term_condition = require('../model/term_condition')
const services = require('../model/servicePage')
const stringSimilarity = require('string-similarity');
const cms_job_posting_sectionModel = require('../model/cms_job_posting_section1')
const cms_need_any_job_section_Model = require('../model/cms_need_any_job_section') 
const cms_postjobModel = require('../model/cms_post_your_job')
const cms_jobMarketData = require('../model/cms_job_market_data')
const jobTitleModel = require('../model/jobTitle')
const Psychometric_test_Model = require('../model/Psychometric_testing')
const ExcelJs = require("exceljs");
const otpModel = require('../model/otpModel')
const sendEmails = require('../utils/sendEmails')
const adminNotificationModel = require('../model/adminNotification')
const faqModel = require('../model/Faq')
const contactUsModel = require('../model/contact_us')
const jobDescription_model = require('../model/jobDescription')
const ResumeModel = require('../model/uploadResume')
const { countDocuments } = require('../model/Admin_and_staffs')
const blog_section_comment_Model = require('../model/blog_detail_comment')
const path = require('path')
const fixit_finder_model = require('../model/fixit_finder_model')
const { PDFDocument, rgb, StandardFonts, asNumber } = require('pdf-lib');
const save_candidate_profile = require('../model/save_candidate_profile_for_later')
const psychometric_test_Category_Model = require('../model/psychometric_test_Category')
const CvBuilderModel = require('../model/cv_builder')
const courses_user_enroll_Model = require('../model/courses_enroll_user')

require('dotenv').config(); 
const nodemailer = require('nodemailer');
const validator = require('validator'); 
const fs = require('fs')
const parse5 = require('parse5');
const cms_online_courses_Model = require('../model/cms_online_cources')
const online_course_quiz_Model = require('../model/online_courses_quiz')
const user_enrolled_course_toic_manage_Model = require('../model/user_enrolled_topic_manage')








                                        /* employer Section */

// Api for user Signup
     
                   const employeeSignup = async( req , res)=>{
                     try {
                           const { name , email , password , phone_no , company_name , Number_of_emp ,company_industry , company_HQ } = req.body
                      
                           // check for required fields
                           const requiredFields = [ "name", "email", "password" , "phone_no" ,"company_name" , "Number_of_emp" , "company_industry" , "company_HQ"];

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

                              // check for existing employee
                            const existingEmp = await employeeModel.findOne({ email : email})
                            if(existingEmp)
                            {
                                return  res.status(400).json({
                                     success : false ,
                                     message : 'email already exists'
                                })
                            }
                            
                              // check for company
                              const existCompany = await employeeModel.findOne({ company_name : company_name })
                              if(existCompany)
                              {
                                return res.status(400).json({
                                     success : false ,
                                     message : 'Company Details already exists'
                                })
                              }

                                //hashed the password
                            const hashedPassword = await bcrypt.hash(password , 10)
                            let profileImage = null 
                           
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
    

                             const newData = new employeeModel({
                                 name ,  
                                 email ,
                                 password : hashedPassword, 
                                 phone_no , 
                                 company_name , 
                                 Number_of_emp ,
                                 company_industry ,
                                 profileImage : profileImage ,
                                 status : 0,
                                 company_HQ : company_HQ
                             })
                             const EmployeeContent = `
                             <p> Hello ${name}</p>
                             <p>Here are your account Login details:</p>
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
                             
                         </table>
                         `;
                         // Send email to the staff
                         await send_EmployeeEmail (email, `Your Account successfully Created`, EmployeeContent);
                                await newData.save()

                                // send notification to admin
                                try {
                                    const newNotification =  adminNotificationModel.create({
                                        title : `New Client`,
                                        message: `New client added successfully! Please activate their account from pending status`,
                                        date: new Date(),
                                        status: 1,
                                    });
                                     newNotification.save();
                                } catch (notificationError) {
                                    console.error('Error creating notification:', notificationError);
                                }
                            
                            return res.status(200).json({
                                  success : true ,
                                  message : 'successfully SignUP',
                                  employee_Id : newData._id
                            })                        

                     } catch (error) {
                        return res.status(500).json({
                             success : false ,
                             message : 'server error',
                             error_message : error.message
                        })
                     }
                   }

    // Employee Login
    const Emp_login = async (req, res) => {
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
            // Find Employee by email
            const emp = await employeeModel.findOne({ email: email  });
    
            if (!emp) {
                return res.status(400).json({
                    success: false,
                    message: "email incorrect"
                });
            }
                 const status = emp.status
                 if(status === 0)
                 {
                    return res.status(400).json({
                         success : false ,
                         message : 'Your account is Not Approval yet. Please contact the admin for further details.'
                    })
                 }
    
            // Check if the stored password is in plain text
            if (emp.password && emp.password.startsWith("$2b$")) {
                // Password is already bcrypt hashed
                const passwordMatch = await bcrypt.compare(password, emp.password);
    
                if (!passwordMatch) {
                    return res.status(400).json({
                        success: false,
                        message: "Password incorrect"
                    });
                }
            } else {
                // Convert plain text password to bcrypt hash
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);
    
                // Update the stored password in the database
                emp.password = hashedPassword;               
                await emp.save();
            }
    
            return res.json({
                success: true,
                message: "Login Successfully ",
                data: emp,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "server error",
            });
        }
    };

     // Api for get Employee Details
     const getEmployeeDetails = async( req , res)=>{
        try {
              const empId = req.params.empId
            // check for empId
            if(!empId)
            {
                return res.status(400).json({
                     success : false ,
                     message : 'empId required'
                })
            }

            // check for emp
        const emp = await employeeModel.findOne({ _id : empId })
        if(!emp)
        {
            return res.status(400).json({
                   success : false ,
                   message : 'employee not found'
            })
        }
        return res.status(200).json({
                success : true ,
                message : 'employee Details',
                Details : emp
        })
        } catch (error) {
              return res.status(500).json({
                       success : 'server error',
                       error_message : error.message
              })
        }
 }

         // Api for update Admin Panel
         const updateEmp = async( req , res)=>{
            try {
                   const empId = req.params.empId
               const { name , email , phone_no } = req.body
               // check for empId 
               if(!empId)
               {
                   return res.status(400).json({
                        success : false,
                        message : 'empId required'
                   })
               }
                  // check for existing emp

                  const exist_emp = await employeeModel.findOne({ _id : empId })
                  if(!exist_emp)
                  {
                   return res.status(400).json({
                        success : false ,
                        message : 'Employee not found'
                   })
                  }

                     // update profile Image of the exist_emp
                   let profileImage = exist_emp.profileImage
                   if (req.file && req.file.filename) {
                //     // Get the file extension
                //     const fileExtension = path.extname(req.file.filename).toLowerCase();

                //     // List of allowed extensions
                //     const allowedExtensions = ['.jpg', '.jpeg', '.png'];

                //     // Check if the file extension is in the allowed list
                //     if (allowedExtensions.includes(fileExtension)) {
                //         // If valid, update the profile image
                        profileImage = req.file.filename;
                //     } else {
                //         // If not valid, throw an error
                //         return res.status(400).json({
                //             success : false ,
                //             message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                //     });
                //     }
                }

                   exist_emp.name = name
                   exist_emp.email = email
                   exist_emp.phone_no = phone_no

                   if(profileImage)
                   {
                    exist_emp.profileImage = profileImage
                   }
                   await exist_emp.save()

                   return res.status(200).json({
                         success : true ,
                         message : 'Employee Details updated successfully ',
                         data : exist_emp
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
       const emp_ChangePassword = async( req ,res)=>{
        try {
                 const empId = req.params.empId
              const { oldPassword , password , confirmPassword } = req.body
                 // check for empId

                 if(!empId)
                 {
                     return res.status(400).json({
                            success : false,
                            message : 'missing empId'
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

                 // check for employee
             const emp = await employeeModel.findOne({ _id : empId })
               
                  if(!emp)
                  {
                     return res.status(400).json({
                          success : false ,
                          message : 'employee Details not found'
                     })
                  }

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
                 emp.password
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
         // update the employee password with new encrypted password
         emp.password = hashedNewPassword;
         await emp.save();
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

                  
    const forgetPassOTP = async (req, res) => {
        try {
            const { email } = req.body;
    
            if (!email || !isValidEmail(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Valid email is required"
                });
            }
    
            const client = await employeeModel.findOne({ email });
    
            if (!client) {
                return res.status(400).json({ success: false, message: 'client with given email not found' });
            }
    
            const otp = generateOTP();
    
            // Save the OTP in the otpModel
            const otpData = {
                clientId: client._id,
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
                        <h2 style="color: #333; font-size: 24px; text-align: center; margin-bottom: 20px;">Dear ${client.name} </h2>
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
            await sendEmails(client.email, "Password reset", emailContent);
    
            res.status(200).json({ success: true, 
                                     message: "An OTP has been sent to your email",
                                     email: client.email , 
                                     
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
    const verifyOTP = async(req,res)=>{
        try {
          const { otp } = req.body
          if(!otp)
          {
            return res.status(400).json({ success : false , message : ' otp is required' })
          }
          const userOTP = await otpModel.findOne ({ otp })
          if(!userOTP)
          {
            return res.status(400).json({ success : false , message : ' Invalid OTP or expired' })
          }
          res.status(200).json({ success : true , message : 'otp verified successfully' , clientId : userOTP.clientId})
        } catch (error) {
          return res.status(500).json({
                      success : false ,
                      message : 'server error',
                      error_message : error.message
          })
        }
       }

       // APi for otp verify and reset password for forget password 
                
       const clientResetPass = async (req, res) => {
        try {
            const { password , confirmPassword } = req.body;
            const clientId = req.params.clientId
            if (!password) {
                return res.status(400).json({ success: false, message: 'Password is required' });
            }
            if (!confirmPassword) {
                return res.status(400).json({ success: false, message: 'confirm password is required' });
            }
            if (!clientId) {
                return res.status(400).json({ success: false, message: 'clientId is required' });
            }                       
        
            const client = await employeeModel.findById(clientId);

            if (!client) {
                return res.status(400).json({ success: false, message: 'Invalid clientId' });
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
            client.password = hashedPassword;
            await client.save();

            // Delete the used OTP
            await otpModel.deleteOne({ clientId });

            res.status(200).json({ success: true, message: 'Password reset successfully' });
        } catch (error) {
            console.error('error', error);
            res.status(500).json({ success: false, message: 'server error', error_message : error.message });
        }
    };

                                        /* job Title section */

            // API for add job title in job title schema

 const addJobTitle = async (req, res) => {
    const { jobTitle } = req.body;
  
    try {
      const requiredFields = ["jobTitle"];
  
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
  
      // Check for jobTitle
      const existjobTitle = await jobTitleModel.findOne({ jobTitle });
  
      if (existjobTitle) {
        return res
          .status(400)
          .json({ message: "JobTitle already exist ", success: false });
      }
  
      const newjobTitle = new jobTitleModel({
        jobTitle: jobTitle,
      });
      const savedjobTitle = await newjobTitle.save();
  
      return res
        .status(200)
        .json({
          success: true,
          message: `JobTitle added successfully `,
          stop: savedjobTitle,
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

  // get all jobTitle form the jobTitle Schema

  const alljobTitle = async (req, res) => {
    try {
        // Fetch all jobTitles from the database
        const jobTitles = await jobTitleModel.find({});
        
        // Check if jobTitles array is empty
        if (jobTitles.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No JobTitles found",
            });
        } else {
            // Map jobTitles to required format
            const formattedJobTitles = jobTitles.map(jobT => ({
                jobTitle: jobT.jobTitle,
                _id: jobT._id
            }));
            
            // Send formatted jobTitles as response
            res.status(200).json({
                success: true,
                message: "All JobTitles",
                details: formattedJobTitles
            });
        }
    } catch (error) {
        // Handle server error
        res.status(500).json({ success: false, message: "Server error", error_message: error.message });
    }
};


  // Delete a particular jobTitle by jobtitle_id

const deletejobTitle = async (req, res) => {
    try {
      const jobtitle_id = req.params.jobtitle_id;
  
      // Check for route existence
      const existingjobTitle = await jobTitleModel.findOne({ _id: jobtitle_id });
      if (!existingjobTitle) {
        return res.status(400).json({ success: false, error: `JobTitle not found` });
      }
  
      // Delete the jobTitle from the database
      await existingjobTitle.deleteOne();
  
      res
        .status(200)
        .json({ success: true, message: "JobTitle deleted successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "server error", error_message : error.message });
    }
  };
                                    /* job Description Section  */
 // Api for add job Description

    const addJob_Description = async (req, res) => {

  
    try {
        const { jobTitle , job_Description ,  Responsibilities  } = req.body;  

        // check for existing job description
        const existJd = await jobDescription_model.findOne({
            jobTitle : jobTitle
        })
          if(existJd)
            {
                      existJd.jobTitle = jobTitle
                    existJd.job_Description = job_Description
                    existJd.Responsibilities = Responsibilities

                    await existJd.save()
                    return res.status(200).json({
                         success : true ,
                         message : 'job Description update successfully'
                    })
            } else{
      const requiredFields = ["jobTitle" , "job_Description" , "Responsibilities"];
  
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
            // create new JD
      const newJD = new jobDescription_model({
        jobTitle: jobTitle,
        job_Description : job_Description,
        Responsibilities : Responsibilities,
      });
      const savedjob_Description = await newJD.save();
  
      return res
        .status(200)
        .json({
          success: true,
          message: `job Description added successfully `,
          job_Description : savedjob_Description,
        });
    }
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


   // get all jobDescription form the job description Schema

   const alljobDescription = async (req, res) => {
    try {
        // Fetch all jDs from the database
        const jds = await jobDescription_model.find({});
        
        // Check if jobTitles array is empty
        if (jds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No Job Descriptions found",
            });
        } else {
            // Map formattedjds to required format
            const formattedjds = jds.map(jobT => ({
                jobTitle: jobT.jobTitle,
                job_Description : jobT.job_Description,
                Responsibilities : jobT.Responsibilities,
                _id : jobT._id
            }));
            
            // Send formatted jobTitles as response
            res.status(200).json({
                success: true,
                message: "All Description",
                details: formattedjds
            });
        }
    } catch (error) {
        // Handle server error
        res.status(500).json({ success: false, message: "Server error", error_message: error.message });
    }
};

// Api for get particular JD using title 

      const getJd = async( req , res )=>{
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
                      const JD = await jobDescription_model.findOne({
                              jobTitle : jobTitle
                      })

                      if(!JD)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message :  `Job Description not found for the given jobTitle : ${jobTitle}`
                            })
                        }


                        return res.status(200).json({
                             success : true ,
                             message : 'JOB Description',
                             Details : JD
                        })

                            } catch (error) {
                return res.status(500).json({
                     success : false ,
                     message : 'server error',
                     error_message : error.message
                })
            }
      }

// Delete a particular job Description by jD Id

const deleteJob_Description = async (req, res) => {
    try {
      const Jd_id = req.params.Jd_id;
  
      // Check for JD existence
      const existingjD = await jobDescription_model.findOne({ _id: Jd_id });
      if (!existingjD) {
        return res.status(400).json({ success: false, error: `Job Description not found` });
      }
  
      // Delete the job Description from the database
      await existingjD.deleteOne();
  
      res
        .status(200)
        .json({ success: true, message: "job Description deleted successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "server error", error_message : error.message });
    }
  };

                                           /* Psychometric Testing Section   */
 // Api for add psychometric  TEST
     
 const psychometric_test = async (req, res) => {
    try {
        let client_id = req.params.client_id
        let { category_id , question,  correctAnswerIndex } = req.body;
        let options = req.body.options

              //check for client id 
              if(!client_id)
              {
                return res.status(400).json({
                     success : false ,
                     message : 'Client Id Required'
                })
              }

              // check for client
              let client = await employeeModel.findOne({ _id : client_id })
              if(!client)
              {
                return res.status(400).json({
                     success : false ,
                     message : 'Client not Found'
                })
              }

              // check for category
              let category = await psychometric_test_Category_Model.findOne({ _id : category_id })
              if(!category)
              {
                return res.status(400).json({
                     success : false ,
                     message : 'category not exist'
                })
              }

                // check for test already exist for client
                     let exist_test = await Psychometric_test_Model.findOne({ client_id , category_id })
                      if(exist_test)
                      {
                        return res.status(400).json({
                             success : false ,
                             message : 'Test Already Exist'
                        })
                      }

                      let question_image = ''
                      if(req.file)
                      {
                        question_image = req.file.filename
                      }
                        
        // Check if question is provided and is a non-empty string
        if (!question) {
            return res.status(400).json({
                success: false,
                message: 'Question is required'
            });
        } 
         
        try {
            options = JSON.parse(options); 
        } catch (parseError) {
            return res.status(400).json({
                success: false,
                message: 'Options must be a valid JSON array'
            });
        }
        // Check if options array is provided and is not empty
        if (!Array.isArray(options) || options.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Options array is required'
            });
        }

        // Check if correctAnswerIndex is provided and is a number
        if (correctAnswerIndex) {
            correctAnswerIndex = parseInt(correctAnswerIndex)
        }    

        // Create a new psychometric question
        let newPsychometric = new Psychometric_test_Model({
            client_id,
            category_id,
            category_name : category.category_name,
            questions_Bank : [{
            question,
            question_image : question_image,
            options,
            correct_answer_index : correctAnswerIndex 
        }]
     });

        // Save the new question
        await newPsychometric.save();

        res.status(200).json({
            success: true,
            message: 'Psychometric test added successfully',
            
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};


// Api for get Detials of psychometric_Test
     const get_test = async( req , res )=>{
        try {
            const { test_id } = req.params;
    
            // Check for psychometric_questions_Id
            if (!test_id) {
                return res.status(400).json({
                    success: false,
                    message: 'psychometric_test_id is required'
                });
            }
    
            // Fetch details from the database
            const psy_test = await Psychometric_test_Model.findById(test_id);
    
            if (!psy_test) {
                return res.status(404).json({
                    success: false,
                    message: 'No test found'
                });
            }
    
            // Respond with the question details
            return res.status(200).json({
                success: true,
                message: 'Test details',
                test_details : {
                         category_name : psy_test.category_name,
                         status : psy_test.status,
                         questions_Bank : psy_test.questions_Bank
                        
                }
            });
    
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message
            });
        }
     }




// get all psychometric_questions options for particular 

const getAll_psychometric_test_of_client = async(req , res)=>{
       try {
              const client_id = req.params.client_id
              // check for client Id
              if(!client_id)
              {
                return res.status(400).json({
                     success : false ,
                     message : 'Client id Required'
                })
              }

              // check for client
              const client = await employeeModel({ _id : client_id })
              if(!client)
              {
                return res.status(400).json({
                     sucess : false ,
                     message : 'Client not found'
                })
              }

             // check for all psychometric_Test

             const checkpsychometric_T = await Psychometric_test_Model.find({  client_id                   
             })

             if(!checkpsychometric_T)
             {
                return res.status(400).json({
                     success : false ,
                     message : `no psychometric Test Found for the client`
                })
             }

             // sort data

             const sorteddata = checkpsychometric_T.sort(( a , b ) => b.createdAt - a.createdAt )

             return res.status(200).json({
                 success : true ,
                 message : `psychometric Test of client`,
                 Test : sorteddata
                           
             })
       } catch (error) {
        return res.status(500).json({
             success : false ,
             message : 'server error',
             error_message : error.message
        })
       }
}


// Api for add question in test
           const add_question_in_test = async( req , res) => {
                   try {

                          let test_id = req.params.test_id
                          let { question , options , correct_answer_index } = req.body
                      

                    // check for test_id
                    if(!test_id)
                    {
                        return res.status(400).json({
                             success : false ,
                             message : 'Test Id Required'
                        })
                    }

                    // check for test
                    const test = await Psychometric_test_Model.findOne({ _id : test_id })
                    if(!test)
                    {
                        return res.status(400).json({
                             success : false ,
                             message : 'Test Not found'
                        })
                    }

                    // check for question already exist
                      const duplicate_question = test.questions_Bank.find(
                        (ques) => ques.question === question
                      )

                      if(duplicate_question)
                      {
                          return res.status(400).json({
                             success : false ,
                             message : 'Question already exist in the test'
                          })
                      }
                        
                        try {
                            options = JSON.parse(options); 
                        } catch (parseError) {
                            return res.status(400).json({
                                success: false,
                                message: 'Options must be a valid JSON array'
                            });
                        }

                          let question_image = ''
                        if(req.file)
                        {
                            question_image = req.file.filename
                        }
                         test.questions_Bank.push({
                                question , 
                                question_image : question_image || '',
                                options,
                                correct_answer_index
                         })

                         await test.save()
                         return res.status(200).json({
                             success : true ,
                             message : 'Question added successfully'
                         })

                   } catch (error) {
                       return res.status(500).json({
                            success : false ,
                            message : 'Server error',
                            error_message : error.message
                       })
                   }
           }

            // Api for delete Question in test
    const delete_question_in_psychometric_test = async (req, res) => {
        const { test_id, questionId } = req.params;
    
        try {

             // check for test_id 
             if(!test_id)
             {
                return res.status(400).json({
                     success : false ,
                     message : 'test_id Required'
                })
             }
             // check for test_id 
             if(!questionId)
             {
                return res.status(400).json({
                     success : false ,
                     message : 'questionId Required'
                })
             }
            // Check for test existence
            const exist_test = await Psychometric_test_Model.findById(test_id);
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
       // Api for delete psychometric_test

                    const deletepsychometrcTest = async( req , res)=>{
                            try {
                                  const psychometric_id = req.params.psychometric_id
                                // check for psychometric_id
                            if(!psychometric_id)
                            {
                                return res.status(400).json({
                                     success : false ,
                                     message : 'psychometric Id required'
                                })
                            }

                            // check for psychometric_test
                            const pt = await Psychometric_test_Model.findOne({
                                    _id : psychometric_id
                            })

                            if(!pt)
                            {
                                return res.status(400).json({
                                       success : false ,
                                       message : 'no Test found'
                                })
                            }

                                await pt.deleteOne()
                                
                                return res.status(200).json({
                                     success : true ,
                                     message : 'psychometric test Deleted successfully'
                                })

                            } catch (error) {
                                return res.status(500).json({
                                      success : false ,
                                      message : 'server error',
                                      error_message : error.message
                                })
                            }
                    }
  
// Api for add personality test question for psychometric section

const add_test_Category = async ( req , res ) => {
try {
    const { category_name } = req.body;

    // Validate that the category_name is provided 
    if (!category_name) {
        return res.status(400).json({
            success: false,
            message: 'category_name is required '
        });
    }
      
    // Check if the category_name already exists in the database
    const existcategory_name = await psychometric_test_Category_Model.findOne({ category_name });
    if (existcategory_name) {
        return res.status(400).json({
            success: false,
            message: `category , ${category_name} already exists`
        });
    }

    // Create a new category_name
    const newcategory_name = new psychometric_test_Category_Model({
        category_name
    });

    // Save the new newcategory_name to the database
    await newcategory_name.save();

    return res.status(200).json({
        success: true,
        message: 'Category name added successfully',
        
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({
        success: false,
        message: 'Server error',
        error_message: error.message
    });
}
}

// Api for Get all psychometric personal Ability Questions
const getAll_psychometric_Category = async(req , res)=>{
try {
    
      // check for all category

      const check_Category = await psychometric_test_Category_Model.find({                        
      })

      if(!check_Category)
      {
         return res.status(400).json({
              success : false ,
              message : `no check_Category Found for Psychometric Test`
         })
      }

      // sort data

      const sorteddata = check_Category.sort(( a , b ) => b.createdAt - a.createdAt )

      return res.status(200).json({
          success : true ,
          message : `All Categories for personality Test`,
          Category : sorteddata.map((m)=> ({
                 category_id : m._id,
                 category_name : m.category_name
          }))
                    
      })
} catch (error) {
 return res.status(500).json({
      success : false ,
      message : 'server error',
      error_message : error.message
 })
}
}
         

 // Api for delete Category
   const Delete_category = async ( req , res )=> {
       try {
              const category_id = req.params.category_id
              // check for category_id
            if(!category_id)
            {
                 return res.status(400).json({
                        success : false ,
                        message : 'category Id required'
                 })
            }
            
          //check for category
            const category = await psychometric_test_Category_Model.findOne({ _id : category_id })
            if(!category)
            {
                    return res.status(400).json({
                         success : false ,
                         message : 'No category found'
                    })
            }

              await category.deleteOne()
               return res.status(200).json({
                  success : true ,
                  message : 'category Deleted Successfully'
               })
       } catch (error) {
           return res.status(500).json({
                success : false ,
                message : 'server error',
                error_message : error.message
           })
       }
   }


        
                                                 /* Job Section */
        // Api for post job
        const postJob = async (req, res) => {
            try {
                const empId = req.params.empId;
                const {
                    job_title,
                    job_Description,
                    job_Responsibility,
                    job_type,
                    job_schedule,
                    Minimum_pay,
                    Maximum_pay,
                    Rate,
                    Number_of_emp_needed,
                    requirement_timeline,
                    startDate,
                    endDate,
                    skills, 
                    Experience,
                    company_address,
                    template_type,
                    location
                    // isPsychometricTest,
                    // psychometric_Test

                } = req.body;
                       
                                       
                if (!empId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Employee Id required'
                    });
                }
        
                const employee = await employeeModel.findOne({ _id: empId, status: 1 });
                if (!employee) {
                    return res.status(400).json({
                        success: false,
                        message: 'Employer details not found or account is suspended'
                    });
                }
                        

                const formattedStartDate = new Date(startDate);
                const formattedEndDate = new Date(endDate);


                                // Check if the jobTitle exists in the jobTitleMOdel
                const existingjobTitle = await jobTitleModel.findOne({ jobTitle : job_title });

                if (!existingjobTitle) {
                return res
                    .status(400)
                    .json({
                    success: false,
                    message: `job_title '${job_title}' does not exist in job_title Database`,
                    });
                }
        
                const existJob = await jobModel.findOne({
                    job_title,
                    company_name: employee.company_name,
                    startDate: { $lte: formattedStartDate },
                    endDate: { $gte: formattedEndDate }
                });
                if (existJob) {
                    return res.status(400).json({
                        success: false,
                        message: 'Similar job already exists within the specified time period'
                    });
                }

                    
                    // Generate a random job
                function generateRandomNumber(length) {
                    let result = '';
                    const characters = '0123456789';
                    const charactersLength = characters.length;
        
                    for (let i = 0; i < length; i++) {
                        result += characters.charAt(Math.floor(Math.random() * charactersLength));
                    }
                    return result;
                }
        
                const randomNumber = generateRandomNumber(5);
                const finalString = `JOB${randomNumber}`; 
                    let job_image = ''
                    if(req.file)
                        {
                            job_image = req.file.filename
                        }
                const newJob = new jobModel({
                    emp_Id: empId,
                    jobId : finalString,
                    job_title,
                    job_Description,
                    job_Responsibility : job_Responsibility || null,
                    job_type,
                    job_schedule,
                    salary_pay: [{ Minimum_pay, Maximum_pay, Rate }],
                    Number_of_emp_needed,
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                    key_qualification: skills, // Assign skills directly to key_qualification
                    Experience,
                    company_address,
                    template_type,
                    company_name: employee.company_name,
                    employee_email: employee.email,
                    phone_no: employee.phone_no,
                    company_Industry: employee.company_industry,
                    status: 1,
                    location :  location,
                    // isPsychometricTest  ,
                    // psychometric_Test : psychometric_Test || '',
                    job_image : job_image || ''
                });
        
                await newJob.save();
                try {
                    const newNotification = new empNotificationModel({
                        empId: empId,
                        message: `your Job ${job_title} post successfully`,
                        date: new Date(),
                        status: 1,
                    });
                    await newNotification.save();
                } catch (notificationError) {
                    console.error('Error creating notification:', notificationError);
                }
                
                // send notification to admin
                try {
                    const adminNotification = new adminNotificationModel({
                        title: `New Job`,
                        message: `${employee.name} from ${employee.company_name} has posted a new job.`,
                        date: new Date(),
                        status: 1,
                    });
                    await adminNotification.save();
                } catch (notificationError) {
                    console.error('Error creating notification:', notificationError);
                }
                
        
                return res.status(200).json({
                    success: true,
                    message: 'Job posted successfully',
                    jobId: newJob.jobId,
                   
                });
            } catch (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            }
        };
        

        // Api for get jobs posted by employee
        const getJobs_posted_by_employee = async (req, res) => {
            try {
                const empId = req.params.empId;
                const { status } = req.query; 
        
                // Check for empId
                if (!empId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Employer ID required',
                    });
                }
        
                // Build the query object
                const query = { emp_Id: empId };
        
                // Add status filter if provided
                if (status) {
                    if (status === '1' || status === '3') {
                        query.status = status;
                    } else {
                        return res.status(400).json({
                            success: false,
                            message: 'Invalid status value. Use 1 for active and 3 for inactive',
                        });
                    }
                }
        
                // Check for employee jobs based on the query
                const emp_jobs = await jobModel.find(query);
        
                if (!emp_jobs || emp_jobs.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'No jobs found',
                    });
                }
        
                // Map job data and get male and female candidate count for each job
                const jobsData = await Promise.all(emp_jobs.map(async (job) => {
                    // Get female candidate count
                    const femaleCount = await appliedjobModel.countDocuments({
                        jobId: job.jobId,
                        gender: 'Female'
                    });
        
                    // Get male candidate count
                    const maleCount = await appliedjobModel.countDocuments({
                        jobId: job.jobId,
                        gender: 'Male'
                    });
        
                    const salary_pay = `${job.salary_pay[0].Minimum_pay} - ${job.salary_pay[0].Maximum_pay}, ${job.salary_pay[0].Rate}`;
        
                    return {
                        jobId: job.jobId,
                        job_title: job.job_title,
                        company_name: job.company_name,
                        Number_of_emp_needed: job.Number_of_emp_needed,
                        job_type: job.job_type,
                        job_schedule: job.job_schedule,
                        salary_pay: salary_pay,
                        job_Description: job.job_Description,
                        job_Responsibility: job.job_Responsibility || null,
                        company_address: job.company_address,
                        employee_email: job.employee_email,
                        requirement_timeline: job.requirement_timeline,
                        startDate: job.startDate,
                        endDate: job.endDate,
                        phone_no: job.phone_no,
                        key_qualification: job.key_qualification,
                        Experience: job.Experience,
                        template_type: job.template_type,
                        company_Industry: job.company_Industry,
                        job_photo: job.job_photo,
                        status: job.status,
                        isPsychometricTest: job.isPsychometricTest,
                        psychometric_Test: job.psychometric_Test,
                        job_image: job.job_image,
                        location: job.location,
        
                        // Add male and female candidate counts
                        candidateCounts: {
                            Male: maleCount,
                            Female: femaleCount
                        }
                    };
                }));
        
                return res.status(200).json({
                    success: true,
                    message: 'All Jobs',
                    JobsCount: emp_jobs.length,
                    emp_jobs: jobsData,
                });
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message,
                });
            }
        };
        
                    // Api for update the Job for the client

                    const updateJob = async ( req , res )=> {
                         try {
                                 const jobId = req.params.jobId
                            const {Number_of_emp_needed , job_type , job_schedule ,
                                job_Description , job_Responsibility , startDate , endDate , Experience
                             } = req.body

                                        console.log(req.body);
                                        
                                 // check for job Id required
                                 if(!jobId)
                                 {
                                    return res.status(400).json({
                                         success : false ,
                                         message : 'Job id required'
                                    })
                                 }

                                // check for job
                                const job = await jobModel.findOne({
                                    jobId : jobId   })

                                       // update the details of the Job
                                
                                    job.Number_of_emp_needed = Number_of_emp_needed
                                    job.job_type = job_type
                                    job.job_schedule = job_schedule                                   
                                    job.job_Description = job_Description
                                    job.job_Responsibility = job_Responsibility
                                    job.startDate = startDate
                                    job.endDate = endDate
                                    job.Experience = Experience

                                    await job.save()
                                    return res.status(200).json({
                                         success : true ,
                                         message : 'Job details updated successfully'
                                    })
                            
                         } catch (error) {
                              return res.status(500).json({
                                 success : false ,
                                 message : 'server error',
                                 error_message : error.message
                              })
                         }
                    }
        // Api for get active jobs by client

        const activejobs_by_client = async (req, res) => {
            try {
                const client_id = req.params.client_id;
                // Check for client ID
                if (!client_id) {
                    return res.status(400).json({
                        success: false,
                        message: 'Client ID required'
                    });
                }
        
                // Check for client
                const client = await employeeModel.findOne({ _id: client_id });
                if (!client) {
                    return res.status(400).json({
                        success: false,
                        message: 'Client not found'
                    });
                }
                const company_HQ = client.company_HQ;
        
                // Check for active jobs
                const activeJobs = await jobModel.find({ emp_Id: client_id, status: 1 });
        
                if (activeJobs.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'No active jobs found'
                    });
                }
        
                // Iterate over active jobs to get candidate details
                const activeJobsWithCandidates = await Promise.all(activeJobs.map(async (job) => {
                    const candidateDetails = await appliedjobModel.find({ jobId: job.jobId });
                    const maleCandidateCount = candidateDetails.filter(candidate => candidate.gender === 'Male').length;
                    const femaleCandidateCount = candidateDetails.filter(candidate => candidate.gender === 'Female').length;                   
                    const AllCandidateCount = candidateDetails.length;
                    const jobExperienceValue = parseInt(job.Experience.match(/\d+/)[0]);

                    // Count matched and mismatched candidate profiles based on job experience
                    const matchedProfileCount = candidateDetails.filter(candidate => candidate.job_experience >= jobExperienceValue).length
                    const mismatchedProfileCount = candidateDetails.filter(candidate => candidate.job_experience < jobExperienceValue).length
                       
                    return {
                        ...job.toObject(),
                        maleCandidateCount,
                        femaleCandidateCount,
                        AllCandidateCount,
                        matchedProfileCount,
                        mismatchedProfileCount,
                        company_HQ
                    };
                }));
        
                // Sort active jobs by createdAt date
                const sortedJobs = activeJobsWithCandidates.sort((a, b) => b.createdAt - a.createdAt);
        
                return res.status(200).json({
                    success: true,
                    message: 'Active jobs',
                    activeJob: sortedJobs
                });
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            }
        };
        
        
        
        
        // APi for get inactive jobs by client
        const Inactivejobs_by_client = async (req, res) => {
            try {
                const client_id = req.params.client_id;
                // Check for client ID
                if (!client_id) {
                    return res.status(400).json({
                        success: false,
                        message: 'Client ID required'
                    });
                }
        
                // Check for Inactive jobs
                const InactiveJob = await jobModel.find({
                    emp_Id: client_id,
                    status: { $in: [0, 3] }
                });
        
                if (InactiveJob.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'No Inactive jobs found'
                    });
                }
                 // Check for client
                 const client = await employeeModel.findOne({ _id: client_id });
                 if (!client) {
                     return res.status(400).json({
                         success: false,
                         message: 'Client not found'
                     });
                 }
                 const company_HQ = client.company_HQ;
         
        
                // Iterate over Inactive jobs to get candidate details
                const InactiveJobsWithCandidates = await Promise.all(InactiveJob.map(async (job) => {
                    const candidateDetails = await appliedjobModel.find({ jobId: job.jobId });
                    const maleCandidateCount = candidateDetails.filter(candidate => candidate.gender === 'Male').length;
                    const femaleCandidateCount = candidateDetails.filter(candidate => candidate.gender === 'Female').length;
                    const AllCandidateCount = candidateDetails.length;
                   // Extract numerical value from job.Experience string using regular expression
                    const jobExperienceValue = parseInt(job.Experience.match(/\d+/)[0]);

                    // Count matched and mismatched candidate profiles based on job experience
                    const matchedProfileCount = candidateDetails.filter(candidate => candidate.job_experience >= jobExperienceValue).length;
                    const mismatchedProfileCount = candidateDetails.filter(candidate => candidate.job_experience < jobExperienceValue).length;

        
                    return {
                        ...job.toObject(),
                        maleCandidateCount,
                        femaleCandidateCount,
                        AllCandidateCount,
                        matchedProfileCount,
                        mismatchedProfileCount,
                        company_HQ
                    };
                }));
        
                // Sort Inactive jobs by createdAt date
                const sortedJobs = InactiveJobsWithCandidates.sort((a, b) => b.createdAt - a.createdAt);
        
                return res.status(200).json({
                    success: true,
                    message: 'Inactive jobs',
                    inactiveJob: sortedJobs
                });
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            }
        };
        
    // Api for get Female jobseeker profile for the job
           
                const get_Female_jobseeker_profile = async( req , res)=>{
                    try {
                           const jobId = req.params.jobId
                           const { jobSeeker_status } = req.query
                        
                        // check for jobId
                        if(!jobId)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'jobId Required'
                            })
                        }

                        // check for job
                        const job = await jobModel.findOne({ jobId : jobId })
                        if(!job)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'job not found'
                            })
                        }
                        const filter = {}

                        if(jobSeeker_status)
                        {
                            filter.jobSeeker_status = jobSeeker_status;
                        }
                        // check for Female job seeker profile for the job

                     const Female_jobseeker = await appliedjobModel.find({
                             gender : 'Female',
                             jobId : jobId,
                             ...filter
                     })
                        if(!Female_jobseeker)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'no Female candidate have applied for these job '
                            })
                        }

                        return res.status(200).json({
                             success : true ,
                             message : 'Female candidate Profile',
                             Female_jobseekerCount : Female_jobseeker.length,
                             Details: Female_jobseeker.map((candidate) => ({
                                _id : candidate._id,
                                jobId : candidate.jobId,
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
                                jobSeeker_status : candidate.jobSeeker_status,
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

        // Get All job seeker profile 
        const get_jobseeker_profile = async( req , res)=>{
            try {
                   const jobId = req.params.jobId
                   const { jobSeeker_status } = req.query

                // check for jobId
                if(!jobId)
                {
                    return res.status(400).json({
                         success : false ,
                         message : 'jobId Required'
                    })
                }

                // check for job
                const job = await jobModel.findOne({ jobId : jobId })
                if(!job)
                {
                    return res.status(400).json({
                         success : false ,
                         message : 'job not found'
                    })
                }
                const filter = {}

                if(jobSeeker_status)
                {
                    filter.jobSeeker_status = jobSeeker_status;
                }

                // check for Other job seeker profile for the job

             const Other_jobseeker = await appliedjobModel.find({
                       jobId : jobId,
                       gender : { $ne : 'Female' },
                       ...filter
                     
             })
                if(!Other_jobseeker)
                {
                    return res.status(400).json({
                         success : false ,
                         message : 'no Other candidate have applied for these job '
                    })
                }

                return res.status(200).json({
                     success : true ,
                     message : 'candidate Profiles',
                     Other_jobseekerCount : Other_jobseeker.length,
                     Details: Other_jobseeker.map((candidate) => ({

                        _id : candidate._id,
                        jobId : candidate.jobId,
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
                        jobSeeker_status : candidate.jobSeeker_status,
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

    // APi for Delete particular job
    const deleteJob = async (req, res) => {
        try {
            const jobId = req.params.jobId;
    
            // Check if jobId is provided
            if (!jobId) {
                return res.status(400).json({
                    success: false,
                    message: 'Job Id is required'
                });
            }
    
            // Find the job
            const job = await jobModel.findOne({ jobId : jobId });
    
            // If job not found
            if (!job) {
                return res.status(400).json({
                    success: false,
                    message: 'Job not found'
                });
            }
    
            // // Check applied candidates for this job
            // const appliedCandidates = await appliedjobModel.find({ jobId: jobId });
    
            // if (appliedCandidates.length > 0) {
            //     // Delete all applied candidates for this job
            //     await appliedjobModel.deleteMany({ jobId: jobId });
            // }
    
            // Delete the job
            await job.deleteOne();
    
            return res.status(200).json({
                success: true,
                message: 'Job deleted successfully'
            });
    
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server Error',
                error_message: error.message
            });
        }
    };

        
 // Api for delete particular candidate/ jobseeker for the job'
          const deleteCandidate = async( req , res)=>{
                  try {
                          const candidateId = req.params.candidateId
                    // check for candidateId
                    if(!candidateId)
                    {
                        return res.status(400).json({
                              success : false ,
                              message : 'Candidate ID required'
                        })
                    }

                    // check for candidate details
                const check_candidate = await appliedjobModel.findOne({
                       _id : candidateId
                })
                   if(!check_candidate)
                   {
                    return res.status(400).json({
                          success : false ,
                          message : 'candidate Details not found' 
                    })
                   }

                      await check_candidate.deleteOne()

                    return res.status(200).json({
                         success : true ,
                         message : 'candidate Profile Deleted successfully'
                    })
                  } catch (error) {
                    return res.status(500).json({
                         success : false ,
                         message : 'Server error',
                         error_message : error.message
                    })
                  }
          }

    
    
          // Api to export candidate with there jobseeker_status

          const export_candidate = async (req, res) => {
            try {
                const { jobSeeker_status } = req.query;
                const { gender } = req.params;
        
                // Define status labels
                const statusLabels = {
                    5: 'Completed',
                    6: 'Shortlisted',
                    7: 'Rejected'
                };
        
                // Check for job seeker status
                if (!jobSeeker_status || !statusLabels[jobSeeker_status]) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid or missing job seeker status value'
                    });
                }
        
                // Check for gender
                if (!gender) {
                    return res.status(400).json({
                        success: false,
                        message: 'Missing gender'
                    });
                }
        
                // Fetch candidates based on gender
                const candidates = await appliedjobModel.find({ gender });
        
                // Filter candidates by job seeker status
                const filteredCandidates = candidates.filter(candidate => candidate.jobSeeker_status == jobSeeker_status);
        
                // Create Excel workbook and worksheet
                const workbook = new ExcelJs.Workbook();
                const worksheet = workbook.addWorksheet("candidates");
        
                // Define the Excel Header
                worksheet.columns = [
                    {
                        header: "First Name",
                        key: "first_Name",
                    },
                    {
                        header: "Last Name",
                        key: "last_Name",
                    },
                    {
                        header: "User Email",
                        key: "user_Email",
                    },
                    {
                        header: "City",
                        key: "city",
                    },
                    {
                        header: "Phone Number",
                        key: "phone_no",
                    },
                    {
                        header: "Status",
                        key: "jobSeeker_status",
                    },
                    {
                        header: "Gender",
                        key: "gender",
                    },
                    {
                        header: "Job Heading",
                        key: "job_Heading",
                    },
                    {
                        header: "Job Id",
                        key: "jobId",
                    },
                    {
                        header: "Highest Education",
                        key: "Highest_Education",
                    },
                    {
                        header: "Total Experience",
                        key: "Total_experience",
                    },
                    {
                        header: "Resume",
                        key: "uploadResume",
                    },
                ];
        
                // Add filtered candidates data to the worksheet
                filteredCandidates.forEach((candidate) => {
                    worksheet.addRow({
                        first_Name: candidate.first_Name,
                        last_Name: candidate.last_Name,
                        user_Email: candidate.user_Email,
                        city: candidate.city,
                        phone_no: candidate.phone_no,
                        jobSeeker_status: statusLabels[jobSeeker_status],
                        gender: candidate.gender,
                        job_Heading: candidate.job_Heading,
                        jobId: candidate.jobId,
                        Highest_Education: candidate.Highest_Education,
                        Total_experience: candidate.Total_experience,
                        uploadResume: candidate.uploadResume,
                    });
                });
        
                // Set response headers for downloading the Excel file
                res.setHeader(
                    "Content-Type",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                );
        
                res.setHeader("Content-Disposition", `attachment; filename=${gender}_${statusLabels[jobSeeker_status]}_candidates.xlsx`);
        
                // Generate and send the Excel File as a response
                await workbook.xlsx.write(res);
        
                // End the response
                res.end();
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "server error" });
            }
        };
        
        
        
        
    
                                                             /*Job Seeker sections */
        // Api for get all Jobs

        const getAll_Jobs = async (req, res) => {
            try {
                const job_status = req.query.job_status
                const filter = {}
                if(job_status)
                    {
                        filter.status = job_status;
                    }
                // Fetch all jobs
                const allJobs = await jobModel.find({ ...filter });
                
                // If no jobs found, return error response
                if (allJobs.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'No jobs found'
                    });
                }
                            // Map job data to desired fromat and count
                            const jobTitle_Count = new Map()
                // Map job data to desired format
                const jobsData = await Promise.all(allJobs.map(async (job) => {
                    // Calculate salary range string
                    const salary_pay = `${job.salary_pay[0].Minimum_pay} - ${job.salary_pay[0].Maximum_pay}, ${job.salary_pay[0].Rate}`;
                
                    // Check if job has expired
                    const today = new Date();
                    const endDate = new Date(job.endDate);
                
                    // if (endDate < today) {
                    //     // Job has expired, send notification
                    //     try {
                    //         await empNotificationModel.create({
                    //             empId: job.emp_Id,
                    //             message: `Your posted job "${job.job_title}" for company "${job.company_name}" has expired`,
                    //             date: today,
                    //             status: 1,
                    //         });
                    //     } catch (notificationError) {
                    //         console.error('Error creating notification:', notificationError);
                    //     }
                    // }
                            // Normalize job title for counting
                            const normalized_title = job.job_title.trim().toLowerCase()
                            jobTitle_Count.set(normalized_title , (jobTitle_Count.get(normalized_title) || 0) + 1)
                    // Find candidate details for the job
                    const candidateDetails = await appliedjobModel.find({
                        jobId: job.jobId
                    });
        
                    // Count male and female candidates
                    const maleCandidateCount = candidateDetails.filter(candidate => candidate.gender === 'Male').length;
                    const femaleCandidateCount = candidateDetails.filter(candidate => candidate.gender === 'Female').length;
                
                    // Return formatted job data with candidate counts
                    return {
                        jobId: job.jobId,
                        job_title: job.job_title,
                        company_name: job.company_name,
                        Number_of_emp_needed: job.Number_of_emp_needed,
                        job_type: job.job_type,
                        job_schedule: job.job_schedule,
                        salary_pay: salary_pay,
                        job_Description: job.job_Description,
                        job_Responsibility : job.job_Responsibility || null,
                        company_address: job.company_address,
                        employee_email: job.employee_email,
                        requirement_timeline: job.requirement_timeline,
                        startDate: job.startDate,
                        endDate: job.endDate,
                        phone_no: job.phone_no,
                        key_qualification: job.key_qualification,
                        Experience: job.Experience,
                        template_type: job.template_type,
                        company_Industry: job.company_Industry,
                        job_photo: job.job_photo,
                        status: job.status,
                        empId: job.emp_Id,
                        isPsychometricTest: job.isPsychometricTest,
                        psychometric_Test: job.psychometric_Test,
                        maleCandidateCount: maleCandidateCount,
                        femaleCandidateCount: femaleCandidateCount,
                        fav_status : job.fav_status,
                        job_image : job.job_image || '',
                        location : job.location
                    };
                }));
                
                   const sortedjobsData = jobsData.sort(( a , b ) => b.createdAt - a.createdAt )

                   // convert job title count to an Array of objects

                   const job_title_array = Array.from(jobTitle_Count.entries()).map(([title , count]) => ({
                        title : title,
                        count : count
                   }))
                // Return successful response with jobs data
                return res.status(200).json({
                    success: true,
                    message: 'All Jobs',
                    JobsCount: allJobs.length,
                    allJobs: sortedjobsData,
                
                });
            } catch (error) {
                // Return error response if any error occurs
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            }
        };


        // All active job count with there title

         const all_active_jobs_Count_with_title = async ( req , res ) => {
            try {
               
                // Fetch all jobs
                const allJobs = await jobModel.find({ status : 1 });
                
                // If no jobs found, return error response
                if (allJobs.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'No jobs found'
                    });
                }
                            // Map job data to desired fromat and count
                            const jobTitle_Count = new Map()
                // Map job data to desired format
                const jobsData = await Promise.all(allJobs.map(async (job) => {
                    // Calculate salary range string
                    const salary_pay = `${job.salary_pay[0].Minimum_pay} - ${job.salary_pay[0].Maximum_pay}, ${job.salary_pay[0].Rate}`;
                
                    // Check if job has expired
                    const today = new Date();
                    const endDate = new Date(job.endDate);
                
                        // Normalize job title for counting
                            const normalized_title = job.job_title.trim().toLowerCase()
                            jobTitle_Count.set(normalized_title , (jobTitle_Count.get(normalized_title) || 0) + 1)
                    // Find candidate details for the job
                    const candidateDetails = await appliedjobModel.find({
                        jobId: job.jobId
                    });
        
                    // Count male and female candidates
                    const maleCandidateCount = candidateDetails.filter(candidate => candidate.gender === 'Male').length;
                    const femaleCandidateCount = candidateDetails.filter(candidate => candidate.gender === 'Female').length;
                
                    // Return formatted job data with candidate counts
                    return {
                        jobId: job.jobId,
                        job_title: job.job_title,
                        company_name: job.company_name,
                        Number_of_emp_needed: job.Number_of_emp_needed,
                        job_type: job.job_type,
                        job_schedule: job.job_schedule,
                        salary_pay: salary_pay,
                        job_Description: job.job_Description,
                        job_Responsibility : job.job_Responsibility || null,
                        company_address: job.company_address,
                        employee_email: job.employee_email,
                        requirement_timeline: job.requirement_timeline,
                        startDate: job.startDate,
                        endDate: job.endDate,
                        phone_no: job.phone_no,
                        key_qualification: job.key_qualification,
                        Experience: job.Experience,
                        template_type: job.template_type,
                        company_Industry: job.company_Industry,
                        job_photo: job.job_photo,
                        status: job.status,
                        empId: job.emp_Id,
                        isPsychometricTest: job.isPsychometricTest,
                        psychometric_Test: job.psychometric_Test,
                        maleCandidateCount: maleCandidateCount,
                        femaleCandidateCount: femaleCandidateCount,
                        fav_status : job.fav_status,
                        job_image : job.job_image || ''
                    };
                }));
                
                   const sortedjobsData = jobsData.sort(( a , b ) => b.createdAt - a.createdAt )

                   // convert job title count to an Array of objects

                   const job_title_array = Array.from(jobTitle_Count.entries()).map(([title , count]) => ({
                        title : title,
                        count : count
                   }))
                // Return successful response with jobs data
                return res.status(200).json({
                    success: true,
                    message: 'All Jobs Count ',
                    JobsCount: allJobs.length,                   
                    jobTitleCounts: job_title_array
                });
            } catch (error) {
                // Return error response if any error occurs
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            } 
         }
        

        // Api for get particular job by jobId

            const getJob = async ( req , res ) => {
                            try {
                                     const jobId = req.params.jobId
                                // check for jobId
                                if(!jobId)
                                    {
                                        return res.status(400).json({
                                             success : false ,
                                             message : 'jobId required'
                                        })
                                    }
                                // check for job

                                const job = await jobModel.findOne({
                                          jobId : jobId
                                })
                                if(!job)
                                    {
                                        return res.status(400).json({
                                             success : false ,
                                             message : 'job not found'
                                        })
                                    }

                            return res.status(200).json({
                                 success : true ,
                                 message : 'job Details',
                                 Details : job
                            })

                            } catch (error) {
                                return res.status(500).json({
                                      success : false ,
                                      message : 'server error',
                                      error_message : error.message
                                })
                            }
            }
                

        

            cron.schedule('* * * * *', async () => {
                try {
                  const currentDate = new Date();
                  currentDate.setHours(0, 0, 0, 0); // Set current time to 00:00:00 for date comparison
              
                  // Find jobs with endDate less than the current date
                  const expiredJob = await jobModel.find({
                    endDate: {
                      $lt: currentDate,
                    },
                    status: { $ne: 3 }, 
                  });
              
                  if (expiredJob.length > 0) {
                    await jobModel.updateMany(
                      {
                        jobId: {
                          $in: expiredJob.map((job) => job.jobId),
                        },
                      },
                      {
                        status: 3,
                      }
                    );
                  }
                } catch (error) {
                  console.error('Error while updating job status:', error);
                }
              });
              

           
// Api for search Job
      
        
        const searchJob = async (req, res) => {
            try {
                const { job_title, company_address } = req.body;
                const { latest_Update, job_type, Experience, company_Industry , job_schedule } = req.query;
        
                // // check for required fields
                // if (!job_title) {
                //     return res.status(400).json({
                //         success: false,
                //         message: 'Job Title required'
                //     });
                // }
                // // if (!company_address) {
                //     return res.status(400).json({
                //         success: false,
                //         message: 'Company address Required'
                //     });
                // }
        
                const filter = {};
        
                if (latest_Update) {
                    filter.updatedAt = {
                        $gte: new Date(latest_Update),
                    };
                }
                if (job_type) {
                    filter.job_type = job_type; 
                }               
                if (job_schedule) {
                    filter.job_schedule = job_schedule; 
                }               
                
                if (Experience) {
                    filter.Experience = { $regex: Experience, $options: 'i' } ;                     
                }
                if (company_Industry) {
                    filter.company_Industry = company_Industry ;                     
                }
        
                // Use regular expressions to perform partial matches
                const jobs = await jobModel.find({
                    status: 1,
                    job_title: { $regex: job_title, $options: 'i' }, // Case insensitive
                    company_address: { $regex: company_address, $options: 'i' },
                    ...filter
                });
        
                if (jobs.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'No jobs found'
                    });
                }
        
                return res.status(200).json({
                    success: true,
                    message: 'Job Details',
                    JobsCount : jobs.length,
                    Details: jobs
                });
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            }
        };


// Api for filter job

const filterJob = async (req, res) => {
    try {
        const { job_title, company_address } = req.body;
        const { job_type, Experience, company_Industry, job_schedule } = req.query;

        // // Check for required fields
        // if (!job_title) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Job Title required'
        //     });
        // }
        // if (!company_address) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Company address Required'
        //     });
        // }

        const filter = {};

        if (job_type) {
            filter.job_type = job_type;
        }
        if (job_schedule) {
            filter.job_schedule = job_schedule;
        }
        if (Experience) {
            // Convert Experience to a regular expression for partial matching
            filter.Experience = { $regex: Experience, $options: 'i' };
        }
        if (company_Industry) {
            filter.company_Industry = company_Industry;
        }

        // Use regular expressions to perform partial matches
        const jobs = await jobModel.find({
            status: 1,
            job_title: { $regex: job_title, $options: 'i' }, // Case insensitive
            company_address: { $regex: company_address, $options: 'i' },
            ...filter
        });

        if (jobs.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No jobs found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Job Details',
            JobsCount: jobs.length,
            Details: jobs
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};



        
        

                                                     /* Applied job section */

        // APi for apply on job

                    const apply_on_job = async (req, res) => {
                        try {
                            const jobId = req.params.jobId;
                            const {
                                first_Name,
                                last_Name,
                                user_Email,
                                city,
                                state,
                                phone_no,
                                gender,
                                Highest_Education,
                                job_experience,
                                Total_experience,
                                time_range_for_interview
                            } = req.body;
                    
                            // Check for JobId
                            if (!jobId) {
                                return res.status(400).json({
                                    success: false,
                                    message: 'job Id required'
                                });
                            }
                                        if(!city)
                                        {
                                            return res.status(400).json({
                                                 success : false ,
                                                 message : 'Required Destrict'
                                            })
                                        }
                                        if(!state)
                                            {
                                                return res.status(400).json({
                                                     success : false ,
                                                     message : 'Required Country'
                                                })
                                            }
                            // Check for required fields
                            const requiredFields = ["first_Name", "last_Name", "user_Email", 
                                 "phone_no", "gender", "Highest_Education", "job_experience",
                                "Total_experience", 
                            ];
                    
                            for (const field of requiredFields) {
                                if (!req.body[field]) {
                                    return res.status(400).json({
                                        message: `Missing ${field.replace("_", " ")}`,
                                        success: false,
                                    });
                                }
                            }
                    
                            // Check for job
                            const job = await jobModel.findOne({
                                jobId: jobId,
                                status : 1
                            });
                            if (!job) {
                                return res.status(400).json({
                                    success: false,
                                    message: 'active job not found'
                                });
                            }
                    
                            // Access job Details
                            const job_Heading = job.job_title;
                            const Salary = `${job.salary_pay[0].Minimum_pay} - ${job.salary_pay[0].Maximum_pay}, ${job.salary_pay[0].Rate}`;
                            const job_expired_Date = job.endDate;
                            const job_status = job.status;
                            const company_name = job.company_name;
                            const empId = job.emp_Id
                    
                            // Check if job seeker has already applied for this job
                            const jobseeker_apply = await appliedjobModel.findOne({
                                user_Email : user_Email,
                                jobId: jobId
                            });
                    
                            if (jobseeker_apply) {
                                return res.status(400).json({
                                    success: false,
                                    message: 'you already applied on this job'
                                });
                            }
                                            
                                                // Upload resume file

                        const uploadResume = req.file ? req.file : null;
                        if (!uploadResume) {
                            return res.status(400).json({
                                success: false,
                                message: 'CV required'
                            });
                        }

                        // Check if the uploaded file is a PDF
                        const allowedExtensions = ['.pdf'];
                        let fileExtension = uploadResume.originalname ? uploadResume.originalname.split('.').pop().toLowerCase() : null;
                        fileExtension = fileExtension.trim()


                        if (!fileExtension || !allowedExtensions.includes('.' + fileExtension)) {
                        
                            return res.status(400).json({
                                success: false,
                                message: 'Only PDF files are allowed for resume upload'
                            });
                        }

                            // Add new data
                            const newData = new appliedjobModel({
                                first_Name,
                                last_Name,
                                user_Email,
                                city,
                                state,
                                phone_no,
                                gender,
                                Highest_Education,
                                job_experience,
                                Total_experience,
                                time_range_for_interview,
                                uploadResume : uploadResume.filename,
                                job_Heading,
                                Salary,
                                job_expired_Date,
                                job_status,
                                jobId : jobId,
                                candidateStatus : 1,
                                job_title : job.job_title,
                                company_location : job.company_address
                            });
                            
                            try {
                                var newNotification = await empNotificationModel.create({
                                    empId: empId,
                                    message: `${first_Name} applied on job ${job_Heading}`,
                                    date: new Date(),
                                    status: 1,
                                });
                            
                                await newNotification.save();
                            } catch (notificationError) {
                                // Handle notification creation error
                                console.error('Error creating notification:', notificationError);
                                // Optionally, you can choose to return an error response here or handle it in another way
                            }
                            await newData.save();
                    
                            const emailContent = `<!DOCTYPE html>
                            <html lang="en">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <title></title>
                            </head>
                            <body style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px;">
                
                                <div style="background-color: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                                    <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Job Application Confirmation</h2>
                                    <p>Thank you for applying for the <strong> ${job_Heading} </strong> position at <strong> ${company_name}</strong>.  Your application has been received, and we appreciate your interest in joining our team. Our hiring team will carefully review your qualifications, and if your skills and experience align with our requirements, we will be in touch to discuss next steps. In the meantime, feel free to explore more about our company and the opportunities we offer. Thank you again for considering <strong> ${company_name} </strong> as your potential employer.</p>
                                    <p>Your job application for " <strong> ${job_Heading} </strong> " has been successfully received. A confirmation email will be sent to you shortly.</p>
                                    <p>If you have any questions, feel free to contact us.</p> <br>
                                

                                 <P><strong> ${company_name} </strong> </P> 

               
                            </body>
                            </html>`;
                    
                            sendjobEmail  (user_Email, `Job Application Confirmation ..!`, emailContent);

                    
                            return res.status(200).json({
                                success: true,
                                message: 'job Applied successfully'
                            });
                        } catch (error) {
                            return res.status(500).json({
                                success: false,
                                message: 'server error',
                                error_message: error.message
                            });
                        }
                    }
        
                                                            /* Notification section */
    // Api for get Notification of the particular employee
       const getNotification_emp = async( req , res)=>{
                try {
                      const empId = req.params.empId
                    // check for empId
                    if(!empId)
                    {
                        return res.status(400).json({
                             success : false ,
                             message : 'empId required'
                        })
                    }

                    // check for employee
                    const checkemp = await employeeModel.findOne({
                             _id : empId
                    })
                    if(!checkemp)
                    {
                        return res.status(400).json({ 
                             success : false ,
                             message : 'client not exist'
                        })
                    }
                    
                    // check for client notification
                 const c_Notification = await empNotificationModel.find({
                     empId : empId,
                     status : 1
                 })

                   if(!c_Notification)
                   {
                    return res.status(200).json({
                         success : false ,
                         message : 'No Notification Yet'
                    })
                   }

                    
                     const sortedNotification = await c_Notification.sort((a, b) => b.createdAt - a.createdAt);

                   return res.status(200).json({
                      success : true ,
                      message : 'all Notifications of client',
                      NotificationCount : sortedNotification.length,
                      notification_details : sortedNotification
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
       const seenNotification = async (req, res) => {
        try {
            const notification_id = req.params.notification_id;
      
            // check for required fields
            if (!notification_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Notification Id required'
                });
            }
      
            // Check for notification in both models
            let notification = await empNotificationModel.findOne({ _id: notification_id });      
      
            if (notification) {
                // Update the notification status
                notification.status = 0;
                await notification.save();
      
                return res.status(200).json({
                    success: true,
                    message: 'Notification seen '
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Notification not found'
                });
            }
        } catch (error) {
           
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message : error.message
            });
        }
      };
  // Api for get unseenNotification count
      const unseenNotificationCount = async( req , res)=>{
          try {
                  const empId = req.params.empId
                // check for empId
            if(!empId)
            {
                return res.status(400).json({
                     success : false ,
                     message : 'client Id required'
                })
            }

            // check for Notification

            const unseenNotification = await empNotificationModel.find({
                   empId : empId,
                   status : 1
            })

            if(!unseenNotification)
            {
                return res.status(200).json({
                     success : false ,
                     message : 'no unseen Notification found'
                })
            }

              return res.status(200).json({
                 success : true ,
                 message : 'unseen Notification count',
                 unseenNotificationCount :  unseenNotification.length
              })
          } catch (error) {
            return res.status(500).json({
                 success : false ,
                 message : 'server error',
                 error_message : error.message
            })
          }
      }                                                 
                                                    /* Privacy Policy */
 // Api for get all client privacy & policy

                    const get_privacy_policy = async( req ,res)=>{
                        try {
                              const all_privacy_policy = await privacy_policyModel.findOne({ })
                              if(!all_privacy_policy)
                              {
                                 return res.status(400).json({
                                      success : false ,
                                      message : 'no privacy & policy found'
                                 })
                             }
                                     
                                 return res.status(200).json({
                                      success : true ,
                                      message : 'privacy & policy',
                                      Details : all_privacy_policy
                                 })                                  
                              
                             
                        } catch (error) {
                         return res.status(500).json({
                              success : false ,
                              message : 'server error',
                              error_message : error.message
                         })
                        }
                 }


                                                   /* Term & Condition Section */

                                                   const get__admin_term_condition = async( req ,res)=>{
                                                    try {
                                                           // check for all client term & condition
                                                        const get_t_c = await term_condition.find({ })
                                                          if(!get_t_c)
                                                          {
                                                            return res.status(400).json({
                                                                  success : false ,
                                                                  message : 'No Term & Condition Details found'
                                                            })
                                                          }
                                                              
                                                            return res.status(200).json({
                                                                 success : true ,
                                                                 message : 'term & Conditions',
                                                                 Details : get_t_c
                                                            })
                                                        
                                                    } catch (error) {
                                                           return res.status(500).json({
                                                              success : false ,
                                                              message : 'server error',
                                                              error_message : error.message
                                                           })
                                                    }
                                                }
                            
                            
  
                                            /* Api for service page Section */
        
                  // Api for get Services Details
              const getServices_of_smart_start = async( req , res)=>{
                   try {
                              // check for services 
                        const checkService = await services.find({ })
                        if(!checkService)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'No services found',
                            })
                        }
                          return res.status(200).json({
                             success : true ,
                             message : 'All Services',
                             Details : checkService
                          })
                   } catch (error) {
                    return res.status(500).json({
                         success : false ,
                         message : 'server error',
                         error_message : error.message
                    })
                   }
              }
                                          
                                                            /*CMS section */
                // Api for dashboard counts
            const dashboard_counts = async( req ,res)=>{
                    try {
                            // check for all active jobs
                        const checkActive_jobs = await jobModel.find({
                               status : 1
                        })
                        if(!checkActive_jobs)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'no active job found'
                            })
                        }
                         
                        // check for all clients
                        const all_clients = await employeeModel.find({ })
                        if(!all_clients)
                        {
                            return res.status(400).json({
                                  success : false ,
                                  message : 'no clients found'
                            })
                        }

                        // check for all candidate 
                      const all_candidate = await appliedjobModel.find({ })
                        if(!all_candidate)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'no candidates found'
                            })
                        }

                         // check for female candidates

                         const all_femaleCandidates = await appliedjobModel.find({
                               gender : 'Female'
                         })

                        if(!all_femaleCandidates)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'no female candidate found'
                            })
                        }

                         return res.status(200).json({
                             success : true ,
                             message : 'Dashboard Details',
                             active_jobs_count : checkActive_jobs.length,
                             all_clients_count : all_clients.length,
                             all_cvCount : all_candidate.length,
                             all_femaleCandidates_count : all_femaleCandidates.length,
                             allCandidates : all_candidate.length


                         })
                       
                    } catch (error) {
                        return res.status(500).json({
                               success : false ,
                               message : 'server error',
                               error_message : error.message  
                        })
                    }
            }

        // Api for  getJobs_posted_procedure_section1 
        const cms_getJobs_posted_procedure_section1 = async (req, res) => {
    try {
        const details = await cms_job_posting_sectionModel.find({ });
        
        if (!details || details.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No details found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Details',
            Details: details
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
}
  // Api for section 2
const cms_get_need_any_job_section = async (req, res) => {
    try {
        const details = await cms_need_any_job_section_Model.find({ });
        
        if (!details || details.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No details found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Details',
            Details: details
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
}

// Api for section 3
const get_cms_post_your_job = async (req, res) => {
    try {
        const details = await cms_postjobModel.find({ });
        
        if (!details || details.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No details found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Details',
            Details: details
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
}

const cms_getjob_market_data = async (req, res) => {
    try {
        const details = await cms_jobMarketData.find();
        
        if (!details || details.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No details found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Details',
            Details: details
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
}


// Api for client Dashboard count
const client_dashboardCount = async (req, res) => {
    try {
        const client_id = req.params.client_id;
        
        // Check for client id
        if (!client_id) {
            return res.status(400).json({
                success: false,
                message: 'Client Id is required'
            });
        }

        // Check for client existence
        const client = await employeeModel.findById(client_id);
        if (!client) {
            return res.status(400).json({
                success: false,
                message: 'Client not found'
            });
        }

        // Check total job posted by client
        const totalJobs = await jobModel.find({ emp_Id: client_id });
        

        // Check for active jobs
        const active_jobs = await jobModel.find({ emp_Id: client_id, status: 1 });
       

        // Check for female candidates
        const femaleCandidates = await appliedjobModel.find({ jobId: { $in: totalJobs.map(job => job.jobId) }, gender: 'Female' });
       

        // Check for total candidates applied
        const totalCandidates = await appliedjobModel.find({ jobId: { $in: totalJobs.map(job => job.jobId) } });
        

        return res.status(200).json({
            success: true,
            message: 'Details',
            totalJobCount: totalJobs.length,
            active_jobsCount: active_jobs.length,
            femaleCandidateCount: femaleCandidates.length,
            totalCandidateCount: totalCandidates.length
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};


               

                                                   /* Contact US Page */

            // Api for create Contact us page 

                   const create_contactUS = async ( req , res )=>{
                           try {
                                   const { name , email , phone_no , subject , message } = req.body
                            // check for required fields

                            const requiredFields = ['name', 'email' , 'phone_no' ,'subject', 'message']
                            for(const field of requiredFields)
                                {
                                    if(!req.body[field])
                                        {
                                             return res.status(400).json({
                                                    success : false ,
                                                    message : `missing ${field.replace('_' , ' ')} filed`
                                             })
                                        }
                                }

                                // create new Data

                                const newData = new contactUsModel({
                                         name ,
                                         email , 
                                         phone_no,
                                         subject,
                                         message
                                })

                                    await newData.save()

                                    return res.status(200).json({
                                          success : true ,
                                          message : 'your Query Recieved Successfully'
                                    })
                           } catch (error) {
                              return res.status(500).json({
                                     success : false ,
                                     message : ' server error',
                                     error_message : error.message
                              })
                           }
                   }


        // Api for fixit finder

        const fixit_finder = async (req, res) => {
            try {
                const { job_title, company_location } = req.body;
        
                // // Check for required fields
                if (!job_title) {
                    return res.status(400).json({
                        success: false,
                        message: 'Job Title is required'
                    });
                }
                
                // if (!company_location) {
                //     return res.status(400).json({
                //         success: false,
                //         message: 'Company Location is required'
                //     });
                // }
        
                // Ensure job_title and company_location are strings
                if (typeof job_title !== 'string' || typeof company_location !== 'string') {
                    return res.status(400).json({
                        success: false,
                        message: 'Job Title and Company Location must be strings'
                    });
                }
        
                // // Use regular expressions to perform partial matches
                // const candidates = await appliedjobModel.find({
                //     job_title: { $regex: job_title, $options: 'i' }, // Case insensitive
                //     company_location: { $regex: company_location, $options: 'i' },
                // });

                //     // check for uploaded resume sections profile
                // const d_candidate = await ResumeModel.find({
                //     job_title : { $regex: job_title, $options: 'i' },
                //     city : {$regex: company_location, $options: 'i'}
                // })

                // Check fixit_finder_model for matching skills and location
                const fixit_candidates = await fixit_finder_model.find({
                    skills: { $regex: job_title, $options: 'i' },
                    location: { $regex: company_location, $options: 'i' },
                });

                const all_candidates = [ ...fixit_candidates ] 
        
                if (all_candidates.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'No candidates found'
                    });
                }
        
                return res.status(200).json({
                    success: true,
                    message: 'Candidate Details',
                    candidateCount: all_candidates.length,
                    details: all_candidates
                });
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            }
        };
        
       
                                                        /*  upload Resume */
                                                        const uploadResume = async (req, res) => {
                                                            try {
                                                                const {
                                                                    first_Name,
                                                                    last_Name,
                                                                    email,
                                                                    city,
                                                                    phone_no,
                                                                    gender,
                                                                    job_title,
                                                                    Highest_Education,
                                                                    candidate_status,
                                                                    jobSeeker_status,
                                                                    home_address,
                                                                    location
                                                                } = req.body;
                                                                

                                                                if(!city)
                                                                    {
                                                                        return res.status(400).json({
                                                                             success : false ,
                                                                             message : 'Required Destrict'
                                                                        })
                                                                    }
                                                                // Required fields
                                                                const requiredFields = [
                                                                    'first_Name',
                                                                    'last_Name',
                                                                    'email',
                                                                    
                                                                    'phone_no',
                                                                    'gender',
                                                                    'job_title',
                                                                    'Highest_Education'
                                                                ];
                                                        
                                                                // Check for missing fields
                                                                const missingField = requiredFields.reduce((missing, field) => {
                                                                    if (!req.body[field]) {
                                                                        return field;
                                                                    }
                                                                    return missing;
                                                                }, null);
                                                        
                                                                if (missingField) {
                                                                    return res.status(400).json({
                                                                        success: false,
                                                                        message: `${missingField} required`
                                                                    });
                                                                }
                                                                     // check for exist user

                                                                     const existUser = await ResumeModel.findOne({ user_Email : email })

                                                                     if(existUser)
                                                                        {
                                                                            return res.status(400).json({
                                                                                 success : false ,
                                                                                 message : 'already applied with these email'
                                                                            })
                                                                        }
                                                                const uploadResume = req.file || null;
                                                                if (!uploadResume) {
                                                                    return res.status(400).json({
                                                                        success: false,
                                                                        message: 'Resume required'
                                                                    });
                                                                }
                                                        
                                                                // Check if the uploaded file is a PDF
                                                                const allowedExtensions = ['.pdf'];
                                                                const fileExtension = uploadResume.originalname
                                                                    ? `.${uploadResume.originalname.split('.').pop().toLowerCase().trim()}`
                                                                    : null;
                                                        
                                                                if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
                                                                    return res.status(400).json({
                                                                        success: false,
                                                                        message: 'Only PDF files are allowed for resume upload'
                                                                    });
                                                                }
                                                        
                                                                // Add new data, saving the filename as a string
                                                                const newData = new ResumeModel({
                                                                    first_Name,
                                                                    last_Name,
                                                                    user_Email :  email,
                                                                    city,
                                                                    phone_no,
                                                                    gender,
                                                                    job_Heading :  job_title,
                                                                    Highest_Education,
                                                                    upload_Resume: uploadResume.filename, // Save the filename
                                                                    candidate_status,
                                                                    jobSeeker_status,
                                                                    home_address,
                                                                    location
                                                                });
                                                        
                                                                await newData.save();
                                                        
                                                                return res.status(200).json({
                                                                    success: true,
                                                                    message: 'Resume uploaded successfully'
                                                                });
                                                            } catch (error) {
                                                                return res.status(500).json({
                                                                    success: false,
                                                                    message: 'Server error',
                                                                    error_message: error.message
                                                                });
                                                            }
                                                        };
                                                        
            // Api for get All uploaded resume 's section candidate profile
            
    const get_upload_section_candidates = async ( req , res ) => {
          try {
                    const get_details = await ResumeModel.find({ })

                         if(!get_details)
                            {
                                return res.status(400).json({
                                     success : false ,
                                     message : 'No Candidate found'
                                })
                            }

                    return res.status(200).json({
                         success : true ,
                         message : 'all Candidates',
                         candidates : get_details
                    })
          } catch (error) {
                return res.status(500).json({
                     success : false ,
                     message : 'server error',
                     error_message : error.message
                })
          }
    }
                          
    
    const candidate_recruitment_process_for_uploaded_candidate = async (req, res) => {
        try {
            const candidateId = req.params.candidateId;
            const { seeker_status } = req.body;
                          
            // Check for candidateId
            if (!candidateId) {
                return res.status(400).json({
                    success: false,
                    message: 'Candidate ID is required'
                });
            }
    
            // Check for candidate
            const candidate = await ResumeModel.findOne({ _id: candidateId });
            if (!candidate) {
                return res.status(400).json({
                    success: false,
                    message: 'Candidate not found'
                });
            }

                  if(seeker_status === 4)
                    {
                        candidate.jobSeeker_status = seeker_status
                        candidate.candidate_status = 3
                    }
                 else if (seeker_status === 6)
                    {
                        candidate.jobSeeker_status = seeker_status
                        candidate.candidate_status = 0
                    }
                    else
                    {
                        candidate.jobSeeker_status = seeker_status
                        candidate.candidate_status = 2
                    }

                    await candidate.save()                 
    
            // Return success response
            res.status(200).json({
                success: true,
                message: 'Jobseeker status updated'
               
            });
        } catch (error) {
            // Handle server errors
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message
            });
        }
    };
    
        
    // Api for get All successfull candidate 

    const get_successfull_candidate = async (req, res) => {
        try {
          // Find candidates with jobSeeker_status 4
          const c1 = await appliedjobModel.find({
            jobSeeker_status: 4
          });
      
          const c2 = await ResumeModel.find({
            jobSeeker_status: 4
          });
      
          // Combine both results
          const all_successfull_candidate = [...c1, ...c2];
      
          // Check if no candidates found
          if (all_successfull_candidate.length === 0) {
            return res.status(400).json({
              success: false,
              message: 'No candidate found'
            });
          }
      
          // Sort candidates by createdAt date in descending order
          const sorted_c = all_successfull_candidate.sort((a, b) => b.createdAt - a.createdAt);
      
          // Prepare the response data
          const responseDetails = sorted_c.map((c) => ({
            first_Name: c.first_Name || c.first_name,
            last_Name: c.last_Name,
            user_Email: c.user_Email,
            city: c.city,
            gender: c.gender,
            job_Heading: c.job_Heading,
            phone_no: c.phone_no,
            Highest_Education: c.Highest_Education,
            jobSeeker_status: c.jobSeeker_status
          }));
      
          // Send the response
          return res.status(200).json({
            success: true,
            message: 'All Successful Candidates',
            Details: responseDetails
          });
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
          });
        }
      };
      

                                                               /* Blog Details Comment */
        // Api for blog Details comment

           const blog_section_comment = async ( req , res)=> {
             try {
                       const { Name , email , comment } = req.body
                    // check for required fields

                    if(!Name)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'Name Required'
                            })
                        }
                    if(!email)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'email Required'
                            })
                        }
                    if(!comment)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'comment Required'
                            })
                        }
                    
                    // create New Data
                     const newData = new blog_section_comment_Model({
                             Name ,
                             email,
                             comment
                     })
                     await newData.save()

                      return res.status(200).json({
                         success : true ,
                         message : 'New Comment Posted successfully'
                      })

             } catch (error) {
                  return res.status(500).json({
                     success : false ,
                     message : 'server error',
                     error_message : error.message
                  })
             }
           }
                

      // Api for get all blog comment section Details
         const get_all__blog_section_comments = async ( req , res)=> {
             try {
                     const all_details = await blog_section_comment_Model.find()
                     if(!all_details)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'no comment found'
                            })
                        }

                        return res.status(200).json({
                             success : true ,
                             message : 'all Blog comment',
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
        



         const download_jd = async (req, res) => {
            try {
                const jd_id = req.params.jd_id;
        
                if (!jd_id) {
                    return res.status(400).json({
                        success: false,
                        message: 'Job ID required',
                    });
                }
        
                const jd = await jobDescription_model.findById(jd_id);
                if (!jd) {
                    return res.status(400).json({
                        success: false,
                        message: 'Job Description not found',
                    });
                }
        
                const { jobTitle, job_Description, Responsibilities } = jd;
        
                const pdfDoc = await PDFDocument.create();
                const page = pdfDoc.addPage();
                const { width, height } = page.getSize();
        
                const fontSize = 12;
                const titleFontSize = 20;
                const headingFontSize = 16;
                const textColor = rgb(0, 0, 0);
                const bulletColor = rgb(0.1, 0.1, 0.1);
                const margin = 50;
                const maxWidth = width - 2 * margin;
        
                const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        
                const wrapText = (text, font, fontSize, maxWidth) => {
                    const words = text.split(' ');
                    let lines = [];
                    let currentLine = words[0];
        
                    for (let i = 1; i < words.length; i++) {
                        const word = words[i];
                        const width = font.widthOfTextAtSize(currentLine + ' ' + word, fontSize);
                        if (width < maxWidth) {
                            currentLine += ' ' + word;
                        } else {
                            lines.push(currentLine);
                            currentLine = word;
                        }
                    }
                    lines.push(currentLine);
                    return lines;
                };
        
                const renderNode = (node, x, y, font, fontSize, maxWidth) => {
                    let currentY = y;
        
                    const drawText = (text, options) => {
                        const lines = wrapText(text, options.font, options.size, maxWidth);
                        lines.forEach(line => {
                            page.drawText(line, {
                                x: options.x,
                                y: currentY,
                                size: options.size,
                                color: options.color,
                                font: options.font,
                            });
                            currentY -= options.size + 4;
                        });
                    };
        
                    if (node.nodeName === '#text') {
                        const text = node.value.trim();
                        if (text) {
                            drawText(text, { x, size: fontSize, color: textColor, font });
                        }
                    } else if (node.nodeName === 'b' || node.nodeName === 'strong') {
                        node.childNodes.forEach(childNode => {
                            if (childNode.nodeName === '#text') {
                                const text = childNode.value.trim();
                                if (text) {
                                    drawText(text, { x, size: fontSize, color: textColor, font });
                                }
                            } else {
                                currentY = renderNode(childNode, x, currentY, font, fontSize, maxWidth);
                            }
                        });
                    } else if (node.nodeName === 'i' || node.nodeName === 'em') {
                        node.childNodes.forEach(childNode => {
                            if (childNode.nodeName === '#text') {
                                const text = childNode.value.trim();
                                if (text) {
                                    drawText(text, { x, size: fontSize, color: textColor, font });
                                }
                            } else {
                                currentY = renderNode(childNode, x, currentY, font, fontSize, maxWidth);
                            }
                        });
                    } else if (node.nodeName === 'p' || node.nodeName === 'div') {
                        node.childNodes.forEach(childNode => {
                            currentY = renderNode(childNode, x, currentY, font, fontSize, maxWidth);
                        });
                        currentY -= 10; // Extra space after paragraph
                    } else if (node.nodeName === 'ul' || node.nodeName === 'ol') {
                        node.childNodes.forEach((liNode, index) => {
                            if (liNode.nodeName === 'li') {
                                const bullet = node.nodeName === 'ul' ? '• ' : `${index + 1}. `;
                                const bulletWidth = font.widthOfTextAtSize(bullet, fontSize);
                                
                                // Draw the bullet
                                page.drawText(bullet, {
                                    x: x,
                                    y: currentY,
                                    size: fontSize,
                                    color: bulletColor,
                                    font,
                                });
                                
                                // Draw the list item content with indentation
                                currentY = renderNode(liNode, x + bulletWidth + 10, currentY, font, fontSize, maxWidth - bulletWidth - 10);
                            }
                        });
                        currentY -= 10; // Extra space after list
                    } else {
                        node.childNodes.forEach(childNode => {
                            currentY = renderNode(childNode, x, currentY, font, fontSize, maxWidth);
                        });
                    }
        
                    return currentY;
                };
        
                // Parse HTML and render content
                const parseAndRenderHTML = (html, startY) => {
                    const fragment = parse5.parseFragment(html);
                    let currentY = startY;
        
                    fragment.childNodes.forEach(node => {
                        currentY = renderNode(node, margin, currentY, font, fontSize, maxWidth);
                    });
        
                    return currentY;
                };
        
                // Add job title
                page.drawText(jobTitle, {
                    x: margin,
                    y: height - margin,
                    size: titleFontSize,
                    color: rgb(0, 0, 1),
                    font,
                });
        
                // Add job description
                page.drawText('Job Description', {
                    x: margin,
                    y: height - margin - 40,
                    size: headingFontSize,
                    color: rgb(0, 0, 1),
                    font,
                });
        
                let y = height - margin - 60;
                y = parseAndRenderHTML(job_Description, y);
        
                // Add job responsibilities
                page.drawText('Job Responsibilities', {
                    x: margin,
                    y: y - 20,
                    size: headingFontSize,
                    color: rgb(0, 0, 1),
                    font,
                });
        
                y -= 40;
                parseAndRenderHTML(Responsibilities, y);
        
                const pdfBytes = await pdfDoc.save();
        
                res.set({
                    'Content-Type': 'application/pdf',
                    'Content-Length': pdfBytes.length,
                    'Content-Disposition': `attachment; filename=job_description.pdf`,
                });
        
                res.send(Buffer.from(pdfBytes));
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message,
                });
            }
        };


    
   // Api for share candidate CV
   const share_cv = async (req, res) => {
    try {
        const candidate_id = req.params.candidate_id;
        const { to, from, subject, message } = req.body;

        // Check for candidate_id
        if (!candidate_id) {
            return res.status(400).json({
                success: false,
                message: 'Candidate ID required'
            });
        }

        // Check for required fields
        if (!to || (typeof to === 'string' && !validator.isEmail(to)) || (Array.isArray(to) && to.length === 0)) {
            return res.status(400).json({
                success: false,
                message: 'Receiver email(s) required'
            });
        }
        if (typeof to === 'string') {
            to = [to];  // Convert to a single-element array
        }
        if (!from || !validator.isEmail(from)) {
            return res.status(400).json({
                success: false,
                message: 'Valid sender email required'
            });
        }
        if (!subject) {
            return res.status(400).json({
                success: false,
                message: 'Subject is required'
            });
        }

        // Validate receiver emails
        for (let email of to) {
            if (!validator.isEmail(email)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid email address in receiver list: ${email}`
                });
            }
        }

        // Check for candidate profile
        const candidate = await appliedjobModel.findOne({ _id: candidate_id });
        if (!candidate) {
            return res.status(400).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        // Check for candidate CV
        const candidate_cv = path.resolve(__dirname, '..', 'uploads', candidate.uploadResume);
        if (!fs.existsSync(candidate_cv)) {
            return res.status(400).json({
                success: false,
                message: `Candidate CV not found at path: ${candidate_cv}`
            });
        }

        // Setup nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            requireTLS: true,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        // Prepare email options
        const mailOptions = {
            from: from,
            to: to.join(', '), 
            subject: subject,
            text: message || 'Please find the attached CV.',
            attachments: [
                {
                    filename: candidate.uploadResume,
                    path: candidate_cv,  
                    contentType: 'application/pdf'
                }
            ]
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error sending email',
                    error_message: error.message
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'Email sent successfully',
                    
                });
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


  // Api for save candidate profile 
  const save_candidate_profile_for_later = async (req, res) => {
    try {
        const { candidate_id } = req.params;

        // Validate candidate_id
        if (!candidate_id) {
            return res.status(400).json({
                success: false,
                message: 'Candidate ID is required.'
            });
        }

        // Check if candidate profile exists
        const candidate = await appliedjobModel.findById(candidate_id);
        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found.'
            });
        }

        // Check if the associated job exists
        const job = await jobModel.findOne({ jobId: candidate.jobId });
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found for the candidate.'
            });
        }

        // Check if the candidate profile is already saved
        let existingSavedProfile = await save_candidate_profile.findOne({ candidate_id });

        if (existingSavedProfile) {
            // If already saved, unsave and update the candidate status
            await existingSavedProfile.deleteOne();
            candidate.saved_status = 0;
            await candidate.save();

            return res.status(200).json({
                success: true,
                message: 'Candidate profile unsaved successfully.'
            });
        }

        // Save the candidate profile and update the candidate status
        existingSavedProfile = new save_candidate_profile({ 
            candidate_id,
            client_id: job.emp_Id
        });
        await existingSavedProfile.save();

        candidate.saved_status = 1;
        await candidate.save();

        return res.status(200).json({
            success: true,
            message: 'Candidate profile saved successfully.'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error.',
            error_message: error.message
        });
    }
};



    // get all the saved candidate profile of the client 
    const get_saved_candidate_profile = async (req, res) => {
        try {
            const { client_id } = req.params;
    
            // Check for client ID
            if (!client_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Client ID is required.'
                });
            }
    
            // Get all saved candidates for the client
            const savedProfiles = await save_candidate_profile.find({ client_id });
    
            // Check if there are any saved profiles
            if (savedProfiles.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No profiles saved yet.'
                });
            }
    
            // Retrieve detailed information for each candidate
            const candidateDetails = await Promise.all(
                savedProfiles.map(async (profile) => {
                    const candidate = await appliedjobModel.findById(profile.candidate_id).select(
                        'firstname user_Email phone_no city state Total_experience job_experience uploadResume jobSeeker_status'
                    );
    
                    if (!candidate) {
                        return null;
                    }
    
                    // Format the candidate data
                    return {
                        name: candidate.firstname,
                        email: candidate.user_Email,
                        phone_no: candidate.phone_no,
                        location: `${candidate.city}, ${candidate.state}`,
                        Total_experience: candidate.Total_experience,
                        job_experience: candidate.job_experience,
                        CV: candidate.uploadResume,
                        jobSeeker_status: candidate.jobSeeker_status,
                    };
                })
            );
    
            // Filter out null values (in case a candidate ID does not have corresponding data)
            const filteredCandidateDetails = candidateDetails.filter((detail) => detail !== null);
    
            return res.status(200).json({
                success: true,
                candidates: filteredCandidateDetails,
                message: 'Saved candidate profiles retrieved successfully.'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error.',
                error_message: error.message
            });
        }
    };
    
// Api for update candidate rating 
    const update_candidate_rating = async (req, res) => {
        try {
            const candidate_id = req.params.candidate_id;
            const rating = req.body.rating;
    
            // Check for candidate ID
            if (!candidate_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Candidate ID is required'
                });
            }
    
            // Check if rating is provided and valid
            if (rating === undefined || isNaN(rating) || rating < 1 || rating > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'Valid rating is required (1 to 5)'
                });
            }
    
            // Check for candidate
            const candidate = await appliedjobModel.findOne({ _id: candidate_id });
            if (!candidate) {
                return res.status(400).json({
                    success: false,
                    message: 'Candidate not found'
                });
            }
    
            // Update candidate rating
            candidate.candidate_rating = rating;
            await candidate.save();
    
            return res.status(200).json({
                success: true,
                message: 'Rating updated successfully'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message
            });
        }
    };

// Api for get female candidate for client 
const get_female_candidate_for_client = async (req, res) => {
    try {
        const client_id = req.params.client_id;
        
        // Check for client id
        if (!client_id) {
            return res.status(400).json({
                success: false,
                message: 'Client Id is required'
            });
        }

        // Check for client existence
        const client = await employeeModel.findById(client_id);
        if (!client) {
            return res.status(400).json({
                success: false,
                message: 'Client not found'
            });
        }

        // Check total job posted by client
        const totalJobs = await jobModel.find({ emp_Id: client_id });
        
  

        // Check for female candidates
        const femaleCandidates = await appliedjobModel.find({ jobId: { $in: totalJobs.map(job => job.jobId) }, gender: 'Female' }).sort({ createdAt : -1 }).lean()
       

        

        return res.status(200).json({
            success: true,
            message: 'Female Candidate Details', 
            femaleCandidate :  femaleCandidates
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};
    
// Api for male candidate for client
const get_male_candidate_for_client = async (req, res) => {
    try {
        const client_id = req.params.client_id;
        
        // Check for client id
        if (!client_id) {
            return res.status(400).json({
                success: false,
                message: 'Client Id is required'
            });
        }

        // Check for client existence
        const client = await employeeModel.findById(client_id);
        if (!client) {
            return res.status(400).json({
                success: false,
                message: 'Client not found'
            });
        }

        // Check total job posted by client
        const totalJobs = await jobModel.find({ emp_Id: client_id });
        
  

        // Check for male candidates
        const maleCandidates = await appliedjobModel.find({ jobId: { $in: totalJobs.map(job => job.jobId) }, gender: 'Male' }).sort({ createdAt : -1 }).lean()
       

        

        return res.status(200).json({
            success: true,
            message: 'male Candidate Details', 
            maleCandidate :  maleCandidates
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};

// Api for get all candidate  for client
const get_all_candidate_for_client = async (req, res) => {
    try {
        const client_id = req.params.client_id;
        const gender = req.query.gender;  

        // Check for client id
        if (!client_id) {
            return res.status(400).json({
                success: false,
                message: 'Client Id is required'
            });
        }

        // Check for client existence
        const client = await employeeModel.findById(client_id);
        if (!client) {
            return res.status(400).json({
                success: false,
                message: 'Client not found'
            });
        }

        // Check total jobs posted by client
        const totalJobs = await jobModel.find({ emp_Id: client_id });

        // Check for all candidates
        const allCandidates = await appliedjobModel
            .find({ jobId: { $in: totalJobs.map(job => job.jobId) } })
            .sort({ createdAt: -1 })
            .lean();

        // Apply gender filter if provided, otherwise return all candidates
        let filteredCandidates = allCandidates;
        if (gender) {
            if (gender === "Male" || gender === "Female") {
                filteredCandidates = allCandidates.filter(candidate => candidate.gender === gender);
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid gender value"
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: 'All Candidate Details',
            candidates: filteredCandidates
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};



// Api for Build cv for candidate

const build_cv = async (req, res) => {

    try {
        const {
            firstName,
            lastName,
            city,
            country,
            zip,
            phoneNo,
            userEmail,
            jobTitleSummary,
            templateType
        } = req.body;

        // Initialize jobExperience, education, skills, etc. as empty arrays
        let jobExperience = [];
        let education = [];
        let skills = [];
        let certificates = [];
        let languagesKnown = [];
        let websitesAndSocialLinks = [];
        let awardsAndAchievements = [];

        // Parse arrays/objects from strings if provided
        if (req.body.jobExperience) {
            if (req.body.jobExperience !== '') {
                jobExperience = JSON.parse(req.body.jobExperience);
            }
        }
        if (req.body.education) {
            if (req.body.education !== '') {
                education = JSON.parse(req.body.education);
            }
        }         
        if (req.body.skills) {
            if (req.body.skills !== '') {
                skills = JSON.parse(req.body.skills);
            }
        }
        if (req.body.certificates) {
            if (req.body.certificates !== '') {
                certificates = JSON.parse(req.body.certificates);
            }
        }
        if (req.body.languagesKnown) {
            if (req.body.languagesKnown !== '') {
                languagesKnown = JSON.parse(req.body.languagesKnown);
            }
        }   
        if (req.body.websitesAndSocialLinks) {
            if (req.body.websitesAndSocialLinks !== '') {
                websitesAndSocialLinks = JSON.parse(req.body.websitesAndSocialLinks);
            }
        }
        if (req.body.awardsAndAchievements) {
            if (req.body.awardsAndAchievements !== '') {
                awardsAndAchievements = JSON.parse(req.body.awardsAndAchievements);
            }
        }

        // Handling file upload (profileImage)
        let profileImage = '';
        if (req.file) {
            profileImage = req.file.filename;
        }

        // Initialize a new CV document
        let newCv = new CvBuilderModel({
            firstName,
            lastName,
            city,
            country,
            zip,
            phoneNo,
            userEmail,
            jobTitleSummary,
            templateType,
            profileImage: profileImage
        });

        // Add job experience
        if (jobExperience.length > 0) {
            jobExperience.forEach(exp => {
                if (exp.isCurrentlyWorking === 1) {
                    exp.endDate = undefined;  
                }
                newCv.jobExperience.push(exp);
            });
        }

        // Add education
        if (education.length > 0) {
            education.forEach(edu => {
                if (edu.graduationDate && edu.graduationDate.isStillEnrolled === 1) {
                    edu.graduationDate.end_Date = undefined;  
                }
                newCv.Education.push(edu);
            });
        }

        // Add skills
        if (skills.length > 0) {
            skills.forEach(skill => {
                newCv.skills.push(skill);
            });
        }

        // Add certificates
        if (certificates.length > 0) {
            certificates.forEach(certificate => {
                newCv.certificates.push(certificate);
            });
        }

        // Add languages known
        if (languagesKnown.length > 0) {
            languagesKnown.forEach(language => {
                newCv.languagesKnown.push(language);
            });
        }

        // Add websites and social links
        newCv.websitesAndSocialLinks = websitesAndSocialLinks;

        // Add awards and achievements
        if (awardsAndAchievements.length > 0) {
            awardsAndAchievements.forEach(award => {
                newCv.awardsAndAchievements.push(award);
            });
        }

        // Save the new CV to the database
        await newCv.save();

        // Send success response with status 200 (created)
        return res.status(200).json({
            success: true,
            message: 'CV Build Successfully',
            data: newCv
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

                                               /* online courses USER  */
       // Api for User Enroll

           const courses_user_enroll = async ( req , res)=> {
                     try {
                            const { first_name , last_name , email , password ,  phone_no } = req.body
                           
                             const requiredFields = ['first_name' , 'last_name' , 'email' , 'password' , 'phone_no']
                             for(let field of requiredFields)
                             {
                                   if(!req.body[field])
                                   {
                                    return res.status(400).json({
                                         success : false ,
                                         message : `Required ${field.replace('_' , ' ')}`
                                    })
                                   }
                             }

                              const hashedPassword = await bcrypt.hash(password , 10)

                              // check for already exist user

                              const exist_user = await courses_user_enroll_Model.findOne({ email })
                                if(exist_user)
                                {
                                    return res.status(400).json({
                                         success : false ,
                                         message : 'You Already Enrolled ...!'
                                    })
                                }


                              // add new user
                                const new_enroll_user = new courses_user_enroll_Model({
                                       first_name ,
                                       last_name ,
                                       email ,
                                       password : hashedPassword,
                                       phone_no ,
                                       status : 1,
                                       courses : []
                                })

                                   await new_enroll_user.save()

                                   return res.status(200).json({
                                         success : true ,
                                         message : 'Enrolled Successfully ..!'
                                   })
                     } catch (error) {
                         return res.status(500).json({
                             success : false ,
                             message : 'Server error',
                             error_message :  error.message
                         })
                     }
                         
           }


           // Api for get all Enrolled User
              const all_enrolled_user = async( req , res )=> {
                    try {
                            // check for all user
                            const enrolled_user = await courses_user_enroll_Model.find({ }).sort({ createdAt : -1 }).lean()
                             if(!enrolled_user)
                             {
                                return res.status(400).json({
                                     success : false ,
                                     message : 'No User Enrolled yet'
                                })
                             }

                             return res.status(200).json({
                                 success : true ,
                                 message : 'Enrolled User',
                                 enrolled_user : enrolled_user
                             })
                    } catch (error) {
                          return res.status(500).json({
                                success : false ,
                                message : 'Server error',
                                error_message : error.message
                          })
                    }
              }


              // Api for enrolled_user_login

              const enrolled_user_login = async (req, res) => {
                try {
                    const { email, password } = req.body;
            
                    // Validate the required fields
                    if (!email) {
                        return res.status(400).json({
                            success: false,
                            message: 'Email is required'
                        });
                    }
            
                    if (!password) {
                        return res.status(400).json({
                            success: false,
                            message: 'Password is required'
                        });
                    }
            
                    // Check for enrolled user
                    const enrolled_user = await courses_user_enroll_Model.findOne({ email });
                    if (!enrolled_user) {
                        return res.status(400).json({
                            success: false,
                            message: 'Enrolled user not found'
                        });
                    }
             
                         // Check if the stored password is in plain text
           
                    if (enrolled_user.password && enrolled_user.password.startsWith("$2b$")) {
                    // Compare password
                    const passwordMatch = await bcrypt.compare(password, enrolled_user.password); 
                    if (!passwordMatch) {
                        return res.status(400).json({
                            success: false,
                            message: 'Password Incorrect'
                        });
                    }
                }
                  else
                  {
                    const saltRounds = 10;
                    const hashedPassword = await bcrypt.hash(password, saltRounds);
        
                    // Update the stored password in the database
                    enrolled_user.password = hashedPassword;               
                    await enrolled_user.save();
                  }
                    // Successful login response
                    return res.status(200).json({
                        success: true,
                        message: 'Enrolled user logged in successfully',
                        enrolled_user
                    });
            
                } catch (error) {
                    // Error handling
                    return res.status(500).json({
                        success: false,
                        message: 'Server error',
                        error_message: error.message
                    });
                }
            };
            

            // Api for enroll course
            const enroll_course = async (req, res) => {
                try {
                    const user_id = req.params.user_id; 
                    const { course_id } = req.body; 
            
                    // Check if course_id is provided
                    if (!course_id) {
                        return res.status(400).json({
                            success: false,
                            message: 'Course Id is required'
                        });
                    }
            
                    // Check if user_id is provided
                    if (!user_id) {
                        return res.status(400).json({
                            success: false,
                            message: 'User Id is required'
                        });
                    }
            
                    // Check for the existence of the course
                    const course = await cms_online_courses_Model.findById(course_id);
                    if (!course) {
                        return res.status(400).json({
                            success: false,
                            message: 'Course does not exist'
                        });
                    }
            
                    // Check if the user is already enrolled in the course
                    const existingEnrollment = await courses_user_enroll_Model.findOne({
                        _id: user_id, 
                        'courses.course_id': course_id 
                    });
            
                    if (existingEnrollment) {
                        return res.status(400).json({
                            success: false,
                            message: 'User already enrolled in this course'
                        });
                    }
            
                    // Check if the user exists
                    const enroll_user = await courses_user_enroll_Model.findById(user_id);
                    if (!enroll_user) {
                        return res.status(404).json({
                            success: false,
                            message: 'User Not Found'
                        });
                    }
            
                    // Enroll the user in the course by adding the course 
                    enroll_user.courses.push({
                        course_id: course_id,
                        enroll_Date: new Date(),
                        course_status: 'Pending'
                    });

                      const emailContent = `<!DOCTYPE html>
<html>
<head>
    <title>Enrollment Successful</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">

    <div style="max-width: 600px; margin: 40px auto; background-color: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        
        <!-- Header Section -->
        <div style="background-color: #2E86C1; color: #fff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Enrollment Successful!</h1>
        </div>
        
        <!-- Content Section -->
        <div style="padding: 20px;">
            <p style="font-size: 16px; color: #333;">Dear <strong>${enroll_user.first_name} ${enroll_user.last_name} </strong>,</p>
            
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
                We are happy to inform you that you have successfully enrolled in <strong>${course.Heading}</strong>.
            </p>
            
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
                Our team will contact you shortly with more details. Thank you for choosing our service, and we look forward to supporting your learning journey!
            </p>

            <p style="font-size: 16px; color: #333; line-height: 1.6;">
                If you have any questions, feel free to reach out to us at 
                <a href="mailto:info@smartstart.sl" style="color: #2E86C1; text-decoration: none;">Support Team</a>.
            </p>
            
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
                Thank you once again!
            </p>
        </div>

        <!-- Footer Section -->
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e8e8e8;">
            <p style="font-size: 14px; color: #666; margin: 0;">
                Best regards,<br><strong> Smart Start SL Ltd</strong>
            </p>
        </div>
    </div>

</body>
</html>
`       
     await  sendEmails(enroll_user.email, "Enrollment Successful", emailContent);
                   
                    await enroll_user.save();

                    // manage topic in other table
                    course.topic = course.topic.map((item, index) => {
                        return {
                            ...item,
                            topic_status: index === 0 ? 1 : 0
                        };
                    });
                    const manage_topic = new user_enrolled_course_toic_manage_Model({
                        enroll_user_id : enroll_user._id,
                        course_name : course.Heading,
                        course_id : course._id,
                        topic : course.topic
                    })
                        await manage_topic.save()
            
                    return res.status(200).json({
                        success: true,
                        message: 'User successfully enrolled in the course'
                    });
                } catch (error) {
                    return res.status(500).json({
                        success: false,
                        message: 'Server error',
                        error_message: error.message
                    });
                }
            };
            

// Api for update the status of the course
const update_course_status = async (req, res) => {
    try {
        const { user_id, course_id } = req.params;

        // Check if course_id is provided
        if (!course_id) {
            return res.status(400).json({
                success: false,
                message: 'Course Id is required'
            });
        }

        const course = await cms_online_courses_Model.findById(course_id);
        if (!course) {
            return res.status(400).json({
                success: false,
                message: 'Course does not exist'
            });
        }

        // Check if user_id is provided
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'User Id is required'
            });
        }

        // Check if the user is enrolled in the course
        const enrollment = await courses_user_enroll_Model.findOne({
            _id: user_id,
            'courses.course_id' : course_id
        });

        if (!enrollment) {
            return res.status(400).json({
                success: false,
                message: 'Enrollment not found for the given user and course'
            });
        }

        // Update the course status to 'Accepted'
        const updatedEnrollment = await courses_user_enroll_Model.findOneAndUpdate(
            {
                _id: user_id,
                'courses.course_id': course_id
            },
            {
                $set: {
                    'courses.$.status': 'Accepted' 
                }
            },
            { new: true } 
        );
                const emailContent = `<!DOCTYPE html>
<html>
<head>
    <title>Course Enrollment Accepted</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
        
        <!-- Header Section -->
        <div style="background-color: #2E86C1; padding: 20px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Course Enrollment Accepted</h1>
        </div>
        
        <!-- Body Content -->
        <div style="padding: 20px;">
            <p style="font-size: 16px; color: #333;">Dear <strong>${enrollment.full_name} ${enrollment.last_name} </strong>,</p>
            
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
                We are excited to inform you that your enrollment status for the course <strong>${course.Heading}</strong> has been successfully  <strong>Accepted</strong>.
            </p>
            
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
                Our team will reach out to you soon with further details regarding the next steps. We appreciate your trust in our services and are looking forward to supporting your learning journey.
            </p>

            <p style="font-size: 16px; color: #333; line-height: 1.6;">
                Should you have any questions, feel free to contact us at 
                <a href="mailto:info@smartstart.sl" style="color: #2E86C1; text-decoration: none;">Support Email</a>.
            </p>
            
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
                Thank you for choosing us!
            </p>
        </div>
        
        <!-- Footer Section -->
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e8e8e8;">
            <p style="font-size: 14px; color: #666; margin: 0;">
                Best regards,<br><strong>Smart Start SL Ltd</strong>
            </p>
        </div
`
    await sendEmails(enrollment.email , 'Course Enrollment Accepted' , emailContent)
        return res.status(200).json({
            success: true,
            message: 'Course Enrollment Accepted',
           
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};

         // Api for get_my_courses 
         const get_my_enrolled_courses = async (req, res) => {
            try {
              const { user_id } = req.params;
          
              // Check if user_id is provided
              if (!user_id) {
                return res.status(400).json({
                  success: false,
                  message: 'User Id is required',
                });
              }
          
              // Check for user enrollment
              const user = await courses_user_enroll_Model.findOne({ _id: user_id });
              if (!user) {
                return res.status(400).json({
                  success: false,
                  message: 'User not Found',
                });
              }
          
              // Get enrolled courses and retrieve course details
              const enrolled_courses = await Promise.all(
                user.courses.map(async (course) => {
                  const courseDetails = await cms_online_courses_Model.findById(course.course_id);
          
                  // Fetch topics from user_enrolled_course_topic_manage_Model using user_id and course_id
                  const userCourseTopic = await user_enrolled_course_toic_manage_Model.findOne({
                    enroll_user_id: user_id,
                    course_id: course.course_id,
                  });
          
              
          
                  // Extract the topics if found
                  const courseTopics = userCourseTopic ? userCourseTopic.topic : 'Course Topics not found';
          
                  return {
                    course_id: course.course_id,
                    course_name: courseDetails ? courseDetails.Heading : 'Course not found',
                    course_Description: courseDetails ? courseDetails.Description : 'Course Description not Found',
                    course_Detailed_Description: courseDetails ? courseDetails.Detailed_description : 'Course Detailed Description not Found',
                    course_Price: courseDetails ? courseDetails.price : 'Course Price not Found',
                    course_Image: courseDetails ? courseDetails.image : 'Course Image not Found',
                    cours_Topic: courseTopics || 'course topic not found',
                    enroll_Date: course.enroll_Date,
                    course_status: course.status,
                  };
                })
              );
          
              // Return the response with enrolled courses
              return res.status(200).json({
                success: true,
                message: 'My Enrolled Courses',
                enrolled_courses,
              });
            } catch (error) {
              return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message,
              });
            }
          };
          
          



    // Api for ger all enrolled user for a course
    const get_enrolled_users_count = async (req, res) => {
        try {
            const { course_id } = req.params;
    
            // Check if course_id is provided
            if (!course_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Course Id is required'
                });
            }
    
            // Find all users who have enrolled in the specified course
            const usersEnrolled = await courses_user_enroll_Model.find({
                'courses.course_id': course_id
            });
    
            
            // Return the response with the count of enrolled users
            return res.status(200).json({
                success: true,
                message: `Enrolled User`,
                enrolled_users_count: usersEnrolled.length,
                enrolled_user : usersEnrolled.map((m)=> ({
                            first_name  : m.first_name,
                            last_name  :  m.last_name,
                            email : m.email,
                            phone_no : m.phone_no
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


    // Api for get particular topic Quiz
                  const topic_quiz = async( req , res)=> {
                        try {
                              const topic_id = req.params.topic_id
                              // check for topic id
                              if(!topic_id)
                              {
                                return res.status(400).json({
                                     success : false ,
                                     message : 'Topic Id Required'
                                })
                              }

                              const topic_q = await online_course_quiz_Model.find({ topic_id }).sort({ createdAt : -1}).lean()

                              if(!topic_q)
                              {
                                return res.status(400).json({
                                     success : false ,
                                     message : 'No Quiz Found for the Topic'
                                })
                              }

                              return res.status(200).json({
                                 success : true ,
                                 message : 'Quiz of Topic',
                                 Topic_quiz : topic_q.map((m)=> ({
                                      topic_name : m.topic_name,
                                     topic_id : m.topic_id,
                                     quiz_id : m._id,
                                     topic_quiz : m.questions_Bank


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



    

           const delete_all_notification_of_user = async (req, res) => {
            try {
              // Delete all notifications from empNotificationModel
              await empNotificationModel.deleteMany({});
          
              return res.status(200).json({
                success: true,
                message: 'All notifications deleted successfully'
              });
            } catch (error) {
              return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message
              });
            }
          };
          
           

    // Api for export all candidate of the client
    const export_client_jobs_candidate = async (req, res) => {
        try {
            const client_id = req.params.client_id;
            const { gender } = req.query;
    
            // Check for client ID
            if (!client_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Client ID is required'
                });
            }
    
            // Check for client existence
            const client = await employeeModel.findById(client_id);
            if (!client) {
                return res.status(404).json({
                    success: false,
                    message: 'Client not found'
                });
            }
    
            // Check for gender
            if (!gender) {
                return res.status(400).json({
                    success: false,
                    message: 'Gender is required'
                });
            }
    
            // Get jobs posted by the client
            const totalJobs = await jobModel.find({ emp_Id: client_id });
            if (totalJobs.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No jobs found for this client'
                });
            }

            // Get total candidates applied (with gender filter)
            const totalCandidates = await appliedjobModel.find({
                jobId: { $in: totalJobs.map(job => job.jobId) },
                gender: gender
            });
    
            if (totalCandidates.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `No ${gender} candidates found for the jobs posted by this client`
                });
            }
    
            // Create Excel workbook and worksheet
            const workbook = new ExcelJs.Workbook();
            const worksheet = workbook.addWorksheet("Candidates");
    
            // Define the Excel Header
            worksheet.columns = [
                { header: "First Name", key: "first_Name", width: 15 },
                { header: "Last Name", key: "last_Name", width: 15 },
                { header: "User Email", key: "user_Email", width: 25 },
                { header: "District", key: "city", width: 15 },
                { header: "Phone Number", key: "phone_no", width: 15 },
                { header: "Status", key: "jobSeeker_status", width: 15 },
                { header: "Gender", key: "gender", width: 10 },
                { header: "Job Heading", key: "job_Heading", width: 20 },
                { header: "Job ID", key: "jobId", width: 10 },
                { header: "Highest Education", key: "Highest_Education", width: 20 },
                { header: "Total Experience", key: "Total_experience", width: 15 },
                { header: "CV", key: "uploadResume", width: 25 },
                { header: "Candidate Rating", key: "candidate_rating", width: 15 }
            ];
    
            // Add filtered candidates data to the worksheet
            totalCandidates.forEach(candidate => {
                worksheet.addRow({
                    first_Name: candidate.first_Name,
                    last_Name: candidate.last_Name,
                    user_Email: candidate.user_Email,
                    city: candidate.city,
                    phone_no: candidate.phone_no,
                    jobSeeker_status: candidate.jobSeeker_status,
                    gender: candidate.gender,
                    job_Heading: candidate.job_Heading,
                    jobId: candidate.jobId,
                    Highest_Education: candidate.Highest_Education,
                    Total_experience: candidate.Total_experience,
                    uploadResume: candidate.uploadResume,
                    candidate_rating: candidate.candidate_rating
                });
            });
    
            // Set response headers for downloading the Excel file
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                `attachment; filename=${gender}_candidates.xlsx`
            );
    
            // Generate and send the Excel File as a response
            await workbook.xlsx.write(res);
    
            // End the response
            res.end();
            
        } catch (error) {
            console.error("Error exporting candidates:", error);
            res.status(500).json({ 
                success: false,
                message: 'Server error',
                error_message: error.message
            });
        }
    };
    

    // Api for updatee the course topic status
       
    const update_topic_status = async (req, res) => {
        try {
          const user_id = req.params.user_id;
          const topic_id = req.params.topic_id;
      
          // check for required fields
          if (!user_id) {
            return res.status(400).json({
              success: false,
              message: 'User ID is required',
            });
          }
      
          if (!topic_id) {
            return res.status(400).json({
              success: false,
              message: 'Topic ID is required',
            });
          }
      
          // Find the user-enrolled course with the matching topic
          const enrolledCourse = await user_enrolled_course_toic_manage_Model.findOne({
            enroll_user_id: user_id,
            'topic': {
              $elemMatch: { _id: topic_id },
            },
          });
      
          // Check if the topic exists in the user's enrolled course
          if (!enrolledCourse) {
            return res.status(400).json({
              success: false,
              message: `Enrolled course'topic not found`,
            });
          }
               
          const updatedTopic = await user_enrolled_course_toic_manage_Model.updateOne(
            {
              enroll_user_id: user_id,
              'topic._id': topic_id,
            },
            {
              $set: { 'topic.$.topic_status': 1 }, 
            }
          );
      
          return res.status(200).json({
            success: true,
            message: 'Topic Activated for user',
          });
      
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message,
          });
        }
      };
      
      
    
    
        
module.exports = {
    employeeSignup , Emp_login , getEmployeeDetails , updateEmp , emp_ChangePassword , postJob , getJobs_posted_by_employee,
    getAll_Jobs , searchJob , apply_on_job , get_Female_jobseeker_profile , get_jobseeker_profile , getNotification_emp,
    seenNotification, unseenNotificationCount , deleteJob , activejobs_by_client , Inactivejobs_by_client ,filterJob,
    getServices_of_smart_start , get_privacy_policy , get__admin_term_condition , dashboard_counts , deleteCandidate,
    cms_getJobs_posted_procedure_section1 , cms_get_need_any_job_section ,get_cms_post_your_job , cms_getjob_market_data,
    addJobTitle , alljobTitle , deletejobTitle ,  export_candidate , client_dashboardCount,
    forgetPassOTP,  verifyOTP  ,  clientResetPass,  create_contactUS , getJob , addJob_Description , alljobDescription ,
    deleteJob_Description , getJd , fixit_finder , uploadResume , get_upload_section_candidates , 
    candidate_recruitment_process_for_uploaded_candidate , get_successfull_candidate , all_active_jobs_Count_with_title ,
    blog_section_comment , get_all__blog_section_comments , updateJob , download_jd , share_cv , save_candidate_profile_for_later ,
    get_saved_candidate_profile , update_candidate_rating ,  get_female_candidate_for_client , get_male_candidate_for_client,
    build_cv , get_all_candidate_for_client ,

   delete_all_notification_of_user , export_client_jobs_candidate,


    // Psychometric
    add_test_Category , getAll_psychometric_Category , Delete_category ,

    psychometric_test , getAll_psychometric_test_of_client ,
    get_test ,add_question_in_test,  delete_question_in_psychometric_test ,  deletepsychometrcTest   ,

    courses_user_enroll , all_enrolled_user , enrolled_user_login , enroll_course , update_course_status ,
    get_my_enrolled_courses , get_enrolled_users_count , topic_quiz ,
    update_topic_status
 
} 