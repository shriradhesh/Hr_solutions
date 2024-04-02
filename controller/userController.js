const employeeModel = require('../model/employeeModel')
const bcrypt = require('bcrypt')
const jobModel = require('../model/jobModel')
const appliedjobModel = require('../model/appliedJobModel')

                                        /* employee Section */

// Api for user Signup
     
                   const employeeSignup = async( req , res)=>{
                     try {
                           const { name , email , password , phone_no , company_name , Number_of_emp ,company_industry } = req.body
                      
                           // check for required fields
                           const requiredFields = [ "name", "email", "password" , "phone_no" ,"company_name" , "Number_of_emp" , "company_industry"];

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
                            if(req.file)
                            {
                                profileImage = req.file.filename
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
                                 status : 1
                             })

                                await newData.save()
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
                         message : 'Your account is suspended. Please contact the admin for further details.'
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
                   let profileImage 
                   if(req.file)
                   {
                       profileImage = req.file.filename
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
                         message : 'Employee Details updated successfully '
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

          
                                                 /* Job Section */
        // Api for post job
        const postJob = async (req, res) => {
            try {
                const empId = req.params.empId;
                const {
                    job_title,
                    job_Description,
                    job_type,
                    job_schedule,
                    salary_pay,
                    Number_of_emp_needed,
                    requirement_timeline,
                    startDate,
                    endDate,
                    key_qualification,
                    Experience,
                    company_address,
                    template_type
                } = req.body;
        
                // check for employee ID
                if (!empId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Employee Id required'
                    });
                }
        
                // check for required fields
                const requiredFields = ["job_title", "job_Description", "job_type", "job_schedule",
                    "salary_pay", "Number_of_emp_needed",
                    "requirement_timeline", "startDate", "job_type", "endDate", "key_qualification", "Experience",
                    "company_address", "template_type"
                ];
        
                for (const field of requiredFields) {
                    if (!req.body[field]) {
                        return res
                            .status(400)
                            .json({
                                message: `Missing ${field.replace("_", " ")}`,
                                success: false,
                            });
                    }
                }
        
                // check for employee
                const employee = await employeeModel.findOne({
                    _id: empId
                });
                if (!employee) {
                    return res.status(400).json({
                        success: false,
                        message: 'Employee details not found'
                    });
                }
                const empstatus = employee.status
                if(empstatus === 0)
                {
                   return res.status(400).json({
                        success : false ,
                        message : 'Your account is suspended. Please contact the admin for further details.'
                   })
                }

                // access employee Details
                const company_name = employee.company_name;
                const employee_email = employee.email;
                const phone_no = employee.phone_no;
                const company_Industry = employee.company_industry;
                // job photo or logo
                const job_photo = req.file.filename;
        
                // Initialize SalaryDetails as an empty array
                let SalaryDetails = [];
        
                // If salary_pay is provided, process and set the details
                if (salary_pay) {
                    SalaryDetails = JSON.parse(salary_pay);
                }
        
                // Initialize keys as an empty array
                let keys = [];
        
                // If key_qualification is provided, process and set the details
                if (key_qualification) {
                    keys = JSON.parse(key_qualification);
                }
        
                // check if a similar job for the company already exists in a time period
                const existJob = await jobModel.findOne({
                    job_title: job_title,
                    company_name: company_name,
                    startDate: {
                        $lte: endDate
                    },
                    endDate: {
                        $gte: startDate
                    }
                });
                if (existJob) {
                    return res.status(400).json({
                        success: false,
                        message: 'Similar job already exists within the specified time period'
                    });
                }
        
                // Create new data for the job
                const newJob = new jobModel({
                    emp_Id: empId,
                    job_title,
                    job_Description,
                    job_type,
                    job_schedule,
                    salary_pay: SalaryDetails,
                    Number_of_emp_needed,
                    requirement_timeline,
                    startDate,
                    endDate,
                    key_qualification: keys,
                    Experience,
                    company_address,
                    template_type,
                    company_name,
                    employee_email,
                    phone_no,
                    company_Industry,
                    job_photo,
                    status : 1
                });
        
                await newJob.save();
        
                return res.status(200).json({
                    success: true,
                    message: 'Job posted successfully',
                    jobId : newJob._id
                });
        
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            }
        };


        // Api for get jobs posted by employee

                const getJobs_posted_by_employee = async( req , res)=>{
                    try {
                             const empId = req.params.empId
                             // check for empId
                        if(!empId)
                        {
                            return res.status(400).json({
                                  success : false ,
                                  message : 'employee Id required'
                            })
                        }

                          // check for employee jobs
                    const emp_jobs = await jobModel.find({
                             emp_Id : empId,
                            

                    })

                    if(!emp_jobs)
                    {
                        return res.status(400).json({
                               success : false ,
                               message : 'No Jobs Found'
                        })
                    }

                    return res.status(200).json({
                          success : true ,
                          message : 'Jobs Details',
                          jobsCount : emp_jobs.length,
                          Details : emp_jobs
                    })

                    } catch (error) {
                        return res.status(500).json({
                               success : false ,
                               message : 'server error',
                               error_message : error.message
                        })
                    }
                }

                                                                    /*Job Seeker sections */
        // Api for get all Jobs

                const getAll_Jobs = async( req , res)=>{
                     try {
                             // check for all jobs
                             const allJobs = await jobModel.find({ })
                             if(!allJobs)
                             {
                                return res.status(400).json({
                                     success : false ,
                                     message : 'No job found'
                                })
                             }
                             return res.status(200).json({
                                 success : true ,
                                 message : 'All Jobs',
                                 JobsCount : allJobs.length,
                                 allJobs : allJobs
                             })
                     } catch (error) {
                        return res.status(500).json({
                                success : false ,
                                message : 'server error',
                                error_message : error.message
                        })
                     }
                }

        // Api for Search Jobs
        const searchJob = async (req, res) => {
            try {
                const { job_title, company_address } = req.body;
                const { latest_Update, job_type, Experience, company_Industry , job_schedule } = req.query;
        
                // check for required fields
                if (!job_title) {
                    return res.status(400).json({
                        success: false,
                        message: 'Job Title required'
                    });
                }
                if (!company_address) {
                    return res.status(400).json({
                        success: false,
                        message: 'Company address Required'
                    });
                }
        
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
        
        

                                         /* Applied job section */

        // APi for apply on job

            const apply_on_job = async( req , res)=>{
                   try {
                             const jobId  = req.params.jobId
                        const { first_Name , last_Name , user_Email , city , state , phone_no , gender ,
                                   Highest_Education ,job_experience , Total_experience ,  time_range_for_interview  } = req.body
                            
                                  // check for JobId
                            if(!jobId)
                            {
                                return res.status(400).json({
                                     success : false ,
                                     message : 'job Id required'
                                })
                            }

                             // check for required fields
                const requiredFields = ["first_Name", "last_Name", "user_Email", "city",
                                 "state", "phone_no", "gender", "Highest_Education", "job_experience",
                                     "Total_experience", "time_range_for_interview" 
                 ];


            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res
                        .status(400)
                        .json({
                            message: `Missing ${field.replace("_", " ")}`,
                            success: false,
                        });
                }
            }

                        // check for job
                    const job = await jobModel.findOne({ _id : jobId })
                       if(job)
                       {
                        return res.status(400).json({
                             success : false ,
                             message : 'job not found'
                        })
                       }

                           // access job Details
                        const job_Heading = job.job_title
                        const Salary = `${job.salary_pay.Minimum} - ${job.salary_pay.Maximum}, ${job.salary_pay.Rate}`;
                        const job_expired_Date = job.endDate
                        const job_status = job.status

                        // check for job seeker that he can't apply again on the same job
                    
                         const jobseeker_apply = await appliedjobModel.findOne({
                            user_Email : user_Email,
                            jobId : jobId
                         })

                          if(jobseeker_apply)
                          {
                            return res.status(400).json({
                                  success : false ,
                                  message : 'you already applied on these job'
                            })
                          }

                          // upload resume file
                        const uploadResume = req.file.filename
                        if(!uploadResume)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'Resume required'
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


module.exports = {
    employeeSignup , Emp_login , getEmployeeDetails , updateEmp , emp_ChangePassword , postJob , getJobs_posted_by_employee,
    getAll_Jobs ,searchJob
}