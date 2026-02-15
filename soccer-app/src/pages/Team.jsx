import React from 'react'
import TeamContainer from '../components/TeamContainer.jsx'
import { useParams } from 'react-router-dom'

function Team() {
  const {id,season} = useParams()
  return (
    <div className="grid grid-cols-12 grid-rows-6 gap-4 h-full">
      <div className="col-span-12 row-span-6">
        <TeamContainer id={Number(id)} season={Number(season)}/>
      </div>
    </div>
  )
}

export default Team