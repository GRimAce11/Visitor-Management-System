import { Button } from '@nextui-org/react'
import { Link, useNavigate } from 'react-router-dom'
import { Label } from "@/components/ui/label"
import Welcometext from './component/Welcometext'

import getAllData from '../server/Fetch/getAllData';
import { LoginDetails } from '../server/constant/Db';

import './style/register.css'
import { useForm } from 'react-hook-form'

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });


  // Form Submit logic
  const onLoginSubmit = async (data) => {
    const loginuser = data.username;
    const loginpass = data.password;

    try {
      const data1 = await getAllData(LoginDetails);
      console.log(data1);

      const foundUser = data1.filter(user => user.username === loginuser && user.password === loginpass)[0];

      if (foundUser) {
        console.log('User found:', foundUser.companyname);
        const message = foundUser.usertyp === "admin" ?
          `Welcome Admin...Please wait you are being redirected!` :
          `LogIn Successfull ${foundUser.companyname}...Please wait you are being redirected!`;
        alert(message);
        sessionStorage.setItem('Username', foundUser.companyname);
        setTimeout(() => {
          navigate(foundUser.usertyp === "admin" ? "/admin" : "/company");
        }, 1000);
        reset();
      } else {
        console.log('User not found');
        alert("Wrong Email or Password. Try again");
        reset();
      }
    }
    // try {
    //   const data1 = await getAllData(LoginDetails)
    //   console.log(data1);
    //   let foundUser = null;
    //   let userType = null;
    //   let companyname = null;
    //   for (let i = 0; i < data1.length; i++) {
    //     const user = data1[i];
    //     if (user.username === loginuser && user.password === loginpass) {
    //       foundUser = user.username;
    //       userType = user.usertyp;
    //       companyname = user.companyname;
    //       break;
    //     }
    //   }

    //   if (foundUser) {
    //     console.log('User found:', companyname);
    //     const message =
    //       userType === "admin"
    //         ? `Welcome Admin...Please wait you are being redirected!`
    //         : `LogIn Successfull ${companyname}...Please wait you are being redirected!`;
    //     alert(message);
    //     sessionStorage.setItem('Username',companyname);
    //     setTimeout(() => {
    //       navigate(userType === "admin" ? "/admin" : "/company");
    //     }, 1000);
    //     reset();
    //   } else {
    //     console.log('User not found');
    //     alert("Wrong Email or Password. Try again");
    //     reset();
    //   }

    // }
    catch (err) {
      console.log(err);
      reset();
    } finally {
      console.log('done');
      reset();
    }
  };
  return (
    <div className="h-screen md:flex">
      <Welcometext />
      <div className="flex md:w-1/2 h-screen justify-center py-10 items-center bg-white">
        <form className="bg-white w-1/2">
          <h1 className="text-gray-800 font-bold text-2xl mb-1">Hello! Lets Login to Start</h1>
          <p className="text-sm font-normal text-gray-600 mb-7">Welcome Back</p>
          <form autoComplete="off">
            <div className="w-full flex flex-col gap-4">

              {/* Email input */}
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email">Enter Email</Label>
                <input
                  autoComplete='false'
                  type="email"
                  {...register("username", {
                    required: "Please Enter you Email",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Entered value does not match email format",
                    },
                  })}
                />
                {errors.username &&
                  <span className='text-red-500 animate-pulse capitalize'>{errors.username.message}</span>
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
                    })}
                />
                {errors.password &&
                  <span className='text-red-500 animate-pulse capitalize'>{errors.password.message}</span>
                }
              </div>


            </div>
            <Button type="submit" onClick={handleSubmit(onLoginSubmit)} className="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2">Login</Button>
          </form>
          <span className="text-sm ml-2 ">Dont have an account?
            {" "}<Link to={'/register'} className='hover:text-blue-500 cursor-pointer underline'>Register now</Link>
          </span>
        </form>
      </div>
    </div>
  )
}

export default Login