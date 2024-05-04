import { Button } from '@nextui-org/react'
import { FiLogIn } from "react-icons/fi";
import { TfiWrite } from "react-icons/tfi";
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <section className="bg-gray-900 text-white">
            <div className="mx-auto max-w-screen-xl px-4 py-32 flex h-screen items-center justify-center">
                <div className="mx-auto w-full h-fit text-center">
                    <h1
                        className="bg-gradient-to-r h-full capitalize from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl"
                    >
                        welcome to

                        <span className="sm:block py-2"> SynCe Vistor Management System </span>
                    </h1>

                    <div className="mt-8 flex flex-wrap justify-center gap-5">

                        {/* Login button */}
                        <Link to={"/login"}>
                            <Button variant='ghost' startContent={<FiLogIn />} className='bg-black border border-white rounded-lg text-white' color='primary'>
                                Login
                            </Button>
                        </Link>


                        {/* Register button */}
                        <Link to={"/register"}>
                            <Button variant='bordered' startContent={<TfiWrite />} className=' border rounded-lg text-white' color="secondary">
                                Register
                            </Button>
                        </Link>

                    </div>
                </div>
            </div>
        </section>
    )
}

export default Home