import React, { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import Navbar from '../../components/navbar/navbar';
import Footer from '../../components/footer/footer.jsx';
import Chatbot from '../../components/chatbot/chatbot.jsx';
import './schedule.css'; // Importamos los estilos CSS

const Schedule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSpecialties, setFilteredSpecialties] = useState([]);
  const [doctorTerm, setDoctorTerm] = useState('');
  const [filteredDoctor, setFilteredDoctor] = useState([]);
  

  const specialties = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Pediatrics',
    'Psychiatry',
    'Radiology',
    'Surgery',
  ];

  const doctor = [
    'Hugo',
    'Vicente',
    'Kevin',
  ];

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value) {
      const filtered = specialties.filter((specialty) =>
        specialty.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSpecialties(filtered);
    } else {
      setFilteredSpecialties([]);
    }
  };

  const handleFocus = () => {
    setFilteredSpecialties(specialties);
  };
  const handleBlur = () => {
    setTimeout(() => {
      setFilteredSpecialties([]);
      setFilteredDoctor([]);
    }, 100);
  };

  const handleDoctor = (event) => {
    const value = event.target.value;
    setDoctorTerm(value);
    if (value) {
      const filtered = doctor.filter((doctor) =>
        doctor.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDoctor(filtered);
    } else {
      setFilteredDoctor([]);
    }
  };

  const handleFocusDoctor = () => {
    setFilteredDoctor(doctor);
  };

  return (
    <>
    <Navbar />

    <p>Reserva tu hora</p>


<div className="min-h-[90vh] flex flex-col items-center justify-center bg-gray-100">
<h1 className="text-center mb-6 tamanoTitulo"><FaCalendarAlt className='inline-block mr-2'/> Reserva tu hora</h1>
  <div className="bg-white p-10 rounded-lg shadow-lg">
    <div className="flex flex-wrap gap-5 items-center w-full max-md:max-w-full mb-10">
      <div className="flex flex-wrap flex-1 shrink gap-5 items-center self-stretch my-auto basis-0 min-w-[240px] max-md:max-w-full">
        <div className="flex relative flex-col justify-center self-stretch bg-gray-100 h-[70px] min-h-[70px] rounded-[16px] overflow-hidden w-[70px]">
          <div className="w-[100px] h-[100px] aspect-auto flex items-center justify-center">
            <svg
              fill="none"
              viewBox="0 0 100 100"
            >
                <image
              href="src/images/appointment/medicine.jpg"
              height="100"
              width="100"
  />

            </svg>
          </div>
        </div>
      </div>
    </div>
    <form action="">
    <div className="grid grid-cols-2 gap-6 mb-10">
      <div id="input" className="relative">
        <input
          type="text"
          id="floating_outlined"
          className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200 appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary- peer invalid:border-error-500 invalid:focus:border-error-500 overflow-ellipsis overflow-hidden text-nowrap pr-[48px]"
          placeholder="First name"

        />
        <label
          htmlFor="floating_outlined"
          className="peer-placeholder-shown:-z-10 peer-focus:z-10 absolute text-[14px] leading-[150%] text-primary peer-focus:text-primary peer-invalid:text-error-500 focus:invalid:text-error-500 duration-300 transform -translate-y-[1.2rem] scale-75 top-2 z-10 origin-[0] bg-white disabled:bg-gray-50-background- px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-[1.2rem] rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
        >
          First name
        </label>
      </div>

      <div id="input" className="relative">
        <input
          type="text"
          id="floating_outlined"
          className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200 appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary- peer invalid:border-error-500 invalid:focus:border-error-500 overflow-ellipsis overflow-hidden text-nowrap pr-[48px]"
          placeholder="Last name"

        />
        <label
          htmlFor="floating_outlined"
          className="peer-placeholder-shown:-z-10 peer-focus:z-10 absolute text-[14px] leading-[150%] text-primary peer-focus:text-primary peer-invalid:text-error-500 focus:invalid:text-error-500 duration-300 transform -translate-y-[1.2rem] scale-75 top-2 z-10 origin-[0] bg-white disabled:bg-gray-50-background- px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-[1.2rem] rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
        >
          Last name
        </label>
      </div>

      <div id="input" className="relative">
              <input
                type="search"
                id="floating_outlined"
                className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200 appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary- peer invalid:border-error-500 invalid:focus:border-error-500 overflow-ellipsis overflow-hidden text-nowrap pr-[48px]"
                placeholder="Especialidad"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <label
                htmlFor="floating_outlined"
                className="peer-placeholder-shown:-z-10 peer-focus:z-10 absolute text-[14px] leading-[150%] text-primary peer-focus:text-primary peer-invalid:text-error-500 focus:invalid:text-error-500 duration-300 transform -translate-y-[1.2rem] scale-75 top-2 z-10 origin-[0] bg-white disabled:bg-gray-50-background- px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-[1.2rem] rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Especialidad
              </label>
              {filteredSpecialties.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
                  {filteredSpecialties.map((specialty, index) => (
                    <li
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => {
                        setSearchTerm(specialty);
                        setFilteredSpecialties([]);
                      }}
                    >
                      {specialty}
                    </li>
                  ))}
                </ul>
              )}
            </div>

      <div id="input" className="relative">
        <input
          type="search"
          value={doctorTerm}
          id="floating_outlined"
          className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200 appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary- peer invalid:border-error-500 invalid:focus:border-error-500 overflow-ellipsis overflow-hidden text-nowrap pr-[48px]"
          placeholder="Doctor/a"
          onChange={handleDoctor}
          onFocus={handleFocusDoctor}
          onBlur={handleBlur}

        />
        <label
          htmlFor="floating_outlined"
          className="peer-placeholder-shown:-z-10 peer-focus:z-10 absolute text-[14px] leading-[150%] text-primary peer-focus:text-primary peer-invalid:text-error-500 focus:invalid:text-error-500 duration-300 transform -translate-y-[1.2rem] scale-75 top-2 z-10 origin-[0] bg-white disabled:bg-gray-50-background- px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-[1.2rem] rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
        >
          Doctor/a
        </label>
        {filteredDoctor.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
                  {filteredDoctor.map((doctor, index) => (
                    <li
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => {
                        setDoctorTerm(doctor);
                        setFilteredDoctor([]);
                      }}
                    >
                      {doctor}
                    </li>
                  ))}
                </ul>
              )}
      </div>

      <div id="input" className="relative">
        <input
          type="email"
          id="floating_outlined"
          className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200 appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary- peer invalid:border-error-500 invalid:focus:border-error-500 overflow-ellipsis overflow-hidden text-nowrap pr-[48px]"
          placeholder="E-mail"
        />
        <label
          htmlFor="floating_outlined"
          className="peer-placeholder-shown:-z-10 peer-focus:z-10 absolute text-[14px] leading-[150%] text-primary peer-focus:text-primary peer-invalid:text-error-500 focus:invalid:text-error-500 duration-300 transform -translate-y-[1.2rem] scale-75 top-2 z-10 origin-[0] bg-white disabled:bg-gray-50-background- px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-[1.2rem] rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
        >
          Mail
        </label>
      </div>

      <div id="input" className="relative">
        <input
          type="number"
          id="floating_outlined"
          className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200 appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary- peer invalid:border-error-500 invalid:focus:border-error-500 overflow-ellipsis overflow-hidden text-nowrap pr-[48px]"
          placeholder="Celular"
        />
        <label
          htmlFor="floating_outlined"
          className="peer-placeholder-shown:-z-10 peer-focus:z-10 absolute text-[14px] leading-[150%] text-primary peer-focus:text-primary peer-invalid:text-error-500 focus:invalid:text-error-500 duration-300 transform -translate-y-[1.2rem] scale-75 top-2 z-10 origin-[0] bg-white disabled:bg-gray-50-background- px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-[1.2rem] rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
        >
          Celular
        </label>
      </div>
    </div>

    <div className="sm:flex sm:flex-row-reverse flex gap-4">
      <button
        className="w-fit rounded-lg text-sm px-5 py-2 focus:outline-none h-[50px] border bg-violet-500 hover:bg-violet-600 focus:bg-violet-700 border-violet-500-violet- text-white focus:ring-4 focus:ring-violet-200 hover:ring-4 hover:ring-violet-100 transition-all duration-300"
        type="button"
      >
        <div className="flex gap-2 items-center">Reservar Hora</div>
      </button>
      <button
        className="w-fit rounded-lg text-sm px-5 py-2 focus:outline-none h-[50px] border bg-transparent border-primary text-primary focus:ring-4 focus:ring-gray-100"
        type="button"
      >
        Cancelar
      </button>
    </div>
    </form>
    
    
  </div>
</div>

<Footer />
<Chatbot />

</>
  );
};



export default Schedule;
