import React ,{useState,useRef}from 'react';
import '../assets/css/card.css';
import playlist from '../assets/data';
import { timer } from '../utils/timer';



const Card = ({props :{musicNumber, setMusicNumber, setOpen}}) => {
    
    const [duration,setDuration] = useState(0);
    const [currentTime,setcurrentTime] = useState(0);
    const [play,setPlay] = useState(false);

const audioRef = useRef()

    function handleLoadStart(e){
        const src = e.nativeEvent.srcElement.src;
        const audio = new Audio(src);
        audio.onloadeddata = function(){
            if(audio.readyState > 0){
                setDuration(audio.duration)
            }
        }
        console.log(e.nativeEvent.srcElement.src)
    }

    function handlePlayingAudio(){
        if(play){
            audioRef.current.pause();
            setPlay(false)
        }else{
            audioRef.current.play();
            setPlay(true)
        }
    }

    function handleTimeUpdate () {
        const currentTime = audioRef.current.currentTime;
        setcurrentTime(currentTime)
        
        // console.log(currentTime)
    }
    function changeCurrentTime(e){
        const currentTime = Number(e.target.value);
        audioRef.current.currentTime = currentTime;
        setcurrentTime(currentTime)
        //console.log(e.target.value)
    }

  return (
    <div className="card">
        
        <div className="nav">
            <i className="material-icons">expand_more</i>
            <span>Now Playing {musicNumber + 1} / {playlist.length}</span>
            <i className="material-icons" 
                onClick={() => setOpen(prev => !prev) }>queue_music</i>
        </div>
    <div className="img">
          <img src={playlist[musicNumber].thumbnail} alt="" />
    </div>
      

        <div className="details">
            <p className="title">{playlist[musicNumber].title}</p>
            <p className="artist">{playlist[musicNumber].artist}</p>
        </div>

        <div className="progress">
            <input type="range" min={0} max={duration}
            value={currentTime} onChange={e => changeCurrentTime} />
        </div>
        <div className="timer">
            <span>{timer(currentTime)}</span>
            <span>{timer(duration)}</span>
        </div>

        {/* MENU */}

        <div className="controls">
            
            <i className="material-icons">repeat</i>
                
            <i className="material-icons"id="prev">skip_previous</i>
            
                
                <div className="play" 
                    onClick={handlePlayingAudio}>
                    
                    <i className="material-icons">
                        {play ? 'pause' : 'play_arrow'}
                    </i>
                     
                </div>
                
                <i className="material-icons" id="next">skip_next</i>
            
            {/* Volume*/}
                <i className="material-icons" >volume_up</i>
                    <div className="volume"> {/* class volume & show*/}
                        <i className="material-icons" >volume_up</i>
                        <input type="range" min={0} max={100} />
                        <span>50</span>
                </div>
            
               
            
            <audio src={playlist[musicNumber].src} hidden ref={audioRef}
            onLoadStart={handleLoadStart} onTimeUpdate={handleTimeUpdate} />
        </div>
    </div>
  )
}

export default Card