import React, { useState, useEffect } from 'react';
import { LayoutGrid, List, Info, Building } from 'lucide-react';
import api from '../../services/api';

const AvailableRooms = () => {
  const [activeFloor, setActiveFloor] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  
  const floors = ['All', 'Ground', 1, 2, 3, 4, 5, 6];

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await api.getRooms();
      setRooms(data.map(r => ({
        no: String(r.roomNumber || '').trim(),
        type: String(r.type || '').trim(),
        floor: String(r.floor || 'Ground').trim(),
        bed: String(r.bedType || '').trim(),
        price: Number(r.price) || 0,
        status: String(r.status || 'Available').trim()
      })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
       <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-500 mb-4">
          <Info size={24} />
       </div>
       <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading Floor Data...</p>
    </div>
  );

  const currentRooms = activeFloor === 'All' 
    ? rooms 
    : rooms.filter(r => String(r.floor) === String(activeFloor));

  const floorStats = [
    { label: activeFloor === 'All' ? 'Total Portfolio' : 'Floor Total', value: currentRooms.length, color: 'text-gray-800', bg: 'bg-white border-gray-100' },
    { label: 'Available Now', value: currentRooms.filter(r => r.status === 'Available').length, color: 'text-green-600', bg: 'bg-[#E3F9E5] border-green-200' },
    { label: 'Occupied', value: currentRooms.filter(r => r.status === 'Occupied').length, color: 'text-red-600', bg: 'bg-[#FFE9E9] border-red-200' },
    { label: 'Reserved', value: currentRooms.filter(r => r.status === 'Reserved').length, color: 'text-yellow-600', bg: 'bg-[#FFF9E5] border-yellow-200' },
    { label: 'Dirty / Cleaning', value: currentRooms.filter(r => r.status === 'Cleaning').length, color: 'text-blue-600', bg: 'bg-[#E5F1FF] border-blue-200' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-50 text-green-600 border-green-200';
      case 'Occupied': return 'bg-red-50 text-red-600 border-red-200';
      case 'Reserved': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'Cleaning': return 'bg-blue-50 text-blue-600 border-blue-200';
      default: return 'bg-gray-50 text-gray-400';
    }
  };

  const getCardBg = (status) => {
    switch (status) {
      case 'Available': return 'bg-[#E3F9E5] border-green-200';
      case 'Occupied': return 'bg-[#FFE9E9] border-red-200';
      case 'Reserved': return 'bg-[#FFF9E5] border-yellow-200';
      case 'Cleaning': return 'bg-[#E5F1FF] border-blue-200';
      default: return 'bg-white border-gray-100';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Floor Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {floorStats.map((stat, i) => (
          <div key={i} className={`${stat.bg} border rounded-[24px] p-5 shadow-sm flex flex-col items-center justify-center transition-transform hover:-translate-y-1`}>
             <p className={`text-4xl font-black ${stat.color} tracking-tight`}>{stat.value}</p>
             <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mt-2 text-center">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* View Options & Floor Selection Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-2 rounded-[32px] border border-gray-100 shadow-sm">
         <div className="flex gap-2 overflow-x-auto no-scrollbar px-2">
            {floors.map(f => (
              <button 
                key={f}
                onClick={() => setActiveFloor(f)}
                className={`flex-shrink-0 px-6 py-3 rounded-[20px] text-[10px] font-black tracking-widest transition-all ${activeFloor === f ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {f === 'All' ? 'ALL FLOORS' : f === 'Ground' ? 'GROUND' : `FLOOR ${f}`}
              </button>
            ))}
         </div>

         {/* View Mode Toggle Switch (Green/White Scheme) */}
         <div className="flex bg-gray-50 p-1.5 rounded-[22px] border border-gray-100 mr-2">
            <button 
               onClick={() => setViewMode('grid')}
               className={`p-2.5 rounded-[18px] transition-all flex items-center gap-2 text-[10px] font-black tracking-widest ${viewMode === 'grid' ? 'bg-[#57BF8E] text-white shadow-lg shadow-green-200' : 'text-gray-400 hover:text-gray-600'}`}
            >
               <LayoutGrid size={15} /> GRID
            </button>
            <button 
               onClick={() => setViewMode('table')}
               className={`p-2.5 rounded-[18px] transition-all flex items-center gap-2 text-[10px] font-black tracking-widest ${viewMode === 'table' ? 'bg-[#57BF8E] text-white shadow-lg shadow-green-200' : 'text-gray-400 hover:text-gray-600'}`}
            >
               <List size={15} /> LIST
            </button>
         </div>
      </div>

      {/* Dynamic Content Display Mode */}
      {viewMode === 'grid' ? (
        /* GRID MODE */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-5">
           {currentRooms.map((room, i) => {
             const getRoomIcon = (type) => {
               if(type === 'Deluxe') return '⭐';
               if(type === 'Standard') return '🛏️';
               if(type === 'Suite') return '👑';
               if(type === 'Single') return '👤';
               if(type === 'Double') return '👥';
               return '🚪';
             };
             return (
             <div key={i} className={`aspect-square rounded-[32px] border-2 ${getCardBg(room.status)} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center justify-center p-5 relative overflow-hidden group`}>
                <div className="absolute top-4 left-5">
                   <div className={`w-2 h-2 rounded-full ring-4 ring-white shadow-sm ${room.status === 'Available' ? 'bg-green-500' : room.status === 'Occupied' ? 'bg-red-500' : room.status === 'Reserved' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                </div>
                <div className="absolute top-[-1px] right-[-1px] w-12 h-12 bg-white/40 flex items-center justify-center text-xl shadow-sm rounded-bl-[24px]">
                   {getRoomIcon(room.type)}
                </div>
                <p className="text-[8px] font-black tracking-widest opacity-30 uppercase mt-2">No</p>
                <h3 className="text-3xl font-black tracking-tight my-1 text-gray-800">{room.no}</h3>
                <div className="w-8 h-1 bg-black/5 rounded-full mb-3"></div>
                <div className="flex flex-col items-center gap-1">
                   <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest flex flex-row items-center gap-1">
                     {room.type}
                   </span>
                   <span className={`text-[8px] font-black px-2 py-0.5 rounded-lg bg-white/60 text-gray-600 border border-black/5`}>{room.status}</span>
                </div>
             </div>
           )})}
        </div>
      ) : (
        /* TABLE VIEW MODE */
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead>
                    <tr className="bg-gray-50/50">
                       <th className="text-left py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Room No</th>
                       <th className="text-left py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                       <th className="text-left py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Bed Type</th>
                       <th className="text-left py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                       <th className="text-left py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {currentRooms.map((room, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                         <td className="py-5 px-8">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg shadow-gray-900/10">
                                  {room.no}
                               </div>
                               <span className="text-sm font-black text-gray-800">Room {room.no}</span>
                            </div>
                         </td>
                         <td className="py-5 px-6">
                            <span className="text-[11px] font-black text-gray-500 uppercase bg-gray-100 px-3 py-1 rounded-lg">{room.type}</span>
                         </td>
                         <td className="py-5 px-6"><span className="text-xs font-bold text-gray-700">{room.bed}</span></td>
                         <td className="py-5 px-6 font-black text-primary-700">₹{room.price.toLocaleString()}</td>
                         <td className="py-5 px-8">
                            <span className={`px-4 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${getStatusBadge(room.status)}`}>
                               {room.status}
                            </span>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}
    </div>
  );
};

export default AvailableRooms;
