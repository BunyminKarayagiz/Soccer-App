export const topLeagues_str =
  "39-140-78-61-135-253-203-94-91-235-145-106-2-307";

export async function getLiveMatchs(topLeagues_str) {
  const matches = [];
  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?live=${topLeagues_str}`,
      {
        method: "GET",
        headers: {
          "x-apisports-key": import.meta.env.VITE_APIKEY_APIFOOTBALL,
        },
      },
    );
    const data = await response.json();

    data.response.forEach((element) => {
      let veri = {
        fixture_id: element.fixture.id,
        country_name: element.league.country,
        elapsed: element.fixture.status.elapsed,
        home_team: {
          id: element.teams.home.id,
          name: element.teams.home.name,
          logo: element.teams.home.logo,
          goal: element.goals.home,
        },
        away_team: {
          id: element.teams.away.id,
          name: element.teams.away.name,
          logo: element.teams.away.logo,
          goal: element.goals.away,
        },
        league: {
          league_id: element.league.id,
          league_name: element.league.name,
          league_logo: element.league.logo,
        },
      };

      matches.push(veri);
    });

    const grouped = matches.reduce((acc, match) => {
      const leagueId = match.league.league_id;

      if (!acc[leagueId]) {
        acc[leagueId] = {
          league: match.league,
          matches: [],
        };
      }

      acc[leagueId].matches.push(match);
      return acc;
    }, {});
    console.log(grouped);
    return grouped;
  } catch (error) {
    console.log("Error while get leagues", error);
  }
}

export async function getLeaugueRanksAndInfo(league_id, search_season) {
  const teams = [];
  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/standings?league=${league_id}&season=${search_season}`,
      {
        method: "GET",
        headers: {
          "x-apisports-key": import.meta.env.VITE_APIKEY_APIFOOTBALL,
        },
      },
    );
    const data = await response.json();
    let leauge_data = {
      id: data.response[0].league.id,
      league_name: data.response[0].league.name,
      country: data.response[0].league.country,
      logo: data.response[0].league.logo,
      season: data.response[0].league.season,
    };
    data.response[0].league.standings[0].forEach((element) => {
      let veri = {
        teams: {
          id: element.team.id,
          rank: element.rank,
          name: element.team.name,
          logo: element.team.logo,
          points: element.points,
          goalsdiff: element.goalsDiff,
          form: element.form,
          played: element.all.played,
          win: element.all.win,
          draw: element.all.draw,
          lose: element.all.lose,
        },
      };
      teams.push(veri);
    });

    return [leauge_data, teams];
  } catch (error) {
    console.log("Lig Verisi Çekilemedi", error);
    return ["", ""];
  }
}

export async function getTopScoresData(league_id, search_season) {
  const topScoresPlayers = [];
  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/players/topscorers?league=${league_id}&season=${search_season}`,
      {
        method: "GET",
        headers: {
          "x-apisports-key": import.meta.env.VITE_APIKEY_APIFOOTBALL,
        },
      },
    );

    const data = await response.json();

    data.response.forEach((element) => {
      const stats = element.statistics[0]; // 🔥 KRİTİK NOKTA
      console.log(element);
      let veri = {
        player: {
          id: element.player.id,
          name: element.player.name,
          photo: element.player.photo,
          age: element.player.age,
        },
        team: {
          id: stats.team.id,
          name: stats.team.name,
          logo: stats.team.logo,
          season: stats.league.season,
        },
        stat: {
          appearances: stats.games.appearences, // api böyle yazıyor
          goals: stats.goals.total,
          rating: stats.games.rating,
          assists: stats.goals.assists,
        },
      };

      topScoresPlayers.push(veri);
    });

    return topScoresPlayers;
  } catch (error) {
    console.log("Lig Verisi Çekilemedi", error);
    return [];
  }
}

export async function getTeam(teamId) {
  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/teams?id=${teamId}`,
      {
        method: "GET",
        headers: {
          "x-apisports-key": import.meta.env.VITE_APIKEY_APIFOOTBALL,
        },
      },
    );
    const data = await response.json();

    let veri = {
      team: {
        id: data.response.team.id,
        name: data.response.team.name,
        logo: data.response.team.logo,
        country: data.response.team.country,
      },
      vanue: {
        id: data.response.vanue.country, // api böyle yazıyor
        name: data.response.vanue.country,
        image: data.response.vanue.country,
      },
    };

    return veri;
  } catch (error) {
    console.log("Lig Verisi Çekilemedi", error);
    return [];
  }
}

