const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Status } = require("../../config/constants");
const {
  randomStringGenerator,
} = require("../../../utilities/helper");
const userSvc = require("../../user/user.service");
const authSvc = require("./auth.service");
const UserModel = require("../../user/user.model");
const { jwtConfig } = require("../../config/config");


class AuthController {
  register = async (req, res) => {
    try {
      const data = req.body;
      const transformedData = await authSvc.transformedData(req,data);

      const user = await userSvc.createUser(transformedData);
      await authSvc.sendActivationNotification(user);
      console.log(user);

      res.json({
        data: data,
        message: "This is register route",
        status: "success",
      });
    } catch (exception) {
      throw exception;
    }
  };
  activateAccount = async(req,res)=>{
    try {
      const {email,activationToken} = req.body;
      const user = await UserModel.findOne({email:email});
      
      
      if(user.status === Status.ACTIVE){
        throw{
          code:400,
          message:"Account already activated",
          status:"BAD_REQUEST"
        }
      }

      if(user.activationToken !== activationToken ){
        throw{
          code:404,
          message:"Invalid activation token",
          status:"NOT_FOUND"
        }
      }
      user.status=Status.ACTIVE;
      user.activationToken = null;
      await user.save();

      res.json({
        message:"Account activated successfully",
        status:"success"
      })
    } catch (exception) {
      throw exception;
    }
  };
  login = async(req,res)=>{
    try {
      const {email,password}=req.body;
      const user = await UserModel.findOne({email:email});
      if(!user){
        throw{
          code:404,
          message:"User not found",
          status:"NOT_FOUND"
        }
      }
      if(user.status !== Status.ACTIVE){
        throw{
          code:403,
          message:"Account not activated",
          status:"FORBIDDEN"
        }
      }
      const isPasswordValid = await bcrypt.compare(password,user.password);
      if(!isPasswordValid){
        throw{
          code:401,
          message:"Invalid credentials",
          status:"UNAUTHORIZED"
        }
      }
       const accessToken = jwt.sign(
        {
          sub: user._id,
          typ: "Bearer",
        },
        jwtConfig.secret,
        {
          expiresIn: "1h",
        },
      );
      const refreshToken = jwt.sign(
        {
          sub: user._id,
          typ: "Refresh",
        },
        jwtConfig.secret,
        {
          expiresIn: "1d",
        },
      );

      const maskedAccessToken = randomStringGenerator(150);
      const maskedRefreshToken = randomStringGenerator(150);

      const authData = {
        userId: user._id,
        accessToken: accessToken,
        refreshToken: refreshToken,
        maskedAccessToken: maskedAccessToken,
        maskedRefreshToken: maskedRefreshToken,
      };
      await authSvc.createAuthData(authData);
      // console.log("Login success");

      res.json({
        data: {
          userId:user._id,
          accessToken: maskedAccessToken,
          refreshToken: maskedRefreshToken,
        },
        message: "Welcome to chat world " + user.name ,
        status: "LOGIN_SUCCESS",
        options: null,
      });
    } catch (exception) {
      throw exception;
    }
  }

  changePassword = async (req,res)=>{
    try {
      const accessToken = req.headers["authorization"] || null;
      if (!accessToken) {
        throw {
          code: 401,
          message: "Unauthorized",
          status: "UNAUTHORIZED",
        };
      }
      const token = accessToken.replace("Bearer ", "");
      const authData = await authSvc.getSingleRowByFilter({
        maskedAccessToken: token,
      });
      if (!authData) {
        throw {
          code: 401,
          message: "Token not found",
          status: "UNDEFINED_TOKEN",
        };
      }
      const data = jwt.verify(authData.accessToken, jwtConfig.secret);
      if (data.typ !== "Bearer") {
        throw {
          code: 401,
          message: "Bearer token expected",
          status: "BEARER_TOKEN_EXPECTED",
        };
      }
      const user = await userSvc.getSingleUserByFilter({
        _id: data.sub,
      });
      if (!user) {
        throw {
          code: 403,
          message: "User not found or may have been deleted from the system",
          status: "USER_NOT_FOUND",
        };
      }
      const {oldPassword,newPassword} = req.body;
      const isPasswordValid = await bcrypt.compare(oldPassword,user.password);
      if(!isPasswordValid){
        throw{
          code:401,
          message:"Invalid current password",
          status:"UNAUTHORIZED"
        }
      }
      const hashedNewPassword = await bcrypt.hash(newPassword,10);
      user.password = hashedNewPassword;
      await user.save();
      await authSvc.logoutFromAll({userId:user._id});

      res.json({
        message:"Password changed successfully. Please login again.",
        status:"success"
      })
    } catch (exception) {
      throw exception;
    }
  }

  getAllUsers = async(req,res)=>{
    try {
      const getUsers = await UserModel.find();
      if(!getUsers){
        throw({
          code:404,
          message:"Users not found!!",
          status:"NOT_FOUND"
        })
      }
      res.json({
        data:getUsers,
        message:"Users fetched successfully!!",
        status:"SUCCESS"
      })
    } catch (exception) {
      throw exception;
    }
  }

  loggedInUserProfile = (req, res, next) => {
    res.json({
      data: req.loggedInUser,
      message: "me route ",
      status: "Sucess",
      options: null,
    });
  };
}

const authCltr = new AuthController();
module.exports = authCltr;
