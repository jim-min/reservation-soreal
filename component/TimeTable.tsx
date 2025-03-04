const TimeTable = () => {


    return (
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
                        <div className="absolute w-12 p-1 text-xs border-r border-gray-200 bg-gray-50 z-10 opacity-30">
                          {hour}:00
                        </div>
                        {tableData.find(data => data.reserved_day === item.date && data.reserved_time === hour) ? (
                          <div className="flex p-1 h-10 justify-center items-center text-sm bg-fuchsia-100 pl-8">
                            {tableData.find(data => data.reserved_day === item.date && data.reserved_time === hour)?.user_name}
                          </div>
                        ) : (
                          loggedIn ? (
                            <button
                              className="w-full h-10 text-sm hover:bg-blue-50 transition-colors pl-8 whitespace-nowrap"
                              onClick={() => handleReservation(item.date, hour)}
                            >
                              예약
                            </button>
                          ) : (
                            <div className="flex p-1 h-10 justify-center items-center text-sm text-gray-400 pl-8 whitespace-nowrap">
                              로그인
                            </div>
                          )
                        )}
                      </div>
                    );
                  })}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        );
} 
        
export default TimeTable;