export async function getTeamCoach(teamId) {
  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/coachs?id=${teamId}`,
      {
        method: "GET",
        headers: {
          "x-apisports-key": import.meta.env.VITE_APIKEY_APIFOOTBALL,
        },
      },
    );
    const data = await response.json();

    let veri = {
      coach: {
        id: data.response.id,
        name: data.response.name,
        photo: data.response.photo,
      },
    };

    return veri;
  } catch (error) {
    console.log("Lig Verisi Çekilemedi", error);
    return [];
  }
}

export async function getFixtureByTeam(teamId, season) {
  const matches = [];
  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?status=FT&team=${teamId}&season=${season}`,
      {
        method: "GET",
        headers: {
          "x-apisports-key": import.meta.env.VITE_APIKEY_APIFOOTBALL,
        },
      },
    );
    const data = await response.json();

    data.response.forEach((element) => {
      let veri = {
        fixture: {
          id: element.fixture.id,
          referee: element.fixture.referee,
          date: element.fixture.date,
          timestamp: element.fixture.timestamp,
          vanue: element.venue.name,
        },
        home_team: {
          id: element.teams.home.id,
          name: element.teams.home.name,
          logo: element.teams.home.logo,
          goal: element.goals.home,
        },
        away_team: {
          id: element.teams.away.id,
          name: element.teams.away.name,
          logo: element.teams.away.logo,
          goal: element.goals.away,
        },
      };

      matches.push(veri);
    });

    return matches;
  } catch (error) {
    console.log("Error while get leagues", error);
  }
}

export async function getTeamPlayers(teamId) {
  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/players/squads?team=${teamId}`,
      {
        method: "GET",
        headers: {
          "x-apisports-key": import.meta.env.VITE_APIKEY_APIFOOTBALL,
        },
      },
    );
    const data = await response.json();

    const grouped = data.response.players.reduce((acc, player) => {
      const pos = player.position;

      if (!acc[pos]) acc[pos] = [];
      acc[pos].push(player);

      return acc;
    }, {});

    return grouped;
  } catch (error) {
    console.log("Lig Verisi Çekilemedi", error);
    return [];
  }
}

export async function getPlayer(playerId) {
  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/players/profiles?player=${playerId}`,
      {
        method: "GET",
        headers: {
          "x-apisports-key": import.meta.env.VITE_APIKEY_APIFOOTBALL,
        },
      },
    );
    const data = await response.json();

    let veri = {
      id: data.response.player.id,
      name: data.response.player.name,
      age: data.response.player.age,
      birth: data.response.player.birth.date,
      nationality: data.response.player.nationality,
      number: data.response.player.number,
      position: data.response.player.position,
      photo: data.response.player.photo,
    };

    return veri;
  } catch (error) {
    console.log("Lig Verisi Çekilemedi", error);
    return [];
  }
}

