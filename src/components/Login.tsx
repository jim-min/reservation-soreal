import { supabase } from "../../utils/supabase";
import { PublicStore } from "../store/store";

const Login = () => {
    const { loggedIn, user, hoursReserving, setHoursReserving } = PublicStore();

    const signInWithKakao = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'kakao',
          options: {
            redirectTo: window.location.origin,
          }
        });
        
        if (error) {
          console.error("Error signing in:", error);
        } else {
          console.log("Sign in successful:", data);
        }
      };
    
      // users에 없으면 users table에 유저 추가하는 로직
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { user } = session;
          
          // users에 있느냐
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('uid', user.id)
            .single();
          
          if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows returned
            console.error('Error checking if user exists:', fetchError);
            return;
          }
          
          // 없을 때
          if (!existingUser) {
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                uid: user.id,
                user_name: user.user_metadata.name || '사용자',
              });
            
            if (insertError) {
              console.error('Error creating user record:', insertError);
            } else {
              console.log('User record created successfully');
            }
          }
        }
      });
    
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