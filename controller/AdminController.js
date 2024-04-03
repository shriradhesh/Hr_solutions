const mongoose = require('mongoose')
const express = require('express')
const bcrypt = require('bcrypt')
const path = require('path')

const Admin_and_staffsModel = require('../model/Admin_and_staffs')
const employeeModel = require('../model/employeeModel')
const jobModel = require('../model/jobModel')
const send_adminEmail = require('../utils/adminEmail')
const sendstaffEmail = require('../utils/staffEmail')
const appliedjobModel = require('../model/appliedJobModel')


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
                                const active_inactive_job = async ( req , res)=>{
                                try {
                                        const jobId = req.params.jobId
                                    // check for jobId
                                    if(!jobId)
                                    {
                                        return res.status(400).json({
                                                success : false ,
                                                message : 'jobId Required'
                                        })
                                    }            
                                    // check for JOb existance
            
                                    const job = await jobModel.findOne({
                                            _id : jobId
                                    })
                                    if(!job)
                                    {
                                    return res.status(400).json({
                                            success : false ,
                                            message : 'job not exist'
                                    })
                                    }
                                    // Toggle job status
                                    let newStatus = job.status === 1 ? 0 : 1;
                                        
                                      job.status = newStatus                
                                    
                                                // Save the updated job status
                                        await job.save();
            
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

        // APi for get all female Candidate Resume
          const getAllFemale_Candidate = async ( req , res)=>{
            try {
                  // check for all Female candidates
                  const allFemale_Candidate = await appliedjobModel.find({
                        gender : "Female"
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
module.exports = {
    login , getAdmin, updateAdmin , admin_ChangePassword , addStaff , getAll_Staffs , getAllEmp , active_inactive_emp ,
    active_inactive_job , getStaff_Details , updatestaff , staff_ChangePassword , getAllFemale_Candidate , getAllFemale_Candidate
}