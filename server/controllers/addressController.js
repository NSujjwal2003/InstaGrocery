import Address from "../models/Address.js";



//Add Address :/api/address/add
export const AddAddress = async (req,res) => {
    try {
        const{address } = req.body;
        const userId = req.userId; // Assuming you have user authentication middleware that sets req.user
        await Address.create({ ...address, userId });
        res.status(201).json({success: true, message: "Address added successfully" });
    } catch (error) {
        console.error("Error adding address:", error);
        res.status(500).json({ error: "Internal server error" });
    }

}



// Get Address :/api/address/get
export const GetAddress = async (req, res) => {
    try {
        const userId = req.userId; // Assuming you have user authentication middleware that sets req.user
        const addresses = await Address.find({ userId });
        res.status(200).json({success: true, addresses });
    } catch (error) {
        console.error("Error fetching addresses:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}