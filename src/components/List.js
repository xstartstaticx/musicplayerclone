import React ,{useState,useEffect}from 'react';
import playlist from '../assets/data';
import '../assets/css/list.css'
import { timer } from '../utils/timer';


const List = ({props:{open,setOpen,musicNumber,setMusicNumber}}) => {
  return (
    <div className={`list ${open ? 'show' : ''}`}>
        <div className="header">
            <div>
                <i className="material-icons">queue_music</i>
                <span>Playlist</span>
            </div>
            <i className="material-icons" onClick={() => setOpen(false)}>close</i>
        </div>
        <ul>
            {
                playlist.map((music,index)=>(
                    <li 
                        onClick={() => setMusicNumber(index)}
                        key={music.id} 
                        className={`${musicNumber === index ? 'playing' : ''}`}>
                        <div className="row">
                            <span>{music.title}</span>
                            <p>{music.artist}</p>
                            <Duration music={music}/>
                        </div>
                        
                    </li>
                ))
            }
        </ul>
    </div>
  )
}

export default List

const Duration = ({music}) => {
    const [duration, setDuration] = useState(0);
    useEffect(() =>{
        const audio = new Audio(music.src)
        audio.onloadedmetadata = function(){
            if(audio.readyState > 0){
                setDuration(audio.duration)
            }
        }
    },[music])
    return(
        <span className="duration">{timer(duration)}</span>
    )
}