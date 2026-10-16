import Matches from "../components/Matches.jsx";
import LeagueInfo from "../components/LeagueInfo.jsx";
import TopScores from "../components/TopScores.jsx";

// Ana sayfa düzeni
// - Mobil/tablet: kartlar alt alta, her kart kendi içinde kaydırılır (sabit yükseklik).
// - Geniş ekran (lg+): solda maçlar (4 sütun), sağda puan durumu ve gol krallığı (8 sütun).
//   Sol kart ekranda sabit kalır (sticky) ve ekran yüksekliğine uyar.
function Home() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      <div className="h-[34rem] lg:sticky lg:top-24 lg:col-span-4 lg:h-[calc(100dvh-8rem)]">
        <Matches />
      </div>

      <div className="flex flex-col gap-5 lg:col-span-8">
        <div className="h-[34rem] lg:h-[30rem]">
          <LeagueInfo syncUrl={false} />
        </div>
        <div className="h-[30rem] lg:h-[26rem]">
          <TopScores />
        </div>
      </div>
    </div>
  );
}

export default Home;
