const employeeModel = require('../model/employeeModel')
const bcrypt = require('bcrypt')
const jobModel = require('../model/jobModel')
const appliedjobModel = require('../model/appliedJobModel')
const sendjobEmail  = require('../utils/jobAppliedEmail')
const moment = require("moment");
const cron = require("node-cron");
const send_EmployeeEmail = require('../utils/employeeEmail')

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
                    Minimum_pay,
                    Maximum_pay,
                    Rate,
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
                    "Minimum_pay", "Maximum_pay" , "Rate", "Number_of_emp_needed",
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
                 // Set job_photo if a file has been uploaded
                let job_photo = null;
                if (req.file) {
                    job_photo = req.file.filename;
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
                    salary_pay : [{ Minimum_pay, Maximum_pay, Rate }],
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
        
            const jobsData = emp_jobs.map(job => {
                const salary_pay = `${job.salary_pay[0].Minimum_pay} - ${job.salary_pay[0].Maximum_pay}, ${job.salary_pay[0].Rate}`;
                return {
                    _id: job._id,
                    job_title: job.job_title,
                    company_name: job.company_name,               
                    Number_of_emp_needed: job.Number_of_emp_needed,
                    job_type: job.job_type,
                    job_schedule: job.job_schedule,
                    salary_pay: salary_pay,
                    job_Description: job.job_Description,
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
                    status: job.status
                };
            });
        
            return res.status(200).json({
                success: true,
                message: 'All Jobs',
                JobsCount: emp_jobs.length,
                emp_jobs: jobsData
            });
        
            } catch (error) {
                return res.status(500).json({
                       success : false ,
                       message : 'server error',
                       error_message : error.message
                })
            }
        }
        
    // Api for get Female jobseeker profile for the job
           
                const get_Female_jobseeker_profile = async( req , res)=>{
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

                        // check for job
                        const job = await jobModel.findOne({ _id : jobId })
                        if(!job)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'job not found'
                            })
                        }

                        // check for Female job seeker profile for the job

                     const Female_jobseeker = await appliedjobModel.find({
                             gender : 'Female',
                             jobId : jobId
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
                // check for jobId
                if(!jobId)
                {
                    return res.status(400).json({
                         success : false ,
                         message : 'jobId Required'
                    })
                }

                // check for job
                const job = await jobModel.findOne({ _id : jobId })
                if(!job)
                {
                    return res.status(400).json({
                         success : false ,
                         message : 'job not found'
                    })
                }

                // check for Other job seeker profile for the job

             const Other_jobseeker = await appliedjobModel.find({
                       jobId : jobId,
                       gender : { $ne : 'Female' }
                     
             })
                if(!Other_jobseeker)
                {
                    return res.status(400).json({
                         success : false ,
                         message : 'no Other_jobseeker candidate have applied for these job '
                    })
                }

                return res.status(200).json({
                     success : true ,
                     message : 'candidate Profiles',
                     Other_jobseekerCount : Other_jobseeker.length,
                     Details: Other_jobseeker.map((candidate) => ({
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

                                                                    /*Job Seeker sections */
        // Api for get all Jobs

        const getAll_Jobs = async (req, res) => {
            try {
                // Fetch all jobs
                const allJobs = await jobModel.find({});
                if (allJobs.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'No job found'
                    });
                }
                
                const jobsData = allJobs.map(job => {
                    const salary_pay = `${job.salary_pay[0].Minimum_pay} - ${job.salary_pay[0].Maximum_pay}, ${job.salary_pay[0].Rate}`;
                    return {
                        _id: job._id,
                        job_title: job.job_title,
                        company_name: job.company_name,               
                        Number_of_emp_needed: job.Number_of_emp_needed,
                        job_type: job.job_type,
                        job_schedule: job.job_schedule,
                        salary_pay: salary_pay,
                        job_Description: job.job_Description,
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
                        status: job.status
                    };
                });
        
                return res.status(200).json({
                    success: true,
                    message: 'All Jobs',
                    JobsCount: allJobs.length,
                    allJobs: jobsData
                });
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'server error',
                    error_message: error.message
                });
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
                    
                            // Check for required fields
                            const requiredFields = ["first_Name", "last_Name", "user_Email", "city",
                                "state", "phone_no", "gender", "Highest_Education", "job_experience",
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
                                _id: jobId,
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
                                message: 'Resume required'
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
                                jobId : jobId
                            });
                    
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
        

    
                    

module.exports = {
    employeeSignup , Emp_login , getEmployeeDetails , updateEmp , emp_ChangePassword , postJob , getJobs_posted_by_employee,
    getAll_Jobs ,searchJob , apply_on_job , get_Female_jobseeker_profile , get_jobseeker_profile
}