import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaDoorOpen, FaFilePdf } from "react-icons/fa";
import { IoToday } from "react-icons/io5";
import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure } from "@nextui-org/react";
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import VisitorData from '@/config/Objects/VisitorData';
import addToFirebase from '../server/AddtoFB/addToFirebase';
import { VisitorDetails } from '../server/constant/Db';
import getAllData from '../server/Fetch/getAllData';
import Chart from 'react-google-charts';
import { MdDashboard } from "react-icons/md";
import { BsFilePersonFill } from "react-icons/bs";
import { IoIosLogOut } from "react-icons/io";
import './style/exporttopdf.css'
import { PDFExport } from '@progress/kendo-react-pdf';

const Company = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      date: '',
      time: '',
      mobile: '',
    },
  });
  // const now = new Date();
  // const localDate = now.toLocaleDateString();
  const today = new Date();
  const todayyear = today.getFullYear();
  const todaymonth = String(today.getMonth() + 1).padStart(2, '0');
  const todaydate = String(today.getDate()).padStart(2, '0');
  const todaytocheck = `${todayyear}-${todaymonth}-${todaydate}`;
  const todayFormatted = today.toLocaleDateString('en-GB'); // Format in dd-mm-yyyy

  const [username, setusername] = useState('')


  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [showdashboard, setshowdashboard] = useState(true);
  const [showvisitors, setshowvisitors] = useState(false);


  const showdashboarddata = () => {
    setshowdashboard(true);
    setshowvisitors(false);
  }

  const showvisitordata = () => {
    setshowdashboard(false);
    setshowvisitors(true);
  }


  const [visitorid, setvisitorid] = useState(1);

  const Logout = () => {
    sessionStorage.clear();
    alert('Logged out Successfully');
    setTimeout(() => {
      navigate("/login");
    }, 500);
  }
  const onVisitorSubmit = async (data) => {
    const time = data.time
    const [hours, minutes] = time.split(':');
    const isPM = parseInt(hours) >= 12;
    const convertedHours = (parseInt(hours) % 12) || 12;
    const timeIn12hrFormat = `${convertedHours}:${minutes} ${isPM ? 'PM' : 'AM'}`;
    const vname = data.name;
    const vcompName = username;

    const date = data.date;
    const dateObject = new Date(date)
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');

    const vdate = `${year}-${month}-${day}`;

    const vtime = timeIn12hrFormat;
    const vmobile = data.mobile;
    try {
      const dataObj = VisitorData(visitorid, vname, vcompName, vdate, vtime, vmobile);
      console.log(dataObj);
      await addToFirebase(dataObj, VisitorDetails)
      alert('Visitor Data added Successfully');
      reset();
    } catch (err) {
      console.log(err);
      alert('Please fill the form again')
      reset();
    } finally {
      reset();
      setvisitorid(visitorid + 1);
      console.log("Done");
    }
  };

  const formatters = [
    {
      type: "DateFormat",
      column: 3,
      options: {
        formatType: "short",
      },
    },
  ];

  const [FetchedVisitorData, setFetchedVisitorData] = useState([])
  const [FetchedVisitorDataToday, setFetchedVisitorDataToday] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const data1 = await getAllData(VisitorDetails);
      console.log(data1);
      const compname = data1.filter((item) => item.vcompName === username);
      const result = compname.map((val) => [
        val.vname,
        val.vcompName,
        val.vdate,
        val.vtime,
        val.vmobile,
      ]);
      setFetchedVisitorData(result); // no need for a callback function here
      const compdate = compname.filter((item) => item.vdate === todaytocheck);
      const resulttoday = compdate.map((val) => [
        val.vname,
        val.vcompName,
        val.vdate,
        val.vtime,
        val.vmobile,
      ]);
      setFetchedVisitorDataToday(resulttoday); // no need for a callback function here
    };
    fetchData();

    const user = sessionStorage.getItem('Username');
    setusername(user);
  }, [username, todaytocheck]);

  const carddata = [
    {
      id: 1,
      title: "Total No of Visitors",
      icon: <FaDoorOpen size={40} />,
      totalcount: FetchedVisitorData.length,
    },
    {
      id: 2,
      title: "Visitors today",
      icon: <IoToday size={40} />,
      totalcount: FetchedVisitorDataToday.length,
      date: todayFormatted,
    },
  ]
  const options = {
    legend: { position: "bottom" },
    pageSize: 10,
    showRowNumber: true,
  };

  // Exporting visitor data
  const pdfExportToday = useRef(null);
  const pdfExportAllVisitors = useRef(null);

  const exportPDFToday = () => {
    pdfExportToday.current.save(`Visitor_Data_${todayFormatted}.pdf`);
  };
  const exportPDFAllVisitors = () => {
    pdfExportAllVisitors.current.save(`Visitor_Data_All.pdf`);
  };

  return (
    <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-white dark:bg-gray-700 text-black dark:text-white">

      {/* Header */}
      <div className="fixed w-full flex items-center justify-between h-14 text-white z-10" >
        <div className="flex items-center justify-start md:justify-center w-14 md:w-64 h-14 bg-blue-800 dark:bg-gray-800 border-none">
          <span className="hidden md:block">Welcome {" "} {username}</span>
        </div>

      </div>
      {/* Sidebar */}
      <div className="fixed flex flex-col top-14 left-0 w-14 hover:w-64 md:w-64 bg-blue-900 dark:bg-gray-900 h-full text-white transition-all duration-300 border-none z-10 sidebar">
        <div className="overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow">
          <ul className="flex flex-col py-4 space-y-1">
            <li className="px-5 hidden md:block">
              <div className="flex flex-row items-center h-8">
                <div className="text-sm font-light tracking-wide text-gray-400 uppercase">Main</div>
              </div>
            </li>
            <li>
              <Button onClick={showdashboarddata} className={showdashboard ? 'relative flex flex-row items-center justify-start w-full h-11 focus:outline-none bg-blue-950  text-white-600 hover:text-white-800 border-l-4 border-transparent border-blue-500  pr-6' : 'relative flex flex-row items-center justify-start w-full h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6'}>
                <MdDashboard size={25} />
                <span className="ml-2 text-lg tracking-wide truncate">Dashboard</span>
              </Button>
            </li>

            <li>
              <Button onClick={showvisitordata} className={showvisitors ? 'relative flex flex-row items-center justify-start w-full h-11 focus:outline-none bg-blue-950  text-white-600 hover:text-white-800 border-l-4 border-transparent border-blue-500  pr-6' : 'relative flex flex-row items-center justify-start w-full h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6'}>
                <BsFilePersonFill size={25} />
                <span className="ml-2 text-lg tracking-wide truncate">All Visitors</span>
              </Button>
            </li>

            <li className="px-5 hidden md:block">
              <div className="flex flex-row items-center mt-5 h-8">
                <div className="text-sm font-light tracking-wide text-gray-400 uppercase">Settings</div>
              </div>
            </li>

            <li>
              <Button onClick={Logout} className='relative flex flex-row items-center justify-start w-full h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6'>
                <IoIosLogOut size={25} />
                <span className="ml-2 text-lg tracking-wide truncate">Logout</span>
              </Button>
            </li>

          </ul>

        </div>
      </div>
      {/* ./Sidebar */}
      {/* ./Header */}
      {showdashboard &&
        <main className="h-full ml-14 mt-14 mb-10 md:ml-64">
          <div className="mb-4 pb-10 px-8 mx-4 rounded-3xl bg-gray-100 border-4 border-blue-400 text-black">

            <div className="mt-8">
              <div className="flex items-center h-10 intro-y">
                <h2 className="mr-5 text-lg font-medium truncate">Dashboard</h2>
              </div>
              <div className='flex flex-col gap-10'>
                <div className="grid grid-cols-12 gap-6 mt-5">
                  {carddata.map((data) => (
                    <a key={data.id} className="transform  hover:scale-105 transition duration-300 shadow-xl rounded-3xl col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-white">
                      <div className="p-5 ml-2">
                        <div className="flex justify-between">
                          {data.icon}
                        </div>
                        <div className=" w-full flex-1">
                          <div>
                            <div className="mt-3 text-3xl font-bold leading-8">{data.totalcount}</div>
                            <div className="mt-1 text-base text-gray-600">{data.title}</div>
                            <div className="mt-1 text-base text-gray-600">{data.date}</div>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
                <div className='w-full space-y-5'>
                  <p className='text-lg font-semibold'>Visitor List for {todayFormatted}</p>
                  <div className='flex justify-between w-full'>
                    <PDFExport ref={pdfExportToday} paperSize="A4" repeatHeaders="true" margin="2cm" fileName={`Visitor_Data_${todayFormatted}`}>
                      <Chart
                        chartType="Table"
                        width="100%"
                        className='w-full'
                        data={[["Name", "Company Name", "Date", "Time", "Phone No"], ...FetchedVisitorDataToday]}
                        options={options}
                        formatters={formatters}
                      />
                    </PDFExport>
                    <button onClick={exportPDFToday} className="export-btn mr-10">
                      <span className="export-btn-text-one">Export</span>
                      <FaFilePdf className='absolute left-5 top-4' />
                      <FaFilePdf className='absolute right-5 top-4' />
                      <span className="export-btn-text-two">As PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </main>
      }

      {showvisitors &&
        <main className="h-full ml-14 mt-14 mb-10 md:ml-64">
          <div className="grid mb-4 pb-10 px-8 mx-4 rounded-3xl bg-gray-100 border-4 border-blue-400 text-black">

            <div className="w-full mt-8">
              <div className="flex items-center h-10 intro-y">
                <h2 className="mr-5 text-lg font-medium truncate">Visitors</h2>
              </div>
              <div className='flex justify-between items-end w-full'>
                <PDFExport ref={pdfExportAllVisitors} paperSize="A4" repeatHeaders="true" margin="2cm" fileName={`Visitor_Data_${username}`}>
                  <Chart
                    chartType="Table"
                    width="100%"
                    className='w-full'
                    data={[["Name", "Company Name", "Date", "Time", "Phone No"], ...FetchedVisitorData]}
                    options={options}
                    formatters={formatters}
                  />
                </PDFExport>
                <button onClick={exportPDFAllVisitors} className="export-btn mr-10">
                  <span className="export-btn-text-one">Export</span>
                  <FaFilePdf className='absolute left-5 top-4 ' />
                  <FaFilePdf className='absolute right-5 top-4 ' />
                  <span className="export-btn-text-two">As PDF</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      }

      {/* Modal */}
      <>
        <Button className='absolute bottom-10 right-10 font-bold bg-green-500 rounded-3xl text-white' onPress={onOpen}>Add New Visitor</Button>
        <Modal className='bg-white border-2 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]' backdrop={'blur'} isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Add Visitor</ModalHeader>
                <ModalBody>

                  <form autoComplete="off">
                    <div className="w-full flex flex-col gap-4">

                      {/* Name input */}
                      <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="email">Enter Name</Label>
                        <input
                          autoComplete='false'
                          type="text"
                          {...register("name", {
                            required: "Please Enter Visitor Name",
                            maxLength: {
                              value: 100,
                              message: "Name must be less than 100 characters",
                            },
                          })}
                        />
                        {errors.name &&
                          <span className='text-red-500 animate-pulse capitalize'>{errors.name.message}</span>
                        }
                      </div>




                      {/* Date input */}
                      <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="password">Enter Date</Label>
                        <input
                          autoComplete='false'
                          type="date"
                          max={today}
                          {...register('date', {
                            required: 'Date is required',
                            max: { today },
                          })}
                        />
                        {errors.date &&
                          <span className='text-red-500 animate-pulse capitalize'>{errors.date.message}</span>
                        }
                      </div>

                      {/* Time input */}
                      <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="password">Enter Time</Label>
                        <input
                          autoComplete='false'
                          type="time"
                          {...register('time', {
                            required: 'Time is required',
                          })}
                        />
                        {errors.time &&
                          <span className='text-red-500 animate-pulse capitalize'>{errors.time.message}</span>
                        }
                      </div>

                      {/* Mobile no input */}
                      <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="password">Enter Mobile number</Label>
                        <input
                          autoComplete='false'
                          type="tel"
                          {...register('mobile', {
                            required: 'Mobile number is required',
                            maxLength: {
                              message: "Invalid Mobile number",
                              value: 13
                            },
                            minLength: {
                              message: "Invalid Mobile number",
                              value: 10
                            },
                            pattern: {
                              value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                              message: "Invalid Mobile number",
                            }
                          })}
                        />
                        {errors.mobile &&
                          <span className='text-red-500 animate-pulse capitalize'>{errors.mobile.message}</span>
                        }
                      </div>

                    </div>
                    <Button type="submit" onClick={handleSubmit(onVisitorSubmit)} className="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2">Register</Button>
                  </form>

                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </div>
  )
}

export default Company