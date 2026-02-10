import React from 'react'
import MyLeagues from '../components/myLeagues'
import MyPlayers from '../components/MyPlayers'
import MyTeams from '../components/MyTeams'
import MyMatches from '../components/MyMatches'

function Favorites() {
  return (
    <div className='flex p-[120px] grid grid-cols-12 gap-4'>
        <div className='col-span-3'>
            <MyLeagues />
        </div>
        <div className='col-span-3'>
            <MyPlayers />
        </div>
        <div className='col-span-3'>
            <MyTeams />
        </div>
        <div className='col-span-3'>
            <MyMatches />
        </div>
    </div>
  )
}

export default Favorites