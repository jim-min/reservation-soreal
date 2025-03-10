// import { User } from "@supabase/auth-js";
import { supabase } from "../../utils/supabase";
import { PublicStore } from "../store/store";

const Login = () => {
    const { loggedIn, user, hoursReserving, setHoursReserving } = PublicStore();

    const signInWithKakao = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'kakao',
        });
        
        if (error) {
          console.error("Error signing in:", error);
        } else {
          console.log("Sign in successful:", data);
        }
      };
    
      async function signOut() {
        const { error } = await supabase.auth.signOut()
    
        if (error) {
          console.error("Error signing out:", error);
        }
        else {
          console.log("Sign out successful");
        }
      }

    return (
        <>
            {loggedIn ? (
                <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mb-14 mt-4 w-full">
                <span className="text-sm md:text-2xl font-medium whitespace-nowrap text-center">{user?.user_metadata?.name || '사용자'}님<br/>환영합니다</span>
                <button 
                    className="text-xs md:text-lg bg-yellow-300 font-bold py-2 px-4 rounded-xl whitespace-nowrap" 
                    type="button" 
                    style={{ fontFamily: 'Noto Sans KR' }}
                    onClick={() => signOut()}>
                    로그아웃
                </button>
                <div className="flex">
                    <div className={`text-xs md:text-lg ${hoursReserving === true ? 'bg-gray-300' : 'bg-green-300'} p-2 rounded-l-xl cursor-pointer whitespace-nowrap`} onClick={() => setHoursReserving(false)}>1시간</div>
                    <div className={`text-xs md:text-lg ${hoursReserving === true ? 'bg-green-300' : 'bg-gray-300'} p-2 rounded-r-xl cursor-pointer whitespace-nowrap`} onClick={() => setHoursReserving(true)}>2시간</div>
                </div>
                </div>
            ) : (
                <button 
                className="bg-yellow-300 font-bold py-2 px-4 mb-14 mt-4 rounded" 
                type="button" 
                style={{ fontFamily: 'Noto Sans KR' }}
                onClick={() => signInWithKakao()}>
                카카오로 로그인
                </button>
            )}
        </>
    )
}

export default Login;