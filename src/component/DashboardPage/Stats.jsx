
import { FaCreditCard, FaUsers } from "react-icons/fa";
import { IoCardOutline } from "react-icons/io5";




const Stats = ({summary}) => {

  console.log("summary------->",summary); 
    return (
        <div className="grid grid-cols-3 gap-5 mb-2">
            <div className=" text-white bg-[#FFFFFF] shadow-2xl px-16 rounded-xl flex gap-3 justify-center items-center py-5">
               <div >
   
               <FaUsers className="text-[#ffffff] bg-[#1B2D51] text-3xl rounded-full p-2" size={50}/>
               </div>
              <div>
                  <p className="font-title text-[#0F0B18] text-xl pb-2 ">Total Owner</p>
                <p className="font-title  text-xl text-[#0F0B18]  pt-2">{summary?.totalOwners}</p>
              </div>
            </div>
            <div className=" text-white bg-[#FFFFFF] shadow-2xl px-16 rounded-xl flex gap-3 justify-center items-center py-5">
               <div >
           
               <FaUsers className="text-[#ffffff] bg-[#1B2D51] text-3xl rounded-full p-2" size={50}/>
               </div>
              <div>
                  <p className="font-title text-[#0F0B18] text-xl pb-2 ">Total Service Provider</p>
                <p className="font-title  text-xl text-[#0F0B18]  pt-2">{summary?.totalProviders}</p>
              </div>
            </div>
            <div className=" text-white bg-[#FFFFFF] shadow-2xl px-16 rounded-xl flex gap-3 justify-center items-center py-5">
               <div >
 
               <IoCardOutline className="text-[#ffffff] bg-[#1B2D51] text-3xl rounded-full p-2" size={50}/>
               </div>
              <div>
                  <p className="font-title text-[#0F0B18] text-xl pb-2 ">Total Earnings</p>
                <p className="font-title  text-xl text-[#0F0B18]  pt-2">${summary?.totalAdminEarnings}</p>
              </div>
            </div>
    
      
           
    
        </div>
    );
};

export default Stats;