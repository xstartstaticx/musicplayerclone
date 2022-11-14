import React ,{useState,useRef,useEffect}from 'react';
import '../assets/css/card.css';
import playlist from '../assets/data';
import { timer } from '../utils/timer';

const Card = ({props :{musicNumber, setMusicNumber, setOpen}}) => {
    
    const [duration,setDuration] = useState(0);
    const [currentTime,setCurrentTime] = useState(0);
    const [play,setPlay] = useState(false);
    const [showVolume,setShowVolume] = useState(false);
    const [volume, setVolume] = useState(50);


    const audioRef = useRef()


    function handleLoadStart(e){
        const src = e.nativeEvent.srcElement.src;
        const audio = new Audio(src);
        audio.onloadedmetadata = function(){
            if(audio.readyState > 0){
                setDuration(audio.duration)
            }
        }
        if(play) {audioRef.current.play(false)};

        //console.log(e.nativeEvent.srcElement.src)
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
        setCurrentTime(currentTime)
        
        // console.log(currentTime)
    }

    function changeCurrentTime(e){
        const currentTime = Number(e.target.value);
        audioRef.current.currentTime = currentTime;
        setCurrentTime(currentTime)
        //console.log(e.target.value)
    }

    function handleNextPrev(n){
        setMusicNumber(value => {
            if(n > 0)
            return value + n > playlist.length -1 ? 0 : value + n;
            return value + n < 0 ? playlist.length -1 : value + n;
            
        })
    }

    useEffect(() =>{
        audioRef.current.volume = Number(volume) / 100;
    }, [volume])
 

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
            value={currentTime} onChange={e => changeCurrentTime(e)} />
            
        </div>

        <div className="timer">
            <span>{timer(currentTime)}</span>
            <span>{timer(duration)}</span>
        </div>

        {/* MENU */}

        <div className="controls">
            
            <i className="material-icons">repeat</i>
                
            <i className="material-icons"id="prev"
                  onClick={() => handleNextPrev(-1)}  
            >skip_previous</i>
            
                
                <div className="play" 
                    onClick={handlePlayingAudio}>
                  
                    <i className="material-icons">
                        {play ? 'pause' : 'play_arrow'} 
                    </i>                     
                </div>
                
            <i className="material-icons" id="next"
                 onClick={() => handleNextPrev(1)}  
            >skip_next</i>
            
            {/* Volume*/}
                <i className="material-icons" 
                onClick={() => setShowVolume(prev => !prev)}>{Number(volume) > 0 ? 'volume_up' : 'volume_off'}</i>


                    <div className={`volume ${showVolume ? 'show' : ''}`}> 
                        {/* NO CLUE WHY THIS IS NOT WORKING  */}
                        <i className="material-icons" >{Number(volume) === 0 ? 'volume_off ' : 'volume_up'}</i>  
                        
                        {/* BIG MISTAKE WATCHOUT */} 
                        
                        {/* <i className="material-icons" onClick={() => setVolume (v => Number(v) > 0 ? 0 : 100)} >
                            {Number(volume) > 0 ? 'volume_up' : 'volume_off'}
                        </i> */}
                        

                        <input type="range" min={0} max={100} value={volume}
                        onChange={e => setVolume(e.target.value)}/>
                        <span>{volume}</span>
                </div>
            
               
            
            <audio src={playlist[musicNumber].src}  ref={audioRef}
            onLoadStart={handleLoadStart} onTimeUpdate={handleTimeUpdate} />
        </div>
    </div>
  )
}

export default Card