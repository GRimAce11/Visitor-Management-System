import { Button } from '@nextui-org/react'
import { useForm } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import UserData from '@/config/Objects/UserData'
import addToFirebase from '@/server/AddtoFB/addToFirebase'
import { LoginDetails } from '@/server/constant/Db'

const RegisterCompanyForm = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: '',
            companyname: '',
            password: '',
            confirmpassword: '',
        },
    });

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
            alert('Registration Successfull');
            reset();
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
                    <Label>Confirm Password</Label>
                    <input
                        autoComplete='false'
                        type="password"
                        {...register('confirmpassword', {
                            required: 'Confirm password is required',

                        })}
                    />
                    {errors.confirmpassword &&
                        <span className='text-red-500 animate-pulse capitalize'>{errors.confirmpassword.message}</span>
                    }
                </div>
            </div>
            <Button type="submit" onClick={handleSubmit(onRegisterSubmit)} className="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2">Register</Button>
        </form>
    )
}

export default RegisterCompanyForm