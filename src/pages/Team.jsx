import React from 'react'
import TeamContainer from '../components/TeamContainer.jsx'
import { useParams } from 'react-router-dom'

function Team() {
  const {id,season} = useParams()
  return (
    <div className="h-full">
      <TeamContainer id={Number(id)} season={Number(season)}/>
    </div>
  )
}

export default Team