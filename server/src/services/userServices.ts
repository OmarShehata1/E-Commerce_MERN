import  UserModel  from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface RegisterParams {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export const register = async ({firstName , lastName ,email ,password}: RegisterParams) => {
    const findUser= await UserModel.findOne({ email: email });
    if (findUser) {
        return { data :'User already exists' , statusCode: 400 };
    }
    const hasdedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ firstName, lastName, email, password: hasdedPassword });
    await newUser.save();
    return {data: generateJWT({firstName , lastName ,email}), statusCode: 201 };
}

interface LoginParams {
    email: string;
    password: string;
}


export const login = async ({ email , password }: LoginParams) => {
    const findUser = await UserModel.findOne({ email });
    if (!findUser) {
        return { data: 'Incorrect email or Password' , statusCode: 400 };
    }

    const passwordMatch = await bcrypt.compare(password, findUser.password);

    if (passwordMatch) {
        return {data : generateJWT({email , firstName:findUser.firstName, lastName :findUser.lastName}), statusCode: 200 };
    }
    return { data: 'Incorrect email or Password' , statusCode: 400 };
}


const generateJWT = (data: any) => {
    return jwt.sign(data, 'sdcvmnfbhdjcdfvdfvjfdkvnfjnv');
}