
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
   name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true,
        minLength: 6,
        select: false
    },
    role:{
        type: String,
        enum: ["user","seller", "admin"],
        default: "user"
    },
    refreshToken:{
        type: String,
        default: null
    }
},
{timestamps: true}
);


// hash password before save

userSchema.pre("save", async function (){
    if(!this.isModified("password")) return ;
    this.password = await bcrypt.hash(this.password, 10);
});

// Compare password

userSchema.method.comparePassword = function (password) {
    return bcrypt.compare(password, this.password)
};


const User = mongoose.model("User", userSchema);
export default User;