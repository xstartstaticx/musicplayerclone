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
    const [repeat, setRepeat] = useState('repeat');

/* Refs */


    const audioRef = useRef()


/* Functions / Handlers */


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

    function handleRepeat(){
        setRepeat(value => {
            switch(value){
                case 'repeat':
                    return 'repeat_one';
                case 'repeat_one':
                    return 'shuffle'
                default:
                    return 'repeat'
            }
        })
    }

    function EndedAudio(){
        switch(repeat){
            case 'repeat_one':
                return  audioRef.current.play();
            case 'shuffle':
                return handleShuffle();
            default:
                return handleNextPrev(1)
        }
    }


    function handleShuffle(){
        const num = randomNumber();
        setMusicNumber(num)
    }

    function randomNumber (){
        const number = Math.floor(Math.random()* (playlist.length -1));
        if(number === musicNumber)
        return randomNumber();
        
        return number;
    }
/* useEffects  */

    useEffect(() =>{
        audioRef.current.volume = Number(volume) / 100;
    }, [volume])
 


/* Card  */



  return (

    <div className="card">
        
        <div className="nav">

            <i className="material-icons">expand_more</i>

            <span>Now Playing {musicNumber + 1} / {playlist.length}</span>
            
            <i className="material-icons" 
                onClick={() => setOpen(prev => !prev) }>queue_music</i>

        </div>
        <div className="img">

            <img src={playlist[musicNumber].thumbnail} alt="" 
                className={`${play ? 'playing': ''}`}/>

        </div>

{/* Song Details / Infos */}

        <div className="details">

            <p className="title">{playlist[musicNumber].title}</p>
            <p className="artist">{playlist[musicNumber].artist}</p>

        </div>

        <div className="progress">

            <input 
            type="range" 
            min={0} 
            max={duration}
            value={currentTime} 
            onChange={e => changeCurrentTime(e)} />
            
        </div>

        <div className="timer">

            <span>{timer(currentTime)}</span>
            <span>{timer(duration)}</span>

        </div>

{/* MENU */}

        <div className="controls">
            
            <i className="material-icons" onClick={handleRepeat}
            >{repeat}</i>
                
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
                        

                        <input 
                        type="range" 
                        min={0} 
                        max={100} 
                        value={volume}
                        onChange={e => setVolume(e.target.value)}
                        className="volume-range"/>

                        <span>{volume}</span>
                </div>
            
               
            
            <audio 
            src={playlist[musicNumber].src}  
            ref={audioRef}
            onLoadStart={handleLoadStart} 
            onTimeUpdate={handleTimeUpdate} 
            onEnded={EndedAudio}/>

        </div>
    </div>
  )
}

export default Card