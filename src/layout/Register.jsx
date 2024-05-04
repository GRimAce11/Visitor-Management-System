import { Label } from '@/components/ui/label'
import { Button } from '@nextui-org/react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Welcometext from './component/Welcometext'
import './style/register.css'
import { useForm } from 'react-hook-form'
import UserData from '@/config/Objects/UserData';
import addToFirebase from '../server/AddtoFB/addToFirebase';
import { LoginDetails } from '../server/constant/Db';

const Register = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        watch,
    } = useForm({
        defaultValues: {
            email: '',
            companyname: '',
            password: '',
            confirmpassword: '',
        },
    });

    const password = watch('password');


    // Form Submit logic
    const onRegisterSubmit = async (data) => {
        const user = data.email;
        const compName = data.companyname;
        const pass = data.password;
        let id = 1;
        const dataObj = UserData(id, user, pass, compName);
        console.log(dataObj);
        try {
            await addToFirebase(dataObj, LoginDetails)
            id = id + 1;
            alert('Registration Successfull. Please Login');
            reset();
            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (err) {
            console.log(err);
            alert('Please fill the form again')
            reset();
        } finally {
            reset();
            console.log("Done");
        }
    };

    return (
        <div className="h-screen md:flex">
            <div className="flex md:w-1/2 h-screen justify-center py-10 items-center bg-white">
                <div className="bg-white w-1/2">
                    <h1 className="text-gray-800 font-bold text-2xl mb-1">Hello! Lets Register you Now</h1>
                    <p className="text-sm font-normal text-gray-600 mb-7">Fill the below details to register</p>

                    <form autoComplete="off">
                        <div className="w-full flex flex-col gap-4">

                            {/* Email input */}
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="email">Enter Email</Label>
                                <input
                                    autoComplete='false'
                                    type="email"

                                    {...register("email", {
                                        required: "Please Enter you Email",
                                        pattern: {
                                            value: /\S+@\S+\.\S+/,
                                            message: "Entered value does not match email format",
                                        },
                                    })}
                                />
                                {errors.email &&
                                    <span className='text-red-500 animate-pulse capitalize'>{errors.email.message}</span>
                                }
                            </div>

                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="email">Enter Company Name</Label>
                                <input
                                    autoComplete='false'
                                    type="text"
                                    {...register('companyname',
                                        {
                                            required: 'Please Enter Company Name',
                                            maxLength: {
                                                value: 100,
                                                message: "Keep it below 100 Characters"
                                            }
                                        })}
                                />
                                {errors.companyname &&
                                    <span className='text-red-500 animate-pulse capitalize'>{errors.companyname.message}</span>
                                }

                            </div>


                            {/* Password input */}
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="password">Password</Label>
                                <input
                                    autoComplete='false'
                                    type="password"
                                    {...register('password',
                                        {
                                            required: 'Password is required',
                                            pattern: {
                                                value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\da-zA-Z])(.{8,16})$/,
                                                message: "Password must have At least one digit, one lowercase letter, one uppercase letter, one special character and Length between 8 and 16 characters",
                                            },
                                            maxLength: {
                                                value: 16,
                                                message: "Must be less than 16 characters"
                                            }
                                        })}
                                />
                                {errors.password &&
                                    <span className='text-red-500 animate-pulse capitalize'>{errors.password.message}</span>
                                }
                            </div>

                            {/* Confirm Password input */}
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="password">Confirm Password</Label>
                                <input
                                    autoComplete='false'
                                    type="password"
                                    {...register('confirmpassword', {
                                        required: 'Confirm password is required',
                                        validate: (value) =>
                                            value === password || 'Passwords do not match',
                                    })}
                                />
                                {errors.confirmpassword &&
                                    <span className='text-red-500 animate-pulse capitalize'>{errors.confirmpassword.message}</span>
                                }
                            </div>
                        </div>
                        <Button type="submit" onClick={handleSubmit(onRegisterSubmit)} className="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2">Register</Button>
                    </form>
                    <span className="text-sm ml-2 ">Already have an account?
                        {" "}<Link to={"/login"} className='hover:text-blue-500 cursor-pointer underline'>Login now</Link>
                    </span>
                </div>
            </div>
            <Welcometext />

        </div>
    )
}

export default Register