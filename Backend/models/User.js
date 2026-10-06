const mongoose = require("mongoose"); 
const userSchema = new mongoose.Schema(  
    {    
        name: {      
            type: String,      
            required: true,      
            trim: true,    
        },    
        mobile: {      
            type: String,      
            required: true,      
            unique: true,      
            match: /^[0-9]{10}$/,   
        },    
        email: {      
            type: String,      
            required: true,      
            unique: true,      
            lowercase: true,      
            trim: true,    
        },    
        password: {      
            type: String,      
            required: true,    
        },  
    },  
    {    
        timestamps: true,  
    } 
); 
    module.exports = mongoose.model("User", userSchema);