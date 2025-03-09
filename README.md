# 소개

이 프로젝트는 [Next.js](https://nextjs.org)로 제작된 프로젝트입니다. 배포는 [Vercel](https://vercel.com), DB는 [Supabase](https://supabase.com/)를 이용하였습니다.

- Next.js
    
    TailwindCSS와 React, TypeScript를 활용한 간편한 앱 제작을 위하여 사용되었습니다.
    전역 상태 관리를 위하여 Zustand를 사용하였습니다.

- Versel

    Next.js를 배포하기 위해 사용되는 배포 도구입니다. 무료 호스팅을 위해 사용했습니다.
    
- Supabase

    지속적인 예약 정보 저장을 위해서는 데이터베이스가 필요하기 때문에 Supabase를 사용하였습니다. Firebase를 대체하여 사용되는 배포 도구입니다.

## 기능

금일부터 차주의 오늘의 요일에 해당하는 날까지 예약이 가능합니다. 예약한 본인(또는 관리자)만이 예약을 취소할 수 있습니다. 예약은 00시에 활성화됩니다. 