export async function getPlayerClubs(playerId) {
  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/players/teams?player=${playerId}`,
      {
        method: "GET",
        headers: {
          "x-apisports-key": import.meta.env.VITE_APIKEY_APIFOOTBALL,
        },
      },
    );

    const data = await response.json();

    const yearMap = {}; // 🔴 EKSİK OLAN BU

    data.response.forEach((club) => {
      club.seasons.forEach((year) => {
        if (!yearMap[year]) yearMap[year] = [];

        yearMap[year].push({
          id: club.team.id,
          name: club.team.name,
          logo: club.team.logo,
        });
      });
    });

    return yearMap;
  } catch (error) {
    console.log("Lig Verisi Çekilemedi", error);
    return [];
  }
}

export async function getPlayerStatistic(playerId, season) {
  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/players?id=${playerId}&season=${season}`,
      {
        method: "GET",
        headers: {
          "x-apisports-key": import.meta.env.VITE_APIKEY_APIFOOTBALL,
        },
      },
    );
    const data = await response.json();
    const statsArray = data.response[0].statistics;
    const seasonStats = statsArray.filter((s) => s.league.season === season);
    let veristat = {
      appearences: 0,
      lineups: 0,
      minutes: 0,
      goals: 0,
      assists: 0,
      shots: 0,
      passes: 0,
      keyPass: 0,
      yellow: 0,
      red: 0,
      fouls: 0,
      interceptions: 0,
      penaltyScored: 0,
      penaltyMiss: 0,
      penalty: 0,
    };
    let veri = {
      id: data.response[0].player.id,
      name: data.response[0].player.name,
      photo: data.response[0].player.photo,
      team: data.response[0].player.statistics[0].team.name,
      teamLogo: data.response[0].player.statistics[0].team.logo,
      season: season,
      rating: data.response[0].player.statistics[0].games.rating,
    };
    seasonStats.forEach((s) => {
      veristat.appearences += s.games.appearences || 0;
      veristat.lineups += s.games.lineups || 0;
      veristat.minutes += s.games.minutes || 0;

      veristat.goals += s.goals.total || 0;
      veristat.assists += s.goals.assists || 0;

      veristat.shots += s.shots.total || 0;

      veristat.passes += s.passes.total || 0;
      veristat.keyPass += s.passes.key || 0;

      veristat.yellow += s.cards.yellow || 0;
      veristat.red += s.cards.red || 0;

      veristat.fouls += s.fouls.committed || 0;
      veristat.interceptions += s.tackles.interceptions || 0;

      veristat.penaltyScored += s.penalty.scored || 0;
      veristat.penaltyMiss += s.penalty.missed || 0;
      veristat.penalty = `${veristat.penaltyScored}/${veristat.penaltyScored + veristat.penaltyMiss}`;
    });

    return [veristat, veri];
  } catch (error) {
    console.log("Lig Verisi Çekilemedi", error);
    return [];
  }
}

export async function getTopScores(leagueId, season) {
  const players = [];
  const url = `https://v3.football.api-sports.io/players/topscorers?season=${season}&league=${leagueId}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "x-apisports-key": import.meta.env.VITE_APIKEY_APIFOOTBALL,
      },
    });
    const data = await res.json();
    //console.log(data.response)
    data.response.forEach((player) => {
      let veri = {
        player: {
          id: player.player.id,
          name: player.player.name,
          age: player.player.age,
          photo: player.player.photo,
        },
        team: {
          id: player.statistics[0].team.id,
          name: player.statistics[0].team.name,
          logo: player.statistics[0].team.logo,
        },
        statistics: {
          appearences: player.statistics[0].games.appearences,
          goal: player.statistics[0].goals.total,
        },
      };

      players.push(veri);
    });
    return players;
  } catch (error) {
    console.log("Top Scores Verisi Alinamadi: ", error);
  }
}

export async function getTopAssists(leagueId, season) {
  const players = [];
  const url = `https://v3.football.api-sports.io/players/topassists?season=${season}&league=${leagueId}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "x-apisports-key": import.meta.env.VITE_APIKEY_APIFOOTBALL,
      },
    });
    const data = await res.json();
    //console.log(data.response)
    data.response.forEach((player) => {
      let veri = {
        player: {
          id: player.player.id,
          name: player.player.name,
          age: player.player.age,
          photo: player.player.photo,
        },
        team: {
          id: player.statistics[0].team.id,
          name: player.statistics[0].team.name,
          logo: player.statistics[0].team.logo,
        },
        statistics: {
          appearences: player.statistics[0].games.appearences,
          goal: player.statistics[0].goals.assists,
        },
      };
      players.push(veri);
    });
    return players;
  } catch (error) {
    console.log("Top Scores Verisi Alinamadi: ", error);
  }
}
