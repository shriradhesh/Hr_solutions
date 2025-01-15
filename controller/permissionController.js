const permissionModel = require('../model/permission_model')
const Admin_and_staffsModel = require('../model/Admin_and_staffs')

const add_endPoints = async (req, res) => {
    try {
        const { role, endpoints, staff_id } = req.body;

        // Validate input
        if (!role) {
            return res.status(400).json({
                success: false,
                message: 'Role is required',
            });
        }
        if (!endpoints || !Array.isArray(endpoints) || endpoints.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'endPoints must be a non-empty array',
            });
        }
        if (role === 'HR Coordinator' && !staff_id) {
            return res.status(400).json({
                success: false,
                message: `Staff Id is required for role: ${role}`,
            });
        }

        // Check if the staff exists 
        if (role === 'HR Coordinator') {
            const staff = await Admin_and_staffsModel.findOne({ staff_id }); 
            if (!staff) {
                return res.status(400).json({
                    success: false,
                    message: `Staff not found with the staff_id : ${staff_id}`,
                });
            }
        }

        // Prepare query for permissions lookup
        const query = role === 'HR Coordinator' ? { role, staff_id } : { role };

        // Find or create permission document
        let permissionDoc = await permissionModel.findOne(query);

        if (!permissionDoc) {
            // Create a new document if none exists
            const permissions = endpoints.map(endpoint => ({ endpoint, permission: 1 }));
            await permissionModel.create({ role, staff_id, permissions });
        } else {
            // Add new endpoints to the existing document
            const existingEndpoints = permissionDoc.permissions.map(p => p.endpoint);

            endpoints.forEach(endpoint => {
                if (!existingEndpoints.includes(endpoint)) {
                    permissionDoc.permissions.push({ endpoint, permission: 1 });
                }
            });

            await permissionDoc.save();
        }

        // Successful response
        res.status(200).json({
            success: true,
            message: 'Endpoints added successfully',
        });
    } catch (error) {
        // Error response
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message,
        });
    }
};





module.exports = { add_endPoints }