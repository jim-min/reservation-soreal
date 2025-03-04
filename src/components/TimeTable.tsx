import { PublicStore } from "@/app/page";
import { supabase } from "../../utils/supabase";
import { useState } from "react";
import InfoModal from "@/components/InfoModal";
import Vacant from "@/components/Vacant";

const TimeTable = () => {
    const { tableData, loggedIn, user, hoursReserving } = PublicStore();
    const [ openInfo, setOpenInfo ] = useState<Boolean>(false);
    const [ selectedReservation, setSelectedReservation ] = useState<{ 
        name : string, 
        user_uid : string,
        day : string,
        time : number
     } | null>(null);

    const handleReservation = async (day : string, time : number) => {
        const { error } = await supabase.from('test').insert({ 
            reserved_day: day, 
            reserved_time: time, 
            user_name: user?.user_metadata?.name || '익명',
            user_uid: user?.id
        });

        // 2시간 (hoursReserving) 켜져 있으면 밑에 시간까지 한 번에 예약됨
        if (hoursReserving && time !== 22) {
            const { error } = await supabase.from('test').insert({
                reserved_day: day,
                reserved_time: time + 1,
                user_name: user?.user_metadata?.name || '익명',
                user_uid: user?.id
            })
            if (error) {
                console.error('Error inserting data:', error);
            }
            else {
                console.log('Data inserted successfully');
            }
        }
        if (error) {
            console.error('Error inserting data:', error);
        }
        else {
            console.log('Data inserted successfully');
        }
    };

    const getCurrentWeekDates = () => {
        const today = new Date();
        const day = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
        const dates = [];
        
        // 일요일을 기준으로 잡기 위해 일요일 찾음
        const sunday = new Date(today);
        sunday.setDate(today.getDate() - day);
        
        // 날짜 포맷팅
        for (let i = 0; i < 7; i++) {
            const date = new Date(sunday);
            date.setDate(sunday.getDate() + i);
            const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
            const dayName = ['일', '월', '화', '수', '목', '금', '토'][i];
            dates.push({ date: formattedDate, day: dayName });
        }
        
        return dates;
    };

    const weekDates = getCurrentWeekDates();

    return (
        <>
            {openInfo && selectedReservation && (
                <InfoModal reserver={selectedReservation} setOpenInfo={setOpenInfo} />
            )}
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                <tr>
                    {weekDates.map((item) => (
                    <th key={item.day} className="flex-1 border border-gray-300 p-2 text-xs sm:text-sm md:text-xl">
                        <div>{item.date}</div>
                        <div>{'(' + item.day + ')'}</div>
                    </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                <tr>
                    {weekDates.map((item) => (
                    <td key={item.date} className="border border-gray-300 p-0">
                        {Array.from({ length: 12 }).map((_, hourIndex) => {
                        let hour = 11 + hourIndex; // 11:00부터 시작

                        return (
                            <div key={hourIndex} className="flex-1 border-b border-gray-200 last:border-b-0">
                            <div className="absolute w-12 p-1 text-xs border-r border-gray-200 bg-gray-50 z-10 opacity-30 pointer-events-none">
                                {hour}:00
                            </div>
                            {/* // 예약된 시간대이면 표시될 거 */}
                            {tableData.find(data => data.reserved_day === item.date && data.reserved_time === hour) ? (
                                <div 
                                    className="flex p-1 h-10 pt-2 justify-center items-center text-[0px] xl:text-sm bg-fuchsia-100 cursor-pointer"
                                    onClick={() => {
                                        const reservation = tableData.find(data => data.reserved_day === item.date && data.reserved_time === hour);
                                        setSelectedReservation({
                                            name: reservation?.user_name || '',
                                            user_uid: reservation?.user_uid || '',
                                            day: item.date,
                                            time: hour
                                        });
                                        setOpenInfo(true);
                                    }}
                                >
                                    {tableData.find(data => data.reserved_day === item.date && data.reserved_time === hour)?.user_name}
                                </div>
                            ) : ( // 예약 안 된 시간대에 표시될 거
                                <Vacant 
                                    loggedIn={loggedIn}
                                    onReservation={() => handleReservation(item.date, hour)}
                                />
                            )}
                            </div>
                        );
                        })}
                    </td>
                    ))}
                </tr>
                </tbody>
            </table>
        </>
        
        
    );
} 
        
export default TimeTable;